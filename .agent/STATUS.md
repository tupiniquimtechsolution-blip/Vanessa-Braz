# STATUS — Vanessa Braz

**Atualizado:** 2026-09-17  
**Branch da sessão:** `security/deploy-hardening`  
**Base de aplicação auditada:** `83d3834cf528e913e0d371b57c2775361cd14d64` (`arena/01a0a695-vanessa-braz`, PR #2)  
**Regra de entrega:** sem merge em `main`; sem force push.

## Baseline já validado

- [x] RLS real no PostgreSQL, com cenários isolados para `anon`, customer A, customer B e admin.
- [x] `public.apply_payment_event()` com aquisição atômica de evento antes de alterar pagamento/agendamento.
- [x] Teste real de concorrência com duas conexões PostgreSQL para idempotência de pagamento.
- [x] Webhook Mercado Pago com HMAC `ts`/`v1` + `x-request-id` e lookup autoritativo `GET /v1/payments/{id}`.
- [x] Claims públicas não confirmadas neutralizadas.
- [x] CI e CodeQL do HEAD auditado do PR #2 concluídos com sucesso no GitHub.

## Hardening desta sessão

- [x] Criada branch empilhada `security/deploy-hardening` a partir do HEAD auditado do PR #2.
- [x] Adicionados CSP e cabeçalhos de segurança para Vercel.
- [x] Removido bootstrap inline do HTML inicial e preservado estilo-base no CSS versionado.
- [x] Webhook limitado a 256 KiB e `application/json`.
- [x] Lookup Mercado Pago limitado por timeout de 10 s.
- [x] Erros internos de banco deixaram de ser expostos na resposta HTTP.
- [x] Logs estruturados com `requestId`, sem payload completo ou secrets.
- [x] Adicionado teste de regressão para hardening de deploy/webhook.
- [x] Documentado gate em `docs/DEPLOYMENT_HARDENING.md`.

## Gates a validar no PR desta branch

- [ ] `npm ci`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run test:security`
- [ ] `npm run test:postgres`
- [ ] `npm run build`
- [ ] GitHub Actions CI

## Integrações externas ainda pendentes

- Selecionar/criar projeto Supabase hospedado dedicado e aplicar migrations.
- Revisar Supabase Security/Performance Advisors e configurar limites de Auth/edge.
- Bootstrap controlado do primeiro admin.
- Configurar credenciais sandbox/produção, URL pública e teste E2E real do Mercado Pago.
- Configurar proteção/ruleset da `main` com PR e checks obrigatórios.
- Confirmar autorização de publicação das mídias e dados comerciais/jurídicos.

## Riscos operacionais conhecidos

1. `DATABASE_URL` dos testes nunca deve apontar para produção: o harness redefine schemas em base descartável.
2. A integração de Mercado Pago só é operacional após deploy e configuração dos secrets server-side.
3. Rate limiting distribuído depende da configuração do ambiente hospedado; não usar contador em memória local como controle de produção.
4. Conteúdo jurídico, comercial, de contato e autorização de mídia permanece deliberadamente pendente de confirmação.
