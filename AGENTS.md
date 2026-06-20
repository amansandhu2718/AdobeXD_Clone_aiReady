# amanXD Agent Guide

amanXD is a local-first React design and prototyping editor inspired by Adobe XD workflows. Agents should keep the app usable for visual UI creation, AI-generated project import, local persistence, and reliable export.

## Operating Model

- Keep the active workstream current at `docs/workstreams/2026_06_20_amanxd_editor.md`.
- Treat `docs/AI_PROJECT_SCHEMA.md` as the contract for Codex-generated UI projects.
- Prefer adding or editing designs through valid `.amanxd.json` project data, then validating that the app can import and render it.
- Keep implementation changes aligned with `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/UX_SPEC.md`, and `docs/EXPORT_SPEC.md`.
- Do not introduce a backend unless the user explicitly approves that storage/API boundary change.

## Build Commands

Run commands from `app/` unless noted otherwise.

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Typecheck and build: `npm run build`
- Run tests: `npm run test`

## Design Creation Rules

- A project must contain at least one page and one frame.
- Frames contain elements; elements should use normalized style objects.
- Prefer reusable assets for repeated colors, typography, images, and components.
- Include prototype links as metadata rather than hard-coding navigation behavior into canvas components.
- Validate imported AI JSON with the Zod schema before writing it to state or storage.

## Visual Quality Defaults

- Build dense, professional editor UI rather than a marketing page.
- Keep panels compact and predictable: toolbar left, layers left, canvas center, inspector right, top command bar.
- Use icons from `lucide-react`.
- Keep cards and panels at small radii, avoid decorative blobs, and prioritize legibility.
