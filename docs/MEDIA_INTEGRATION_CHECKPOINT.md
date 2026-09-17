# MEDIA INTEGRATION CHECKPOINT

- Base application HEAD: `83d3834cf528e913e0d371b57c2775361cd14d64` (PR #2 canonical branch)
- Media visual gate: **PASS** — 40/40 principal uses, 10/10 responsive sample
- Selected final variant for all 40 current image uses: **WEB-v2**
- Hero 1/2: **WEB-v2**; enhanced not promoted
- Frontend integration: responsive `srcset`/`sizes`, intrinsic dimensions, lazy decoding where applicable
- Hero preload: responsive preload from initial HTML with `fetchpriority="high"`
- Design/layout: unchanged
- Originals: unchanged and retained as source archive
- Publication authorization: **PENDENTE_DE_CONFIRMACAO for all 40 uses**
- Production/merge authorization: **BLOCKED** until publication authorization and normal project release gates are satisfied

## Performance evidence

Median of 3 Lighthouse mobile runs, comparing the audited PR #2 head with the optimized media integration:

- Performance score: **72 → 76**
- LCP: **7140.6 ms → 5114.2 ms** (**28.38% faster**)
- Total byte weight: **1,616,401 B → 1,035,974 B** (**35.91% lower**)
- FCP / Speed Index: approximately flat within synthetic-run variance
- CLS: effectively unchanged/negligible

The hero request is now discoverable from the initial document. Remaining LCP time is predominantly render delay, so additional large LCP gains are expected to require frontend/render optimization rather than heavier image variants.

Lighthouse still identifies an estimated ~557 KiB media-delivery opportunity because the smallest current responsive candidate is generally 640w while several tiles render substantially smaller. A separate audited experiment with 320w/480w candidates is the next media optimization phase.

See `docs/MEDIA_PERFORMANCE_AUDIT.md` for methodology, limits and next-step rationale.

This branch is stacked on the audited PR #2 head and must not be merged to `main` independently while PR #2 remains open.
