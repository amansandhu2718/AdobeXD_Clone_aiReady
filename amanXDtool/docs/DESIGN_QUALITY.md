# Design Quality Playbook

Use this before creating any amanXDtool UI or image asset.

The goal is not only to create valid files. The goal is to create designs that feel polished, intentional, and useful.

## Target Quality Mode

When the user says "make it like Stitch", "Dribbble", "Lovable", "modern AI app builder", or asks for a beautiful/elegant/creative design, use **High-Fidelity Concept Mode**.

High-Fidelity Concept Mode means:

- Generate a design that looks like a polished product concept, not a rough wireframe.
- Use a distinctive visual idea: composition, imagery, contrast, layout rhythm, or brand system.
- Create a screen that could be shown in a portfolio, product pitch, or app builder preview.
- Prefer complete sections/states over isolated components.
- Export a preview image and keep the editable project.

## Inspiration Models

Do not copy any proprietary UI exactly. Use these as quality references:

### Google Stitch-Like

Use when the user wants fast AI-generated product concepts.

- Create high-fidelity UI from natural language with sensible assumptions.
- Produce one complete usable screen, not only fragments.
- Include theme choices: colors, typography, spacing, and component style.
- If time allows, create 2-3 visual variants as separate frames.
- Make the frame easy to edit later.

### Dribbble-Like

Use when the user wants visually impressive inspiration.

- Strong art direction and memorable first impression.
- More expressive composition, premium spacing, and crafted details.
- Use realistic cards, badges, mock data, imagery, and icon accents.
- Favor beautiful hierarchy over maximum feature completeness.
- Use visual storytelling: hero subject, supporting proof, and polished detail clusters.

### Lovable-Like

Use when the user wants a fast app/product mockup.

- Make the design feel like a real shippable app screen.
- Include practical UI states: search, filters, CTA, cards, nav, metrics, forms, or lists.
- Keep layout implementation-friendly and responsive-minded.
- Use clear naming and reusable groups so another agent can turn it into code.

## Mandatory Generation Pipeline

For any high-quality prompt, do this before final response:

1. Interpret the prompt into a compact design brief.
2. Choose one primary inspiration model: Stitch-like, Dribbble-like, Lovable-like, or a blend.
3. Define a visual system:
   - palette
   - type scale
   - spacing scale
   - radius/elevation style
   - imagery/icon style
4. Present a short plan and ask concise questions for missing important choices.
5. Start creating only after the user answers, approves the plan, or says to use your judgement.
6. Create at least one full frame.
7. For open-ended creative prompts, create 2-3 variant frames when practical:
   - safe polished variant
   - expressive/Dribbble variant
   - product-ready/Lovable variant
8. Export the best frame as PNG/JPEG.
9. Self-critique against the quality checklist.
10. Revise once if it looks generic, sparse, or misaligned.

Do not report completion after only creating a basic rectangle/text layout.

## Quality Standard

Every generated design should have:

- A clear visual concept, not a generic layout.
- Strong hierarchy: one dominant focal area, supporting sections, and quiet details.
- Consistent spacing based on a simple scale.
- A small, deliberate color palette.
- Typography with contrast between display, headings, body, labels, and metadata.
- Realistic UI density for the target product type.
- Icons and image-filled shapes where they improve meaning.
- Exported previews that are presentation-worthy.

## Anti-Generic Rules

Avoid these common low-quality patterns:

- Plain white page with a centered heading and three equal cards.
- Random gradients without brand purpose.
- Placeholder labels like "Feature 1" or "Lorem ipsum".
- Too many low-contrast gray boxes.
- Every element using the same radius, shadow, size, and color.
- No imagery in consumer, food, travel, real estate, portfolio, or ecommerce designs.
- No realistic data in dashboards.
- Icons placed without alignment or meaning.
- Exporting before reviewing composition.

Replace them with:

- Realistic section names and sample content.
- One memorable hero composition.
- At least one image-filled visual element where the category benefits from imagery.
- Deliberate asymmetry or hierarchy.
- Repeated but varied cards with realistic content.
- One accent moment, such as a featured card, stat pill, mock device, map/search block, or product preview.

## Before Creating

Infer these from the user prompt:

- Product category
- Target audience
- Primary conversion or screen goal
- Mood and brand direction
- Device/screen size
- Required export type

If missing, make tasteful assumptions. Ask only if the missing value blocks creation.

## Prompt Interpretation Examples

"Zomato clone landing page" should become:

- Style: Playful Consumer + Dribbble-like polish + Lovable-like practicality.
- Palette: appetite red, warm off-white, charcoal text, subtle green success accent.
- Layout: food-delivery header, location/search hero, restaurant cards, category row, app promo/offer section.
- Imagery: food/restaurant image-filled cards.
- Export: landing page PNG and editable project JSON.

"AI SaaS dashboard" should become:

- Style: Dense Productive + Technical Futuristic.
- Palette: quiet neutral shell, sharp accent, restrained dark/light contrast.
- Layout: sidebar, metrics, chart panel, activity table, insight card.
- Data: realistic metrics and labels.
- Export: dashboard preview PNG and editable project JSON.

"Portfolio hero" should become:

- Style: Editorial Premium + Dribbble-like composition.
- Palette: restrained neutral plus one unexpected accent.
- Layout: large name/title, work preview collage, availability CTA, trust indicators.
- Export: hero image PNG and editable project JSON.

