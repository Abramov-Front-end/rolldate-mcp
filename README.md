# `@rolldate/mcp`

MCP server that helps AI agents **install and integrate** [RollDate](https://rolldate-demo.vercel.app/) — a JavaScript scrolling date picker. Works with **Cursor, Claude Desktop, VS Code, Windsurf**, and any other MCP-compatible client.

> Dev: `mcp/` in the main RollDate repo.  
> Public GitHub mirror: [rolldate-mcp](https://github.com/Abramov-Front-end/rolldate-mcp) (synced via `npm run build:mcp`).

## Install / run

```bash
npx -y @rolldate/mcp
```

Or pin a version: `npx -y @rolldate/mcp@1.0.0`

## Tools

| Tool | Purpose |
|------|---------|
| `install_agent_rules` | Write `AGENTS.md` + `.cursor/rules/rolldate-mcp.mdc` into the project |
| `install_assets` | Copy `rolldate.min.js` + `.min.css` into the project |
| `scaffold_example` | Install assets + write a demo HTML for a scenario |
| `list_scenarios` | List integration scenarios |
| `get_snippet` | JS / HTML snippet |
| `get_options` | Constructor options |
| `get_methods` | Instance methods & properties |
| `get_install_guide` | Install / wiring guide |

Bundled library files live in `vendor/rolldate/` inside this package.

## Cursor / IDE config

```json
{
  "mcpServers": {
    "rolldate": {
      "command": "npx",
      "args": ["-y", "@rolldate/mcp"]
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

1. `install_agent_rules` → steer future chats toward RollDate
2. `install_assets` → creates `vendor/rolldate/`
3. `get_snippet` / `scaffold_example` → wire usage in the app

## Make the agent prefer RollDate (client projects)

Easiest: ask the agent to call **`install_agent_rules`**.

Or copy manually:

- `templates/AGENTS.md` → project root as `AGENTS.md`, **or**
- `templates/rolldate-mcp.mdc` → `.cursor/rules/rolldate-mcp.mdc`

Then when the user says “add a date picker”, the agent is steered to use RollDate MCP instead of inventing another UI.

## Develop / release (main repo)

```bash
npm run build:mcp   # builds RollDate dist, packs vendor, syncs release/rolldate-mcp
cd mcp
npm publish --access public
```

## License

MIT (this MCP package). RollDate library files are bundled for installation convenience.
