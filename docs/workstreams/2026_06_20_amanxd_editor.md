# amanXD Editor Workstream

## Objective

Build a scalable local-first React design editor inspired by Adobe XD workflows. The project supports UI creation, styling, layers, assets, local persistence, JSON import/export for Codex agents, and PNG export.

## Execution Policy

- Use this document as the active workstream root.
- Default to autonomous execution within the approved plan.
- Stop and ask before introducing backend storage, cloud services, accounts, destructive cleanup, or materially changing the JSON/storage contract.
- Keep docs, schema, validation, and implementation synchronized.

## Current Understanding

- Workspace: `D:\Learning\Projects\myXD`
- Product name: `amanXD`
- Initial workspace was empty and not a Git repo.
- User approved the main plan and specifically requested `$workstream-execution`.
- User supplied an Adobe XD screenshot reference with a light theme, compact top tabs, left tool/library panels, multi-artboard canvas, and right inspector.
- AI/Codex should create UIs by generating validated project JSON.
- Current user request is a broader Adobe XD parity repair pass, explicitly including:
  - border radius controls on canvas
  - images and shapes/image fills
  - canvas movement, selection, deselection, and edit mode bugs
  - node/layer tree issues
  - top bar, File, Project, toolbar, icon behavior
  - board/artboard functionality
  - fill color not updating reliably

## XD Research Baseline

- Adobe documents image fills as shape-owned: drag an image onto an object to apply it as image fill.
- Adobe documents crop mode for image fills: double-click image fills/containers to crop and reposition the image inside the container.
- Adobe documents selection with click, marquee, Shift-click, and direct selection in groups.
- Adobe documents circular handles for resizing and rotation, with Shift-constrained rotation.
- Adobe documents movement by dragging, arrow keys, Shift-arrow 10px movement, inspector numeric values, alignment, arrange order, and pixel-grid rounding.
- Adobe documents shortcuts: Ctrl+Z, Ctrl+Shift+Z, Ctrl+D, Delete, Ctrl+Shift+A, Ctrl+L, Ctrl+comma, Ctrl+Shift+M, Ctrl+R, V/R/E/L/T/A/Z, Ctrl+plus/minus, Ctrl+0/1/2, and Spacebar pan.

## Active Parity Audit

- done: Fix fill color so the artboard updates immediately and predictably.
- done: Repair File/Project/top toolbar into an XD-like command surface.
- done: Expand toolbar/icon behavior so tools have obvious active/disabled states and shortcuts.
- done: Add canvas radius handles instead of only quickbar +/-.
- done: Tighten image-fill crop behavior and normal/crop mode affordances for the current model.
- done: Fix first layer of canvas selection/deselection/direct selection and keyboard nudging.
- todo: Fix layer tree naming, drag nesting, collapse, target affordances, and non-independent image fills.
- done: Add first board controls: zoom presets, pixel grid rounding, arrange, and align-to-frame commands.
- todo: Validate with unit tests, Playwright, and live browser smoke.

## Design Section 50-Item Gap Backlog

1. done: Direct double-click text editing on canvas with real typing.
2. todo: Marquee selection box for selecting multiple elements.
3. todo: Shift-drag duplicate behavior.
4. todo: Alt/Option resize from center behavior.
5. todo: Shift resize aspect-ratio lock for shapes/images.
6. todo: Rotation angle snapping while holding Shift.
7. todo: Better direct selection inside groups without changing group position.
8. todo: Multi-object align to selection bounds, not only to artboard.
9. todo: Multi-object distribute horizontal/vertical spacing.
10. todo: Smart spacing measurements between nearby objects.
11. todo: On-canvas distance labels while moving or resizing.
12. todo: Ruler guides and draggable manual guides.
13. todo: Toggle layout grid per artboard with grid size controls.
14. todo: Separate square grid and layout columns.
15. todo: Per-artboard grid visibility/persistence.
16. todo: Full layer reorder above/below drop lines.
17. todo: Layer drag auto-expand collapsed groups.
18. todo: Prevent invalid recursive nesting in layer tree.
19. todo: Layer rename inline editing.
20. todo: Group/ungroup commands with preserved absolute positions.
21. todo: Components with main component and instances.
22. todo: Component overrides for text/fill/image.
23. todo: Repeat Grid equivalent for rows/columns.
24. todo: Boolean operations for shapes.
25. todo: Pen/vector path editing.
26. todo: Polygon/star/basic icon shape tools.
27. todo: Image crop handles on canvas, not only Image +/- buttons.
28. todo: Image fill focal point indicator.
29. todo: Drag image from assets panel onto selected shape.
30. todo: Replace image fill without resetting crop unless requested.
31. todo: Image fit presets visible on canvas/context panel.
32. todo: Per-corner radius handles and linked/unlinked radius toggle.
33. todo: Radius handles should not add history entries on every pointer tick.
34. todo: Gradient editor with draggable stops.
35. todo: Shadow presets and multiple shadows.
36. todo: Background blur/effect metadata UI.
37. todo: Opacity/blend-mode visual accuracy.
38. todo: Proper text box auto-height and fixed-height modes.
39. todo: Text resize behavior matching area text vs point text.
40. todo: Text selection/caret styling closer to design tools.
41. todo: Font picker search and preview.
42. todo: Font loading failure fallback UI.
43. todo: Keyboard shortcuts overlay/help.
44. todo: Context menu for canvas objects.
45. todo: Object paste should preserve relative positions for multi-selection.
46. todo: Undo history should coalesce drags/radius edits into single actions.
47. todo: Artboard presets and responsive artboard creation.
48. todo: Artboard reorder/rename in layer tree.
49. todo: Export selected nested/group asset with correct clipping.
50. todo: SVG export for selected vector/shapes.

