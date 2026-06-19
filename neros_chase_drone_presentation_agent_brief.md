# Neros Technical Presentation Deck Architecture Brief

## Purpose

Build a clear, technical presentation around a real diagnosed-and-solved FPV drone issue:

> Taking a 7-inch chase drone from "flyable but not good enough" to a stable cinematic platform by fixing the physical system first, the signal/filtering path second, and the control loop third.

This deck is for a mixed audience of:
- mechanical engineers
- flight performance / controls engineers
- experienced FPV or professional pilots

The presentation should show engineering judgment, not just Betaflight settings.

The hiring prompt is a 45-minute presentation walking through a challenging issue diagnosed and solved. The team prefers prior/relevant FPV drone work. Do not include a personal or professional bio.

---

## Critical Agent Constraints

### Do Not Alter Existing Slides

The implementation agent must:

1. **Only reorganize slides that already exist.**
2. **Never alter existing slide content.**
   - Do not rewrite existing text.
   - Do not modify existing plots.
   - Do not crop or manipulate existing screenshots.
   - Do not change existing slide visuals unless explicitly instructed later.
3. **You may add new slides as needed** to improve narrative structure, transitions, section framing, or progress tracking.
4. If an existing slide appears wrong, incomplete, or redundant:
   - do not edit it directly
   - leave it unchanged
   - optionally move it to appendix or place a new clarifying slide before/after it
5. Preserve all original source assets and filenames.

The deck should become clearer mainly through ordering, sectioning, added transition slides, and consistent progress/checkpoint framing.

---

## Core Narrative

The deck should be organized around one thesis:

> I did not tune around a bad airframe. I fixed the physical system, cleaned the signal, then tuned the controller.

The drone had three observable issues:

1. **Camera jello / vibration**
2. **Noisy or hot motors / D-term noise**
3. **Poor flight feel / bounceback / imperfect stick tracking**

The solution sequence should be:

1. **Mechanical system first**
   - fix vibration, loose mass, battery movement, and mounting problems

2. **Signal quality second**
   - use filtering and ESC settings to reduce noise without excessive latency

3. **Control loop third**
   - tune PID and feedforward once the platform and signal path are credible

This order is the story. The audience should leave remembering the diagnostic sequence, not specific final Betaflight values.

---

## Presentation Progress System

The current "Objective → Problem → Solution" progress bar is too generic. Replace or augment it with a technical progress rail.

Recommended top progress rail:

```text
Objective → Baseline Failure → Mechanical → Filtering / ESC → PID Tracking → Final Validation
```

Each slide should show the current section subtly at the top.

### Progress State Rules

- Completed sections: checkmark or muted "complete" state
- Current section: highlighted
- Future sections: grey / inactive
- Avoid excessive animation or visual clutter

### Checkpoint Card

At the start of each major problem section, show a small checklist of the three original unresolved issues:

```text
[ ] Camera jello / vibration
[ ] Hot or noisy motors
[ ] Poor tracking / bounceback
```

Then update it as the deck progresses:

Before Section 1:
```text
[>] Camera jello / vibration
[ ] Hot or noisy motors
[ ] Poor tracking / bounceback
```

Before Section 2:
```text
[x] Camera jello / vibration
[>] Hot or noisy motors
[ ] Poor tracking / bounceback
```

Before Section 3:
```text
[x] Camera jello / vibration
[x] Hot or noisy motors
[>] Poor tracking / bounceback
```

Final validation:
```text
[x] Camera jello / vibration
[x] Hot or noisy motors
[x] Poor tracking / bounceback
```

The checkpoint card helps the audience understand where they are in the diagnostic sequence.

---

## Deck-Level Slide Architecture

### Slide 1 — Title

**Title:** Diagnosing and Tuning a 7-Inch Chase Drone  
**Subtitle:** Mechanical → Filtering → Control Loop

Purpose:
- establish this as a real system debugging case
- do not include a bio

Suggested visual:
- clean drone image
- no dense text

---

### Slide 2 — Objective

**Claim:** The goal was not just a quad that flies; it was a 7-inch chase platform that produces stable, predictable, cinematic flight.

