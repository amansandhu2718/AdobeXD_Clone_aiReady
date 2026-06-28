# Using amanXDtool As An AI Tool

Copy `amanXDtool/` into any project where you want AI-generated UI mockups or image assets.

Then tell your agent:

```text
Read amanXDtool/START_HERE_FOR_AGENTS.md first, then use the amanXDtool folder as a local UI and image asset generation tool. Create editable amanXD projects in amanXDtool/projects and export PNG/JPEG assets into amanXDtool/exports.
```

If the agent starts asking broad design-brief questions or tries to build the UI directly in the host app, paste `docs/AGENT_BOOTSTRAP_PROMPT.md` into the chat. Nested tool folders are not always auto-discovered by AI tools.

For better visual quality with fewer tokens, paste `amanXDtool/docs/COMPACT_PROMPT.md`. It tells the agent to read only `amanXDtool/AGENT_QUICKSTART.md`, `amanXDtool/docs/DRIBBBLE_COMPONENT_PATTERNS.md`, and `amanXDtool/docs/TOOL_API.md` first.

## Recommended Prompt

```text
Create a polished dashboard UI asset for this project using amanXDtool.
Use amanXDtool agent tools instead of hand-writing large JSON.
Use amanXDtool/AGENT_QUICKSTART.md and amanXDtool/docs/DRIBBBLE_COMPONENT_PATTERNS.md for modern component/design knowledge.
Use high-level tools first: create_landing_page, create_mobile_screen, create_dashboard, or create_asset_pack.
Plan first, ask me the important missing questions, then start after I approve.
Export one PNG preview and keep the editable .amanxd.json project.
```

For your food delivery example:

```text
Read amanXDtool/START_HERE_FOR_AGENTS.md, amanXDtool/AGENT_QUICKSTART.md, and amanXDtool/docs/DRIBBBLE_COMPONENT_PATTERNS.md first. Plan first and ask me the important missing questions. After I approve, create a beautiful Zomato-style food delivery landing page using amanXDtool in a Stitch/Dribbble/Lovable quality style. Build precise search fields, cards, chips, buttons, and navigation. Export an editable project and a PNG preview, and revise once before final response if the design looks generic.
```

## Agent Workflow

1. Use `create_landing_page`, `create_mobile_screen`, `create_dashboard`, or `create_asset_pack`.
2. Refine with `apply_operations` only if needed.
3. Use `add_image_fill_shape` for extra image masks.
4. Use `list_icons` and `add_icon` for extra icons.
5. Use `align_elements` and `distribute_elements` for layout polish.
6. Run `validate_layout` and fix accidental overlaps or out-of-frame layers.
7. Export editable JSON with `export_project_json`.
8. Export full frames with `export_frame_image` or a specific board area with `export_region_image`.

Only view/read generated images when the user explicitly asks to view, inspect, compare, or visually review them.

## Manual Workflow

Run:

```powershell
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173/
```

Use the editor to inspect, adjust, import, export, and manually design UI screens.
