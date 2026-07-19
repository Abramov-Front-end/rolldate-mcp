/**
 * RollDate knowledge catalog for MCP tools.
 * Keep in sync with release docs when shipping a new RollDate version.
 */

export const DEMO_URL = 'https://rolldate-demo.vercel.app/'

export const OPTIONS = [
  { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color theme' },
  { name: 'selectType', type: "'single' | 'range' | 'multi'", default: "'single'", description: 'Selection mode' },
  { name: 'startDate', type: 'string | Date', default: 'today', description: 'Initial calendar position / value' },
  { name: 'minDate', type: 'string | Date', default: '100 years ago', description: 'Minimum selectable date' },
  { name: 'maxDate', type: 'string | Date', default: '100 years ahead', description: 'Maximum selectable date' },
  { name: 'dateFormat', type: 'string', default: "'DD.MM.YYYY' or from locale", description: 'Input/output date format' },
  { name: 'locale', type: 'string', default: '—', description: 'Browser locale hint for default dateFormat' },
  { name: 'startWeekFromMonday', type: 'boolean', default: 'true', description: 'Week starts on Monday when true' },
  { name: 'disabledDates', type: 'string[]', default: '[]', description: 'Dates that cannot be selected' },
  { name: 'closeOnSelect', type: 'boolean', default: 'true', description: 'Close popup after selection (single mode)' },
  { name: 'triggerSelector', type: 'string', default: '—', description: 'CSS selector for open trigger' },
  { name: 'monthsNames', type: 'string[]', default: 'English month names', description: 'Full month labels' },
  { name: 'monthsShortNames', type: 'string[]', default: 'English short names', description: 'Short month labels' },
  { name: 'weekDaysNames', type: 'string[]', default: 'Sun…Sat', description: 'Weekday headers' },
  { name: 'enableTime', type: 'boolean', default: 'false', description: 'Show scrollable time picker in footer' },
  { name: 'use12Hour', type: 'boolean', default: 'false', description: '12-hour time + AM/PM column' },
  { name: 'timeStep', type: 'number', default: '1', description: 'Minute step (e.g. 5 → 00, 05, 10…)' },
  { name: 'footerButtons', type: 'FooterButton[]', default: '[]', description: 'Custom footer buttons' },
  { name: 'selectDate', type: 'function', default: 'logs to console', description: 'Selection callback' },
  { name: 'onOpen', type: 'function', default: 'noop', description: 'Popup opened' },
  { name: 'onClose', type: 'function', default: 'noop', description: 'Popup closed' },
  { name: 'onViewChange', type: 'function', default: 'noop', description: 'Day/month/year view changed' },
  { name: 'onHoverDate', type: 'function', default: 'noop', description: 'Day hover in calendar' }
]

export const METHODS = [
  { name: 'open()', description: 'Show popup (popup mode)' },
  { name: 'close()', description: 'Hide popup' },
  { name: 'selectToday()', description: 'Select today (respects disabled dates; applies time if enabled)' },
  { name: 'clearSelection()', description: 'Clear current selection' },
  { name: 'setDisabledDates(dates)', description: 'Replace full disabled list' },
  { name: 'disableDate(dateLike)', description: 'Disable one date' },
  { name: 'enableDate(dateLike)', description: 'Enable one date' },
  { name: 'isDateDisabled(dateLike)', description: 'Returns boolean' },
  { name: 'destroy()', description: 'Remove picker from DOM and detach listeners' }
]

export const PROPERTIES = [
  { name: 'selectedDates', type: 'Date[]', description: 'Currently selected dates (read-only)' },
  { name: 'period', type: "'day' | 'month' | 'year'", description: 'Current calendar view' }
]

const SCRIPT_BOOT = `<script src="./dist/js/rolldate.min.js"></script>`

const htmlShell = (bodyInner, scriptInner) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>RollDate</title>
  <link rel="stylesheet" href="./dist/css/rolldate.min.css">
  <style>
    body { font-family: system-ui, sans-serif; padding: 24px; background: #111827; color: #e5e7eb; }
    input { font-size: 16px; padding: 10px 12px; border-radius: 8px; border: 1px solid #4b5563; background: #0f172a; color: #e5e7eb; width: min(100%, 320px); }
  </style>
</head>
<body>
${bodyInner}
${SCRIPT_BOOT}
<script>
${scriptInner}
</script>
</body>
</html>`

export const SCENARIOS = {
  single: {
    id: 'single',
    title: 'Single date (popup)',
    description: 'Basic popup picker on one input. Dark theme by default.',
    js: `new RollDate('#date-input', {
  selectDate(date) {
    console.log(date);
  }
});`,
    html: htmlShell(
      `  <input id="date-input" type="text" placeholder="Select date" autocomplete="off">`,
      `new RollDate('#date-input');`
    )
  },
  'single-light': {
    id: 'single-light',
    title: 'Single date (popup, light)',
    description: 'Popup picker with light theme.',
    js: `new RollDate('#date-input', {
  theme: 'light'
});`,
    html: htmlShell(
      `  <input id="date-input" type="text" placeholder="Select date" autocomplete="off">`,
      `new RollDate('#date-input', { theme: 'light' });`
    )
  },
  inline: {
    id: 'inline',
    title: 'Inline calendar',
    description: 'Render calendar inside a container (no popup).',
    js: `new RollDate('#calendar', {
  theme: 'dark'
});`,
    html: htmlShell(
      `  <div id="calendar"></div>`,
      `new RollDate('#calendar', { theme: 'dark' });`
    )
  },
  range: {
    id: 'range',
    title: 'Date range (one input)',
    description: 'Select start and end date into a single field.',
    js: `new RollDate('#range-input', {
  selectType: 'range'
});`,
    html: htmlShell(
      `  <input id="range-input" type="text" placeholder="Select range" autocomplete="off">`,
      `new RollDate('#range-input', { selectType: 'range' });`
    )
  },
  'range-two': {
    id: 'range-two',
    title: 'Date range (two inputs)',
    description: 'Start and end fields as selector array.',
    js: `new RollDate(['#start', '#end'], {
  selectType: 'range'
});`,
    html: htmlShell(
      `  <input id="start" type="text" placeholder="Start" autocomplete="off">
  <input id="end" type="text" placeholder="End" autocomplete="off">`,
      `new RollDate(['#start', '#end'], { selectType: 'range' });`
    )
  },
  multi: {
    id: 'multi',
    title: 'Multi select',
    description: 'Pick multiple dates; keep popup open.',
    js: `new RollDate('#multi-input', {
  selectType: 'multi',
  closeOnSelect: false
});`,
    html: htmlShell(
      `  <input id="multi-input" type="text" placeholder="Select dates" autocomplete="off">`,
      `new RollDate('#multi-input', { selectType: 'multi', closeOnSelect: false });`
    )
  },
  trigger: {
    id: 'trigger',
    title: 'Open via button',
    description: 'Open calendar from an external button, not input focus.',
    js: `new RollDate('#date-input', {
  triggerSelector: '#open-calendar'
});`,
    html: htmlShell(
      `  <input id="date-input" type="text" placeholder="Select date" autocomplete="off">
  <button type="button" id="open-calendar">Open</button>`,
      `new RollDate('#date-input', { triggerSelector: '#open-calendar' });`
    )
  },
  'time-24': {
    id: 'time-24',
    title: 'Date + time (24h)',
    description: 'Scrollable time picker, 24-hour format.',
    js: `new RollDate('#datetime-input', {
  enableTime: true,
  timeStep: 5,
  use12Hour: false,
  closeOnSelect: false,
  footerButtons: [
    { text: 'Now', action: 'today' },
    { text: 'Apply', onClick: (p) => p.close() }
  ]
});`,
    html: htmlShell(
      `  <input id="datetime-input" type="text" placeholder="Date and time" autocomplete="off">`,
      `new RollDate('#datetime-input', {
  enableTime: true,
  timeStep: 5,
  use12Hour: false,
  closeOnSelect: false,
  footerButtons: [
    { text: 'Now', action: 'today' },
    { text: 'Apply', onClick: (p) => p.close() }
  ]
});`
    )
  },
  'time-12': {
    id: 'time-12',
    title: 'Date + time (12h)',
    description: 'Scrollable time picker with AM/PM.',
    js: `new RollDate('#datetime-input', {
  enableTime: true,
  timeStep: 15,
  use12Hour: true,
  closeOnSelect: false
});`,
    html: htmlShell(
      `  <input id="datetime-input" type="text" placeholder="Date and time (12h)" autocomplete="off">`,
      `new RollDate('#datetime-input', {
  enableTime: true,
  timeStep: 15,
  use12Hour: true,
  closeOnSelect: false
});`
    )
  },
  disabled: {
    id: 'disabled',
    title: 'Disabled dates + runtime API',
    description: 'Block dates and change them at runtime.',
    js: `const picker = new RollDate('#date-input', {
  disabledDates: ['25.12.2026', '31.12.2026'],
  closeOnSelect: false
});
picker.disableDate('01.01.2027');
picker.enableDate('31.12.2026');`,
    html: htmlShell(
      `  <input id="date-input" type="text" placeholder="Try blocked days" autocomplete="off">`,
      `const picker = new RollDate('#date-input', {
  disabledDates: ['25.12.2026', '31.12.2026'],
  closeOnSelect: false
});
picker.disableDate('01.01.2027');
picker.enableDate('31.12.2026');`
    )
  },
  footer: {
    id: 'footer',
    title: 'Footer buttons',
    description: 'Built-in today/clear actions plus custom onClick.',
    js: `new RollDate('#date-input', {
  closeOnSelect: false,
  footerButtons: [
    { text: 'Today', action: 'today' },
    { text: 'Clear', action: 'clear' },
    { text: 'Done', onClick: (picker) => picker.close() }
  ]
});`,
    html: htmlShell(
      `  <input id="date-input" type="text" placeholder="With footer" autocomplete="off">`,
      `new RollDate('#date-input', {
  closeOnSelect: false,
  footerButtons: [
    { text: 'Today', action: 'today' },
    { text: 'Clear', action: 'clear' },
    { text: 'Done', onClick: (picker) => picker.close() }
  ]
});`
    )
  }
}

export const INSTALL_GUIDE = `# RollDate install

## Recommended (via this MCP)

1. Call \`install_assets\` — copies \`rolldate.min.js\` + \`rolldate.min.css\` into \`vendor/rolldate/\` (or your folder).
2. Call \`get_snippet\` or \`scaffold_example\` — get / write HTML+JS wiring.
3. Or call \`scaffold_example\` alone — installs assets and writes \`rolldate-example.html\`.

## Manual HTML

\`\`\`html
<link rel="stylesheet" href="./vendor/rolldate/rolldate.min.css">
<input id="date-input" type="text" placeholder="Select date" autocomplete="off">
<script src="./vendor/rolldate/rolldate.min.js"></script>
<script>
  new RollDate('#date-input');
</script>
\`\`\`

## Notes

- The IIFE build sets \`window.RollDate\` automatically. Do **not** overwrite it with \`module.exports\` shims.
- On mobile, use \`font-size: 16px\` on inputs and a viewport with \`maximum-scale=1\` / \`user-scalable=no\` to avoid iOS zoom on focus.
- Live demo: ${DEMO_URL}
- Contact: rolldate.support@gmail.com
`
