# amanXDtool Tool API

The tool server is local and MCP-style over stdio.

```powershell
node agent-tools/server.mjs
```

List tool names:

```powershell
node agent-tools/scripts/list-tools.mjs
```

## Tools

### High-Level Low-Token Tools

Use these first for normal generation. They create complete editable projects from compact briefs.

### `create_landing_page`

Create a polished landing page project using modern landing-page, marketplace, SaaS, and Dribbble-style composition patterns.

Required:

```json
{
  "name": "Food Delivery Landing",
  "brief": "Zomato-style food delivery landing page with search, category chips, restaurant cards, and app CTA"
}
```

Optional: `brandName`, `stylePreset`, `platform`, `width`, `height`, `path`.

### `create_mobile_screen`

Create a polished mobile app screen using platform-aware app UI patterns.

Required:

```json
{
  "name": "Food App Home",
  "brief": "Food delivery home screen with location search, categories, featured restaurant, and bottom nav"
}
```

Optional: `brandName`, `stylePreset`, `platform`, `width`, `height`, `path`.

### `create_dashboard`

Create a polished SaaS/admin/dashboard screen with sidebar, metrics, chart area, and activity/insight panels.

Required:

```json
{
  "name": "Analytics Dashboard",
  "brief": "SaaS analytics dashboard for orders, revenue, retention, and AI insights"
}
```

Optional: `brandName`, `stylePreset`, `platform`, `width`, `height`, `path`.

### `create_asset_pack`

Create a multi-frame image asset pack such as social preview, hero asset, feature card, and icon-style asset.

Required:

```json
{
  "name": "Launch Asset Pack",
  "brief": "Premium AI product launch visuals for website and social preview"
}
```

Optional: `brandName`, `stylePreset`, `path`.

### `validate_layout`

Check a project or frame for accidental layout mistakes before export.

Use after high-level creation and after low-level refinements.

Example:

```json
{
  "path": "projects/food-delivery.amanxd.json",
  "frameId": "frame_landing",
  "strict": false
}
```

The validator reports duplicate ids, invalid geometry, out-of-frame layers, and suspicious peer overlaps. Text inside cards, icons inside controls, and badges inside larger containers are expected containment patterns.

### Low-Level Tools

### `create_project`

Create a new editable `.amanxd.json` project. Defaults to one mobile frame when frames are omitted.

### `list_project`

Inspect pages, frames, elements, hierarchy, assets, and component metadata.

### `add_frame`

Add an artboard/frame to an existing project.

### `add_rectangle`

Add a rectangle, card, panel, input, button background, or shape mask.

### `add_ellipse`

Add a circle or ellipse for avatars, badges, and circular surfaces.

### `add_line`

Add a divider or line.

### `add_text`

Add text with typography fields including font family, size, weight, line height, letter spacing, alignment, and color.

### `add_image_fill_shape`

Add a rectangle or ellipse with a clipped image fill. Use this for screenshots, thumbnails, avatars, photos, and image assets.

### `add_icon`

Add a built-in SVG icon as an image-filled shape.

### `list_icons`

List available icon ids, names, and categories.

### `group_elements`

Group top-level sibling elements while preserving visual positions.

### `align_elements`

Align elements left, center, right, top, middle, or bottom. For multiple elements, default scope is selection bounds. For one element, frame bounds are used.

Example:

```json
{
  "frameId": "frame_home",
  "elementIds": ["card_1", "card_2"],
  "alignment": "left",
  "scope": "selection"
}
```

### `distribute_elements`

Distribute three or more elements evenly horizontally or vertically.

Example:

```json
{
  "frameId": "frame_home",
  "elementIds": ["card_1", "card_2", "card_3"],
  "direction": "horizontal"
}
```

### `update_element`

Patch geometry, style, content, image source, visibility, locking, export marker, or children.

### `apply_operations`

Run many creation/edit operations in one call. Use this for complex UI generation.

Supported operations:

- `add_frame`
- `add_rectangle`
- `add_ellipse`
- `add_line`
- `add_text`
- `add_image_fill_shape`
- `add_icon`
- `group_elements`
- `align_elements`
- `distribute_elements`
- `update_element`

### `export_frame_image`

Render one frame/artboard to PNG or JPEG. Use optional `region` to export a specific area inside the frame.

Default output:

```text
exports/frame.png
```

Region example:

```json
{
  "frameId": "frame_landing",
  "region": { "x": 80, "y": 500, "width": 620, "height": 320 },
  "outputPath": "exports/search-section.png"
}
```

### `export_region_image`

Render a specific rectangular board area to PNG or JPEG.

Use this when the user asks to export a selected section, card, crop, hero area, or particular board area.

Example:

```json
{
  "frameId": "frame_landing",
  "x": 80,
  "y": 500,
  "width": 620,
  "height": 320,
  "outputPath": "exports/search-section.png",
  "format": "png"
}
```

### `export_project_json`

Return the full editable project JSON.

## Output Locations

Editable projects:

```text
projects/
```

Image assets:

```text
exports/
```

## Viewing Generated Assets

Agents should not open or view generated images automatically. Use image reading/viewing tools only when the user asks to view, inspect, compare, or visually review the generated asset.
