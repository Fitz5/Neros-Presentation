# Neros Presentation

A dynamic, agent-editable presentation system for a 45 minute technical interview.

## Commands

- `npm run dev` - live browser preview
- `npm run validate` - validate deck data and generated slide sequence
- `npm run import:screenshot -- <source-path>` - copy a screenshot into `public/screenshots/demo-screenshot.png`
- `npm run export:pptx` - generate `dist/neros-technical-interview.pptx`
- `npm run package:deck` - build the browser preview and generate the PPTX
- `npm run test` - run deck/model tests
- `npm run build` - validate, typecheck, and build the browser preview into `dist/preview`

## Authoring Model

Edit the deck data in `src/deck/content.ts`. The same typed deck definition drives both the browser preview and PPTX export.

- `sections` define the topic tracker shown in the header.
- `slides` define authored presentation moments.
- `steps` reveal content over multiple rendered slides, creating robust PowerPoint-compatible animation-like builds.
- `notes` are exported to PowerPoint speaker notes.

Keep layout and styling changes in `src/deck/theme.ts` and renderer/exporter code. Keep presentation content changes in the deck data.

## Screenshots

Put screenshots in `public/screenshots/`. Use `npm run import:screenshot -- "C:\path\to\screenshot.png"` to copy and rename the file to `demo-screenshot.png`.

Edit slide copy, captions, speaker notes, and screenshot references in `src/deck/content.ts`.
