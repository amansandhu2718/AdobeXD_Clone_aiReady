import fs from 'node:fs/promises'
import path from 'node:path'
import { DEFAULT_PROJECT_PATH } from './tool-definitions.mjs'

export const repoRoot = path.resolve(import.meta.dirname, '..')

export const icons = [
  ['icon-home', 'Home', 'Navigation', '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>'],
  ['icon-search', 'Search', 'Navigation', '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'],
  ['icon-user', 'User', 'People', '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>'],
  ['icon-bell', 'Bell', 'System', '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>'],
  ['icon-mail', 'Mail', 'Communication', '<rect width="18" height="14" x="3" y="5" rx="2"/><path d="m3 7 9 6 9-6"/>'],
  ['icon-heart', 'Heart', 'Social', '<path d="M19.5 12.6 12 20l-7.5-7.4a5 5 0 0 1 7.1-7.1l.4.4.4-.4a5 5 0 0 1 7.1 7.1Z"/>'],
  ['icon-plus', 'Plus', 'Actions', '<path d="M12 5v14"/><path d="M5 12h14"/>'],
  ['icon-check', 'Check', 'Actions', '<path d="m20 6-11 11-5-5"/>'],
  ['icon-arrow-right', 'Arrow Right', 'Navigation', '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'],
  ['icon-cart', 'Cart', 'Commerce', '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 2h3l3 14h10l3-9H6"/>'],
  ['icon-credit-card', 'Credit Card', 'Commerce', '<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>'],
]

export function safePath(inputPath = DEFAULT_PROJECT_PATH) {
  const resolved = path.resolve(repoRoot, inputPath)
  if (!resolved.startsWith(repoRoot)) throw new Error('Path must stay inside the amanXDtool folder')
  return resolved
}

export function createId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

export function baseStyle(overrides = {}) {
  return {
    fill: '#ffffff',
    stroke: { enabled: true, color: '#d7d7d7', width: 1 },
    cornerRadius: { topLeft: 8, topRight: 8, bottomRight: 8, bottomLeft: 8 },
    shadow: { enabled: false, color: '#000000', x: 0, y: 8, blur: 18, opacity: 0.12 },
    blendMode: 'normal',
    ...overrides,
  }
}

export function createElement(type, input, style = {}) {
  return {
    id: input.id ?? createId(type),
    type,
    name: input.name ?? type[0].toUpperCase() + type.slice(1),
    x: input.x,
    y: input.y,
    width: input.width,
    height: input.height,
    rotation: input.rotation ?? 0,
    opacity: input.opacity ?? 1,
    locked: input.locked ?? false,
    visible: input.visible ?? true,
    style: baseStyle(style),
    children: input.children,
  }
}

export async function readProject(inputPath) {
  const filePath = safePath(inputPath)
  return JSON.parse(await fs.readFile(filePath, 'utf8'))
}

export async function writeProject(project, inputPath) {
  const filePath = safePath(inputPath)
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  project.project.updatedAt = new Date().toISOString()
  await fs.writeFile(filePath, `${JSON.stringify(project, null, 2)}\n`)
  return filePath
}

export function findFrame(project, frameId) {
  const frame = project.project.pages.flatMap((page) => page.frames).find((candidate) => candidate.id === frameId)
  if (!frame) throw new Error(`Frame not found: ${frameId}`)
  return frame
}

export function mapElements(elements, mapper) {
  return elements.map((element) =>
    mapper({
      ...element,
      children: element.children ? mapElements(element.children, mapper) : element.children,
    }),
  )
}

export function flattenElements(elements, offsetX = 0, offsetY = 0) {
  return elements.flatMap((element) => {
    const absolute = { ...element, x: offsetX + element.x, y: offsetY + element.y }
    return [absolute, ...flattenElements(element.children ?? [], absolute.x, absolute.y)]
  })
}

export function iconDataUrl(iconId, color = '#202124') {
  const icon = icons.find(([id]) => id === iconId)
  if (!icon) throw new Error(`Unknown iconId: ${iconId}`)
  const [, , , svgPath] = icon
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${svgPath}</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
