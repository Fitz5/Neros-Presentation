# Neros Presentation

A typed presentation workspace for developing and exporting a 45-minute technical interview deck.

The rendered deck is intentionally reset to one placeholder slide. Research notes, original images, and blackbox logs remain under `sources/discord-convo/`.

## Commands

- `npm run dev` - live browser preview
- `npm run validate` - validate the deck and preserved source-asset manifest
- `npm run import:screenshot -- <source-path> [output-name]` - copy a finished screenshot into `public/screenshots/deck/`
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

## Development Passes

1. **Sketch** - rough slide order, purpose, evidence, and transitions.
2. **Content** - complete claims, details, citations, screenshots, and speaker notes.
3. **Visual** - refine hierarchy, layout, typography, and image treatment.
4. **Build** - add `steps` and `showAt` fields only after slide content is stable.
5. **Rehearse** - validate timing, trim repetition, and export the final PPTX.

Track the rough sequence in `docs/slide-outline.md` while editing `src/deck/content.ts`.

## Screenshots

Keep original Discord material in `sources/discord-convo/images/`. Put only screenshots that are ready for a slide in `public/screenshots/deck/`:

```powershell
npm run import:screenshot -- "C:\path\to\capture.png" "03-filter-response"
```

The importer derives a clean name when one is omitted and refuses accidental overwrites unless `--force` is supplied. Reference imported files as `/screenshots/deck/03-filter-response.png` in `src/deck/content.ts`.

## Discord Conversation Sources

Use `sources/discord-convo/` for the copied Discord Markdown, raw screenshots, renamed screenshots, blackbox logs, and story notes. The source-to-final mapping is in `sources/discord-convo/notes/asset_manifest.csv`.

Run `npm run validate:assets` after renaming, adding, or removing archived logs and images.
