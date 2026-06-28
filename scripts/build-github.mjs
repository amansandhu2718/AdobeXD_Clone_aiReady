import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = path.resolve(import.meta.dirname, '..')
const toolDir = path.join(root, 'amanXDtool')
const outputDir = path.join(toolDir, 'project-output-github')

function run(command, args, cwd) {
  const executable = process.platform === 'win32' ? 'cmd.exe' : command
  const commandArgs = process.platform === 'win32' ? ['/d', '/s', '/c', command, ...args] : args
  const result = spawnSync(executable, commandArgs, { cwd, stdio: 'inherit' })
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed with exit code ${result.status}`)
  }
}

async function copyDirectory(source, target) {
  await fs.mkdir(target, { recursive: true })
  const entries = await fs.readdir(source, { withFileTypes: true })
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name)
    const targetPath = path.join(target, entry.name)
    if (entry.isDirectory()) await copyDirectory(sourcePath, targetPath)
    else await fs.copyFile(sourcePath, targetPath)
  }
}

await fs.rm(outputDir, { recursive: true, force: true })
run('npm', ['run', 'build'], toolDir)
await copyDirectory(path.join(toolDir, 'dist'), outputDir)
console.log(`GitHub Pages build written to ${path.relative(root, outputDir)}`)
