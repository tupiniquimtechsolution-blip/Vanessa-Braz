# CHECKPOINT — Backend (review fixes)

## BRANCH
`arena/01a0a695-vanessa-braz`

Sem merge em `main`. Sem troca de branch.

## BASE_SHA
`eff2fa85b88c829115fc68b19cf0d4c3e5f87a4e`

## HEAD_SHA
ver `git rev-parse HEAD`

## REVIEW_FIXES
1. Toolbox/governança restaurada.
2. Seed de produção sem catálogo inventado; demo isolado.
3. Singleton real + `business_hours` globais únicos.
4. Webhook MP HMAC oficial + lookup + `apply_payment_event`.
5. CI + CodeQL + Dependabot.
6. Teste Postgres real (CI / `DATABASE_URL`).
7. AGENTS.md e este checkpoint atualizados.

## SCHEMA_STATUS
PASS no SQL. Live `db push`: INTEGRATION_PENDING.

## AUTH_STATUS
PASS no código. Live Auth: INTEGRATION_PENDING.

## RLS_STATUS
PASS no SQL. Teste real: CI com Postgres 15. Local sem `DATABASE_URL`: skip (não declara PASS live).

## BOOKING_STATUS
PASS no domínio. Catálogo vazio até dados confirmados.

## PAYMENT_WEBHOOK_STATUS
HMAC `ts/v1` + `x-request-id`, GET `/v1/payments/{id}`, unique `(provider, provider_ref)`, RPC transacional/idempotente.

## DEMO_DATA_STATUS
Isolado. `src/lib/data.ts` sem serviços/preços/depoimentos. Migrations sem `5511999999999` / preços demo.

## TOOLBOX_STATUS
Restaurada (SKILL, MASTER_PLAN, STATUS, CHANGELOG, ADRs).

## CI_STATUS
Arquivos adicionados. Execução GitHub após o push.

## TESTS / LINT / TYPECHECK / BUILD
Reexecutados nesta sessão antes do push.

## INTEGRATION_PENDING
Supabase hospedado, admin bootstrap, MP sandbox keys, dados comerciais reais.

## RISKS
1. Sem Docker local; RLS real depende do CI.
2. Catálogo público vazio até seed confirmado.
3. Assinatura MP exige `x-request-id` + secret.
