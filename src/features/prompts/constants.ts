import i18n from "i18next";
import "@/i18n"; // يضمن تهيئة الترجمة حتى لو الملف انستورد لحاله (مثلًا بالاختبارات)
import type {
  ModelProvider,
  PromptCategory,
  PromptSettings,
  PromptStatus,
} from "./types";

// الـ getters بتقرأ الترجمة وقت الاستخدام، فباقي الملفات بتضل تكتب
// categoryLabels[x] بدون أي تعديل، والتسمية بتطلع حسب اللغة الحالية.
export const categoryLabels: Record<PromptCategory, string> = {
  get marketing() {
    return i18n.t("promptCategory.marketing");
  },
  get coding() {
    return i18n.t("promptCategory.coding");
  },
  get education() {
    return i18n.t("promptCategory.education");
  },
  get writing() {
    return i18n.t("promptCategory.writing");
  },
  get "data-analysis"() {
    return i18n.t("promptCategory.data-analysis");
  },
};

export const categoryOrder = Object.keys(categoryLabels) as PromptCategory[];

// أسماء العلامات التجارية بتضل كما هي بكل اللغات
export const providerLabels: Record<ModelProvider, string> = {
  anthropic: "Claude",
  openai: "GPT",
  google: "Gemini",
};

export const statusLabels: Record<PromptStatus, string> = {
  get draft() {
    return i18n.t("promptStatus.draft");
  },
  get testing() {
    return i18n.t("promptStatus.testing");
  },
  get production() {
    return i18n.t("promptStatus.production");
  },
};

export const defaultPromptSettings: PromptSettings = {
  temperature: 0.7,
  maxTokens: 2048,
  topP: 0.95,
  strictSchema: true,
};
export const FREE_TIER_PROMPT_LIMIT = 200;
export const MAX_OUTPUT_TOKENS = 8192;

export const modelCatalog: {
  name: string;
  provider: ModelProvider;
  context: string;
}[] = [
  { name: "Claude 3.5 Sonnet", provider: "anthropic", context: "200k" },
  { name: "GPT-4o", provider: "openai", context: "128k" },
  { name: "Gemini 1.5 Pro", provider: "google", context: "1M" },
];
