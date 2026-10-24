import type { Folder, Prompt, PromptCategory, PromptStatus } from '@/features/prompts/types'

const claude: Prompt['model'] = { name: 'Claude 3.5 Sonnet', provider: 'anthropic' }
const gpt4o: Prompt['model'] = { name: 'GPT-4o', provider: 'openai' }
const gemini: Prompt['model'] = { name: 'Gemini 1.5 Pro', provider: 'google' }

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3_600_000).toISOString()

interface SeedInput {
  id: string
  title: string
  description: string
  content: string
  status: PromptStatus
  category: PromptCategory
  tags: string[]
  model: Prompt['model']
  folderId: string
  version: string
  updatedHoursAgo: number
  isFavorite?: boolean
}

function seed({ version, updatedHoursAgo, isFavorite = false, ...rest }: SeedInput): Prompt {
  const updatedAt = hoursAgo(updatedHoursAgo)
  return {
    ...rest,
    isFavorite,
    isArchived: false,
    versions: [
      {
        id: `${rest.id}-${version}`,
        label: version,
        content: rest.content,
        note: 'Initial version',
        createdAt: hoursAgo(updatedHoursAgo + 72),
      },
    ],
    createdAt: hoursAgo(updatedHoursAgo + 24 * 30),
    updatedAt,
  }
}

export const seedFolders: Folder[] = [
  { id: 'f-dev', name: 'Developer Tools', parentId: null },
  { id: 'f-dev-backend', name: 'Backend APIs', parentId: 'f-dev' },
  { id: 'f-dev-react', name: 'React Components', parentId: 'f-dev' },
  { id: 'f-dev-sql', name: 'SQL & DB Tuning', parentId: 'f-dev' },
  { id: 'f-mkt', name: 'Marketing 2026', parentId: null },
  { id: 'f-mkt-saas', name: 'SaaS Copywriting', parentId: 'f-mkt' },
  { id: 'f-mkt-email', name: 'Email Sequences', parentId: 'f-mkt' },
  { id: 'f-client', name: 'Client Solutions', parentId: null },
  { id: 'f-personal', name: 'Personal Experiments', parentId: null },
]

export const seedPrompts: Prompt[] = [
  seed({
    id: 'p-1',
    title: 'React Component Refactor Engine',
    description: 'Refactors legacy components into idiomatic TypeScript with tests.',
    content:
      'Refactor the following {{component}} written in {{source_syntax}} into idiomatic TypeScript with {{testing_library}} specs. Keep the public API unchanged and explain each change.',
    status: 'production',
    category: 'coding',
    tags: ['React', 'TypeScript', 'Refactoring'],
    model: claude,
    folderId: 'f-dev-react',
    version: 'v1.4',
    updatedHoursAgo: 2,
    isFavorite: true,
  }),
  seed({
    id: 'p-2',
    title: 'High-Converting SaaS Hero Copy',
    description: 'Three-tier hook copy for SaaS landing pages.',
    content:
      'You are an elite conversion copywriter. Craft a 3-tier hook for {{product_topic}} targeting {{target_audience}} with {{persuasive_tone}} tone. Provide {{variant_count}} variants.',
    status: 'production',
    category: 'marketing',
    tags: ['Marketing', 'SaaS', 'Copywriting'],
    model: gpt4o,
    folderId: 'f-mkt-saas',
    version: 'v2.1',
    updatedHoursAgo: 4,
    isFavorite: true,
  }),
  seed({
    id: 'p-3',
    title: 'Postgres Query Index Optimizer',
    description: 'Finds query plan bottlenecks and suggests composite indexes.',
    content:
      'Analyze the provided slow query plan for {{table_name}} with {{query_statement}} and suggest composite indexes for {{workload_type}}. Explain the trade-offs of each index.',
    status: 'testing',
    category: 'coding',
    tags: ['SQL', 'Postgres', 'Performance'],
    model: gemini,
    folderId: 'f-dev-sql',
    version: 'v3.0',
    updatedHoursAgo: 26,
  }),
  seed({
    id: 'p-4',
    title: 'Multi-Modal UI Generator',
    description: 'Turns wireframes into accessible Tailwind components.',
    content:
      'Inspect the provided wireframe image {{wireframe_upload}} and generate accessible Tailwind CSS components with {{color_mode}} tokens. Follow WCAG AA.',
    status: 'draft',
    category: 'coding',
    tags: ['UI/UX', 'Tailwind', 'DesignSystem'],
    model: claude,
    folderId: 'f-dev-react',
    version: 'v0.9',
    updatedHoursAgo: 72,
  }),
  seed({
    id: 'p-5',
    title: 'Autonomous API Docs Synthesizer',
    description: 'Generates multi-language API examples from an OpenAPI spec.',
    content:
      'Parse OpenAPI 3.1 JSON spec from {{spec_payload}} and generate complete curl, Python, and TypeScript examples with {{auth_method}} authentication. Include {{error_format}} error examples.',
    status: 'production',
    category: 'coding',
    tags: ['OpenAPI', 'APIDocs', 'DevTools'],
    model: claude,
    folderId: 'f-dev-backend',
    version: 'v1.8',
    updatedHoursAgo: 24 * 160,
  }),
  seed({
    id: 'p-6',
    title: 'Customer Churn Risk Analyzer',
    description: 'Scores churn risk from customer telemetry events.',
    content:
      'Evaluate customer telemetry events for {{account_id}} across {{lookback_window}} and compute a churn probability matrix based on {{feature_drop}}. Return {{output_format}}.',
    status: 'production',
    category: 'data-analysis',
    tags: ['DataAnalysis', 'Telemetry', 'Retention'],
    model: gpt4o,
    folderId: 'f-client',
    version: 'v2.0',
    updatedHoursAgo: 24 * 162,
  }),
  seed({
    id: 'p-7',
    title: 'Full-Stack System Architect',
    description: 'Designs DDD microservice skeletons with event-driven flows.',
    content:
      'You are a principal software architect. Design a DDD microservice skeleton for {{domain}} using an event-driven architecture and strict API contracts.',
    status: 'production',
    category: 'coding',
    tags: ['React', 'TypeScript', 'Architecture'],
    model: claude,
    folderId: 'f-dev-backend',
    version: 'v3.2',
    updatedHoursAgo: 24 * 170,
  }),
  seed({
    id: 'p-8',
    title: 'Cold Email Sequence Writer',
    description: 'Writes a personalized 4-step outreach sequence.',
    content:
      'Write a 4-step cold email sequence for {{company}} about {{pain_point}}. Keep each email under {{word_limit}} words and end with a single call to action.',
    status: 'testing',
    category: 'marketing',
    tags: ['Outreach', 'Email', 'Sales'],
    model: gpt4o,
    folderId: 'f-mkt-email',
    version: 'v1.1',
    updatedHoursAgo: 24 * 175,
  }),
]