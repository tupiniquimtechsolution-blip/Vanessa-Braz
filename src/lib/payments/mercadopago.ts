import type { CreatePaymentInput, PaymentIntent, PaymentProvider, WebhookEvent } from './provider';

const SANDBOX_API = 'https://api.mercadopago.com';

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export class MercadoPagoProvider implements PaymentProvider {
  readonly name = 'mercadopago';

  constructor(
    private readonly accessToken: string,
    private readonly webhookSecret?: string,
  ) {
    if (!accessToken) throw new Error('MERCADOPAGO_ACCESS_TOKEN is required');
  }

  async createPayment(input: CreatePaymentInput): Promise<PaymentIntent> {
    const response = await fetch(`${SANDBOX_API}/checkout/preferences`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        external_reference: input.appointmentId,
        notification_url: input.notificationUrl,
        items: [
          {
            title: input.description,
            quantity: 1,
            currency_id: 'BRL',
            unit_price: input.amountCents / 100,
          },
        ],
        payer: { email: input.payerEmail },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Mercado Pago preference failed: ${response.status} ${body}`);
    }

    const data = (await response.json()) as {
      id: string;
      init_point?: string;
      sandbox_init_point?: string;
    };

    return {
      provider: this.name,
      providerRef: data.id,
      status: 'pending',
      checkoutUrl: data.sandbox_init_point ?? data.init_point,
      amountCents: input.amountCents,
    };
  }

  async parseWebhook(rawBody: string, headers: Record<string, string | undefined>): Promise<WebhookEvent> {
    if (this.webhookSecret) {
      const signature = headers['x-signature'] ?? headers['X-Signature'] ?? '';
      if (!signature || !timingSafeEqual(signature, this.webhookSecret)) {
        throw new Error('invalid_webhook_signature');
      }
    }

    const payload = JSON.parse(rawBody) as {
      id?: string | number;
      type?: string;
      action?: string;
      data?: { id?: string };
    };

    const paymentId = payload.data?.id;
    if (!paymentId) throw new Error('webhook_missing_payment_id');

    const paymentRes = await fetch(`${SANDBOX_API}/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    if (!paymentRes.ok) throw new Error('webhook_payment_lookup_failed');
    const payment = (await paymentRes.json()) as {
      id: number;
      status: string;
      transaction_amount: number;
      external_reference?: string;
    };

    const statusMap: Record<string, WebhookEvent['status']> = {
      pending: 'pending',
      authorized: 'authorized',
      approved: 'paid',
      rejected: 'failed',
      cancelled: 'cancelled',
      refunded: 'refunded',
    };

    return {
      eventId: String(payload.id ?? payment.id),
      provider: this.name,
      type: payload.action ?? payload.type ?? 'payment',
      providerRef: String(payment.id),
      status: statusMap[payment.status] ?? 'pending',
      amountCents: Math.round(Number(payment.transaction_amount) * 100),
      payload: { ...payload, payment, appointmentId: payment.external_reference },
    };
  }
}

export function createMercadoPagoFromEnv(
  env: Record<string, string | undefined> = {},
): MercadoPagoProvider {
  return new MercadoPagoProvider(env.MERCADOPAGO_ACCESS_TOKEN ?? '', env.MERCADOPAGO_WEBHOOK_SECRET);
}
