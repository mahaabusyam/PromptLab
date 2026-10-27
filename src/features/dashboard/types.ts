import type { PromptStatus } from "@/features/prompts/types";

export type ModelTone = "secondary" | "primary" | "tertiary";

export interface ModelShare {
  label: string;
  percent: number;
  tone: ModelTone;
}

export interface WelcomeSummary {
  userName: string;
  activeTests: number;
  modelCount: number;
  efficiencyGain: number;
}

export interface DashboardStats {
  totalPrompts: { value: number; newThisMonth: number; trend: number[] };
  favorites: {
    value: number;
    shareOfLibraryPercent: number;
    productionReadyPercent: number;
  };
  projects: { value: number; subfolderCount: number; modelSplit: ModelShare[] };
  savedTime: { hours: number; estimatedRoi: string; trend: number[] }; // Demo
}

export type PromptFilter = "all" | PromptStatus;

export type TemplateAccent = ModelTone;
export type TemplateIconKey = "email" | "docs" | "refactor";

export interface QuickTemplate {
  id: string;
  title: string;
  description: string;
  iconKey: TemplateIconKey;
  accent: TemplateAccent;
}

export interface PlaygroundConfig {
  modelName: string;
  template: string;
  defaultValues: Record<string, string>;
  requiredVariables: string[];
  simulatedOutput: string;
}

export interface ModelBenchmark {
  id: string;
  name: string;
  tone: ModelTone;
  latencyMs: number;
  accuracyPercent: number;
  scorePercent: number;
}
