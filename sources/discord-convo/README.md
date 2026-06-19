# Discord Conversation Source Workspace

Use this folder for the Discord tuning conversation and the images/logs that need to be reconstructed from the pasted Markdown export.

## Where Things Go

- `convo_log.md` - working copy of the pasted Discord conversation.
- `images/raw/` - original screenshots as you copy/save them from chat. Keep whatever filename your system gives them.
- `images/renamed/` - presentation-ready screenshots renamed to stable, meaningful names.
- `logs/` - `.bbl`, `.zip`, or other blackbox log files referenced in the conversation.
- `notes/` - extracted story notes, contact sheets, and asset mapping notes.
- `notes/asset_manifest.md` - the current source-to-final filename map for downloaded screenshots and logs.

## Image Reconstruction Workflow

1. Save each Discord image into `images/raw/`.
2. Add one row to `image_manifest.md` describing where it appears in the conversation.
3. Rename/copy the important version into `images/renamed/` with a stable name.
4. If the image is going into the deck, copy it into `public/screenshots/` and reference it from `src/deck/content.ts`.

The Markdown paste does not reliably preserve image filenames, so `notes/asset_manifest.md` is the source of truth for reconstructing which screenshot/log belongs to which conversation moment.
