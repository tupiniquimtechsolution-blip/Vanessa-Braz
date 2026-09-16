# Vanessa Braz — Automação de mídia em lotes

## Objetivo

Processar cópias derivadas das imagens reais sem alterar, apagar ou substituir o acervo-fonte em `apps/web/public/media/source/images/`.

Esta automação foi isolada da branch ativa do Arena. Ela deve permanecer na branch `media/automated-image-pipeline` até a conclusão e auditoria do trabalho em `arena/01a0a695-vanessa-braz`.

## Saídas

- `apps/web/public/media/optimized/web/`: derivados WebP para uso normal no frontend. O pipeline reduz imagens grandes para até 1920 px no maior lado e nunca amplia imagens pequenas nessa variante.
- `apps/web/public/media/optimized/enhanced/`: derivados WebP de alta qualidade, limitados por padrão a 3840 px no maior lado e a no máximo 2x a resolução linear da fonte.
- `apps/web/public/media/optimized/manifests/`: rastreabilidade por lote, incluindo SHA-256 da origem e dos derivados, dimensões e tamanhos.

## Importante sobre "4K"

A variante `enhanced` usa LANCZOS e sharpening conservador. Isso é reamostragem determinística, não super-resolução por IA. Ela pode aumentar dimensões e melhorar apresentação após resize, mas não deve ser descrita como recuperação de detalhes que não existiam na foto original.

Para super-resolução real por IA, usar futuramente um runner dedicado/GPU e manter a saída em uma pasta distinta, por exemplo `optimized/ai-4k/`. Não misturar esse resultado com o pipeline determinístico.

## Execução por lote

Os lotes são declarados em `media-batches/*.json`. A automação aceita até 50 arquivos por lote; 10 a 25 é o intervalo recomendado para revisão visual.

Exemplo de configuração:

```json
{
  "batch_id": "batch-001",
  "source": {
    "root": "apps/web/public/media/source/images",
    "extensions": [".jpg", ".jpeg", ".png", ".webp"],
    "offset": 0,
    "limit": 20
  },
  "web": {
    "enabled": true,
    "long_edge": 1920,
    "quality": 86
  },
  "enhanced": {
    "enabled": true,
    "long_edge": 3840,
    "quality": 92,
    "max_scale": 2.0
  }
}
```

Adicionar ou alterar um JSON de lote na branch `media/automated-image-pipeline` dispara o workflow `.github/workflows/optimize-media-batch.yml`.

## Regras de segurança

1. Nunca editar arquivos dentro de `media/source`.
2. Nunca processar vídeos neste workflow.
3. Nunca alterar frontend, `QWEN.md`, backend, banco, auth, payments ou arquivos do checkpoint como efeito colateral de um lote de mídia.
4. Nunca fazer push em `main` ou em `arena/01a0a695-vanessa-braz` a partir do workflow de mídia.
5. O workflow só pode publicar de volta em `media/automated-image-pipeline`.
6. Cada lote deve gerar manifesto para permitir auditoria e rollback.
7. Revisar visualmente uma amostra antes de integrar derivados ao frontend.

## Integração futura com Qwen/Arena

O `QWEN.md` atual já exige preservar as mídias reais, usar `apps/web/public/media/source/` como fonte de verdade e otimizar imagens sem apagar os originais. Quando o PR #2 estiver concluído e auditado, a integração pode acrescentar a preferência por `optimized/web` no frontend sem substituir a fonte original.

Não alterar `QWEN.md` enquanto a branch Arena estiver sob correções ativas, para reduzir risco de conflito.
