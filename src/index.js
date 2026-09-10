#!/usr/bin/env node
import {copyFileSync, existsSync, mkdirSync, writeFileSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js'
import {z} from 'zod'
import {PRODUCTS, fixSnippetHtml, getProduct, productIds} from './products.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(__dirname, '..')
const templatesDir = path.join(packageRoot, 'templates')

const AGENTS_SRC = [
  path.join(packageRoot, 'AGENTS.md'),
  path.join(templatesDir, 'AGENTS.md')
]
const RULE_SRC = path.join(templatesDir, 'rolldate-mcp.mdc')

const productSchema = z
  .enum(['core', 'events'])
  .optional()
  .describe('RollDate product. Default: core (date picker). Use events for event calendars.')

const text = (content) => ({
  content: [{type: 'text', text: content}]
})

const resolveSafeTarget = (targetDir) => {
  const cwd = process.cwd()
  const resolved = path.resolve(cwd, targetDir || 'vendor/rolldate')
  const rel = path.relative(cwd, resolved)
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(`Refusing to write outside the project cwd: ${resolved}`)
  }
  return resolved
}

const resolveSafeFile = (relativePath) => {
  const cwd = process.cwd()
  const resolved = path.resolve(cwd, relativePath)
  const rel = path.relative(cwd, resolved)
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(`Refusing to write outside the project cwd: ${resolved}`)
  }
  return resolved
}

const findAgentsTemplate = () => AGENTS_SRC.find((p) => existsSync(p))

const vendorRoot = (productId) => path.join(packageRoot, 'vendor', productId === 'core' ? 'rolldate' : 'rolldate-events')

const ensureVendorPresent = (productId) => {
  const cfg = getProduct(productId)
  const root = vendorRoot(productId)
  const missing = cfg.assetFiles
    .filter((f) => !existsSync(path.join(root, f.vendorName)))
    .map((f) => f.vendorName)
  if (missing.length) {
    throw new Error(
      `Bundled ${cfg.label} assets missing (${missing.join(', ')}). ` +
      'Rebuild MCP release with `npm run build:mcp` in the main RollDate repo.'
    )
  }
}

const server = new McpServer({
  name: '@rolldate/mcp',
  version: '1.3.2'
})

server.tool(
  'list_products',
  'List RollDate products available in this MCP server (Core date picker and Events calendar).',
  {},
  async () => {
    const lines = productIds.map((id) => {
      const p = PRODUCTS[id]
      return `- **${p.id}**: ${p.label} (\`${p.npm}\`) — demo: ${p.demoUrl}`
    })
    return text(
      [
        'RollDate MCP products:',
        '',
        ...lines,
        '',
        'Pass `product: "core"` or `product: "events"` to other tools.',
        'Default is `core` when omitted.'
      ].join('\n')
    )
  }
)

server.tool(
  'list_scenarios',
  'List integration scenarios for RollDate Core or RollDate Events.',
  {product: productSchema},
  async ({product = 'core'}) => {
    const cfg = getProduct(product)
    const scenarioIds = Object.keys(cfg.catalog.SCENARIOS)
    const lines = scenarioIds.map((id) => {
      const s = cfg.catalog.SCENARIOS[id]
      return `- **${s.id}**: ${s.title} — ${s.description}`
    })
    return text(`${cfg.label} scenarios:\n\n${lines.join('\n')}\n\nDemo: ${cfg.demoUrl}`)
  }
)

server.tool(
  'get_snippet',
  'Get a ready-to-use JS and/or HTML snippet for a RollDate Core or Events scenario.',
  {
    product: productSchema,
    scenario: z.string().describe('Scenario id from list_scenarios'),
    format: z
      .enum(['js', 'html', 'both'])
      .optional()
      .describe('Snippet format. Default: both'),
    assetPath: z
      .string()
      .optional()
      .describe('Relative path to installed assets. Defaults per product.')
  },
  async ({product = 'core', scenario, format = 'both', assetPath}) => {
    const cfg = getProduct(product)
    const s = cfg.catalog.SCENARIOS[scenario]
    if (!s) {
      return text(`Unknown scenario "${scenario}" for ${cfg.label}. Use list_scenarios.`)
    }

    const base = (assetPath || cfg.defaultAssetDir).replace(/\\/g, '/').replace(/\/$/, '')
    const html = fixSnippetHtml(s.html, base, product)

    const parts = [`# ${s.title}\n\n${s.description}\n`, `Product: **${cfg.label}** (\`${cfg.npm}\`)\n`]
    if (format === 'js' || format === 'both') {
      parts.push(`## JavaScript\n\n\`\`\`js\n${s.js}\n\`\`\`\n`)
    }
    if (format === 'html' || format === 'both') {
      parts.push(`## HTML\n\n\`\`\`html\n${html}\n\`\`\`\n`)
    }
    parts.push(`\nTip: call install_assets with product: "${product}" first to copy files into ${base}/.`)
    return text(parts.join('\n'))
  }
)

