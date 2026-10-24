import type { ModelBenchmark, PlaygroundConfig } from '@/features/dashboard/types'

export const playgroundConfig: PlaygroundConfig = {
  modelName: 'Claude 3.5 Sonnet',
  template:
    'You are an expert copywriter. Write a {{tone}} launch announcement for {{topic}} targeting {{audience}}. Ensure the tone reflects {{brand_voice}}.',
  defaultValues: {
    tone: 'Persuasive & Visionary',
    topic: 'PromptLab 2.0 Engine',
    audience: 'Senior AI Engineers & VP Product',
    brand_voice: 'Technical and confident',
  },
  requiredVariables: ['tone', 'topic'],
  simulatedOutput:
    'Today, we bridge deterministic architecture and generative capability. Introducing PromptLab 2.0, the telemetry workbench built for architects who reject hallucination.',
}

export const modelBenchmarks: ModelBenchmark[] = [
  { id: 'm-1', name: 'Claude 3.5 Sonnet', tone: 'secondary', latencyMs: 280, accuracyPercent: 99.1, scorePercent: 94 },
  { id: 'm-2', name: 'GPT-4o', tone: 'primary', latencyMs: 315, accuracyPercent: 98.4, scorePercent: 89 },
  { id: 'm-3', name: 'Gemini 1.5 Pro', tone: 'tertiary', latencyMs: 190, accuracyPercent: 96.8, scorePercent: 91 },
]