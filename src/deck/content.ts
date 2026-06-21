import type { DeckInput } from "./schema";

const deckImage = (name: string) => `/screenshots/deck/${name}`;

export const deck = {
  meta: {
    title: "Nothing Works the First Time",
    subtitle: "An algorithmic approach to drone performance",
    presenter: "David Fitzgerald",
    dateLabel: "June 24th",
    durationMinutes: 45,
  },
  sections: [
    { id: "objective", title: "Objective", shortTitle: "Objective" },
    {
      id: "baseline",
      title: "Problems",
      shortTitle: "Problems",
    },
    { id: "mechanical", title: "Mechanical", shortTitle: "Plant" },
    {
      id: "filtering",
      title: "Filtering / ESC",
      shortTitle: "Sensor",
    },
    { id: "pid", title: "PID Tracking", shortTitle: "Controller" },
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
      title: "Nothing Works the First Time",
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
              value: "Reliable & repeatable",
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
      composition: "default",
      estimatedMinutes: 1,
      blocks: [
        {
          type: "bullets",
          title: "Specifications",
          tone: "accent",
          items: [
            { id: "frame", text: "Frame", detail: "AOS UL7" },
            { id: "motors", text: "Motors", detail: "EMAX 2807 1300 KV" },
            { id: "props", text: "Props", detail: "HQProp DP 7×3.5×3 PC" },
            { id: "battery", text: "Battery", detail: "6S1P RS50 Li-ion" },
            { id: "camera", text: "Camera", detail: "DJI Osmo Action 6" },
            { id: "fc", text: "FC", detail: "Hobbywing F7" },
            {
              id: "esc",
              text: "ESC",
              detail: "Hobbywing XRotor Micro 65A, BLHeli32",
            },
            { id: "capacitor", text: "Capacitor", detail: "1×680 µF" },
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
          text: "Diagnose why a fresh build with frame-specific presets fails initial requirements.",
          tone: "accent",
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
        { id: "system", label: "Neros", composition: "diagram" },
        { id: "order", label: "Neros", composition: "diagramCards" },
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
              title: "Mechanical",
              description: "Plant",
            },
            {
              id: "filters",
              label: "02",
              title: "Filtering / ESC",
              description: "Sensor",
            },
            {
              id: "controller",
              label: "03",
              title: "PID / Feedforward",
              description: "Controller",
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
      title: "Mechanical Plant Vibration",
      layout: "content",
      composition: "checkpoint",
      estimatedMinutes: 0.5,
      blocks: [
        {
          type: "checkpoint",
          title: "Progress",
          items: [
            {
              id: "mechanical-current",
              text: "Camera Jello",
              detail: "Plant",
              state: "current",
            },
            {
              id: "mechanical-open-motors",
              text: "Hot Motors",
              detail: "Sensor",
              state: "pending",
            },
            {
              id: "mechanical-open-tracking",
              text: "Poor Tracking",
              detail: "Controller",
              state: "pending",
            },
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
          src: deckImage("rolling-shutter-jello-model.png"),
          alt: "Model relating vibration frequency, scan timing, and the jello waves visible in one frame.",
          aspectRatio: 1.7778,
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
            { id: "jm-assume-fps", text: "FPS = 60" },
            { id: "jm-assume-frame", text: "Frame time = 16.67 ms" },
            { id: "jm-assume-tscan", text: "Tscan = 16 ms" },
            { id: "jm-assume-fvib", text: "fvib = 200 Hz" },
          ],
        },
        {
          type: "bullets",
          title: "Waves per frame",
          tone: "accent",
          items: [
            {
              id: "jm-waves-equation",
              text: "n waves = T scan × f vib = (0.016 s)(200 Hz) = 3.2 waves/frame",
              equation: [
                { text: "n" },
                { text: "waves", script: "sub" },
                { text: " = T" },
                { text: "scan", script: "sub" },
                { text: " × f" },
                { text: "vib", script: "sub" },
                { text: " = (0.016 s)(200 Hz) = 3.2 waves/frame" },
              ],
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
              text: "200 Hz / 60 fps = 3⅓ cycles/frame → ⅓ cycle × 360° = 120°/frame",
              equation: [
                {
                  text: "200 Hz / 60 fps = 3⅓ cycles/frame → ⅓ cycle × 360° = 120°/frame",
                },
              ],
            },
          ],
        },
      ],
      notes: [
        "The camera scans rows at different times, so high-frequency motion becomes spatial distortion instead of ordinary blur.",
        "The frequency math shows why a 200 Hz structural peak lands as a few visible waves per frame.",
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
              text: "Chris' build shows a smaller frame harmonic than motor noise",
            },
            {
              id: "frame-resonance-order",
              text: "200 Hz appears as the first harmonic",
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
                  text: "Torque and bend frame components while checking for movement and flexure",
                },
                {
                  id: "gyro-wires",
                  text: "Check for wires touching the gyro",
                },
                { id: "tighten", text: "Tighten motor and frame screws" },
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
      title: "Adjusting Filtering",
      subtitle: "Reduce noise without adding too much delay.",
      layout: "content",
      composition: "checkpoint",
      estimatedMinutes: 0.5,
      blocks: [
        {
          type: "checkpoint",
          title: "Progress",
          items: [
            {
              id: "filtering-done-jello",
              text: "Camera Jello",
              detail: "Plant",
              state: "complete",
            },
            {
              id: "filtering-current-motors",
              text: "Hot Motors",
              detail: "Sensor",
              state: "current",
            },
            {
              id: "filtering-open-tracking",
              text: "Poor Tracking",
              detail: "Controller",
              state: "pending",
            },
          ],
        },
      ],
      notes: [
        "Mechanical credibility makes the remaining filtering decisions interpretable.",
      ],
    },
    {
      id: "motors-hot",
      sectionId: "filtering",
      title: "Why Do Motors Get Hot?",
      layout: "content",
      composition: "default",
      estimatedMinutes: 1,
      blocks: [
        {
          type: "image",
          src: deckImage("gyro-dterm-pre-filtering.png"),
          alt: "Gyro and D-term traces before filtering, showing amplified high-frequency noise.",
          caption: "Gyro vs. D-term, pre-filtering",
          aspectRatio: 1.8838,
        },
        {
          type: "callout",
          label: "D-term",
          text: "Any noise that isn't filtered gets amplified by the D-term — and shows up as motor heat.",
          tone: "warning",
        },
      ],
      notes: [
        "The D-term differentiates error, so unfiltered high-frequency noise is amplified and ends up as motor heat.",
      ],
    },
    {
      id: "lowpass-filters",
      sectionId: "filtering",
      title: "Low-Pass Filters",
      subtitle: "Attenuate everything above a cutoff frequency.",
      layout: "comparison",
      composition: "mediaAnalysis",
      estimatedMinutes: 1,
      blocks: [
        {
          type: "image",
          src: deckImage("low-pass-filters.png"),
          alt: "Low-pass filter response curve attenuating frequencies above a cutoff.",
          aspectRatio: 1.7211,
        },
        {
          type: "image",
          src: deckImage("low-pass-filters-noise-effect.png"),
          alt: "Effect of a low-pass filter on the measured noise spectrum.",
          aspectRatio: 3.1535,
        },
        {
          type: "bullets",
          title: "Behavior",
          tone: "accent",
          items: [
            {
              id: "lp-cutoff",
              text: "Attenuate everything above a cutoff",
              detail: "Broad noise reduction across the upper spectrum.",
            },
            {
              id: "lp-delay",
              text: "Add phase delay near the cutoff",
              detail: "More attenuation costs more control delay.",
            },
          ],
        },
      ],
      notes: [
        "Low-pass filters reduce broadband noise but always add phase delay near and above the cutoff.",
      ],
    },
    {
      id: "notch-filters",
      sectionId: "filtering",
      title: "Notch Filters",
      subtitle: "Attenuate a narrow band around a target frequency.",
      layout: "comparison",
      composition: "mediaAnalysis",
      estimatedMinutes: 1,
      blocks: [
        {
          type: "image",
          src: deckImage("notch-filters.png"),
          alt: "Notch filter response removing a narrow band around a target frequency.",
          aspectRatio: 1.7347,
        },
        {
          type: "image",
          src: deckImage("notch-filters-noise.png"),
          alt: "Effect of a notch filter on the measured noise spectrum.",
          aspectRatio: 3.0565,
        },
        {
          type: "bullets",
          title: "Behavior",
          tone: "accent",
          items: [
            {
              id: "notch-narrow",
              text: "Target a narrow band",
              detail: "Leaves nearby frequencies and bandwidth intact.",
            },
            {
              id: "notch-tracking",
              text: "RPM and dynamic notches track moving noise",
              detail: "Center frequency follows motor speed instead of guessing.",
            },
          ],
        },
      ],
      notes: [
        "Notches remove a narrow band with less collateral delay, and can track moving motor noise.",
      ],
    },
    {
      id: "filter-knobs",
      sectionId: "filtering",
      title: "Knobs to Turn",
      layout: "content",
      composition: "default",
      estimatedMinutes: 1,
      blocks: [
        {
          type: "image",
          src: deckImage("betaflight-knobs.png"),
          alt: "Overview of the Betaflight filter configuration knobs.",
          caption: "Credit: Oscar Liang",
          aspectRatio: 1.1915,
        },
      ],
      notes: [
        "Reference for the filter controls available in Betaflight.",
      ],
    },
    {
      id: "rpm-filter-diagnosis",
      sectionId: "filtering",
      title: "Dynamic Notch Incorrectly Acting on Motor RPM",
      subtitle: "The dynamic notch was targeting left-over motor noise.",
      layout: "comparison",
      estimatedMinutes: 2,
      blocks: [
        {
          type: "image",
          src: deckImage("rpm-dynamic-notch.png"),
          alt: "PIDToolbox spectrum annotated with dynamic notch and motor harmonic locations.",
          caption: "Dynamic notches overlapping motor-synchronous harmonics",
          aspectRatio: 2.0758,
        },
        {
          type: "bullets",
          title: "Observed configuration",
          tone: "warning",
          items: [
            {
              id: "rpm-weight",
              text: "Incorrect preset configuration",
              detail:
                "RPM weights were 100, 0, 80 — the second motor harmonic had no coverage.",
            },
            {
              id: "dn-min",
              text: "Dynamic-notch minimum set to 150 Hz",
              detail:
                "Dynamic notch 1 was unable to go low enough to properly filter the harmonics.",
            },
          ],
        },
        {
          type: "bullets",
          title: "Correction",
          tone: "success",
          items: [
            {
              id: "rpm-correction",
              text: "RPM weights set to 100, 60, 70",
              detail: "Accounts for the second motor harmonic.",
            },
          ],
        },
      ],
      notes: [
        "FLAG: confirm the final RPM weights. Log progression was 100,0,80 → 100,40,80 (Hillbilly) → 100,60,70 (Cedric).",
      ],
    },
    {
      id: "esc-actuator-bandwidth",
      sectionId: "filtering",
      title: "Effect of ESC Settings on Filtering",
      subtitle:
        "PWM frequency trades filtering cleanliness against drive efficiency.",
      layout: "comparison",
      estimatedMinutes: 1.5,
      blocks: [
        {
          type: "image",
          src: deckImage("esc-filtering-effect.png"),
          alt: "Comparison of ESC PWM settings and their effect on the filtered spectrum.",
          caption: "ESC PWM setting vs. filtered spectrum",
          aspectRatio: 1.3029,
        },
        {
          type: "bullets",
          title: "24 kHz fixed",
          tone: "accent",
          items: [
            {
              id: "fixed-clean",
              text: "Slightly cleaner filtering",
              detail: "The fixed-24 kHz plot shows marginally lower high-frequency content.",
            },
            {
              id: "fixed-tradeoff",
              text: "Efficiency tradeoff",
              detail: "A fixed low switching frequency costs some drive efficiency.",
            },
          ],
        },
        {
          type: "bullets",
          title: "24–48 kHz variable",
          tone: "success",
          items: [
            {
              id: "var-efficiency",
              text: "Higher efficiency",
              detail:
                "Switching frequency scales with RPM, cutting switching losses where they matter.",
            },
            {
              id: "var-noise",
              text: "Slightly more high-frequency content",
              detail: "A small filtering cost in exchange for the efficiency gain.",
            },
          ],
        },
      ],
      notes: [
        "FLAG: confirm which PWM mode was kept. Fixed 24 kHz was the cleaner-filtering comparison flight.",
      ],
    },
    {
      id: "filter-changes-made",
      sectionId: "filtering",
      title: "Changes Made",
      subtitle: "Filter setting adjustments.",
      layout: "comparison",
      composition: "mediaRight",
      estimatedMinutes: 1.5,
      blocks: [
        {
          type: "image",
          src: deckImage("final-filter-settings-sketch.png"),
          alt: "Annotated sketch of the final filter settings.",
          caption: "Annotated final filter settings",
          aspectRatio: 2.4853,
        },
        {
          type: "bullets",
          title: "What changed",
          tone: "success",
          items: [
            {
              id: "lp1-off",
              text: "LPF1 off, LPF2 kept on",
              detail: "LPF2 handles aliasing and sits below the noise floor; sliders adjusted.",
            },
            {
              id: "rpm-lower",
              text: "RPM filters allowed to go lower",
              detail: "Ramp-up rate decreased so coverage reaches the lower motor band.",
            },
            {
              id: "dn-lower",
              text: "Dynamic notch lowered",
              detail: "Freed to catch frame resonances instead of motor harmonics.",
            },
            {
              id: "rpm-weights-down",
              text: "RPM weights decreased",
              detail: "Trimmed once motor-synchronous coverage was correct.",
            },
          ],
        },
      ],
      notes: [
        "FLAG: confirm exact slider values and the final RPM ramp-up / weight numbers from the logs.",
      ],
    },
    {
      id: "post-filter-changes",
      sectionId: "filtering",
      title: "Post Filter Changes",
      layout: "comparison",
      composition: "mediaRight",
      estimatedMinutes: 1,
      blocks: [
        {
          type: "image",
          src: deckImage("post-filter-changes.png"),
          alt: "Post-change spectrum after revising RPM and dynamic-notch filtering.",
          caption: "Spectrum after the filter changes",
          aspectRatio: 1.6797,
        },
        {
          type: "bullets",
          title: "Result",
          tone: "success",
          items: [
            {
              id: "motor-owned",
              text: "RPM filtering owns the motor harmonics",
              detail: "Dynamic notches are free for frame resonances.",
            },
            {
              id: "cleaner-dterm",
              text: "Cleaner post-filter D-term",
              detail: "Less unfiltered noise for the D-term to amplify into heat.",
            },
          ],
        },
      ],
      notes: [
        "Once the signal path held up, PID tuning became evidence instead of compensation.",
      ],
    },
    {
      id: "pid-checkpoint",
      sectionId: "pid",
      title: "Checkpoint: Controller Tuning",
      layout: "content",
      composition: "checkpoint",
      estimatedMinutes: 0.5,
      blocks: [
        {
          type: "checkpoint",
          title: "Progress",
          items: [
            {
              id: "pid-done-jello",
              text: "Camera Jello",
              detail: "Plant",
              state: "complete",
            },
            {
              id: "pid-done-motors",
              text: "Hot Motors",
              detail: "Sensor",
              state: "complete",
            },
            {
              id: "pid-current-tracking",
              text: "Poor Tracking",
              detail: "Controller",
              state: "current",
            },
          ],
        },
      ],
      notes: [
        "The tuning section begins only after the earlier layers have been addressed.",
      ],
    },
    {
      id: "pid-tuning-method",
      sectionId: "pid",
      title: "Tuning Method",
      subtitle: "A repeatable order so each change stays interpretable.",
      layout: "comparison",
      estimatedMinutes: 1.5,
      blocks: [
        {
          type: "image",
          src: deckImage("pid-tuning-method.png"),
          alt: "PIDToolbox tuning-method overview.",
          aspectRatio: 1.835,
        },
        {
          type: "timeline",
          items: [
            {
              id: "step-pd",
              label: "1",
              title: "P to D ratio",
              description: "Step D 1.0 → 1.2 → 1.4 and read the response shape.",
            },
            {
              id: "step-balance",
              label: "2",
              title: "Pitch to roll balance",
              description: "Match pitch latency to roll.",
            },
            {
              id: "step-mm",
              label: "3",
              title: "Master multiplier",
              description: "Scale overall authority once the shape is right.",
            },
            {
              id: "step-ff",
              label: "4",
              title: "Feedforward",
              description: "Improve command tracking last.",
            },
          ],
        },
      ],
      notes: [
        "The order isolates variables: shape the response first, then scale authority, then add feedforward.",
      ],
    },
    {
      id: "wobble-tuning",
      sectionId: "pid",
      title: "Wobble Tuning",
      subtitle: "A consistent sinusoidal setpoint input for repeatable data.",
      layout: "comparison",
      estimatedMinutes: 1.5,
      blocks: [
        {
          type: "image",
          src: deckImage("wobble-test.png"),
          alt: "Wobble-test setpoint and gyro traces used to build step-response data.",
          aspectRatio: 0.9564,
        },
        {
          type: "bullets",
          title: "Method",
          tone: "accent",
          items: [
            {
              id: "wobble-freq",
              text: "2.6 Hz sinusoidal setpoint input",
              detail: "A custom radio script applies the same excitation each flight.",
            },
            {
              id: "wobble-noise",
              text: "Low motor noise post-filtering",
              detail: "A clean signal makes the response easy to read.",
            },
            {
              id: "wobble-n",
              text: "Builds N values for the step response",
              detail: "Cycles are averaged into the step-response plot used for tuning.",
            },
          ],
        },
      ],
      notes: [
        "Repeatable excitation replaced subjective stick feel, so gain changes are comparable across flights.",
      ],
    },
    {
      id: "pitch-tuning-balance",
      sectionId: "pid",
      title: "Pitch Tuning — P/D Balance",
      subtitle: "Pitch gets its own balance — higher inertia needs higher gains.",
      layout: "content",
      composition: "default",
      estimatedMinutes: 1,
      blocks: [
        {
          type: "image",
          src: deckImage("pitch-pt-pd-balance.png"),
          alt: "Pitch P/D balance step-response comparison.",
          aspectRatio: 2.3255,
        },
        {
          type: "bullets",
          title: "Goal",
          tone: "accent",
          items: [
            {
              id: "balance-latency",
              text: "Match pitch latency to roll",
              detail: "Comparable response feel across both axes.",
            },
            {
              id: "balance-inertia",
              text: "Higher moment of inertia on pitch",
              detail: "Pitch needs higher gains to keep up with roll.",
            },
          ],
        },
      ],
      notes: [
        "Match pitch latency to roll; higher pitch inertia needs higher gains.",
      ],
    },
    {
      id: "pitch-tuning-gain",
      sectionId: "pid",
      title: "Pitch Tuning — P/D Gain",
      subtitle: "Pitch gets its own balance — higher inertia needs higher gains.",
      layout: "content",
      composition: "default",
      estimatedMinutes: 1,
      blocks: [
        {
          type: "image",
          src: deckImage("pitch-pd-coef.png"),
          alt: "Pitch P/D gain coefficient comparison.",
          aspectRatio: 2.5008,
        },
        {
          type: "bullets",
          title: "Goal",
          tone: "accent",
          items: [
            {
              id: "gain-latency",
              text: "Match pitch latency to roll",
              detail: "Comparable response feel across both axes.",
            },
            {
              id: "gain-inertia",
              text: "Higher moment of inertia on pitch",
              detail: "Pitch needs higher gains to keep up with roll.",
            },
          ],
        },
      ],
      notes: [
        "A copied roll value is unreliable on pitch because the seven-inch mass distribution differs between axes.",
      ],
    },
    {
      id: "master-multiplier-tuning",
      sectionId: "pid",
      title: "Master Multiplier",
      subtitle: "Scale overall gain once the response shape is set.",
      layout: "comparison",
      estimatedMinutes: 1.25,
      blocks: [
        {
          type: "image",
          src: deckImage("master-multiplier-test.png"),
          alt: "Master-multiplier step-test comparison.",
          caption: "Master-multiplier step test",
          aspectRatio: 2.4637,
        },
        {
          type: "bullets",
          title: "Effect",
          tone: "accent",
          items: [
            {
              id: "mm-damping",
              text: "Raising MM slightly increases damping",
              detail: "More authority brings more damping with it.",
            },
            {
              id: "mm-nonlinear",
              text: "The damping ratio changes non-linearly",
              detail: "It is not directly proportional to the multiplier.",
            },
          ],
        },
      ],
      notes: [
        "Possible appendix slide: the math relating damping ratio to master multiplier (not directly proportional).",
      ],
    },
    {
      id: "feedforward-tuning",
      sectionId: "pid",
      title: "Feedforward Tuning",
      subtitle: "Compare delay and overshoot across feedforward settings.",
      layout: "comparison",
      estimatedMinutes: 1.5,
      blocks: [
        {
          type: "image",
          title: "FF 0.6",
          src: deckImage("ff-0p6-latency.png"),
          alt: "Step response at feedforward 0.6.",
          aspectRatio: 3.3021,
        },
        {
          type: "image",
          title: "FF 0.8",
          src: deckImage("ff-0p8-latency.png"),
          alt: "Step response at feedforward 0.8.",
          aspectRatio: 3.5939,
        },
        {
          type: "image",
          title: "FF 1.0",
          src: deckImage("ff-1p0-latency.png"),
          alt: "Step response at feedforward 1.0.",
          aspectRatio: 3.4053,
        },
        {
          type: "bullets",
          title: "Read",
          tone: "accent",
          items: [
            {
              id: "ff-08",
              text: "0.8 has lower delay than 0.6",
              detail: "Best latency of the three.",
            },
            {
              id: "ff-10",
              text: "1.0 shows overshoot",
              detail: "Possibly slightly over-tuned.",
            },
          ],
        },
      ],
      notes: [
        "FLAG: confirm the final feedforward value. Tests favored 0.8 for latency.",
      ],
    },
    {
      id: "final-tune",
      sectionId: "pid",
      title: "Final Tune",
      layout: "comparison",
      estimatedMinutes: 1.5,
      blocks: [
        {
          type: "image",
          src: deckImage("final-tune-setpoint.png"),
          alt: "Final setpoint versus gyro trace after tuning.",
          caption: "Final setpoint vs. gyro",
          aspectRatio: 1.5494,
        },
        {
          type: "bullets",
          title: "Result",
          tone: "success",
          items: [
            {
              id: "ft-gyro",
              text: "Black gyro nearly invisible behind the red setpoint",
              detail: "The gyro tracks the commanded setpoint closely.",
            },
            {
              id: "ft-motors",
              text: "Motors are much less noisy",
              detail: "Cleaning the signal path before tuning paid off.",
            },
          ],
        },
      ],
      notes: [
        "I-term and feedforward were restored after damping held; this is the final setpoint-vs-gyro trace.",
      ],
    },
    {
      id: "final-validation",
      sectionId: "validation",
      title: "Closing the Loop",
      layout: "content",
      composition: "checkpoint",
      estimatedMinutes: 1.5,
      blocks: [
        {
          type: "checkpoint",
          title: "Progress",
          items: [
            {
              id: "final-jello",
              text: "Camera Jello",
              detail: "Plant",
              state: "complete",
            },
            {
              id: "final-motors",
              text: "Hot Motors",
              detail: "Sensor",
              state: "complete",
            },
            {
              id: "final-tracking",
              text: "Poor Tracking",
              detail: "Controller",
              state: "complete",
            },
          ],
        },
      ],
      notes: [
        "All three coupled failures are resolved: mechanical plant, signal path, and controller.",
      ],
    },
    {
      id: "qa",
      sectionId: "validation",
      title: "Thank You",
      layout: "closing",
      estimatedMinutes: 0.25,
      blocks: [
        {
          type: "headline",
          text: "Thank you!",
        },
        {
          type: "headline",
          text: "Questions?",
          subtext:
            "Appendix with additional calculations and data available.",
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
      subtitle: "Supporting calculations, raw evidence, and source slides",
      layout: "title",
      blocks: [
        {
          type: "headline",
          eyebrow: "For technical Q&A",
          text: "Evidence behind the decisions",
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
      id: "appendix-initial-setpoint",
      sectionId: "validation",
      title: "Initial Setpoint Tune",
      layout: "comparison",
      blocks: [
        {
          type: "image",
          src: deckImage("initial-setpoint-tune.png"),
          alt: "Initial setpoint-versus-gyro trace before tuning, showing motor noise.",
          caption: "Initial setpoint vs. gyro — note the motor noise",
          aspectRatio: 1.5717,
        },
        {
          type: "bullets",
          title: "Before tuning",
          tone: "warning",
          items: [
            {
              id: "initial-noise",
              text: "Visible motor noise on the gyro trace",
              detail: "Baseline for comparison against the final tune.",
            },
            {
              id: "initial-tracking",
              text: "Looser setpoint tracking",
              detail: "Response error before P/D, master-multiplier, and feedforward work.",
            },
          ],
        },
      ],
      notes: [
        "Baseline reference: the initial setpoint trace shows the motor noise that later changes removed.",
      ],
    },
    {
      id: "camera-jello",
      sectionId: "validation",
      title: "Jello in the Camera Footage",
      layout: "content",
      composition: "default",
      estimatedMinutes: 1,
      blocks: [
        {
          type: "image",
          src: deckImage("jello-footage-demo.jpg"),
          alt: "Representative action-camera frame showing jello distortion in the footage.",
          caption: "Action-camera footage with visible jello",
          aspectRatio: 2.0387,
        },
      ],
      notes: [
        "Representative still from the affected footage; replace with a short clip if available.",
      ],
    },
  ],
} satisfies DeckInput;
