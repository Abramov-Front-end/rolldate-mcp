#!/usr/bin/env node
import {copyFileSync, existsSync, mkdirSync, writeFileSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js'
import {z} from 'zod'
import {
  DEMO_URL,
  INSTALL_GUIDE,
  METHODS,
  OPTIONS,
  PROPERTIES,
  SCENARIOS
} from './catalog.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(__dirname, '..')
const vendorDir = path.join(packageRoot, 'vendor', 'rolldate')

const ASSET_FILES = [
  {name: 'rolldate.min.js', from: path.join(vendorDir, 'rolldate.min.js')},
  {name: 'rolldate.min.css', from: path.join(vendorDir, 'rolldate.min.css')}
]

const READABLE_FILES = [
  {name: 'rolldate.js', from: path.join(vendorDir, 'rolldate.js')},
  {name: 'rolldate.css', from: path.join(vendorDir, 'rolldate.css')}
]

const scenarioIds = Object.keys(SCENARIOS)

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

const ensureVendorPresent = () => {
  const missing = ASSET_FILES.filter((f) => !existsSync(f.from)).map((f) => f.name)
  if (missing.length) {
    throw new Error(
      `Bundled RollDate assets missing (${missing.join(', ')}). ` +
      'Rebuild MCP release with `npm run build:mcp` in the main RollDate repo.'
    )
  }
}

const server = new McpServer({
  name: 'rolldate-mcp',
  version: '1.1.0'
})

server.tool(
  'list_scenarios',
  'List available RollDate integration scenarios (single, range, time, etc.).',
  {},
  async () => {
    const lines = scenarioIds.map((id) => {
      const s = SCENARIOS[id]
      return `- **${s.id}**: ${s.title} — ${s.description}`
    })
    return text(`RollDate scenarios:\n\n${lines.join('\n')}\n\nDemo: ${DEMO_URL}`)
  }
)

server.tool(
  'get_snippet',
  'Get a ready-to-use RollDate JS and/or HTML snippet for a scenario. Paths assume assets in vendor/rolldate/.',
  {
    scenario: z
      .enum(scenarioIds)
      .describe(`Scenario id. One of: ${scenarioIds.join(', ')}`),
    format: z
      .enum(['js', 'html', 'both'])
      .optional()
      .describe('Snippet format. Default: both'),
    assetPath: z
      .string()
      .optional()
      .describe('Relative path to installed assets. Default: vendor/rolldate')
  },
  async ({scenario, format = 'both', assetPath = 'vendor/rolldate'}) => {
    const s = SCENARIOS[scenario]
    if (!s) {
      return text(`Unknown scenario: ${scenario}. Use list_scenarios.`)
    }

    const base = assetPath.replace(/\\/g, '/').replace(/\/$/, '')
    const html = s.html
      .replaceAll('./dist/css/rolldate.min.css', `./${base}/rolldate.min.css`)
      .replaceAll('./dist/js/rolldate.min.js', `./${base}/rolldate.min.js`)

    const parts = [`# ${s.title}\n\n${s.description}\n`]
    if (format === 'js' || format === 'both') {
      parts.push(`## JavaScript\n\n\`\`\`js\n${s.js}\n\`\`\`\n`)
    }
    if (format === 'html' || format === 'both') {
      parts.push(`## HTML\n\n\`\`\`html\n${html}\n\`\`\`\n`)
    }
    parts.push(
      `\nTip: call \`install_assets\` first to copy files into \`${base}/`.`
    )
    return text(parts.join('\n'))
  }
)

server.tool(
  'get_options',
  'Return RollDate constructor options reference.',
  {
    name: z
      .string()
      .optional()
      .describe('Optional option name filter, e.g. enableTime')
  },
  async ({name}) => {
    const rows = name
      ? OPTIONS.filter((o) => o.name.toLowerCase().includes(name.toLowerCase()))
      : OPTIONS

    if (!rows.length) {
      return text(`No options matched "${name}".`)
    }

    const body = rows
      .map((o) => `- \`${o.name}\` (${o.type}, default: ${o.default}) — ${o.description}`)
      .join('\n')

    return text(`# RollDate options\n\n\`\`\`js\nnew RollDate(selector, options)\n\`\`\`\n\n${body}`)
  }
)

server.tool(
  'get_methods',
  'Return RollDate instance methods and properties.',
  {},
  async () => {
    const methods = METHODS.map((m) => `- \`${m.name}\` — ${m.description}`).join('\n')
    const props = PROPERTIES.map((p) => `- \`${p.name}\` (${p.type}) — ${p.description}`).join('\n')
    return text(`# Methods\n\n${methods}\n\n# Properties\n\n${props}`)
  }
)

server.tool(
  'get_install_guide',
  'How to install and wire RollDate CSS/JS in a project (includes MCP install_assets flow).',
  {},
  async () => text(INSTALL_GUIDE)
)

server.tool(
  'install_assets',
  'Copy RollDate CSS/JS into the current project so the library can be used (not just documented).',
  {
    targetDir: z
      .string()
      .optional()
      .describe('Destination folder relative to project cwd. Default: vendor/rolldate'),
    includeReadable: z
      .boolean()
      .optional()
      .describe('Also copy non-minified rolldate.js / rolldate.css. Default: false')
  },
  async ({targetDir = 'vendor/rolldate', includeReadable = false}) => {
    try {
      ensureVendorPresent()
      const dest = resolveSafeTarget(targetDir)
      mkdirSync(dest, {recursive: true})

      const copied = []
      const files = includeReadable ? [...ASSET_FILES, ...READABLE_FILES] : ASSET_FILES
      for (const file of files) {
        if (!existsSync(file.from)) continue
        const to = path.join(dest, file.name)
        copyFileSync(file.from, to)
        copied.push(path.relative(process.cwd(), to).replace(/\\/g, '/'))
      }

      const rel = path.relative(process.cwd(), dest).replace(/\\/g, '/') || '.'
      return text(
        [
          'RollDate assets installed.',
          '',
          `Folder: \`${rel}/\``,
          'Files:',
          ...copied.map((f) => `- \`${f}\``),
          '',
          'Wire in HTML:',
          '```html',
          `<link rel="stylesheet" href="./${rel}/rolldate.min.css">`,
          `<script src="./${rel}/rolldate.min.js"></script>`,
          '<script>',
          "  new RollDate('#date-input');",
          '</script>',
          '```',
          '',
          'Next: use `get_snippet` for a full example, or `scaffold_example` to write a demo HTML file.'
        ].join('\n')
      )
    } catch (error) {
      return text(`install_assets failed: ${error.message}`)
    }
  }
)

server.tool(
  'scaffold_example',
  'Install RollDate assets (if needed) and write a demo HTML file for a scenario.',
  {
    scenario: z
      .enum(scenarioIds)
      .describe(`Scenario id. One of: ${scenarioIds.join(', ')}`),
    targetDir: z
      .string()
      .optional()
      .describe('Asset folder relative to cwd. Default: vendor/rolldate'),
    outputFile: z
      .string()
      .optional()
      .describe('HTML file path relative to cwd. Default: rolldate-example.html')
  },
  async ({scenario, targetDir = 'vendor/rolldate', outputFile = 'rolldate-example.html'}) => {
    try {
      ensureVendorPresent()
      const s = SCENARIOS[scenario]
      if (!s) {
        return text(`Unknown scenario: ${scenario}. Use list_scenarios.`)
      }

      const cwd = process.cwd()
      const dest = resolveSafeTarget(targetDir)
      mkdirSync(dest, {recursive: true})
      for (const file of ASSET_FILES) {
        copyFileSync(file.from, path.join(dest, file.name))
      }

      const htmlPath = path.resolve(cwd, outputFile)
      const htmlRel = path.relative(cwd, htmlPath)
      if (htmlRel.startsWith('..') || path.isAbsolute(htmlRel)) {
        throw new Error(`Refusing to write outside the project cwd: ${htmlPath}`)
      }
      mkdirSync(path.dirname(htmlPath), {recursive: true})

      const htmlDir = path.dirname(htmlPath)
      let relAssets = path.relative(htmlDir, dest).replace(/\\/g, '/')
      if (!relAssets) relAssets = '.'

      const htmlFixed = s.html
        .replaceAll('./dist/css/rolldate.min.css', `${relAssets}/rolldate.min.css`)
        .replaceAll('./dist/js/rolldate.min.js', `${relAssets}/rolldate.min.js`)

      writeFileSync(htmlPath, htmlFixed, 'utf8')

      return text(
        [
          'Scaffold ready.',
          '',
          `- Assets: \`${path.relative(cwd, dest).replace(/\\/g, '/')}/\``,
          `- Example: \`${htmlRel.replace(/\\/g, '/')}\``,
          '',
          `Scenario: **${s.title}**`,
          'Open the HTML file in a browser (prefer a local static server over file://).'
        ].join('\n')
      )
    } catch (error) {
      return text(`scaffold_example failed: ${error.message}`)
    }
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)
