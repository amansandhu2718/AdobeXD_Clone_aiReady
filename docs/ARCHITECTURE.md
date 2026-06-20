# amanXD Architecture

## Overview

The app is a Vite React TypeScript application under `app/`. It is local-first: all project state lives in React state while editing and persists to IndexedDB through Dexie. Codex and other AI agents interact with the app through an editable JSON project contract.

## Main Subsystems

- Editor shell: top command bar, left tools, layers panel, central canvas, right inspector, assets/fonts panel.
- Document model: normalized project, page, frame, element, asset, style, and prototype-link data.
- Canvas renderer: React Konva renders frames and elements, applies transforms, handles selection, and exports PNGs.
- State layer: Zustand store holds the active project, selection, tool, viewport, and UI mode.
- Persistence: Dexie stores projects, recent project metadata, and imported assets in IndexedDB.
- AI project API: Zod validates imported `.amanxd.json` data and normalizes it before state/storage writes.
- Export pipeline: JSON export serializes the document model; PNG export captures frames or selected nodes from the Konva stage.

## Data Flow

1. User or AI imports project JSON.
2. Zod validates and normalizes the document.
3. Zustand stores the active project and editor state.
4. Canvas renders visible pages/frames/elements from the normalized model.
5. Inspector updates element style and geometry.
6. Autosave persists the project to IndexedDB.
7. Export reads the same model for `.amanxd.json`, handoff metadata, or PNG output.

## Folder Shape

```text
app/
  src/
    components/
      canvas/
      editor/
      panels/
    data/
    lib/
    store/
    types/
    validation/
```

## Scaling Rules

- Keep the JSON model framework-agnostic so agents can create projects without knowing React internals.
- Keep canvas rendering separate from validation and persistence.
- Prefer small feature modules over a single giant editor file.
- Treat export behavior as part of the public product contract.
