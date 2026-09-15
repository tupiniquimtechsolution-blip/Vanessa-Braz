#!/bin/bash

# Script de empacotamento — Vanessa Braz Checkpoint 1
# Executar localmente para gerar o pacote reproduzível

set -e

echo "📦 Empacotando Vanessa Braz — Checkpoint 1"
echo "==========================================="

# Nome do pacote
PACKAGE_NAME="vanessa-braz-checkpoint-1"
ZIP_FILE="${PACKAGE_NAME}.zip"

# Limpar artefatos anteriores
echo "🧹 Limpando artefatos..."
rm -rf node_modules dist .turbo .cache
rm -f "${ZIP_FILE}"

# Criar lista de arquivos para incluir
echo "📋 Selecionando arquivos..."

# Arquivos e pastas para incluir
FILES_TO_INCLUDE=(
  "package.json"
  "package-lock.json"
  "vite.config.js"
  "tsconfig.json"
  "index.html"
  ".env.example"
  ".gitignore"
  "AGENTS.md"
  "README.md"
  "QWEN.md"
  "CHECKPOINT_1_MANIFEST.md"
  "src/"
  "docs/"
)

# Criar arquivo temporário com lista
TEMP_LIST=$(mktemp)
for item in "${FILES_TO_INCLUDE[@]}"; do
  if [ -e "$item" ]; then
    echo "$item" >> "$TEMP_LIST"
  else
    echo "⚠️  Aviso: $item não encontrado"
  fi
done

# Criar ZIP
echo "🗜️  Criando ${ZIP_FILE}..."
zip -r "${ZIP_FILE}" -@ < "$TEMP_LIST" \
  -x "*.log" \
  -x ".DS_Store" \
  -x "Thumbs.db" \
  -x "*.env" \
  -x ".env.local" \
  -x ".env.production"

# Limpar arquivo temporário
rm -f "$TEMP_LIST"

# Verificar resultado
if [ -f "$ZIP_FILE" ]; then
  echo ""
  echo "✅ Pacote criado com sucesso!"
  echo ""
  echo "📊 Informações:"
  echo "   Arquivo: ${ZIP_FILE}"
  echo "   Tamanho: $(du -h "${ZIP_FILE}" | cut -f1)"
  echo "   Arquivos: $(zipinfo -1 "${ZIP_FILE}" | wc -l)"
  echo ""
  echo "📝 Para usar:"
  echo "   1. Descompactar: unzip ${ZIP_FILE}"
  echo "   2. Instalar dependências: npm install"
  echo "   3. Iniciar servidor: npm run dev"
  echo "   4. Acessar: http://localhost:3000"
  echo ""
  echo "📖 Documentação:"
  echo "   - CHECKPOINT_1_MANIFEST.md (informações completas)"
  echo "   - README.md (como usar)"
  echo "   - docs/MEDIA_RUNTIME_MAP.md (mapeamento de mídias)"
  echo ""
else
  echo "❌ Erro ao criar o pacote"
  exit 1
fi
