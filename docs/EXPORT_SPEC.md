# Export Specification

## Export Types

- Project JSON: full editable `.amanxd.json` document.
- Frame PNG: rendered image of one selected frame.
- Selected asset PNG: rendered selected element or group when canvas support allows.
- All artboards PNG: exports every frame/artboard as separate PNG files.
- Marked assets PNG: exports layers marked for export, matching XD's batch-export idea.
- Selected artboard JPG: exports the selected artboard as a JPEG.
- Handoff metadata JSON: frame sizes, color usage, text styles, and asset references.

## Project JSON

Project export must include the full document model:

- pages
- frames
- elements
- assets
- prototype links
- schema version
- nested child elements

The exported JSON should be importable without manual edits.

## PNG Export

Frame PNG export should:

- Preserve the visible frame area.
- Respect fills, strokes, opacity, shadows, text, and images where browser rendering supports it.
- Use the frame name in the downloaded filename.

Selected asset PNG export should:

- Export the selected element/group bounds.
- Warn or no-op clearly if the current selection cannot be exported reliably.

## Handoff Metadata

Metadata export should include:

- frame dimensions
- element positions and sizes
- colors
- typography
- image references
- prototype targets

## Future Extensions

- SVG export
- PDF export
- CSS/React code export
- zipped multi-frame export
