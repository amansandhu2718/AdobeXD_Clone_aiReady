# amanXDtool Agent Quickstart

Read this first to save tokens. Open detailed docs only when needed.

## Flow

1. Plan first.
2. Ask 1-3 important questions if needed.
3. After approval, create with tools.
4. Use one large `apply_operations` call where practical.
5. Run `validate_layout` before export.
6. Fix accidental overlap, out-of-frame layers, or invalid geometry.
7. Export editable JSON and PNG/JPEG preview.
8. Revise once if the design looks generic.

## Required Design Knowledge

Use these compact references:

- `docs/DRIBBBLE_COMPONENT_PATTERNS.md` for modern designer patterns.
- `docs/STYLE_PRESETS.md` for Stitch/Dribbble/Lovable quality modes.
- `docs/PLATFORM_DESIGN_LANGUAGES.md` for Android/iOS style.
- `docs/UI_ELEMENT_RECIPES.md` only when building precise components.

Never browse or open Dribbble, Lovable, Stitch, or other inspiration sites for UI generation. Use only the local design knowledge packaged in `amanXDtool`.

Exception: agents may open official Google Material Design documentation or official Apple Human Interface Guidelines when the user asks for Android, Material, Google, iOS, Apple, iPhone, or iPad platform accuracy.

## Tool Pattern

- Prefer high-level tools first:
  - `create_landing_page`
  - `create_mobile_screen`
  - `create_dashboard`
  - `create_asset_pack`
- Use low-level tools only for refinement:
- `create_project`
- `apply_operations`
- `list_icons`
- `add_icon`
- `add_image_fill_shape`
- `group_elements`
- `align_elements`
- `distribute_elements`
- `export_frame_image`
- `export_region_image`
- `export_project_json`
- `validate_layout`

## Quality Rule

The result should look like a polished product shot or app-builder preview, not a wireframe.

Use realistic content, strong hierarchy, precise spacing, grouped components, image-filled shapes, and meaningful icons.

Never hand off a design with accidental overlapping UI. Intentional containment is allowed, such as text inside a card or a badge on an image, but peer cards, buttons, rows, panels, and nav items must not collide.

Use image viewing/reading tools only when the user asks to view, inspect, or visually review generated assets. Otherwise report file paths without opening previews.
