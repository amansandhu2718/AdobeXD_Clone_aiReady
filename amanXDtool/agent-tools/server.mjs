#!/usr/bin/env node
import { toolDefinitions, DEFAULT_PROJECT_PATH } from './tool-definitions.mjs'
import { exportFrameImage } from './render-utils.mjs'
import {
  baseStyle,
  createElement,
  createId,
  findFrame,
  flattenElements,
  iconDataUrl,
  icons,
  mapElements,
  readProject,
  writeProject,
} from './project-utils.mjs'

let buffer = Buffer.alloc(0)

function textResult(data) {
  return {
    content: [
      {
        type: 'text',
        text: typeof data === 'string' ? data : JSON.stringify(data, null, 2),
      },
    ],
  }
}

function send(message) {
  const payload = Buffer.from(JSON.stringify(message), 'utf8')
  process.stdout.write(`Content-Length: ${payload.length}\r\n\r\n`)
  process.stdout.write(payload)
}

function createProject(input) {
  const frames = input.frames?.length
    ? input.frames
    : [{ id: 'frame_home', name: 'Home', x: 80, y: 80, width: 390, height: 844, background: '#ffffff' }]
  return {
    schemaVersion: 1,
    project: {
      id: input.id ?? createId('project'),
      name: input.name,
      updatedAt: new Date().toISOString(),
      pages: [
        {
          id: 'page_main',
          name: 'Main',
          frames: frames.map((frame, index) => ({
            id: frame.id ?? createId('frame'),
            name: frame.name ?? `Artboard ${index + 1}`,
            x: frame.x ?? 80 + index * 460,
            y: frame.y ?? 80,
            width: frame.width ?? 390,
            height: frame.height ?? 844,
            background: frame.background ?? '#ffffff',
            elements: [],
          })),
        },
      ],
      assets: { colors: [], textStyles: [], images: [], components: [] },
      prototypeLinks: [],
    },
  }
}

