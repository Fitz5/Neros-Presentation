# Story Outline From Discord Conversation

## Working Thesis

The conversation can support a technical story about diagnosing noisy flight-controller filtering using data, then iterating toward a safer configuration with explicit tradeoffs.

## Candidate Beats

1. Problem framing: AOS UL7 has D-term noise, warm motors, and a suspected throttle harmonic.
2. First diagnosis: RPM second harmonic was disabled, forcing dynamic notches to sit on motor noise.
3. Corrective action: switch D-term filtering to PT1/PT1, lower DN min, restore RPM harmonic coverage.
4. Measurement method: learn hover/wobble logs because they better represent real flight noise.
5. System-specific context: large 7-inch low-KV setup moves motor noise lower than a typical 5-inch quad.
6. Tradeoff: reduce filter delay where possible, but stay conservative because motor temperature is a real constraint.
7. Current artifact: master multiplier screenshot anchors the tuning iteration visually.

## Open Reconstruction Tasks

- Recover and label the missing Discord screenshots.
- Decide which screenshots are evidence slides versus backup appendix slides.
- Replace placeholder slide copy with the final interview narrative.
