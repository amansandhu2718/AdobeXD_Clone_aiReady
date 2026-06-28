# Start Here For Agents

You are looking at `amanXDtool`, a local UI design and image asset generation tool.

Use this folder when the user asks to create:

- landing pages
- dashboards
- app screens
- website sections
- UI mockups
- PNG/JPEG design assets
- editable `.amanxd.json` design projects

## First Rule

Do not treat the user request as a normal chat-only design task.

Use `amanXDtool` to create files:

- editable projects in `projects/`
- PNG/JPEG exports in `exports/`

Never browse or open external inspiration sites for UI generation. Use local knowledge in this folder.

Exception: official Google Material Design documentation and official Apple Human Interface Guidelines may be opened for platform-accuracy checks.

## What To Read

Read these files:

```text
AGENT_QUICKSTART.md
AGENTS.md
docs/DESIGN_QUALITY.md
docs/STYLE_PRESETS.md
docs/PLATFORM_DESIGN_LANGUAGES.md
docs/DRIBBBLE_COMPONENT_PATTERNS.md
docs/UI_ELEMENT_RECIPES.md
docs/TOOL_API.md
docs/USING_AS_AI_TOOL.md
docs/EXPORTS.md
```

For Claude, this same guidance is mirrored in `CLAUDE.md`.

## What To Run

From this folder:

```powershell
npm install
node agent-tools/scripts/list-tools.mjs
```

If the host supports MCP-style local tool servers:

```powershell
node agent-tools/server.mjs
```

For manual editing:

```powershell
npm run dev
```

## Behavior

- First create a compact design plan and ask the user for missing important choices.
- Start generating only after the user answers, approves the plan, or the request already contains enough detail.
- Prefer `create_project` then `apply_operations`.
- Use `AGENT_QUICKSTART.md` and `docs/DRIBBBLE_COMPONENT_PATTERNS.md` for token-efficient design knowledge.
- Read detailed docs only when needed.
- Use `add_image_fill_shape` for images because images should live inside shapes.
- Use `list_icons` and `add_icon` for icons.
- Use `group_elements`, `align_elements`, and `distribute_elements` for layout polish.
- Run `validate_layout` before export and fix accidental overlaps, out-of-frame layers, or invalid geometry.
- Use `export_frame_image` for PNG/JPEG output.
- Use `export_region_image` for a particular board area, card, section, or crop.
- Use `export_project_json` when the editable project JSON is needed.
- Use image reading/viewing tools only when the user asks to view, inspect, or visually review generated assets.

If exact details are missing, ask concise questions first. If the user says to use your judgement, make strong reasonable assumptions and proceed.

Do not stop after producing a technically valid but plain layout. Review against the design quality checklist and revise once if the result feels generic.
