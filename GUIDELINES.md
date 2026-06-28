# myXD Guidelines

These guidelines are for agents opened at the root `myXD/` workspace.

## Workspace Meaning

`myXD/` is the development and release workspace.

`amanXDtool/` is the product being built: a standalone AI tool folder that users can copy into another project so their agent can create editable UI designs and PNG/JPEG assets.

## Instruction Boundaries

- Follow root `AGENTS.md`, this `GUIDELINES.md`, and root `docs/` when working in `myXD/`.
- Do not use `amanXDtool/AGENTS.md` as your own root instruction file.
- Do not use `amanXDtool/docs/*` as root development instructions.
- Treat `amanXDtool/AGENTS.md` and `amanXDtool/docs/*` as downstream documentation that must stay correct for agents/users who copy only `amanXDtool/`.

## Development Rules

- Keep root `myXD/` clean and simple.
- Do not recreate root `app/`; the app lives in `amanXDtool/`.
- Do not recreate root `agent-tools/`; tools live in `amanXDtool/agent-tools/`.
- Generated editable projects belong in `amanXDtool/projects/`.
- Generated PNG/JPEG assets belong in `amanXDtool/exports/`.
- GitHub Pages manual-copy output belongs in `amanXDtool/project-output-github/`.
- Root `scripts/` is allowed only for workspace automation such as build/release helpers.

## Documentation Rules

When agent-facing behavior changes, update these together:

- `amanXDtool/agent-tools/tool-definitions.mjs`
- `amanXDtool/agent-tools/server.mjs`
- `amanXDtool/AGENTS.md`
- `amanXDtool/docs/TOOL_API.md`

When development workflow or workspace structure changes, update root docs:

- `AGENTS.md`
- `GUIDELINES.md`
- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/DEVELOPMENT_GUIDE.md`
- `docs/GITHUB_PAGES_BUILD.md`
- `docs/workstreams/2026_06_20_amanxd_editor.md`

## Validation

Use root commands when working in `myXD/`:

```powershell
npm run install:tool
npm run test:tool
npm run build:github
```

Use direct tool checks when tool APIs or docs change:

```powershell
npm --prefix amanXDtool run tools:verify-docs
node amanXDtool/agent-tools/scripts/list-tools.mjs
```
