import type { DeckInput } from "./schema";

const deckImage = (name: string) => `/screenshots/deck/${name}`;

export const deck = {
  meta: {
    title: "Fixing a new drone",
    subtitle: "An algorithmic approach to drone performance",
    presenter: "David Fitzgerald",
    dateLabel: "June 24th",
    durationMinutes: 45,
  },
  sections: [
    { id: "objective", title: "Objective", shortTitle: "Objective" },
    {
      id: "baseline",
      title: "Baseline Failure",
      shortTitle: "Baseline Failure",
    },
    { id: "mechanical", title: "Mechanical", shortTitle: "Mechanical" },
    {
      id: "filtering",
      title: "Filtering / ESC",
      shortTitle: "Filtering / ESC",
    },
    { id: "pid", title: "PID Tracking", shortTitle: "PID Tracking" },
    {
      id: "validation",
      title: "Final Validation",
      shortTitle: "Final Validation",
    },
  ],
  slides: [
    {
      id: "deck-title",
      sectionId: "objective",
      title: "Fixing a new drone",
      subtitle: "An algorithmic approach to drone performance",
      layout: "title",
      composition: "cover",
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
      subtitle: "Create a chase drone that meets four mission requirements.",
      layout: "content",
      composition: "metricGrid",
      estimatedMinutes: 2,
      blocks: [
        {
          type: "metricRow",
          variant: "requirements",
          metrics: [
            { id: "speed", value: "70 mph", label: "Top speed" },
            { id: "endurance", value: "15 minutes", label: "Flight time" },
            {
              id: "footage",
              value: "Smooth footage",
              label: "Action-camera video",
            },
            {
              id: "reliability",
              value: "Reliable + repeatable",
              label: "Performance",
              emphasis: true,
            },
          ],
        },
      ],
      notes: [
        "Sketch slide: refine the mission, range, endurance, payload, and image-quality requirements next.",
      ],
    },
    {
      id: "drone",
      sectionId: "objective",
      title: "The Drone",
      layout: "content",
      composition: "mediaStackRight",
      estimatedMinutes: 1,
      blocks: [
        {
          type: "image",
          src: "/graphics/drone-placeholder.svg",
          alt: "Replaceable placeholder for a photograph of the AOS UL7 chase drone.",
          caption: "Replace with final aircraft photograph",
          aspectRatio: 1.7778,
        },
        {
          type: "bullets",
          title: "Specifications",
          tone: "accent",
          items: [
            { id: "frame", text: "AOS UL7" },
            { id: "camera", text: "DJI Osmo Action 6" },
            { id: "battery", text: "6S1P RS50 Li-ion" },
            { id: "motors", text: "EMAX 2807 1300 KV" },
            { id: "props", text: "HQProp DP 7×3.5×3 PC" },
            { id: "fc", text: "Hobbywing F7" },
            {
              id: "esc",
              text: "Hobbywing XRotor Micro 65A 4-in-1 ESC, BLHeli32",
            },
            { id: "capacitor", text: "1×680 µF capacitor" },
          ],
        },
      ],
      notes: [
        "Translate the engineering measurements back to the job: stable footage, predictable response, and less pilot correction.",
      ],
    },
    {
      id: "baseline-failure",
      sectionId: "baseline",
      title: "Three Coupled Requirement Failures",
      layout: "content",
      composition: "metricGrid",
      estimatedMinutes: 1.5,
      blocks: [
        {
          type: "metricRow",
          variant: "failures",
          metrics: [
            { id: "jello-fail", value: "Camera Jello", tone: "danger" },
            { id: "motor-fail", value: "Hot Motors", tone: "danger" },
            { id: "tracking-fail", value: "Poor Tracking", tone: "danger" },
          ],
        },
        {
          type: "callout",
          label: "The Challenge",
          text: "A fresh build with frame-specific presets applied.",
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
      title: "Diagnostic Order: Plant → Sensor → Controller",
      subtitle: "Each component impacts the others. Iterate as needed.",
      layout: "timeline",
      estimatedMinutes: 1.5,
      steps: [
        { id: "system", label: "Diagnostic order", composition: "diagram" },
        { id: "order", label: "Diagnostic order", composition: "diagramCards" },
      ],
      blocks: [
        {
          type: "image",
          src: deckImage("plant-with-feedback-controller.png"),
          alt: "Feedback-control diagram linking the plant, sensor, and controller.",
          aspectRatio: 3.3458,
        },
        {
          type: "timeline",
          showAt: "order",
          items: [
            {
              id: "vehicle",
              label: "01",
              title: "Physical drone",
              description: "Mass, stiffness, mounts, and relative motion",
            },
            {
              id: "filters",
              label: "02",
              title: "Filtering / ESC",
              description: "Reduce noise and minimize delay",
            },
            {
              id: "controller",
              label: "03",
              title: "PID / Feedforward",
              description:
                "Critically damped with minimal-error setpoint tracking",
            },
          ],
        },
      ],
      notes: [
        "This order is the thesis of the presentation: mechanical first, signal quality second, control loop third.",
      ],
    },
    {
      id: "mechanical-checkpoint",
      sectionId: "mechanical",
      title: "Checkpoint: Addressing Mechanical Plant Vibration",
      layout: "content",
      composition: "checkpoint",
      estimatedMinutes: 0.5,
      blocks: [
        {
          type: "checkpoint",
          title: "Progress",
          items: [
            { id: "mechanical-current", text: "Camera Jello", state: "current" },
            { id: "mechanical-open-motors", text: "Hot Motors", state: "pending" },
            { id: "mechanical-open-tracking", text: "Poor Tracking", state: "pending" },
          ],
        },
      ],
      notes: [
        "The first section tests the physical system before touching the tune.",
      ],
    },
    {
      id: "jello-mechanism",
      sectionId: "mechanical",
      title: "How Rolling Shutter Turns Vibration Into Jello",
      layout: "comparison",
      composition: "dualMedia",
      estimatedMinutes: 1.5,
      blocks: [
        {
          type: "image",
          src: deckImage("rolling-shutter-example.png"),
          alt: "Diagram showing the row-by-row readout of a rolling-shutter sensor.",
          aspectRatio: 1.9943,
        },
        {
          type: "image",
          src: deckImage("jello-vs-frequency-sketch.png"),
          alt: "Sketch relating vibration frequency, scan timing, and waves visible in one frame.",
          aspectRatio: 2.3216,
        },
        {
          type: "bullets",
          title: "Physical mechanism",
          tone: "warning",
          items: [
            {
              id: "row-scan",
              text: "The sensor reads rows at different times",
            },
            {
              id: "harmonic-sync",
              text: "Shutter speed and image capture sync with frame harmonics to produce visible waves called jello",
            },
          ],
        },
        {
          type: "bullets",
          title: "Assumptions",
          items: [
            { id: "jm-assume-mode", text: "4K / 60 fps capture" },
            { id: "jm-assume-frame", text: "16.67 ms frame time" },
            { id: "jm-assume-scan", text: "≈16 ms sensor scan (assumed)" },
            { id: "jm-assume-peak", text: "200 Hz measured vibration peak" },
          ],
        },
        {
          type: "bullets",
          title: "Waves per frame",
          tone: "accent",
          items: [
            {
              id: "jm-waves-equation",
              text: "waves per frame",
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
          title: "Phase aliasing",
          tone: "warning",
          items: [
            {
              id: "jm-alias-equation",
              text: "200 Hz / 60 fps = 3⅓ cycles / frame",
              equation: [{ text: "200 Hz / 60 fps = 3⅓ cycles / frame" }],
              detail: "⅓ cycle × 360° = 120° / frame",
              detailEquation: [{ text: "⅓ cycle × 360° = 120° / frame" }],
            },
          ],
        },
      ],
      notes: [
        "The camera scans rows at different times, so high-frequency motion becomes spatial distortion instead of ordinary blur.",
        "The equation box previews the frequency math; the next slide works it through in full.",
      ],
    },
    {
      id: "jello-math",
      sectionId: "mechanical",
      title: "Why 200 Hz Produces Visible Jello",
      layout: "content",
      composition: "equationGrid",
      estimatedMinutes: 1.25,
      blocks: [
        {
          type: "metricRow",
          variant: "requirements",
          textSize: "support",
          metrics: [
            { id: "video-mode", value: "4K / 60", label: "Video mode" },
            { id: "frame-time", value: "16.67 ms", label: "Frame time" },
            { id: "scan-time", value: "≈16 ms", label: "Scan time" },
            { id: "vibration-peak", value: "200 Hz", label: "Measured peak" },
          ],
        },
        {
          type: "bullets",
          title: "Waves per frame",
          tone: "accent",
          textSize: "large",
          items: [
            {
              id: "waves-equation",
              text: "waves per frame",
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
          title: "Phase aliasing",
          tone: "warning",
          textSize: "large",
          items: [
            {
              id: "alias-equation",
              text: "200 Hz / 60 fps = 3⅓ cycles / frame",
              equation: [{ text: "200 Hz / 60 fps = 3⅓ cycles / frame" }],
              detail: "⅓ cycle × 360° = 120° / frame",
              detailEquation: [{ text: "⅓ cycle × 360° = 120° / frame" }],
            },
          ],
        },
      ],
      notes: [
        "The 16 ms sensor scan time remains an explicit assumption until the camera mode is measured or documented.",
        "This calculation establishes a frequency-consistent mechanism; it does not prove amplitude or causation by itself.",
      ],
    },
    {
      id: "spectral-evidence",
      sectionId: "mechanical",
      title: "Power Spectral Density: 200 Hz Resonance",
      layout: "comparison",
      composition: "mediaAnalysis",
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
          title: "Observations",
          tone: "accent",
          items: [
            {
              id: "spectral-peak",
              text: "Very high 0 dB roll amplitude",
            },
            {
              id: "spectral-pitch-transition",
              text: "Roll amplitude is slightly higher than pitch",
            },
          ],
        },
      ],
      notes: [
        "Keep this slide observational: both axes contain concentrated energy near 200 Hz.",
      ],
    },
    {
      id: "spectral-evidence-rpm",
      sectionId: "mechanical",
      title: "Power Spectral Density: 200 Hz Resonance (RPM Overlay)",
      layout: "comparison",
      composition: "mediaAnalysis",
      estimatedMinutes: 2,
      blocks: [
        {
          type: "image",
          src: deckImage("btfl001-spectral-200hz-peaks-rpm.png"),
          alt: "Roll and pitch gyro spectral power plots near 200 hertz with motor RPM overlay.",
          caption: "BTFL_001.01 power spectral density with RPM overlay",
          aspectRatio: 1.2967,
        },
        {
          type: "bullets",
          title: "Observations",
          tone: "accent",
          items: [
            {
              id: "rpm-persistent-peak",
              text: "Post-filtered gyro still leaves a small peak at 180 Hz",
            },
            {
              id: "rpm-low-peaks",
              text: "Small peaks remain at and below 100 Hz",
            },
          ],
        },
      ],
      notes: [
        "The RPM overlay separates motor harmonics from the persistent structural signal.",
      ],
    },
    {
      id: "frame-resonance-expectation",
      sectionId: "mechanical",
      title: "200 Hz Resonance Was Expected",
      layout: "comparison",
      composition: "mediaAnalysis",
      estimatedMinutes: 2,
      blocks: [
        {
          type: "image",
          src: deckImage("chris-rosser-aos-ul7-labeled.png"),
          alt: "Chris Rosser reference screenshot discussing frame resonance and mechanical vibration.",
          caption:
            "Chris Rosser YouTube video screenshot: https://www.youtube.com/watch?v=YJYtmcCaSn4&t=11s",
          aspectRatio: 1.7549,
        },
        {
          type: "bullets",
          tone: "accent",
          items: [
            {
              id: "frame-resonance-expected",
              text: "Modal analysis of the UL7 frame shows a 200 Hz resonance",
            },
            {
              id: "frame-resonance-magnitude",
              text: "The 200 Hz resonance in Chris's build is smaller than the motor harmonics",
            },
            {
              id: "frame-resonance-order",
              text: "It should be the first harmonic spike we see in the spectrum",
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
      title: "Suspect: Physical Relative Motion on Frame",
      subtitle:
        "Components on the airframe bending, flexing, and moving at certain frequencies can show up in the log file.",
      layout: "content",
      composition: "twoColumn",
      estimatedMinutes: 1.5,
      blocks: [
        {
          type: "twoColumn",
          columns: [
            {
              title: "Candidate excitation paths",
              items: [
                {
                  id: "battery-mass",
                  text: "Battery motion",
                  detail:
                    "A large fraction of the drone mass moving could cause significant-amplitude vibration.",
                },
                {
                  id: "antenna-flex",
                  text: "Flexible antennas",
                  detail:
                    "Antennas can vibrate at resonant frequencies like a tuning fork.",
                },
                {
                  id: "loose-components",
                  text: "Loose screws and components",
                  detail:
                    "Loose motor or arm screws may induce play that leads to vibration.",
                },
              ],
            },
            {
              title: "Physical checks",
              items: [
                {
                  id: "constraint",
                  text: "1) Torque and bend frame components while checking for movement and flexure",
                },
                {
                  id: "gyro-wires",
                  text: "2) Check for wires touching the gyro",
                },
                { id: "tighten", text: "3) Tighten motor and frame screws" },
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
      title: "Mechanical Fixes",
      layout: "comparison",
      composition: "mediaRight",
      estimatedMinutes: 1.5,
      blocks: [
        {
          type: "image",
          src: deckImage("post-mechanical-spectrum.png"),
          alt: "Post-mechanical-change roll and pitch power spectral density.",
          caption: "Power spectral density after mechanical changes",
          aspectRatio: 1.2,
        },
        {
          type: "bullets",
          title: "Changes made",
          tone: "success",
          items: [
            { id: "second-strap", text: "1) Added a second battery strap" },
            {
              id: "antenna-mount",
              text: "2) Modeled and printed an antenna mount",
            },
            { id: "tightened-screws", text: "3) Tightened all screws" },
          ],
        },
      ],
      notes: [
        "The mechanical changes reduced the dominant structural content before filtering was adjusted.",
      ],
    },
    {
      id: "filtering-checkpoint",
      sectionId: "filtering",
      title: "Checkpoint: Adjusting Filtering",
      subtitle: "Adjusting filtering without adding too much delay.",
      layout: "content",
      composition: "checkpoint",
      estimatedMinutes: 0.5,
      blocks: [
        {
          type: "checkpoint",
          title: "Progress",
          items: [
            { id: "filtering-done-jello", text: "Camera Jello", state: "complete" },
            { id: "filtering-current-motors", text: "Hot Motors", state: "current" },
            { id: "filtering-open-tracking", text: "Poor Tracking", state: "pending" },
          ],
        },
      ],
      notes: [
        "Mechanical credibility makes the remaining filtering decisions interpretable.",
      ],
    },
    {
      id: "filtering-tradeoff",
      sectionId: "filtering",
      title: "Balancing Filtering vs Delay",
      subtitle:
        "Every filter must justify its noise reduction against the delay it adds.",
      layout: "content",
      composition: "twoColumn",
      estimatedMinutes: 1.5,
      blocks: [
        {
          type: "twoColumn",
          columns: [
            {
              title: "Too little filtering",
              items: [
                {
                  id: "d-amplifies",
                  text: "D-term amplifies high-frequency content",
                  detail:
                    "d(error)/dt amplifies high-frequency noise that gets through the filters.",
                },
                {
                  id: "motor-heat",
                  text: "Motors run rougher and hotter",
                  detail:
                    "Motors act as mechanical low-pass filters and cannot produce useful thrust from high-frequency commands; the energy becomes heat.",
                },
              ],
            },
            {
              title: "Too much filtering",
              items: [
                {
                  id: "phase-delay",
                  text: "Phase delay increases",
                  detail:
                    "The controller reacts later to vehicle motion, reducing dynamic response such as propwash performance.",
                },
                {
                  id: "instability",
                  text: "Stability margin decreases",
                  detail: "Higher delay reduces system stability.",
                },
              ],
            },
          ],
        },
        {
          type: "callout",
          label: "Strategy",
          text: "Use the minimum filtering that controls noise without adding unnecessary delay.",
          tone: "accent",
        },
      ],
      notes: [
        "The cleanest spectrum is not automatically the best flying aircraft.",
      ],
    },
    {
      id: "rpm-filter-diagnosis",
      sectionId: "filtering",
      title: "Missing RPM Coverage Pushed Notches Onto Motor Noise",
      subtitle:
        "The filters were working, but they were working in the wrong place.",
      layout: "comparison",
      estimatedMinutes: 2.25,
      blocks: [
        {
          type: "image",
          src: deckImage("rpm-dynamic-notch.png"),
          alt: "PIDToolbox spectrum annotated with dynamic notch and motor harmonic locations.",
          caption:
            "Initial diagnosis: dynamic notches overlapping motor-synchronous harmonics",
          aspectRatio: 2.0758,
        },
        {
          type: "bullets",
          title: "Observed configuration",
          tone: "warning",
          items: [
            {
              id: "rpm-weight",
              text: "RPM weights were 100, 0, 80",
              detail: "The second motor harmonic had no RPM-filter coverage.",
            },
            {
              id: "dn-min",
              text: "Dynamic-notch minimum was 150 Hz",
              detail:
                "Both dynamic notches were pulled toward motor-harmonic content.",
            },
          ],
        },
        {
          type: "bullets",
          title: "Corrective direction",
          tone: "success",
          items: [
            {
              id: "restore-rpm",
              text: "Restore second-harmonic RPM coverage",
              detail:
                "Motor-synchronous noise belongs in the motor-tracking filter.",
            },
            {
              id: "free-dn",
              text: "Free dynamic notches for frame resonances",
              detail:
                "This separates known motor content from non-motor structural content.",
            },
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
      title: "Low-Pass Filtering Cut Only Where the Spectrum Allowed",
      subtitle:
        "Large props and low-KV motors move useful and unwanted content lower than on a typical five-inch quad.",
      layout: "comparison",
      estimatedMinutes: 1.75,
      blocks: [
        {
          type: "image",
          src: deckImage("pidtoolbox-filter-settings.png"),
          alt: "Annotated PIDToolbox filter configuration used during the filtering investigation.",
          caption:
            "Filter configuration reviewed against the measured spectrum",
          aspectRatio: 1.7587,
        },
        {
          type: "bullets",
          title: "Practical decisions",
          tone: "accent",
          items: [
            {
              id: "gyro-lpf",
              text: "Remove redundant gyro LPF1 only after checking the noise floor",
              detail:
                "Preserve bandwidth where another filter already covers the risk.",
            },
            {
              id: "dterm-pt1",
              text: "Use two PT1 D-term filters as a conservative baseline",
              detail:
                "Then move sliders only with post-filter and motor-temperature evidence.",
            },
            {
              id: "low-motor-band",
              text: "Set RPM coverage for the lower motor band",
              detail:
                "Testing settled on an 80 Hz minimum for this large, low-KV setup.",
            },
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
      title: "ESC Settings Shift the Noise/Heat Trade-off",
      subtitle:
        "Commands above useful motor bandwidth can become current ripple and heat instead of thrust.",
      layout: "comparison",
      estimatedMinutes: 1.75,
      blocks: [
        {
          type: "image",
          src: deckImage("fixed-24khz-spectrum.png"),
          alt: "Frequency spectrum from the fixed 24 kilohertz ESC PWM test at master multiplier 1.2.",
          caption:
            "Fixed 24 kHz comparison flight; use comparable conditions when drawing the final conclusion",
          aspectRatio: 1.8519,
        },
        {
          type: "bullets",
          title: "Why PWM belongs in the investigation",
          tone: "accent",
          items: [
            {
              id: "electrical-path",
              text: "ESC switching shapes the electrical command path",
              detail:
                "Variable 24–48 kHz and fixed 24 kHz are actuator configurations, not cosmetic settings.",
            },
            {
              id: "inductance",
              text: "Motor inductance resists rapid current change",
              detail:
                "Torque cannot follow arbitrarily high-frequency controller commands.",
            },
            {
              id: "compare-outcomes",
              text: "Compare spectrum, temperature, and smoothness together",
              detail: "No single plot establishes the best actuator setting.",
            },
          ],
        },
        {
          type: "callout",
          label: "Measurement Pending",
          text: "Motor temperatures and the final fixed/variable PWM comparison remain open.",
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
      title: "Revised Filters Separated Motor Noise From Structural Content",
      subtitle:
        "That made motor behavior safer to evaluate and the next controller tests more meaningful.",
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
            {
              id: "motor-filter-owned",
              text: "RPM filtering owned motor-synchronous harmonics",
              detail:
                "Dynamic notches were available for non-motor resonances.",
            },
            {
              id: "response-ready",
              text: "Remaining response error became a control problem to solve",
              detail:
                "The investigation shifted from frequency domain to time domain.",
            },
          ],
        },
        {
          type: "callout",
          label: "Transition",
          text: "Once the signal path held up, PID tuning became evidence instead of compensation.",
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
      title: "Checkpoint: Tune the Response Once the Signal Is Trusted",
      layout: "content",
      composition: "checkpoint",
      estimatedMinutes: 0.5,
      blocks: [
        {
          type: "checkpoint",
          title: "Progress",
          items: [
            { id: "pid-done-jello", text: "Camera Jello", state: "complete" },
            { id: "pid-done-motors", text: "Hot Motors", state: "complete" },
            { id: "pid-current-tracking", text: "Poor Tracking", state: "current" },
          ],
        },
      ],
      notes: [
        "The tuning section begins only after the earlier layers have been addressed.",
      ],
    },
    {
      id: "pid-test-method",
      sectionId: "pid",
      title: "Repeatable Excitation Replaced Subjective Stick Feel",
      subtitle:
        "Method-B wobble inputs made gain changes comparable across flights.",
      layout: "comparison",
      estimatedMinutes: 1.75,
      blocks: [
        {
          type: "image",
          src: deckImage("method-b-overview.png"),
          alt: "PIDToolbox Method-B overview showing frequency response and roll/pitch step-response results.",
          caption:
            "Consistent wobble-script input exposes both frequency and time-domain behavior",
          aspectRatio: 1.6948,
        },
        {
          type: "bullets",
          title: "Test discipline",
          tone: "accent",
          items: [
            {
              id: "consistent-input",
              text: "Use the same scripted excitation",
              detail:
                "Changes in the trace should come from the tune, not the pilot input.",
            },
            {
              id: "axis-specific",
              text: "Evaluate roll and pitch separately",
              detail:
                "The seven-inch mass distribution does not create identical axis dynamics.",
            },
            {
              id: "two-domains",
              text: "Use spectrum and step response together",
              detail:
                "One reveals noise; the other reveals latency and damping.",
            },
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
      title: "Simplify First, Then Raise Gains",
      subtitle:
        "Reducing interacting variables made each response change interpretable.",
      layout: "timeline",
      estimatedMinutes: 1.5,
      blocks: [
        {
          type: "timeline",
          items: [
            {
              id: "ff-off",
              label: "01",
              title: "Feedforward off",
              description:
                "Remove command-path assistance while measuring feedback behavior.",
            },
            {
              id: "i-low",
              label: "02",
              title: "I-term nearly off",
              description:
                "Reduce slow-state interaction during the initial step tests.",
            },
            {
              id: "dmax-off",
              label: "03",
              title: "D-max off",
              description: "Keep damping behavior tied to the tested D gain.",
            },
            {
              id: "pd-low",
              label: "04",
              title: "Lower P/D balance",
              description: "Start near 0.6–0.8, then increase systematically.",
            },
            {
              id: "sweep",
              label: "05",
              title: "Controlled sweep",
              description:
                "Test master multiplier and axis balance against response shape.",
            },
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
      title: "Choosing P/D Balance From Response Shape",
      subtitle:
        "The target was fast response with low overshoot and low rebound—not the largest gain value.",
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
            {
              id: "overshoot",
              text: "Overshoot indicated insufficient damping",
              detail: "Increase relative D or reduce proportional aggression.",
            },
            {
              id: "slow-rise",
              text: "A slow, rounded response indicated excess damping",
              detail: "Reduce relative D or reconsider overall gain.",
            },
            {
              id: "axis-balance",
              text: "Pitch required its own balance decision",
              detail:
                "Higher pitch inertia made a copied roll value unreliable.",
            },
          ],
        },
        {
          type: "callout",
          label: "Caution",
          text: "Call this low-overshoot, not critically damped — damping ratio wasn't calculated.",
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
      title: "Latency as a Measured Tuning Target",
      subtitle:
        "The final roll/pitch comparison was evaluated in milliseconds, not adjectives.",
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
            {
              id: "rise-delay",
              text: "Setpoint-to-gyro delay",
              detail:
                "How late the aircraft begins and completes the commanded response.",
            },
            {
              id: "alignment",
              text: "Roll/pitch alignment",
              detail: "Whether the two axes produce comparable pilot feel.",
            },
            {
              id: "rebound",
              text: "Overshoot and rebound",
              detail: "Whether the faster response remains controlled.",
            },
          ],
        },
        {
          type: "callout",
          label: "Measurement Pending",
          text: "Confirm the reported ≈12 ms pitch improvement against comparable traces.",
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
      title: "Restoring I-Term and Feedforward After Damping Held",
      subtitle:
        "Feedback stabilized the plant first; feedforward then improved command tracking.",
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
            {
              id: "restore-i",
              text: "Restore I-term for persistent-error rejection",
              detail:
                "Return the controller toward the intended flight configuration.",
            },
            {
              id: "test-ff",
              text: "Compare feedforward settings against setpoint tracking",
              detail: "The archive includes 0.8 and 1.0 test traces.",
            },
            {
              id: "smooth-carefully",
              text: "Add smoothing only when the input demands it",
              detail:
                "Smoothing can improve noise behavior while adding command delay.",
            },
          ],
        },
        {
          type: "callout",
          label: "Final Trace Pending",
          text: "The final setpoint-versus-gyro trace remains to be verified and inserted.",
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
      title: "Closing the Loop on All Three Failures",
      subtitle:
        "Logs explain the mechanism. Footage, temperature, and pilot feel confirm the result.",
      layout: "content",
      composition: "twoColumn",
      estimatedMinutes: 2.25,
      blocks: [
        {
          type: "twoColumn",
          columns: [
            {
              title: "Mechanical + signal",
              items: [
                {
                  id: "initial-jello",
                  text: "Camera jello visible",
                  detail: "Dominant spectral feature near 200 Hz.",
                },
                {
                  id: "initial-motor",
                  text: "Motors warming as ambient temperature rose",
                  detail: "D-term retained visible post-filter noise.",
                },
              ],
            },
            {
              title: "Response + workload",
              items: [
                {
                  id: "initial-response",
                  text: "Response delayed and over-damped",
                  detail: "Bounceback and imperfect setpoint tracking remained.",
                },
                {
                  id: "initial-workload",
                  text: "Higher pilot correction workload",
                  detail: "Aircraft was flyable but not yet a dependable chase platform.",
                },
              ],
            },
          ],
        },
      ],
      notes: [
        "This is the acceptance slide. Do not convert any placeholder to a checkmark without the corresponding evidence.",
      ],
    },
    {
      id: "validation-evidence",
      sectionId: "validation",
      title: "Final Evidence Checklist",
      subtitle: "Close every result with comparable measurements and observable outcomes.",
      layout: "content",
      composition: "twoColumn",
      estimatedMinutes: 1.25,
      blocks: [
        {
          type: "twoColumn",
          columns: [
            {
              title: "Hardware + footage",
              items: [
                { id: "final-jello", text: "Jello before / after", detail: "Same camera mode and comparable flight condition." },
                { id: "final-motor", text: "Motor temperatures", detail: "Record ambient, flight duration, and test configuration." },
              ],
            },
            {
              title: "Control + outcome",
              items: [
                { id: "final-response", text: "Final latency / tracking values", detail: "Confirm exact roll and pitch values from final logs." },
                { id: "final-workload", text: "Pilot and footage outcome", detail: "Document recovery and corrective-input reduction." },
              ],
            },
          ],
        },
        {
          type: "callout",
          label: "Validation status",
          text: "Current: close the mechanical, signal, and control results with final evidence.",
          tone: "warning",
          textSize: "medium",
        },
      ],
      notes: ["Do not convert any item to complete without the corresponding evidence."],
    },
    {
      id: "engineering-takeaways",
      sectionId: "validation",
      title: "Takeaway: Order Mattered More Than the Numbers",
      layout: "content",
      estimatedMinutes: 1.75,
      blocks: [
        {
          type: "timeline",
          items: [
            {
              id: "takeaway-mechanical",
              label: "01",
              title: "Fix real motion",
              description: "Do not hide physical looseness with filtering.",
            },
            {
              id: "takeaway-logs",
              label: "02",
              title: "Separate the signals",
              description:
                "Use logs to distinguish vibration, motor noise, and response error.",
            },
            {
              id: "takeaway-delay",
              label: "03",
              title: "Trade attenuation for delay",
              description:
                "A useful filter removes noise without erasing control bandwidth.",
            },
            {
              id: "takeaway-tune",
              label: "04",
              title: "Tune last",
              description:
                "PID evidence is meaningful only after the plant and signal path are validated.",
            },
            {
              id: "takeaway-validate",
              label: "05",
              title: "Close the loop",
              description:
                "Validate data, motor behavior, footage, and pilot workload.",
            },
          ],
        },
      ],
      notes: [
        "End on the method the audience can reuse, not on a Betaflight screenshot.",
      ],
    },
    {
      id: "qa",
      sectionId: "validation",
      title: "Thank You",
      subtitle:
        "Happy to walk through any logs, settings, or assumptions in detail.",
      layout: "closing",
      estimatedMinutes: 0.25,
      blocks: [
        {
          type: "headline",
          text: "Questions?",
          subtext:
            "Backup material follows for filtering, actuator physics, and PID response.",
        },
      ],
      notes: [
        "Target arrival at approximately 36–39 minutes to preserve discussion time.",
      ],
    },
    {
      id: "appendix-divider",
      sectionId: "validation",
      title: "Technical Appendix",
      subtitle:
        "Supporting calculations, raw evidence, and preserved source slides",
      layout: "title",
      blocks: [
        {
          type: "headline",
          eyebrow: "For technical Q&A",
          text: "Evidence behind the decisions",
          subtext: "These are reference slides — not part of the timed talk.",
        },
      ],
      notes: ["Appendix divider."],
    },
    {
      id: "appendix-raw-filtering",
      sectionId: "validation",
      title: "Raw Evidence: Noise Changed With Throttle",
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
            {
              id: "heatmap-purpose",
              text: "Throttle-correlated bands support a motor/prop source",
              detail:
                "They move with operating condition rather than remaining at one fixed frequency.",
            },
            {
              id: "frame-purpose",
              text: "A persistent band supports a structural candidate",
              detail:
                "This distinction motivates RPM filters and dynamic notches doing different jobs.",
            },
          ],
        },
      ],
      notes: [
        "Raw evidence supporting the motor-synchronous versus structural distinction.",
      ],
    },
    {
      id: "appendix-db-math",
      sectionId: "validation",
      title: "dB Interpretation Depends on the Plotted Quantity",
      layout: "content",
      blocks: [
        {
          type: "twoColumn",
          columns: [
            {
              title: "Amplitude ratio",
              items: [
                {
                  id: "amplitude-equation",
                  text: "dB = 20 log₁₀(A/Aref)",
                  detail: "A 10 dB change is approximately 3.16× in amplitude.",
                },
                {
                  id: "minus-thirty-amplitude",
                  text: "−30 dB ≈ 3.16% amplitude",
                  detail: "Relative to the plot reference.",
                },
              ],
            },
            {
              title: "Power / PSD ratio",
              items: [
                {
                  id: "power-equation",
                  text: "dB = 10 log₁₀(P/Pref)",
                  detail: "A 10 dB change is 10× in power.",
                },
                {
                  id: "minus-thirty-power",
                  text: "−30 dB = 0.1% power",
                  detail: "Only when the plotted quantity is power or PSD.",
                },
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
      notes: [
        "The main deck deliberately avoids an unsupported ten-times magnitude claim.",
      ],
    },
    {
      id: "appendix-lp1-math",
      sectionId: "validation",
      title: "First-Order Low-Pass Trades Attenuation for Phase",
      layout: "content",
      blocks: [
        {
          type: "bullets",
          title: "First-order model",
          tone: "accent",
          items: [
            {
              id: "lp-transfer",
              text: "H(s) = 1 / (1 + s/ωc)",
              detail: "ωc = 2πfc defines the cutoff.",
            },
            {
              id: "lp-three-db",
              text: "At fc: magnitude is −3 dB and phase is −45°",
              detail: "The filter is already delaying content at its cutoff.",
            },
            {
              id: "lp-stack",
              text: "Cascaded filters add attenuation and phase lag",
              detail:
                "Redundant filters can cost response without removing meaningful additional noise.",
            },
          ],
        },
        {
          type: "callout",
          label: "Control implication",
          text: "A filter that removes useful motion makes the measured plant look later than it is.",
          tone: "warning",
        },
      ],
      notes: [
        "Use only if the audience asks for the low-pass delay mechanism.",
      ],
    },
    {
      id: "appendix-notch-q",
      sectionId: "validation",
      title: "Notch Q Controls How Narrowly a Resonance Is Attenuated",
      layout: "content",
      blocks: [
        {
          type: "twoColumn",
          columns: [
            {
              title: "High Q",
              items: [
                {
                  id: "high-q",
                  text: "Narrow notch",
                  detail:
                    "Less collateral attenuation and phase effect, but easier to miss moving noise.",
                },
              ],
            },
            {
              title: "Low Q",
              items: [
                {
                  id: "low-q",
                  text: "Wide notch",
                  detail:
                    "More robust coverage, but more useful bandwidth is disturbed.",
                },
              ],
            },
          ],
        },
        {
          type: "bullets",
          title: "Relationship",
          tone: "accent",
          items: [
            {
              id: "q-equation",
              text: "Q = f₀ / bandwidth",
              detail:
                "Bandwidth is conventionally measured between the −3 dB points.",
            },
            {
              id: "q-purpose",
              text: "RPM tracking reduces the need for a wide fixed notch",
              detail:
                "Center frequency follows motor speed instead of guessing one stationary frequency.",
            },
          ],
        },
      ],
      notes: ["Connect Q back to the observed moving motor harmonics."],
    },
    {
      id: "appendix-motor-physics",
      sectionId: "validation",
      title: "Motor Electrical Dynamics Limit Useful Command Bandwidth",
      layout: "comparison",
      blocks: [
        {
          type: "image",
          src: deckImage("am32-esc-settings.png"),
          alt: "AM32 ESC settings used during actuator configuration review.",
          caption:
            "AM32 actuator configuration reviewed during the investigation",
          aspectRatio: 1.7843,
        },
        {
          type: "bullets",
          title: "Simplified model",
          tone: "accent",
          items: [
            {
              id: "motor-voltage",
              text: "V = Ri + L di/dt + back-EMF",
              detail: "Inductance resists rapid current change.",
            },
            {
              id: "motor-torque",
              text: "Torque ≈ Kt · current",
              detail:
                "If current cannot follow the command, useful torque cannot follow it either.",
            },
            {
              id: "motor-heat-detail",
              text: "High-frequency effort can become ripple and heat",
              detail:
                "This is a qualitative mechanism, not a complete motor model.",
            },
          ],
        },
      ],
      notes: [
        "Avoid claiming all high-frequency command energy becomes heat; the model is intentionally simplified.",
      ],
    },
    {
      id: "appendix-pid-sweep",
      sectionId: "validation",
      title: "P/D Sweep Exposed the Usable Response Range",
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
            {
              id: "kv-match",
              text: "Motor output limits were reviewed for KV matching",
              detail:
                "Controller conclusions depend on comparable actuator authority.",
            },
            {
              id: "sweep-order",
              text: "P/D balance preceded master-multiplier selection",
              detail: "Shape the response before scaling overall authority.",
            },
            {
              id: "ff-order",
              text: "Feedforward comparison came last",
              detail:
                "Command tracking should not mask incorrect feedback damping.",
            },
          ],
        },
      ],
      notes: [
        "Supporting configuration context for detailed tuning questions.",
      ],
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
      title: "Jello in the Camera Footage",
      layout: "content",
      estimatedMinutes: 1,
      blocks: [],
      notes: [
        "Intentionally blank for now. Add the representative camera frame or short video example in a later pass.",
      ],
    },
    {
      id: "solution-path",
      sectionId: "validation",
      title: "Solution Path",
      subtitle:
        "Treat the artifact as a coupled mechanical, control, and camera-sampling problem.",
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
              description:
                "Locate the 200 Hz peak and identify when it appears in flight.",
            },
            {
              id: "trace",
              label: "02",
              title: "Trace",
              description:
                "Separate the source, structural path, controller response, and camera artifact.",
            },
            {
              id: "change",
              label: "03",
              title: "Change",
              description:
                "Modify the highest-leverage mechanical or control parameter.",
            },
            {
              id: "verify",
              label: "04",
              title: "Verify",
              description:
                "Confirm the peak and the visible jello both decrease.",
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
