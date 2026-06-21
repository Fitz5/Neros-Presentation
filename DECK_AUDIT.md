# Deck Audit — Observations

_Audited: 2026-06-21. Scope: `src/deck/content.ts`, `src/styles.css`, `src/deck/theme.ts`, `src/export/pptx.ts`, schema + tests. Build (`validate` + `typecheck` + `vite build`) and `vitest` (15/15) both pass. The deck currently renders **43 slides**._

The deck is in good shape — it renders cleanly and the data is well-structured. Findings below are mostly consistency/maintainability items, not breakage. Severity: 🔴 fix soon · 🟡 worth a pass · 🟢 note only.

---

## Correctness / state

- 🟡 **Uncommitted work across 4 files.** `content.ts`, `theme.ts`, `styles.css`, and `export/pptx.ts` all have unstaged changes; nothing is committed yet. `pptx.ts` in particular carries hand edits (diagnostic + timeline bars recolored to `nerosOrange`, `pptx.ts:550`, `pptx.ts:1346`) that are independent of the recent type-scale work. Recommend committing so the readable-text milestone is checkpointed.

- 🟡 **PPTX export now rides the bumped type scale, unverified.** `pptx.ts` imports `theme.typography` directly (`pptx.ts:17`, used at `:135`, `:148`, …). The recent ~15% scale-up (`theme.ts:32-39`) therefore enlarges the PowerPoint export too, but its layout uses fixed inch coordinates — text may overflow its boxes. Low priority **because the delivery path is PDF** (`?print` mode), not `.pptx`. If you ever run `npm run package:deck`, re-check the `.pptx` visually first.

- 🟡 **Three disagreeing run-time numbers.** `meta.durationMinutes: 45` (`content.ts:11`), the sum of all `estimatedMinutes` ≈ **42 min**, and the Q&A presenter note "Target arrival at approximately 36–39 minutes" (`content.ts:1296`) don't line up — and adding the agenda slide nudged the real total up. Pick one source of truth or update the note.

---

## Content consistency

- 🟡 **Title casing outlier.** Slide titles are Title Case throughout (e.g. "Why Do Motors Get Hot?"), except **"What is poor tracking?"** (`content.ts:940`), which is sentence case *and* phrased as a question. Either restyle to "What Is Poor Tracking?" or accept it as an intentional rhetorical break.

- 🟡 **Hyphenation drift.** "Low-Pass Filters" (`content.ts:608`) is hyphenated, but "High Frequency Effect on D-term" (`content.ts:1349`) and "Post Filter Changes" (`content.ts:849`) are not. "Post-Filter" and "High-Frequency" would match the compound-modifier style of "Low-Pass".

- 🟢 **"Changes/Fixes" slide names vary.** "Mechanical Fixes" (`:517`), "Changes Made" (`:801`), "Post Filter Changes" (`:849`) are three patterns for the same idea. Parallel naming (e.g. "Mechanical Changes / Filter Changes") would read more deliberately. Cosmetic.

- 🟢 **Dual section naming is intentional but worth knowing.** Sections carry both `title` and `shortTitle` that differ (`mechanical`→"Plant", `filtering`→"Sensor", `pid`→"Controller"; `content.ts:13-32`). The presenter rail shows `title` ("Mechanical", "Filtering / ESC", "PID Tracking") while the top progress bar shows `shortTitle` ("Plant", "Sensor", "Controller"). This is the control-systems framing — just be aware the same section reads under two names depending on where you look.

- 🟢 **Subtitle presence is uneven across peers.** Some content slides have a subtitle, near-identical siblings don't (e.g. "Changes Made" has "Filter setting adjustments." but "Post Filter Changes" and "Final Tune" have none). Not wrong; just slightly irregular.

---

## CSS / maintainability (`src/styles.css`)

- 🔴→🟡 **Two-layer override structure makes edits fragile.** The stylesheet has an "early" ruleset (~lines 60–1300) and a "later semantic" ruleset (~1415+) that re-declares and overrides many of the same selectors. Concretely, `.slideSubtitle` is declared **5×** (`:139`, `:1526`, `:1531`, `:1539`, `:1912`) and `.slideKicker` **5×** — which is exactly why the subtitle-size change earlier had to be made in multiple places to stick. Not a runtime bug, but a real foot-gun: consolidate each selector to one home and let the `--type-*` variables do the scaling.

- 🟢 **Dead declaration.** The early `.slideKicker { margin: 0 0 0.35cqw }` (`styles.css:123-129`) is fully overridden by the later `margin-bottom: 0.55cqw` (`:1535`). Harmless, but confusing when reading top-to-bottom.

- 🟢 **A few small labels bypass the type scale.** Most small `cqw` sizes are caught by the later `.text-medium :is(p,span,cite) { font-size: var(--type-support) !important }` rule, but some genuinely escape it — e.g. `layout-comparison` bullet detail at `0.9cqw` (`styles.css:551`). After the body-text bump these read proportionally smaller. Worth a quick consistency sweep if you notice any tiny captions.

---

## Things that are solidly good ✅

- All **39 image blocks** have `alt` text **and** an explicit `aspectRatio` (39/39/39) — no layout-shift or accessibility gaps.
- Every slide object has a `notes` array (presenter notes complete).
- **No duplicate slide IDs**; the single `showAt: "order"` reference (`content.ts:201`) resolves to a real step.
- Per-slide CSS overrides are all keyed on slide **IDs** (`.slide-<id>`), so they survived the slide renumber when the agenda slide was inserted — none are tied to slide numbers.
- Asset validation passes (`validate:assets`: 39 referenced public files, all present).
- Recent targeted fixes (spectral images 10/11, feedforward image, jello left boxes, progress bar, agenda cards) are all scoped per-slide and don't leak into global rules.

---

## Suggested order of operations

1. Commit current work (checkpoint the readable-text pass). 🟡
2. Reconcile the duration/timing numbers. 🟡
3. Quick title pass: "What is poor tracking?", "Post-Filter Changes", "High-Frequency …". 🟡
4. When time allows, de-duplicate the `styles.css` selectors (subtitle/kicker/bullet) into single declarations. 🟡
5. Only if you'll ship a `.pptx`: re-verify the PowerPoint export against the new type scale. 🟢
