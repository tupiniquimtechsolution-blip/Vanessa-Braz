# Vanessa Braz — Beleza & Autoestima

> Aplicação web profissional para gestão de beleza e autoestima com agendamento online, área do cliente e painel administrativo.

## 🎯 Objetivo

Fornecer uma experiência digital completa para clientes e administradores, incluindo:
- Site público com apresentação de serviços
- Motor de agendamento online
- Área do cliente com histórico
- Painel administrativo completo
- Conformidade com LGPD
- Pagamentos online (sandbox/produção)

## ✨ Funcionalidades

### Público
- ✅ Home com hero, serviços, depoimentos, FAQ
- ✅ Catálogo de serviços com filtro por categoria
- ✅ Motor de agendamento em 5 passos
- ✅ WhatsApp flutuante
- ✅ Política de privacidade e termos
- ✅ Mobile first + acessibilidade

### Cliente
- ✅ Login/Cadastro
- ✅ Área do cliente
- ✅ Visualização de agendamentos
- ✅ Cancelamento de agendamentos
- ✅ Histórico

### Admin
- ✅ Dashboard com métricas
- ✅ Gestão de agendamentos
- ✅ Confirmação/cancelamento
- ✅ Visualização de clientes
- ✅ Lista de serviços
- ✅ Configurações

## 🛠 Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 6 |
| Icons | Lucide React |
| Animation | Framer Motion |
| Auth | Supabase Auth (adapter demo) |
| Database | PostgreSQL/Supabase (localStorage demo) |
| Payments | Mercado Pago (adapter demo) |
| Deploy | Vercel (preparado) |

## 📁 Estrutura

```
src/
├── App.tsx              # Rotas principais
├── main.tsx             # Entry point
├── index.css            # Design System (tokens)
├── components/
│   └── Layout.tsx       # Header, Footer, WhatsApp
├── pages/
│   ├── Home.tsx         # Página inicial
│   ├── Services.tsx     # Catálogo de serviços
│   ├── Booking.tsx      # Motor de agendamento
│   ├── Login.tsx        # Autenticação
│   ├── ClientArea.tsx   # Área do cliente
│   ├── Admin.tsx        # Painel administrativo
│   ├── Contact.tsx      # Contato
│   ├── Privacy.tsx      # Política de privacidade
│   └── Terms.tsx        # Termos de uso
└── lib/
    ├── data.ts          # Dados demonstrativos
    └── store.ts         # Persistência local (demo)
```

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build produção
npm run build

# Typecheck
npm run typecheck
```

## 🔐 Variáveis de Ambiente

Copie `.env.example` para `.env`:

```env
NODE_ENV=development
DEMO_MODE=true
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (pendente configuração)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Mercado Pago (pendente configuração)
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_WEBHOOK_SECRET=
```

## 🧪 Testes

```bash
npm run typecheck  # Verificação de tipos
npm run build      # Build de produção
```

## 🔒 Segurança

- ✅ Service Role Key isolada (server-side only)
- ✅ RBAC estruturado (admin | client)
- ✅ Validação de input
- ✅ Consentimento LGPD
- ✅ Nenhum secret hardcoded
- ⏳ RLS (pendente Supabase)
- ⏳ Rate limiting (pendente backend)
- ⏳ CSP headers (pendente deploy)

## 📋 LGPD

- ✅ Consentimento necessário
- ✅ Consentimento marketing (separado)
- ✅ Consentimento uso de imagem (separado)
- ✅ Política de privacidade
- ✅ Termos de uso
- ⏳ Exportação de dados
- ⏳ Exclusão de conta

## 📊 Status

| Componente | Status |
|-----------|--------|
| Frontend | ✅ Funcional |
| Design System | ✅ Completo |
| Routing | ✅ Funcional |
| Auth | ⚠️ Demo Mode |
| Database | ⚠️ LocalStorage |
| Payments | ⏳ Pendente |
| Supabase | ⏳ Pendente |
| Deploy | ⏳ Preparado |

## 🗺 Roadmap

1. ✅ Design System
2. ✅ Site público
3. ✅ Motor de agendamento
4. ✅ Área do cliente
5. ✅ Painel admin
6. ⏳ Conectar Supabase
7. ⏳ Auth real
8. ⏳ Mercado Pago sandbox
9. ⏳ Testes automatizados
10. ⏳ Deploy Vercel
11. ⏳ GitHub repository

## 📝 Demo

**Admin:** admin@demo.com / admin123  
**Cliente:** qualquer e-mail/senha (4+ caracteres)  
**Modo:** DEMO_MODE=true (dados em localStorage)

## 📄 Licença

Privado — Vanessa Braz — Beleza & Autoestima

---

*Projeto desenvolvido seguindo padrões Tupiniquim de arquitetura, segurança e governança.*
