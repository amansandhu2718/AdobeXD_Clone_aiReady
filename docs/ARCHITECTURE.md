# myXD Architecture

## Workspace Roles

`myXD/` is the development workspace. It owns workstream state, release/build scripts, and developer-facing documentation.

`amanXDtool/` is the shareable AI tool folder. It contains the React editor, local MCP-style tool server, project outputs, image exports, and agent-facing documentation.

`amanXDtool/project-output-github/` is generated static output for GitHub Pages.

## amanXDtool Runtime

- React + Vite + TypeScript for the manual editor.
- React Konva for artboards, layers, transforms, image masks, selection, alignment, and export rendering.
- Zustand for editor state and undo/redo history.
- Dexie/IndexedDB for local-first autosave.
- Zod for imported `.amanxd.json` validation.
- Local `agent-tools/` for AI project creation and image export.

## Agent Tool Boundary

Agents should use `amanXDtool/agent-tools/server.mjs` and its tool definitions to create or modify `.amanxd.json` projects.

Generated editable project files default to:

```text
amanXDtool/projects/
```

Generated PNG/JPEG assets default to:

```text
amanXDtool/exports/
```

## Release Boundary

Root scripts build `amanXDtool/` and copy `amanXDtool/dist/` into `amanXDtool/project-output-github/`.

The GitHub Pages output is static and should not include root workstream docs or source files.
