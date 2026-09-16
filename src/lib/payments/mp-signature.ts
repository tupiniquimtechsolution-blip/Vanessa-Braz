export interface MercadoPagoSignature {
  ts: string;
  v1: string;
}

export function parseMercadoPagoSignature(header: string | undefined | null): MercadoPagoSignature | null {
  if (!header) return null;
  const parts = Object.fromEntries(
    header
      .split(',')
      .map((chunk) => chunk.trim().split('='))
      .filter((pair) => pair.length === 2)
      .map(([key, value]) => [key, value]),
  );
  if (!parts.ts || !parts.v1) return null;
  return { ts: parts.ts, v1: parts.v1 };
}

export function mercadoPagoManifest(dataId: string, requestId: string, ts: string): string {
  return `id:${dataId};request-id:${requestId};ts:${ts};`;
}

export async function hmacSha256Hex(secret: string, message: string): Promise<string> {
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

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function verifyMercadoPagoSignature(args: {
  secret: string;
  signatureHeader?: string | null;
  requestId?: string | null;
  dataId: string;
}): Promise<boolean> {
  const parsed = parseMercadoPagoSignature(args.signatureHeader);
  if (!parsed || !args.secret || !args.requestId) return false;
  const expected = await hmacSha256Hex(
    args.secret,
    mercadoPagoManifest(args.dataId, args.requestId, parsed.ts),
  );
  return timingSafeEqual(expected, parsed.v1);
}
