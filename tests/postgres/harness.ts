import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import postgres from 'postgres';

export function postgresUrl(): string | null {
  return process.env.DATABASE_URL ?? null;
}

export function requirePostgresUrl(): string {
  const url = postgresUrl();
  if (!url) {
    if (process.env.CI) {
      throw new Error('DATABASE_URL is required in CI for real migration/RLS tests.');
    }
    throw new Error('DATABASE_URL is not set');
  }
  return url;
}

const AUTH_STUB = `
create schema if not exists auth;
create table if not exists auth.users (
  id uuid primary key,
  email text unique,
  raw_user_meta_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;
do $$ begin
  create role anon nologin noinherit;
exception when duplicate_object then null;
end $$;
do $$ begin
  create role authenticated nologin noinherit;
exception when duplicate_object then null;
end $$;
do $$ begin
  create role service_role nologin bypassrls;
exception when duplicate_object then null;
end $$;
`;

export async function applyMigrations(sql: postgres.Sql): Promise<void> {
  await sql.unsafe(AUTH_STUB);
  const dir = join(process.cwd(), 'supabase/migrations');
  const files = readdirSync(dir).filter((name) => name.endsWith('.sql')).sort();
  for (const file of files) {
    const body = readFileSync(join(dir, file), 'utf8');
    await sql.unsafe(body);
  }
}

export function connect(url = requirePostgresUrl()) {
  return postgres(url, { max: 1, onnotice: () => undefined });
}
