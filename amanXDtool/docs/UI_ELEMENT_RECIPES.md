# UI Element Recipes

Use this to create precise UI elements with amanXDtool operations.

Every UI element should be built from:

- a containing shape
- text layers with clear typography
- icons from `list_icons` / `add_icon`
- image fills via `add_image_fill_shape`
- groups for semantic parts
- align/distribute operations for polish

Do not leave ungrouped loose parts for a button, card, nav item, input, list row, or tab.

## Universal Rules

- Name layers semantically: `Primary CTA`, `Search Field`, `Restaurant Card`.
- Use consistent dimensions across repeated elements.
- Use 44px minimum touch target for iOS and 48px for Android/Material.
- Text should be vertically centered in buttons/inputs.
- Icons should align to text baseline or component center.
- Related parts should be grouped immediately.
- Use realistic content, never `Feature 1` or `Lorem ipsum`.

## Button

Build with:

- rectangle background
- text label
- optional icon
- grouped as one element

Material button:

- Height: 40-48
- Radius: 20-24
- Filled, tonal, or outlined style
- Label: 14-16, medium/semi-bold

iOS button:

- Height: 44-50
- Radius: capsule or 12-16
- Label: 15-17, medium/semi-bold
- Prefer clear text button or filled capsule CTA

Quality checks:

- Label has enough contrast.
- Button is not too small.
- Icon spacing is 8-10px from label.
- Primary button is visually strongest.

## Search Field

Build with:

- rounded rectangle input surface
- search icon
- placeholder text
- optional location/filter icon

Material search:

- Height: 48-56
- Radius: 24-28
- Container color: surface/container
- Leading search icon

iOS search:

- Height: 36-44
- Radius: 10-14
- Light grouped background
- Placeholder in muted text

Quality checks:

- Search field is large enough to be the obvious action when search is central.
- Icon and text are vertically centered.
- Placeholder is specific: `Search biryani, pizza, cafes`.

## Card

Build with:

- rectangle background
- optional image fill
- heading text
- metadata text
- badge/rating/price/status chips where useful
- grouped card

Material card:

- Radius: 16
- Surface/container fill
- Optional subtle outline/elevation

iOS card:

- Radius: 16-22
- Subtle grouped background
- Lower shadow, cleaner separators

Quality checks:

- Card content has padding 12-20.
- Repeated cards have consistent dimensions.
- Metadata is realistic.
- Image is clipped inside shape.

## Chip / Pill

Build with:

- small rounded rectangle or capsule
- short text
- optional icon

Material chip:

- Height: 32-40
- Radius: 8-20 depending style
- Outline or tonal fill

iOS chip:

- Height: 30-36
- Capsule shape
- Muted grouped fill

Quality checks:

- Text is short.
- Active chip is clearly different.
- Chips align in a row with 8-12 spacing.

## Top App Bar / Header

Build with:

- full-width container or transparent header group
- title/logo
- nav/actions
- optional search/location field

Material:

- Small top app bar: 64 height
- Medium/large top app bar when title needs emphasis
- Action icons 24 inside 48 touch zones

iOS:

- Respect safe area.
- Large title for app home/list screens.
- Compact nav for detail screens.
- Text buttons or icon buttons on trailing side.

Quality checks:

- Active location/page is clear.
- Header does not crowd hero/content.
- Controls have proper tap size.

## Bottom Navigation / Tab Bar

Build with:

- background rectangle
- 3-5 nav item groups
- each item: icon + label
- active indicator

Material:

- Height: 72-88
- Active item uses pill/container or stronger color.

iOS:

- Height: 72-84 plus safe-area feel
- Active item uses system accent color.
- Labels are 10-12.

Quality checks:

- Exactly one active item.
- Icons are consistent size.
- Items are evenly distributed.

## List Row

Build with:

- row container or separator
- leading icon/image/avatar
- primary text
- secondary text
- trailing value/action

Material:

- Height: 56-72
- Leading icon/avatar inside 40-48 area.

iOS:

- Height: 48-64
- Grouped list surface and subtle separators.

Quality checks:

- Text is aligned.
- Secondary metadata is muted.
- Repeated rows have rhythm.

## Form Input

Build with:

- rounded rectangle or underline field
- label
- value/placeholder
- optional helper/error text

Material:

- Filled or outlined text field.
- Height: 56.
- Label can float visually if needed.

iOS:

- Grouped form row or rounded input.
- Height: 44-52.
- Clear label/value hierarchy.

Quality checks:

- Label is not confused with placeholder.
- Error/success state uses semantic color sparingly.

## Dashboard Metric Card

Build with:

- card background
- label
- large value
- trend chip/icon
- optional tiny chart

Quality checks:

- Values are realistic.
- Trend color has semantic meaning.
- Cards align and distribute evenly.

## Food / Marketplace Card

Build with:

- image-filled shape
- title
- cuisine/category
- rating pill
- delivery/time/price metadata
- offer badge when useful

Quality checks:

- Image is prominent.
- Rating/time/price are readable.
- Cards do not look identical; vary content and imagery.

## Modal / Sheet

Build with:

- overlay or page dim when needed
- sheet/card container
- title
- content rows
- primary/secondary actions

Material:

- Dialog or bottom sheet with 24-28 radius.

iOS:

- Sheet with rounded top corners and clear drag handle when useful.

Quality checks:

- Action hierarchy is clear.
- Sheet content has comfortable padding.

## Agent Build Order

For every repeated component:

1. Create one precise component.
2. Group it.
3. Duplicate or recreate variants with consistent dimensions.
4. Align/distribute repeated groups.
5. Add realistic content differences.
6. Export only after visual review.
