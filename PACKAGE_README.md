# Vanessa Braz — Checkpoint 1 (Frontend MVP)

Pacote reproduzível do frontend premium com mídias reais integradas.

## 📦 O que está incluído

- ✅ Frontend completo (React + TypeScript + Tailwind)
- ✅ Design System premium (sem aparência de template de IA)
- ✅ 10 páginas funcionais
- ✅ Catálogo de mídias reais (24 imagens + 4 vídeos do acervo)
- ✅ Motor de agendamento (5 passos)
- ✅ Área do cliente (demo)
- ✅ Painel administrativo (demo)
- ✅ LGPD compliance (política, termos, consentimentos)
- ✅ Documentação completa

## 🚀 Como usar

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar servidor de desenvolvimento
```bash
npm run dev
```

### 3. Acessar no navegador
```
http://localhost:3000
```

## 📋 Comandos disponíveis

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run preview    # Preview do build
npm run typecheck  # Verificação de tipos
```

## 🗺️ Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Home premium editorial |
| `/servicos` | Catálogo de serviços |
| `/galeria` | Portfolio com acervo real |
| `/agendar` | Motor de agendamento |
| `/login` | Autenticação (demo) |
| `/minha-conta` | Área do cliente |
| `/admin` | Painel administrativo |
| `/contato` | Contato |
| `/politica-de-privacidade` | LGPD |
| `/termos` | Termos de uso |

## 🎨 Design System

- **Paleta:** Preto profundo, rosé sofisticado, dourado quente, cream
- **Tipografia:** Playfair Display (display) + Inter (corpo)
- **Estilo:** Editorial, premium, sem glassmorphism/gradientes genéricos
- **Animações:** Discretas, respeitam prefers-reduced-motion

## 📸 Mídias

As mídias são carregadas via URLs do GitHub (repositório público):
- **Acervo total:** 185 arquivos (157 imagens + 28 vídeos)
- **Referenciadas no código:** 43 mídias
- **Fonte:** `tupiniquimtechsolution-blip/Vanessa-Braz`

Ver `docs/MEDIA_RUNTIME_MAP.md` para detalhes completos.

## 🔐 Credenciais Demo

### Admin
- Email: `admin@demo.com`
- Senha: `admin123`

### Cliente
- Qualquer email/senha (4+ caracteres)

## ⚠️ Limitações Conhecidas

1. **Auth em modo demo** — Usa localStorage, não Supabase
2. **Database em modo demo** — Usa localStorage, não PostgreSQL
3. **Pagamentos não implementados** — Adapter demo preparado
4. **Dados comerciais pendentes** — Preços, horários, endereço são demonstrativos
5. **URLs das mídias** — Dependem do repositório GitHub público

## 🔧 Próximos Passos

1. Conectar Supabase (auth + database)
2. Integrar Mercado Pago (pagamentos)
3. Implementar testes automatizados
4. Deploy em Vercel/Netlify
5. Conectar repositório GitHub

## 📖 Documentação

- `CHECKPOINT_1_MANIFEST.md` — Manifesto completo do checkpoint
- `QWEN.md` — Briefing persistente do projeto
- `AGENTS.md` — Regras e governança
- `docs/DESIGN_DIRECTION.md` — Direção visual
- `docs/MEDIA_USAGE.md` — Guia de uso das mídias
- `docs/MEDIA_RUNTIME_MAP.md` — Mapa de mídias em runtime

## 🛠️ Stack

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 4
- React Router DOM 6
- Lucide React (ícones)
- Framer Motion (animações)

## 📝 Notas

- Este pacote é 100% reproduzível
- Não inclui `node_modules` ou `dist`
- Não inclui secrets ou credenciais reais
- Mídias são carregadas via URLs externas (GitHub)

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verificar `CHECKPOINT_1_MANIFEST.md`
2. Consultar `docs/MEDIA_RUNTIME_MAP.md`
3. Revisar `QWEN.md` e `AGENTS.md`

---

**Versão:** Checkpoint 1
**Status:** ✅ APROVADO — Frontend premium com mídias reais
**Data:** 2026-01-XX
