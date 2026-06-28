# amanXDtool MCP API

The server is a local MCP-style JSON-RPC server over stdio. It is not an HTTP server.

## Start

From `amanXDtool/`:

```powershell
node agent-tools/server.mjs
```

From the repository root:

```powershell
node amanXDtool/agent-tools/server.mjs
```

## Message Framing

Requests and responses use MCP stdio framing:

```text
Content-Length: <byte-length>\r\n\r\n<json-rpc-message>
```

Each JSON message uses JSON-RPC 2.0 shape:

```json
{ "jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {} }
```

## Methods

### `initialize`

Returns protocol and server metadata.

```json
{ "jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {} }
```

### `notifications/initialized`

Optional notification. No response is sent.

```json
{ "jsonrpc": "2.0", "method": "notifications/initialized", "params": {} }
```

### `tools/list`

Returns all tool schemas. This is the authoritative source for parameters.

```json
{ "jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {} }
```

### `tools/call`

Runs one tool.

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "create_project",
    "arguments": {
      "name": "Demo Project"
    }
  }
}
```

## Tool Names

Use `tools/list` for full JSON schemas. Current tools:

- `create_landing_page`
- `create_mobile_screen`
- `create_dashboard`
- `create_asset_pack`
- `create_project`
- `list_project`
- `add_frame`
- `add_rectangle`
- `add_ellipse`
- `add_line`
- `add_text`
- `add_image_fill_shape`
- `add_icon`
- `list_icons`
- `group_elements`
- `align_elements`
- `distribute_elements`
- `update_element`
- `apply_operations`
- `export_frame_image`
- `export_region_image`
- `validate_layout`
- `export_project_json`

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

## Example Calls

Create a project:

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/call",
  "params": {
    "name": "create_project",
    "arguments": {
      "name": "Demo Project"
    }
  }
}
```

Export a frame:

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "tools/call",
  "params": {
    "name": "export_frame_image",
    "arguments": {
      "frameId": "frame_home",
      "outputPath": "exports/home.png",
      "format": "png"
    }
  }
}
```