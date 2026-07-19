# RollDate MCP

MCP server that helps AI agents (Cursor, Claude Desktop, etc.) integrate **RollDate** — a vanilla JS scrolling date picker.

> **Dev lives in** the main `rolldate` repo (`mcp/`).  
> **Public releases** ship from a separate `rolldate-mcp` GitHub repo (synced via `npm run build:mcp`).

## Tools

| Tool | Purpose |
|------|---------|
| `list_scenarios` | List integration scenarios |
| `get_snippet` | JS / HTML snippet for a scenario |
| `get_options` | Constructor options reference |
| `get_methods` | Instance methods & properties |
| `get_install_guide` | How to wire CSS/JS |

## Cursor config

Local (while developing in the main repo):

```json
{
  "mcpServers": {
    "rolldate": {
      "command": "node",
      "args": ["D:/Projects/rolldate/mcp/src/index.js"]
    }
  }
}
```

After publishing / cloning the release repo:

```json
{
  "mcpServers": {
    "rolldate": {
      "command": "npx",
      "args": ["-y", "github:Abramov-Front-end/rolldate-mcp"]
    }
  }
}
```

Or from npm (when published):

```json
{
  "mcpServers": {
    "rolldate": {
      "command": "npx",
      "args": ["-y", "rolldate-mcp"]
    }
  }
}
```

## Develop (main repo)

```bash
cd mcp
npm install
npm start
```

Inspector:

```bash
cd mcp
npm run inspect
```

## Release to the public MCP repo

From the **main** `rolldate` project:

```bash
npm run build:mcp
```

This copies a clean package into `release/rolldate-mcp/`.  
Then in that folder (separate git remote):

```bash
cd release/rolldate-mcp
git add .
git commit -m "Release rolldate-mcp v1.0.0"
git push origin main
# optional:
npm publish
```

## License

MIT (this MCP package). RollDate library itself may use a different commercial license.
