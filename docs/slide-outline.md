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
| 3 | Predictable, not merely flyable | Define video, motor, response, and workload criteria. | 1.0 |
| 4 | Three baseline failures | Introduce jello, warm/noisy motors, and tracking error. | 1.5 |
| 5 | Follow the signal path | Frame physical → signal → controller → validation. | 1.5 |
| 6 | Mechanical checkpoint | Mark jello/vibration as the active problem. | 0.5 |
| 7 | Jello mechanism | Explain rolling shutter qualitatively; request a real still. | 1.5 |
| 8 | 200 Hz spectral evidence | Preserve the existing measured-spectrum slide. | 2.0 |
| 9 | Expected frame mode | Preserve the existing designer-reference slide. | 2.0 |
| 10 | Mechanical candidates | Connect battery mass and flexible mounts to excitation. | 1.5 |
| 11 | Mechanical change/result | Record the second strap and mount changes; request proof. | 1.5 |
| 12 | Filtering checkpoint | Mark motor/D-term noise as the active problem. | 0.5 |
| 13 | Bandwidth trade | Explain attenuation versus delay. | 1.5 |
| 14 | RPM/dynamic-notch diagnosis | Show the disabled second harmonic and misplaced notches. | 2.25 |
| 15 | Low-pass strategy | Connect PT1/gyro decisions to the measured noise floor. | 1.75 |
| 16 | ESC/actuator bandwidth | Connect PWM, motor dynamics, temperature, and noise. | 1.75 |
| 17 | Filtering result | Transition from frequency evidence to controller response. | 1.5 |
| 18 | PID checkpoint | Mark response and tracking as the active problem. | 0.5 |
| 19 | Repeatable Method-B test | Establish comparable wobble-script excitation. | 1.75 |
| 20 | Simplified initial controller | Isolate P/D behavior before restoring helpers. | 1.5 |
| 21 | P/D balance | Select damping from axis-specific response shape. | 2.25 |
| 22 | Latency result | Use milliseconds, overshoot, and alignment as criteria. | 1.75 |
| 23 | Restore I and feedforward | Improve command tracking after damping is credible. | 1.75 |
| 24 | Final validation | Close every baseline failure with measured evidence. | 2.25 |
| 25 | Engineering takeaways | Re-state the reusable diagnostic sequence. | 1.75 |
| 26 | Q&A | Preserve discussion time and route to backup material. | 0.25 |

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
