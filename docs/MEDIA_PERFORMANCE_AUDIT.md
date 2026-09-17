# MEDIA PERFORMANCE AUDIT

## Scope

Comparative synthetic performance audit for the media integration stacked on the audited application head `83d3834cf528e913e0d371b57c2775361cd14d64`.

Current media integration head at the time of this audit: `7fef8349f158d7ad0016a3577e1dd0ebcce23b65`.

Method: median of 3 Lighthouse mobile runs for the audited base and 3 Lighthouse mobile runs for the optimized integration, executed in GitHub Actions with the same runner class and local Vite preview setup.

## Result

| Metric | Base median | Optimized median | Change |
|---|---:|---:|---:|
| Performance score | 72 | 76 | +4 points |
| LCP | 7140.6 ms | 5114.2 ms | **28.38% faster** |
| FCP | 2778.8 ms | 2799.6 ms | -0.75% |
| Speed Index | 2778.8 ms | 2799.6 ms | -0.75% |
| Total byte weight | 1,616,401 B | 1,035,974 B | **35.91% lower** |
| CLS | 0.0003 | 0.0004 | +0.0001 |

The FCP/Speed Index delta is small enough to be treated as synthetic-run noise rather than evidence of a meaningful regression. CLS remains effectively negligible.

## Hero discovery

The initial responsive integration still left the hero request undiscoverable from the initial HTML document. An explicit responsive image preload was then added to `index.html` using the approved WEB-v2 hero, its `imagesrcset`, `imagesizes="100vw"`, and `fetchpriority="high"`.

After this change, Lighthouse reports the LCP image as discoverable in the initial document, high priority, and eagerly loaded. The remaining representative LCP time is dominated by render delay rather than image request discovery or transfer.

This means the current media work successfully removed the image-discovery bottleneck. Further large LCP reductions are now primarily a frontend/rendering concern, not a reason to promote the heavier `enhanced` media variant.

## Remaining image-delivery opportunity

Lighthouse still estimates roughly 557 KiB of potential image-delivery savings on the page. The main cause is responsive granularity: several gallery/detail tiles are rendered much smaller than the current minimum 640w candidate.

Recommended next media-only experiment:

- add deterministic 320w and 480w candidates for small tiles;
- retain 640w/960w/main candidates where appropriate;
- consider 768w for full-width/hero breakpoints only when it closes a real selection gap;
- preserve the approved WEB-v2 encoding policy and do not regenerate originals or enhanced assets;
- visually sample the new small candidates at equal display dimensions before selecting them;
- rerun the same median-of-3 Lighthouse comparison before accepting the change.

## Interpretation limits

These Lighthouse results are synthetic CI measurements and are comparative evidence only. They are not field Core Web Vitals and do not replace post-deployment RUM/CrUX evidence.

## Governance

- Media visual gate: **PASS** — 40/40 current image uses.
- Responsive visual sample: **PASS** — 10/10 reviewed examples.
- Final image variant for the 40 current uses: **WEB-v2**.
- `enhanced`: not promoted.
- Publication authorization: **PENDENTE_DE_CONFIRMACAO for all 40 uses**.
- PR #4 remains stacked on PR #2 and must not be merged to `main` independently while PR #2 remains open.
- This performance audit does not authorize production publication.
