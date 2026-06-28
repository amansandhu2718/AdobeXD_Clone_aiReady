# amanXDtool Agent Guide

This folder is a standalone AI tool/plugin-style project for creating UI designs and image assets.

When this folder is copied into another project, use it as a local design-generation tool. Do not edit the host project by hand when a UI mockup or image asset should be generated through amanXDtool.

If the user asks for a landing page, dashboard, app screen, hero image, UI mockup, screenshot-style asset, icon/image asset, or design export and mentions `amanXDtool`, use this tool folder first. Do not route the task into a generic design-brief flow unless required details are truly missing.

If this file is being read from a copied `amanXDtool/` folder inside a host project, treat the host project as the consumer and keep generated design files inside this folder unless the user asks for a different destination.

Never browse or open Dribbble, Lovable, Stitch, or other inspiration sites for UI generation. Use local knowledge docs.

Exception: agents may open official Google Material Design documentation or official Apple Human Interface Guidelines when platform accuracy is required.

## Core Workflow

1. Use `node agent-tools/scripts/list-tools.mjs` to inspect exposed tools.
2. Read `AGENT_QUICKSTART.md` and `docs/DRIBBBLE_COMPONENT_PATTERNS.md` for token-efficient design knowledge.
3. Read detailed docs only when needed: `docs/DESIGN_QUALITY.md`, `docs/STYLE_PRESETS.md`, `docs/PLATFORM_DESIGN_LANGUAGES.md`, and `docs/UI_ELEMENT_RECIPES.md`.
4. Use `node agent-tools/server.mjs` as the MCP-style local tool server when the host AI environment supports tool servers.
5. If MCP tool calls are not available in the host environment, still use the documented schemas and helper scripts in `agent-tools/` rather than hand-writing large final project files from scratch.
6. Create editable projects under `projects/`.
7. Export PNG/JPEG assets under `exports/`.
8. Run the manual editor with `npm run dev` when visual review or manual editing is needed.

## Agent Decision Rule

When the user asks for a UI or asset, plan first, then create with amanXDtool:

1. Capture a compact brief from the user request.
2. Pick a creative direction and token plan from `AGENT_QUICKSTART.md` and `docs/DRIBBBLE_COMPONENT_PATTERNS.md`; open detailed docs only if needed.
3. Present a short plan to the user.
4. Ask concise questions for missing important choices such as brand name, target device, required sections, color/style preference, or export size.
5. Start creating only after the user answers, approves the plan, or explicitly says to use your judgement.
6. Create an editable `.amanxd.json` project.
7. Export at least one PNG/JPEG preview when the user wants an image asset or visual result.
8. Review the result against the design quality checklist and revise once if it is generic.
9. Report the generated file paths.

Ask only questions that affect the design. Do not run a long discovery interview.

## Exposed Tools

- `create_landing_page`
- `create_mobile_screen`
- `create_dashboard`
- `create_asset_pack`
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
- `export_region_image`
- `validate_layout`
- `export_project_json`

## Design Rules

- Prefer tool calls over hand-writing large JSON.
- Prefer `AGENT_QUICKSTART.md` and `docs/DRIBBBLE_COMPONENT_PATTERNS.md` for normal tasks to reduce token usage.
- Prefer high-level tools (`create_landing_page`, `create_mobile_screen`, `create_dashboard`, `create_asset_pack`) before low-level layer operations.
- Run `validate_layout` before exporting and fix accidental overlaps or out-of-frame layers.
- Use `docs/DESIGN_QUALITY.md` as the quality bar for elegant, creative outputs.
- Use `docs/STYLE_PRESETS.md` when the user asks for Stitch-like, Dribbble-like, Lovable-like, or category-specific polish.
- Use `docs/PLATFORM_DESIGN_LANGUAGES.md` for Android/Google/Material, iOS/Apple, and cross-platform mobile styling.
- Use `docs/UI_ELEMENT_RECIPES.md` to build precise buttons, inputs, cards, chips, bars, tabs, rows, sheets, and marketplace cards.
- Use `apply_operations` for complex screens to reduce token usage.
- Use `add_image_fill_shape` for images; images should live inside rectangle or ellipse masks.
- Use `add_icon` after `list_icons` for icons.
- Use `group_elements` for cards, buttons, nav items, and repeated UI chunks.
- Use `align_elements` and `distribute_elements` instead of manually calculating common layout alignment.
- Use `export_frame_image` for PNG/JPEG assets that the host project can consume.
- Use `export_region_image` when the user wants a particular board area, selected section, crop, card, or asset region.
- Use image reading/viewing tools only when the user asks to view, inspect, or visually review generated assets.

## Validation

Before handing off this tool folder after changes, run:

```powershell
npm run lint
npm run tools:verify-docs
npm run test
npm run build
npx playwright test
```

## Keep Tools Current

Whenever a tool is added, renamed, or removed, update:

- `agent-tools/tool-definitions.mjs`
- `agent-tools/server.mjs`
- `AGENTS.md`
- `docs/TOOL_API.md`

Then run:

```powershell
npm run tools:verify-docs
```
