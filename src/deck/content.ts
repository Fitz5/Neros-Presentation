import type { DeckInput } from "./schema";

const deckImage = (name: string) => `/screenshots/deck/${name}`;

export const deck = {
  meta: {
    title: "Diagnosing and Tuning a 7-Inch Chase Drone",
    subtitle: "Mechanical → Filtering → Control Loop",
    presenter: "David Fitzgerald",
    dateLabel: "June 24th",
    durationMinutes: 45,
  },
  sections: [
    { id: "objective", title: "Objective", shortTitle: "Objective" },
    { id: "baseline", title: "Baseline Failure", shortTitle: "Baseline Failure" },
    { id: "mechanical", title: "Mechanical", shortTitle: "Mechanical" },
    { id: "filtering", title: "Filtering / ESC", shortTitle: "Filtering / ESC" },
    { id: "pid", title: "PID Tracking", shortTitle: "PID Tracking" },
    { id: "validation", title: "Final Validation", shortTitle: "Final Validation" },
  ],
  slides: [
    {
      id: "deck-title",
      sectionId: "objective",
      title: "Diagnosing and Tuning a 7-Inch Chase Drone",
      subtitle: "Mechanical → Filtering → Control Loop",
      layout: "title",
      estimatedMinutes: 0.5,
      blocks: [
        {
          type: "headline",
          text: "David Fitzgerald",
          subtext: "June 24th",
        },
      ],
      notes: [
        "This is a real debugging case: a flyable seven-inch platform that was not yet credible for cinematic chase work.",
        "The story is about diagnostic order, not a list of final Betaflight values.",
      ],
    },
    {
      id: "objective",
      sectionId: "objective",
      title: "Objective",
      subtitle: "Build a drone that can carry an action camera without compromising image quality.",
      layout: "title",
      estimatedMinutes: 2,
      blocks: [
        {
          type: "headline",
          eyebrow: "Mission requirement",
          text: "Stable footage is part of the aircraft's performance",
          subtext:
            "The platform succeeds only when propulsion, structure, controls, and camera can operate together without visible vibration.",
        },
      ],
      notes: [
        "Sketch slide: refine the mission, range, endurance, payload, and image-quality requirements next.",
      ],
    },
    {
      id: "success-criteria",
      sectionId: "objective",
      title: "The aircraft had to be predictable, not merely flyable",
      subtitle: "The output of the system was usable footage with low pilot workload.",
      layout: "content",
      estimatedMinutes: 1,
      blocks: [
        {
          type: "metricRow",
          metrics: [
            { id: "clean-video", value: "01", label: "No visible jello", tone: "accent" },
            { id: "cool-motors", value: "02", label: "Cool, smooth motors", tone: "success" },
            { id: "recovery", value: "03", label: "Controlled disturbance recovery", tone: "warning" },
            { id: "tracking", value: "04", label: "Low-bounceback tracking", tone: "accent" },
          ],
        },
        {
          type: "callout",
          label: "Pilot-level requirement",
          text: "The aircraft should demand fewer corrective inputs during a chase line.",
          tone: "success",
        },
      ],
      notes: [
        "Translate the engineering measurements back to the job: stable footage, predictable response, and less pilot correction.",
      ],
    },
    {
      id: "baseline-failure",
      sectionId: "baseline",
      title: "Three failures blocked the cinematic mission",
      subtitle: "They appeared related, but they did not belong to the same layer of the system.",
      layout: "content",
      estimatedMinutes: 1.5,
      blocks: [
        {
          type: "metricRow",
          metrics: [
            { id: "jello-fail", value: "FAIL", label: "Camera jello / vibration", tone: "danger" },
            { id: "motor-fail", value: "HOT", label: "Noisy D-term / warm motors", tone: "warning" },
            { id: "tracking-fail", value: "LATE", label: "Bounceback / tracking error", tone: "danger" },
          ],
        },
        {
          type: "callout",
          label: "Diagnostic risk",
          text: "A controller change could hide a symptom while leaving its physical cause untouched.",
          tone: "warning",
        },
      ],
      notes: [
        "Open with the observable failures. Do not show the clean final tracking trace yet.",
        "The three symptoms create the investigation; the next slide establishes the order used to separate them.",
      ],
    },
    {
      id: "diagnostic-method",
      sectionId: "baseline",
      title: "The investigation followed the signal path",
      subtitle: "Fix the plant before interpreting the controller around it.",
      layout: "timeline",
      estimatedMinutes: 1.5,
      blocks: [
        {
          type: "timeline",
          items: [
            { id: "vehicle", label: "01", title: "Physical vehicle", description: "Mass, stiffness, mounts, and relative motion." },
            { id: "gyro", label: "02", title: "Gyro signal", description: "Separate real motion from motor-correlated noise." },
            { id: "filters", label: "03", title: "Filtering / ESC", description: "Remove noise without unnecessary delay." },
            { id: "controller", label: "04", title: "PID / feedforward", description: "Shape damping and command tracking." },
            { id: "flight", label: "05", title: "Flight result", description: "Validate logs, motor behavior, footage, and feel." },
          ],
        },
        {
          type: "quote",
          quote: "I did not tune around a bad airframe.",
          attribution: "Diagnostic rule for the investigation",
        },
      ],
      notes: [
        "This order is the thesis of the presentation: mechanical first, signal quality second, control loop third.",
      ],
    },
    {
      id: "mechanical-checkpoint",
      sectionId: "mechanical",
      title: "Checkpoint: isolate the physical vibration path",
      layout: "content",
      estimatedMinutes: 0.5,
      blocks: [
        {
          type: "twoColumn",
          columns: [
            {
              title: "Diagnostic status",
              items: [
                { id: "mechanical-current", text: "▶ Camera jello / vibration", detail: "CURRENT" },
                { id: "mechanical-open-motors", text: "□ Hot or noisy motors", detail: "OPEN" },
                { id: "mechanical-open-tracking", text: "□ Poor tracking / bounceback", detail: "OPEN" },
              ],
            },
            {
              title: "Question to answer",
              items: [
                { id: "mechanical-question", text: "Is the measured peak physical motion?", detail: "If so, no amount of gyro filtering can repair the camera image." },
              ],
            },
          ],
        },
      ],
      notes: ["The first section tests the physical system before touching the tune."],
    },
    {
      id: "jello-mechanism",
      sectionId: "mechanical",
      title: "Jello is vibration made visible by rolling shutter",
      subtitle: "The camera exposes the mission failure even when the flight controller remains stable.",
      layout: "comparison",
      estimatedMinutes: 1.5,
      blocks: [
        {
          type: "twoColumn",
          columns: [
            {
              title: "Physical mechanism",
              items: [
                { id: "row-scan", text: "The sensor reads rows at different times", detail: "High-frequency camera motion bends straight geometry across the frame." },
                { id: "short-exposure", text: "Short exposure can preserve the distortion", detail: "The motion is not necessarily averaged into ordinary blur." },
              ],
            },
            {
              title: "Control-system implication",
              items: [
                { id: "gyro-limit", text: "Gyro filtering cannot stop camera motion", detail: "The physical coupling path must be constrained first." },
                { id: "mission-limit", text: "Stable attitude is not sufficient", detail: "The aircraft still fails if the recorded image is distorted." },
              ],
            },
          ],
        },
        {
          type: "callout",
          label: "INSERT: representative jello frame",
          text: "Replace this card with an uncropped still from the affected action-camera footage.",
          tone: "warning",
        },
      ],
      notes: [
        "Keep this explanation qualitative. The preserved rolling-shutter calculation is available in the appendix for technical questions.",
      ],
    },
    {
      id: "spectral-evidence",
      sectionId: "mechanical",
      title: "Power Spectral Density 200Hz Resonance",
      layout: "comparison",
      estimatedMinutes: 2,
      blocks: [
        {
          type: "image",
          src: deckImage("btfl001-spectral-200hz-peaks.png"),
          alt: "Roll and pitch gyro spectral power plots with strong peaks near 200 hertz.",
          caption: "BTFL_001.01 power spectral density",
          aspectRatio: 1.2983,
        },
        {
          type: "bullets",
          title: "Amplitude",
          tone: "accent",
          items: [
            {
              id: "spectral-peak",
              text: "Roll reaches 0 dB at 200 Hz",
            },
            {
              id: "spectral-pitch-transition",
              text: "Pitch reaches -5 dB at 189 Hz",
            },
          ],
        },
        {
          type: "bullets",
          title: "Frequency Bandwidth > (-20dB)",
          tone: "warning",
          items: [
            {
              id: "spectral-roll-bandwidth",
              text: "Roll: 134 Hz to 224 Hz - 90 Hz bandwidth",
            },
            {
              id: "spectral-pitch-bandwidth",
              text: "Pitch: 147 Hz to 219 Hz - 72 Hz bandwidth",
            },
          ],
        },
      ],
      notes: [
        "Keep this slide observational: both axes contain concentrated energy near 200 Hz. The next slide explains why that frequency can become visible camera jello.",
        "Do not describe both peaks as 0 dB. Roll approaches 0 dB; pitch peaks lower on this relative spectral-density scale.",
      ],
    },
    {
      id: "frame-resonance-expectation",
      sectionId: "mechanical",
      title: "200 Hz Frame Resonance Was Expected by Design",
      layout: "comparison",
      estimatedMinutes: 2,
      blocks: [
        {
          type: "image",
          src: deckImage("chris-rosser-aos-ul7-labeled.png"),
          alt: "Chris Rosser reference screenshot discussing frame resonance and mechanical vibration.",
          caption: "Chirs Rosser Youtube video screenshot: https://www.youtube.com/watch?v=YJYtmcCaSn4&t=11s",
          aspectRatio: 1.7549,
        },
        {
          type: "bullets",
          title: "Expected",
          tone: "accent",
          items: [
            {
              id: "frame-resonance-expected",
              text: "Screenshot from Chis Rosser's video (designer) showing frame resonance at 200 Hz",
            },
          ],
        },
        {
          type: "bullets",
          title: "Design Intent",
          tone: "success",
          items: [
            {
              id: "frame-resonance-design",
              text: "The frame was designed to mechanically minimize vibration using modal analysis",
            },
          ],
        },
        {
          type: "bullets",
          title: "Unexpected Magnitude",
          tone: "warning",
          items: [
            {
              id: "frame-resonance-magnitude",
              text: "His frame resonance is lower amplitude than the motor harmonics",
            },
          ],
        },
      ],
      notes: [
        "The frequency itself is plausible for a frame mode; the surprising result is how strongly it dominates the measured spectrum.",
        "The 0 dB value is relative to this plot's reference, not an absolute vibration displacement.",
      ],
    },
    {
      id: "mechanical-candidates",
      sectionId: "mechanical",
      title: "The likely mechanism was relative motion, not frame frequency alone",
      subtitle: "A known mode becomes a problem when a large or flexible component excites it strongly.",
      layout: "content",
      estimatedMinutes: 1.5,
      blocks: [
        {
          type: "twoColumn",
          columns: [
            {
              title: "Candidate excitation paths",
              items: [
                { id: "battery-mass", text: "Battery motion", detail: "A large fraction of vehicle mass moving relative to the frame changes the system dynamics." },
                { id: "antenna-flex", text: "Flexible antenna holders", detail: "Zip-tied components can introduce poorly constrained local motion." },
                { id: "loose-components", text: "Other loose or compliant parts", detail: "Small components can transmit vibration into the camera or frame." },
              ],
            },
            {
              title: "Physical checks",
              items: [
                { id: "constraint", text: "Constrain translation and rotation", detail: "Inspect which axes remain free under flight loads." },
                { id: "mass-stiffness", text: "Change mass or stiffness deliberately", detail: "A mechanical change should move or reduce the spectral feature." },
                { id: "repeat-log", text: "Repeat the same flight condition", detail: "Compare both video output and frequency-domain evidence." },
              ],
            },
          ],
        },
      ],
      notes: [
        "The key mechanical insight is the battery: on a seven-inch aircraft it is too much moving mass to treat as an accessory.",
      ],
    },
    {
      id: "mechanical-change-result",
      sectionId: "mechanical",
      title: "Constraint changes came before filter changes",
      subtitle: "The second battery strap was the highest-leverage mechanical intervention reported.",
      layout: "content",
      estimatedMinutes: 1.5,
      blocks: [
        {
          type: "twoColumn",
          columns: [
            {
              title: "Changes made",
              items: [
                { id: "second-strap", text: "Added a second battery strap", detail: "Constrained battery motion in additional axes." },
                { id: "antenna-mount", text: "Replaced flexible antenna restraint", detail: "Used a designed mount instead of relying on zip ties alone." },
                { id: "secure-parts", text: "Secured other flexible components", detail: "Removed avoidable relative motion before retesting." },
              ],
            },
            {
              title: "Evidence required for final deck",
              items: [
                { id: "hardware-before-after", text: "[INSERT] Hardware before / after", detail: "Battery and antenna mounting photographs." },
                { id: "jello-before-after", text: "[INSERT] Video still before / after", detail: "Same camera mode and comparable flight condition." },
                { id: "spectrum-before-after", text: "[INSERT] Spectrum before / after", detail: "Verify the dominant peak was reduced, not merely filtered." },
              ],
            },
          ],
        },
        {
          type: "callout",
          label: "Current conclusion",
          text: "Treat the mechanical fix as supported by the presenter’s diagnosis; replace placeholders before asserting measured improvement.",
          tone: "warning",
        },
      ],
      notes: [
        "Do not invent the magnitude of improvement. Present the change confidently, but reserve quantitative language until the actual before/after evidence is inserted.",
      ],
    },
    {
      id: "filtering-checkpoint",
      sectionId: "filtering",
      title: "Checkpoint: clean the signal without making it late",
      layout: "content",
      estimatedMinutes: 0.5,
      blocks: [
        {
          type: "twoColumn",
          columns: [
            {
              title: "Diagnostic status",
              items: [
                { id: "filtering-done-jello", text: "✓ Camera jello / vibration", detail: "MECHANICAL PATH ADDRESSED" },
                { id: "filtering-current-motors", text: "▶ Hot or noisy motors", detail: "CURRENT" },
                { id: "filtering-open-tracking", text: "□ Poor tracking / bounceback", detail: "OPEN" },
              ],
            },
            {
              title: "Question to answer",
              items: [
                { id: "filtering-question", text: "Which energy is noise, and which is useful motion?", detail: "Attenuate the former without delaying the latter." },
              ],
            },
          ],
        },
      ],
      notes: ["Mechanical credibility makes the remaining filtering decisions interpretable."],
    },
    {
      id: "filtering-tradeoff",
      sectionId: "filtering",
      title: "Filtering is a bandwidth trade, not a cleanliness contest",
      subtitle: "Every filter must justify its attenuation against the delay it adds.",
      layout: "content",
      estimatedMinutes: 1.5,
      blocks: [
        {
          type: "twoColumn",
          columns: [
            {
              title: "Too little filtering",
              items: [
                { id: "d-amplifies", text: "D-term amplifies high-frequency content", detail: "Noise becomes rapid motor command activity." },
                { id: "motor-heat", text: "Motors run rougher and warmer", detail: "Electrical effort does not necessarily become useful thrust." },
              ],
            },
            {
              title: "Too much filtering",
              items: [
                { id: "phase-delay", text: "Phase delay increases", detail: "The controller reacts later to real vehicle motion." },
                { id: "soft-response", text: "Recovery and tracking become soft", detail: "Propwash and pilot inputs expose the lost bandwidth." },
              ],
            },
          ],
        },
        {
          type: "callout",
          label: "Decision rule",
          text: "Use the minimum filtering that makes the control signal and motor behavior credible.",
          tone: "accent",
        },
      ],
      notes: ["The cleanest spectrum is not automatically the best flying aircraft."],
    },
    {
      id: "rpm-filter-diagnosis",
      sectionId: "filtering",
      title: "A missing RPM harmonic forced dynamic notches onto motor noise",
      subtitle: "The filters were working, but they were working in the wrong place.",
      layout: "comparison",
      estimatedMinutes: 2.25,
      blocks: [
        {
          type: "image",
          src: deckImage("rpm-dynamic-notch.png"),
          alt: "PIDToolbox spectrum annotated with dynamic notch and motor harmonic locations.",
          caption: "Initial diagnosis: dynamic notches overlapping motor-synchronous harmonics",
          aspectRatio: 2.0758,
        },
        {
          type: "bullets",
          title: "Observed configuration",
          tone: "warning",
          items: [
            { id: "rpm-weight", text: "RPM weights were 100, 0, 80", detail: "The second motor harmonic had no RPM-filter coverage." },
            { id: "dn-min", text: "Dynamic-notch minimum was 150 Hz", detail: "Both dynamic notches were pulled toward motor-harmonic content." },
          ],
        },
        {
          type: "bullets",
          title: "Corrective direction",
          tone: "success",
          items: [
            { id: "restore-rpm", text: "Restore second-harmonic RPM coverage", detail: "Motor-synchronous noise belongs in the motor-tracking filter." },
            { id: "free-dn", text: "Free dynamic notches for frame resonances", detail: "This separates known motor content from non-motor structural content." },
          ],
        },
      ],
      notes: [
        "The initial expert recommendation was RPM weights 100,40,80 and a 100 Hz dynamic-notch minimum; later evidence supported tuning the exact weights for this aircraft.",
        "Frame this as hypothesis, configuration inspection, and log validation—not as blindly applying a preset.",
      ],
    },
    {
      id: "low-pass-strategy",
      sectionId: "filtering",
      title: "Broad low-pass filtering was reduced only where the spectrum allowed it",
      subtitle: "Large props and low-KV motors move useful and unwanted content lower than on a typical five-inch quad.",
      layout: "comparison",
      estimatedMinutes: 1.75,
      blocks: [
        {
          type: "image",
          src: deckImage("pidtoolbox-filter-settings.png"),
          alt: "Annotated PIDToolbox filter configuration used during the filtering investigation.",
          caption: "Filter configuration reviewed against the measured spectrum",
          aspectRatio: 1.7587,
        },
        {
          type: "bullets",
          title: "Practical decisions",
          tone: "accent",
          items: [
            { id: "gyro-lpf", text: "Remove redundant gyro LPF1 only after checking the noise floor", detail: "Preserve bandwidth where another filter already covers the risk." },
            { id: "dterm-pt1", text: "Use two PT1 D-term filters as a conservative baseline", detail: "Then move sliders only with post-filter and motor-temperature evidence." },
            { id: "low-motor-band", text: "Set RPM coverage for the lower motor band", detail: "The discussion identified an 80 Hz minimum for this large, low-KV system." },
          ],
        },
        {
          type: "callout",
          label: "Noise-floor rule",
          text: "Treat approximately −30 dB as a practical plot-specific threshold, not a universal physical constant.",
          tone: "warning",
        },
      ],
      notes: [
        "Do not claim a ten-times amplitude reduction for a ten-decibel change. The appendix distinguishes amplitude dB from power/PSD dB.",
      ],
    },
    {
      id: "esc-actuator-bandwidth",
      sectionId: "filtering",
      title: "ESC settings changed the actuator-side noise and heat trade",
      subtitle: "Commands above useful motor bandwidth can become current ripple and heat instead of thrust.",
      layout: "comparison",
      estimatedMinutes: 1.75,
      blocks: [
        {
          type: "image",
          src: deckImage("fixed-24khz-spectrum.png"),
          alt: "Frequency spectrum from the fixed 24 kilohertz ESC PWM test at master multiplier 1.2.",
          caption: "Fixed 24 kHz comparison flight; use comparable conditions when drawing the final conclusion",
          aspectRatio: 1.8519,
        },
        {
          type: "bullets",
          title: "Why PWM belongs in the investigation",
          tone: "accent",
          items: [
            { id: "electrical-path", text: "ESC switching shapes the electrical command path", detail: "Variable 24–48 kHz and fixed 24 kHz are actuator configurations, not cosmetic settings." },
            { id: "inductance", text: "Motor inductance resists rapid current change", detail: "Torque cannot follow arbitrarily high-frequency controller commands." },
            { id: "compare-outcomes", text: "Compare spectrum, temperature, and smoothness together", detail: "No single plot establishes the best actuator setting." },
          ],
        },
        {
          type: "callout",
          label: "VERIFY BEFORE FINAL",
          text: "Insert measured motor temperatures and the selected fixed/variable PWM setting.",
          tone: "warning",
        },
      ],
      notes: [
        "Keep the motor-as-low-pass analogy qualitative in the main deck. The electrical equation is in the appendix.",
      ],
    },
    {
      id: "filtering-result",
      sectionId: "filtering",
      title: "The revised filters separated motor noise from structural content",
      subtitle: "That made motor behavior safer to evaluate and the next controller tests more meaningful.",
      layout: "comparison",
      estimatedMinutes: 1.5,
      blocks: [
        {
          type: "image",
          src: deckImage("post-rpm-filter-spectrum.png"),
          alt: "Post-change PIDToolbox spectrum after revising RPM and dynamic-notch filtering.",
          caption: "Post RPM/dynamic-notch filter review",
          aspectRatio: 1.7434,
        },
        {
          type: "bullets",
          title: "What changed in the interpretation",
          tone: "success",
          items: [
            { id: "motor-filter-owned", text: "RPM filtering owned motor-synchronous harmonics", detail: "Dynamic notches were available for non-motor resonances." },
            { id: "response-ready", text: "Remaining response error could be treated as a control problem", detail: "The investigation could now move from frequency domain to time domain." },
          ],
        },
        {
          type: "callout",
          label: "Transition",
          text: "Once the signal path was credible, PID tuning became evidence instead of compensation.",
          tone: "accent",
        },
      ],
      notes: [
        "Avoid declaring the motor-temperature issue fully solved until the final temperature values are inserted.",
      ],
    },
    {
      id: "pid-checkpoint",
      sectionId: "pid",
      title: "Checkpoint: tune the response after the plant and signal are credible",
      layout: "content",
      estimatedMinutes: 0.5,
      blocks: [
        {
          type: "twoColumn",
          columns: [
            {
              title: "Diagnostic status",
              items: [
                { id: "pid-done-jello", text: "✓ Camera jello / vibration", detail: "MECHANICAL PATH ADDRESSED" },
                { id: "pid-done-motors", text: "✓ Hot or noisy motors", detail: "FILTER STRATEGY ADDRESSED" },
                { id: "pid-current-tracking", text: "▶ Poor tracking / bounceback", detail: "CURRENT" },
              ],
            },
            {
              title: "Question to answer",
              items: [
                { id: "pid-question", text: "How much damping and command authority does the plant support?", detail: "Measure latency, overshoot, and rebound with repeatable inputs." },
              ],
            },
          ],
        },
      ],
      notes: ["The tuning section begins only after the earlier layers have been addressed."],
    },
    {
      id: "pid-test-method",
      sectionId: "pid",
      title: "Repeatable excitation replaced subjective stick feel",
      subtitle: "Method-B wobble inputs made gain changes comparable across flights.",
      layout: "comparison",
      estimatedMinutes: 1.75,
      blocks: [
        {
          type: "image",
          src: deckImage("method-b-overview.png"),
          alt: "PIDToolbox Method-B overview showing frequency response and roll/pitch step-response results.",
          caption: "Consistent wobble-script input exposes both frequency and time-domain behavior",
          aspectRatio: 1.6948,
        },
        {
          type: "bullets",
          title: "Test discipline",
          tone: "accent",
          items: [
            { id: "consistent-input", text: "Use the same scripted excitation", detail: "Changes in the trace should come from the tune, not the pilot input." },
            { id: "axis-specific", text: "Evaluate roll and pitch separately", detail: "The seven-inch mass distribution does not create identical axis dynamics." },
            { id: "two-domains", text: "Use spectrum and step response together", detail: "One reveals noise; the other reveals latency and damping." },
          ],
        },
      ],
      notes: [
        "This is the measurement upgrade in the story: better excitation before more tuning.",
      ],
    },
    {
      id: "initial-pid-configuration",
      sectionId: "pid",
      title: "The controller was simplified before gains were increased",
      subtitle: "Reducing interacting variables made each response change interpretable.",
      layout: "timeline",
      estimatedMinutes: 1.5,
      blocks: [
        {
          type: "timeline",
          items: [
            { id: "ff-off", label: "01", title: "Feedforward off", description: "Remove command-path assistance while measuring feedback behavior." },
            { id: "i-low", label: "02", title: "I-term nearly off", description: "Reduce slow-state interaction during the initial step tests." },
            { id: "dmax-off", label: "03", title: "D-max off", description: "Keep damping behavior tied to the tested D gain." },
            { id: "pd-low", label: "04", title: "Lower P/D balance", description: "Start near 0.6–0.8, then increase systematically." },
            { id: "sweep", label: "05", title: "Controlled sweep", description: "Test master multiplier and axis balance against response shape." },
          ],
        },
      ],
      notes: [
        "This is an isolation strategy, not the final flight configuration.",
      ],
    },
    {
      id: "pd-balance",
      sectionId: "pid",
      title: "P/D balance was selected from response shape",
      subtitle: "The target was fast response with low overshoot and low rebound—not the largest gain value.",
      layout: "comparison",
      estimatedMinutes: 2.25,
      blocks: [
        {
          type: "image",
          src: deckImage("pd-balance-comparison.png"),
          alt: "PIDToolbox P/D balance comparison for roll and pitch axes.",
          caption: "Axis-specific P/D balance comparison",
          aspectRatio: 1.8875,
        },
        {
          type: "bullets",
          title: "Interpretation",
          tone: "accent",
          items: [
            { id: "overshoot", text: "Overshoot indicated insufficient damping", detail: "Increase relative D or reduce proportional aggression." },
            { id: "slow-rise", text: "A slow, rounded response indicated excess damping", detail: "Reduce relative D or reconsider overall gain." },
            { id: "axis-balance", text: "Pitch required its own balance decision", detail: "Higher pitch inertia made a copied roll value unreliable." },
          ],
        },
        {
          type: "callout",
          label: "Language discipline",
          text: "Describe the selected response as low-overshoot or near critically damped unless damping ratio is calculated.",
          tone: "warning",
        },
      ],
      notes: [
        "The archived discussion initially called a response critically damped, then expert review identified it as over-damped—use that as an example of why the trace matters more than the label.",
      ],
    },
    {
      id: "latency-result",
      sectionId: "pid",
      title: "Latency became a measured tuning target",
      subtitle: "The final roll/pitch comparison was evaluated in milliseconds, not adjectives.",
      layout: "comparison",
      estimatedMinutes: 1.75,
      blocks: [
        {
          type: "image",
          src: deckImage("final-latency-step-response.png"),
          alt: "Final PIDToolbox roll and pitch step-response comparison after latency tuning.",
          caption: "Final roll-latency adjustment and pitch comparison",
          aspectRatio: 2.7936,
        },
        {
          type: "bullets",
          title: "What the trace was used to judge",
          tone: "success",
          items: [
            { id: "rise-delay", text: "Setpoint-to-gyro delay", detail: "How late the aircraft begins and completes the commanded response." },
            { id: "alignment", text: "Roll/pitch alignment", detail: "Whether the two axes produce comparable pilot feel." },
            { id: "rebound", text: "Overshoot and rebound", detail: "Whether the faster response remains controlled." },
          ],
        },
        {
          type: "callout",
          label: "VERIFY: reported pitch improvement ≈ 12 ms",
          text: "Replace this placeholder with exact before/after values read from the selected comparable traces.",
          tone: "warning",
        },
      ],
      notes: [
        "Do not state the twelve-millisecond value as final until exact before/after trace values are confirmed.",
      ],
    },
    {
      id: "restore-i-feedforward",
      sectionId: "pid",
      title: "I-term and feedforward returned only after damping was credible",
      subtitle: "Feedback stabilized the plant first; feedforward then improved command tracking.",
      layout: "comparison",
      estimatedMinutes: 1.75,
      blocks: [
        {
          type: "image",
          src: deckImage("feedforward-0p8-trace.png"),
          alt: "Blackbox trace from the feedforward 0.8 comparison flight.",
          caption: "Feedforward 0.8 comparison trace",
          aspectRatio: 3.0924,
        },
        {
          type: "bullets",
          title: "Reintroduction sequence",
          tone: "accent",
          items: [
            { id: "restore-i", text: "Restore I-term for persistent-error rejection", detail: "Return the controller toward the intended flight configuration." },
            { id: "test-ff", text: "Compare feedforward settings against setpoint tracking", detail: "The archive includes 0.8 and 1.0 test traces." },
            { id: "smooth-carefully", text: "Add smoothing only when the input demands it", detail: "Smoothing can improve noise behavior while adding command delay." },
          ],
        },
        {
          type: "callout",
          label: "INSERT: final setpoint vs gyro trace",
          text: "Use the verified final log here rather than treating a tuning iteration as the final result.",
          tone: "warning",
        },
      ],
      notes: [
        "The available 0.8 and 1.0 traces are evidence of the comparison process; label the true final trace only after confirming which log was flown with the final configuration.",
      ],
    },
    {
      id: "final-validation",
      sectionId: "validation",
      title: "Validation must close every original failure",
      subtitle: "Logs establish mechanism; footage, temperature, and pilot workload establish mission success.",
      layout: "content",
      estimatedMinutes: 2.25,
      blocks: [
        {
          type: "twoColumn",
          columns: [
            {
              title: "Initial state",
              items: [
                { id: "initial-jello", text: "Camera jello visible", detail: "Dominant spectral feature near 200 Hz." },
                { id: "initial-motor", text: "Motors warming as ambient temperature rose", detail: "D-term retained visible post-filter noise." },
                { id: "initial-response", text: "Response delayed and over-damped", detail: "Bounceback and imperfect setpoint tracking remained." },
                { id: "initial-workload", text: "Higher pilot correction workload", detail: "Aircraft was flyable but not yet a dependable chase platform." },
              ],
            },
            {
              title: "Final state — verify with evidence",
              items: [
                { id: "final-jello", text: "[INSERT] Jello before / after", detail: "Same camera mode and comparable flight condition." },
                { id: "final-motor", text: "[INSERT] Motor temperatures", detail: "Ambient, flight duration, and test configuration recorded." },
                { id: "final-response", text: "[INSERT] Final latency / tracking values", detail: "Exact roll and pitch comparison from final logs." },
                { id: "final-workload", text: "[INSERT] Pilot and footage outcome", detail: "Document disturbance recovery and corrective-input reduction." },
              ],
            },
          ],
        },
        {
          type: "callout",
          label: "Final checkpoint",
          text: "✓ Mechanical path  ·  ✓ Signal path  ·  ✓ Control response — once the replacement evidence is inserted.",
          tone: "success",
        },
      ],
      notes: [
        "This is the acceptance slide. Do not convert any placeholder to a checkmark without the corresponding evidence.",
      ],
    },
    {
      id: "engineering-takeaways",
      sectionId: "validation",
      title: "The diagnostic order mattered more than the final values",
      layout: "content",
      estimatedMinutes: 1.75,
      blocks: [
        {
          type: "timeline",
          items: [
            { id: "takeaway-mechanical", label: "01", title: "Fix real motion", description: "Do not hide physical looseness with filtering." },
            { id: "takeaway-logs", label: "02", title: "Separate the signals", description: "Use logs to distinguish vibration, motor noise, and response error." },
            { id: "takeaway-delay", label: "03", title: "Trade attenuation for delay", description: "A useful filter removes noise without erasing control bandwidth." },
            { id: "takeaway-tune", label: "04", title: "Tune last", description: "PID evidence is meaningful only after the plant and signal path are credible." },
            { id: "takeaway-validate", label: "05", title: "Close the mission loop", description: "Validate data, motor behavior, footage, and pilot workload." },
          ],
        },
        {
          type: "quote",
          quote: "Mechanical → Filtering → Control Loop",
          attribution: "The reusable debugging sequence",
        },
      ],
      notes: ["End on the method the audience can reuse, not on a Betaflight screenshot."],
    },
    {
      id: "qa",
      sectionId: "validation",
      title: "Thank you",
      subtitle: "Happy to walk through any logs, settings, or assumptions in detail.",
      layout: "closing",
      estimatedMinutes: 0.25,
      blocks: [
        {
          type: "headline",
          text: "Questions?",
          subtext: "Backup material follows for filtering, actuator physics, and PID response.",
        },
      ],
      notes: ["Target arrival at approximately 36–39 minutes to preserve discussion time."],
    },
    {
      id: "appendix-divider",
      sectionId: "validation",
      title: "Technical appendix",
      subtitle: "Supporting calculations, raw evidence, and preserved source slides",
      layout: "title",
      blocks: [
        {
          type: "headline",
          eyebrow: "For technical Q&A",
          text: "Evidence behind the decisions",
          subtext: "Use these slides selectively; they are not part of the timed main narrative.",
        },
      ],
      notes: ["Appendix divider."],
    },
    {
      id: "appendix-raw-filtering",
      sectionId: "validation",
      title: "Raw filtering evidence: the initial noise changed with throttle",
      layout: "comparison",
      blocks: [
        {
          type: "image",
          src: deckImage("initial-frequency-heatmap.png"),
          alt: "Initial frequency heatmap showing motor-related noise across throttle.",
          caption: "Initial BTFL_001.01 frequency heatmap",
          aspectRatio: 1.4341,
        },
        {
          type: "bullets",
          title: "Use in Q&A",
          tone: "accent",
          items: [
            { id: "heatmap-purpose", text: "Throttle-correlated bands support a motor/prop source", detail: "They move with operating condition rather than remaining at one fixed frequency." },
            { id: "frame-purpose", text: "A persistent band supports a structural candidate", detail: "This distinction motivates RPM filters and dynamic notches doing different jobs." },
          ],
        },
      ],
      notes: ["Raw evidence supporting the motor-synchronous versus structural distinction."],
    },
    {
      id: "appendix-db-math",
      sectionId: "validation",
      title: "dB interpretation depends on the plotted quantity",
      layout: "content",
      blocks: [
        {
          type: "twoColumn",
          columns: [
            {
              title: "Amplitude ratio",
              items: [
                { id: "amplitude-equation", text: "dB = 20 log₁₀(A/Aref)", detail: "A 10 dB change is approximately 3.16× in amplitude." },
                { id: "minus-thirty-amplitude", text: "−30 dB ≈ 3.16% amplitude", detail: "Relative to the plot reference." },
              ],
            },
            {
              title: "Power / PSD ratio",
              items: [
                { id: "power-equation", text: "dB = 10 log₁₀(P/Pref)", detail: "A 10 dB change is 10× in power." },
                { id: "minus-thirty-power", text: "−30 dB = 0.1% power", detail: "Only when the plotted quantity is power or PSD." },
              ],
            },
          ],
        },
        {
          type: "callout",
          label: "Caution",
          text: "Never translate −20 dB to −30 dB into a magnitude claim without confirming the plot convention.",
          tone: "warning",
        },
      ],
      notes: ["The main deck deliberately avoids an unsupported ten-times magnitude claim."],
    },
    {
      id: "appendix-lp1-math",
      sectionId: "validation",
      title: "A first-order low-pass trades attenuation for phase",
      layout: "content",
      blocks: [
        {
          type: "bullets",
          title: "First-order model",
          tone: "accent",
          items: [
            { id: "lp-transfer", text: "H(s) = 1 / (1 + s/ωc)", detail: "ωc = 2πfc defines the cutoff." },
            { id: "lp-three-db", text: "At fc: magnitude is −3 dB and phase is −45°", detail: "The filter is already delaying content at its cutoff." },
            { id: "lp-stack", text: "Cascaded filters add attenuation and phase lag", detail: "Redundant filters can cost response without removing meaningful additional noise." },
          ],
        },
        {
          type: "callout",
          label: "Control implication",
          text: "A filter that removes useful motion makes the measured plant look later than it is.",
          tone: "warning",
        },
      ],
      notes: ["Use only if the audience asks for the low-pass delay mechanism."],
    },
    {
      id: "appendix-notch-q",
      sectionId: "validation",
      title: "Notch Q controls how narrowly a resonance is attenuated",
      layout: "content",
      blocks: [
        {
          type: "twoColumn",
          columns: [
            {
              title: "High Q",
              items: [
                { id: "high-q", text: "Narrow notch", detail: "Less collateral attenuation and phase effect, but easier to miss moving noise." },
              ],
            },
            {
              title: "Low Q",
              items: [
                { id: "low-q", text: "Wide notch", detail: "More robust coverage, but more useful bandwidth is disturbed." },
              ],
            },
          ],
        },
        {
          type: "bullets",
          title: "Relationship",
          tone: "accent",
          items: [
            { id: "q-equation", text: "Q = f₀ / bandwidth", detail: "Bandwidth is conventionally measured between the −3 dB points." },
            { id: "q-purpose", text: "RPM tracking reduces the need for a wide fixed notch", detail: "Center frequency follows motor speed instead of guessing one stationary frequency." },
          ],
        },
      ],
      notes: ["Connect Q back to the observed moving motor harmonics."],
    },
    {
      id: "appendix-motor-physics",
      sectionId: "validation",
      title: "Motor electrical dynamics limit useful command bandwidth",
      layout: "comparison",
      blocks: [
        {
          type: "image",
          src: deckImage("am32-esc-settings.png"),
          alt: "AM32 ESC settings used during actuator configuration review.",
          caption: "AM32 actuator configuration reviewed during the investigation",
          aspectRatio: 1.7843,
        },
        {
          type: "bullets",
          title: "Simplified model",
          tone: "accent",
          items: [
            { id: "motor-voltage", text: "V = Ri + L di/dt + back-EMF", detail: "Inductance resists rapid current change." },
            { id: "motor-torque", text: "Torque ≈ Kt · current", detail: "If current cannot follow the command, useful torque cannot follow it either." },
            { id: "motor-heat-detail", text: "High-frequency effort can become ripple and heat", detail: "This is a qualitative mechanism, not a complete motor model." },
          ],
        },
      ],
      notes: ["Avoid claiming all high-frequency command energy becomes heat; the model is intentionally simplified."],
    },
    {
      id: "appendix-pid-sweep",
      sectionId: "validation",
      title: "The P/D sweep exposed the usable response range",
      layout: "comparison",
      blocks: [
        {
          type: "image",
          src: deckImage("motor-output-limit.png"),
          alt: "AM32 motor output and KV matching configuration used during system setup.",
          caption: "Actuator matching and output-limit context",
          aspectRatio: 1.2658,
        },
        {
          type: "bullets",
          title: "Additional configuration context",
          tone: "accent",
          items: [
            { id: "kv-match", text: "Motor output limits were reviewed for KV matching", detail: "Controller conclusions depend on comparable actuator authority." },
            { id: "sweep-order", text: "P/D balance preceded master-multiplier selection", detail: "Shape the response before scaling overall authority." },
            { id: "ff-order", text: "Feedforward comparison came last", detail: "Command tracking should not mask incorrect feedback damping." },
          ],
        },
      ],
      notes: ["Supporting configuration context for detailed tuning questions."],
    },
    {
      id: "cover",
      sectionId: "validation",
      title: "Engineering Stable Flight",
      subtitle: "An algorithmic approach to drone performance",
      layout: "title",
      estimatedMinutes: 1,
      blocks: [
        {
          type: "headline",
          text: "David Fitzgerald",
          subtext: "June 24th",
        },
      ],
      notes: ["Opening title slide."],
    },
    {
      id: "camera-jello",
      sectionId: "validation",
      title: "Jello in the camera footage",
      layout: "content",
      estimatedMinutes: 1,
      blocks: [],
      notes: [
        "Intentionally blank for now. Add the representative camera frame or short video example in a later pass.",
      ],
    },
    {
      id: "spectral-evidence-rpm",
      sectionId: "validation",
      title: "Power Spectral Density 200Hz Resonance",
      layout: "comparison",
      estimatedMinutes: 2,
      blocks: [
        {
          type: "image",
          src: deckImage("btfl001-spectral-200hz-peaks-rpm.png"),
          alt: "Roll and pitch gyro spectral power plots near 200 hertz with motor RPM data.",
          caption: "BTFL_001.01 power spectral density with RPM data",
          aspectRatio: 1.2967,
        },
        {
          type: "bullets",
          title: "Amplitude",
          tone: "accent",
          items: [
            {
              id: "spectral-rpm-roll-amplitude",
              text: "Roll reaches 0 dB at 200 Hz",
            },
            {
              id: "spectral-rpm-pitch-amplitude",
              text: "Pitch reaches -5 dB at 189 Hz",
            },
          ],
        },
        {
          type: "bullets",
          title: "Frequency Bandwidth > (-20dB)",
          tone: "warning",
          items: [
            {
              id: "spectral-rpm-roll-bandwidth",
              text: "Roll: 134 Hz to 224 Hz - 90 Hz bandwidth",
            },
            {
              id: "spectral-rpm-pitch-bandwidth",
              text: "Pitch: 147 Hz to 219 Hz - 72 Hz bandwidth",
            },
          ],
        },
        {
          type: "bullets",
          title: "RPM Filters",
          tone: "success",
          items: [
            {
              id: "spectral-rpm-filtering",
              text: "RPM filters get rid of motor noise but still show signal peak post filtering",
            },
          ],
        },
      ],
      notes: [
        "The RPM overlay separates motor harmonics from the persistent structural signal near 200 Hz.",
        "RPM filtering removes the motor-correlated noise, while the 200 Hz peak remains visible after filtering.",
      ],
    },
    {
      id: "rolling-shutter-jello",
      sectionId: "validation",
      title: "Why this is a problem",
      subtitle:
        "Assume 4K/60: Tframe = 16.67 ms · Tscan ≈ 16 ms · exposure = 1 ms · measured peak fvib = 200 Hz at 0 dB.",
      layout: "comparison",
      estimatedMinutes: 4,
      blocks: [
        {
          type: "image",
          src: deckImage("rolling-shutter-jello-model.png"),
          alt: "Hand-drawn diagrams showing a vibration wave during rolling-shutter scan and its sampled alias.",
          labels: ["Waves per frame", "Aliasing · 120° per frame"],
          caption: "Left: phase accumulated during the sensor scan. Right: motion sampled once per video frame.",
          aspectRatio: 2.3216,
        },
        {
          type: "bullets",
          title: "1 · Waves per frame",
          tone: "accent",
          items: [
            {
              id: "waves-equation",
              text: "n waves equals scan time multiplied by vibration frequency",
              equation: [
                { text: "n" },
                { text: "waves", script: "sub" },
                { text: " = T" },
                { text: "scan", script: "sub" },
                { text: " × f" },
                { text: "vib", script: "sub" },
              ],
              detail: "(0.016 s)(200 Hz) = 3.2 waves / frame",
              detailEquation: [{ text: "(0.016 s)(200 Hz) = 3.2 waves / frame" }],
            },
          ],
        },
        {
          type: "bullets",
          title: "2 · Phase aliasing",
          tone: "warning",
          items: [
            {
              id: "alias-equation",
              text: "vibration cycles captured between frames",
              equation: [{ text: "200 Hz / 60 fps = 3⅓ cycles / frame" }],
              detail: "Ignore 3 complete cycles  →  ⅓ cycle × 360° = 120° / frame",
              detailEquation: [{ text: "⅓ cycle × 360° = 120° / frame" }],
            },
          ],
        },
        {
          type: "callout",
          label: "Result",
          text: "The 200 Hz mechanical mode can appear as 3.2 rolling-shutter waves that advance 120° between frames.",
          tone: "success",
        },
      ],
      notes: [
        "Tscan = 16 ms is an explicit assumption until the exact action-camera model and 4K60 mode are measured or documented.",
        "A 1/1000 s exposure spans 0.2 vibration cycles: (0.001 s)(200 Hz) = 0.2. The short exposure helps preserve the distortion instead of averaging it away.",
        "The 0 dB peak is relative spectral magnitude, not an absolute displacement measurement. This math establishes a frequency-consistent mechanism; it does not by itself prove amplitude or causation.",
        "Reference checked: Gyroflow's community lens profiles contain camera- and mode-specific readout values, including approximately 16.6 ms for some older GoPro 4K modes, but no authoritative exact 4K60 value was found for the unspecified camera: https://github.com/gyroflow/lens_profiles",
      ],
    },
    {
      id: "solution-path",
      sectionId: "validation",
      title: "Solution path",
      subtitle: "Treat the artifact as a coupled mechanical, control, and camera-sampling problem.",
      layout: "timeline",
      estimatedMinutes: 3,
      blocks: [
        {
          type: "timeline",
          items: [
            {
              id: "diagnose",
              label: "01",
              title: "Diagnose",
              description: "Locate the 200 Hz peak and identify when it appears in flight.",
            },
            {
              id: "trace",
              label: "02",
              title: "Trace",
              description: "Separate the source, structural path, controller response, and camera artifact.",
            },
            {
              id: "change",
              label: "03",
              title: "Change",
              description: "Modify the highest-leverage mechanical or control parameter.",
            },
            {
              id: "verify",
              label: "04",
              title: "Verify",
              description: "Confirm the peak and the visible jello both decrease.",
            },
          ],
        },
      ],
      notes: [
        "Sketch slide: replace this process scaffold with the actual solution once the intervention sequence is finalized.",
      ],
    },
  ],
} satisfies DeckInput;
