# Exports

amanXDtool supports editable project export and image asset export.

## Project Export

`.amanxd.json` is the editable source format. It can be imported back into the manual editor and used by agents.

## Image Export

PNG/JPEG exports are written through either the manual editor or `export_frame_image`.

Default agent output:

```text
exports/
```

## Manual Editor Export Behavior

The editor supports:

- selected layer PNG
- selected layers as one PNG asset
- marked asset batch PNG
- selected artboard PNG/JPEG
- all artboards PNG
- handoff JSON

When the browser supports a save picker, the user can choose the export location. Otherwise the browser downloads to the default downloads folder.

Exports should not include editor-only selection outlines, guides, handles, grids, or panels.
