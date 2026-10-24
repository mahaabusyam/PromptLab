import { Building2 } from 'lucide-react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { modelCatalog } from '@/features/prompts/constants';
import type { GeneralValues } from '../schemas';
import { SettingsCard, fieldClass } from './SettingsParts';

interface GeneralSectionProps {
  register: UseFormRegister<GeneralValues>;
  errors: FieldErrors<GeneralValues>;
}

export function GeneralSection({ register, errors }: GeneralSectionProps) {
  return (
    <SettingsCard
      id="general"
      icon={Building2}
      title="General Workspace"
      description="Name your workspace and choose the model new prompts start with."
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="workspaceName" className="text-xs font-semibold">
            Workspace Title
          </label>
          <input
            id="workspaceName"
            type="text"
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
            {errors.workspaceName?.message ?? 'Shown in the sidebar.'}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="defaultModel" className="text-xs font-semibold">
            Default Model
          </label>
          <select id="defaultModel" className={`${fieldClass} cursor-pointer`} {...register('defaultModel')}>
            {modelCatalog.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">Used for every new prompt you create from scratch.</p>
        </div>
      </div>
    </SettingsCard>
  );
}