# GitHub Pages Build

`amanXDtool/project-output-github/` is the deployable static output folder.

Build it from root:

```powershell
npm run build:github
```

The command:

1. Removes the previous `amanXDtool/project-output-github/`.
2. Builds `amanXDtool/`.
3. Copies `amanXDtool/dist/` into `amanXDtool/project-output-github/`.

For normal GitHub deployments, use the workflow at `.github/workflows/pages.yml`.

First-time setup:

1. Push the repository to GitHub.
2. Open **Settings > Pages** for the repository.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` or `master`, or run the **Deploy GitHub Pages** workflow manually.

The workflow installs dependencies from `amanXDtool/package-lock.json`, sets `VITE_BASE_PATH` to the repository name, builds from the root script, uploads `amanXDtool/project-output-github/`, and deploys it with GitHub Pages.

You can also upload or publish the contents of `amanXDtool/project-output-github/` manually if you are not using GitHub Actions.

Placeholder page URL:

```text
https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO_NAME/
```

The workflow at `.github/workflows/pages.yml` builds from `amanXDtool/` for hosted deployments.

CI validation is defined in `.github/workflows/ci.yml` and runs lint, tool-doc verification, unit tests, and the GitHub Pages build.
