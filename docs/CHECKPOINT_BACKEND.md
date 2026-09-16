# CHECKPOINT — Backend (review fixes)

## BRANCH
`arena/01a0a695-vanessa-braz`

Sem merge em `main`. Sem troca de branch.

## BASE_SHA
`eff2fa85b88c829115fc68b19cf0d4c3e5f87a4e`

## HEAD_SHA
`3c14fab` (CI). Docs commit seguinte atualiza este campo.

## REVIEW_FIXES
1. Toolbox/governança restaurada — `c12d91d`
2. Seed de produção sem catálogo inventado; demo isolado — `1cd9b99`
3. Singleton real + `business_hours` globais únicos — `22db5ad`
4. Webhook MP HMAC oficial + lookup + `apply_payment_event` — `e51c2cc` / `22db5ad`
5. CI + CodeQL + Dependabot — `3c14fab`
6. Teste Postgres real (CI / `DATABASE_URL`) — `0026568`
7. AGENTS.md e este checkpoint — `24a2e62`

## SCHEMA_STATUS
PASS no SQL versionado. Live `db push`: INTEGRATION_PENDING.

## AUTH_STATUS
PASS no código. Live Auth: INTEGRATION_PENDING.

## RLS_STATUS
PASS no SQL. Teste real: CI com Postgres 15 (`DATABASE_URL` obrigatório).
Local sem `DATABASE_URL`: skip (não declara PASS live).

## BOOKING_STATUS
PASS no domínio. Catálogo público vazio até dados confirmados.

## PAYMENT_WEBHOOK_STATUS
HMAC `ts/v1` + `x-request-id`, GET `/v1/payments/{id}`, unique `(provider, provider_ref)`, RPC transacional/idempotente.

## DEMO_DATA_STATUS
Isolado. `src/lib/data.ts` sem serviços/preços/depoimentos. Migrations sem `5511999999999` / preços demo.

## TOOLBOX_STATUS
Restaurada (SKILL, MASTER_PLAN, AUDIT_REPORT, GITHUB_HANDOFF, CHANGELOG, ADRs).

## CI_STATUS
Arquivos adicionados. Execução GitHub após o push.

## QUALITY_GATES (local, 2026-09-16)
```
npm run lint        PASS
npm run typecheck   PASS
npm test            PASS (32 passed, 1 skipped — postgres sem DATABASE_URL)
npm run test:security PASS (12 passed, 1 skipped)
npm run build       PASS
npm run test:postgres SKIP local (sem DATABASE_URL / Docker)
```

## INTEGRATION_PENDING
Supabase hospedado, admin bootstrap, MP sandbox keys, dados comerciais reais.

## RISKS
1. Sem Docker local; RLS real depende do CI.
2. Catálogo público vazio até seed confirmado.
3. Assinatura MP exige `x-request-id` + secret.