function slug(value) {
  return String(value ?? 'amanxd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

function radius(value) {
  return { topLeft: value, topRight: value, bottomRight: value, bottomLeft: value }
}

function shadow(opacity = 0.12, y = 16, blur = 40) {
  return { enabled: true, color: '#111827', x: 0, y, blur, opacity }
}

function svgImage(label, bg = '#fee2e2', fg = '#991b1b') {
  const safeLabel = String(label).replace(/[<>&"]/g, '')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${bg}"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs><rect width="800" height="600" rx="72" fill="url(#g)"/><circle cx="650" cy="120" r="120" fill="${fg}" opacity=".12"/><circle cx="170" cy="470" r="150" fill="${fg}" opacity=".1"/><text x="70" y="330" font-family="Inter,Arial" font-size="58" font-weight="800" fill="${fg}">${safeLabel}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function textElement(id, name, content, x, y, width, height, typography = {}) {
  const element = createElement(
    'text',
    { id, name, content, x, y, width, height },
    {
      fill: 'transparent',
      stroke: { enabled: false, color: '#000000', width: 0 },
      typography: {
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.2,
        letterSpacing: 0,
        align: 'left',
        color: '#111827',
        ...typography,
      },
    },
  )
  element.content = content
  return element
}

function rectElement(id, name, x, y, width, height, style = {}) {
  return createElement('rectangle', { id, name, x, y, width, height }, style)
}

function imageElement(id, name, src, x, y, width, height, style = {}) {
  const element = createElement('rectangle', { id, name, x, y, width, height }, {
    imageFit: 'cover',
    imageCrop: { x: 0, y: 0, scale: 1 },
    ...style,
  })
  element.src = src
  return element
}

function iconElement(id, iconId, x, y, size, color = '#111827') {
  const element = rectElement(id, `${iconId} Icon`, x, y, size, size, {
    fill: 'transparent',
    stroke: { enabled: false, color: '#000000', width: 0 },
    cornerRadius: radius(0),
    imageFit: 'contain',
    imageCrop: { x: 0, y: 0, scale: 1 },
  })
  element.src = iconDataUrl(iconId, color)
  return element
}

function brand(input, fallback) {
  return input.brandName || input.name || fallback
}

function makeLandingPageProject(input) {
  const width = input.width ?? 1440
  const height = input.height ?? 1200
  const name = input.name
  const brandName = brand(input, 'AmanXD')
  const project = createProject({
    name,
    frames: [{ id: 'frame_landing', name: 'Landing Page', x: 80, y: 80, width, height, background: '#fffaf7' }],
  })
  const frame = project.project.pages[0].frames[0]
  const accent = input.stylePreset?.includes('saas') ? '#2563eb' : '#ef4444'
  const dark = '#151515'
  frame.elements = [
    rectElement('nav_bg', 'Header Surface', 56, 32, width - 112, 72, { fill: '#ffffff', stroke: { enabled: true, color: '#f0e7df', width: 1 }, cornerRadius: radius(28), shadow: shadow(0.08, 8, 24) }),
    textElement('logo', 'Logo', brandName, 88, 55, 180, 28, { fontSize: 22, fontWeight: 800, color: dark }),
    textElement('nav_items', 'Navigation Items', 'Explore    Partners    Offers    Download', width - 620, 58, 390, 24, { fontSize: 14, fontWeight: 600, color: '#57534e' }),
    rectElement('nav_cta_bg', 'Header CTA', width - 190, 46, 104, 44, { fill: dark, stroke: { enabled: false, color: dark, width: 0 }, cornerRadius: radius(22) }),
    textElement('nav_cta_text', 'Header CTA Label', 'Get app', width - 164, 59, 70, 18, { fontSize: 14, fontWeight: 700, color: '#ffffff', align: 'center' }),
    textElement('hero_eyebrow', 'Hero Eyebrow', 'Fresh, fast, beautifully simple', 88, 172, 360, 24, { fontSize: 15, fontWeight: 800, color: accent }),
    textElement('hero_title', 'Hero Title', `${brandName} for modern everyday ordering`, 88, 214, 660, 158, { fontSize: 62, fontWeight: 900, lineHeight: 1.02, color: dark }),
    textElement('hero_copy', 'Hero Copy', input.brief || 'Discover local favorites, compare delivery times, and order from polished restaurant cards built for quick decisions.', 92, 390, 560, 72, { fontSize: 18, fontWeight: 500, lineHeight: 1.45, color: '#57534e' }),
    rectElement('search_bg', 'Hero Search Field', 88, 500, 610, 64, { fill: '#ffffff', stroke: { enabled: true, color: '#f0e7df', width: 1 }, cornerRadius: radius(32), shadow: shadow(0.08, 10, 30) }),
    iconElement('search_icon', 'icon-search', 112, 520, 24, accent),
    textElement('search_text', 'Search Placeholder', 'Search dishes, restaurants, or cuisines', 150, 520, 330, 24, { fontSize: 16, fontWeight: 600, color: '#78716c' }),
    rectElement('search_cta_bg', 'Search CTA', 548, 508, 138, 48, { fill: accent, stroke: { enabled: false, color: accent, width: 0 }, cornerRadius: radius(24) }),
    textElement('search_cta_text', 'Search CTA Label', 'Find food', 576, 523, 90, 20, { fontSize: 15, fontWeight: 800, color: '#ffffff', align: 'center' }),
    imageElement('hero_image', 'Hero Food Image Card', svgImage('Hot picks', '#fee2e2', accent), width - 620, 166, 470, 350, { fill: '#fff1f2', stroke: { enabled: false, color: '#fff1f2', width: 0 }, cornerRadius: radius(36), shadow: shadow(0.16, 28, 70) }),
    rectElement('floating_card', 'Floating Rating Card', width - 620, 548, 260, 112, { fill: '#ffffff', stroke: { enabled: true, color: '#f0e7df', width: 1 }, cornerRadius: radius(28), shadow: shadow(0.12, 18, 42) }),
    textElement('floating_title', 'Floating Card Title', '4.9 rated restaurants', width - 594, 575, 200, 24, { fontSize: 18, fontWeight: 800, color: dark }),
    textElement('floating_meta', 'Floating Card Meta', '32 min avg delivery nearby', width - 594, 609, 200, 22, { fontSize: 14, fontWeight: 600, color: '#78716c' }),
    ...['Biryani', 'Pizza', 'Sushi', 'Desserts', 'Healthy'].flatMap((label, index) => [
      rectElement(`chip_${index}`, `${label} Chip`, 88 + index * 132, 620, 112, 42, { fill: index === 0 ? accent : '#ffffff', stroke: { enabled: true, color: index === 0 ? accent : '#f0e7df', width: 1 }, cornerRadius: radius(21) }),
      textElement(`chip_text_${index}`, `${label} Chip Label`, label, 112 + index * 132, 633, 70, 18, { fontSize: 14, fontWeight: 800, color: index === 0 ? '#ffffff' : '#57534e', align: 'center' }),
    ]),
    ...['Tandoori House', 'Urban Bowls', 'Cafe Bloom'].flatMap((label, index) => {
      const x = 88 + index * 390
      return [
        rectElement(`card_${index}`, `${label} Card`, x, 730, 340, 250, { fill: '#ffffff', stroke: { enabled: true, color: '#f0e7df', width: 1 }, cornerRadius: radius(28), shadow: shadow(0.08, 14, 36) }),
        imageElement(`card_img_${index}`, `${label} Image`, svgImage(label, ['#fee2e2', '#dcfce7', '#e0f2fe'][index], accent), x + 18, 748, 304, 124, { fill: '#f8fafc', stroke: { enabled: false, color: '#ffffff', width: 0 }, cornerRadius: radius(22) }),
        textElement(`card_title_${index}`, `${label} Title`, label, x + 24, 892, 210, 24, { fontSize: 20, fontWeight: 850, color: dark }),
        textElement(`card_meta_${index}`, `${label} Meta`, '4.8 rating  •  25-35 min  •  20% off', x + 24, 928, 270, 20, { fontSize: 14, fontWeight: 650, color: '#78716c' }),
      ]
    }),
  ]
  return project
}

function makeMobileScreenProject(input) {
  const width = input.width ?? 390
  const height = input.height ?? 844
  const brandName = brand(input, 'Daily')
  const accent = input.platform === 'android' ? '#6750a4' : '#0a84ff'
  const project = createProject({
    name: input.name,
    frames: [{ id: 'frame_mobile_home', name: 'Mobile Home', x: 80, y: 80, width, height, background: '#f8fafc' }],
  })
  const frame = project.project.pages[0].frames[0]
  frame.elements = [
    textElement('mobile_greeting', 'Greeting', 'Good morning', 24, 54, 180, 22, { fontSize: 14, fontWeight: 700, color: '#64748b' }),
    textElement('mobile_title', 'Screen Title', brandName, 24, 82, 230, 38, { fontSize: 32, fontWeight: 900, color: '#0f172a' }),
    rectElement('avatar_bg', 'Avatar', 326, 58, 42, 42, { fill: '#ffffff', stroke: { enabled: true, color: '#e2e8f0', width: 1 }, cornerRadius: radius(21), shadow: shadow(0.06, 8, 18) }),
    iconElement('avatar_icon', 'icon-user', 335, 67, 24, accent),
    rectElement('mobile_search', 'Search Field', 24, 136, 342, 52, { fill: '#ffffff', stroke: { enabled: true, color: '#e2e8f0', width: 1 }, cornerRadius: radius(input.platform === 'android' ? 26 : 14), shadow: shadow(0.05, 8, 18) }),
    iconElement('mobile_search_icon', 'icon-search', 42, 150, 22, accent),
    textElement('mobile_search_text', 'Search Placeholder', 'Search anything', 76, 153, 180, 20, { fontSize: 15, fontWeight: 650, color: '#94a3b8' }),
    rectElement('featured_card', 'Featured Card', 24, 216, 342, 178, { fill: accent, stroke: { enabled: false, color: accent, width: 0 }, cornerRadius: radius(28), shadow: shadow(0.16, 18, 42) }),
    textElement('featured_label', 'Featured Label', 'Today', 48, 244, 90, 20, { fontSize: 13, fontWeight: 800, color: '#ede9fe' }),
    textElement('featured_title', 'Featured Title', input.brief || 'A polished mobile concept with real app structure', 48, 276, 220, 64, { fontSize: 25, fontWeight: 900, lineHeight: 1.12, color: '#ffffff' }),
    rectElement('featured_cta', 'Featured CTA', 48, 344, 112, 36, { fill: '#ffffff', stroke: { enabled: false, color: '#ffffff', width: 0 }, cornerRadius: radius(18) }),
    textElement('featured_cta_text', 'Featured CTA Text', 'Explore', 72, 354, 66, 18, { fontSize: 13, fontWeight: 850, color: accent, align: 'center' }),
    ...['Popular', 'Nearby', 'Offers'].flatMap((label, index) => [
      rectElement(`mobile_chip_${index}`, `${label} Chip`, 24 + index * 116, 426, 98, 36, { fill: index === 0 ? '#0f172a' : '#ffffff', stroke: { enabled: true, color: '#e2e8f0', width: 1 }, cornerRadius: radius(18) }),
      textElement(`mobile_chip_text_${index}`, `${label} Chip Text`, label, 42 + index * 116, 437, 62, 16, { fontSize: 13, fontWeight: 800, color: index === 0 ? '#ffffff' : '#64748b', align: 'center' }),
    ]),
    ...['Smart recommendation', 'Saved favorite', 'Trending now'].flatMap((label, index) => {
      const y = 492 + index * 84
      return [
        rectElement(`row_${index}`, `${label} Row`, 24, y, 342, 68, { fill: '#ffffff', stroke: { enabled: true, color: '#e2e8f0', width: 1 }, cornerRadius: radius(20) }),
        imageElement(`row_img_${index}`, `${label} Thumb`, svgImage(label, ['#dbeafe', '#fce7f3', '#dcfce7'][index], accent), 38, y + 12, 44, 44, { fill: '#f8fafc', stroke: { enabled: false, color: '#ffffff', width: 0 }, cornerRadius: radius(14) }),
        textElement(`row_title_${index}`, `${label} Title`, label, 96, y + 14, 180, 20, { fontSize: 15, fontWeight: 850, color: '#0f172a' }),
        textElement(`row_meta_${index}`, `${label} Meta`, 'Updated just now', 96, y + 38, 160, 18, { fontSize: 12, fontWeight: 650, color: '#94a3b8' }),
      ]
    }),
    rectElement('bottom_nav', 'Bottom Navigation', 24, height - 86, 342, 62, { fill: '#ffffff', stroke: { enabled: true, color: '#e2e8f0', width: 1 }, cornerRadius: radius(input.platform === 'ios' ? 24 : 31), shadow: shadow(0.1, 12, 30) }),
    iconElement('nav_home', 'icon-home', 64, height - 68, 24, accent),
    iconElement('nav_search', 'icon-search', 144, height - 68, 24, '#94a3b8'),
    iconElement('nav_heart', 'icon-heart', 224, height - 68, 24, '#94a3b8'),
    iconElement('nav_user', 'icon-user', 304, height - 68, 24, '#94a3b8'),
  ]
  return project
}

function makeDashboardProject(input) {
  const width = input.width ?? 1440
  const height = input.height ?? 900
  const brandName = brand(input, 'AmanDash')
  const accent = input.stylePreset?.includes('ai') ? '#7c3aed' : '#2563eb'
  const project = createProject({
    name: input.name,
    frames: [{ id: 'frame_dashboard', name: 'Dashboard', x: 80, y: 80, width, height, background: '#f8fafc' }],
  })
  const frame = project.project.pages[0].frames[0]
  frame.elements = [
    rectElement('sidebar', 'Sidebar', 24, 24, 236, height - 48, { fill: '#0f172a', stroke: { enabled: false, color: '#0f172a', width: 0 }, cornerRadius: radius(28) }),
    textElement('dash_logo', 'Dashboard Logo', brandName, 52, 58, 150, 30, { fontSize: 24, fontWeight: 900, color: '#ffffff' }),
    ...['Overview', 'Analytics', 'Customers', 'Reports'].flatMap((label, index) => [
      rectElement(`nav_${index}`, `${label} Nav`, 44, 128 + index * 56, 192, 42, { fill: index === 0 ? accent : 'transparent', stroke: { enabled: false, color: accent, width: 0 }, cornerRadius: radius(14) }),
      textElement(`nav_text_${index}`, `${label} Nav Text`, label, 70, 140 + index * 56, 120, 18, { fontSize: 14, fontWeight: 800, color: index === 0 ? '#ffffff' : '#94a3b8' }),
    ]),
    textElement('dash_title', 'Dashboard Title', 'Performance overview', 300, 54, 360, 40, { fontSize: 34, fontWeight: 900, color: '#0f172a' }),
    textElement('dash_subtitle', 'Dashboard Subtitle', input.brief || 'Track growth, engagement, and operational health from one polished dashboard.', 302, 102, 560, 24, { fontSize: 15, fontWeight: 600, color: '#64748b' }),
    rectElement('top_search', 'Dashboard Search', width - 430, 52, 360, 48, { fill: '#ffffff', stroke: { enabled: true, color: '#e2e8f0', width: 1 }, cornerRadius: radius(18) }),
    iconElement('top_search_icon', 'icon-search', width - 410, 64, 22, '#94a3b8'),
    textElement('top_search_text', 'Dashboard Search Text', 'Search reports', width - 376, 66, 140, 18, { fontSize: 14, fontWeight: 650, color: '#94a3b8' }),
    ...['Revenue', 'Orders', 'Conversion', 'Retention'].flatMap((label, index) => {
      const x = 300 + index * 260
      return [
        rectElement(`metric_${index}`, `${label} Metric Card`, x, 162, 226, 130, { fill: '#ffffff', stroke: { enabled: true, color: '#e2e8f0', width: 1 }, cornerRadius: radius(22), shadow: shadow(0.06, 10, 26) }),
        textElement(`metric_label_${index}`, `${label} Label`, label, x + 22, 184, 140, 18, { fontSize: 13, fontWeight: 800, color: '#64748b' }),
        textElement(`metric_value_${index}`, `${label} Value`, ['$82.4k', '12,840', '8.7%', '74%'][index], x + 22, 216, 150, 34, { fontSize: 30, fontWeight: 900, color: '#0f172a' }),
        textElement(`metric_trend_${index}`, `${label} Trend`, '+12.8% this month', x + 22, 258, 160, 18, { fontSize: 12, fontWeight: 800, color: '#16a34a' }),
      ]
    }),
    rectElement('chart_panel', 'Main Chart Panel', 300, 330, 690, 360, { fill: '#ffffff', stroke: { enabled: true, color: '#e2e8f0', width: 1 }, cornerRadius: radius(26), shadow: shadow(0.06, 12, 32) }),
    textElement('chart_title', 'Chart Title', 'Growth trend', 330, 360, 180, 26, { fontSize: 20, fontWeight: 900, color: '#0f172a' }),
    ...[180, 240, 130, 290, 220, 310, 260].map((barHeight, index) =>
      rectElement(`bar_${index}`, `Chart Bar ${index + 1}`, 360 + index * 78, 650 - barHeight, 34, barHeight, { fill: index === 5 ? accent : '#dbeafe', stroke: { enabled: false, color: accent, width: 0 }, cornerRadius: radius(17) }),
    ),
    rectElement('insight_panel', 'Insight Panel', 1030, 330, 340, 360, { fill: '#111827', stroke: { enabled: false, color: '#111827', width: 0 }, cornerRadius: radius(26), shadow: shadow(0.12, 18, 42) }),
    textElement('insight_title', 'Insight Title', 'AI insight', 1062, 366, 180, 28, { fontSize: 22, fontWeight: 900, color: '#ffffff' }),
    textElement('insight_copy', 'Insight Copy', 'Your strongest channel is repeat customers. Increase visibility for saved offers and reorder actions.', 1062, 418, 250, 88, { fontSize: 16, fontWeight: 600, lineHeight: 1.45, color: '#cbd5e1' }),
    rectElement('table_panel', 'Activity Table', 300, 724, 1070, 132, { fill: '#ffffff', stroke: { enabled: true, color: '#e2e8f0', width: 1 }, cornerRadius: radius(24) }),
    textElement('table_text', 'Activity Rows', 'Recent activity        Status        Value        Updated\nPremium plan sold      Complete      $1,280       2 min ago\nCampaign synced        Active        8.7%         12 min ago', 330, 754, 760, 84, { fontSize: 15, fontWeight: 700, lineHeight: 1.65, color: '#334155' }),
  ]
  return project
}

function makeAssetPackProject(input) {
  const brandName = brand(input, 'AmanXD')
  const project = createProject({
    name: input.name,
    frames: [
      { id: 'frame_social', name: 'Social Preview', x: 80, y: 80, width: 1200, height: 630, background: '#111827' },
      { id: 'frame_hero', name: 'Hero Asset', x: 1340, y: 80, width: 1440, height: 720, background: '#fff7ed' },
      { id: 'frame_card', name: 'Feature Card', x: 80, y: 780, width: 800, height: 600, background: '#f8fafc' },
      { id: 'frame_icon', name: 'Icon Asset', x: 940, y: 840, width: 512, height: 512, background: '#ffffff' },
    ],
  })
  const [social, hero, card, icon] = project.project.pages[0].frames
  social.elements = [
    rectElement('social_glow', 'Gradient Block', 650, 70, 420, 420, { fill: '#ef4444', stroke: { enabled: false, color: '#ef4444', width: 0 }, cornerRadius: radius(80), shadow: shadow(0.28, 28, 90) }),
    textElement('social_title', 'Social Title', brandName, 80, 150, 520, 90, { fontSize: 76, fontWeight: 950, color: '#ffffff' }),
    textElement('social_copy', 'Social Copy', input.brief || 'A polished visual asset pack generated with amanXDtool.', 86, 270, 520, 86, { fontSize: 28, fontWeight: 650, lineHeight: 1.35, color: '#cbd5e1' }),
  ]
  hero.elements = makeLandingPageProject({ ...input, name: `${input.name} Hero`, brandName, width: 1440, height: 720 }).project.pages[0].frames[0].elements.slice(0, 14)
  card.elements = [
    rectElement('feature_card', 'Feature Card', 80, 80, 640, 440, { fill: '#ffffff', stroke: { enabled: true, color: '#e2e8f0', width: 1 }, cornerRadius: radius(42), shadow: shadow(0.14, 24, 70) }),
    imageElement('feature_image', 'Feature Image', svgImage('Feature', '#dbeafe', '#2563eb'), 118, 118, 564, 220, { fill: '#dbeafe', stroke: { enabled: false, color: '#ffffff', width: 0 }, cornerRadius: radius(32) }),
    textElement('feature_title', 'Feature Title', 'Ready-to-use visual system', 124, 374, 420, 40, { fontSize: 34, fontWeight: 900, color: '#0f172a' }),
    textElement('feature_copy', 'Feature Copy', 'Editable design assets with clean groups, strong hierarchy, and export-ready previews.', 126, 428, 500, 54, { fontSize: 18, fontWeight: 600, lineHeight: 1.45, color: '#64748b' }),
  ]
  icon.elements = [
    rectElement('icon_bg', 'Icon Background', 56, 56, 400, 400, { fill: '#ef4444', stroke: { enabled: false, color: '#ef4444', width: 0 }, cornerRadius: radius(112), shadow: shadow(0.22, 30, 80) }),
    iconElement('icon_mark', 'icon-check', 176, 176, 160, '#ffffff'),
  ]
  return project
}

async function createHighLevelProject(kind, input) {
  const project =
    kind === 'landing' ? makeLandingPageProject(input)
    : kind === 'mobile' ? makeMobileScreenProject(input)
    : kind === 'dashboard' ? makeDashboardProject(input)
    : makeAssetPackProject(input)
  const defaultPath = `projects/${slug(input.name)}.amanxd.json`
  const filePath = await writeProject(project, input.path ?? defaultPath)
  const validation = validateProjectLayout(project, { strict: false })
  return {
    path: filePath,
    projectId: project.project.id,
    frames: project.project.pages[0].frames.map((frame) => ({ id: frame.id, name: frame.name, width: frame.width, height: frame.height })),
    validation,
  }
}

async function mutateProject(input, mutate) {
  const project = await readProject(input.path ?? DEFAULT_PROJECT_PATH)
  const result = mutate(project)
  const filePath = await writeProject(project, input.path ?? DEFAULT_PROJECT_PATH)
  return { path: filePath, ...result }
}

function groupElements(frame, elementIds, input) {
  const selected = []
  const selectedSet = new Set(elementIds)
  const remaining = []
  for (const element of frame.elements) {
    if (selectedSet.has(element.id)) selected.push(element)
    else remaining.push(element)
  }
  if (selected.length < 2) throw new Error('group_elements currently groups top-level siblings only')
  const left = Math.min(...selected.map((element) => element.x))
  const top = Math.min(...selected.map((element) => element.y))
  const right = Math.max(...selected.map((element) => element.x + element.width))
  const bottom = Math.max(...selected.map((element) => element.y + element.height))
  const group = {
    id: input.id ?? createId('group'),
    type: 'group',
    name: input.name ?? 'Group',
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
    rotation: 0,
    opacity: 1,
    locked: false,
    visible: true,
    style: baseStyle({ fill: 'transparent', stroke: { enabled: false, color: '#7b2fff', width: 0 } }),
    children: selected.map((element) => ({ ...element, x: element.x - left, y: element.y - top })),
  }
  frame.elements = [...remaining, group]
  return group
}

function flattenElementsWithOffset(elements, offsetX = 0, offsetY = 0) {
  return elements.flatMap((element) => {
    const absolute = { ...element, x: offsetX + element.x, y: offsetY + element.y }
    return [absolute, ...flattenElementsWithOffset(element.children ?? [], absolute.x, absolute.y)]
  })
}

function mapElementsWithOffset(elements, mapper, offsetX = 0, offsetY = 0) {
  return elements.map((element) => {
    const childOffsetX = offsetX + element.x
    const childOffsetY = offsetY + element.y
    return mapper(
      {
        ...element,
        children: element.children ? mapElementsWithOffset(element.children, mapper, childOffsetX, childOffsetY) : element.children,
      },
      offsetX,
      offsetY,
    )
  })
}

function boundsFor(elements) {
  const left = Math.min(...elements.map((element) => element.x))
  const top = Math.min(...elements.map((element) => element.y))
  const right = Math.max(...elements.map((element) => element.x + element.width))
  const bottom = Math.max(...elements.map((element) => element.y + element.height))
  return { left, top, right, bottom, centerX: left + (right - left) / 2, centerY: top + (bottom - top) / 2 }
}

function alignElements(frame, elementIds, alignment, scope = 'selection') {
  const selectedSet = new Set(elementIds)
  const selected = flattenElementsWithOffset(frame.elements).filter((element) => selectedSet.has(element.id))
  if (!selected.length) throw new Error('No matching elements to align')
  const target =
    scope === 'frame' || selected.length === 1
      ? { left: 0, top: 0, right: frame.width, bottom: frame.height, centerX: frame.width / 2, centerY: frame.height / 2 }
      : boundsFor(selected)
  const patches = new Map()
  for (const element of selected) {
    if (alignment === 'left') patches.set(element.id, { x: target.left })
    if (alignment === 'center') patches.set(element.id, { x: Math.round(target.centerX - element.width / 2) })
    if (alignment === 'right') patches.set(element.id, { x: Math.round(target.right - element.width) })
    if (alignment === 'top') patches.set(element.id, { y: target.top })
    if (alignment === 'middle') patches.set(element.id, { y: Math.round(target.centerY - element.height / 2) })
    if (alignment === 'bottom') patches.set(element.id, { y: Math.round(target.bottom - element.height) })
  }
  frame.elements = mapElementsWithOffset(frame.elements, (element, offsetX, offsetY) => {
    const patch = patches.get(element.id)
    if (!patch) return element
    return {
      ...element,
      x: patch.x === undefined ? element.x : patch.x - offsetX,
      y: patch.y === undefined ? element.y : patch.y - offsetY,
    }
  })
  return selected.map((element) => element.id)
}

function distributeElements(frame, elementIds, direction) {
  const selectedSet = new Set(elementIds)
  const selected = flattenElementsWithOffset(frame.elements).filter((element) => selectedSet.has(element.id))
  if (selected.length < 3) throw new Error('distribute_elements requires at least three matching elements')
  const sorted = [...selected].sort((a, b) => (direction === 'horizontal' ? a.x - b.x : a.y - b.y))
  const first = sorted[0]
  const last = sorted.at(-1)
  const totalSize = sorted.reduce((sum, element) => sum + (direction === 'horizontal' ? element.width : element.height), 0)
  const span = direction === 'horizontal' ? last.x + last.width - first.x : last.y + last.height - first.y
  const gap = (span - totalSize) / Math.max(1, sorted.length - 1)
  const patches = new Map()
  let cursor = direction === 'horizontal' ? first.x : first.y
  for (const element of sorted) {
    if (direction === 'horizontal') {
      patches.set(element.id, { x: Math.round(cursor) })
      cursor += element.width + gap
    } else {
      patches.set(element.id, { y: Math.round(cursor) })
      cursor += element.height + gap
    }
  }
  frame.elements = mapElementsWithOffset(frame.elements, (element, offsetX, offsetY) => {
    const patch = patches.get(element.id)
    if (!patch) return element
    return {
      ...element,
      x: patch.x === undefined ? element.x : patch.x - offsetX,
      y: patch.y === undefined ? element.y : patch.y - offsetY,
    }
  })
  return sorted.map((element) => element.id)
}

function isContained(inner, outer, padding = 0) {
  return (
    inner.x >= outer.x - padding &&
    inner.y >= outer.y - padding &&
    inner.x + inner.width <= outer.x + outer.width + padding &&
    inner.y + inner.height <= outer.y + outer.height + padding
  )
}

function overlapArea(a, b) {
  const left = Math.max(a.x, b.x)
  const top = Math.max(a.y, b.y)
  const right = Math.min(a.x + a.width, b.x + b.width)
  const bottom = Math.min(a.y + a.height, b.y + b.height)
  return Math.max(0, right - left) * Math.max(0, bottom - top)
}

function validateFrameLayout(frame, strict = false) {
  const issues = []
  const all = flattenElementsWithOffset(frame.elements).filter((element) => element.visible !== false)
  const ids = new Set()
  for (const element of all) {
    if (ids.has(element.id)) issues.push({ severity: 'error', type: 'duplicate-id', elementId: element.id })
    ids.add(element.id)
    if (element.width <= 0 || element.height <= 0) {
      issues.push({ severity: 'error', type: 'invalid-geometry', elementId: element.id, detail: 'width and height must be positive' })
    }
    if (element.x < 0 || element.y < 0 || element.x + element.width > frame.width || element.y + element.height > frame.height) {
      issues.push({ severity: strict ? 'error' : 'warning', type: 'out-of-frame', elementId: element.id, detail: `${element.name} extends outside ${frame.name}` })
    }
  }

  const peers = frame.elements.filter((element) => element.visible !== false && element.type !== 'line')
  for (let i = 0; i < peers.length; i += 1) {
    for (let j = i + 1; j < peers.length; j += 1) {
      const a = peers[i]
      const b = peers[j]
      if (isContained(a, b, 2) || isContained(b, a, 2)) continue
      if (a.type === 'text' || b.type === 'text') continue
      const area = overlapArea(a, b)
      if (!area) continue
      const smaller = Math.min(a.width * a.height, b.width * b.height)
      const ratio = area / Math.max(1, smaller)
      if (ratio > 0.18) {
        issues.push({
          severity: strict ? 'error' : 'warning',
          type: 'suspicious-overlap',
          elementIds: [a.id, b.id],
          detail: `${a.name} overlaps ${b.name} by ${Math.round(ratio * 100)}% of the smaller layer`,
        })
      }
    }
  }
  return issues
}

function validateProjectLayout(project, input = {}) {
  const requestedFrameId = input.frameId
  const frames = project.project.pages.flatMap((page) => page.frames).filter((frame) => !requestedFrameId || frame.id === requestedFrameId)
  if (!frames.length) throw new Error(`Frame not found: ${requestedFrameId}`)
  const frameReports = frames.map((frame) => ({
    frameId: frame.id,
    frameName: frame.name,
    issues: validateFrameLayout(frame, input.strict ?? false),
  }))
  const issueCount = frameReports.reduce((count, report) => count + report.issues.length, 0)
  return { ok: issueCount === 0, issueCount, frames: frameReports }
}

async function callTool(name, input = {}) {
  if (name === 'create_landing_page') {
    return textResult(await createHighLevelProject('landing', input))
  }
  if (name === 'create_mobile_screen') {
    return textResult(await createHighLevelProject('mobile', input))
  }
  if (name === 'create_dashboard') {
    return textResult(await createHighLevelProject('dashboard', input))
  }
  if (name === 'create_asset_pack') {
    return textResult(await createHighLevelProject('asset_pack', input))
  }
  if (name === 'create_project') {
    const project = createProject(input)
    const filePath = await writeProject(project, input.path ?? DEFAULT_PROJECT_PATH)
    return textResult({ path: filePath, projectId: project.project.id, frames: project.project.pages[0].frames })
  }
  if (name === 'list_project') {
    const project = await readProject(input.path ?? DEFAULT_PROJECT_PATH)
    return textResult({
      name: project.project.name,
      pages: project.project.pages.map((page) => ({
        id: page.id,
        name: page.name,
        frames: page.frames.map((frame) => ({
          id: frame.id,
          name: frame.name,
          width: frame.width,
          height: frame.height,
          elements: flattenElements(frame.elements).map((element) => ({
            id: element.id,
            type: element.type,
            name: element.name,
            x: element.x,
            y: element.y,
            width: element.width,
            height: element.height,
          })),
        })),
      })),
      assets: project.project.assets,
    })
  }
  if (name === 'add_frame') {
    return textResult(
      await mutateProject(input, (project) => {
        const page = project.project.pages[0]
        const frame = {
          id: input.id ?? createId('frame'),
          name: input.name,
          x: input.x ?? 80 + page.frames.length * 460,
          y: input.y ?? 80,
          width: input.width,
          height: input.height,
          background: input.background ?? '#ffffff',
          elements: [],
        }
        page.frames.push(frame)
        return { frame }
      }),
    )
  }
  if (['add_rectangle', 'add_ellipse', 'add_line'].includes(name)) {
    const type = name.replace('add_', '')
    return textResult(
      await mutateProject(input, (project) => {
        const frame = findFrame(project, input.frameId)
        const element = createElement(type, input, input.style ?? {})
        frame.elements.push(element)
        return { element }
      }),
    )
  }
  if (name === 'add_text') {
    return textResult(
      await mutateProject(input, (project) => {
        const frame = findFrame(project, input.frameId)
        const element = createElement(
          'text',
          input,
          baseStyle({
            fill: 'transparent',
            stroke: { enabled: false, color: '#000000', width: 0 },
            typography: {
              fontFamily: 'Inter',
              fontSize: 18,
              fontWeight: 500,
              lineHeight: 1.2,
              letterSpacing: 0,
              align: 'left',
              color: '#111827',
              ...(input.typography ?? {}),
            },
          }),
        )
        element.content = input.content
        frame.elements.push(element)
        return { element }
      }),
    )
  }
  if (name === 'add_image_fill_shape') {
    return textResult(
      await mutateProject(input, (project) => {
        const frame = findFrame(project, input.frameId)
        const element = createElement(input.shape ?? 'rectangle', input, {
          ...(input.style ?? {}),
          imageFit: input.imageFit ?? 'cover',
          imageCrop: input.imageCrop ?? { x: 0, y: 0, scale: 1 },
        })
        element.name = input.name ?? 'Image Shape'
        element.src = input.src
        frame.elements.push(element)
        return { element }
      }),
    )
  }
  if (name === 'list_icons') {
    return textResult(icons.map(([id, iconName, category]) => ({ id, name: iconName, category })))
  }
  if (name === 'add_icon') {
    return textResult(
      await mutateProject(input, (project) => {
        const frame = findFrame(project, input.frameId)
        const size = input.size ?? 24
        const element = createElement('rectangle', {
          ...input,
          name: input.name ?? `${input.iconId} Icon`,
          width: size,
          height: size,
        }, {
          fill: 'transparent',
          stroke: { enabled: false, color: '#000000', width: 0 },
          cornerRadius: { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 },
          imageFit: 'contain',
          imageCrop: { x: 0, y: 0, scale: 1 },
        })
        element.src = iconDataUrl(input.iconId, input.color ?? '#202124')
        frame.elements.push(element)
        return { element }
      }),
    )
  }
  if (name === 'group_elements') {
    return textResult(
      await mutateProject(input, (project) => {
        const frame = findFrame(project, input.frameId)
        const group = groupElements(frame, input.elementIds, input)
        return { group }
      }),
    )
  }
  if (name === 'align_elements') {
    return textResult(
      await mutateProject(input, (project) => {
        const frame = findFrame(project, input.frameId)
        const alignedIds = alignElements(frame, input.elementIds, input.alignment, input.scope ?? 'selection')
        return { alignedIds, alignment: input.alignment, scope: input.scope ?? 'selection' }
      }),
    )
  }
  if (name === 'distribute_elements') {
    return textResult(
      await mutateProject(input, (project) => {
        const frame = findFrame(project, input.frameId)
        const distributedIds = distributeElements(frame, input.elementIds, input.direction)
        return { distributedIds, direction: input.direction }
      }),
    )
  }
  if (name === 'update_element') {
    return textResult(
      await mutateProject(input, (project) => {
        let updated
        for (const page of project.project.pages) {
          for (const frame of page.frames) {
            frame.elements = mapElements(frame.elements, (element) => {
              if (element.id !== input.elementId) return element
              updated = { ...element, ...input.patch }
              return updated
            })
          }
        }
        if (!updated) throw new Error(`Element not found: ${input.elementId}`)
        return { element: updated }
      }),
    )
  }
  if (name === 'export_project_json') {
    return textResult(await readProject(input.path ?? DEFAULT_PROJECT_PATH))
  }
  if (name === 'apply_operations') {
    const results = []
    for (const operation of input.operations) {
      const { op, ...operationInput } = operation
      const result = await callTool(op, { path: input.path ?? DEFAULT_PROJECT_PATH, ...operationInput })
      results.push({ op, result: result.content?.[0]?.text })
    }
    return textResult({ applied: results.length, results })
  }
  if (name === 'export_frame_image') {
    const project = await readProject(input.path ?? DEFAULT_PROJECT_PATH)
    const outputPath = await exportFrameImage(project, input)
    return textResult({ outputPath })
  }
  if (name === 'export_region_image') {
    const project = await readProject(input.path ?? DEFAULT_PROJECT_PATH)
    const region = { x: input.x, y: input.y, width: input.width, height: input.height }
    const outputPath = await exportFrameImage(project, { ...input, region })
    return textResult({ outputPath, region })
  }
  if (name === 'validate_layout') {
    const project = await readProject(input.path ?? DEFAULT_PROJECT_PATH)
    return textResult(validateProjectLayout(project, input))
  }
  throw new Error(`Unknown tool: ${name}`)
}

async function handle(request) {
  if (request.method === 'initialize') {
    return { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'amanxd-agent-tools', version: '0.1.0' } }
  }
  if (request.method === 'tools/list') {
    return { tools: toolDefinitions }
  }
  if (request.method === 'tools/call') {
    return callTool(request.params.name, request.params.arguments)
  }
  if (request.method === 'notifications/initialized') return undefined
  throw new Error(`Unsupported method: ${request.method}`)
}

function parseMessages() {
  while (true) {
    const marker = buffer.indexOf('\r\n\r\n')
    if (marker === -1) return
    const header = buffer.slice(0, marker).toString('utf8')
    const match = header.match(/Content-Length:\s*(\d+)/i)
    if (!match) throw new Error('Missing Content-Length header')
    const length = Number(match[1])
    const start = marker + 4
    const end = start + length
    if (buffer.length < end) return
    const message = JSON.parse(buffer.slice(start, end).toString('utf8'))
    buffer = buffer.slice(end)
    void Promise.resolve(handle(message))
      .then((result) => {
        if (message.id !== undefined) send({ jsonrpc: '2.0', id: message.id, result })
      })
      .catch((error) => {
        if (message.id !== undefined) send({ jsonrpc: '2.0', id: message.id, error: { code: -32000, message: error.message } })
      })
  }
}

process.stdin.on('data', (chunk) => {
  buffer = Buffer.concat([buffer, chunk])
  parseMessages()
})
