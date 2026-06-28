# amanXDtool

**Live Demo:** [https://amansandhu2718.github.io/AdobeXD_Clone_aiReady/](https://amansandhu2718.github.io/AdobeXD_Clone_aiReady/)

amanXDtool is a local UI design tool with an MCP-style stdio server.

## MCP Server

Install dependencies:

```powershell
npm run install:tool
```

Start the MCP server:

```powershell
node amanXDtool/agent-tools/server.mjs
```

List exposed MCP tools:

```powershell
node amanXDtool/agent-tools/scripts/list-tools.mjs
```

MCP endpoint and tool details are in [amanXDtool/docs/TOOL_API.md](amanXDtool/docs/TOOL_API.md).

## Manual Editor

```powershell
npm run dev:tool
```

Open:

```text
http://127.0.0.1:5173/
```

## GitHub Pages

Keep `.github/` in the repo. It contains the workflow that builds and deploys the live demo.