# MASTER_PLAN.md — Vanessa Braz

## FASES

### FASE 0 — Bootstrap ✅
- [x] Inspecionar workspace
- [x] Identificar stack disponível
- [x] Design System com tokens
- [x] Estrutura de dados demonstrativos
- [x] Store com persistência local

### FASE 1 — Design System ✅
- [x] Tokens de cores centralizados
- [x] Tipografia (Playfair Display + Inter)
- [x] Componentes base (botões, cards, inputs)
- [x] Animações
- [x] Responsividade

### FASE 2 — Site Público ✅
- [x] Home (hero, serviços, sobre, depoimentos, FAQ, CTA)
- [x] Header responsivo com menu mobile
- [x] Footer completo
- [x] WhatsApp flutuante
- [x] Página de serviços com filtro
- [x] Página de contato

### FASE 3 — Catálogo de Serviços ✅
- [x] Lista completa de serviços
- [x] Filtro por categoria
- [x] Cards com preço e duração
- [x] Link para agendamento

### FASE 4 — Booking Engine ✅
- [x] Seleção de serviço
- [x] Seleção de data (14 dias)
- [x] Seleção de horário (30min intervalos)
- [x] Dados do cliente
- [x] Confirmação
- [x] Persistência local
- [x] Verificação de disponibilidade

### FASE 5 — Auth + Cliente ✅
- [x] Login/Cadastro (demo)
- [x] Área do cliente
- [x] Visualização de agendamentos
- [x] Cancelamento
- [x] Histórico
- [x] Consentimento LGPD no cadastro

### FASE 6 — Admin ✅
- [x] Login administrativo
- [x] Dashboard com métricas
- [x] Gestão de agendamentos
- [x] Confirmação/cancelamento
- [x] Lista de clientes
- [x] Lista de serviços
- [x] Configurações

### FASE 7 — Backend + Supabase ⏳
- [ ] Schema PostgreSQL
- [ ] Migrations
- [ ] Repositories
- [ ] Adapter pattern
- [ ] RLS policies
- [ ] INTEGRATION_PENDING

### FASE 8 — Pagamentos ⏳
- [ ] PaymentProvider abstraction
- [ ] DemoPaymentProvider
- [ ] MercadoPagoProvider (sandbox)
- [ ] Webhook handler
- [ ] Idempotency
- [ ] INTEGRATION_PENDING

### FASE 9 — Segurança + LGPD ⏳
- [ ] CSP headers
- [ ] Rate limiting
- [ ] Audit log
- [ ] Data export
- [ ] Account deletion
- [ ] INTEGRATION_PENDING

### FASE 10 — Testes ⏳
- [ ] Unit tests
- [ ] Integration tests
- [ ] Security tests
- [ ] E2E tests

### FASE 11 — Polimento ⏳
- [ ] Performance optimization
- [ ] Image optimization
- [ ] SEO meta tags
- [ ] Open Graph
- [ ] PWA manifest

### FASE 12 — Deploy ⏳
- [ ] Vercel configuration
- [ ] Domain setup
- [ ] Environment variables
- [ ] Preview deployments

### FASE 13 — GitHub ⏳
- [ ] Repository creation
- [ ] Branch protection
- [ ] CI/CD workflows
- [ ] Dependabot
- [ ] CodeQL

## STATUS ATUAL
**FASE 6 COMPLETA** — Avançando para FASE 7

## PRÓXIMA AÇÃO
Conectar Supabase quando credenciais estiverem disponíveis.
Enquanto isso, adapter demo continua funcional.
