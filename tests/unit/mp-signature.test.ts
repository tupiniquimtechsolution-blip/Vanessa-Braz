import { describe, expect, it } from 'vitest';
import {
  hmacSha256Hex,
  mercadoPagoManifest,
  parseMercadoPagoSignature,
  verifyMercadoPagoSignature,
} from '../../src/lib/payments/mp-signature';

describe('Mercado Pago official signature', () => {
  it('parses ts/v1 and rejects a raw secret comparison', async () => {
    const secret = 'whsec_test';
    const dataId = '123456';
    const requestId = 'req-1';
    const ts = '1700000000';
    const v1 = await hmacSha256Hex(secret, mercadoPagoManifest(dataId, requestId, ts));
    const header = `ts=${ts},v1=${v1}`;
    expect(parseMercadoPagoSignature(header)).toEqual({ ts, v1 });
    await expect(
      verifyMercadoPagoSignature({ secret, signatureHeader: header, requestId, dataId }),
    ).resolves.toBe(true);
    await expect(
      verifyMercadoPagoSignature({ secret, signatureHeader: secret, requestId, dataId }),
    ).resolves.toBe(false);
  });
});
