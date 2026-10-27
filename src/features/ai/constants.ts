import i18n from "i18next";
import "@/i18n"; // يضمن تهيئة الترجمة حتى لو الملف انستورد لحاله
import type { AiLength, AiOptions, AiTask, AiTone } from "./types";

// getters: النص بيُقرأ وقت الاستخدام، فبيتبع اللغة الحالية بدون ما نغيّر مكان الاستدعاء
export const taskLabels: Record<AiTask, string> = {
  get general() {
    return i18n.t("ai.task.general");
  },
  get marketing() {
    return i18n.t("ai.task.marketing");
  },
  get coding() {
    return i18n.t("ai.task.coding");
  },
  get education() {
    return i18n.t("ai.task.education");
  },
  get writing() {
    return i18n.t("ai.task.writing");
  },
  get analysis() {
    return i18n.t("ai.task.analysis");
  },
};

export const toneLabels: Record<AiTone, string> = {
  get neutral() {
    return i18n.t("ai.tone.neutral");
  },
  get professional() {
    return i18n.t("ai.tone.professional");
  },
  get friendly() {
    return i18n.t("ai.tone.friendly");
  },
  get creative() {
    return i18n.t("ai.tone.creative");
  },
};

export const lengthLabels: Record<AiLength, string> = {
  get short() {
    return i18n.t("ai.length.short");
  },
  get medium() {
    return i18n.t("ai.length.medium");
  },
  get long() {
    return i18n.t("ai.length.long");
  },
};

export const DEFAULT_AI_OPTIONS: AiOptions = {
  task: "general",
  tone: "neutral",
  length: "medium",
};
