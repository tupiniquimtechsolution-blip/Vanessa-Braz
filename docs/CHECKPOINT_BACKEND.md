# CHECKPOINT — Backend base (Auth + DB + Agenda)

## BRANCH
`arena/01a0a695-vanessa-braz`

Sessão Arena está fixa nesta branch. A branch pedida `arena/vanessa-backend-production` existe no remoto no mesmo SHA de `main` (`eff2fa85`) e **não foi usada** para não perder o tracking da sessão. Não houve merge automático em `main`.

## BASE_SHA
`eff2fa85b88c829115fc68b19cf0d4c3e5f87a4e`

## HEAD_SHA
`327aab6f323ba917299447cd641bcd8e2095470d`

## COMMITS
1. `8cd2c9d` chore(frontend): restore premium baseline from checkpoint 1
2. `0253053` feat(db): add versioned supabase schema, booking RPC and RLS
3. `3e0cda7` feat(auth,booking,payments): replace demo persistence with supabase
4. `b397f15` test: cover auth rules, RLS negatives, double booking and webhooks
5. `01cbf5a` docs: record backend checkpoint for audit before merge

## MIGRATIONS
- `supabase/migrations/20260915000001_init_schema.sql`
- `supabase/migrations/20260915000002_functions_and_triggers.sql`
- `supabase/migrations/20260915000003_rls.sql`
- `supabase/migrations/20260915000004_seed.sql`

Tabelas: profiles, business_settings, professionals, service_categories, services, professional_services, business_hours, availability, blocked_periods, appointments, appointment_status_history, payments, payment_events, customer_notes, media_assets, notifications, audit_logs, consents.

## SCHEMA_STATUS
PASS (versionado). Preço em centavos. Consentimentos append-only. Exclusion constraint `appointments_no_overlap`.

**Live apply:** pendente de projeto Supabase vinculado (`supabase db push`).

## AUTH_STATUS
PASS no código. Supabase Auth (login, cadastro, logout, reset, sessão persistente). Senha não é armazenada pela aplicação. Admin exige `profiles.role = 'admin'` (sem `admin@demo.com`).

**Live Auth:** INTEGRATION_PENDING até `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`.

## RLS_STATUS
PASS nas migrations (default-deny + force RLS). Cliente lê só os próprios dados. Admin só após role real. Service role não vai ao frontend (`VITE_SUPABASE_SERVICE_ROLE` ausente). Testes negativos em `tests/security/`.

**Live RLS:** INTEGRATION_PENDING (requer Postgres/Supabase aplicado).

## BOOKING_STATUS
PASS no domínio e na UI.
Fluxo: serviço → profissional → data → horário → cliente → revisão → confirmação.
Double booking: RPC com `FOR UPDATE` + trigger + `EXCLUDE USING gist`. Preço copiado de `services.price_cents`.

## TESTS
PASS (executado): 8 files, 28 tests.
- unit: overlap, engine, lgpd, payments
- integration: double booking
- security: RLS negativos + secret hygiene + migrations RLS
- e2e lógico: signup → book → ownership → admin deny → webhook idempotente

Não há Playwright contra um projeto Supabase real.

## LINT
PASS (`npm run lint`)

## TYPECHECK
PASS (`npm run typecheck`)

## BUILD
PASS (`npm run build`)

## SECURITY_STATUS
- Sem service role no client / dist
- RLS default-deny no SQL
- Autorização admin por role
- Webhook valida preço server-side e é idempotente
- Consentimentos operacionais / marketing / imagem separados, com versão e timestamp

## INTEGRATION_PENDING
- Projeto Supabase hospedado + `supabase db push`
- Promoção do primeiro admin via SQL
- Confirmação de e-mail Auth
- Mercado Pago sandbox keys + webhook público
- Google Maps / Instagram / WhatsApp Business (já marcados no frontend)
- Dados comerciais ainda `PENDENTE_DE_CONFIRMACAO` (endereço, telefone real)

## RISKS
1. Sem credenciais Supabase neste ambiente, login/agenda de produção não podem ser exercitados contra Postgres real.
2. `btree_gist` precisa estar disponível no projeto (Supabase padrão tem).
3. Assinatura Mercado Pago usa secret compartilhado; o template `x-signature` oficial deve ser calibrado no sandbox.
4. Bundle JS > 500 kB (aviso Vite, não quebra build).
5. Catálogo público ainda tem fallback local se o projeto não estiver configurado — confirmação de agenda **não** cai em localStorage.
