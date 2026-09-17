// Webhook is the payment authority.
// Mercado Pago: official x-signature HMAC + GET /v1/payments/{id}.
// Persistence: apply_payment_event() is transactional and idempotent.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  resolveMercadoPagoNotificationDataId,
  verifyMercadoPagoSignature,
  type MercadoPagoNotificationPayload,
} from '../../../src/lib/payments/mp-signature.ts';

const MP_API = 'https://api.mercadopago.com';
const MAX_WEBHOOK_BYTES = 256 * 1024;
const MP_LOOKUP_TIMEOUT_MS = 10_000;

function json(body: unknown, status = 200, requestId?: string) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  if (requestId) headers.set('X-Request-Id', requestId);
  return new Response(JSON.stringify(body), { status, headers });
}

function logWebhook(level: 'info' | 'warn' | 'error', event: string, requestId: string, extra: Record<string, unknown> = {}) {
  const record = JSON.stringify({
    scope: 'payments-webhook',
    level,
    event,
    requestId,
    ...extra,
  });
  if (level === 'error') console.error(record);
  else if (level === 'warn') console.warn(record);
  else console.info(record);
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
  const requestId = crypto.randomUUID();

  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, requestId);

  const contentType = (req.headers.get('content-type') ?? '').toLowerCase();
  if (!contentType.includes('application/json')) {
    logWebhook('warn', 'unsupported_media_type', requestId);
    return json({ error: 'unsupported_media_type' }, 415, requestId);
  }

  const declaredLength = Number(req.headers.get('content-length') ?? '0');
  if (Number.isFinite(declaredLength) && declaredLength > MAX_WEBHOOK_BYTES) {
    logWebhook('warn', 'payload_too_large', requestId, { declaredLength });
    return json({ error: 'payload_too_large' }, 413, requestId);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if (!supabaseUrl || !serviceKey) {
    logWebhook('error', 'server_misconfigured', requestId);
    return json({ error: 'misconfigured' }, 500, requestId);
  }

  const raw = await req.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_WEBHOOK_BYTES) {
    logWebhook('warn', 'payload_too_large', requestId);
    return json({ error: 'payload_too_large' }, 413, requestId);
  }

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
      if (!secret || !accessToken) {
        logWebhook('error', 'provider_misconfigured', requestId, { provider: 'mercadopago' });
        return json({ error: 'misconfigured' }, 500, requestId);
      }

      const payload = JSON.parse(raw) as MercadoPagoNotificationPayload & {
        id?: string | number;
        type?: string;
        action?: string;
      };
      // Mercado Pago signs data.id from the notification URL. If the body also
      // contains it, the shared resolver rejects a mismatch before HMAC.
      const paymentId = resolveMercadoPagoNotificationDataId(payload, req.url);

      const valid = await verifyMercadoPagoSignature({
        secret,
        signatureHeader: req.headers.get('x-signature'),
        requestId: req.headers.get('x-request-id'),
        dataId: paymentId,
      });
      if (!valid) {
        logWebhook('warn', 'invalid_signature', requestId, { provider: 'mercadopago' });
        return json({ error: 'invalid_signature' }, 401, requestId);
      }

      // The signed notification identifies a payment only. Mercado Pago's GET
      // response remains authoritative for its status, amount, and reference.
      let paymentRes: Response;
      try {
        paymentRes = await fetch(`${MP_API}/v1/payments/${encodeURIComponent(paymentId)}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: AbortSignal.timeout(MP_LOOKUP_TIMEOUT_MS),
        });
      } catch {
        logWebhook('error', 'payment_lookup_network_error', requestId, { provider: 'mercadopago' });
        return json({ error: 'webhook_payment_lookup_failed' }, 502, requestId);
      }

      if (!paymentRes.ok) {
        logWebhook('error', 'payment_lookup_http_error', requestId, {
          provider: 'mercadopago',
          status: paymentRes.status,
        });
        return json({ error: 'webhook_payment_lookup_failed' }, 502, requestId);
      }

      const payment = await paymentRes.json() as {
        id: string | number;
        status: string;
        transaction_amount: number;
        external_reference?: string;
      };
      if (String(payment.id) !== paymentId) {
        logWebhook('error', 'payment_lookup_mismatch', requestId, { provider: 'mercadopago' });
        return json({ error: 'webhook_payment_lookup_mismatch' }, 502, requestId);
      }
      if (!payment.external_reference) return json({ error: 'missing_appointment' }, 400, requestId);

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
      if (!appointmentId) return json({ error: 'missing_appointment' }, 400, requestId);
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
  } catch (error) {
    if (error instanceof Error && error.message === 'webhook_payment_id_mismatch') {
      return json({ error: 'webhook_payment_id_mismatch' }, 400, requestId);
    }
    if (error instanceof Error && error.message === 'webhook_missing_payment_id') {
      return json({ error: 'webhook_missing_payment_id' }, 400, requestId);
    }
    logWebhook('warn', 'invalid_payload', requestId);
    return json({ error: 'invalid_payload' }, 400, requestId);
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
    if (message.includes('price_mismatch')) return json({ error: 'price_mismatch' }, 409, requestId);
    if (message.includes('appointment_not_found')) return json({ error: 'appointment_not_found' }, 404, requestId);

    logWebhook('error', 'apply_failed', requestId, {
      provider: event.provider,
      code: error.code ?? 'unknown',
    });
    return json({ error: 'apply_failed', request_id: requestId }, 500, requestId);
  }

  logWebhook('info', 'applied', requestId, {
    provider: event.provider,
    type: event.type,
  });
  return json(data ?? { ok: true }, 200, requestId);
});
