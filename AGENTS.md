# AGENTS.md

Use amanXDtool only through its MCP-style stdio server.

## Start Server

Run from the repository root:

```powershell
node amanXDtool/agent-tools/server.mjs
```

Run from `amanXDtool/`:

```powershell
node agent-tools/server.mjs
```

## Protocol

The server uses JSON-RPC 2.0 messages over stdio with MCP framing:

```text
Content-Length: <byte-length>\r\n\r\n<json>
```

Supported methods:

- `initialize`
- `notifications/initialized`
- `tools/list`
- `tools/call`

Call `tools/list` for the authoritative tool schemas before calling tools.

## Useful Commands

List tool names without starting an MCP client:

```powershell
node amanXDtool/agent-tools/scripts/list-tools.mjs
```

Verify MCP docs mention every exposed tool:

```powershell
npm --prefix amanXDtool run tools:verify-docs
```

## Paths

Default project path:

```text
projects/current.amanxd.json
```

Default image output folder:

```text
exports/
```

Paths are relative to `amanXDtool/` unless a tool schema states otherwise.

## Reference

Read `amanXDtool/docs/TOOL_API.md` for MCP message examples and the current tool list.