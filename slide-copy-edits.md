# Slide Copy Edit Pass — Chase Drone Diagnosis Deck

Scope: every audience-facing string (title, subtitle, headline/subtext, callout, bullet, timeline, column text). I left the `notes` arrays alone — those are your private speaker notes and read fine as working notes, not slide copy.

Reference key: slides are matched by their `id` field in `content.ts` (stable, won't shift if lines move).

---

## Part 1 — Patterns to fix throughout (not just one slide)

**1. Full-sentence "narrator voice" titles.** Almost every title in the deck is a complete past-tense clause ("X was selected from...", "X became a measured...", "X returned only after..."). One or two of these for emphasis is fine; having literally all 25 read this way makes the deck sound like a documentary voiceover instead of a slide a presenter is standing next to. Most should compress to a label, fragment, or colon construction. Fixed individually below.

**2. "X, not Y" contrast titles, overused.** This shows up three separate times as a title (`success-criteria`, `mechanical-candidates`, `filtering-tradeoff`). Once it's a nice rhetorical move; three times it reads templated. I kept the contrast where it's actually the point, but varied the sentence shape.

**3. "Came before / returned only after" sequencing titles, overused.** Same issue, different pattern: `mechanical-change-result`, `initial-pid-configuration`, `restore-i-feedforward` all use this exact temporal-ordering sentence shape. Varied below.

**4. "Credible" as a stand-in verb, overused.** Appears in three audience-facing spots (`pid-checkpoint` title, `filtering-result` callout, `restore-i-feedforward` title). It's vague — credible to whom, on what basis? Swapped for concrete language ("trusted," "held," "settled") each time.

**5. "Mission" used for drama, overused.** "Cinematic mission," "mission failure," "mission success," "close the mission loop." One use (the "Mission requirement" eyebrow on the Objective slide) earns its keep by framing the whole talk. The rest read like a pitch deck dropped into an engineering debrief. Trimmed below.

**6. Title casing is inconsistent.** Some titles are Title Case, some are sentence case, with no pattern. Once you shorten the full-sentence titles per above, go Title Case across the whole deck for consistency.

**7. Hz/dB notation is inconsistent.** "200Hz" vs "200 Hz," "-20dB" vs "−30 dB" (hyphen vs. true minus sign, with/without space). Pick one convention — recommend `−` (minus sign) + space, e.g. `−20 dB`, `200 Hz` — and apply it everywhere, including the appendix.

**8. Typos.** "Chirs Rosser" (caption) and "Chis Rosser's" (bullet) on `frame-resonance-expectation` should both be "Chris Rosser." "Youtube" should be "YouTube."

**9. One vague source reference.** The bullet detail "The discussion identified an 80 Hz minimum for this large, low-KV system" (`low-pass-strategy`) references an unnamed "the discussion" — unclear to an audience what that is. I've proposed a generic fix below, but you should confirm what it's actually referring to (your own bench testing? a forum/Discord thread? an outside reviewer?) and word it accordingly.

---

## Part 2 — Title fixes at a glance

| Slide id | Current title | Suggested title |
|---|---|---|
| `success-criteria` | The aircraft had to be predictable, not merely flyable | **Predictable, Not Just Flyable** |
| `baseline-failure` | Three failures blocked the cinematic mission | **Three Failures, One Investigation** |
| `diagnostic-method` | The investigation followed the signal path | **Diagnostic Order: Plant → Signal → Controller** |
| `mechanical-checkpoint` | Checkpoint: isolate the physical vibration path | **Checkpoint: Isolate the Vibration Path** |
| `jello-mechanism` | Jello is vibration made visible by rolling shutter | **How Rolling Shutter Turns Vibration Into Jello** |
| `spectral-evidence` | Power Spectral Density 200Hz Resonance | **Power Spectral Density: 200 Hz Resonance** |
| `frame-resonance-expectation` | 200 Hz Frame Resonance Was Expected by Design | **200 Hz Resonance Was Expected by Design** |
| `mechanical-candidates` | The likely mechanism was relative motion, not frame frequency alone | **Suspect: Relative Motion, Not Frame Frequency** |
| `mechanical-change-result` | Constraint changes came before filter changes | **Mechanical Fixes Before Filter Changes** |
| `filtering-checkpoint` | Checkpoint: clean the signal without making it late | **Checkpoint: Clean the Signal Without Making It Late** *(casing only)* |
| `filtering-tradeoff` | Filtering is a bandwidth trade, not a cleanliness contest | **Filtering Is a Bandwidth Trade-off** |
| `rpm-filter-diagnosis` | A missing RPM harmonic forced dynamic notches onto motor noise | **Missing RPM Coverage Pushed Notches Onto Motor Noise** |
| `low-pass-strategy` | Broad low-pass filtering was reduced only where the spectrum allowed it | **Low-Pass Filtering Cut Only Where the Spectrum Allowed** |
| `esc-actuator-bandwidth` | ESC settings changed the actuator-side noise and heat trade | **ESC Settings Shift the Noise/Heat Trade-off** |
| `filtering-result` | The revised filters separated motor noise from structural content | **Revised Filters Separated Motor Noise From Structural Content** |
| `pid-checkpoint` | Checkpoint: tune the response after the plant and signal are credible | **Checkpoint: Tune the Response Once the Signal Is Trusted** |
| `pid-test-method` | Repeatable excitation replaced subjective stick feel | **Repeatable Excitation Replaced Subjective Stick Feel** *(casing only)* |
| `initial-pid-configuration` | The controller was simplified before gains were increased | **Simplify First, Then Raise Gains** |
| `pd-balance` | P/D balance was selected from response shape | **Choosing P/D Balance From Response Shape** |
| `latency-result` | Latency became a measured tuning target | **Latency as a Measured Tuning Target** |
| `restore-i-feedforward` | I-term and feedforward returned only after damping was credible | **Restoring I-Term and Feedforward After Damping Held** |
| `final-validation` | Validation must close every original failure | **Closing the Loop on All Three Failures** |
| `appendix-raw-filtering` | Raw filtering evidence: the initial noise changed with throttle | **Raw Evidence: Noise Changed With Throttle** |
| `appendix-lp1-math` | A first-order low-pass trades attenuation for phase | **First-Order Low-Pass Trades Attenuation for Phase** |
| `appendix-pid-sweep` | The P/D sweep exposed the usable response range | **P/D Sweep Exposed the Usable Response Range** |

Optional, lower priority (already reads fine, only change if you want full deck-wide consistency):

| Slide id | Current title | Suggested title |
|---|---|---|
| `engineering-takeaways` | The diagnostic order mattered more than the final values | Takeaway: Order Mattered More Than the Numbers |

---

## Part 3 — Subtitle and body copy, by section

### Objective

**`objective`**
- Subtitle — Current: *"Build a drone that can carry an action camera without compromising image quality."*
  Suggested: *"Carry an action camera without sacrificing image quality."*
  Why: drops the throat-clearing "Build a drone that can," which the section title already implies.

**`success-criteria`**
- Subtitle — Current: *"The output of the system was usable footage with low pilot workload."*
  Suggested: *"Usable footage, low pilot workload — that's the deliverable."*
- Callout text — Current: *"The aircraft should demand fewer corrective inputs during a chase line."*
  Suggested: *"Fewer corrective inputs during a chase line."*
  Why: cut the throat-clearing "should demand" — it's a requirement, state it as one.

### Baseline Failure

**`baseline-failure`**
- Subtitle — Current: *"They appeared related, but they did not belong to the same layer of the system."*
  Suggested: *"The symptoms looked related — the causes weren't."*
- Callout text — Current: *"A controller change could hide a symptom while leaving its physical cause untouched."*
  Suggested: *"A tuning change can mask a symptom without fixing its cause."*

**`diagnostic-method`**
- Subtitle — Current: *"Fix the plant before interpreting the controller around it."*
  Suggested: *"Fix the plant before judging the controller."*
- Quote block — Current: quote *"I did not tune around a bad airframe."* attributed to *"Diagnostic rule for the investigation"*
  Suggested: drop the `quote` block entirely and fold it into a plain `callout` — label **"Rule"**, text **"Don't tune around a bad airframe."**
  Why: a self-attributed "quote" with a formal attribution line reads staged. A plain callout says the same thing without the theater.

### Mechanical

**`jello-mechanism`**
- Subtitle — Current: *"The camera exposes the mission failure even when the flight controller remains stable."*
  Suggested: *"The camera can still fail the shot even with a stable flight controller."*

**`frame-resonance-expectation`**
- Caption — Current: *"Chirs Rosser Youtube video screenshot: ..."*
  Suggested: *"Chris Rosser YouTube video screenshot: ..."* (typo fix)
- Bullet text — Current: *"Screenshot from Chis Rosser's video (designer) showing frame resonance at 200 Hz"*
  Suggested: *"Screenshot from Chris Rosser's video (designer) showing frame resonance at 200 Hz"* (typo fix)
- Bullet text — Current: *"His frame resonance is lower amplitude than the motor harmonics"*
  Suggested: *"His frame mode is lower in amplitude than the motor harmonics"*
  Why: grammar — "lower amplitude than" → "lower in amplitude than."

**`mechanical-candidates`**
- Subtitle — Current: *"A known mode becomes a problem when a large or flexible component excites it strongly."*
  Suggested: *"A known mode becomes a problem when something large or flexible excites it."*

**`mechanical-change-result`**
- Subtitle — Current: *"The second battery strap was the highest-leverage mechanical intervention reported."*
  Suggested: *"The second battery strap was the highest-leverage fix."*
  Why: "intervention reported" is clinical filler; you did the fix, just say so.
- Callout — see **Part 4** below. This one isn't a tone problem, it's unfinished content.

### Filtering / ESC

**`low-pass-strategy`**
- Bullet detail — Current: *"The discussion identified an 80 Hz minimum for this large, low-KV system."*
  Suggested (pending your confirmation of source — see Part 1, item 9): *"Testing settled on an 80 Hz minimum for this large, low-KV setup."*

**`filtering-result`**
- Callout text — Current: *"Once the signal path was credible, PID tuning became evidence instead of compensation."*
  Suggested: *"Once the signal path held up, PID tuning became evidence instead of compensation."*
- Bullet text — Current: *"Remaining response error could be treated as a control problem"*
  Suggested: *"Remaining response error became a control problem to solve"*
- Bullet detail — Current: *"The investigation could now move from frequency domain to time domain."*
  Suggested: *"The investigation shifted from frequency domain to time domain."*
  Why: passive "could be treated as / could now move" reads like narration of past events rather than a stated finding.

### PID Tracking

**`pd-balance`**
- Callout — Current label *"Language discipline"*, text *"Describe the selected response as low-overshoot or near critically damped unless damping ratio is calculated."*
  Suggested label: **"Caution"**, text: *"Call this low-overshoot, not critically damped — damping ratio wasn't calculated."*
  Why: the current text is an instruction to the presenter ("describe X as Y unless Z"), not something you'd actually say to an audience. Rewritten as a direct statement you can say out loud as-is.

### Final Validation

**`final-validation`**
- Subtitle — Current: *"Logs establish mechanism; footage, temperature, and pilot workload establish mission success."*
  Suggested: *"Logs explain the mechanism. Footage, temperature, and pilot feel confirm the result."*
- Callout — see **Part 4** below (checkmarks + hedge clause, needs a decision, not just a rewrite).

**`engineering-takeaways`**
- Timeline item `takeaway-validate` title — Current: *"Close the mission loop"*
  Suggested: *"Close the loop"*
- Quote block — Current: quote *"Mechanical → Filtering → Control Loop"* attributed to *"The reusable debugging sequence"*
  Suggested: **remove this quote block.** It's word-for-word your own deck subtitle from slide 1 — repeating it here as a "quote" doesn't add anything new, it just pads the closing slide.

### Appendix

**`appendix-divider`**
- Subtext — Current: *"Use these slides selectively; they are not part of the timed main narrative."*
  Suggested: *"These are reference slides — not part of the timed talk."*

---

## Part 4 — Content that looks unfinished, not just unnatural

These aren't wording problems — they're places where draft/QA notes appear to have landed in the audience-facing text instead of staying in your own notes. Flagging so you don't present them as-is by accident:

- **`mechanical-change-result`** callout: *"Treat the mechanical fix as supported by the presenter's diagnosis; replace placeholders before asserting measured improvement."* — this reads as an instruction to whoever finishes the deck, not a slide for the room. Once you have the before/after numbers, replace with something like *"Mechanical fix confirmed by diagnosis — before/after measurement pending."* If you'll have the real data before the talk, just put the real data here instead.
- **`esc-actuator-bandwidth`** callout (label *"VERIFY BEFORE FINAL"*): same situation — fine as a TODO for yourself, needs real motor temps and the final PWM setting before this goes in front of anyone.
- **`latency-result`** callout (label *"VERIFY: reported pitch improvement ≈ 12 ms"*): same — placeholder number, flagged as such in your own text. Resolve before presenting.
- **`restore-i-feedforward`** callout (label *"INSERT: final setpoint vs gyro trace"*): placeholder, same deal.
- **`final-validation`** right column (four `[INSERT]` items) and the callout text *"...once the replacement evidence is inserted."* — the checkmarks (✓) in this callout currently contradict the hedge clause right next to them. Once you have the real evidence, drop the hedge and just leave the three checkmarks. If you won't have it by presentation day, switch to the same `▶ CURRENT` / `□ OPEN` notation your checkpoint slides already use elsewhere in the deck, rather than a checkmark with a conditional.
- **`solution-path`** — you've already flagged this yourself in the notes as a placeholder process scaffold (Diagnose/Trace/Change/Verify) standing in for the real solution sequence. No copy fix proposed here since it's explicitly a sketch.

---

## Part 5 — Structural note (separate from wording, flagging since it affects whether the titles make sense)

The slide order in `content.ts` has a second cluster of slides appended after `appendix-pid-sweep`: `cover`, `camera-jello`, `spectral-evidence-rpm`, `rolling-shutter-jello`, `solution-path`. A few things stand out:

- **`cover`** is a second title slide — "Engineering Stable Flight" / "An algorithmic approach to drone performance" — with completely different naming and tone from your actual deck title/subtitle ("Diagnosing and Tuning a 7-Inch Chase Drone" / "Mechanical → Filtering → Control Loop"). This looks like a leftover from an earlier draft rather than something meant to sit in the middle of the deck.
- **`spectral-evidence-rpm`** has the exact same title as the earlier `spectral-evidence` slide ("Power Spectral Density 200Hz Resonance") but with an added RPM-filter bullet — likely meant to replace, not duplicate, the earlier one. If both are intentional (e.g., one is "before," one is "after"), they at least need distinct titles — e.g. add "(With RPM Overlay)" to the second.
- **`rolling-shutter-jello`** ("Why this is a problem") goes deep into the rolling-shutter math that `jello-mechanism` already covers qualitatively earlier in the deck. If this is meant as a deeper technical version for Q&A, it probably belongs in the appendix section with the other appendix slides rather than floating after the appendix.

I didn't reorganize anything since you only asked about copy, but wanted to flag it — a title like "Why this is a problem" is also hard to fix in isolation since "this" depends entirely on where it ends up sitting.

---

## Part 6 — Reviewed, no changes needed

`deck-title`, `mechanical-checkpoint` (body copy), `frame-resonance-expectation` (Expected/Design Intent/Unexpected Magnitude bullets), `rpm-filter-diagnosis` (body copy), `esc-actuator-bandwidth` (body copy besides callout above), `pid-test-method` (body copy), `initial-pid-configuration` (body copy), `pd-balance` (body copy besides callout above), `latency-result` (body copy besides callout above), `qa`, `appendix-db-math`, `appendix-notch-q`, `appendix-motor-physics`.

---

## Implementation note for whoever applies this

Most "Suggested" strings above can be a direct find-and-replace against the "Current" string quoted (copied verbatim from `content.ts`). The title table in Part 2 covers the `title` field on each listed slide `id`; Part 3 covers everything else, organized by deck section with the exact field called out (subtitle, callout text, bullet text/detail, timeline item title, quote).
