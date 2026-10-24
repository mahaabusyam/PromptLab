/** شكل المتغير كنص. CodeMirror بيستخدمه كمان، فبنصدّره بدل ما نكرر الـ regex */
export const VARIABLE_SOURCE = String.raw`\{\{\s*([a-zA-Z_]\w*)\s*\}\}`
const VARIABLE_PATTERN = new RegExp(VARIABLE_SOURCE, 'g')

export type TemplateSegment =
  | { kind: 'text'; text: string }
  | { kind: 'variable'; name: string }

/** أسماء المتغيرات بالترتيب بدون تكرار: "{{a}} {{b}} {{a}}" ← ['a', 'b'] */
export function extractVariables(template: string): string[] {
  const names = new Set<string>()
  for (const match of template.matchAll(VARIABLE_PATTERN)) names.add(match[1])
  return [...names]
}

/** بيستبدل كل متغير بقيمته. إذا القيمة فاضية بيترك {{name}} كما هو */
export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(VARIABLE_PATTERN, (placeholder, name: string) =>
    values[name]?.trim() ? values[name] : placeholder,
  )
}

/** بيقسم النص لأجزاء (نص عادي / متغير) عشان نعرض المتغيرات كـ chips */
export function splitTemplate(template: string): TemplateSegment[] {
  const segments: TemplateSegment[] = []
  let lastIndex = 0

  for (const match of template.matchAll(VARIABLE_PATTERN)) {
    const index = match.index ?? 0
    if (index > lastIndex) segments.push({ kind: 'text', text: template.slice(lastIndex, index) })
    segments.push({ kind: 'variable', name: match[1] })
    lastIndex = index + match[0].length
  }

  if (lastIndex < template.length) {
    segments.push({ kind: 'text', text: template.slice(lastIndex) })
  }
  return segments
}
/** يقصّ النص لعدد حروف معيّن، وما بيترك {{variable}} مقطوع من النص */
export function truncateTemplate(content: string, maxChars: number): string {
  if (content.length <= maxChars) return content
  let cut = content.slice(0, maxChars)
  // إذا انقطعنا جوّا متغيّر ({{ بدون }})، نرجع لقبله
  if (cut.lastIndexOf('{{') > cut.lastIndexOf('}}')) cut = cut.slice(0, cut.lastIndexOf('{{'))
  return `${cut.trimEnd()}…`
}