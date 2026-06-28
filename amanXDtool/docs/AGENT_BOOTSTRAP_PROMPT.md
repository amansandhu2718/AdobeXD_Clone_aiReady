# Agent Bootstrap Prompt

Paste this into Codex, Claude, or another AI agent when `amanXDtool/` is copied inside a host project.

```text
Use the local amanXDtool folder as a UI design and image asset generation tool.

Before creating anything, read:
- amanXDtool/START_HERE_FOR_AGENTS.md
- amanXDtool/AGENT_QUICKSTART.md
- amanXDtool/docs/COMPACT_PROMPT.md
- amanXDtool/docs/DRIBBBLE_COMPONENT_PATTERNS.md
- amanXDtool/docs/TOOL_API.md

Only read detailed docs like DESIGN_QUALITY.md, STYLE_PRESETS.md, PLATFORM_DESIGN_LANGUAGES.md, UI_ELEMENT_RECIPES.md, USING_AS_AI_TOOL.md, and EXPORTS.md if needed.

For this task, do not treat my request as a generic design discussion. Use amanXDtool to create files.
Never browse or open Dribbble, Lovable, Stitch, or other inspiration sites for UI generation. Use amanXDtool's local knowledge docs.
You may open official Google Material Design documentation or official Apple Human Interface Guidelines only when platform accuracy is needed.

Expected behavior:
- First give me a compact design plan
- Ask concise questions for missing important choices before creating
- Start creating only after I answer, approve the plan, or say to use your judgement
- Create editable .amanxd.json projects in amanXDtool/projects/
- Export PNG/JPEG assets in amanXDtool/exports/
- Prefer high-level tools first: create_landing_page, create_mobile_screen, create_dashboard, create_asset_pack
- Prefer create_project then apply_operations
- Choose a creative direction and token plan from AGENT_QUICKSTART.md and DRIBBBLE_COMPONENT_PATTERNS.md before creating layers
- For beautiful outputs, aim for Stitch-like completeness, Dribbble-like visual polish, and Lovable-like product realism
- Build precise UI elements: buttons, search fields, cards, chips, app bars, tab bars, list rows, forms, and sheets should follow UI_ELEMENT_RECIPES.md
- If the request targets Android/Google/Material or iOS/Apple, follow PLATFORM_DESIGN_LANGUAGES.md
- Use add_image_fill_shape for images
- Use list_icons and add_icon for icons
- Use group_elements, align_elements, and distribute_elements for layout
- Run validate_layout before export and fix accidental overlaps/out-of-frame layers
- Export at least one image preview when I ask for a UI/asset
- Use export_region_image when I ask for a particular board area, card, section, or crop
- Only view/read generated image assets when I explicitly ask to view or inspect them
- Review the output against the design quality checklist and revise once if it looks generic
- Report exact output paths when done

Do not ask a long design interview. Ask only the questions that materially affect the design.
```

## Example Request

After pasting the bootstrap prompt, ask:

```text
Create a beautiful Zomato-style food delivery landing page using amanXDtool. Export an editable project and a PNG preview.
```

The agent should produce files similar to:

```text
amanXDtool/projects/food-delivery-landing.amanxd.json
amanXDtool/exports/food-delivery-landing.png
```
