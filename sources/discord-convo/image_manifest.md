# Discord Image Manifest

The full image/log mapping is now tracked in `notes/asset_manifest.md`.

Use this file for deck-level decisions: which images are likely presentation candidates, appendix candidates, or just source evidence.

## Strong Deck Candidates

| Candidate | File | Why It Matters |
| --- | --- | --- |
| Initial diagnosis | `images/renamed/2026-04-14-hillbilly-initial-freq-over-time-greyscale.png` | Shows the original frequency-over-time diagnosis and dynamic notch behavior. |
| Motor harmonic spectrum | `images/renamed/2026-04-14-dynamic-notch-on-motor-harmonic-spectrum.png` | Clear visual for the “DN sitting on motor harmonic” explanation. |
| Method-B / wobble log | `images/renamed/2026-04-17-method-b-frequency-heatmap.png` | Supports the measurement-method story. |
| Master multiplier artifact | `images/renamed/04-master-multiplier-wobble-test.png` | Current cropped deck image already used on page 19. |
| Final frequency-over-time | `images/renamed/2026-04-19-hillbilly-final-freq-over-time.png` | Useful as a late-stage comparison / outcome artifact. |

## Naming Rules

- Use lowercase kebab-case names.
- Prefer names that describe the technical point, not just the visual.
- Keep raw files in `images/raw/`; use presentation-ready names in `images/renamed/`.