Success criteria:
- clean video with no jello
- cool, smooth motors
- good propwash recovery
- low bounceback
- locked-in stick tracking
- low pilot workload

Implementation:
- make this visually simple
- use a requirements table or icon row
- do not introduce the full tuning process yet

---

### Slide 3 — Baseline Failure

**Claim:** The drone flew, but three problems prevented it from being a usable chase/cinema platform.

Show the three unresolved problems:
1. camera jello
2. hot/noisy motors
3. poor flight feel / bounceback / tracking

This slide is the "why I went down the rabbit hole" slide.

Suggested layout:
- left: screenshot/still of video jello or representative frame
- center: frequency plot / noisy spectrum
- right: setpoint tracking or bounceback trace
- bottom: "These looked related, but required different fixes."

---

### Slide 4 — Diagnostic Method

**Claim:** The correct order was physical system first, signal quality second, control loop third.

Show block flow:

```text
Physical vehicle → Sensor / gyro signal → Filtering / ESC → PID / feedforward → Flight result
```

Key sentence:
> Tuning first would risk hiding the real root cause.

This slide should frame the rest of the deck.

---

# Section 1: Mechanical System / Jello

## Slide 5 — Section Checkpoint: Mechanical

Use checkpoint card:
```text
[>] Camera jello / vibration
[ ] Hot or noisy motors
[ ] Poor tracking / bounceback
```

Section claim:
> First, I needed to determine whether the failure was physical vibration or a software/tuning issue.

---

## Slide 6 — What Is Jello?

**Claim:** Jello is a visible indicator of vibration coupling into the camera system.

Reason for this slide:
- the final deck will be PDF/PPT and may not include video
- the audience needs to know why a still image proves the problem

Content:
- define jello as rolling-shutter distortion caused by vibration during image scan
- explain why it matters for a chase/cinema platform
- state that filtering gyro data cannot fix camera vibration

Suggested visual:
- jello frame / crop
- small rolling shutter diagram
- one sentence only

Speaker note:
> Even if the flight controller can stabilize the vehicle, the mission output still fails if the camera image is distorted.

---

## Slide 7 — Evidence: Frequency Peak / Resonance

**Claim:** The logs showed a dominant vibration feature consistent with the video symptom.

Content:
- show the large ~200 Hz resonance / peak
- label axis and flight condition
- avoid overexplaining every trace

Interpretation:
- a large isolated peak suggests structural/mass/mount coupling or a strong excitation path
- this should be investigated mechanically before adding more filtering

---

## Slide 8 — Mechanical Root Cause Candidates

**Claim:** The likely causes were relative motion and flexible/poorly constrained components.

Known mechanical details:
- antenna holders were zip-tied
- custom mount was created for the antenna holders
- battery was a large moving mass
- adding a second battery strap was the most effective fix

Important technical point:
> On a 7-inch quad, the battery is a major portion of vehicle mass. If it moves relative to the frame, it changes the dynamic behavior of the system.

Visual:
- annotated drone photo
- arrows showing battery constraint directions
- photo of antenna holder before/after if available

---

## Slide 9 — Mechanical Fix

**Claim:** The fix was to remove relative motion before trying to filter the result.

Changes:
- replaced/augmented zip-tied antenna holders with a designed mount
- added a second battery strap
- second strap constrained battery motion in more axes
- secured loose or flexible components

Visual:
- before/after hardware images
- simple constraint-axis diagram for the battery

Main point:
> The second battery strap was the most effective mechanical change.

---

## Slide 10 — Mechanical Result

**Claim:** Mechanical constraint reduced jello and reduced the dominant vibration peak.

Show:
- before/after frequency plot
- before/after video still if available
- short result statement

Transition:
> Once the largest physical vibration path was reduced, the next limiting issue became signal quality and motor/D-term noise.

---

# Section 2: Filtering / ESC / Noise / Propwash

## Slide 11 — Section Checkpoint: Filtering

Use checkpoint card:
```text
[x] Camera jello / vibration
[>] Hot or noisy motors
[ ] Poor tracking / bounceback
```

