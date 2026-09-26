# CHANGELOG

## Unreleased

### Changed
- Home, navegação, footer e galeria receberam uma nova direção visual inspirada na composição escura/editorial do template `Northstrix/clandestine-beauty-salon-landing-page-template`, com paleta própria Vanessa Braz em preto/vinho, rosé e champagne.
- A vitrine pública de mídia passou a priorizar cabelos tratados/finalizados; registros de processo com cabelo desalinhado permanecem preservados no acervo, mas fora da seleção padrão.
- O conteúdo fictício/demonstrativo do template de referência não é herdado: serviços, preços, equipe, produtos, depoimentos, horários e dados comerciais só aparecem quando confirmados pela fonte do projeto.

### Fixed
- `public.apply_payment_event()` agora adquire o evento por `provider + provider_event_id` com `INSERT ... ON CONFLICT DO NOTHING` antes de qualquer mutação de pagamento ou agendamento.
- Notificações concorrentes idênticas retornam `duplicate=true` para a chamada que não adquiriu o evento, sem criar pagamento ou audit log adicionais.
- Webhook Mercado Pago usa `data.id` da URL/query como entrada canônica do HMAC e recusa divergência com `data.id` do body.
- Textos públicos não confirmados sobre produtos, atendimento, resultados, procedimentos, espaço físico, pagamentos, canais de contato e condições comerciais foram neutralizados.
- Isolamento de dados demonstrativos fora das migrations de produção.
- Singleton de `business_settings` e unicidade de `business_hours` globais (`professional_id IS NULL`).
- Teste PostgreSQL real deixou de depender da data fixa `2026-09-22`, evitando `starts_in_past` conforme o calendário avança.
- Teste de isolamento de demo agora diferencia corretamente contatos reais confirmados de placeholders fictícios conhecidos.

### Added
- Migration `20260916000002_payment_event_concurrency.sql` para tornar a aquisição de eventos de pagamento atômica.
- Teste PostgreSQL real de contenção com duas conexões para a idempotência concorrente de pagamentos.
- Testes unitários para URL/body canônicos do Mercado Pago e para a autoridade de status/valor retornados por `GET /v1/payments/{id}`.
- `.agent/STATUS.md` com escopo, evidências locais, integrações pendentes e riscos operacionais.
- Governança Tupiniquim (toolbox, MASTER_PLAN, ADRs, CHANGELOG), CI, CodeQL e Dependabot.
- `docs/DESIGN_REFERENCE_CLANDESTINE.md` documentando licença, provenance, limites do disclaimer demonstrativo e regra de curadoria de cabelos.

### Security
- HMAC Mercado Pago mantém `ts`/`v1` e `x-request-id`; status, valor e referência são obtidos no lookup autenticado do provedor.
- Service Role continua fora do frontend.
- Cliente não lê agendamentos de outro titular (RLS + teste PostgreSQL real).
- Testes de RLS usam transações com claim e role locais, sem vazamento entre anon, customers e admin.
- Aprovação visual de uma foto continua separada de autorização/consentimento para publicação.
