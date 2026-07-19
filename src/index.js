#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import {
  DEMO_URL,
  INSTALL_GUIDE,
  METHODS,
  OPTIONS,
  PROPERTIES,
  SCENARIOS
} from './catalog.js'

const scenarioIds = Object.keys(SCENARIOS)

const text = (content) => ({
  content: [{ type: 'text', text: content }]
})

const server = new McpServer({
  name: 'rolldate-mcp',
  version: '1.0.0'
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
  'Get a ready-to-use RollDate JS and/or HTML snippet for a scenario.',
  {
    scenario: z
      .enum(scenarioIds)
      .describe(`Scenario id. One of: ${scenarioIds.join(', ')}`),
    format: z
      .enum(['js', 'html', 'both'])
      .optional()
      .describe('Snippet format. Default: both')
  },
  async ({ scenario, format = 'both' }) => {
    const s = SCENARIOS[scenario]
    if (!s) {
      return text(`Unknown scenario: ${scenario}. Use list_scenarios.`)
    }

    const parts = [`# ${s.title}\n\n${s.description}\n`]
    if (format === 'js' || format === 'both') {
      parts.push(`## JavaScript\n\n\`\`\`js\n${s.js}\n\`\`\`\n`)
    }
    if (format === 'html' || format === 'both') {
      parts.push(`## HTML\n\n\`\`\`html\n${s.html}\n\`\`\`\n`)
    }
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
  async ({ name }) => {
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
  'How to install and wire RollDate CSS/JS in a project.',
  {},
  async () => text(INSTALL_GUIDE)
)

const transport = new StdioServerTransport()
await server.connect(transport)
