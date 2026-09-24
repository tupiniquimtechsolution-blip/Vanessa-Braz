# STATUS — Vanessa Braz

**Atualizado:** 2026-09-24  
**Branch da sessão:** `chatgpt/clandestine-layout-refresh`  
**Base da branch:** `arena/01a0a695-vanessa-braz` @ `74dd4b81964b92dd8e5730f55c04bbbc0d2314ea`  
**PR:** #8 — draft, empilhado sobre a branch Arena; sem merge em `main`.  
**Regra de entrega:** sem merge em `main`; sem force push.

## Decisão arquitetural vigente — identidade, Auth e backend

Vanessa Braz **não terá Supabase/Auth isolado nem sistema próprio de usuário e senha**.

A autenticação, identidade, perfis, memberships, tenancy, RLS e dados transacionais serão integrados ao **Sistema-SaaS-Geral**, onde Vanessa será um tenant/configuração do vertical `salon`.

Consequências:

- não criar projeto Supabase dedicado para Vanessa;
- não duplicar cadastro/login/senha dentro deste repositório;
- não aplicar as migrations Vanessa diretamente em um banco isolado;
- fluxos autenticados de booking/admin devem consumir a camada compartilhada do SaaS Geral;
- o frontend Vanessa pode continuar evoluindo e operando em preview sem backend próprio enquanto a integração do vertical `salon` é concluída;
- qualquer código legado de Auth/Supabase neste repo passa a ser referência de domínio/teste e deve ser reconciliado com o SaaS Core antes de reutilização.

Fonte de integração: `tupiniquimtechsolution-blip/Sistema-SaaS-Geral`, branch `chatgpt/integrate-salon-vanessa`, handoff `docs/handoffs/VANESSA_SALON_INTEGRATION_HANDOFF.md`.

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
- [x] Preview Cloudflare da branch foi estabilizado.

## CI — gate atual

GitHub Actions no checkpoint `73e3034d8f5ef646ad21c7774677d4747b661ff9`, run `36001048369`: **PASS**.

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
- Esses contratos continuam úteis como evidência/referência, mas a implementação de produção deve ser generalizada/reutilizada no SaaS Geral.

## Integrações pendentes

- Concluir a reconciliação Vanessa → vertical `salon` no Sistema-SaaS-Geral.
- Integrar o frontend Vanessa à autenticação/tenant resolution compartilhada do SaaS Geral quando o contrato do vertical estiver estável.
- Generalizar Mercado Pago, booking e consentimentos no SaaS Core sem duplicar schema específico de Vanessa.
- Confirmar catálogo, preços, cidade/estado, horários, regras comerciais e textos jurídicos antes de produção.
- Concluir rate limiting, observabilidade e proteção de `main` no fluxo de produção.
- Confirmar autorização de publicação das pessoas presentes nas mídias antes de exposição pública em produção.

## Riscos operacionais conhecidos

1. Aprovação visual da foto não equivale a consentimento/autorização de publicação.
2. Testes PostgreSQL deste repo não devem ser apontados para banco compartilhado/produção; a integração real deve usar o pipeline do SaaS Geral.
3. O template visual de referência contém conteúdo fictício; somente sua linguagem visual é usada como referência.
4. PR #8 é uma camada visual empilhada sobre a branch Arena e não deve ser mergeado diretamente em `main` nesta etapa.
5. Criar Auth/Supabase paralelo em Vanessa geraria duplicidade de identidade e inconsistência de tenancy; essa alternativa está oficialmente descartada.
