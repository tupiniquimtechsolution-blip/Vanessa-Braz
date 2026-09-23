import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  applyMigrations,
  connect,
  postgresUrl,
  resetPostgresTestSchemas,
  type RlsIdentity,
  withRlsIdentity,
} from './harness';

const enabled = Boolean(postgresUrl());

if (process.env.CI && !enabled) {
  throw new Error('DATABASE_URL is required in CI for real RLS tests.');
}

function nextUtcWeekdayAt(weekday: number, hour: number): Date {
  const result = new Date();
  const currentWeekday = result.getUTCDay();
  let daysAhead = (weekday - currentWeekday + 7) % 7;
  if (daysAhead === 0) daysAhead = 7;
  result.setUTCDate(result.getUTCDate() + daysAhead);
  result.setUTCHours(hour, 0, 0, 0);
  return result;
}

describe.skipIf(!enabled)('real postgres migrations + RLS', () => {
  it('enforces RLS, booking constraints, and atomic payment-event idempotency', async () => {
    const sql = connect();
    try {
      await resetPostgresTestSchemas(sql);
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
      const adminUser = randomUUID();
      const anon: RlsIdentity = { role: 'anon', subject: null };
      const customerA: RlsIdentity = { role: 'authenticated', subject: userA };
      const customerB: RlsIdentity = { role: 'authenticated', subject: userB };
      const admin: RlsIdentity = { role: 'authenticated', subject: adminUser };

      await sql`insert into auth.users (id, email, raw_user_meta_data) values (${userA}::uuid, 'a@example.com', '{"full_name":"A","phone":"11"}'::jsonb)`;
      await sql`insert into auth.users (id, email, raw_user_meta_data) values (${userB}::uuid, 'b@example.com', '{"full_name":"B","phone":"22"}'::jsonb)`;
      await sql`insert into auth.users (id, email, raw_user_meta_data) values (${adminUser}::uuid, 'admin@example.com', '{"full_name":"Admin","phone":"33"}'::jsonb)`;

      // Fixture provisioning is privileged; clients cannot promote themselves.
      await sql`alter table public.profiles disable trigger profiles_protect_role`;
      try {
        await sql`update public.profiles set role = 'admin' where id = ${adminUser}::uuid`;
      } finally {
        await sql`alter table public.profiles enable trigger profiles_protect_role`;
      }

      const adminProfile = await sql`select role::text as role from public.profiles where id = ${adminUser}::uuid`;
      expect(adminProfile[0].role).toBe('admin');

      const categoryId = '22222222-0000-4000-8000-000000000099';
      const serviceId = '33333333-0000-4000-8000-000000000099';
      const professionalId = '11111111-1111-4111-8111-111111111111';
      await sql`insert into public.service_categories (id, name, slug) values (${categoryId}::uuid, 'Teste', 'teste-rls')`;
      await sql`insert into public.services (id, category_id, name, slug, duration_minutes, price_cents) values (${serviceId}::uuid, ${categoryId}::uuid, 'Serviço teste', 'servico-teste', 60, 1000)`;
      await sql`insert into public.professional_services (professional_id, service_id) values (${professionalId}::uuid, ${serviceId}::uuid)`;
      await sql`insert into public.business_hours (professional_id, weekday, open_time, close_time) values (null, 2, '09:00', '19:00')`;

      // The previous fixture used 2026-09-22 and became a past date as the CI clock advanced.
      // Keep the scenario deterministic in weekday/time while ensuring it is always in the future.
      const appointmentStart = nextUtcWeekdayAt(2, 14).toISOString();
      const created = await withRlsIdentity(
        sql,
        customerA,
        async (tx) => tx`select * from public.create_appointment(${serviceId}::uuid, ${professionalId}::uuid, ${appointmentStart}::timestamptz, '', true, false, false)`,
        { commit: true },
      );
      expect(created[0].price_cents).toBe(1000);
      const appointmentId = created[0].id as string;

      await withRlsIdentity(sql, anon, async (tx) => {
        const context = await tx`
          select current_user as role,
                 nullif(current_setting('request.jwt.claim.sub', true), '') as subject
        `;
        expect(context[0]).toMatchObject({ role: 'anon', subject: null });

        const asAnon = await tx`select id from public.appointments where id = ${appointmentId}::uuid`;
        expect(asAnon).toHaveLength(0);
      });

      await withRlsIdentity(sql, customerA, async (tx) => {
        const context = await tx`
          select current_user as role,
                 nullif(current_setting('request.jwt.claim.sub', true), '') as subject
        `;
        expect(context[0]).toMatchObject({ role: 'authenticated', subject: userA });

        const asA = await tx`select id from public.appointments where id = ${appointmentId}::uuid`;
        expect(asA).toHaveLength(1);
      });

      await withRlsIdentity(sql, customerB, async (tx) => {
        const context = await tx`
          select current_user as role,
                 nullif(current_setting('request.jwt.claim.sub', true), '') as subject
        `;
        expect(context[0]).toMatchObject({ role: 'authenticated', subject: userB });

        const asB = await tx`select id from public.appointments where id = ${appointmentId}::uuid`;
        expect(asB).toHaveLength(0);
      });

      await withRlsIdentity(sql, admin, async (tx) => {
        const context = await tx`
          select current_user as role,
                 nullif(current_setting('request.jwt.claim.sub', true), '') as subject
        `;
        expect(context[0]).toMatchObject({ role: 'authenticated', subject: adminUser });

        const asAdmin = await tx`select id from public.appointments where id = ${appointmentId}::uuid`;
        expect(asAdmin).toHaveLength(1);
      });

      const cleanContext = await sql`
        select current_user = session_user as role_restored,
               nullif(current_setting('request.jwt.claim.sub', true), '') is null as subject_cleared
      `;
      expect(cleanContext[0].role_restored).toBe(true);
      expect(cleanContext[0].subject_cleared).toBe(true);

      await withRlsIdentity(sql, customerA, async (tx) => {
        await expect(
          tx`update public.profiles set role = 'admin' where id = ${userA}::uuid`,
        ).rejects.toThrow();
      });

      const profileRole = await sql`select role::text as role from public.profiles where id = ${userA}::uuid`;
      expect(profileRole[0].role).toBe('customer');

      // Payment idempotency/concurrency section remains unchanged below in semantics.
      const paymentAppointmentId = appointmentId;
      const providerEventId = `evt-${randomUUID()}`;
      const applyPayment = async () => {
        const connection = connect();
        try {
          return await connection`
            select * from public.apply_payment_event(
              'mercadopago',
              ${providerEventId},
              'payment-test',
              ${paymentAppointmentId}::uuid,
              1000,
              'approved',
              '{}'::jsonb
            )
          `;
        } finally {
          await connection.end();
        }
      };

      const [first, second] = await Promise.all([applyPayment(), applyPayment()]);
      const results = [first[0], second[0]];
      expect(results.filter((row) => row.duplicate === false)).toHaveLength(1);
      expect(results.filter((row) => row.duplicate === true)).toHaveLength(1);

      const paymentCount = await sql`
        select count(*)::int as n from public.payments
        where provider = 'mercadopago' and provider_payment_id = 'payment-test'
      `;
      expect(paymentCount[0].n).toBe(1);

      const eventCount = await sql`
        select count(*)::int as n from public.payment_events
        where provider = 'mercadopago' and provider_event_id = ${providerEventId}
      `;
      expect(eventCount[0].n).toBe(1);
    } finally {
      await sql.end();
    }
  }, 30_000);
});
