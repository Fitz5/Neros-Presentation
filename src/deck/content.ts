import type { DeckInput } from "./schema";

const deckImage = (name: string) => `/screenshots/deck/${name}`;

export const deck = {
  meta: {
    title: "Diagnosing Jello in an Action-Camera Drone",
    subtitle: "Working deck",
    presenter: "Dash",
    dateLabel: "Draft",
    durationMinutes: 45,
  },
  sections: [
    { id: "context", title: "Objective", shortTitle: "Objective" },
    { id: "architecture", title: "Problem", shortTitle: "Problem" },
    { id: "discussion", title: "Solution", shortTitle: "Solution" },
  ],
  slides: [
    {
      id: "objective",
      sectionId: "context",
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
      id: "camera-jello",
      sectionId: "architecture",
      title: "Jello in the camera footage",
      layout: "content",
      estimatedMinutes: 1,
      blocks: [],
      notes: [
        "Intentionally blank for now. Add the representative camera frame or short video example in a later pass.",
      ],
    },
    {
      id: "spectral-evidence",
      sectionId: "architecture",
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
          title: "200 Hz peak",
          tone: "accent",
          items: [
            {
              id: "spectral-peak",
              text: "Roll reaches high amplitude 0 dB at the 200 Hz resonance. ",
            },
          ],
        },
        {
          type: "bullets",
          title: "Roll and Pitch share similar resonance",
          tone: "warning",
          items: [
            {
              id: "spectral-shared",
              text: "The same 200 Hz mode appears in both roll and pitch.",
              detail: "The pitch trace shares the resonance, but not the same peak height.",
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
      id: "rolling-shutter-jello",
      sectionId: "architecture",
      title: "Why a 200 Hz vibration becomes visible jello",
      subtitle:
        "Assume 4K/60: Tframe = 16.67 ms · Tscan ≈ 16 ms · exposure = 1 ms · measured peak fvib = 200 Hz at 0 dB.",
      layout: "comparison",
      estimatedMinutes: 4,
      blocks: [
        {
          type: "image",
          src: deckImage("rolling-shutter-jello-model.png"),
          alt: "Hand-drawn diagrams showing a vibration wave during rolling-shutter scan and its sampled alias.",
          labels: ["Waves per frame", "Aliasing"],
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
              text: "n_waves = Tscan × fvib",
              detail: "(0.016 s)(200 Hz) = 3.2 waves / frame",
            },
          ],
        },
        {
          type: "bullets",
          title: "2 · Temporal alias",
          tone: "warning",
          items: [
            {
              id: "alias-equation",
              text: "falias = |fvib − N × ffps|,  N = round(200 / 60) = 3",
              detail: "|200 − 3(60)| = 20 Hz",
            },
          ],
        },
        {
          type: "callout",
          label: "Result",
          text: "The 200 Hz mechanical mode can appear as 3.2 rolling-shutter waves evolving at a 20 Hz alias.",
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
      sectionId: "discussion",
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
