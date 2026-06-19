# Slide Outline

Status: sketch pass

Use this file to decide the story before polishing individual slides. Keep entries rough; detailed copy belongs in `src/deck/content.ts` during the content pass.

## Story Spine

- **Audience:**
- **One-sentence thesis:**
- **Opening problem:**
- **Key turning point:**
- **Resolution:**
- **What the audience should remember:**

## Draft Sequence

| # | Working title | Purpose / claim | Evidence or visual | Transition | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | Objective | Define why the drone exists and make stable footage a system requirement. | Mission requirements | The mission exposes the image-quality constraint. | sketch |
| 2 | Jello in the camera footage | Introduce the visible problem before explaining it. | Intentionally blank for now | Move from symptom to measured evidence. | sketch |
| 3 | 200 Hz mechanical signature | Show the common roll/pitch spectral peak. | BTFL_001.01 spectral-power graph | Connect the measured peak to camera sampling. | content |
| 4 | Why 200 Hz becomes jello | Show that the log peak is frequency-compatible with the camera artifact. | Rolling-shutter diagram + waves/alias math | The mechanism identifies what must change. | content |
| 5 | Solution path | Frame the response as diagnose → trace → change → verify. | Four-step process | Begin the actual investigation. | sketch |

Allowed status values: `sketch`, `content`, `visual`, `build`, `done`.

## Parking Lot

Ideas, screenshots, or details that may be useful but do not yet have a slide:

- Replace the objective placeholder with the actual mission, range, endurance, and payload targets.
- Confirm the exact action-camera model and measure or source its 4K60 rolling-shutter readout time.

## Pass Checklist

### 1. Sketch

- Every slide has one clear job.
- The sequence works without animation or polished copy.
- Required evidence is identified, even if the visual is still a placeholder.

### 2. Content

- Claims are supported and technically precise.
- Screenshots, diagrams, captions, and speaker notes are complete.
- Repetition and unsupported details are removed.

### 3. Visual

- Hierarchy and layout communicate the point before the presenter speaks.
- Images are legible at presentation distance.
- Styling is consistent across the deck.

### 4. Build

- `steps` and `showAt` reveal information in the intended order.
- Builds support the explanation rather than compensate for crowded slides.
- The PPTX export matches the browser preview closely enough for delivery.

### 5. Rehearse

- Total timing fits 45 minutes with room for questions.
- Transitions are explicit.
- Backup details are moved to appendix slides or speaker notes.
