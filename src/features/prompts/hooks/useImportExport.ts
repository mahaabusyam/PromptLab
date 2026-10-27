import { useState } from "react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { usePromptStore } from "@/stores/promptStore";
import {
  buildExportFile,
  downloadJson,
  parseImportText,
} from "../services/importExport";

export interface TransferStatus {
  type: "success" | "error";
  message: string;
}

export function useImportExport() {
  const { t } = useTranslation();
  const prompts = usePromptStore((s) => s.prompts);
  const folders = usePromptStore((s) => s.folders);
  const importData = usePromptStore((s) => s.importData);
  const [status, setStatus] = useState<TransferStatus | null>(null);

  const exportAll = () => {
    const stamp = format(new Date(), "yyyy-MM-dd");
    downloadJson(
      buildExportFile(prompts, folders),
      `promptlab-export-${stamp}.json`,
    );
    setStatus({
      type: "success",
      message: t("library.transfer.exported", { total: prompts.length }),
    });
  };

  const importFile = async (file: File) => {
    const result = parseImportText(await file.text());
    if (!result.ok) {
      const message =
        result.code === "invalid_json"
          ? t("library.transfer.invalidJson")
          : t("library.transfer.invalidExport", {
              where: result.where,
              detail: result.detail,
            });
      setStatus({ type: "error", message });
      return;
    }
    importData(result.data, "merge"); // دمج: ما بنمسح اللي موجود
    setStatus({
      type: "success",
      message: t("library.transfer.imported", {
        total: result.data.prompts.length,
      }),
    });
  };

  return { status, clearStatus: () => setStatus(null), exportAll, importFile };
}
