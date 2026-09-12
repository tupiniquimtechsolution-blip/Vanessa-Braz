# GITHUB_HANDOFF.md

## STATUS
NOT_CONNECTED — Preparado para conexão futura

## REPOSITÓRIO RECOMENDADO
- Nome: `vanessa-braz-beleza-autoestima`
- Visibilidade: Private (recomendado)
- Branch padrão: `main`

## BRANCH LOCAL
- Branch atual: `main`
- Commits locais: prontos para push

## COMANDOS FUTUROS (NÃO EXECUTAR AGORA)
```bash
# Adicionar remote
git remote add origin <REPOSITORY_URL>

# Fetch
git fetch origin

# Push inicial
git push -u origin main

# Branch de desenvolvimento
git checkout -b dev
git push -u origin dev
```

## ARQUIVOS IMPORTANTES
- AGENTS.md — Regras e governança
- README.md — Documentação principal
- .env.example — Variáveis de ambiente
- .gitignore — Ignorados
- .agent/MASTER_PLAN.md — Plano de implementação
- .github/ — Workflows e templates (preparados)

## VARIÁVEIS NECESSÁRIAS (GitHub Secrets)
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- MERCADOPAGO_ACCESS_TOKEN
- MERCADOPAGO_WEBHOOK_SECRET

## QUALITY GATES
- [x] Build PASS
- [x] Typecheck PASS
- [x] Sem secrets hardcoded
- [x] .gitignore configurado
- [x] .env.example presente
- [x] README completo
- [x] AGENTS.md presente

## PENDÊNCIAS
- [ ] Configurar Supabase
- [ ] Configurar Mercado Pago
- [ ] Definir domínio
- [ ] Criar repositório GitHub
- [ ] Configurar Vercel
- [ ] Setup CI/CD

## DEPLOY
- Plataforma: Vercel (recomendado)
- Framework: Vite
- Build command: `npm run build`
- Output: `dist/`

## INSTRUÇÕES
1. Criar repositório no GitHub
2. Adicionar remote origin
3. Push branch main
4. Configurar Secrets no GitHub
5. Conectar Vercel ao repositório
6. Configurar variáveis na Vercel
7. Deploy!
