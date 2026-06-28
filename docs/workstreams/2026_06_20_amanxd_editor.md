# amanXD Editor Workstream

## Objective

Maintain `myXD` as a clean development workspace and `amanXDtool/` as the standalone copy-paste AI tool for creating editable UI designs and PNG/JPEG assets.

## Execution Policy

- Use `$workstream-execution` from root `myXD/` only.
- Keep implementation, docs, agent tool definitions, and validation scripts synchronized.
- Do not add backend/cloud storage unless the user explicitly approves it.
- Keep generated editable projects, exported images, and GitHub Pages output inside `amanXDtool/`.

## Current Structure

```text
myXD/
  AGENTS.md
  GUIDELINES.md
  README.md
  docs/
  scripts/
  package.json
  amanXDtool/
    AGENTS.md
    README.md
    agent-tools/
    docs/
    exports/
    project-output-github/
    projects/
    src/
```

There must be no root `app/`, root `agent-tools/`, root `projects/`, root `exports/`, or root `project-output-github/`.

## Current Slice

- done: Improved editor performance with many artboards by rendering heavy element trees only for visible/selected artboards while preserving export behavior.
- done: Fixed artboard PNG export so it clones the selected frame into an offscreen 0,0 export stage instead of capturing a stage-position screenshot; editor selection chrome is stripped from the export.
- done: Removed the duplicate/copy button shown on unselected rows in the left Layers panel.
- done: Created a fresh single-board modern Home concept for the AI home management app at `amanXDtool/projects/haven-ai-modern-home.amanxd.json` and exported `amanXDtool/exports/haven-ai-modern-home.png`.
- note: The Home concept emphasizes a room dropdown topbar, AI-generated resource summary, room/channel chips, resource cards, and a global message composer that navigates into agent chat. A follow-up user correction reduced heavy shadows in favor of flatter React Native-friendly surfaces.
- done: Created a clean five-artboard same-spec Home design set at `amanXDtool/projects/ai-home-same-spec-five.amanxd.json`, with distinct shadcn, Material You, iOS grouped-list, lifestyle bento, and AI command-surface directions. Each keeps menu topbar, house selector, bottom global composer, no tabs, AI suggestions, and resource access.
- done: Added a selected-theme follow-up artboard `home_run_purple` to `amanXDtool/projects/ai-home-same-spec-five.amanxd.json` and exported `amanXDtool/exports/home-run-purple-ios.png`. It uses the purple/iOS direction, app name `Home Run`, no topbar background, bento immediately after top area, upcoming tasks section, and a bottom composer with attach-left and mic-right controls.
- done: Rename/copy the former React app into `amanXDtool/`.
- done: Move the local agent tool server into `amanXDtool/agent-tools/`.
- done: Remove old root `app/`, root `agent-tools/`, root `projects/`, root `exports/`, and root sample `examples/`.
- done: Recreate root docs for development and release workflow.
- done: Add root `GUIDELINES.md` so myXD agents know `amanXDtool/` is the maintained product, not their root instruction source.
- done: Add `amanXDtool/START_HERE_FOR_AGENTS.md`, `amanXDtool/CLAUDE.md`, and `amanXDtool/docs/AGENT_BOOTSTRAP_PROMPT.md` so copied tool users can explicitly steer Codex/Claude into tool usage.
- done: Add high-fidelity quality guidance and style presets for Stitch-like completeness, Dribbble-like polish, and Lovable-like product realism.
- done: Update copied-tool agent guidance so agents plan first, ask concise important questions, and create only after user answers or approves assumptions.
- done: Add platform design-language guidance and precise UI element recipes for Material/Android, iOS/HIG, cross-platform, buttons, cards, search, chips, bars, rows, forms, sheets, and marketplace cards.
- done: Add low-token `AGENT_QUICKSTART.md` and Dribbble-inspired component pattern knowledge so agents can create modern designs without reading every detailed doc.
- done: Add high-level low-token tools: `create_landing_page`, `create_mobile_screen`, `create_dashboard`, and `create_asset_pack`, plus compact prompt guidance.
- done: Add `validate_layout` to catch accidental overlap/out-of-frame issues, add region export via `export_region_image` and `export_frame_image.region`, and document that generated images are viewed only when the user asks.
- done: Recreate `amanXDtool/` docs for copy-paste AI tool usage.
- done: Add root orchestration commands for installing, running, testing, and building the tool.
- done: Route GitHub Pages build output to `amanXDtool/project-output-github/`.
- done: Add tool-doc validation so exposed tool names stay synced with `amanXDtool/AGENTS.md` and `amanXDtool/docs/TOOL_API.md`.
- done: Add XD-like align and distribute actions to the editor top toolbar, Object menu, canvas context menu, and agent tools.
- done: Run full validation after cleanup.
- done: Prepared the repository for GitHub upload by adding hosted CI validation, clarifying GitHub Pages setup, and tightening local/generated artifact ignores.
- done: Repositioned README copy to present amanXDtool as a vibe-coded AI design tool with both manual editor usage and an MCP-style server for AI agents.

