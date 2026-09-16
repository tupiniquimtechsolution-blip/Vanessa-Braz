# STATUS — Vanessa Braz

**Atualizado:** 2026-09-16  
**Branch da sessão:** `arena/01a0aada-vanessa-braz`  
**Base validada:** `9067422296f98d195e97d5daf175b43628fa2381`  
**Regra de entrega:** sem merge em `main`; sem force push.

## Entregas desta revisão

- [x] RLS real preservado no PostgreSQL, com cenários isolados para `anon`, customer A, customer B e admin.
- [x] `public.apply_payment_event()` agora adquire atomamente o evento em `payment_events(provider, provider_event_id)` antes de alterar pagamento ou agendamento.
- [x] Teste real de concorrência usa duas conexões PostgreSQL e força contenção no `INSERT`; há exatamente uma aplicação, um pagamento e um evento, e a outra chamada retorna `duplicate=true`.
- [x] Webhook Mercado Pago mantém HMAC `ts`/`v1` e `x-request-id`; a assinatura usa `data.id` da URL da notificação como valor canônico e recusa divergência com `data.id` do body.
- [x] `GET /v1/payments/{id}` permanece a fonte autoritativa para ID, status, valor e referência do agendamento.
- [x] Claims públicas não confirmadas foram neutralizadas sem alterar layout editorial ou remover o acervo de mídias fornecido.

## Evidências locais

Executado contra PostgreSQL real 15.18 via `DATABASE_URL`:

```text
npm ci                 PASS
npm run lint           PASS
npm run typecheck      PASS
npm test               PASS — 36 testes / 12 arquivos
npm run test:security  PASS — 13 testes / 4 arquivos
npm run test:postgres  PASS — 1 teste real / 1 arquivo
npm run build          PASS
```

## GitHub Actions

A confirmação de CI e CodeQL do HEAD publicado continua obrigatória. Este arquivo não declara esses checks como aprovados antes da conclusão real no GitHub.

## Integrações pendentes

- Aplicar migrations em um projeto Supabase hospedado (`supabase db push`).
- Configurar credenciais reais/sandbox, URL de webhook e segredo do Mercado Pago no ambiente server-side.
- Confirmar catálogo, preços, endereço, canais de contato, regras comerciais e textos jurídicos antes de publicação.
- Configurar rate limiting, CSP e controles de deploy.

## Riscos operacionais conhecidos

1. Os testes PostgreSQL redefinem schemas em uma base descartável; `DATABASE_URL` de testes nunca deve apontar para produção.
2. O webhook Mercado Pago só se torna operacional depois de deploy e configuração dos secrets server-side.
3. Conteúdo jurídico, comercial e de contato permanece deliberadamente pendente de confirmação.
