import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const WRITE = process.argv.includes('--write')

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })

// Data files hold prompt/template TEXT, never class names
const files = walk('src').filter(
  (f) => /\.tsx?$/.test(f) && !/\.test\./.test(f) && !f.startsWith(join('src', 'data')),
)

// Tailwind v4: physical class → logical class
const MAP = {
  'rounded-tl': 'rounded-ss',
  'rounded-tr': 'rounded-se',
  'rounded-bl': 'rounded-es',
  'rounded-br': 'rounded-ee',
  'rounded-l': 'rounded-s',
  'rounded-r': 'rounded-e',
  'border-l': 'border-s',
  'border-r': 'border-e',
  'text-left': 'text-start',
  'text-right': 'text-end',
  ml: 'ms',
  mr: 'me',
  pl: 'ps',
  pr: 'pe',
  left: 'start',
  right: 'end',
}
// These short names are classes only when followed by "-" (so side="left" stays untouched)
const NEEDS_DASH = new Set(['ml', 'mr', 'pl', 'pr', 'left', 'right'])
const names = Object.keys(MAP)
  .sort((a, b) => b.length - a.length)
  .join('|')
const CLASS_RE = new RegExp('(^|[\\s"\'`:{(!])(-?)(' + names + ')(?=-|[\\s"\'`)}\\],;]|$)', 'g')

// <ChevronRight ... className="..."> (plain string className) → mirror in RTL
const ICON_RE = /(<(?:ChevronLeft|ChevronRight|ArrowLeft|ArrowRight)\b[^>]*?className=")(?!rtl:-scale-x-100)/g

const REVIEW = [
  [/translate-x/, 'translate-x: add an rtl: variant if it must flip'],
  [/space-x-|divide-x/, 'space-x / divide-x: check spacing in RTL'],
  [/origin-(left|right)/, 'transform origin'],
  [/\bfloat-(left|right)\b/, 'float'],
  [/<(ChevronLeft|ChevronRight|ArrowLeft|ArrowRight)\b(?![^>]*className=")/, 'icon without plain className: flip by hand'],
  [/<(ChevronLeft|ChevronRight|ArrowLeft|ArrowRight)\b[^>]*className=\{/, 'icon with dynamic className: flip by hand'],
  [/\b(x|xPercent):\s*-?\d/, 'GSAP horizontal move: mirror for RTL'],
  [/e\.key === 'Arrow(Left|Right)'/, 'keyboard arrows: swap in RTL'],
]

let totalChanges = 0
const review = []

for (const file of files) {
  const source = readFileSync(file, 'utf8')
  let fileChanges = 0

  const lines = source.split('\n').map((line, index) => {
    for (const [pattern, note] of REVIEW) {
      if (pattern.test(line)) review.push(`${file}:${index + 1}  [${note}]  ${line.trim().slice(0, 110)}`)
    }
    const classes = line.replace(CLASS_RE, (match, pre, neg, name, offset) => {
      const rest = line.slice(offset + match.length)
      if (NEEDS_DASH.has(name) && !rest.startsWith('-')) return match
      if ((name === 'left' || name === 'right') && rest.startsWith('-1/2')) return match
      fileChanges += 1
      return pre + neg + MAP[name]
    })
    return classes.replace(ICON_RE, (match) => {
      fileChanges += 1
      return match + 'rtl:-scale-x-100 '
    })
  })

  if (fileChanges > 0) {
    console.log(`${String(fileChanges).padStart(3)}  ${file}`)
    totalChanges += fileChanges
    if (WRITE) writeFileSync(file, lines.join('\n'))
  }
}

console.log(`\n${WRITE ? 'CHANGED' : 'WOULD CHANGE'}: ${totalChanges} edits\n`)
console.log(`--- Review by hand (${review.length}) ---`)
review.forEach((item) => console.log(item))