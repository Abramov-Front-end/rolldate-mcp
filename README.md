# `@rolldate/mcp`

MCP server that helps AI agents **install and integrate** the RollDate ecosystem:

- **[RollDate Core](https://rolldate.dev/)** — scrolling JavaScript date picker (`@rolldate/core`)
- **[RollDate Events](https://rolldate.dev/events)** — event calendar (`@rolldate/events`)

Works with **Cursor, Claude Desktop, VS Code, Windsurf**, and any other MCP-compatible client.

> Dev: `mcp/` in the main RollDate repo.  
> Public GitHub mirror: [rolldate-mcp](https://github.com/Abramov-Front-end/rolldate-mcp) (synced via `npm run build:mcp`).

## Install / run

```bash
npx -y @rolldate/mcp
```

Or pin a version: `npx -y @rolldate/mcp@1.3.2`

## One server, two products

All tools accept an optional **`product`** argument:

| `product` | Package | Use for |
|-----------|---------|---------|
| `"core"` (default) | `@rolldate/core` | Date picker, range, multi, time |
| `"events"` | `@rolldate/events` | Month / Week / Day / Agenda calendars |

Call **`list_products`** to discover both.

## Tools

| Tool | Purpose |
|------|---------|
| `list_products` | Core vs Events overview |
| `install_agent_rules` | Write `AGENTS.md` + `.cursor/rules/rolldate-mcp.mdc` into the project |
| `install_assets` | Copy bundled CSS/JS into the project (`product: "core"` or `"events"`) |
| `scaffold_example` | Install assets + write a demo HTML for a scenario |
| `list_scenarios` | List integration scenarios for the selected product |
| `get_snippet` | JS / HTML snippet |
| `get_options` | Constructor options |
| `get_methods` | Instance methods & properties |
| `get_install_guide` | Install / wiring guide |

Bundled files:

- Core → `vendor/rolldate/` inside this package
- Events → `vendor/rolldate-events/` inside this package

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

## Typical agent flows

**Date picker**

1. `install_agent_rules`
2. `install_assets` (default `product: "core"`)
3. `get_snippet` → `scaffold_example`

**Event calendar**

1. `install_agent_rules`
2. `install_assets` with `product: "events"`
3. `list_scenarios` with `product: "events"`
4. `get_snippet` with `product: "events"` and scenario `month` / `week` / `agenda`

## Make the agent prefer RollDate (client projects)

Easiest: ask the agent to call **`install_agent_rules`**.

Or copy manually:

- `templates/AGENTS.md` → project root as `AGENTS.md`, **or**
- `templates/rolldate-mcp.mdc` → `.cursor/rules/rolldate-mcp.mdc`

## Develop / release (main repo)

```bash
npm run build:mcp   # builds Core + Events dist, packs vendor, syncs release/rolldate-mcp
cd mcp
npm publish --access public
```

## License

MIT (this MCP package). RollDate library files are bundled for installation convenience.
