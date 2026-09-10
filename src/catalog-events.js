/**
 * RollDate Events knowledge catalog for MCP tools.
 * Keep in sync with @rolldate/events docs (stable 1.x).
 */

export const DEMO_URL = 'https://rolldate.dev/events/demo'
export const DOCS_URL = 'https://rolldate.dev/events/docs'

export const OPTIONS = [
  { name: 'events', type: 'Event[]', default: '[]', description: 'Initial event list' },
  { name: 'defaultView', type: "'month' | 'week' | 'day' | 'agenda'", default: "'month'", description: 'Initial calendar view' },
  { name: 'defaultDate', type: 'Date | string', default: 'today', description: 'Initial cursor date' },
  { name: 'locale', type: 'string', default: 'browser', description: 'Locale for labels and formatting' },
  { name: 'firstDayOfWeek', type: '0 | 1', default: '1', description: '0 = Sunday, 1 = Monday week start' },
  { name: 'theme', type: "'light' | 'dark' | 'auto'", default: "'dark'", description: 'Color theme' },
  { name: 'header', type: 'boolean', default: 'true', description: 'Show built-in header toolbar' },
  { name: 'visibleHours', type: '{ start: number; end: number }', default: '{ start: 9, end: 18 }', description: 'Hour band for week/day grids' },
  { name: 'eventLimit', type: 'number', default: '3', description: 'Max chips per month cell before "+N more"' },
  { name: 'minDate', type: 'Date | string', default: '—', description: 'Earliest navigable calendar day' },
  { name: 'maxDate', type: 'Date | string', default: '—', description: 'Latest navigable calendar day' },
  { name: 'onEventClick', type: 'function', default: 'noop', description: 'Fired when an event is clicked' },
  { name: 'onDateClick', type: 'function', default: 'noop', description: 'Fired when a date cell is clicked' },
  { name: 'onViewChange', type: 'function', default: 'noop', description: 'Fired when the active view changes' },
  { name: 'onVisibleRangeChange', type: 'function', default: 'noop', description: 'Fired when the buffered visible range changes — use for lazy loading' }
]

export const METHODS = [
  { name: 'setView(view)', description: 'Switch to month, week, day, or agenda' },
  { name: 'setDate(date)', description: 'Move the calendar cursor to a date' },
  { name: 'setEvents(events)', description: 'Replace the full event list' },
  { name: 'getEvents()', description: 'Return the current event list' },
  { name: 'addEvent(event)', description: 'Append one event' },
  { name: 'updateEvent(id, patch)', description: 'Patch an event by id' },
  { name: 'removeEvent(id)', description: 'Remove an event by id' },
  { name: 'today()', description: 'Jump to today' },
  { name: 'next()', description: 'Navigate forward in the current view' },
  { name: 'prev()', description: 'Navigate backward in the current view' },
  { name: 'destroy()', description: 'Remove the calendar and detach listeners' }
]

export const PROPERTIES = [
  { name: 'Event.id', type: 'string | number', description: 'Unique event identifier' },
  { name: 'Event.title', type: 'string', description: 'Display title' },
  { name: 'Event.start / end', type: 'Date | string', description: 'Timed or all-day bounds' },
  { name: 'Event.allDay', type: 'boolean', description: 'All-day event when true' },
  { name: 'Event.color', type: 'string', description: 'Hex or CSS accent color' }
]

const SAMPLE_EVENTS = `[
  {
    id: 1,
    title: 'Standup',
    start: '2026-09-08T09:00:00',
    end: '2026-09-08T09:30:00',
    color: '#609ef1'
  },
  {
    id: 2,
    title: 'Design review',
    start: '2026-09-10T14:00:00',
    end: '2026-09-10T15:00:00',
    color: '#8b5cf6'
  }
]`

const htmlShell = (bodyInner, scriptInner) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>RollDate Events</title>
  <link rel="stylesheet" href="./vendor/rolldate-events/rolldate-events.css">
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; padding: 16px; background: #0f1115; color: #eceff4; }
    #calendar { min-height: 640px; }
  </style>
</head>
<body>
${bodyInner}
<script type="module">
${scriptInner}
</script>
</body>
</html>`

const importLine = `import { RollDateEvents } from './vendor/rolldate-events/rolldate-events.mjs'
import './vendor/rolldate-events/rolldate-events.css'
`

export const SCENARIOS = {
  month: {
    id: 'month',
    title: 'Month view',
    description: 'Default month grid with a small sample event set.',
    js: `${importLine}
