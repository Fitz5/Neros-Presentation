# Neros Chase Drone Deck Outline

Status: implemented content pass

## Story Spine

- **Audience:** Mechanical engineers, controls/flight-performance engineers, and experienced FPV pilots.
- **Thesis:** The final tune worked because diagnosis happened in the correct order: mechanical first, signal quality second, control loop third.
- **Opening problem:** A flyable AOS UL7 still produced camera jello, warm/noisy motors, and delayed or over-damped response.
- **Turning point:** Separate physical vibration, motor-synchronous noise, and controller response instead of tuning all three as one problem.
- **Resolution:** Constrain relative motion, assign filters to the correct noise sources, then tune damping and tracking with repeatable inputs.
- **Target timing:** Approximately 36–39 minutes of prepared material plus questions.

## Main Deck

| # | Slide | Purpose / evidence | Time |
| --- | --- | --- | ---: |
| 1 | Diagnosing and Tuning a 7-Inch Chase Drone | Establish the real system-debugging case. | 0.5 |
| 2 | Objective | Preserve the existing mission requirement slide. | 2.0 |
| 3 | Predictable, Not Just Flyable | Define video, motor, response, and workload criteria. | 1.0 |
| 4 | Three Failures, One Investigation | Introduce jello, warm/noisy motors, and tracking error. | 1.5 |
| 5 | Diagnostic Order: Plant → Signal → Controller | Frame physical → signal → controller → validation. | 1.5 |
| 6 | Checkpoint: Isolate the Vibration Path | Mark jello/vibration as the active problem. | 0.5 |
| 7 | How Rolling Shutter Turns Vibration Into Jello | Explain rolling shutter qualitatively; request a real still. | 1.5 |
| 8 | Power Spectral Density: 200 Hz Resonance | Preserve the existing measured-spectrum slide. | 2.0 |
| 9 | 200 Hz Resonance Was Expected by Design | Preserve the existing designer-reference slide. | 2.0 |
| 10 | Suspect: Relative Motion, Not Frame Frequency | Connect battery mass and flexible mounts to excitation. | 1.5 |
| 11 | Mechanical Fixes Before Filter Changes | Record the second strap and mount changes; request proof. | 1.5 |
| 12 | Checkpoint: Clean the Signal Without Making It Late | Mark motor/D-term noise as the active problem. | 0.5 |
| 13 | Filtering Is a Bandwidth Trade-off | Explain attenuation versus delay. | 1.5 |
| 14 | Missing RPM Coverage Pushed Notches Onto Motor Noise | Show the disabled second harmonic and misplaced notches. | 2.25 |
| 15 | Low-Pass Filtering Cut Only Where the Spectrum Allowed | Connect PT1/gyro decisions to the measured noise floor. | 1.75 |
| 16 | ESC Settings Shift the Noise/Heat Trade-off | Connect PWM, motor dynamics, temperature, and noise. | 1.75 |
| 17 | Revised Filters Separated Motor Noise From Structural Content | Transition from frequency evidence to controller response. | 1.5 |
| 18 | Checkpoint: Tune the Response Once the Signal Is Trusted | Mark response and tracking as the active problem. | 0.5 |
| 19 | Repeatable Excitation Replaced Subjective Stick Feel | Establish comparable wobble-script excitation. | 1.75 |
| 20 | Simplify First, Then Raise Gains | Isolate P/D behavior before restoring helpers. | 1.5 |
| 21 | Choosing P/D Balance From Response Shape | Select damping from axis-specific response shape. | 2.25 |
| 22 | Latency as a Measured Tuning Target | Use milliseconds, overshoot, and alignment as criteria. | 1.75 |
| 23 | Restoring I-Term and Feedforward After Damping Held | Improve command tracking after damping is validated. | 1.75 |
| 24 | Closing the Loop on All Three Failures | Close every baseline failure with measured evidence. | 2.25 |
| 25 | Takeaway: Order Mattered More Than the Numbers | Re-state the reusable diagnostic sequence. | 1.75 |
| 26 | Thank You | Preserve discussion time and route to backup material. | 0.25 |

## Appendix

- Initial filtering heatmap and raw frequency evidence.
- Amplitude-dB versus power/PSD-dB interpretation.
- First-order low-pass attenuation and phase.
- Notch-filter Q and bandwidth.
- ESC/motor electrical-bandwidth model.
- Actuator matching and PID sweep context.
- Five superseded source slides retained unchanged: original cover, blank jello slide, RPM-overlay spectrum, rolling-shutter math, and generic solution path.

## Required Replacement Evidence

- Representative action-camera jello frame.
- Battery and antenna mounting before/after photographs.
- Post-mechanical-change spectrum and comparable video still.
- Motor temperatures with ambient temperature, duration, and ESC configuration.
- Exact latency values from comparable before/after traces.
- Verified final setpoint-versus-gyro trace and pilot/video outcome.

Until supplied, these remain visibly labeled placeholders rather than inferred results.
