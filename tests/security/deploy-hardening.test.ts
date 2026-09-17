import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

describe('deployment hardening', () => {
  it('ships a restrictive CSP and baseline security headers', () => {
    const config = JSON.parse(read('vercel.json')) as {
      headers: Array<{ source: string; headers: Array<{ key: string; value: string }> }>;
    };
    const allHeaders = config.headers.flatMap((entry) => entry.headers);
    const byName = new Map(allHeaders.map((header) => [header.key.toLowerCase(), header.value]));

    const csp = byName.get('content-security-policy') ?? '';
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain('https://*.supabase.co');
    expect(byName.get('x-content-type-options')).toBe('nosniff');
    expect(byName.get('x-frame-options')).toBe('DENY');
    expect(byName.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
    expect(byName.get('strict-transport-security')).toContain('max-age=31536000');
  });

  it('does not require inline bootstrap script/style in the initial document', () => {
    const html = read('index.html');
    expect(html).not.toMatch(/<style[\s>]/i);
    expect(html).not.toMatch(/<script(?![^>]*\bsrc=)[^>]*>/i);
  });

  it('limits webhook input, bounds provider lookup time and hides internal DB errors', () => {
    const webhook = read('supabase/functions/payments-webhook/index.ts');
    expect(webhook).toContain('MAX_WEBHOOK_BYTES');
    expect(webhook).toContain('AbortSignal.timeout');
    expect(webhook).toContain("'Cache-Control': 'no-store'");
    expect(webhook).toContain("'X-Content-Type-Options': 'nosniff'");
    expect(webhook).not.toContain('detail: message');
    expect(webhook).toContain("request_id: requestId");
  });
});