const calendar = new RollDateEvents('#calendar', {
  defaultView: 'month',
  theme: 'dark',
  events: ${SAMPLE_EVENTS},
  onEventClick: (event) => console.log(event.title)
})`,
    html: htmlShell(
      `  <div id="calendar"></div>`,
      `${importLine}
const calendar = new RollDateEvents('#calendar', {
  defaultView: 'month',
  theme: 'dark',
  events: ${SAMPLE_EVENTS},
  onEventClick: (event) => console.log(event.title)
})`
    )
  },
  week: {
    id: 'week',
    title: 'Week view',
    description: 'Timed week grid with visible hour band.',
    js: `${importLine}
new RollDateEvents('#calendar', {
  defaultView: 'week',
  theme: 'dark',
  visibleHours: { start: 7, end: 20 },
  events: ${SAMPLE_EVENTS}
})`,
    html: htmlShell(
      `  <div id="calendar"></div>`,
      `${importLine}
new RollDateEvents('#calendar', {
  defaultView: 'week',
  theme: 'dark',
  visibleHours: { start: 7, end: 20 },
  events: ${SAMPLE_EVENTS}
})`
    )
  },
  day: {
    id: 'day',
    title: 'Day view',
    description: 'Single-day timed grid.',
    js: `${importLine}
new RollDateEvents('#calendar', {
  defaultView: 'day',
  theme: 'dark',
  events: ${SAMPLE_EVENTS}
})`,
    html: htmlShell(
      `  <div id="calendar"></div>`,
      `${importLine}
new RollDateEvents('#calendar', {
  defaultView: 'day',
  theme: 'dark',
  events: ${SAMPLE_EVENTS}
})`
    )
  },
  agenda: {
    id: 'agenda',
    title: 'Agenda view',
    description: 'Continuous agenda list grouped by day.',
    js: `${importLine}
new RollDateEvents('#calendar', {
  defaultView: 'agenda',
  theme: 'dark',
  events: ${SAMPLE_EVENTS}
})`,
    html: htmlShell(
      `  <div id="calendar"></div>`,
      `${importLine}
new RollDateEvents('#calendar', {
  defaultView: 'agenda',
  theme: 'dark',
  events: ${SAMPLE_EVENTS}
})`
    )
  },
  'range-loading': {
    id: 'range-loading',
    title: 'Lazy loading via onVisibleRangeChange',
    description: 'Load events for the visible buffered range instead of mounting everything at once.',
    js: `${importLine}
let events = []

const calendar = new RollDateEvents('#calendar', {
  defaultView: 'month',
  theme: 'dark',
  events,
  onVisibleRangeChange(range) {
    // Fetch or generate events for range.from … range.to, then:
    // events = mergeEvents(events, fetched)
    // calendar.setEvents(events)
    console.log('Visible range', range.from, range.to)
  }
})`,
    html: htmlShell(
      `  <div id="calendar"></div>`,
      `${importLine}
let events = []

const calendar = new RollDateEvents('#calendar', {
  defaultView: 'month',
  theme: 'dark',
  events,
  onVisibleRangeChange(range) {
    console.log('Visible range', range.from, range.to)
  }
})`
    )
  }
}

export const INSTALL_GUIDE = `# RollDate Events install

## npm (recommended for apps)

\`\`\`bash
npm install @rolldate/events
\`\`\`

\`\`\`js
import { RollDateEvents } from '@rolldate/events'
import '@rolldate/events/styles'

const calendar = new RollDateEvents('#calendar', {
  defaultView: 'month',
  events: []
})
\`\`\`

## Via this MCP (static / demo HTML)

1. Call \`install_assets\` with \`product: "events"\` — copies \`rolldate-events.mjs\` + \`rolldate-events.css\` into \`vendor/rolldate-events/\`.
2. Call \`get_snippet\` or \`scaffold_example\` with \`product: "events"\`.
3. Serve the page over HTTP (ES modules do not work reliably from \`file://\`).

## Notes

- Free and MIT licensed, zero runtime dependencies: Month, Week, Day, and Agenda views.
- Use \`onVisibleRangeChange\` for large datasets — keep mounted DOM bounded.
- For date-only inputs (not a full calendar), prefer **RollDate Core** via \`product: "core"\`.
- Live demo: ${DEMO_URL}
- Docs: ${DOCS_URL}
`
