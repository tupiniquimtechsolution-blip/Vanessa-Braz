# Media Audit — Vanessa Braz

- Status estrutural: **PASS**
- Manifests: **7**
- Derivados auditados: **157 / 157**
- Usos atuais do frontend mapeados: **40 / 40**
- Grupos de conteúdo original duplicado: **2**
- Web maiores que o JPEG original: **63**
- Web >20% maiores que o original: **26**
- Peso total source: **15.36 MiB**
- Peso total web: **15.29 MiB** (-0.47%)
- Peso total enhanced: **43.83 MiB** (+185.36%)

## Regra de integração proposta

- `hero`: usar `enhanced` somente quando o arquivo ficar <= 1.25 MB e trouxer resolução útil; fallback no original.
- `gallery`, `details`, `environment`: usar `web` por padrão; `enhanced` somente após gate visual explícito.
- Não publicar imagem com pessoa identificável sem confirmação de autorização; presença no repositório não é consentimento.
- Não remover nem substituir `media/source`.

## Duplicatas exatas por conteúdo

- `03dedfbb2c96…`: `apps/web/public/media/source/images/WhatsApp Image 2026-09-12 at 10.26.44 (1).jpeg`; `apps/web/public/media/source/images/WhatsApp Image 2026-09-12 at 10.26.44.jpeg`
- `c1686bf93e6c…`: `apps/web/public/media/source/images/WhatsApp Image 2026-09-12 at 10.26.47 (2).jpeg`; `apps/web/public/media/source/images/WhatsApp Image 2026-09-12 at 10.26.48.jpeg`

## Mapeamento atual do frontend

