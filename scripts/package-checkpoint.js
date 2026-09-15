#!/usr/bin/env node

/**
 * Script de empacotamento — Vanessa Braz Checkpoint 1
 * Executar: node scripts/package-checkpoint.js
 * 
 * Este script cria um ZIP com todos os arquivos necessários para
 * reconstruir o frontend em qualquer ambiente.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PACKAGE_NAME = 'vanessa-braz-checkpoint-1';
const ZIP_FILE = `${PACKAGE_NAME}.zip`;

console.log('📦 Empacotando Vanessa Braz — Checkpoint 1');
console.log('===========================================\n');

// Arquivos e pastas para incluir
const FILES_TO_INCLUDE = [
  'package.json',
  'package-lock.json',
  'vite.config.js',
  'tsconfig.json',
  'index.html',
  '.env.example',
  '.gitignore',
  'AGENTS.md',
  'README.md',
  'QWEN.md',
  'CHECKPOINT_1_MANIFEST.md',
  'PACKAGE_README.md',
  'src',
  'docs',
];

// Verificar se arquivos existem
console.log('📋 Verificando arquivos...');
const missingFiles = [];
for (const file of FILES_TO_INCLUDE) {
  if (!fs.existsSync(file)) {
    missingFiles.push(file);
    console.log(`   ⚠️  ${file} não encontrado`);
  } else {
    console.log(`   ✅ ${file}`);
  }
}

if (missingFiles.length > 0) {
  console.log(`\n❌ Arquivos faltando: ${missingFiles.join(', ')}`);
  process.exit(1);
}

// Limpar artefatos anteriores
console.log('\n🧹 Limpando artefatos...');
try {
  execSync('rm -rf node_modules dist .turbo .cache', { stdio: 'ignore' });
  console.log('   ✅ Limpo');
} catch (e) {
  console.log('   ⚠️  Alguns artefatos não foram removidos');
}

// Remover ZIP anterior
if (fs.existsSync(ZIP_FILE)) {
  fs.unlinkSync(ZIP_FILE);
  console.log(`   ✅ ${ZIP_FILE} removido`);
}

// Criar ZIP
console.log(`\n🗜️  Criando ${ZIP_FILE}...`);
try {
  const filesList = FILES_TO_INCLUDE.join(' ');
  execSync(`zip -r "${ZIP_FILE}" ${filesList} -x "*.log" -x ".DS_Store" -x "Thumbs.db" -x "*.env" -x ".env.local" -x ".env.production"`, {
    stdio: 'pipe'
  });
  console.log(`   ✅ ${ZIP_FILE} criado`);
} catch (e) {
  console.error('❌ Erro ao criar ZIP:', e.message);
  process.exit(1);
}

// Verificar resultado
if (fs.existsSync(ZIP_FILE)) {
  const stats = fs.statSync(ZIP_FILE);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
  
  console.log('\n✅ Pacote criado com sucesso!\n');
  console.log('📊 Informações:');
  console.log(`   Arquivo: ${ZIP_FILE}`);
  console.log(`   Tamanho: ${sizeMB} MB`);
  
  try {
    const fileCount = execSync(`zipinfo -1 "${ZIP_FILE}" | wc -l`, { encoding: 'utf8' }).trim();
    console.log(`   Arquivos: ${fileCount}`);
  } catch (e) {
    console.log('   Arquivos: (não foi possível contar)');
  }
  
  console.log('\n📝 Para usar:');
  console.log(`   1. Descompactar: unzip ${ZIP_FILE}`);
  console.log('   2. Instalar dependências: npm install');
  console.log('   3. Iniciar servidor: npm run dev');
  console.log('   4. Acessar: http://localhost:3000');
  
  console.log('\n📖 Documentação:');
  console.log('   - CHECKPOINT_1_MANIFEST.md (informações completas)');
  console.log('   - PACKAGE_README.md (como usar)');
  console.log('   - docs/MEDIA_RUNTIME_MAP.md (mapeamento de mídias)');
  console.log('');
} else {
  console.error('❌ Erro: ZIP não foi criado');
  process.exit(1);
}
