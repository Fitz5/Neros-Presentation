# Presentation Story Framing

## Core Frame

I diagnosed a noisy closed-loop flight system by separating measurement noise, real plant dynamics, and actuator limits, then tuned the system by trading filtering delay against motor heat and control authority.

This should present the work as an engineering investigation, not as following a tuning recipe.

## Recommended Story

Start with the actual issue:

I had a 7-inch AOS UL7 with warm motors, visible D-term noise, and confusing harmonic behavior. The hard part was that several things looked related: gyro noise, D-term amplification, RPM harmonics, dynamic notches, motor heat, and step response. My job was to determine what was real signal, what was noise, and what changes were worth making.

## Narrative Sequence

1. Symptom
   - Motors getting warm.
   - D-term looked noisy after filtering.
   - A throttle-region harmonic appeared in logs.
   - Initial question: do I need more filtering, different D-term filters, or different RPM notch behavior?

2. First Diagnosis
   - The second RPM harmonic was disabled.
   - Dynamic notches were being forced to sit on motor harmonic content.
   - Key insight: the filters were doing work in the wrong place.
   - Fix: let RPM filtering handle motor-synchronous noise, freeing dynamic notches to catch frame resonances.

3. Measurement Upgrade
   - I moved from casual hover/cruise logs to wobble/method-B logs.
   - This matters because it shows better data collection before more tuning.
   - The system needed excitation across roll/pitch to reveal dynamics.

4. Deep Dive: Noise Floor and dB
   - dB is relative, not absolute.
   - For amplitude: `dB = 20 log10(A/Aref)`.
   - `-30 dB` means amplitude is about `3.16%` of the reference.
   - If interpreted as power/energy, `-30 dB` is about `0.1%`.
   - Once content is near the practical noise floor, chasing it with more filtering can cost more in phase delay than it gives back in useful control.

5. Deep Dive: Q Factor and -3 dB Bandwidth
   - `Q = f0 / bandwidth`.
   - Bandwidth is usually measured between the `-3 dB` points.
   - `-3 dB` corresponds to half power, or `0.707` amplitude.
   - High Q: narrow notch, less collateral phase impact, but easier to miss moving noise.
   - Low Q: wider attenuation, more robust, but more delay/phase cost.
   - Tie this directly to dynamic notch tuning.

6. Deep Dive: Motor Authority, Heat, and Bandwidth
   - Motor torque is approximately `torque = Kt * current`.
   - Current does not change instantly.
   - Motor electrical behavior includes resistance and inductance: `V = R i + L di/dt + back-EMF`.
   - At high command frequencies, inductance resists rapid current change.
   - Above the useful motor/ESC bandwidth, commands increasingly become phase-lagged current ripple and heat rather than effective torque.
   - This connects directly to D-term: D can command fast corrections, but if the actuator cannot physically produce useful torque at those frequencies, you pay in motor heat.

7. Resolution
   - Restored appropriate RPM harmonic coverage.
   - Tuned filtering more conservatively.
   - Used step response and frequency plots together.
   - Avoided blindly raising master multiplier or removing filtering.
   - Final conclusion: the right solution was not more aggressive tuning, but matching filters and controller gains to the measured plant and actuator limits.

## Suggested Timing

- 5 min: problem and system context
- 8 min: initial evidence and wrong/uncertain hypotheses
- 8 min: diagnosis of RPM filters vs dynamic notches
- 8 min: math deep dive on dB, noise floor, Q, and -3 dB
- 8 min: motor torque, inductance, heat, and actuator bandwidth
- 5 min: final tuning decisions and tradeoffs
- 3 min: lessons learned / questions

## How To Frame Expert Feedback

Do not present the story as: I learned PID tuning from Discord.

Present it as:

> I used expert feedback as part of the investigation, but the important engineering work was validating the hypothesis against logs, understanding what each filter was doing, and deciding which changes were physically meaningful.

That shows coachability without sounding coached.

## Strongest Theme

I did not tune by feel. I used frequency-domain evidence, time-domain response, and actuator physics to decide what changes were real improvements.