## Choose A Creative Direction

Pick one direction before tool calls:

### Editorial Premium

- Spacious layout
- Large confident type
- Restrained palette
- High-quality imagery
- Few but meaningful sections

Use for luxury, portfolio, creator, food, travel, wellness, and brand pages.

### Dense Productive

- Compact information layout
- Clear tables, cards, filters, and controls
- Muted surfaces with accent highlights
- Fast scanning and repeated use

Use for SaaS dashboards, CRMs, admin panels, analytics, finance, and operations.

### Playful Consumer

- Rounded forms
- Bright accents
- Friendly illustration/image cards
- Motion-like layering and lively hierarchy

Use for delivery, learning, events, social, fitness, and consumer apps.

### Technical Futuristic

- High contrast
- Monospace or geometric accents
- Data panels, diagrams, glow used sparingly
- Sharp alignment and strong rhythm

Use for AI, devtools, cybersecurity, infrastructure, and data products.

### Elegant Minimal

- Quiet background
- Very strong typography
- Few surfaces
- Precise spacing
- Subtle borders and almost no decoration

Use for premium SaaS, agencies, portfolios, finance, legal, productivity, and studio websites.

### Marketplace Rich

- Search-first or browsing-first layout
- Category chips
- Product/listing cards with real metadata
- Promotional offer surfaces
- Ratings, price, tags, and delivery/status signals

Use for food delivery, ecommerce, real estate, jobs, events, travel, and local services.

## Layout Recipes

### Landing Page

Use a full first viewport design:

- Header with logo, nav, and primary action.
- Hero with one strong headline, useful subcopy, search/input/action if relevant.
- Visual proof area: product cards, app mockup, restaurant cards, dashboard preview, or image collage.
- Trust/social proof row.
- Feature or category section visible below the hero.

Do not make a plain centered hero with three generic cards unless the prompt asks for something minimal.

High-fidelity landing pages should include at least five of these:

- branded header
- primary CTA
- secondary CTA or search
- visual hero object
- proof metric or social proof
- category/listing/product cards
- feature section
- offer/promo strip
- footer hint or next-section preview

### Mobile App Screen

Use realistic mobile structure:

- Status-safe top spacing.
- Header/search/action area.
- Primary content card/list/grid.
- Bottom navigation if it is an app home screen.
- At least one meaningful empty/loading/active state detail when useful.

### Dashboard

Use dashboard density:

- Sidebar or top navigation.
- Metric cards.
- Main chart/table/work area.
- Secondary insight panel.
- Filters/actions with clear hierarchy.

Avoid oversized marketing-style hero sections in operational tools.

High-fidelity dashboards should include:

- realistic metric names and values
- chart-like visual structure
- active nav state
- useful filters or date range control
- at least one secondary panel with insight/activity/status

### Asset / Hero Image

Make the composition work as an exported image:

- Strong central subject.
- Balanced negative space.
- Text readable at thumbnail size.
- No editor UI, guides, or selection outlines.
- Use frame export, not screenshots of the editor.

## Visual Tokens

Use a simple token plan in every design:

- Spacing: 4, 8, 12, 16, 24, 32, 48, 64
- Radius: 8 for controls, 12-16 for cards, 24-32 for hero surfaces
- Type scale: 12, 14, 16, 20, 24, 32, 44, 56
- Shadows: subtle; use one elevation family
- Borders: low-contrast, usually 1px

For Dribbble-like concepts, increase visual contrast through scale and composition rather than adding many colors.

For Lovable-like app mockups, keep tokens implementation-friendly and reusable.

For Stitch-like variants, make each frame visibly different in palette/composition while preserving the same product goal.

## Color Rules

- Use one brand color, one accent color, neutrals, and semantic colors only when needed.
- Avoid making everything the same hue.
- Ensure text contrast is readable.
- For food delivery, use warm appetite colors but keep enough white/neutral space.
- For SaaS, keep color quieter and reserve accent color for state/action.

## Typography Rules

- Use no more than two font families.
- Use font weight and size for hierarchy before adding extra colors.
- Keep labels small and crisp.
- Do not use long paragraphs in UI mockups.
- Align text consistently within sections.

## Image And Icon Rules

- Use `add_image_fill_shape` for photos, thumbnails, avatars, and screenshots.
- Images should be masked inside rectangles or ellipses.
- Use `list_icons` and `add_icon` for functional icons.
- Icons should be aligned to text and sized consistently.

## Agent Creation Pattern

For a complex design:

1. Create the project and frame.
2. Choose the target quality mode and inspiration model.
3. Define tokens in your own reasoning before operations.
4. Use `apply_operations` to place the major layout.
5. Add icons and image-filled shapes.
6. Group related UI parts.
7. Align and distribute major groups.
8. Export a preview image.
9. Review against the checklist.
10. If weak, revise before reporting completion.

## Final Quality Checklist

Before handing off, verify:

- There is a clear focal point.
- Layout does not look like a wireframe unless requested.
- Spacing is consistent.
- Typography has at least three hierarchy levels.
- Buttons and inputs look usable.
- Icons/images support meaning.
- The design matches the requested category.
- Exported PNG/JPEG exists when requested.
- File paths are reported.

If the result is generic, add one more creative pass before final response.