## Current Repair Slice - 2026-06-20

Changed files:

- `app/src/store/editorStore.ts`
- `app/src/components/canvas/CanvasBoard.tsx`
- `app/src/components/editor/EditorWorkspace.tsx`
- `app/src/components/editor/ToolRail.tsx`
- `app/src/components/panels/InspectorPanel.tsx`
- `app/src/index.css`
- `docs/workstreams/2026_06_20_amanxd_editor.md`

Latest repair pass:

- done: Added `Ctrl+C` / `Ctrl+V` copy-paste state and menu actions.
- done: Made multi-selection selection state drive duplicate, delete, nudge, lock/hide, align, and pixel-grid commands.
- done: Connected Shift/Ctrl/Meta-click multi-selection to the canvas transformer.
- done: Added artboard square grid rendering plus View menu toggle.
- done: Added object snapping settings with a top-bar magnet control, `Ctrl+;` shortcut, and snap distance property.
- done: Resize now emits alignment guides against artboard and other shape edges/centers, not only movement.
- done: Fixed selected shapes/image masks drawing two purple lines by separating actual object stroke from selection controls.
- done: Disabled the transformer's rectangular border so rounded corners and image-filled shapes do not show a conflicting purple outline during radius editing.
- done: Radius handles now update live and scale/clamp relative to resized shape dimensions.
- done: Added direct on-canvas text editing by double-clicking text layers.
- todo: Add true XD-like marquee selection and multi-object distribution.
- todo: Add full layer reorder above/below indicators, not only nest-into targets.
- todo: Continue backlog item 2: marquee selection.

Implemented:

- Fill color picker now applies live from the color input; typed color values still commit on blur/Enter.
- Top bar now has XD-like command buckets: File, Edit, Object, View, active Design tab, project-title dropdown, and zoom readout.
- Project actions moved into the centered project-title dropdown.
- Object menu now exposes lock/show, arrange, align, and pixel-grid operations.
- Keyboard actions added: duplicate, lock/show, deselect, arrow nudge, Shift-arrow 10px nudge, zoom presets, arrange order, and tool shortcuts.
- Tool rail now shows XD-style labels/shortcuts in tooltips and uses `Artboard` naming.
- Selected rectangles/image-shapes now display draggable corner radius handles on canvas.
- Shift-drag constrains top-level element movement horizontally/vertically.

Validation:

- `npm run lint`: passed.
- `npm run test`: passed, 2 test files and 4 tests.
- `npm run build`: passed. Vite bundle-size warning remains expected.
- `npx playwright test`: passed, 4 Chromium tests.
- Latest snapping/topbar/radius pass: `npm run lint`, `npm run test`, `npm run build`, and `npx playwright test` passed. Build still reports the expected editor bundle-size warning.
- Live browser check at `http://127.0.0.1:5173/`: title `amanXD`, File/Edit/Object/View visible, image fill tree visible, zoom readout visible. Browser log API still includes stale HMR errors from before the final helper compiled; fresh page content is healthy and production build passes.

Remaining parity gaps:

- Multi-selection and marquee selection are still not implemented.
- Layer tree can nest layers but does not yet support full reorder-above/below drop lines.
- Text editing is inspector-based; direct Enter/double-click text editing on canvas is not complete.
- Crop mode has move/scale controls but not full XD crop handles.
- Alignment supports selected element to frame, not multi-object alignment/distribution.
- Repeat grid, components, responsive resize, and full asset-library behavior remain planned-but-not-complete.

## Current State

- Docs: done
- Scaffold: done
- Dependencies: done
- Data model and validation: done
- Editor UI: done
- Persistence: done
- Export: done
- Prototype/preview UI: hidden by user request; design-only mode is active.
- Tests and validation: done

## Implemented