Section claim:
> After the mechanical issue was reduced, I focused on cleaning the control signal without adding unnecessary delay.

---

## Slide 12 — Filtering Problem Statement

**Claim:** Filtering is a tradeoff between noise removal and control latency.

Content:
- too little filtering → noisy D-term, motor heat, rough motors
- too much filtering → phase delay, soft response, worse disturbance recovery
- goal is not the cleanest plot; goal is the best usable control signal

Key sentence:
> Filtering is not a cleanliness contest. It is a bandwidth trade.

---

## Slide 13 — RPM Filter Tuning

**Claim:** RPM filtering targets motor/prop-related harmonic noise while preserving useful control bandwidth.

Content to include:
- screenshot of relevant Betaflight RPM filter parameters
- explain motor harmonics
- explain choosing number of harmonics
- explain filter weight adjustment per motor harmonic if applicable
- discuss how dynamic/RPM filtering follows motor speed instead of notching a fixed frequency

Suggested visual:
- Betaflight RPM filter screenshot
- spectrum with harmonic labels
- minimal annotation

Speaker focus:
- what parameter was changed
- why it was changed
- what evidence supported the change

---

## Slide 14 — Low-Pass Filter Strategy

**Claim:** Low-pass filters remove broad high-frequency noise but add delay.

Content:
- screenshot of Betaflight gyro/D-term low-pass settings
- explain how many low-pass filters were needed
- explain when sliders can be raised
- relate decision to the observed noise floor
- show before/after spectrum if available

Important:
- Keep main slide practical.
- Do not overload with coefficient derivations.
- Put deeper LP1/math in appendix.

---

## Slide 15 — Noise Floor Decision Rule

**Claim:** I used the spectrum/noise floor to decide what needed filtering and what could be left alone.

Content:
- discuss practical threshold around -30 dB if supported by the plotted data
- explain that the threshold is empirical/practical, not a universal physics constant
- show why reducing from around -20 dB to -30 dB matters

Critical math caution:
- Do **not** blindly claim "-20 dB to -30 dB is 10x magnitude" unless the plot is explicitly power-based.
- If using amplitude dB: 10 dB difference = about 3.16x amplitude.
- If using power/PSD dB: 10 dB difference = 10x power.
- D-term output magnitude is generally closer to amplitude behavior unless the plotted metric is power/PSD. Verify plot convention before writing slide text.

Recommended main-slide phrasing:
> Moving noise lower relative to the control signal reduces how much unwanted high-frequency content the D-term can amplify.

Place detailed dB math in appendix.

---

## Slide 16 — ESC / PWM Settings

**Claim:** ESC settings are part of the actuator system and can change the noise/heat behavior.

Content:
- compare variable 24–48 kHz vs fixed 24 kHz
- show same or comparable flight condition if possible
- compare spectrum, motor heat, and subjective smoothness
- state final selected setting and why

Interpretation:
> This helped separate structural vibration from motor/ESC-induced noise.

---

## Slide 17 — Latency / Delay Tradeoff

**Claim:** The more aggressively I filter, the more delay I can add before the control loop sees useful motion.

Content:
- explain latency as the cost of filtering
- connect delay to propwash and tracking
- if using LP1 explanation, keep it qualitative here
- detailed LP1 coefficient/math goes to appendix

Useful sentence:
> A filter that removes real noise can help; a filter that removes useful motion makes the quad feel late.

---

## Slide 18 — Motor as Physical Low-Pass / Heat Mechanism

**Claim:** Very high-frequency control commands may not become useful thrust; they can become heat.

Content:
- explain that motor inductance and actuator dynamics limit how fast commanded electrical changes become mechanical thrust
- if the controller is trying to command high-frequency content the motor cannot physically produce, energy can show up as heat/noise rather than useful motion
- tie this to D-term noise and hot motors

Keep this slide practical and short.
Detailed motor/electrical model belongs in appendix.

---

# Section 3: PID / Step Response / Stick Tracking

## Slide 19 — Section Checkpoint: PID Tracking

Use checkpoint card:
```text
[x] Camera jello / vibration
[x] Hot or noisy motors
[>] Poor tracking / bounceback
```

