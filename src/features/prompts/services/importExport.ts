import { exportFileSchema } from "../schemas";
import type { ExportFile, Folder, Prompt } from "../types";

export function buildExportFile(
  prompts: Prompt[],
  folders: Folder[],
): ExportFile {
  return {
    app: "promptlab",
    version: 1,
    exportedAt: new Date().toISOString(),
    prompts,
    folders,
  };
}

export { downloadJson } from "@/utils/download";

// code = نوع الخطأ (الواجهة بتترجمه). error = نص إنجليزي للمطوّرين والاختبارات
export type ParseFailure =
  | { ok: false; code: "invalid_json"; error: string }
  | {
      ok: false;
      code: "invalid_export";
      error: string;
      where: string;
      detail: string;
    };

export type ParseResult = { ok: true; data: ExportFile } | ParseFailure;

/** أي ملف مستورد ما بنثق فيه. نتحقق منه بـ Zod قبل ما يلمس الـ store */
export function parseImportText(text: string): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return {
      ok: false,
      code: "invalid_json",
      error: "This file is not valid JSON.",
    };
  }
  const result = exportFileSchema.safeParse(raw);
  if (!result.success) {
    const issue = result.error.issues[0];
    const where = issue.path.join(".") || "file";
    return {
      ok: false,
      code: "invalid_export",
      error: `Not a valid PromptLab export (${where}: ${issue.message}).`,
      where,
      detail: issue.message,
    };
  }
  return { ok: true, data: result.data };
}
