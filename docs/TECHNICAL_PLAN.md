# Technical Plan

## Phase 1: Docs And Workstream

- Create PRD, architecture, AI schema, UX, export, and technical docs.
- Create `AGENTS.md`.
- Create the active workstream root under `docs/workstreams/`.

## Phase 2: Scaffold

- Create Vite React TypeScript app under `app/`.
- Add editor dependencies: React Konva, Zustand, Dexie, Zod, dnd-kit, lucide-react, Tailwind, Vitest, Testing Library.
- Configure app structure and scripts.

## Phase 3: Core Data And State

- Define TypeScript types for project, frames, elements, styles, assets, and prototype links.
- Implement Zod validation for `.amanxd.json`.
- Implement Zustand editor store.
- Implement Dexie persistence and autosave hooks.

## Phase 4: Editor UI

- Build app shell with top bar, tools, layers, canvas, inspector, and assets/fonts panel.
- Render sample project by default.
- Add selection and inspector editing for geometry and style fields.

## Phase 5: Canvas And Export

- Render frames, rectangles, ellipses, lines, text, and images in React Konva.
- Support basic transforms, selection, visibility, locks, opacity, border radius, strokes, shadows, typography, and image fit metadata.
- Export project JSON, frame PNG, selected asset PNG, and handoff metadata.

## Phase 6: Prototype And AI Examples

- Add prototype link editing and preview navigation.
- Add example `.amanxd.json` projects for Codex-generated designs.
- Document prompt patterns for creating UIs through JSON.

## Validation

- TypeScript build must pass.
- Schema validation tests must pass.
- Import/export round-trip tests must pass.
- Playwright smoke test should cover loading the editor, selecting an element, editing a property, importing JSON, and exporting project JSON.
