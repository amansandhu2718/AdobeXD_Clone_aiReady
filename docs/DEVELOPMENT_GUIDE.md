# Development Guide

## Install

From root:

```powershell
npm run install:tool
```

Or from the shareable tool folder:

```powershell
cd amanXDtool
npm install
```

## Run

```powershell
npm run dev:tool
```

The editor runs at:

```text
http://127.0.0.1:5173/
```

## Validate

From root:

```powershell
npm run test:tool
```

This runs lint, tool-doc verification, unit tests, production build, and Playwright smoke tests.

## Tool API Sync

After changing exposed agent behavior, update:

- `amanXDtool/agent-tools/tool-definitions.mjs`
- `amanXDtool/agent-tools/server.mjs`
- `amanXDtool/docs/TOOL_API.md`
- `amanXDtool/AGENTS.md`

Then run:

```powershell
npm --prefix amanXDtool run tools:verify-docs
node amanXDtool/agent-tools/scripts/list-tools.mjs
```

## Workstream

Use the root workstream only:

```text
docs/workstreams/2026_06_20_amanxd_editor.md
```

Do not add workstream files inside `amanXDtool/`.
