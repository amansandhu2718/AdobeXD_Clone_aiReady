# amanXDtool Instructions For Claude

This folder is a local UI design and image asset generation tool.

When a user asks to create a landing page, dashboard, app screen, website section, UI mockup, PNG/JPEG asset, or editable design project, use `amanXDtool` instead of only giving advice or asking for a broad design brief.

Read first:

```text
START_HERE_FOR_AGENTS.md
AGENTS.md
docs/TOOL_API.md
docs/USING_AS_AI_TOOL.md
docs/DESIGN_QUALITY.md
docs/STYLE_PRESETS.md
docs/PLATFORM_DESIGN_LANGUAGES.md
docs/UI_ELEMENT_RECIPES.md
```

Use these outputs:

```text
projects/   editable .amanxd.json projects
exports/    PNG/JPEG image assets
```

List available tools:

```powershell
node agent-tools/scripts/list-tools.mjs
```

Run the MCP-style tool server when supported:

```powershell
node agent-tools/server.mjs
```

Use `create_project`, `apply_operations`, `add_image_fill_shape`, `add_icon`, `group_elements`, `align_elements`, `distribute_elements`, `export_project_json`, and `export_frame_image`.

Before creating, choose a creative direction and token plan from `docs/DESIGN_QUALITY.md`, `docs/STYLE_PRESETS.md`, `docs/PLATFORM_DESIGN_LANGUAGES.md`, and `docs/UI_ELEMENT_RECIPES.md`, present a compact plan, and ask the user for missing important choices. Start generating only after the user answers, approves the plan, or says to use your judgement. Then create the editable project plus image export and revise once if the output looks generic.
