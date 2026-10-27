import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  FileCode,
  MailCheck,
  WandSparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { QuickTemplate, TemplateAccent, TemplateIconKey } from "../types";

const iconMap: Record<TemplateIconKey, LucideIcon> = {
  email: MailCheck,
  docs: BookOpen,
  refactor: FileCode,
};

const accentStyles: Record<TemplateAccent, { bar: string; icon: string }> = {
  primary: { bar: "from-inverse-primary to-secondary", icon: "text-primary" },
  secondary: { bar: "from-secondary to-tertiary", icon: "text-secondary" },
  tertiary: { bar: "from-tertiary to-primary", icon: "text-tertiary" },
};

interface TemplateLaunchersProps {
  templates: QuickTemplate[];
  totalCount: number;
}

export function TemplateLaunchers({
  templates,
  totalCount,
}: TemplateLaunchersProps) {
  const { t } = useTranslation();
  const ref = useScrollReveal<HTMLElement>();
  const navigate = useNavigate();

  return (
    <section ref={ref} className="flex flex-col gap-space-sm">
      <div data-reveal className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <WandSparkles className="size-5 text-secondary" />
          <h2 className="font-headline-sm text-headline-sm tracking-tight text-on-surface">
            {t("dashboard.templates.title")}
          </h2>
        </div>
        <Link
          to="/templates"
          className="flex items-center gap-1 text-label-md text-primary transition-colors hover:text-on-surface"
        >
          {t("dashboard.templates.exploreAll", { total: totalCount })}
          <ArrowRight className="size-4 rtl:-scale-x-100" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-space-md md:grid-cols-3">
        {templates.map((template) => {
          const Icon = iconMap[template.iconKey];
          const accent = accentStyles[template.accent];
          return (
            <article
              key={template.id}
              data-reveal
              className="group relative flex flex-col overflow-hidden rounded-xl bg-surface-container-low shadow-md transition-[translate] duration-300 hover:-translate-y-1"
            >
              <div className={`h-2 bg-linear-to-r ${accent.bar}`} />
              <div className="flex flex-1 flex-col gap-2 p-space-md">
                <div
                  className={`grid size-9 place-items-center rounded-lg bg-surface-container-highest ${accent.icon}`}
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="text-title-md text-on-surface transition-colors group-hover:text-primary">
                  {t(`dashboard.templates.items.${template.iconKey}.title`)}
                </h3>
                <p className="line-clamp-2 text-body-sm text-on-surface-variant">
                  {t(
                    `dashboard.templates.items.${template.iconKey}.description`,
                  )}
                </p>
                <div className="mt-auto pt-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/editor?template=${template.id}`)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-surface-container-high px-3 py-1.5 text-label-md text-on-surface transition-colors hover:bg-secondary-container hover:text-on-secondary-container"
                  >
                    {t("dashboard.templates.use")}
                    <ArrowUpRight className="size-3.5 rtl:-scale-x-100" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
