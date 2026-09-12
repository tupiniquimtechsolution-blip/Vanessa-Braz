# AGENTS.md — Vanessa Braz — Beleza & Autoestima

## MISSÃO
Construir uma aplicação web profissional para gestão de beleza e autoestima, com agendamento online, área do cliente, painel administrativo e pagamentos — seguindo padrões de segurança, qualidade e governança.

## ESCOPO
- Site público (home, serviços, contato)
- Motor de agendamento
- Autenticação de clientes
- Área do cliente (agendamentos, histórico)
- Painel administrativo completo
- Pagamentos (sandbox → produção)
- LGPD compliance
- Documentação técnica

## ARQUITETURA
```
UI → Feature → Service → Repository → Provider/Supabase
```
- Frontend: React + Vite + Tailwind CSS
- Auth: Supabase Auth (adapter demo ativo)
- Database: PostgreSQL via Supabase (localStorage demo)
- Payments: Mercado Pago (adapter demo ativo)
- Deploy: Vercel (preparado)

## REGRAS
1. Nunca expor secrets no client-side
2. Service Role Key apenas server-side
3. Validação server-side obrigatória (Zod)
4. RLS em todas as tabelas
5. RBAC: admin | client
6. Mobile first
7. WCAG AA
8. Privacy by Design

## SEGURANÇA
- [x] Default deny
- [x] RBAC estruturado
- [x] Validação de input
- [x] CSP preparado
- [x] Service Role isolada
- [ ] RLS ativa (pendente Supabase)
- [ ] Rate limiting (pendente backend)
- [ ] Audit log (pendente)

## LGPD
- [x] Consentimento necessário
- [x] Consentimento marketing separado
- [x] Consentimento uso de imagem separado
- [x] Política de privacidade
- [x] Termos de uso
- [ ] Exportação de dados
- [ ] Exclusão de dados

## TESTES
- [ ] Unit tests
- [ ] Integration tests
- [ ] Security tests
- [ ] E2E tests

## QUALITY GATES
- lint: PASS
- typecheck: PASS
- build: PASS
- security: PASS (sem secrets)

## POLÍTICA DE DEPENDÊNCIAS
- Auditar antes de instalar
- Evitar pacotes abandonados
- Preferir soluções nativas
- Manter bundle pequeno

## ESTRUTURA DO PROJETO
```
src/
├── App.tsx (rotas)
├── main.tsx (entry)
├── index.css (design system)
├── components/
│   └── Layout.tsx (header, footer, whatsapp)
├── pages/
│   ├── Home.tsx
│   ├── Services.tsx
│   ├── Booking.tsx
│   ├── Login.tsx
│   ├── ClientArea.tsx
│   ├── Admin.tsx
│   ├── Contact.tsx
│   ├── Privacy.tsx
│   └── Terms.tsx
└── lib/
    ├── data.ts (dados demonstrativos)
    └── store.ts (persistência local)
```

## REGRAS DE AGENTES
1. Ler AGENTS.md primeiro
2. Ler MASTER_PLAN.md
3. Ler STATUS.md
4. Não bloquear por ausência de integração
5. Usar adapter pattern para integrações pendentes
6. Documentar decisões em ADR

## CRITÉRIOS DE CONCLUSÃO
- [x] Aplicação inicia
- [x] Home renderiza
- [x] Mobile funciona
- [x] Serviços funcionam
- [x] Agenda funciona
- [x] Área do cliente existe
- [x] Admin existe
- [x] Design System aplicado
- [x] Segurança básica implementada
- [x] Build PASS
- [x] Documentação atualizada
- [x] Nenhum secret hardcoded

## GITHUB
- Status: NOT_CONNECTED
- Branch local: main
- Preparado para: repository creation posterior
- Ver: .agent/GITHUB_HANDOFF.md
