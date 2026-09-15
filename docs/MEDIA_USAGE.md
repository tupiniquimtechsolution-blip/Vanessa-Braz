# Guia de uso das mídias — Vanessa Braz

## Acervo disponível

O repositório já contém o lote importado da pasta pública do Google Drive em:

- `apps/web/public/media/source/images/`
- `apps/web/public/media/source/videos/`
- `apps/web/public/media/source/other/`
- `apps/web/public/media/source/media-manifest.json`

O último lote importado registrou 185 arquivos: 157 imagens e 28 vídeos, sem falhas de download.

## Regra principal

Estas mídias são a fonte preferencial para a interface. Não gerar substitutos artificiais quando existir fotografia ou vídeo real adequado.

## Como selecionar

1. Consulte primeiro `media-manifest.json` para conhecer nomes, tipos e caminhos.
2. Inspecione visualmente os candidatos antes de decidir onde usá-los.
3. Escolha mídia pela função da seção, não apenas por cor.
4. Preserve os arquivos originais em `media/source`.
5. Se precisar otimização, crop, WebP/AVIF, thumbnail ou poster frame, grave derivados fora de `media/source`, por exemplo em `apps/web/public/media/optimized/`.

## Uso editorial sugerido

- Hero: fotografia real forte, com espaço negativo suficiente para o texto.
- Serviços: detalhe real de cabelo, unhas ou procedimento correspondente ao conteúdo comprovado.
- Sobre/identidade: ambiente, atendimento e bastidores reais.
- Galeria: composição variada; evitar grade uniforme de cards iguais.
- Prova visual: antes/depois apenas quando os próprios arquivos sustentarem claramente essa relação.
- Vídeo: usar como atmosfera ou demonstração real, sem autoplay com áudio.

## Logo e identidade

Use o logotipo oficial disponível no acervo quando confirmado. Não redesenhe, simplifique ou gere uma nova marca por conta própria. Se houver mais de uma versão e não for possível determinar qual é a oficial, mantenha a dúvida explícita e não escolha silenciosamente.

## Restrições

- Não inventar resultados de procedimentos.
- Não afirmar duração, preço, técnica, benefício médico ou garantia sem fonte no projeto.
- Não alterar aparência de clientes para criar resultados falsos.
- Não apagar metadados de rastreabilidade do manifesto.
- Não mover os originais para pastas de build temporárias.

## Nomes e caminhos

Os nomes originais foram preservados por rastreabilidade. No código, prefira encapsular referências de mídia em um pequeno catálogo/configuração quando houver muitas ocorrências, em vez de espalhar strings de caminhos por vários componentes.
