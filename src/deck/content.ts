import type { DeckInput } from "./schema";

export const deck = {
  meta: {
    title: "Neros Technical Interview",
    subtitle: "45-minute technical presentation",
    presenter: "Dash",
    dateLabel: "Next week",
    durationMinutes: 45,
  },
  sections: [
    { id: "context", title: "Context and Goals", shortTitle: "Context" },
    { id: "architecture", title: "Architecture and Design", shortTitle: "Architecture" },
    { id: "deep-dive", title: "Technical Deep Dive", shortTitle: "Deep Dive" },
    { id: "execution", title: "Execution and Reliability", shortTitle: "Execution" },
    { id: "discussion", title: "Tradeoffs and Discussion", shortTitle: "Discussion" },
  ],
  slides: [
    {
      id: "title",
      sectionId: "context",
      title: "Neros Technical Interview",
      subtitle: "A precise walkthrough of problem framing, architecture, tradeoffs, and execution.",
      layout: "title",
      estimatedMinutes: 2,
      blocks: [
        {
          type: "headline",
          eyebrow: "45 minutes",
          text: "A technical story built for clarity under interview pressure",
          subtext:
            "The deck is generated from typed data so structure, timing, notes, and progress tracking stay synchronized.",
        },
        {
          type: "metricRow",
          metrics: [
            { id: "topics", value: "5", label: "Topics" },
            { id: "duration", value: "45", label: "Minutes", tone: "accent" },
            { id: "artifact", value: "PPTX", label: "Submission format", tone: "warning" },
          ],
        },
      ],
      notes: [
        "Open with the purpose of the talk and the structure.",
        "Emphasize that the presentation is meant to be technical, concise, and interactive.",
      ],
    },
    {
      id: "agenda",
      sectionId: "context",
      title: "Talk Map",
      subtitle: "The header tracks exactly where we are as the conversation moves.",
      layout: "timeline",
      estimatedMinutes: 3,
      steps: [
        { id: "context-step", label: "Context" },
        { id: "architecture-step", label: "Architecture" },
        { id: "deep-dive-step", label: "Deep dive" },
        { id: "execution-step", label: "Execution" },
        { id: "discussion-step", label: "Discussion" },
      ],
      blocks: [
        {
          type: "timeline",
          items: [
            {
              id: "context-item",
              label: "01",
              title: "Context",
              description: "Frame the objective, constraints, and evaluation target.",
              showAt: "context-step",
            },
            {
              id: "architecture-item",
              label: "02",
              title: "Architecture",
              description: "Explain the system shape and the most important interfaces.",
              showAt: "architecture-step",
            },
            {
              id: "deep-dive-item",
              label: "03",
              title: "Deep Dive",
              description: "Go one layer lower on the hardest technical decisions.",
              showAt: "deep-dive-step",
            },
            {
              id: "execution-item",
              label: "04",
              title: "Execution",
              description: "Cover testing, delivery, and operational reliability.",
              showAt: "execution-step",
            },
            {
              id: "discussion-item",
              label: "05",
              title: "Discussion",
              description: "Make tradeoffs explicit and invite targeted questions.",
              showAt: "discussion-step",
            },
          ],
        },
      ],
      notes: ["Use this slide to set expectations and create a clean mental map for the interviewers."],
    },
    {
      id: "success-criteria",
      sectionId: "context",
      title: "What This Talk Should Prove",
      subtitle: "The goal is not just to show a project; it is to show engineering judgment.",
      layout: "content",
      estimatedMinutes: 4,
      steps: [
        { id: "judgment", label: "Judgment" },
        { id: "implementation", label: "Implementation" },
        { id: "communication", label: "Communication" },
      ],
      blocks: [
        {
          type: "bullets",
          tone: "accent",
          items: [
            {
              id: "judgment-point",
              text: "I can turn an ambiguous technical goal into a clear system boundary.",
              detail: "That includes naming constraints, risks, and success criteria before building.",
              showAt: "judgment",
            },
            {
              id: "implementation-point",
              text: "I can choose boring, durable tools where reliability matters.",
              detail: "The implementation should be easy to inspect, modify, test, and submit.",
              showAt: "implementation",
            },
            {
              id: "communication-point",
              text: "I can make complex work legible to collaborators.",
              detail: "Progress, tradeoffs, and failure modes are visible instead of hidden in code.",
              showAt: "communication",
            },
          ],
        },
      ],
      notes: ["This slide should connect the presentation style to the qualities Neros is likely evaluating."],
    },
    {
      id: "system-boundary",
      sectionId: "architecture",
      title: "System Boundary",
      subtitle: "Separate authoring, rendering, and export so each part stays understandable.",
      layout: "comparison",
      estimatedMinutes: 4,
      steps: [
        { id: "authoring", label: "Authoring" },
        { id: "rendering", label: "Rendering" },
        { id: "export", label: "Export" },
      ],
      blocks: [
        {
          type: "twoColumn",
          columns: [
            {
              title: "Human and agent inputs",
              items: [
                {
                  id: "typed-deck",
                  text: "Typed deck data",
                  detail: "Sections, slides, notes, and build steps live in one data model.",
                  showAt: "authoring",
                },
                {
                  id: "theme-tokens",
                  text: "Theme tokens",
                  detail: "Colors, fonts, and spacing are centralized.",
                  showAt: "authoring",
                },
                {
                  id: "validation",
                  text: "Validation",
                  detail: "Broken references fail before preview or export.",
                  showAt: "rendering",
                },
              ],
            },
            {
              title: "Generated outputs",
              items: [
                {
                  id: "browser-preview",
                  text: "Browser preview",
                  detail: "Live viewing, keyboard navigation, and presenter notes.",
                  showAt: "rendering",
                },
                {
                  id: "pptx-output",
                  text: "PPTX file",
                  detail: "Submit-ready deck with progress header and speaker notes.",
                  showAt: "export",
                },
                {
                  id: "future-pdf",
                  text: "Optional PDF path",
                  detail: "Kept separate from the core so local Office tooling is not required.",
                  showAt: "export",
                },
              ],
            },
          ],
        },
      ],
      notes: ["The important design move is keeping content declarative and rendering deterministic."],
    },
    {
      id: "core-design",
      sectionId: "architecture",
      title: "Core Design Choice",
      subtitle: "Robust builds beat fragile native animation automation.",
      layout: "content",
      estimatedMinutes: 4,
      blocks: [
        {
          type: "callout",
          label: "Default animation model",
          text:
            "Every reveal is represented as another rendered slide. It behaves like animation in the room, but exports as ordinary PowerPoint slides.",
          tone: "accent",
        },
        {
          type: "bullets",
          title: "Why this is the right default",
          tone: "success",
          items: [
            {
              id: "compatibility",
              text: "Compatible with PowerPoint, Keynote, Google Slides import, and PDF export workflows.",
            },
            {
              id: "reviewability",
              text: "Agents can inspect and modify build steps without editing opaque OOXML animation internals.",
            },
            {
              id: "recoverability",
              text: "If a viewer strips animations, the story still works because each state is a complete slide.",
            },
          ],
        },
      ],
      notes: [
        "This is the tradeoff to defend if someone asks why not native PowerPoint animations.",
        "Native animation support can be added later through a template, but should not be the foundation.",
      ],
    },
    {
      id: "data-flow",
      sectionId: "architecture",
      title: "Data Flow",
      subtitle: "One source of truth generates both visual experiences.",
      layout: "timeline",
      estimatedMinutes: 3,
      blocks: [
        {
          type: "timeline",
          items: [
            {
              id: "deck-data",
              label: "01",
              title: "Deck data",
              description: "Sections, slides, blocks, steps, timing, and notes.",
            },
            {
              id: "schema",
              label: "02",
              title: "Schema validation",
              description: "Catch missing sections, invalid step references, and malformed blocks.",
            },
            {
              id: "expansion",
              label: "03",
              title: "Step expansion",
              description: "Turn authored slides into the final rendered slide sequence.",
            },
            {
              id: "outputs",
              label: "04",
              title: "Preview and PPTX",
              description: "Render the same sequence in browser and PowerPoint.",
            },
          ],
        },
      ],
      notes: ["This is the simplest way to explain why the deck remains agent-editable."],
    },
    {
      id: "deep-dive-validation",
      sectionId: "deep-dive",
      title: "Deep Dive: Validation",
      subtitle: "The project should fail early when content and structure drift.",
      layout: "content",
      estimatedMinutes: 5,
      steps: [
        { id: "schema-step", label: "Schema" },
        { id: "integrity-step", label: "Integrity" },
        { id: "export-step", label: "Export safety" },
      ],
      blocks: [
        {
          type: "bullets",
          tone: "accent",
          items: [
            {
              id: "schema-validation",
              text: "Zod validates the shape of deck content.",
              detail: "Block types, required fields, section limits, and layout names are checked.",
              showAt: "schema-step",
            },
            {
              id: "integrity-validation",
              text: "Custom integrity checks validate relationships.",
              detail: "Slide section ids and build-step references must resolve.",
              showAt: "integrity-step",
            },
            {
              id: "export-validation",
              text: "Export runs validation before writing the PPTX.",
              detail: "The generated artifact is never produced from a known-bad deck.",
              showAt: "export-step",
            },
          ],
        },
      ],
      notes: [
        "This slide is a good place to talk about avoiding silent failure.",
        "Mention that the same validation path runs before preview/export/test.",
      ],
    },
    {
      id: "deep-dive-progress",
      sectionId: "deep-dive",
      title: "Deep Dive: Progress Header",
      subtitle: "A small component carries a lot of audience orientation.",
      layout: "comparison",
      estimatedMinutes: 4,
      blocks: [
        {
          type: "twoColumn",
          columns: [
            {
              title: "Inputs",
              items: [
                {
                  id: "section-order",
                  text: "Ordered section list",
                  detail: "Five topics maximum keeps the header legible.",
                },
                {
                  id: "slide-section",
                  text: "Current slide section id",
                  detail: "Each rendered slide knows its active section.",
                },
              ],
            },
            {
              title: "Behavior",
              items: [
                {
                  id: "active-topic",
                  text: "Highlight the active topic",
                  detail: "The same logic is used in React and PPTX export.",
                },
                {
                  id: "past-future",
                  text: "De-emphasize completed and upcoming topics",
                  detail: "Audience members can rejoin the talk quickly after questions.",
                },
              ],
            },
          ],
        },
      ],
      notes: ["Tie this back to the user's original requirement: progress over many slides."],
    },
    {
      id: "screenshot-example",
      sectionId: "deep-dive",
      title: "Spectral Analyzer Example",
      subtitle: "A concrete screen gives the technical deep dive something specific to anchor on.",
      layout: "content",
      estimatedMinutes: 3,
      blocks: [
        {
          type: "image",
          src: "/screenshots/demo-screenshot.png",
          alt: "Spectral analyzer screenshot showing the master multiplier change.",
          title: "Master Multiplier Change",
          caption: "Spectral analyzer: master multiplier change example.",
          aspectRatio: 2.4824,
        },
      ],
      notes: [
        "Use this slide as a concrete technical artifact. Replace the title, subtitle, caption, and notes once the final story is locked.",
      ],
    },
    {
      id: "failure-modes",
      sectionId: "deep-dive",
      title: "Failure Modes and Guardrails",
      subtitle: "The repo should make bad states obvious.",
      layout: "content",
      estimatedMinutes: 4,
      blocks: [
        {
          type: "bullets",
          tone: "danger",
          items: [
            {
              id: "unknown-reference",
              text: "Unknown section or build step",
              detail: "Validation fails with a concrete slide id and reference.",
            },
            {
              id: "tooling-drift",
              text: "Local tool mismatch",
              detail: "Dependencies avoid Node requirements beyond the installed runtime.",
            },
            {
              id: "visual-drift",
              text: "Preview/export divergence",
              detail: "Both outputs use the same expanded slide sequence and theme tokens.",
            },
            {
              id: "manual-last-mile",
              text: "PPTX review still matters",
              detail: "Automated export creates the file; final human review happens in PowerPoint.",
            },
          ],
        },
      ],
      notes: ["This is where the deck can show mature engineering taste: name the things that can go wrong."],
    },
    {
      id: "testing-strategy",
      sectionId: "execution",
      title: "Testing Strategy",
      subtitle: "Test the durable contracts, not incidental CSS details.",
      layout: "content",
      estimatedMinutes: 4,
      blocks: [
        {
          type: "metricRow",
          metrics: [
            { id: "schema-tests", value: "1", label: "Schema test suite", tone: "accent" },
            { id: "expand-tests", value: "1", label: "Expansion test suite", tone: "success" },
            { id: "smoke-export", value: "1", label: "PPTX smoke path", tone: "warning" },
          ],
        },
        {
          type: "bullets",
          items: [
            {
              id: "validate",
              text: "Validate every authored deck before build and export.",
            },
            {
              id: "count",
              text: "Assert expanded slide counts and sequence numbers.",
            },
            {
              id: "manual-review",
              text: "Open generated PPTX for final visual review before submission.",
            },
          ],
        },
      ],
      notes: ["Do not overclaim automation. PPTX visual review is still a real acceptance step."],
    },
    {
      id: "iteration-loop",
      sectionId: "execution",
      title: "Iteration Loop",
      subtitle: "The fastest path from idea to submission artifact is short and repeatable.",
      layout: "timeline",
      estimatedMinutes: 3,
      blocks: [
        {
          type: "timeline",
          items: [
            {
              id: "edit",
              label: "Edit",
              title: "Update deck data",
              description: "Add content, steps, speaker notes, or sections.",
            },
            {
              id: "preview",
              label: "Preview",
              title: "Run the browser view",
              description: "Navigate the full rendered sequence and tune pacing.",
            },
            {
              id: "validate",
              label: "Validate",
              title: "Run schema and integrity checks",
              description: "Catch broken references before export.",
            },
            {
              id: "export",
              label: "Export",
              title: "Generate PPTX",
              description: "Submit the generated file after final review.",
            },
          ],
        },
      ],
      notes: ["This slide describes how you will use the repo during prep week."],
    },
    {
      id: "tradeoffs",
      sectionId: "discussion",
      title: "Tradeoffs",
      subtitle: "The implementation is intentionally conservative.",
      layout: "comparison",
      estimatedMinutes: 4,
      blocks: [
        {
          type: "twoColumn",
          columns: [
            {
              title: "Chosen",
              items: [
                {
                  id: "pptxgenjs",
                  text: "PptxGenJS for export",
                  detail: "Mainstream, MIT-licensed, and focused on generating PowerPoint files.",
                },
                {
                  id: "step-slides",
                  text: "Step slides for builds",
                  detail: "Predictable across viewers and export/import paths.",
                },
              ],
            },
            {
              title: "Deferred",
              items: [
                {
                  id: "native-animation",
                  text: "Native animation XML",
                  detail: "Powerful, but not a stable foundation for agent edits.",
                },
                {
                  id: "pdf-automation",
                  text: "Automated PDF conversion",
                  detail: "Depends on local PowerPoint or LibreOffice availability.",
                },
              ],
            },
          ],
        },
      ],
      notes: ["This is a good slide for showing you can reason about engineering constraints."],
    },
    {
      id: "closing",
      sectionId: "discussion",
      title: "Discussion",
      subtitle: "The deck is built to make the technical conversation easier to steer.",
      layout: "closing",
      estimatedMinutes: 4,
      blocks: [
        {
          type: "headline",
          text: "Clear structure, reliable output, and room for technical depth",
          subtext:
            "From here, the content can be specialized around the exact project, role expectations, and Neros interview prompt.",
        },
        {
          type: "quote",
          quote: "The best presentation tooling disappears once the conversation starts.",
          attribution: "Working principle for this repo",
        },
      ],
      notes: [
        "End by inviting questions on architecture, reliability, testing, or tradeoffs.",
        "If there is extra time, open the browser preview or generated PPTX and show the workflow.",
      ],
    },
  ],
} satisfies DeckInput;
