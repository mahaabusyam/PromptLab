export type DiffLineType = 'same' | 'added' | 'removed'

export interface DiffLine {
  type: DiffLineType
  text: string
}

export function diffLines(before: string, after: string): DiffLine[] {
  const a = before.split('\n')
  const b = after.split('\n')

  // lcs[i][j] = طول أطول تسلسل أسطر مشترك بين a[i..] و b[j..]
  const lcs = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0))
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1])
    }
  }

  // نمشي على الجدول ونقرر لكل سطر: نفسه، انحذف، أو انضاف
  const result: DiffLine[] = []
  let i = 0
  let j = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      result.push({ type: 'same', text: a[i] })
      i++
      j++
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      result.push({ type: 'removed', text: a[i] })
      i++
    } else {
      result.push({ type: 'added', text: b[j] })
      j++
    }
  }
  while (i < a.length) result.push({ type: 'removed', text: a[i++] })
  while (j < b.length) result.push({ type: 'added', text: b[j++] })
  return result
}

export function summarizeDiff(lines: DiffLine[]) {
  return {
    added: lines.filter((l) => l.type === 'added').length,
    removed: lines.filter((l) => l.type === 'removed').length,
  }
}