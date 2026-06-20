# amanXD Product Requirements Document

## Summary

amanXD is a local-first UI design editor built with React. It lets a user create screens, style elements, manage layers and assets, and export projects or assets. It is inspired by Adobe XD's practical design workflow without copying Adobe branding or proprietary behavior.

## Target User

- A beginner or solo creator who wants Codex to generate UI projects from prompts.
- A developer-designer who wants a browser-based tool for sketching app screens and exporting handoff assets.
- Codex agents that need a stable JSON format to create editable visual designs.

## Goals

- Create and edit UI frames with shapes, text, images, icons, and groups.
- Support XD-like styling: fills, strokes, border radius, shadows, opacity, typography, image masks, nesting, and alignment.
- Save projects locally in the browser and restore them after reload.
- Import and export editable `.amanxd.json` project files.
- Export selected frames and selected assets as PNG.
- Provide clear docs so Codex can create UI projects using a prompt and validated JSON.

## Non-Goals For First Version

- Cloud collaboration, accounts, multiplayer cursors, and comments.
- Exact Adobe XD file compatibility.
- Paid stock image integrations.
- Full plugin marketplace.
- Production-grade code export.

## Core Feature Matrix

| Area | First Version Requirement |
| --- | --- |
| Canvas | Pan, zoom, frames, selection, resize, move, snap-friendly layout metadata |
| Tools | Frame, rectangle, ellipse, line, text, image, group, component instance |
| Styling | Fill, stroke, opacity, per-corner radius, shadows, typography, alignment |
| Layers | Rename, reorder, lock, hide, duplicate, delete, group |
| Assets | Colors, text styles, images, icons, reusable components |
| Fonts | Curated Google Fonts registry with runtime loading |
| Images | Drag/drop local images and Unsplash image URL support |
| Prototype | Hidden/disabled for now; design mode only |
| Storage | IndexedDB local persistence with autosave |
| AI | JSON schema import/export for Codex-generated UIs |
| Export | Project JSON, frame PNG, selected asset PNG, handoff metadata JSON |

## Success Criteria

- A user can create a new project, add a frame, place text, shapes, and an image, style them, and save locally.
- A Codex-generated `.amanxd.json` file can be imported, validated, rendered, edited, and exported again.
- A user can export at least one selected frame as PNG.
- The editor remains understandable in Codex: docs and workstream state explain how to continue development.