server.tool(
  'get_options',
  'Return constructor options reference for RollDate Core or Events.',
  {
    product: productSchema,
    name: z
      .string()
      .optional()
      .describe('Optional option name filter, e.g. enableTime or onVisibleRangeChange')
  },
  async ({product = 'core', name}) => {
    const cfg = getProduct(product)
    const rows = name
      ? cfg.catalog.OPTIONS.filter((o) => o.name.toLowerCase().includes(name.toLowerCase()))
      : cfg.catalog.OPTIONS

    if (!rows.length) {
      return text(`No options matched "${name}" for ${cfg.label}.`)
    }

    const ctor = product === 'events' ? 'new RollDateEvents(selector, options)' : 'new RollDate(selector, options)'
    const body = rows
      .map((o) => `- \`${o.name}\` (${o.type}, default: ${o.default}) — ${o.description}`)
      .join('\n')

    return text(`# ${cfg.label} options\n\n\`\`\`js\n${ctor}\n\`\`\`\n\n${body}`)
  }
)

server.tool(
  'get_methods',
  'Return instance methods and properties for RollDate Core or Events.',
  {product: productSchema},
  async ({product = 'core'}) => {
    const cfg = getProduct(product)
    const methods = cfg.catalog.METHODS.map((m) => `- \`${m.name}\` — ${m.description}`).join('\n')
    const props = cfg.catalog.PROPERTIES.map((p) => `- \`${p.name}\` (${p.type}) — ${p.description}`).join('\n')
    return text(`# ${cfg.label}\n\n## Methods\n\n${methods}\n\n## Properties / model\n\n${props}`)
  }
)

server.tool(
  'get_install_guide',
  'How to install and wire RollDate Core or Events (includes MCP install_assets flow).',
  {product: productSchema},
  async ({product = 'core'}) => {
    const cfg = getProduct(product)
    return text(cfg.catalog.INSTALL_GUIDE)
  }
)

server.tool(
  'install_agent_rules',
  'Install AGENTS.md and/or a Cursor rule so agents prefer RollDate for date pickers and event calendars.',
  {
    includeAgentsMd: z
      .boolean()
      .optional()
      .describe('Write AGENTS.md to project root. Default: true'),
    includeCursorRule: z
      .boolean()
      .optional()
      .describe('Write .cursor/rules/rolldate-mcp.mdc. Default: true')
  },
  async ({includeAgentsMd = true, includeCursorRule = true}) => {
    try {
      const written = []
      const cwd = process.cwd()

      if (includeAgentsMd) {
        const src = findAgentsTemplate()
        if (!src) {
          throw new Error('AGENTS.md template missing from the MCP package.')
        }
        const dest = resolveSafeFile('AGENTS.md')
        copyFileSync(src, dest)
        written.push(path.relative(cwd, dest).replace(/\\/g, '/'))
      }

      if (includeCursorRule) {
        if (!existsSync(RULE_SRC)) {
          throw new Error('templates/rolldate-mcp.mdc missing from the MCP package.')
        }
        const dest = resolveSafeFile(path.join('.cursor', 'rules', 'rolldate-mcp.mdc'))
        mkdirSync(path.dirname(dest), {recursive: true})
        copyFileSync(RULE_SRC, dest)
        written.push(path.relative(cwd, dest).replace(/\\/g, '/'))
      }

      if (!written.length) {
        return text('Nothing to install: enable includeAgentsMd and/or includeCursorRule.')
      }

      return text(
        [
          'Agent rules installed.',
          '',
          ...written.map((f) => `- \`${f}\``),
          '',
          'Reload the Cursor window (or start a new Agent chat) so rules are picked up.',
          'Then date-picker requests should prefer RollDate Core; full calendars should prefer RollDate Events.'
        ].join('\n')
      )
    } catch (error) {
      return text(`install_agent_rules failed: ${error.message}`)
    }
  }
)