Section claim:
> Once the vehicle was mechanically constrained and the signal path was cleaner, PID tuning became meaningful.

---

## Slide 20 — PID Problem Statement

**Claim:** The remaining issue was flight response: bounceback, latency, and imperfect setpoint tracking.

Content:
- show setpoint vs gyro mismatch
- show bounceback or wobble response
- identify axis if pitch was the main issue

Speaker point:
> This was no longer a gross vibration problem. It was a control-loop response problem.

---

## Slide 21 — Wobble / Step Response Test Method

**Claim:** I used consistent inputs to make tuning changes comparable.

Content:
- explain wobble script
- explain why consistent input matters
- show example step/wobble response plot

Important:
- This slide should make the process look disciplined.
- Avoid making it sound like subjective stick feel only.

---

## Slide 22 — Initial PID Test Configuration

**Claim:** I simplified the controller first so I could isolate the effect of each tuning change.

Initial setup:
- feedforward off
- I almost off
- Dmax off
- lower PD balance to about 0.6–0.8
- then increase systematically

Purpose:
- reduce interacting variables
- isolate P/D behavior
- measure response before adding feedforward and other helpers back

---

## Slide 23 — P/D Balance and Damping

**Claim:** P/D balance was adjusted to get fast response without overshoot or bounceback.

Process:
- tune roll/pitch response separately
- lower or raise PD balance based on response shape
- adjust pitch D balance
- use master multiplier tests
- watch latency, overshoot, and rebound

Language caution:
- Prefer "near critically damped" or "low overshoot" unless exact damping ratio is calculated.
- Only say "critically damped" if the calculation or trace supports it.

---

## Slide 24 — Latency Reduction Result

**Claim:** The tuning process reduced pitch latency by about 12 ms.

Content:
- show before/after pitch latency trace
- show how roll/pitch alignment improved if relevant
- label exact measured latency values if available

Speaker point:
> This was the first point where the quad started to feel connected rather than delayed.

---

## Slide 25 — Reintroducing I and Feedforward

**Claim:** After basic damping was correct, I restored I and used feedforward to improve stick tracking.

Process:
- bring I back to default or appropriate baseline
- test feedforward effect on setpoint tracking
- adjust smoothing only if needed
- explain that smoothing can increase delay

Show:
- setpoint vs gyro before/after feedforward
- final "ideal stick tracking" log

---

## Slide 26 — Final Tracking Result

**Claim:** Final tuning produced strong stick tracking with reduced bounceback and acceptable delay.

Content:
- final clean setpoint/gyro trace
- before/after comparison if possible
- short pilot-centered outcome:
  - easier to fly
  - less correction
  - more predictable for chase/cinema use

Do not show this detailed final log at the beginning of the presentation.
Instead:
- use an early bad baseline log
- save the good log here
- optionally show bad vs good at the final validation slide

---

# Final Section: Validation and Takeaways

## Slide 27 — Final Checkpoint / Validation

Use final checkpoint:
```text
[x] Camera jello / vibration
[x] Hot or noisy motors
[x] Poor tracking / bounceback
```

**Claim:** The final drone better met the original cinematic chase objective.

Table:
```text
Requirement               Initial State       Final State
Camera jello              Failed / visible    Improved
Motor noise / heat         Poor / high         Improved
Propwash / disturbance     Inconsistent        Improved
Stick tracking             Delayed / rebound   Locked-in
Pilot workload             Higher             Lower
```

---

## Slide 28 — Before / After Summary

**Claim:** The improvements came from addressing the root causes in the correct order.

Use three before/after rows:
1. Mechanical:
   - before: jello + 200 Hz peak
   - after: constrained battery/mounts + reduced peak
2. Filtering:
   - before: noisy D-term / motor heat
   - after: cleaner signal with acceptable latency
3. PID:
   - before: bounceback / tracking error
   - after: better step response and stick tracking

---

## Slide 29 — Engineering Takeaways

**Claim:** The diagnostic method matters more than the final tuning values.

