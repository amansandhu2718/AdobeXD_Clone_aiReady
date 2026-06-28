# amanXDtool

amanXDtool is a vibe-coded AI design tool I built for creating editable UI mockups and PNG/JPEG assets.

It can be used in two ways:

- **Manually** through a local React editor, similar to a lightweight Adobe XD-style canvas.
- **With AI agents** through a local MCP-style stdio tool server, so Codex, Claude, or another compatible agent can create and edit designs programmatically.

The shareable tool lives in `amanXDtool/`. This root repo is the development and release workspace around it.

## What It Does

- Create editable `.amanxd.json` design projects.
- Build landing pages, mobile screens, dashboards, and visual asset packs from prompts.
- Let users inspect and edit designs manually in a browser-based canvas editor.
- Export full frames or selected regions as PNG/JPEG assets.
- Expose local agent tools through `amanXDtool/agent-tools/server.mjs`.
- Validate generated layouts so AI-created UI avoids obvious overlap and out-of-frame mistakes.

## Manual Use

Run the editor from the repo root:

```powershell
npm run install:tool
npm run dev:tool
```

Then open:

```text
http://127.0.0.1:5173/
```

You can create, edit, inspect, and export UI designs from the visual editor.

## AI / MCP-Style Use

amanXDtool includes a local MCP-style server over stdio.

Run it from `amanXDtool/`:

```powershell
node agent-tools/server.mjs
```

Or list the available agent tools:

```powershell
node agent-tools/scripts/list-tools.mjs
```

The server exposes tools for creating projects, adding frames/elements, grouping, aligning, distributing, validating layouts, exporting images, and returning editable project JSON.

## Project Layout

```text
myXD/
  amanXDtool/              The actual shareable AI design tool
    src/                   React editor
    agent-tools/           MCP-style local tool server
    docs/                  Tool usage and agent instructions
  docs/                    Development and release docs
  scripts/                 Build helpers
  .github/workflows/       CI and GitHub Pages deployment
```

## GitHub Pages

This repo includes a GitHub Pages workflow. After pushing to GitHub:

1. Open **Settings > Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to `main` or `master`, or run **Deploy GitHub Pages** manually.

Local Pages build:

```powershell
npm run build:github
```

The deployable static output is generated at:

```text
amanXDtool/project-output-github/
```

## Validation

Run the main validation before publishing changes:

```powershell
npm run test:tool
npm run build:github
```

CI also runs on GitHub through `.github/workflows/ci.yml`.

## Notes

Generated projects, exports, local build output, and GitHub Pages output are ignored by Git. The source of truth is the editor, local tool server, docs, and scripts inside this repository.
