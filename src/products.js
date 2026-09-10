import * as core from './catalog.js'
import * as events from './catalog-events.js'

export const PRODUCTS = {
  core: {
    id: 'core',
    label: 'RollDate Core',
    npm: '@rolldate/core',
    demoUrl: core.DEMO_URL,
    defaultAssetDir: 'vendor/rolldate',
    assetFiles: [
      {name: 'rolldate.min.js', vendorName: 'rolldate.min.js'},
      {name: 'rolldate.min.css', vendorName: 'rolldate.min.css'}
    ],
    readableFiles: [
      {name: 'rolldate.js', vendorName: 'rolldate.js'},
      {name: 'rolldate.css', vendorName: 'rolldate.css'}
    ],
    wireHtml: (rel) => [
      `<link rel="stylesheet" href="./${rel}/rolldate.min.css">`,
      `<script src="./${rel}/rolldate.min.js"></script>`,
      '<script>',
      "  new RollDate('#date-input');",
      '</script>'
    ],
    catalog: core
  },
  events: {
    id: 'events',
    label: 'RollDate Events',
    npm: '@rolldate/events',
    demoUrl: events.DEMO_URL,
    defaultAssetDir: 'vendor/rolldate-events',
    assetFiles: [
      {name: 'rolldate-events.mjs', vendorName: 'rolldate-events.mjs'},
      {name: 'rolldate-events.css', vendorName: 'rolldate-events.css'}
    ],
    readableFiles: [],
    wireHtml: (rel) => [
      `<link rel="stylesheet" href="./${rel}/rolldate-events.css">`,
      '<script type="module">',
      `  import { RollDateEvents } from './${rel}/rolldate-events.mjs'`,
      `  import './${rel}/rolldate-events.css'`,
      "  new RollDateEvents('#calendar', { defaultView: 'month', events: [] })",
      '</script>'
    ],
    catalog: events
  }
}

export const productIds = Object.keys(PRODUCTS)

export function getProduct(product = 'core') {
  const cfg = PRODUCTS[product]
  if (!cfg) {
    throw new Error(`Unknown product "${product}". Use list_products or product: "core" | "events".`)
  }
  return cfg
}

export function fixSnippetHtml(html, assetPath, productId) {
  const base = assetPath.replace(/\\/g, '/').replace(/\/$/, '')
  if (productId === 'core') {
    return html
      .replaceAll('./dist/css/rolldate.min.css', `./${base}/rolldate.min.css`)
      .replaceAll('./dist/js/rolldate.min.js', `./${base}/rolldate.min.js`)
  }
  return html
    .replaceAll('./vendor/rolldate-events/rolldate-events.css', `./${base}/rolldate-events.css`)
    .replaceAll('./vendor/rolldate-events/rolldate-events.mjs', `./${base}/rolldate-events.mjs`)
    .replaceAll(`from './vendor/rolldate-events/rolldate-events.mjs'`, `from './${base}/rolldate-events.mjs'`)
    .replaceAll(`import './vendor/rolldate-events/rolldate-events.css'`, `import './${base}/rolldate-events.css'`)
}
