# UX Specification

## Editor Layout

- Top bar: file/project menus, project name, design tab, undo/redo, import, and export.
- Left rail: tool icons for select, frame, rectangle, ellipse, line, text, image, hand.
- Left panel: layers tree with hide, lock, rename, duplicate, delete, and reorder support.
- Center: infinite-feeling canvas with frames on a neutral work surface.
- Right panel: inspector for geometry, styling, typography, image masks, nesting, and export properties.
- Bottom/secondary panel: assets and fonts.

## Design Mode

Users can add and edit elements visually. The inspector exposes:

- Position and size
- Rotation and opacity
- Fill and gradient metadata
- Stroke color, width, and style
- Border radius with per-corner values
- Shadow settings
- Typography controls
- Image fit/crop metadata
- Visibility and lock state

Text and other elements can be nested inside shape parents. For example, a button should be modeled as a rectangle with a nested text label so it moves, duplicates, deletes, exports, and appears in the layer tree as one structured object.

## Prototype Mode

Prototype and preview modes are intentionally hidden for now. amanXD is design-only until core design behavior is stable.

## Asset Workflow

- Save colors and text styles from selected elements.
- Reuse imported images.
- Reuse components and component instances.
- Use icon assets from the app's icon library.

## AI Workflow

1. User asks Codex to create a UI.
2. Codex generates a `.amanxd.json` project using the documented schema.
3. User imports the file.
4. App validates, renders, and autosaves the project.
5. User edits visually and exports JSON or PNG.
