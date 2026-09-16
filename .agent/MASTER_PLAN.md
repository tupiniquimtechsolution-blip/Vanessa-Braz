# MASTER_PLAN.md — Vanessa Braz

## FASES

### FASE 0–6 — Frontend premium ✅
Baseline restaurado do checkpoint 1, sem redesenho. Mídias reais preservadas.

### FASE 7 — Backend + Supabase 🟡
- [x] Schema PostgreSQL versionado
- [x] Migrations
- [x] RLS default-deny
- [x] RPC de agendamento com preço server-side
- [ ] `supabase db push` em projeto hospedado (INTEGRATION_PENDING)

### FASE 8 — Pagamentos 🟡
- [x] PaymentProvider
- [x] DemoProvider
- [x] MercadoPagoProvider (sandbox, HMAC oficial)
- [x] Webhook transacional/idempotente
- [ ] Credenciais sandbox reais (INTEGRATION_PENDING)

### FASE 9 — Segurança + LGPD 🟡
- [x] Audit log
- [x] Consentimentos separados
- [ ] Exportação / exclusão
- [ ] Rate limiting / CSP no deploy

### FASE 10 — Testes 🟡
- [x] Unit / integration / security / e2e lógico
- [x] Postgres real no CI
- [ ] Playwright contra projeto hospedado

### FASE 11 — Polimento ⏳
### FASE 12 — Deploy ⏳
### FASE 13 — GitHub 🟡
- [x] Repositório conectado
- [x] CI
- [x] Dependabot
- [x] CodeQL
- [ ] Proteção de `main` após auditoria

## STATUS ATUAL
Correção da review do PR #2. Sem merge.
