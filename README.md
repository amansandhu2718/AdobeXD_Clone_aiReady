# amanXD

amanXD is a local-first React design and prototyping editor inspired by Adobe XD workflows. It is built so Codex can create editable UI projects from prompts through validated `.amanxd.json` files.

## Project Layout

- `app/`: Vite React TypeScript editor application.
- `docs/`: product, architecture, schema, UX, export, and technical planning docs.
- `docs/workstreams/2026_06_20_amanxd_editor.md`: active workstream state.
- `examples/ai-projects/`: sample Codex/AI project files.

## Start

```bash
cd app
npm install
npm run dev -- --host 127.0.0.1
```

Open `http://127.0.0.1:5173`.

## Validate

```bash
cd app
npm run lint
npm run test
npm run build
```
