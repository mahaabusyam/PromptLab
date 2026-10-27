import { useRef } from "react";
import { Download, FileUp, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useImportExport } from "@/features/prompts/hooks/useImportExport";
import { useTranslation } from "react-i18next";

const secondaryBtn =
  "inline-flex items-center gap-1.5 rounded-xl bg-surface-container-high/80 px-3.5 py-2 text-label-md text-on-surface shadow-sm transition-[background-color,scale] hover:bg-surface-container-highest active:scale-[0.98]";

interface LibraryHeaderProps {
  activeCount: number;
}

export function LibraryHeader({ activeCount }: LibraryHeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { status, clearStatus, exportAll, importFile } = useImportExport();

  return (
    <div className="flex flex-col gap-space-sm">
      <header
        data-reveal
        className="flex flex-col justify-between gap-space-md md:flex-row md:items-center"
      >
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-space-sm">
            <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">
              {t("library.header.title")}
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-container/60 px-2.5 py-0.5 text-label-sm font-semibold uppercase tracking-wide text-on-secondary-container">
              <span
                aria-hidden
                className="size-1.5 animate-pulse rounded-full bg-primary"
              />
              {t("library.header.active", { total: activeCount })}
            </span>
          </div>
          <p className="max-w-2xl text-body-md text-on-surface-variant">
            {t("library.header.subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm self-start md:self-auto">
          <button type="button" onClick={exportAll} className={secondaryBtn}>
            <Download className="size-[18px] text-outline" />
            {t("library.header.exportAll")}
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={secondaryBtn}
          >
            <FileUp className="size-[18px] text-outline" />
            {t("library.header.importJson")}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void importFile(file);
              e.target.value = ""; // عشان نقدر نختار نفس الملف مرة ثانية
            }}
          />

          <button
            type="button"
            onClick={() => navigate("/editor")}
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-secondary-container via-primary-container to-secondary-container px-4 py-2 text-title-md text-on-surface shadow-lg transition-[filter,scale] hover:brightness-110 active:scale-[0.98]"
          >
            <Plus className="size-5" />
            {t("library.header.create")}
          </button>
        </div>
      </header>

      {status && (
        <div
          role="status"
          className={`flex items-center justify-between gap-3 rounded-xl px-space-md py-2 text-body-sm ${
            status.type === "success"
              ? "bg-secondary-container/40 text-on-secondary-container"
              : "bg-error-container text-on-error-container"
          }`}
        >
          <span>{status.message}</span>
          <button
            type="button"
            aria-label={t("library.header.dismiss")}
            onClick={clearStatus}
          >
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
