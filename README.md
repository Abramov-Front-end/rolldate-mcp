# RollDate MCP

MCP server that helps AI agents **install and integrate** [RollDate](https://github.com/Abramov-Front-end/rolldate) — a vanilla JS scrolling date picker.

> Dev: `mcp/` in the main RollDate repo.  
> Public releases: this repo (`rolldate-mcp`), synced via `npm run build:mcp`.

## Tools

| Tool | Purpose |
|------|---------|
| `install_assets` | Copy `rolldate.min.js` + `.min.css` into the project |
| `scaffold_example` | Install assets + write a demo HTML for a scenario |
| `list_scenarios` | List integration scenarios |
| `get_snippet` | JS / HTML snippet |
| `get_options` | Constructor options |
| `get_methods` | Instance methods & properties |
| `get_install_guide` | Install / wiring guide |

Bundled library files live in `vendor/rolldate/` inside this package.

## Cursor config

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

Local (main repo while developing):

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

## Typical agent flow

1. `install_assets` → creates `vendor/rolldate/`
2. `get_snippet` / `scaffold_example` → wire usage in the app

## Develop / release (main repo)

```bash
npm run build:mcp   # builds RollDate dist, packs vendor, syncs release/rolldate-mcp
cd release/rolldate-mcp
git add .
git commit -m "Release rolldate-mcp v1.1.0"
git push
```

## License

MIT (this MCP package). RollDate library files are bundled for installation convenience.
