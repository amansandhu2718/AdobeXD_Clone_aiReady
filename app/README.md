# amanXD App

amanXD is a local-first React UI design and prototyping editor inspired by Adobe XD workflows.

## Run

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

## Validate

```bash
npm run lint
npm run test
npm run build
```

## AI Project Creation

Codex-generated designs should be created as `.amanxd.json` files using the schema documented in `../docs/AI_PROJECT_SCHEMA.md`.

The app can import project JSON, validate it with Zod, render it on the canvas, autosave it to IndexedDB, and export project JSON, frame PNG, and handoff metadata.
