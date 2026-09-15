# Instruções de Empacotamento — Vanessa Braz Checkpoint 1

Este documento explica como criar o pacote reproduzível do frontend.

## Método 1: Script Automático (Recomendado)

### No Linux/macOS:
```bash
chmod +x scripts/package-checkpoint.sh
./scripts/package-checkpoint.sh
```

### No Windows (com Node.js):
```bash
node scripts/package-checkpoint.js
```

### Em qualquer sistema (com Node.js):
```bash
node scripts/package-checkpoint.js
```

## Método 2: Manual

### Passo 1: Limpar artefatos
```bash
rm -rf node_modules dist .turbo .cache
```

### Passo 2: Criar ZIP (Linux/macOS)
```bash
zip -r vanessa-braz-checkpoint-1.zip \
  package.json \
  package-lock.json \
  vite.config.js \
  tsconfig.json \
  index.html \
  .env.example \
  .gitignore \
  AGENTS.md \
  README.md \
  QWEN.md \
  CHECKPOINT_1_MANIFEST.md \
  PACKAGE_README.md \
  src/ \
  docs/
```

### Passo 2: Criar ZIP (Windows PowerShell)
```powershell
Compress-Archive -Path `
  package.json, `
  package-lock.json, `
  vite.config.js, `
  tsconfig.json, `
  index.html, `
  .env.example, `
  .gitignore, `
  AGENTS.md, `
  README.md, `
  QWEN.md, `
  CHECKPOINT_1_MANIFEST.md, `
  PACKAGE_README.md, `
  src, `
  docs `
  -DestinationPath vanessa-braz-checkpoint-1.zip
```

### Passo 2: Criar TAR.GZ (alternativa)
```bash
tar -czvf vanessa-braz-checkpoint-1.tar.gz \
  package.json \
  package-lock.json \
  vite.config.js \
  tsconfig.json \
  index.html \
  .env.example \
  .gitignore \
  AGENTS.md \
  README.md \
  QWEN.md \
  CHECKPOINT_1_MANIFEST.md \
  PACKAGE_README.md \
  src/ \
  docs/
```

## Método 3: Copiar Manualmente

Se nenhum script funcionar, copie manualmente estes arquivos para uma nova pasta:

```
vanessa-braz-checkpoint-1/
├── package.json
├── package-lock.json
├── vite.config.js
├── tsconfig.json
├── index.html
├── .env.example
├── .gitignore
├── AGENTS.md
├── README.md
├── QWEN.md
├── CHECKPOINT_1_MANIFEST.md
├── PACKAGE_README.md
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── components/
│   │   ├── Layout.tsx
│   │   └── Gallery.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Services.tsx
│   │   ├── Gallery.tsx
│   │   ├── Booking.tsx
│   │   ├── Login.tsx
│   │   ├── ClientArea.tsx
│   │   ├── Admin.tsx
│   │   ├── Contact.tsx
│   │   ├── Privacy.tsx
│   │   └── Terms.tsx
│   └── lib/
│       ├── data.ts
│       ├── media.ts
│       └── store.ts
└── docs/
    ├── DESIGN_DIRECTION.md
    ├── MEDIA_USAGE.md
    ├── MEDIA_RUNTIME_MAP.md
    └── PHOTO_INTEGRATION.md
```

## Verificação do Pacote

Após criar o pacote, verifique:

```bash
# Listar conteúdo
unzip -l vanessa-braz-checkpoint-1.zip

# Verificar tamanho
ls -lh vanessa-braz-checkpoint-1.zip

# Verificar se não contém arquivos sensíveis
unzip -l vanessa-braz-checkpoint-1.zip | grep -E "(node_modules|dist|\.env$|\.git)"
# Deve retornar vazio
```

## Checklist de Validação

- [ ] `package.json` está presente
- [ ] `src/` está presente
- [ ] `docs/` está presente
- [ ] `CHECKPOINT_1_MANIFEST.md` está presente
- [ ] `docs/MEDIA_RUNTIME_MAP.md` está presente
- [ ] NÃO contém `node_modules/`
- [ ] NÃO contém `dist/`
- [ ] NÃO contém `.env` (apenas `.env.example`)
- [ ] NÃO contém `.git/`
- [ ] NÃO contém secrets ou credenciais

## Como Usar o Pacote

### 1. Descompactar
```bash
unzip vanessa-braz-checkpoint-1.zip
cd vanessa-braz-checkpoint-1
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Iniciar servidor
```bash
npm run dev
```

### 4. Acessar
```
http://localhost:3000
```

## Notas Importantes

1. **Mídias:** As imagens são carregadas via URLs do GitHub (repositório público)
2. **Auth:** Em modo demo (localStorage), não Supabase
3. **Database:** Em modo demo (localStorage), não PostgreSQL
4. **Pagamentos:** Não implementados, apenas adapter demo

## Solução de Problemas

### Erro: "zip: command not found"
**Solução:** Instale o zip ou use o script Node.js:
```bash
node scripts/package-checkpoint.js
```

### Erro: "Permission denied"
**Solução:** Dê permissão de execução:
```bash
chmod +x scripts/package-checkpoint.sh
```

### Erro: "Cannot find module"
**Solução:** Execute `npm install` após descompactar

### Mídias não carregam
**Solução:** Verifique conexão com internet (mídias vêm do GitHub)

## Suporte

Para mais informações, consulte:
- `CHECKPOINT_1_MANIFEST.md` — Manifesto completo
- `PACKAGE_README.md` — Guia de uso
- `docs/MEDIA_RUNTIME_MAP.md` — Mapeamento de mídias
