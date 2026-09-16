# CHANGELOG

## Unreleased

### Fixed
- Isolamento de dados demonstrativos fora das migrations de produção.
- Singleton de `business_settings` e unicidade de `business_hours` globais (`professional_id IS NULL`).
- Webhook Mercado Pago: assinatura HMAC oficial, consulta `/v1/payments/{id}`, constraint única real e aplicação transacional/idempotente.
- Documentação (AGENTS, CHECKPOINT) alinhada ao HEAD.

### Added
- Governança Tupiniquim (toolbox, STATUS, ADRs, CHANGELOG).
- CI (lint, typecheck, test, security, postgres, build), CodeQL e Dependabot.
- Teste real de migrations/RLS contra PostgreSQL quando `DATABASE_URL` está definido.

### Security
- Service role continua fora do frontend.
- Cliente não lê agendamentos de outro titular (RLS + teste Postgres).
