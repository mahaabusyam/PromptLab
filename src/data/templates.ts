import type { Template } from '@/features/templates/schemas';
import type { TemplateCategory, TemplateProvider } from '@/features/templates/types';

// If TypeScript complains here, replace the right-hand strings with the
// exact values used by promptCategorySchema / modelProviderSchema in your project.
const CAT = {
  marketing: 'marketing',
  coding: 'coding',
  education: 'education',
  writing: 'writing',
  data: 'data-analysis',
} as const satisfies Record<string, TemplateCategory>;

const MODEL = {
  openai: 'openai',
  anthropic: 'anthropic',
  google: 'google',
} as const satisfies Record<string, TemplateProvider>;

export const templateCatalog: Template[] = [
  {
    id: 'tpl-cold-email',
    title: 'Cold Email Pitch Engine',
    description:
      'Writes a short, personalized B2B outreach email with a specific hook and one clear ask, without robotic jargon.',
    category: CAT.marketing,
    provider: MODEL.anthropic,
    complexity: 'few-shot',
    tags: ['email', 'outreach', 'b2b'],
    content: `You are a senior B2B sales copywriter.

Write a cold email to a {{persona}} at {{company}}.

Rules:
- Max 120 words, 3 short paragraphs.
- Open with this specific hook: {{hook}}
- One concrete benefit, no buzzwords, no flattery.
- End with ONE low-friction call to action (a question, not a meeting demand).

Return: subject line (max 6 words) and the email body.`,
  },
  {
    id: 'tpl-saas-seo',
    title: 'SaaS SEO Copywriter',
    description:
      'Produces search-intent-focused landing page copy with benefit-led headings and natural keyword placement.',
    category: CAT.marketing,
    provider: MODEL.openai,
    complexity: 'few-shot',
    tags: ['seo', 'landing-page', 'saas'],
    content: `Act as an SEO copywriter for SaaS products.

Target keyword: {{target_kw}}
Audience: {{audience}}
Tone: {{tone}}

Write a landing page with:
1. H1 containing the keyword naturally
2. A 2-sentence intro answering the search intent
3. Three H2 sections, each led by a benefit
4. A short FAQ (3 questions)
5. Meta title (max 60 chars) and meta description (max 155 chars)

Avoid keyword stuffing. Keep reading level at grade 8.`,
  },
  {
    id: 'tpl-product-launch',
    title: 'Product Launch Announcement',
    description:
      'Turns a feature or product into a launch post tailored to the channel you will publish on.',
    category: CAT.marketing,
    provider: MODEL.openai,
    complexity: 'zero-shot',
    tags: ['launch', 'social', 'announcement'],
    content: `Write a launch announcement for {{product_name}}.

Audience: {{audience}}
Main benefit: {{key_benefit}}
Channel: {{channel}}

Match the length and style of the channel. Lead with the benefit, not the feature.
Include one clear call to action. Give 3 headline options first.`,
  },
  {
    id: 'tpl-code-refactor',
    title: 'Code Refactoring Reviewer',
    description:
      'Finds anti-patterns, improves complexity and readability, and explains every change it makes.',
    category: CAT.coding,
    provider: MODEL.openai,
    complexity: 'few-shot',
    tags: ['refactor', 'review', 'clean-code'],
    content: `You are a senior {{language}} engineer doing a code review.

Goal of the refactor: {{goal}}

Code:
{{source_code}}

Return:
1. A list of problems found (ordered by impact)
2. The refactored code
3. A short explanation for each change
4. Unit test cases that protect the behavior

Do not change public behavior unless you say so explicitly.`,
  },
  {
    id: 'tpl-api-docs',
    title: 'API Documentation Synthesizer',
    description:
      'Reads an OpenAPI spec and writes clear markdown docs with copy-paste ready request examples.',
    category: CAT.coding,
    provider: MODEL.anthropic,
    complexity: 'few-shot',
    tags: ['openapi', 'docs', 'sdk'],
    content: `Generate developer documentation from this OpenAPI spec:

{{openapi_spec}}

For every endpoint write: purpose, parameters table, response example, and error cases.
Add a request example for each of these languages: {{languages}}.
Finish with a "Getting started" section (auth, base URL, first call).`,
  },
  {
    id: 'tpl-multi-agent',
    title: 'Autonomous Multi-Agent Orchestrator',
    description:
      'Breaks a complex goal into Planner, Tool-caller and Reviewer roles, with a reflection loop before the final answer.',
    category: CAT.coding,
    provider: MODEL.anthropic,
    complexity: 'multi-agent',
    featured: true,
    tags: ['agents', 'planning', 'tools'],
    content: `You coordinate three roles: Planner, Executor and Reviewer.

User goal: {{user_goal}}
Available tools: {{available_tools}}
Constraints: {{constraints}}

Process:
1. PLANNER: split the goal into numbered steps, each with a success check.
2. EXECUTOR: carry out one step at a time using only the listed tools. Show the tool call and its result.
3. REVIEWER: after every step, verify the success check. If it fails, send feedback to the Planner and retry (max 2 retries).
4. When all steps pass, write the final answer and list any assumptions made.

Never invent tool results. If a step is impossible with the given tools, say so and stop.`,
  },
  {
    id: 'tpl-socratic-tutor',
    title: 'Socratic Tutor',
    description:
      'Teaches through guiding questions instead of giving away answers, adapted to the learner level.',
    category: CAT.education,
    provider: MODEL.anthropic,
    complexity: 'few-shot',
    tags: ['tutor', 'learning', 'questions'],
    content: `You are a patient tutor of {{subject}} teaching a {{student_level}} learner.

Concept to teach: {{concept}}

Rules:
- Never give the final answer directly.
- Ask ONE guiding question at a time and wait for the reply.
- If the learner is stuck twice, give a small hint, then ask again.
- Praise reasoning, not only correct answers.
- After the learner reaches the answer, summarize the idea in 2 sentences.

Start by asking what the learner already knows about the concept.`,
  },
  {
    id: 'tpl-lesson-plan',
    title: 'Lesson Plan Builder',
    description:
      'Builds a timed lesson plan with objectives, activities and a short check for understanding.',
    category: CAT.education,
    provider: MODEL.openai,
    complexity: 'zero-shot',
    tags: ['lesson', 'teacher', 'plan'],
    content: `Create a lesson plan.

Topic: {{topic}}
Grade level: {{grade_level}}
Duration: {{duration}}

Include: 2-3 measurable learning objectives, a minute-by-minute timeline,
one hands-on activity, 3 check-for-understanding questions, and a short homework idea.`,
  },
  {
    id: 'tpl-exec-brief',
    title: 'Executive Brief Writer',
    description:
      'Turns raw metrics into a short executive memo that leads with the conclusion and the decision needed.',
    category: CAT.writing,
    provider: MODEL.openai,
    complexity: 'zero-shot',
    tags: ['memo', 'summary', 'kpi'],
    content: `Write an executive brief for {{audience}} about the {{department}} department.

Raw data:
{{metrics_raw}}

Structure (Minto pyramid):
1. Conclusion in one sentence
2. Three supporting points, each with a number
3. Risks (max 2)
4. The decision or action required

Max 180 words. No filler.`,
  },
  {
    id: 'tpl-blog-outline',
    title: 'Blog Post Outline',
    description:
      'Creates a clear outline with a hook, section goals and a conclusion for any topic and audience.',
    category: CAT.writing,
    provider: MODEL.anthropic,
    complexity: 'zero-shot',
    tags: ['blog', 'outline', 'content'],
    content: `Create a blog post outline about {{topic}} for {{audience}}.

Tone: {{tone}}

Give: 3 title options, a one-line hook, 5-7 sections (each with its goal in one sentence),
and a conclusion with a call to action.`,
  },
  {
    id: 'tpl-sql-debugger',
    title: 'SQL Query & Schema Debugger',
    description:
      'Finds slow or unsafe queries, rewrites them for the given dialect, and suggests indexes.',
    category: CAT.data,
    provider: MODEL.google,
    complexity: 'few-shot',
    tags: ['sql', 'performance', 'indexes'],
    content: `You are a database performance engineer working with {{dialect}}.

Schema:
{{schema_ddl}}

Query to review:
{{sql_query}}

Return:
1. Problems (performance and safety, including injection risks)
2. The optimized query
3. Suggested indexes with the reason for each
4. How to verify the improvement (what to look for in the query plan)`,
  },
  {
    id: 'tpl-synthetic-data',
    title: 'Synthetic Data & Edge-Case Generator',
    description:
      'Generates schema-valid JSON test records, including the edge cases that usually break parsers.',
    category: CAT.data,
    provider: MODEL.google,
    complexity: 'few-shot',
    tags: ['json', 'testing', 'edge-cases'],
    content: `Generate {{record_count}} test records that strictly follow this JSON schema:

{{json_schema}}

Include these edge cases: {{edge_types}}.
Mark which records are edge cases with a "_note" field.
Output only valid JSON (an array), no commentary.`,
  },
];