## Agent Tool Surface

The current exposed tools are:

- `create_project`
- `list_project`
- `add_frame`
- `add_rectangle`
- `add_ellipse`
- `add_line`
- `add_text`
- `add_image_fill_shape`
- `add_icon`
- `list_icons`
- `group_elements`
- `align_elements`
- `distribute_elements`
- `update_element`
- `apply_operations`
- `export_frame_image`
- `export_project_json`

Any future agent behavior change must update:

- `amanXDtool/agent-tools/tool-definitions.mjs`
- `amanXDtool/agent-tools/server.mjs`
- `amanXDtool/AGENTS.md`
- `amanXDtool/docs/TOOL_API.md`

## Validation Plan

Run from root:

```powershell
npm run install:tool
npm run test:tool
npm run build:github
```

Run direct tool checks:

```powershell
node amanXDtool/agent-tools/scripts/list-tools.mjs
npm --prefix amanXDtool run tools:verify-docs
```

Confirm:

- `amanXDtool/project-output-github/index.html` exists after `npm run build:github`.
- No `app/` folder exists.
- No generated output folders exist at root.

Latest validation:

- `npm run install:tool`: passed.
- `npm run test:tool`: passed.
- `npm --prefix amanXDtool run tools:verify-docs`: passed, 17 tool names verified.
- `node amanXDtool/agent-tools/scripts/list-tools.mjs`: passed.
- `npm run build:github`: passed and wrote `amanXDtool/project-output-github/`.
- Vite still reports the expected large-bundle warning.
- Latest agent-tool validation after high-level tools/layout export updates: `npm --prefix amanXDtool run tools:verify-docs` passed with 23 tool names, `npm --prefix amanXDtool run lint` passed, `node amanXDtool/agent-tools/scripts/list-tools.mjs` passed, MCP smoke test created a landing page, `validate_layout` returned zero issues, and `export_region_image` wrote `exports/smoke-region.png`.
- Latest editor performance/export validation: `npm run lint:tool` passed, `npm --prefix amanXDtool run test` passed with 2 files and 4 tests, `npm run test:tool` passed including 4 Playwright tests, and `npm run build:github` passed. Vite still reports the expected large-bundle warning.
- Browser smoke at `http://127.0.0.1:5173`: title `amanXD`, canvas present, layer panel present, duplicate layer buttons count `0`, and no console errors in the sampled browser logs.
- GitHub readiness validation: `npm run test:tool` passed after rerunning outside the Windows sandbox due a native Tailwind/Vitest `spawn EPERM` issue; `npm run build:github` passed after rerunning outside the sandbox due an `unlink` permission issue in generated Pages output. `amanXDtool/project-output-github/index.html` exists. Vite still reports the expected large-bundle warning.

## Remaining Product Gaps

- Continue XD-like design parity work inside `amanXDtool/`.
- Improve image-fill crop handles, marquee selection, layer reorder indicators, components, repeat grid, and richer export presets.
- Keep the tool-first workflow optimized so agents can create complex UIs through compact tool calls instead of writing large JSON by hand.