- **hero #1** `WhatsApp Image 2026-09-12 at 10.23.51.jpeg` → `/media/optimized/enhanced/WhatsApp-Image-2026-09-12-at-10.23.51-121a8bba.webp` (**enhanced**, 2508×2508, 679.5 KiB)
- **hero #2** `WhatsApp Image 2026-09-12 at 10.24.30.jpeg` → `/media/optimized/enhanced/WhatsApp-Image-2026-09-12-at-10.24.30-df8e25a1.webp` (**enhanced**, 1920×2560, 555.1 KiB)
- **gallery #1** `WhatsApp Image 2026-09-12 at 10.26.30.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.30-606cc281.webp` (**web**, 960×1280, 148.6 KiB)
- **gallery #2** `WhatsApp Image 2026-09-12 at 10.26.31.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.31-d476f468.webp` (**web**, 1280×960, 114.8 KiB)
- **gallery #3** `WhatsApp Image 2026-09-12 at 10.26.32.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.32-bde00ee6.webp` (**web**, 960×1280, 110.4 KiB)
- **gallery #4** `WhatsApp Image 2026-09-12 at 10.26.34.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.34-a54adf88.webp` (**web**, 1254×1254, 147.8 KiB)
- **gallery #5** `WhatsApp Image 2026-09-12 at 10.26.35.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.35-c4f9f102.webp` (**web**, 851×1280, 183.4 KiB)
- **gallery #6** `WhatsApp Image 2026-09-12 at 10.26.38.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.38-799dfd8a.webp` (**web**, 960×1280, 175.1 KiB)
- **gallery #7** `WhatsApp Image 2026-09-12 at 10.26.39 (1).jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.39-1-11d9d252.webp` (**web**, 960×1280, 274.4 KiB)
- **gallery #8** `WhatsApp Image 2026-09-12 at 10.26.42.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.42-47d7cd6f.webp` (**web**, 960×1280, 181.7 KiB)
- **gallery #9** `WhatsApp Image 2026-09-12 at 10.26.45.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.45-a928af47.webp` (**web**, 853×1280, 240.8 KiB)
- **gallery #10** `WhatsApp Image 2026-09-12 at 10.26.47 (1).jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.47-1-97ffd28d.webp` (**web**, 960×1280, 173.9 KiB)
- **gallery #11** `WhatsApp Image 2026-09-12 at 10.26.50.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.50-60105930.webp` (**web**, 960×1280, 322.0 KiB)
- **gallery #12** `WhatsApp Image 2026-09-12 at 10.26.52.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.52-6435adab.webp` (**web**, 960×1280, 131.4 KiB)
- **gallery #13** `WhatsApp Image 2026-09-12 at 10.53.04.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.04-8e7252c4.webp` (**web**, 960×1280, 57.5 KiB)
- **gallery #14** `WhatsApp Image 2026-09-12 at 10.53.07.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.07-078bc554.webp` (**web**, 1280×960, 119.1 KiB)
- **gallery #15** `WhatsApp Image 2026-09-12 at 10.53.29.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.29-f75a326d.webp` (**web**, 960×1280, 55.6 KiB)
- **gallery #16** `WhatsApp Image 2026-09-12 at 10.53.34.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.34-ba230c0d.webp` (**web**, 960×1280, 161.5 KiB)
- **gallery #17** `WhatsApp Image 2026-09-12 at 10.53.38.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.38-fd056810.webp` (**web**, 722×1114, 20.1 KiB)
- **gallery #18** `WhatsApp Image 2026-09-12 at 10.53.44.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.44-e7aa07c8.webp` (**web**, 889×759, 37.5 KiB)
- **gallery #19** `WhatsApp Image 2026-09-12 at 10.53.45.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.45-7207267a.webp` (**web**, 1080×1275, 59.4 KiB)
- **gallery #20** `WhatsApp Image 2026-09-12 at 10.53.48.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.48-8112dfbb.webp` (**web**, 774×1032, 97.8 KiB)
- **details #1** `WhatsApp Image 2026-09-12 at 10.26.30 (1).jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.30-1-fc3283cf.webp` (**web**, 1280×960, 105.8 KiB)
- **details #2** `WhatsApp Image 2026-09-12 at 10.26.32 (1).jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.32-1-8e7b7802.webp` (**web**, 1280×960, 94.7 KiB)
- **details #3** `WhatsApp Image 2026-09-12 at 10.26.33.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.33-a1b70797.webp` (**web**, 960×1280, 61.6 KiB)
- **details #4** `WhatsApp Image 2026-09-12 at 10.26.36.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.36-dc1b7dd0.webp` (**web**, 960×1280, 50.0 KiB)
- **details #5** `WhatsApp Image 2026-09-12 at 10.26.40.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.40-47b249e5.webp` (**web**, 960×1280, 101.7 KiB)
- **details #6** `WhatsApp Image 2026-09-12 at 10.26.43.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.43-bf400f40.webp` (**web**, 960×1280, 96.6 KiB)
- **details #7** `WhatsApp Image 2026-09-12 at 10.26.46.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.46-8227416d.webp` (**web**, 1280×960, 55.6 KiB)
- **details #8** `WhatsApp Image 2026-09-12 at 10.26.49.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.49-51c5243a.webp` (**web**, 1280×960, 115.8 KiB)
- **details #9** `WhatsApp Image 2026-09-12 at 10.26.51.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.51-73104450.webp` (**web**, 960×1280, 210.3 KiB)
- **details #10** `WhatsApp Image 2026-09-12 at 10.26.54.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.54-022828e2.webp` (**web**, 960×1280, 79.8 KiB)
- **environment #1** `WhatsApp Image 2026-09-12 at 10.53.05.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.05-c6b7d30e.webp` (**web**, 960×1280, 63.2 KiB)
- **environment #2** `WhatsApp Image 2026-09-12 at 10.53.06.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.06-3d66cfa0.webp` (**web**, 960×1280, 81.1 KiB)
- **environment #3** `WhatsApp Image 2026-09-12 at 10.53.08.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.08-13804368.webp` (**web**, 1280×1280, 62.9 KiB)
- **environment #4** `WhatsApp Image 2026-09-12 at 10.53.09.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.09-b128d12e.webp` (**web**, 960×1280, 56.4 KiB)
- **environment #5** `WhatsApp Image 2026-09-12 at 10.53.30.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.30-989d7b9a.webp` (**web**, 960×1280, 49.8 KiB)
- **environment #6** `WhatsApp Image 2026-09-12 at 10.53.31.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.31-017738a3.webp` (**web**, 960×1280, 69.5 KiB)
- **environment #7** `WhatsApp Image 2026-09-12 at 10.53.32.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.32-dfb6b026.webp` (**web**, 960×1280, 68.2 KiB)
- **environment #8** `WhatsApp Image 2026-09-12 at 10.53.33.jpeg` → `/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.33-c5f8bdd5.webp` (**web**, 960×1280, 57.7 KiB)

## Gate visual ainda necessário

Este relatório valida estrutura, hash, dimensões, peso e mapeamento. Ele **não** aprova aparência visual. Antes da integração, comparar original × web × enhanced para halos, oversharpening, pele artificial, mudança de cor, cabelo/detalhes e artefatos de reamostragem.
