# AI Project Schema

## Purpose

Codex creates amanXD designs by generating structured JSON. The app validates this data before rendering or saving it. This gives agents a stable, documented way to build UIs from prompts.

## File Convention

- Extension: `.amanxd.json`
- Format version: `1`
- Required root fields: `schemaVersion`, `project`

## Core Shape

```json
{
  "schemaVersion": 1,
  "project": {
    "id": "project_demo",
    "name": "Demo Dashboard",
    "pages": [
      {
        "id": "page_main",
        "name": "Main",
        "frames": [
          {
            "id": "frame_home",
            "name": "Home",
            "x": 0,
            "y": 0,
            "width": 390,
            "height": 844,
            "background": "#ffffff",
            "elements": []
          }
        ]
      }
    ],
    "assets": {
      "colors": [],
      "textStyles": [],
      "images": [],
      "components": []
    },
    "prototypeLinks": []
  }
}
```

## Element Types

- `rectangle`
- `ellipse`
- `line`
- `text`
- `image`
- `group`
- `componentInstance`

## Required Element Fields

Every element has:

- `id`
- `type`
- `name`
- `x`
- `y`
- `width`
- `height`
- `rotation`
- `opacity`
- `locked`
- `visible`
- `style`

Elements can include `children` for nesting. Child element coordinates are relative to the parent element, so a button can be represented as a rectangle with a nested text child. Moving or deleting the parent should carry the child with it.

## Style Fields

Supported style metadata includes:

- `fill`
- `gradient`
- `stroke`
- `cornerRadius`
- `shadow`
- `typography`
- `imageFit`
- `blendMode`

The implementation source of truth is the Zod schema in `app/src/validation/projectSchema.ts`.

## Agent Rules

- Always include stable unique IDs.
- Keep text content in `content` for text elements.
- Use image asset IDs for local images and `src` URLs for remote images.
- Put prototype behavior in `prototypeLinks`, not inside visual elements.
- Validate before claiming a design can be imported.