- Vite React TypeScript app under `app/`.
- Light XD-style editor shell with top tabs, left tool rail, layer/library panel, central canvas, and right inspector.
- React Konva canvas with frames, rectangles, ellipses, lines, text, images, selection, dragging, transforming, and frame PNG export.
- Inspector controls for transform, fill, stroke, per-corner radius, shadow, opacity, typography, text content, background, and mark-for-export.
- Zustand editor store, typed project model, sample amanXD project, Dexie IndexedDB autosave, Zod project validation, JSON import/export, and handoff metadata export.
- Google Fonts loader, image asset support, Unsplash URL sample, color assets, component metadata, and design metadata.
- Example AI project file at `examples/ai-projects/mobile-login.amanxd.json`.
- Bug-fix pass for user-reported editor gaps:
  - Shapes and images can now use an image URL or uploaded image as an image fill.
  - Google Font selection now loads fonts before applying them.
  - Left layer panel frames can be collapsed/expanded.
  - Ellipse movement uses the same top-left drag model as other shapes.
  - Canvas quick controls can adjust selected-shape border radius without using only the right inspector.
  - Undo, redo, Delete, and Backspace keyboard shortcuts are wired.
  - Local IndexedDB hydration no longer pollutes undo history.
  - Frame PNG export crops to the artboard content instead of exporting labels or zoom-scaled bounds.
  - Nested elements are supported for button-like objects: text can be nested inside containing shapes, the layer tree shows children, and recursive updates/deletes work.
  - Layer-panel drag/drop can move a layer inside another shape/group; valid targets and the active target are highlighted during drag.
  - File and Project menus are visible, including empty-project creation.
  - Export options now follow XD's main buckets: selected artboard PNG/JPG, all artboards, selected asset, batch marked assets, editable project JSON, and handoff JSON. SVG/PDF remain visibly disabled.
  - Shape images now behave like masks: aspect-ratio preserving cover/contain, double-click crop mode, and overflow while editing crop.
  - Responsive layout supports desktop, tablet, and phone-width smoke tests.
  - Canvas snapping and purple alignment guides appear while dragging top-level elements near artboard/sibling edges or centers.
  - Color fields use a local draft and commit on blur/Enter, reducing picker lag and excessive history updates.
  - Image files or URLs can be dropped onto canvas shapes to become masked image fills.
  - Images remain clipped inside shapes in normal mode, preserve aspect ratio with cover/contain, and support crop X/Y/scale through double-click crop mode plus inspector controls.
  - The image tool now creates an image-filled shape rather than a standalone image layer.
  - Shape-owned images appear as nested `Image Fill` rows in the layer tree and cannot be dragged out as independent layers.
  - Double-clicking an image shape enters image-edit mode: the shape stays fixed while the image fill can be dragged and resized with crop controls.

## Decisions

- Use `.amanxd.json` as the canonical editable AI/project export format.
- Keep `.myxd.json` accepted by the importer for compatibility with the earlier plan.
- Use local-first IndexedDB storage with Dexie.
- Use React Konva for canvas rendering and PNG export.
- Use lucide-react for icons and Google Fonts via runtime font loading.
- Keep backend APIs out of v1 unless explicitly approved later.

## Open Questions

- None currently.

## Validation Evidence

- `npm run lint`: passed.
- `npm run test`: passed, 2 test files and 4 tests.
- `npx playwright test`: passed, 1 Chromium smoke test.
- `npm run build`: passed. Vite reports one expected bundle-size warning because the canvas/editor stack is larger than 500 kB after minification.
- Browser verification: `http://127.0.0.1:5173` loaded with title `amanXD`, visible canvas, topbar, layer list, assets, Google Fonts, and inspector.
- Bug-fix validation after user feedback: `npm run lint`, `npm run test`, `npm run build`, and `npx playwright test` all passed.
- Responsive/snap/color-picker validation: `npm run lint`, `npm run test`, `npm run build`, and `npx playwright test` passed; Playwright covers 1280px, 900px, and 390px widths.
- Image-fill validation: `npm run lint`, `npm run test`, `npm run build`, and `npx playwright test` passed. Live browser reload confirmed the tree shows `Image Shape` with nested `Image Fill` and no legacy standalone `Unsplash Image` layer.

## Remaining Risks / Next Improvements

- PNG export can be affected by remote images that do not allow canvas export through CORS.
- Playwright e2e test is scaffolded but was not run in final validation; unit tests and browser automation covered the smoke path.
- Future hardening should add undo/redo history, deeper grouping/reordering, component state editing, SVG/PDF export, and code splitting.

## Next Safe Action

Use the running app at `http://127.0.0.1:5173`, then ask Codex to create new `.amanxd.json` projects from prompts using `docs/AI_PROJECT_SCHEMA.md` and the example file.