Takeaways:
1. Fix real mechanical motion before hiding symptoms with filters.
2. Use logs to separate vibration, noise, and control error.
3. Filtering is a bandwidth/latency trade.
4. PID tuning only makes sense after the physical and signal paths are credible.
5. Validate with both data and pilot/video outcome.

End line:
> Mechanical → Filtering → Control Loop.

---

## Slide 30 — Thank You / Q&A

Keep minimal.

Suggested text:
> Thank you. Happy to walk through any logs, settings, or assumptions in detail.

---

# Appendix Structure

The appendix should hold deeper material that is useful for technical Q&A but too detailed for the main 45-minute narrative.

Recommended appendix slides:

## Appendix A — Raw Logs

Include:
- full before/after gyro spectra
- D-term spectra
- motor output traces
- raw setpoint/gyro logs

## Appendix B — dB / Noise Floor Math

Include:
- explanation of amplitude dB vs power dB
- why 10 dB difference matters
- caution that -20 dB to -30 dB means:
  - 3.16x amplitude change if amplitude dB
  - 10x power change if power/PSD dB
- connect this carefully to D-term amplification

## Appendix C — LP1 / Low-Pass Filter Math

Include:
- first-order low-pass transfer function
- cutoff frequency interpretation
- phase delay / group delay intuition
- how additional filters add delay
- keep derivations concise

## Appendix D — RPM Filter / Notch Filter Details

Include:
- Q factor definition
- center frequency and bandwidth
- motor harmonic explanation
- harmonic weight tuning
- why notches are useful for narrow motor/prop noise

## Appendix E — ESC / Motor Physics

Include:
- ESC PWM comparison details
- motor inductance as a hardware low-pass analogy
- why high-frequency commands may become heat rather than useful thrust
- note that this is a simplified physical interpretation, not a full motor model unless equations are included

## Appendix F — PID / Step Response Details

Include:
- wobble script method
- parameter sweep
- P/D balance tests
- pitch D balance tests
- master multiplier tests
- feedforward comparison
- final latency and tracking measurements

---

# Visual Style Guidelines

## Main Slides

Each main technical slide should have:

1. **One claim title**
   - Example: "The battery was acting like a moving mass."
   - Avoid vague titles like "Mechanical Fixes."

2. **One main visual**
   - plot, screenshot, drone photo, or diagram

3. **One short interpretation**
   - what the visual means

4. **One decision/result**
   - what was changed or concluded

Avoid dense paragraphs.

## Slide Density

Main slides:
- maximum 3–5 bullets
- one idea per slide
- no equations unless necessary for the immediate decision

Appendix:
- can be more technical
- equations and derivations allowed

## Audience Balance

For mechanical engineers:
- emphasize physical constraint, mass, stiffness, vibration paths

For flight performance engineers:
- emphasize signal quality, delay, filtering, setpoint tracking

For pro pilots:
- emphasize pilot workload, feel, propwash, video usability

Every section should connect data back to flight outcome.

---

# Implementation Notes for PPT Agent

1. Search the existing workspace for current deck files and slide assets.
2. Preserve all existing slides exactly.
3. Reorder existing slides into the architecture above where possible.
4. Add section divider/checkpoint slides where needed.
5. Add progress rail to newly created slides.
6. Do not retroactively edit existing slides to add progress rail unless explicitly instructed.
7. When adding new slides, use placeholder boxes for assets that do not yet exist:
   - `[INSERT: 200 Hz resonance plot]`
   - `[INSERT: jello still frame]`
   - `[INSERT: Betaflight RPM filter screenshot]`
   - `[INSERT: before/after setpoint tracking]`
8. Keep placeholder text explicit and easy to replace.
9. Put questionable/deep technical material in appendix first, not the main deck.
10. Do not invent final measured results. Use placeholders where values are not known.

---

# Minimal Mental Structure

The deck should be easy to remember as:

```text
Objective
Baseline failure
Mechanical fix
Filtering / ESC fix
PID tracking fix
Final validation
Takeaways
Appendix
```

The repeated section logic is:

```text
Problem → Evidence → Change → Result → Next limiting issue
```

The main closing message is:

> The final tune worked because the diagnosis happened in the right order: mechanical first, signal quality second, control loop third.
