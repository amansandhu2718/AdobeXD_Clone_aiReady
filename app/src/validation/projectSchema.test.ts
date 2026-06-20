import { describe, expect, it } from 'vitest'
import { sampleProject } from '../data/sampleProject'
import { createHandoffMetadata } from '../lib/handoff'
import { parseProjectFile } from './projectSchema'

describe('project schema', () => {
  it('accepts the bundled amanXD sample project', () => {
    const parsed = parseProjectFile(sampleProject)
    expect(parsed.project.name).toContain('amanXD')
    expect(parsed.project.pages[0]?.frames.length).toBeGreaterThan(0)
    const ctaButton = parsed.project.pages[0]?.frames[0]?.elements.find(
      (element) => element.id === 'cta_button',
    )
    expect(ctaButton?.children?.[0]?.id).toBe('cta_label')
  })

  it('rejects files without frames', () => {
    const invalid = structuredClone(sampleProject)
    invalid.project.pages[0]!.frames = []
    expect(() => parseProjectFile(invalid)).toThrow()
  })

  it('creates handoff metadata for frames and assets', () => {
    const metadata = createHandoffMetadata(sampleProject.project)
    expect(metadata.frames.length).toBeGreaterThan(0)
    expect(metadata.assets.colors.length).toBeGreaterThan(0)
  })
})
