import { Cloud, KeyRound, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";
import { SettingsCard } from "./SettingsParts";

// <code> inside a sentence: keep it LTR so VITE_* / localStorage don't get mangled in Arabic.
const codeComponent = { code: <bdi dir="ltr" className="font-mono" /> };

export function ApiSection() {
  const { t } = useTranslation();

  const tiles: {
    icon: typeof Cloud;
    label: string;
    value: string;
    hint: ReactNode;
  }[] = [
    {
      icon: Cloud,
      label: t("settings.api.aiLabel"),
      value: t("settings.api.aiValue"),
      hint: t("settings.api.aiHint"),
    },
    {
      icon: KeyRound,
      label: t("settings.api.keysLabel"),
      value: t("settings.api.keysValue"),
      hint: (
        <Trans i18nKey="settings.api.keysHint" components={codeComponent} />
      ),
    },
    {
      icon: ShieldCheck,
      label: t("settings.api.dataLabel"),
      value: t("settings.api.dataValue"),
      hint: (
        <Trans i18nKey="settings.api.dataHint" components={codeComponent} />
      ),
    },
  ];

  return (
    <SettingsCard
      id="api"
      icon={KeyRound}
      title={t("settings.api.title")}
      description={t("settings.api.description")}
    >
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {tiles.map(({ icon: Icon, label, value, hint }) => (
          <li key={label} className="rounded-xl bg-background p-4">
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Icon className="size-3.5" aria-hidden="true" />
              {label}
            </p>
            <p className="mt-1 font-heading font-semibold">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          </li>
        ))}
      </ul>
    </SettingsCard>
  );
}
