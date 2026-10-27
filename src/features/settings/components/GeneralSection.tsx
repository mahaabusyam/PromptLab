import { Building2 } from 'lucide-react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { modelCatalog } from '@/features/prompts/constants';
import type { GeneralValues } from '../schemas';
import { SettingsCard, fieldClass } from './SettingsParts';

interface GeneralSectionProps {
  register: UseFormRegister<GeneralValues>;
  errors: FieldErrors<GeneralValues>;
}

const WORKSPACE_NAME_MAX = 40; // keep in sync with settingsSchema

export function GeneralSection({ register, errors }: GeneralSectionProps) {
  const { t } = useTranslation();

  const nameError = errors.workspaceName
    ? errors.workspaceName.type === 'too_big'
      ? t('settings.general.errMax', { max: WORKSPACE_NAME_MAX })
      : t('settings.general.errRequired')
    : null;

  return (
    <SettingsCard
      id="general"
      icon={Building2}
      title={t('settings.general.title')}
      description={t('settings.general.description')}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="workspaceName" className="text-xs font-semibold">
            {t('settings.general.workspaceTitle')}
          </label>
          <input
            id="workspaceName"
            type="text"
            dir="auto"
            autoComplete="off"
            aria-invalid={errors.workspaceName ? 'true' : 'false'}
            aria-describedby="workspaceName-hint"
            className={fieldClass}
            {...register('workspaceName')}
          />
          <p
            id="workspaceName-hint"
            role={errors.workspaceName ? 'alert' : undefined}
            className={`text-xs ${errors.workspaceName ? 'text-destructive' : 'text-muted-foreground'}`}
          >
            {nameError ?? t('settings.general.workspaceHint')}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="defaultModel" className="text-xs font-semibold">
            {t('settings.general.defaultModel')}
          </label>
          <select id="defaultModel" className={`${fieldClass} cursor-pointer`} {...register('defaultModel')}>
            {modelCatalog.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">{t('settings.general.defaultModelHint')}</p>
        </div>
      </div>
    </SettingsCard>
  );
}