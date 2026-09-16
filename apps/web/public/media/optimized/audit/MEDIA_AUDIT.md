# Media Audit — Vanessa Braz — WEB-v2

- Status: **PASS**
- Manifests: **7 / 7**
- Sources auditados: **157 / 157**
- Frontend mapeado: **40 / 40**
- Source total: **15.36 MiB**
- WEB antigo: **15.29 MiB**
- WEB novo: **10.40 MiB**
- Economia vs WEB antigo: **31.97%**
- Recomendado WEB: **157**
- Recomendado ORIGINAL: **0**
- WEB menor que source: **157**
- WEB maior que source: **0**
- WEB >20% maior: **0**
- Qualidades: **q82=149, q78=8, q74=0, q70=0**
- Frontend: **web=40, original=0, enhanced candidates=2**
- Duplicatas exatas: **2 grupos**

## Política

- `recommended_variant=web` somente com economia >=10% contra o source.
- Caso contrário, `recommended_variant=original`; um derivado maior nunca é chamado de otimizado.
- WEB nunca faz upscale e respeita long edge máximo de 1280 px.
- `enhanced` foi preservado; apenas os dois heros definidos permanecem candidatos e ainda exigem gate visual.
- Imagens com pessoas identificáveis continuam pendentes de autorização de publicação.

## Duplicatas e canonical_source

- `03dedfbb2c96…` → canonical `apps/web/public/media/source/images/WhatsApp Image 2026-09-12 at 10.26.44 (1).jpeg`; paths: `apps/web/public/media/source/images/WhatsApp Image 2026-09-12 at 10.26.44 (1).jpeg`; `apps/web/public/media/source/images/WhatsApp Image 2026-09-12 at 10.26.44.jpeg`
- `c1686bf93e6c…` → canonical `apps/web/public/media/source/images/WhatsApp Image 2026-09-12 at 10.26.47 (2).jpeg`; paths: `apps/web/public/media/source/images/WhatsApp Image 2026-09-12 at 10.26.47 (2).jpeg`; `apps/web/public/media/source/images/WhatsApp Image 2026-09-12 at 10.26.48.jpeg`

## Mapeamento atual do frontend

