# Compact Prompt

Use this when you want another AI agent to use amanXDtool with fewer tokens.

```text
Use amanXDtool as a local UI and asset generation tool.

Read only:
- amanXDtool/AGENT_QUICKSTART.md
- amanXDtool/docs/DRIBBBLE_COMPONENT_PATTERNS.md
- amanXDtool/docs/TOOL_API.md

Do not browse Dribbble, Lovable, Stitch, or inspiration sites. Official Google Material and Apple HIG docs are allowed only for platform accuracy.

Plan first and ask 1-3 important questions. After I approve, use high-level tools first:
- create_landing_page
- create_mobile_screen
- create_dashboard
- create_asset_pack

Use low-level tools only for refinement. Run validate_layout before export and fix accidental overlaps/out-of-frame layers.
Export editable .amanxd.json and PNG/JPEG preview. Use export_region_image when I ask for a particular board area.
Only view/read generated image assets when I explicitly ask to view or inspect them. Revise once if generic.
```
