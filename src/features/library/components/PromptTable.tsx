import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ProviderIcon } from "@/features/prompts/components/ProviderIcon";
import { StatusBadge } from "@/features/prompts/components/StatusBadge";
import type { Prompt } from "@/features/prompts/types";
import { getVersionLabel } from "@/features/prompts/utils";
import { formatUpdated } from "@/utils/dates";
import { FavoriteButton, PromptQuickActions } from "./PromptActions";

const th = "px-3 py-2.5 font-semibold";

export function PromptTable({ prompts }: { prompts: Prompt[] }) {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto rounded-2xl bg-surface-container-low/85 shadow-md lg:overflow-visible">
      <table className="w-full text-start text-body-sm">
        <caption className="sr-only">{t("library.table.caption")}</caption>
        <thead>
          <tr className="text-label-sm uppercase tracking-wider text-outline">
            <th scope="col" className="w-12 py-2.5 ps-3">
              <span className="sr-only">{t("library.table.favorite")}</span>
            </th>
            <th scope="col" className={th}>
              {t("library.table.title")}
            </th>
            <th scope="col" className={th}>
              {t("library.table.status")}
            </th>
            <th scope="col" className={th}>
              {t("library.table.version")}
            </th>
            <th scope="col" className={`${th} hidden md:table-cell`}>
              {t("library.table.model")}
            </th>
            <th scope="col" className={`${th} hidden xl:table-cell`}>
              {t("library.table.tags")}
            </th>
            <th scope="col" className={th}>
              {t("library.table.updated")}
            </th>
            <th scope="col" className="py-2.5 pe-3">
              <span className="sr-only">{t("library.table.actions")}</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-variant/40">
          {prompts.map((p) => (
            <tr
              key={p.id}
              data-result-item
              className="transition-colors hover:bg-surface-container"
            >
              <td className="py-1.5 ps-3">
                <FavoriteButton prompt={p} />
              </td>
              <td className="px-3 py-1.5">
                <div className="max-w-[16rem] truncate font-medium text-on-surface">
                  <Link
                    to={`/editor/${p.id}`}
                    title={p.title}
                    dir="auto"
                    className="hover:text-primary"
                  >
                    {p.title}
                  </Link>
                </div>
              </td>
              <td className="px-3 py-1.5">
                <StatusBadge status={p.status} />
              </td>
              <td className="px-3 py-1.5 font-mono text-[12px] text-on-surface-variant">
                {getVersionLabel(p)}
              </td>
              <td className="hidden px-3 py-1.5 md:table-cell">
                <span className="flex items-center gap-1.5 text-on-surface-variant">
                  <ProviderIcon
                    provider={p.model.provider}
                    className="size-4 shrink-0 text-primary"
                  />
                  <span className="whitespace-nowrap">{p.model.name}</span>
                </span>
              </td>
              <td className="hidden px-3 py-1.5 xl:table-cell">
                <span className="flex items-center gap-1">
                  {p.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      dir="auto"
                      className="rounded-md bg-surface-container-high px-1.5 py-0.5 text-[11px] text-outline"
                    >
                      #{tag}
                    </span>
                  ))}
                  {p.tags.length > 2 && (
                    <span dir="ltr" className="text-[11px] text-outline">
                      +{p.tags.length - 2}
                    </span>
                  )}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-1.5 text-outline">
                {formatUpdated(p.updatedAt)}
              </td>
              <td className="py-1.5 pe-3">
                <PromptQuickActions prompt={p} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
