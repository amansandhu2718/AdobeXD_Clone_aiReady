import { toolDefinitions } from '../tool-definitions.mjs'

for (const tool of toolDefinitions) {
  console.log(`${tool.name}\n  ${tool.description}\n`)
}
