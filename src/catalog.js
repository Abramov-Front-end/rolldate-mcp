/**
 * RollDate knowledge catalog for MCP tools.
 * Keep in sync with release docs when shipping a new RollDate version.
 */

export const DEMO_URL = 'https://rolldate.dev/'

export const OPTIONS = [
  { name: 'theme', type: "'main' | 'dark' | 'light'", default: "'main'", description: 'Color theme (main is default). Override color tokens such as --rd-accent on .RollDate__container — see https://rolldate.dev/docs/css-variables' },
  { name: 'selectType', type: "'single' | 'range' | 'multi'", default: "'single'", description: 'Selection mode' },
  { name: 'startDate', type: 'string | Date', default: 'today', description: 'Initial calendar position / value' },
  { name: 'minDate', type: 'string | Date', default: '100 years ago', description: 'Minimum selectable date' },
  { name: 'maxDate', type: 'string | Date', default: '100 years ahead', description: 'Maximum selectable date' },
  { name: 'dateFormat', type: 'string', default: "'DD.MM.YYYY' or from locale", description: 'Input/output date format' },
  { name: 'locale', type: 'string', default: '—', description: 'BCP 47 locale for dateFormat and accessible labels' },
  { name: 'previousMonthLabel', type: 'string', default: "'Previous month' or Ukrainian from locale", description: 'Accessible name for previous-month button' },
  { name: 'nextMonthLabel', type: 'string', default: "'Next month' or Ukrainian from locale", description: 'Accessible name for next-month button' },
  { name: 'startWeekFromMonday', type: 'boolean', default: 'true', description: 'Week starts on Monday when true' },
  { name: 'disabledDates', type: 'DateRule[]', default: '[]', description: 'Denylist: exact dates, inclusive ranges, weekly/monthly repeats, or callbacks. Always wins over enabledDates' },
  { name: 'enabledDates', type: 'DateRule[]', default: 'undefined', description: 'Allowlist: when set, every other date is blocked. Omit for all dates (except disabled/min-max). [] blocks every date' },
  { name: 'highlightDates', type: '(string|Date|{date,color?,colors?})[]', default: '[]', description: 'Dot markers on days; optional color(s) per date' },
  { name: 'rangePresets', type: 'RangePreset[]', default: '[]', description: 'Quick range buttons (range mode): { label, getRange(picker) → [start,end], id? }. Ready set: presets([...ids], { locale }) from @rolldate/core/presets (window.RollDatePresets). Active preset gets --active + aria-pressed' },
  { name: 'presetsLabel', type: 'string', default: "''", description: 'Accessible name for the presets group' },
  { name: 'closeOnSelect', type: 'boolean', default: 'true', description: 'Close popup after selection (single mode)' },
  { name: 'triggerSelector', type: 'string', default: '—', description: 'CSS selector for open trigger' },
  { name: 'monthsNames', type: 'string[]', default: 'English month names', description: 'Full month labels' },
  { name: 'monthsShortNames', type: 'string[]', default: 'English short names', description: 'Short month labels' },
  { name: 'weekDaysNames', type: 'string[]', default: 'Sun…Sat', description: 'Weekday headers' },
  { name: 'enableTime', type: 'boolean', default: 'false', description: 'Show scrollable time picker in footer' },
  { name: 'use12Hour', type: 'boolean', default: 'false', description: '12-hour time + AM/PM toggle beside rolls' },
  { name: 'timePosition', type: "'right' | 'bottom'", default: "'right'", description: 'Desktop time panel placement; mobile always bottom' },
  { name: 'timeStep', type: 'number', default: '1', description: 'Minute step (e.g. 5 → 00, 05, 10…)' },
  { name: 'hapticFeedback', type: 'boolean', default: 'true', description: 'Tick feedback on month/year/decade/time changes on touch-primary devices (vibrate or soft click)' },
  { name: 'scrollSpeed', type: 'number', default: '1', description: 'Wheel/touch speed multiplier. 1 is the default; 0.7 slower, 1.5 faster; 0 disables scroll (arrows and keyboard still work)' },
  { name: 'footerButtons', type: 'FooterButton[]', default: '[]', description: 'Custom footer buttons: any text, action today | clear | close or onClick(picker); variant primary | secondary | link; position left | right (left group at start, rest at end); className, ariaLabel' },
  { name: 'selectDate', type: 'function', default: 'logs to console', description: 'Selection callback' },
  { name: 'onOpen', type: 'function', default: 'noop', description: 'Popup opened' },
  { name: 'onClose', type: 'function', default: 'noop', description: 'Popup closed' },
  { name: 'onViewChange', type: 'function', default: 'noop', description: 'Day/month/year view changed' },
  { name: 'onHoverDate', type: 'function', default: 'noop', description: 'Day hover in calendar' }
]

