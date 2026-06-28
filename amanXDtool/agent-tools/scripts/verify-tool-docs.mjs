#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { toolDefinitions } from '../tool-definitions.mjs'

const toolRoot = path.resolve(import.meta.dirname, '..', '..')
const docPath = path.join(toolRoot, 'docs', 'TOOL_API.md')
const content = await fs.readFile(docPath, 'utf8')

const missing = []
for (const tool of toolDefinitions) {
  if (!content.includes(tool.name)) missing.push(`docs/TOOL_API.md is missing ${tool.name}`)
}

if (missing.length) {
  console.error(missing.join('\n'))
  process.exit(1)
}

console.log(`Verified ${toolDefinitions.length} tool names in MCP docs.`)