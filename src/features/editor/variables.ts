const SAMPLES: Record<string, string> = {
  topic: 'AI Prompt Optimization Platform',
  tone: 'Persuasive & Visionary',
  target_audience: 'Senior AI Engineers & Founders',
  brand_voice: 'Authoritative, sleek, technical yet accessible',
  key_benefits: '• 10x faster prompt diffing\n• Deterministic CI/CD checks\n• Sub-cent token tracking',
}

export function sampleValueFor(name: string): string {
  return SAMPLES[name] ?? `Example ${name.replace(/_/g, ' ')}`
}

/** بيعبّي المتغيرات الفاضية بس. اللي كتبتيه بإيدك ما بينلمس */
export function autoFillValues(names: string[], existing: Record<string, string>): Record<string, string> {
  const next = { ...existing }
  names.forEach((name) => {
    if (!next[name]?.trim()) next[name] = sampleValueFor(name)
  })
  return next
}