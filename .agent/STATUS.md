# STATUS — Vanessa Braz

**Atualizado:** 2026-09-23  
**Branch da sessão:** `chatgpt/clandestine-layout-refresh`  
**Base da branch:** `arena/01a0a695-vanessa-braz` @ `74dd4b81964b92dd8e5730f55c04bbbc0d2314ea`  
**PR:** #8 — draft, empilhado sobre a branch Arena; sem merge em `main`.  
**Regra de entrega:** sem merge em `main`; sem force push.

## Escopo desta sessão — UI e mídia

- [x] Referência `Northstrix/clandestine-beauty-salon-landing-page-template` auditada como inspiração de composição/interação; licença de origem registrada como MIT.
- [x] Paleta roxa da referência não foi copiada; aplicada direção própria em preto/vinho profundo, rosé, champagne e creme.
- [x] Navegação, hero, home, footer e galeria adaptados para linguagem de salão premium com maior presença fotográfica.
- [x] Conteúdo fictício do template de referência não foi transplantado para Vanessa Braz.
- [x] Serviços/preços ausentes continuam `PENDENTE_DE_CONFIRMACAO` ou dependem da fonte real do app.
- [x] Curadoria pública prioriza cabelos tratados/finalizados.
- [x] Fotos de cabelo em estágio de processo/desalinhado foram removidas da seleção padrão, sem apagar o acervo original.
- [x] `docs/DESIGN_REFERENCE_CLANDESTINE.md` registra provenance, regra do disclaimer e seleção de mídia.
- [x] Backend, migrations, Auth, pagamentos e RLS não foram alterados pelo redesign.

## CI — drift corrigido e gate validado

O primeiro CI do redesign, run `35837053203`, falhou em dois testes preexistentes por drift de fixture, não por erro de lint/typecheck do frontend:

1. `tests/postgres/rls.real.test.ts` usava `2026-09-22 14:00:00+00`; em 23/09/2026 a fixture passou a ser rejeitada corretamente como `starts_in_past`.
2. `tests/security/demo-isolation.test.ts` ainda exigia WhatsApp/Instagram pendentes, embora esses contatos já tenham sido confirmados no código da base.

Correções de teste aplicadas sem relaxar segurança:

- fixture de agendamento agora calcula a próxima terça-feira às 14:00 UTC e mantém o cenário de conflito às 14:30;
- teste de isolamento continua bloqueando placeholders demo, mas aceita somente os contatos reais já confirmados no projeto.

GitHub Actions run `35837724596` no checkpoint `f703bed0a6fdbb33256a8676ee8c3364c362d02e`: **PASS**.

- [x] npm ci
- [x] lint
- [x] typecheck
- [x] test
- [x] test:security
- [x] test:postgres
- [x] build

O GitHub permanece a fonte de verdade para cada novo HEAD; o PR continua draft para revisão visual e não há autorização de merge em `main`.

## Estado técnico herdado da base Arena

- RLS real no PostgreSQL com cenários isolados para `anon`, customer A, customer B e admin.
- `public.apply_payment_event()` adquire atomamente o evento antes de mutações de pagamento/agendamento.
- Webhook Mercado Pago valida assinatura e consulta o pagamento autoritativamente no provedor.
- Auth, booking e backend permanecem condicionados às integrações hospedadas pendentes registradas no projeto.

## Integrações pendentes

- Aplicar migrations em um projeto Supabase hospedado e validar o ambiente real.
- Configurar credenciais sandbox/produção e webhook Mercado Pago server-side.
- Confirmar catálogo, preços, cidade/estado, horários, regras comerciais e textos jurídicos antes de produção.
- Configurar rate limiting, CSP, observabilidade e proteção de `main`.
- Confirmar autorização de publicação das pessoas presentes nas mídias antes de exposição pública em produção.

## Riscos operacionais conhecidos

1. Aprovação visual da foto não equivale a consentimento/autorização de publicação.
2. Testes PostgreSQL redefinem schemas em uma base descartável; `DATABASE_URL` de testes nunca deve apontar para produção.
3. O template visual de referência contém conteúdo fictício; somente sua linguagem visual é usada como referência.
4. PR #8 é uma camada visual empilhada sobre a branch Arena e não deve ser mergeado diretamente em `main` nesta etapa.
