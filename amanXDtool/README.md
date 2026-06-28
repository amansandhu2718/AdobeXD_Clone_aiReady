# amanXDtool

amanXDtool is a vibe-coded AI design tool for creating editable UI designs and PNG/JPEG image assets.

It is both:

- a **manual design editor** you can run in the browser, and
- an **AI-usable tool server** with MCP-style stdio tools for agents.

Copy this whole folder into another project, open that project in Codex or Claude, and tell the agent:

```text
Read amanXDtool/START_HERE_FOR_AGENTS.md first, then use amanXDtool as the UI and image asset generation tool for this project.
```

The agent can create editable `.amanxd.json` designs, validate layouts, export PNG/JPEG frames or regions, and use the manual React editor when visual editing is useful.

Important: many AI agents do not automatically read instructions from nested folders. If the host project is opened above `amanXDtool/`, paste the bootstrap prompt from `docs/AGENT_BOOTSTRAP_PROMPT.md` into the chat before asking for a UI or asset.

## Live Demo

[https://amansandhu2718.github.io/AdobeXD_Clone_aiReady/](https://amansandhu2718.github.io/AdobeXD_Clone_aiReady/)

## Manual Editor

```powershell
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173/
```

Use the editor to view, adjust, inspect, and export designs by hand.

## MCP-Style Agent Server

List exposed tools:

```powershell
node agent-tools/scripts/list-tools.mjs
```

Run the local stdio tool server:

```powershell
node agent-tools/server.mjs
```

The server supports tools for project creation, frame creation, shapes, text, image fills, icons, grouping, alignment, distribution, layout validation, image export, and editable JSON export.

Default outputs:

```text
projects/   editable .amanxd.json files
exports/    PNG/JPEG image assets
```

## Common Agent Workflow

1. Read `START_HERE_FOR_AGENTS.md` or `AGENT_QUICKSTART.md`.
2. Use high-level tools such as `create_landing_page`, `create_mobile_screen`, `create_dashboard`, or `create_asset_pack`.
3. Run `validate_layout`.
4. Fix any accidental layout issues.
5. Export JSON and PNG/JPEG output.

## Validation

```powershell
npm run lint
npm run tools:verify-docs
npm run test
npm run build
npx playwright test
```

## Docs

- `START_HERE_FOR_AGENTS.md`: first file to point an agent at.
- `AGENT_QUICKSTART.md`: compact low-token workflow for normal use.
- `CLAUDE.md`: Claude-compatible entry instructions.
- `AGENTS.md`: direct instructions for AI agents.
- `docs/AGENT_BOOTSTRAP_PROMPT.md`: exact prompt to paste into Codex/Claude.
- `docs/COMPACT_PROMPT.md`: lower-token prompt that points agents to high-level tools first.
- `docs/DESIGN_QUALITY.md`: creative direction, layout recipes, visual tokens, and quality checklist.
- `docs/STYLE_PRESETS.md`: Stitch-like, Dribbble-like, Lovable-like, and category style presets.
- `docs/DRIBBBLE_COMPONENT_PATTERNS.md`: compact modern UI component/design patterns inspired by Dribbble categories.
- `docs/PLATFORM_DESIGN_LANGUAGES.md`: Google Material 3/Android, iOS/HIG, and cross-platform guidance.
- `docs/UI_ELEMENT_RECIPES.md`: precise recipes for buttons, cards, chips, inputs, nav bars, rows, forms, and sheets.
- `docs/USING_AS_AI_TOOL.md`: how to prompt agents to use this folder.
- `docs/TOOL_API.md`: exact tool list and examples.
- `docs/MANUAL_APP.md`: manual editor usage.
- `docs/EXPORTS.md`: export behavior and output locations.