export const METHODS = [
  { name: 'open()', description: 'Show popup (popup mode)' },
  { name: 'close(opts?)', description: 'Hide popup; pass { restoreFocus: true } to return focus to the opener' },
  { name: 'selectToday()', description: 'Select today (respects disabled dates; applies time if enabled)' },
  { name: 'clearSelection()', description: 'Clear current selection' },
  { name: 'goToDate(dateLike)', description: 'Navigate calendar to date without selecting' },
  { name: 'getValue()', description: 'Current value: Date|null (single) or Date[] (range/multi)' },
  { name: 'setValue(value)', description: 'Set selection programmatically; null clears' },
  { name: 'getViewMonth()', description: 'Visible month { year, month } (follows scroll)' },
  { name: 'getViewDate()', description: 'First day of visible month' },
  { name: 'setDisabledDates(dates)', description: 'Replace the full disabledDates rule list' },
  { name: 'setEnabledDates(dates?)', description: 'Replace the allowlist. undefined turns it off; [] blocks every date. Non-array values are ignored and keep the current allowlist. Unavailable selected dates are dropped and selectDate runs' },
  { name: 'disableDate(dateLike)', description: 'Disable one exact date' },
  { name: 'enableDate(dateLike)', description: 'Remove one exact denylist entry only; cannot override weekly/monthly/range/callback disabledDates rules' },
  { name: 'isDateDisabled(dateLike)', description: 'True if the date cannot be selected (min/max, enabledDates, disabledDates)' },
  { name: 'setHighlightDates(dates)', description: 'Replace highlight markers in place without rebuilding the calendar' },
  { name: 'highlightDate(dateLike, color?)', description: 'Add a dot marker in place (append)' },
  { name: 'unhighlightDate(dateLike, color?)', description: 'Remove dot marker(s) in place' },
  { name: 'isDateHighlighted(dateLike)', description: 'Returns boolean' },
  { name: 'getHighlightColors(dateLike)', description: 'Dot colors for a day' },
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
    title: 'Availability rules',
    description: 'Allowlist weekends, then block exceptions with disabledDates.',
    js: `const picker = new RollDate('#date-input', {
  enabledDates: [{ repeat: 'weekly', weekdays: [0, 6] }],
  disabledDates: ['26.12.2026'],
  closeOnSelect: false
});
picker.disableDate('01.01.2027');`,
    html: htmlShell(
      `  <input id="date-input" type="text" placeholder="Weekends only" autocomplete="off">`,
      `const picker = new RollDate('#date-input', {
  enabledDates: [{ repeat: 'weekly', weekdays: [0, 6] }],
  disabledDates: ['26.12.2026'],
  closeOnSelect: false
});
picker.disableDate('01.01.2027');`
    )
  },
  footer: {
    id: 'footer',
    title: 'Footer buttons',
    description: 'Built-in today/clear/close actions plus custom onClick; variants primary/secondary/link; position left/right.',
    js: `new RollDate('#date-input', {
  closeOnSelect: false,
  footerButtons: [
    { text: 'Clear', action: 'clear', variant: 'link', position: 'left' },
    { text: 'Today', action: 'today', variant: 'secondary' },
    { text: 'Done', variant: 'primary', onClick: (picker) => picker.close() }
  ]
});`,
    html: htmlShell(
      `  <input id="date-input" type="text" placeholder="With footer" autocomplete="off">`,
      `new RollDate('#date-input', {
  closeOnSelect: false,
  footerButtons: [
    { text: 'Clear', action: 'clear', variant: 'link', position: 'left' },
    { text: 'Today', action: 'today', variant: 'secondary' },
    { text: 'Done', variant: 'primary', onClick: (picker) => picker.close() }
  ]
});`
    )
  },
  highlight: {
    id: 'highlight',
    title: 'Highlighted dates',
    description: 'Dot markers with optional colors; multiple dots per day.',
    js: `new RollDate('#calendar', {
  highlightDates: [
    { date: '15.08.2026', color: '#22c55e' },
    { date: '20.08.2026', colors: ['#ef4444', '#a855f7'] }
  ]
});`,
    html: htmlShell(
      `  <div id="calendar"></div>`,
      `new RollDate('#calendar', {
  highlightDates: [
    { date: '15.08.2026', color: '#22c55e' },
    { date: '20.08.2026', colors: ['#ef4444', '#a855f7'] }
  ]
});`
    )
  },
  'range-presets': {
    id: 'range-presets',
    title: 'Range presets',
    description: 'Ready presets from the optional plugin (@rolldate/core/presets, window.RollDatePresets) plus a custom one. Ids: today, yesterday, tomorrow, thisWeek, lastWeek, nextWeek, weekToDate, weekend, last7, last14, last30, last90, next7, next14, next30, thisMonth, lastMonth, nextMonth, monthToDate, thisQuarter, lastQuarter, nextQuarter, quarterToDate, thisYear, lastYear, nextYear, yearToDate, last12Months; lastN/nextN(n, unit).',
    js: `import RollDate from '@rolldate/core';
import { presets, lastN } from '@rolldate/core/presets';

new RollDate('#range', {
  selectType: 'range',
  closeOnSelect: false,
  presetsLabel: 'Quick select',
  rangePresets: [
    ...presets(['today', 'thisWeek', 'last7', 'last30', 'thisMonth', 'lastQuarter'], { locale: 'en' }),
    lastN(6, 'month'),
    {
      id: 'visibleMonth',
      label: 'Visible month',
      getRange(picker) {
        const { year, month } = picker.getViewMonth();
        return [new Date(year, month, 1), new Date(year, month + 1, 0)];
      }
    }
  ]
});`,
    html: htmlShell(
      `  <input id="range" type="text" placeholder="Select range" autocomplete="off">
<script src="./dist/js/rolldate-presets.min.js"></script>`,
      `new RollDate('#range', {
  selectType: 'range',
  closeOnSelect: false,
  presetsLabel: 'Quick select',
  rangePresets: RollDatePresets.presets(['today', 'thisWeek', 'last7', 'last30', 'thisMonth', 'lastQuarter'])
});`
    )
  }
}

export const INSTALL_GUIDE = `# RollDate install

## Recommended (via this MCP)

1. Call \`install_agent_rules\` — drop \`AGENTS.md\` + Cursor rule into the project (optional but recommended).
2. Call \`install_assets\` — copies \`rolldate.min.js\` + \`rolldate.min.css\` into \`vendor/rolldate/\`.
3. Call \`get_snippet\` or \`scaffold_example\` — get / write HTML+JS wiring.

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
