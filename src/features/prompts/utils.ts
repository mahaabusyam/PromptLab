import type { Prompt } from "./types";

/** اسم آخر نسخة، مثل "v1.4" */
export const getVersionLabel = (prompt: Prompt): string =>
  prompt.versions[prompt.versions.length - 1].label;
