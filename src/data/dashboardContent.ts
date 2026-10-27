import type { QuickTemplate } from "@/features/dashboard/types";

export const quickTemplates: QuickTemplate[] = [
  {
    id: "t-1",
    title: "Cold Email Pitch Engine",
    description:
      "Calculates recipient company pain-points from Crunchbase signals and writes hyper-personalized outreaches.",
    iconKey: "email",
    accent: "primary",
  },
  {
    id: "t-2",
    title: "API Docs Synthesizer",
    description:
      "Ingests raw OpenAPI 3.1 JSON schemas and outputs production-grade Mintlify & Docusaurus MDX specs.",
    iconKey: "docs",
    accent: "secondary",
  },
  {
    id: "t-3",
    title: "Code Refactoring Agent",
    description:
      "Eliminates anti-patterns, optimizes space/time complexity, and writes comprehensive Vitest test coverage suites.",
    iconKey: "refactor",
    accent: "tertiary",
  },
];

export const totalTemplates = 84;
