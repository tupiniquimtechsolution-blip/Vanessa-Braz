import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { applyMigrations, connect, postgresUrl } from './harness';

const enabled = Boolean(postgresUrl());

if (process.env.CI && !enabled) {
  throw new Error('DATABASE_URL is required in CI for real RLS tests.');
}

describe.skipIf(!enabled)('real postgres migrations + RLS', () => {
  it('applies migrations, enforces singleton/hours uniqueness, denies cross-customer reads and double booking', async () => {
    const sql = connect();
    try {
      await applyMigrations(sql);

      const settingsCount = await sql`select count(*)::int as n from public.business_settings`;
      expect(settingsCount[0].n).toBe(1);
      await expect(
        sql`insert into public.business_settings (name) values ('outra linha')`,
      ).rejects.toThrow();

      const hours = await sql`select count(*)::int as n from public.business_hours where professional_id is null`;
      expect(Number(hours[0].n)).toBe(0);
      await sql`insert into public.business_hours (professional_id, weekday, open_time, close_time) values (null, 1, '09:00', '18:00')`;
      await expect(
        sql`insert into public.business_hours (professional_id, weekday, open_time, close_time) values (null, 1, '10:00', '19:00')`,
      ).rejects.toThrow();

      const userA = randomUUID();
      const userB = randomUUID();
      await sql`insert into auth.users (id, email, raw_user_meta_data) values (${userA}::uuid, 'a@example.com', '{"full_name":"A","phone":"11"}'::jsonb)`;
      await sql`insert into auth.users (id, email, raw_user_meta_data) values (${userB}::uuid, 'b@example.com', '{"full_name":"B","phone":"22"}'::jsonb)`;

      const categoryId = '22222222-0000-4000-8000-000000000099';
      const serviceId = '33333333-0000-4000-8000-000000000099';
      const professionalId = '11111111-1111-4111-8111-111111111111';
      await sql`insert into public.service_categories (id, name, slug) values (${categoryId}::uuid, 'Teste', 'teste-rls')`;
      await sql`insert into public.services (id, category_id, name, slug, duration_minutes, price_cents) values (${serviceId}::uuid, ${categoryId}::uuid, 'Serviço teste', 'servico-teste', 60, 1000)`;
      await sql`insert into public.professional_services (professional_id, service_id) values (${professionalId}::uuid, ${serviceId}::uuid)`;
      await sql`insert into public.business_hours (professional_id, weekday, open_time, close_time) values (null, 2, '09:00', '19:00')`;

      await sql`select set_config('request.jwt.claim.sub', ${userA}, false)`;
      const created = await sql`select * from public.create_appointment(${serviceId}::uuid, ${professionalId}::uuid, '2026-09-22 14:00:00+00'::timestamptz, '', true, false, false)`;
      expect(created[0].price_cents).toBe(1000);
      const appointmentId = created[0].id as string;

      await expect(
        sql`select * from public.create_appointment(${serviceId}::uuid, ${professionalId}::uuid, '2026-09-22 14:30:00+00'::timestamptz, '', true, false, false)`,
      ).rejects.toThrow(/double_booking|23P01|exclusion/i);

      await sql`select set_config('request.jwt.claim.sub', ${userB}, true)`;
      await sql`set role authenticated`;
      const asB = await sql`select id from public.appointments where id = ${appointmentId}::uuid`;
      expect(asB).toHaveLength(0);
      await sql`reset role`;

      await sql`select set_config('request.jwt.claim.sub', ${userA}, true)`;
      await sql`set role authenticated`;
      const asA = await sql`select id from public.appointments where id = ${appointmentId}::uuid`;
      expect(asA).toHaveLength(1);
      await sql`reset role`;

      const firstPay = await sql`select public.apply_payment_event('demo', 'evt-1', 'payment.updated', 'pay-1', ${appointmentId}::uuid, 'paid', 1000, '{}'::jsonb) as result`;
      expect((firstPay[0].result as { duplicate: boolean }).duplicate).toBe(false);
      const secondPay = await sql`select public.apply_payment_event('demo', 'evt-1', 'payment.updated', 'pay-1', ${appointmentId}::uuid, 'paid', 1000, '{}'::jsonb) as result`;
      expect((secondPay[0].result as { duplicate: boolean }).duplicate).toBe(true);
      await expect(
        sql`select public.apply_payment_event('demo', 'evt-2', 'payment.updated', 'pay-2', ${appointmentId}::uuid, 'paid', 1, '{}'::jsonb)`,
      ).rejects.toThrow(/price_mismatch/);
    } finally {
      await sql.end({ timeout: 1 });
    }
  });
});
