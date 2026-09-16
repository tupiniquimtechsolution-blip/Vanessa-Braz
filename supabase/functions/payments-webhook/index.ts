// Webhook is the payment authority.
// Mercado Pago: official x-signature HMAC + GET /v1/payments/{id}.
// Persistence: apply_payment_event() is transactional and idempotent.
// Keep signature algorithm in sync with src/lib/payments/mp-signature.ts.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const MP_API = 'https://api.mercadopago.com';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

function parseSignature(header: string | null): { ts: string; v1: string } | null {
  if (!header) return null;
  const parts: Record<string, string> = {};
  for (const chunk of header.split(',')) {
    const [key, value] = chunk.trim().split('=');
    if (key && value) parts[key] = value;
  }
  if (!parts.ts || !parts.v1) return null;
  return { ts: parts.ts, v1: parts.v1 };
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function verifyMercadoPagoSignature(args: {
  secret: string;
  signatureHeader: string | null;
  requestId: string | null;
  dataId: string;
}): Promise<boolean> {
  const parsed = parseSignature(args.signatureHeader);
  if (!parsed || !args.secret || !args.requestId) return false;
  const manifest = `id:${args.dataId};request-id:${args.requestId};ts:${parsed.ts};`;
  const expected = await hmacSha256Hex(args.secret, manifest);
  return timingSafeEqual(expected, parsed.v1);
}

const STATUS_MAP: Record<string, string> = {
  pending: 'pending',
  in_process: 'pending',
  authorized: 'authorized',
  approved: 'paid',
  rejected: 'failed',
  cancelled: 'cancelled',
  refunded: 'refunded',
  charged_back: 'refunded',
};

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
    amountCents: number;
    appointmentId: string;
    payload: Record<string, unknown>;
  };

  try {
    if (providerName === 'mercadopago') {
      const secret = Deno.env.get('MERCADOPAGO_WEBHOOK_SECRET') ?? '';
      const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN') ?? '';
      if (!secret || !accessToken) return json({ error: 'misconfigured' }, 500);

      const payload = JSON.parse(raw) as { id?: string | number; type?: string; action?: string; data?: { id?: string } };
      const paymentId = payload.data?.id;
      if (!paymentId) return json({ error: 'webhook_missing_payment_id' }, 400);

      const valid = await verifyMercadoPagoSignature({
        secret,
        signatureHeader: req.headers.get('x-signature'),
        requestId: req.headers.get('x-request-id'),
        dataId: paymentId,
      });
      if (!valid) return json({ error: 'invalid_signature' }, 401);

      const paymentRes = await fetch(`${MP_API}/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!paymentRes.ok) return json({ error: 'webhook_payment_lookup_failed' }, 502);
      const payment = await paymentRes.json() as {
        id: number;
        status: string;
        transaction_amount: number;
        external_reference?: string;
      };
      if (!payment.external_reference) return json({ error: 'missing_appointment' }, 400);

      event = {
        eventId: String(payload.id ?? `mp:${payment.id}:${payload.action ?? payload.type ?? 'payment'}`),
        provider: 'mercadopago',
        type: payload.action ?? payload.type ?? 'payment',
        providerRef: String(payment.id),
        status: STATUS_MAP[payment.status] ?? 'pending',
        amountCents: Math.round(Number(payment.transaction_amount) * 100),
        appointmentId: String(payment.external_reference),
        payload: { ...payload, payment },
      };
    } else {
      const payload = JSON.parse(raw) as {
        id?: string;
        type?: string;
        data?: { id?: string; status?: string; amount_cents?: number; appointment_id?: string };
        appointmentId?: string;
      };
      const appointmentId = payload.appointmentId ?? payload.data?.appointment_id ?? '';
      if (!appointmentId) return json({ error: 'missing_appointment' }, 400);
      event = {
        eventId: String(payload.id ?? payload.data?.id ?? crypto.randomUUID()),
        provider: 'demo',
        type: payload.type ?? 'payment.updated',
        providerRef: String(payload.data?.id ?? payload.id ?? ''),
        status: payload.data?.status ?? 'paid',
        amountCents: Number(payload.data?.amount_cents ?? 0),
        appointmentId,
        payload,
      };
    }
  } catch {
    return json({ error: 'invalid_payload' }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const { data, error } = await supabase.rpc('apply_payment_event', {
    p_provider: event.provider,
    p_event_id: event.eventId,
    p_event_type: event.type,
    p_provider_ref: event.providerRef,
    p_appointment_id: event.appointmentId,
    p_status: event.status,
    p_amount_cents: event.amountCents,
    p_payload: event.payload,
  });

  if (error) {
    const message = error.message || '';
    if (message.includes('price_mismatch')) return json({ error: 'price_mismatch' }, 409);
    if (message.includes('appointment_not_found')) return json({ error: 'appointment_not_found' }, 404);
    return json({ error: 'apply_failed', detail: message }, 500);
  }

  return json(data ?? { ok: true });
});
