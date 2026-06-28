# myXD Agent Guide

This root folder is the development workspace for `amanXDtool`.

Do not treat root `myXD/` as the shareable tool. The shareable tool is `amanXDtool/`.

Before changing the project, read root `GUIDELINES.md`. Root agents should use root docs as their operating context. Do not treat `amanXDtool/AGENTS.md` or `amanXDtool/docs/*` as instructions for working in `myXD`; those files are product documentation for agents who copy/open `amanXDtool/` by itself.

## Operating Model

- Use `$workstream-execution` only from this root workspace.
- Keep the active workstream at `docs/workstreams/2026_06_20_amanxd_editor.md`.
- Modify the React editor, local agent tools, and shareable docs inside `amanXDtool/`.
- Maintain `amanXDtool/` docs for downstream users and agents, but follow root `AGENTS.md`, root `GUIDELINES.md`, and root `docs/` while developing the tool.
- Build GitHub Pages output with the root command `npm run build:github`.
- Do not add backend/cloud storage unless the user explicitly asks for it.

## Commands

Run from root:

```powershell
npm run install:tool
npm run dev:tool
npm run lint:tool
npm run test:tool
npm run build:github
```

Run from `amanXDtool/` when validating the shareable folder directly:

```powershell
npm install
npm run dev
npm run lint
npm run tools:verify-docs
npm run test
npm run build
npx playwright test
node agent-tools/scripts/list-tools.mjs
```

## Documentation Contract

Root docs explain how to improve and release the tool.

`amanXDtool/` docs explain how another agent or user can copy and use the tool inside a different project.

Keep exposed tools current in:

- `amanXDtool/agent-tools/tool-definitions.mjs`
- `amanXDtool/docs/TOOL_API.md`
- `amanXDtool/AGENTS.md`

## Build Output

The root GitHub Pages build output must go to:

```text
amanXDtool/project-output-github/
```

Do not manually edit files in `amanXDtool/project-output-github/`; regenerate them with `npm run build:github`.