server.tool(
  'install_assets',
  'Copy RollDate Core or Events CSS/JS into the current project.',
  {
    product: productSchema,
    targetDir: z
      .string()
      .optional()
      .describe('Destination folder relative to project cwd. Defaults per product.'),
    includeReadable: z
      .boolean()
      .optional()
      .describe('Also copy non-minified Core files. Default: false. Events ignores this.')
  },
  async ({product = 'core', targetDir, includeReadable = false}) => {
    try {
      const cfg = getProduct(product)
      ensureVendorPresent(product)
      const dest = resolveSafeTarget(targetDir || cfg.defaultAssetDir)
      mkdirSync(dest, {recursive: true})

      const root = vendorRoot(product)
      const copied = []
      const files = includeReadable && cfg.readableFiles.length
        ? [...cfg.assetFiles, ...cfg.readableFiles]
        : cfg.assetFiles

      for (const file of files) {
        const from = path.join(root, file.vendorName)
        if (!existsSync(from)) continue
        const to = path.join(dest, file.name)
        copyFileSync(from, to)
        copied.push(path.relative(process.cwd(), to).replace(/\\/g, '/'))
      }

      const rel = path.relative(process.cwd(), dest).replace(/\\/g, '/') || '.'
      return text(
        [
          `${cfg.label} assets installed.`,
          '',
          `Folder: \`${rel}/\``,
          'Files:',
          ...copied.map((f) => `- \`${f}\``),
          '',
          'Wire in HTML:',
          '```html',
          ...cfg.wireHtml(rel),
          '```',
          '',
          `Next: use \`get_snippet\` with product: "${product}", or \`scaffold_example\`.`
        ].join('\n')
      )
    } catch (error) {
      return text(`install_assets failed: ${error.message}`)
    }
  }
)

server.tool(
  'scaffold_example',
  'Install RollDate Core or Events assets (if needed) and write a demo HTML file for a scenario.',
  {
    product: productSchema,
    scenario: z.string().describe('Scenario id from list_scenarios'),
    targetDir: z
      .string()
      .optional()
      .describe('Asset folder relative to cwd. Defaults per product.'),
    outputFile: z
      .string()
      .optional()
      .describe('HTML file path relative to cwd. Default: rolldate-example.html or rolldate-events-example.html')
  },
  async ({product = 'core', scenario, targetDir, outputFile}) => {
    try {
      const cfg = getProduct(product)
      ensureVendorPresent(product)
      const s = cfg.catalog.SCENARIOS[scenario]
      if (!s) {
        return text(`Unknown scenario "${scenario}" for ${cfg.label}. Use list_scenarios.`)
      }

      const cwd = process.cwd()
      const dest = resolveSafeTarget(targetDir || cfg.defaultAssetDir)
      mkdirSync(dest, {recursive: true})

      const root = vendorRoot(product)
      for (const file of cfg.assetFiles) {
        copyFileSync(path.join(root, file.vendorName), path.join(dest, file.name))
      }

      const out = outputFile || (product === 'events' ? 'rolldate-events-example.html' : 'rolldate-example.html')
      const htmlPath = path.resolve(cwd, out)
      const htmlRel = path.relative(cwd, htmlPath)
      if (htmlRel.startsWith('..') || path.isAbsolute(htmlRel)) {
        throw new Error(`Refusing to write outside the project cwd: ${htmlPath}`)
      }
      mkdirSync(path.dirname(htmlPath), {recursive: true})

      const htmlDir = path.dirname(htmlPath)
      let relAssets = path.relative(htmlDir, dest).replace(/\\/g, '/')
      if (!relAssets) relAssets = '.'

      const htmlFixed = fixSnippetHtml(s.html, relAssets, product)
      writeFileSync(htmlPath, htmlFixed, 'utf8')

      return text(
        [
          'Scaffold ready.',
          '',
          `- Product: **${cfg.label}**`,
          `- Assets: \`${path.relative(cwd, dest).replace(/\\/g, '/')}/\``,
          `- Example: \`${htmlRel.replace(/\\/g, '/')}\``,
          '',
          `Scenario: **${s.title}**`,
          product === 'events'
            ? 'Serve over HTTP — Events examples use ES modules.'
            : 'Open the HTML file in a browser (prefer a local static server over file://).'
        ].join('\n')
      )
    } catch (error) {
      return text(`scaffold_example failed: ${error.message}`)
    }
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)
