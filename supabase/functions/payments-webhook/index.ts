// Webhook is the payment authority. Price is re-read from appointments, never from the client.
// deno-lint-ignore-file no-explicit-any

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if (!serviceKey) return json({ error: 'misconfigured' }, 500);

  const raw = await req.text();
  const providerName = (Deno.env.get('PAYMENT_PROVIDER') ?? 'demo').toLowerCase();

  let event: {
    eventId: string;
    provider: string;
    type: string;
    providerRef: string;
    status: string;
    amountCents?: number;
    payload: Record<string, unknown>;
  };

  try {
    if (providerName === 'mercadopago') {
      const secret = Deno.env.get('MERCADOPAGO_WEBHOOK_SECRET') ?? '';
      const signature = req.headers.get('x-signature') ?? '';
      if (secret && (!signature || !timingSafeEqual(signature, secret))) {
        return json({ error: 'invalid_signature' }, 401);
      }
      const payload = JSON.parse(raw);
      event = {
        eventId: String(payload.id ?? payload.data?.id ?? crypto.randomUUID()),
        provider: 'mercadopago',
        type: payload.action ?? payload.type ?? 'payment',
        providerRef: String(payload.data?.id ?? payload.id),
        status: payload.data?.status ?? 'pending',
        amountCents: payload.data?.amount_cents,
        payload,
      };
    } else {
      const payload = JSON.parse(raw);
      event = {
        eventId: String(payload.id ?? payload.data?.id ?? crypto.randomUUID()),
        provider: 'demo',
        type: payload.type ?? 'payment.updated',
        providerRef: String(payload.data?.id ?? payload.id),
        status: payload.data?.status ?? 'paid',
        amountCents: payload.data?.amount_cents,
        payload,
      };
    }
  } catch {
    return json({ error: 'invalid_payload' }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const { data: existing } = await supabase
    .from('payment_events')
    .select('id')
    .eq('provider', event.provider)
    .eq('provider_event_id', event.eventId)
    .maybeSingle();

  if (existing) {
    return json({ ok: true, duplicate: true });
  }

  const appointmentId = String(
    (event.payload as any).appointmentId ??
      (event.payload as any).external_reference ??
      (event.payload as any).data?.appointment_id ??
      '',
  );

  if (!appointmentId) return json({ error: 'missing_appointment' }, 400);

  const { data: appointment, error: appointmentError } = await supabase
    .from('appointments')
    .select('id, price_cents, status')
    .eq('id', appointmentId)
    .maybeSingle();

  if (appointmentError || !appointment) return json({ error: 'appointment_not_found' }, 404);

  if (event.amountCents != null && event.amountCents !== appointment.price_cents) {
    await supabase.from('audit_logs').insert({
      action: 'payment.price_mismatch',
      entity: 'appointments',
      entity_id: appointment.id,
      metadata: { expected: appointment.price_cents, received: event.amountCents, eventId: event.eventId },
    });
    return json({ error: 'price_mismatch' }, 409);
  }

  const { data: payment } = await supabase
    .from('payments')
    .upsert(
      {
        appointment_id: appointment.id,
        provider: event.provider,
        provider_ref: event.providerRef,
        status: event.status,
        amount_cents: appointment.price_cents,
        metadata: event.payload,
      },
      { onConflict: 'provider,provider_ref' },
    )
    .select()
    .maybeSingle();

  await supabase.from('payment_events').insert({
    payment_id: payment?.id ?? null,
    provider: event.provider,
    provider_event_id: event.eventId,
    event_type: event.type,
    payload: event.payload,
  });

  if (event.status === 'paid' && appointment.status === 'pending') {
    await supabase.from('appointments').update({ status: 'confirmed' }).eq('id', appointment.id);
  }

  return json({ ok: true, duplicate: false });
});