- **hero #1** `WhatsApp Image 2026-09-12 at 10.23.51.jpeg` → **web** (+21.12%, q78); enhanced candidato após gate visual
- **hero #2** `WhatsApp Image 2026-09-12 at 10.24.30.jpeg` → **web** (+15.69%, q82); enhanced candidato após gate visual
- **gallery #1** `WhatsApp Image 2026-09-12 at 10.26.30.jpeg` → **web** (+23.26%, q82)
- **gallery #2** `WhatsApp Image 2026-09-12 at 10.26.31.jpeg` → **web** (+28.67%, q82)
- **gallery #3** `WhatsApp Image 2026-09-12 at 10.26.32.jpeg` → **web** (+28.80%, q82)
- **gallery #4** `WhatsApp Image 2026-09-12 at 10.26.34.jpeg` → **web** (+22.84%, q82)
- **gallery #5** `WhatsApp Image 2026-09-12 at 10.26.35.jpeg` → **web** (+21.78%, q82)
- **gallery #6** `WhatsApp Image 2026-09-12 at 10.26.38.jpeg` → **web** (+17.75%, q82)
- **gallery #7** `WhatsApp Image 2026-09-12 at 10.26.39 (1).jpeg` → **web** (+14.00%, q78)
- **gallery #8** `WhatsApp Image 2026-09-12 at 10.26.42.jpeg` → **web** (+18.06%, q82)
- **gallery #9** `WhatsApp Image 2026-09-12 at 10.26.45.jpeg` → **web** (+14.38%, q82)
- **gallery #10** `WhatsApp Image 2026-09-12 at 10.26.47 (1).jpeg` → **web** (+21.79%, q82)
- **gallery #11** `WhatsApp Image 2026-09-12 at 10.26.50.jpeg` → **web** (+12.34%, q78)
- **gallery #12** `WhatsApp Image 2026-09-12 at 10.26.52.jpeg` → **web** (+27.36%, q82)
- **gallery #13** `WhatsApp Image 2026-09-12 at 10.53.04.jpeg` → **web** (+41.03%, q82)
- **gallery #14** `WhatsApp Image 2026-09-12 at 10.53.07.jpeg` → **web** (+28.80%, q82)
- **gallery #15** `WhatsApp Image 2026-09-12 at 10.53.29.jpeg` → **web** (+40.24%, q82)
- **gallery #16** `WhatsApp Image 2026-09-12 at 10.53.34.jpeg` → **web** (+22.94%, q82)
- **gallery #17** `WhatsApp Image 2026-09-12 at 10.53.38.jpeg` → **web** (+51.02%, q82)
- **gallery #18** `WhatsApp Image 2026-09-12 at 10.53.44.jpeg` → **web** (+88.81%, q82)
- **gallery #19** `WhatsApp Image 2026-09-12 at 10.53.45.jpeg` → **web** (+90.14%, q82)
- **gallery #20** `WhatsApp Image 2026-09-12 at 10.53.48.jpeg` → **web** (+20.73%, q82)
- **details #1** `WhatsApp Image 2026-09-12 at 10.26.30 (1).jpeg` → **web** (+29.04%, q82)
- **details #2** `WhatsApp Image 2026-09-12 at 10.26.32 (1).jpeg` → **web** (+29.60%, q82)
- **details #3** `WhatsApp Image 2026-09-12 at 10.26.33.jpeg` → **web** (+40.48%, q82)
- **details #4** `WhatsApp Image 2026-09-12 at 10.26.36.jpeg` → **web** (+39.08%, q82)
- **details #5** `WhatsApp Image 2026-09-12 at 10.26.40.jpeg` → **web** (+31.34%, q82)
- **details #6** `WhatsApp Image 2026-09-12 at 10.26.43.jpeg` → **web** (+34.68%, q82)
- **details #7** `WhatsApp Image 2026-09-12 at 10.26.46.jpeg` → **web** (+39.86%, q82)
- **details #8** `WhatsApp Image 2026-09-12 at 10.26.49.jpeg` → **web** (+28.25%, q82)
- **details #9** `WhatsApp Image 2026-09-12 at 10.26.51.jpeg` → **web** (+15.64%, q82)
- **details #10** `WhatsApp Image 2026-09-12 at 10.26.54.jpeg` → **web** (+34.82%, q82)
- **environment #1** `WhatsApp Image 2026-09-12 at 10.53.05.jpeg` → **web** (+38.48%, q82)
- **environment #2** `WhatsApp Image 2026-09-12 at 10.53.06.jpeg` → **web** (+36.39%, q82)
- **environment #3** `WhatsApp Image 2026-09-12 at 10.53.08.jpeg` → **web** (+41.08%, q82)
- **environment #4** `WhatsApp Image 2026-09-12 at 10.53.09.jpeg` → **web** (+39.23%, q82)
- **environment #5** `WhatsApp Image 2026-09-12 at 10.53.30.jpeg` → **web** (+42.26%, q82)
- **environment #6** `WhatsApp Image 2026-09-12 at 10.53.31.jpeg` → **web** (+37.08%, q82)
- **environment #7** `WhatsApp Image 2026-09-12 at 10.53.32.jpeg` → **web** (+38.43%, q82)
- **environment #8** `WhatsApp Image 2026-09-12 at 10.53.33.jpeg` → **web** (+39.00%, q82)

## Gate visual ainda necessário

Esta auditoria aprova somente integridade, peso, hashes, dimensões e regras de recomendação. Antes de integrar, comparar original × web × enhanced para cor, pele, cabelo, halos, oversharpening e artefatos.
