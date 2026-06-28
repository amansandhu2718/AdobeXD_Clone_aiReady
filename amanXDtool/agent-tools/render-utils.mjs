import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { findFrame, repoRoot, safePath } from './project-utils.mjs'

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function radius(style) {
  const corner = style.cornerRadius ?? { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 }
  return Math.max(corner.topLeft, corner.topRight, corner.bottomRight, corner.bottomLeft)
}

function renderElement(element, offsetX = 0, offsetY = 0) {
  if (element.visible === false) return ''
  const x = offsetX + element.x
  const y = offsetY + element.y
  const opacity = element.opacity ?? 1
  const stroke = element.style?.stroke?.enabled
    ? `stroke="${esc(element.style.stroke.color)}" stroke-width="${element.style.stroke.width}"`
    : 'stroke="none"'
  const fill = element.src ? 'transparent' : (element.style?.fill ?? 'transparent')
  const shadow = element.style?.shadow?.enabled
    ? `filter="drop-shadow(${element.style.shadow.x}px ${element.style.shadow.y}px ${element.style.shadow.blur}px ${element.style.shadow.color})"`
    : ''
  const children = (element.children ?? []).map((child) => renderElement(child, x, y)).join('')
  const common = `opacity="${opacity}" transform="rotate(${element.rotation ?? 0} ${x + element.width / 2} ${y + element.height / 2})"`

  if (element.type === 'group') return `<g ${common}>${children}</g>`
  if (element.type === 'ellipse') {
    const image = element.src
      ? `<image href="${esc(element.src)}" x="${x}" y="${y}" width="${element.width}" height="${element.height}" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip-${esc(element.id)})"/>`
      : ''
    return `<defs><clipPath id="clip-${esc(element.id)}"><ellipse cx="${x + element.width / 2}" cy="${y + element.height / 2}" rx="${element.width / 2}" ry="${element.height / 2}"/></clipPath></defs><ellipse ${common} cx="${x + element.width / 2}" cy="${y + element.height / 2}" rx="${element.width / 2}" ry="${element.height / 2}" fill="${esc(fill)}" ${stroke} ${shadow}/>${image}${children}`
  }
  if (element.type === 'line') {
    return `<line ${common} x1="${x}" y1="${y}" x2="${x + element.width}" y2="${y + element.height}" ${stroke}/>${children}`
  }
  if (element.type === 'text') {
    const typo = element.style?.typography ?? {}
    const text = esc(element.content ?? '')
    return `<text ${common} x="${x}" y="${y + (typo.fontSize ?? 18)}" fill="${esc(typo.color ?? '#111827')}" font-family="${esc(typo.fontFamily ?? 'Inter')}" font-size="${typo.fontSize ?? 18}" font-weight="${typo.fontWeight ?? 500}" font-style="${typo.fontStyle ?? 'normal'}" text-decoration="${typo.decoration === 'underline' ? 'underline' : 'none'}" letter-spacing="${typo.letterSpacing ?? 0}">${text}</text>`
  }

  const clipId = `clip-${esc(element.id)}`
  const image = element.src
    ? `<defs><clipPath id="${clipId}"><rect x="${x}" y="${y}" width="${element.width}" height="${element.height}" rx="${radius(element.style)}"/></clipPath></defs><image href="${esc(element.src)}" x="${x}" y="${y}" width="${element.width}" height="${element.height}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})"/>`
    : ''
  return `<rect ${common} x="${x}" y="${y}" width="${element.width}" height="${element.height}" rx="${radius(element.style)}" fill="${esc(fill)}" ${stroke} ${shadow}/>${image}${children}`
}

export function projectFrameToSvg(project, frameId) {
  const frame = findFrame(project, frameId)
  const content = frame.elements.map((element) => renderElement(element)).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${frame.width}" height="${frame.height}" viewBox="0 0 ${frame.width} ${frame.height}"><rect width="100%" height="100%" fill="${esc(frame.background)}"/>${content}</svg>`
}

export async function exportFrameImage(project, input) {
  const outputPath = safePath(input.outputPath ?? `exports/${input.frameId}.${input.format ?? 'png'}`)
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  const svg = projectFrameToSvg(project, input.frameId)
  const { chromium } = await loadPlaywright()
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ viewport: { width: 1, height: 1 } })
    await page.setContent(`<html><body style="margin:0">${svg}</body></html>`)
    const svgBox = await page.locator('svg').boundingBox()
    if (!svgBox) throw new Error('Could not render SVG frame')
    await page.setViewportSize({ width: Math.ceil(svgBox.width), height: Math.ceil(svgBox.height) })
    const screenshotOptions = {
      path: outputPath,
      type: input.format === 'jpeg' ? 'jpeg' : 'png',
      quality: input.format === 'jpeg' ? Math.round((input.quality ?? 0.92) * 100) : undefined,
      scale: 'css',
    }
    if (input.region) {
      await page.screenshot({
        ...screenshotOptions,
        clip: {
          x: Math.max(0, input.region.x),
          y: Math.max(0, input.region.y),
          width: Math.max(1, input.region.width),
          height: Math.max(1, input.region.height),
        },
      })
    } else {
      await page.locator('svg').screenshot(screenshotOptions)
    }
  } finally {
    await browser.close()
  }
  return path.relative(repoRoot, outputPath)
}

async function loadPlaywright() {
  const entry = path.join(repoRoot, 'node_modules', '@playwright', 'test', 'index.mjs')
  try {
    return await import(pathToFileURL(entry).href)
  } catch (error) {
    throw new Error(
      `Could not load Playwright from amanXDtool/node_modules. Run "npm install" in amanXDtool/ before export_frame_image. ${error.message}`,
    )
  }
}
