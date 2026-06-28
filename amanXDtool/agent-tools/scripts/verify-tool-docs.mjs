#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { toolDefinitions } from '../tool-definitions.mjs'

const toolRoot = path.resolve(import.meta.dirname, '..', '..')
const docsToCheck = [
  path.join(toolRoot, 'AGENTS.md'),
  path.join(toolRoot, 'docs', 'TOOL_API.md'),
]

const missing = []
for (const docPath of docsToCheck) {
  const content = await fs.readFile(docPath, 'utf8')
  for (const tool of toolDefinitions) {
    if (!content.includes(tool.name)) {
      missing.push(`${path.relative(toolRoot, docPath)} is missing ${tool.name}`)
    }
  }
}

if (missing.length) {
  console.error(missing.join('\n'))
  process.exit(1)
}

console.log(`Verified ${toolDefinitions.length} tool names in agent docs.`)
