import { Check, Paintbrush } from 'lucide-react';
import { useSettingsStore } from '@/stores/settingsStore';
import { useThemeStore, type Theme } from '@/stores/themeStore';
import { accentOptions } from '../constants';
import { SettingsCard, Switch } from './SettingsParts';
import { LanguageField } from './LanguageField'

interface ThemeOption {
  id: Theme;
  label: string;
  hint: string;
  surface: string;
  bar: string;
}

const themeOptions: ThemeOption[] = [
  { id: 'dark', label: 'Obsidian Dark', hint: 'High-contrast dark workspace for low-light prompt tuning.', surface: 'bg-[#0f131c]', bar: 'bg-[#31353f]' },
  { id: 'light', label: 'Paper Light', hint: 'Bright, high-key contrast for daytime work.', surface: 'bg-[#fbf8ff]', bar: 'bg-[#e3e0ed]' },
  { id: 'system', label: 'Match System', hint: 'Follows your operating system setting.', surface: 'bg-linear-to-r from-[#0f131c] from-50% to-[#fbf8ff] to-50%', bar: 'bg-[#908fa0]/60' },
];

export function AppearanceSection() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const accent = useSettingsStore((s) => s.settings.accent);
  const highContrast = useSettingsStore((s) => s.settings.highContrast);
  const update = useSettingsStore((s) => s.update);

  const activeAccent = accentOptions.find((a) => a.id === accent);

  return (
    <SettingsCard
      id="appearance"
      icon={Paintbrush}
      title="Appearance"
      description="Theme, accent color and contrast. Changes apply instantly."
      badge={
        <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
          Live Preview
        </span>
      }
    >
      <div className="space-y-6">
        <div role="radiogroup" aria-label="Theme" className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {themeOptions.map((opt) => {
            const selected = theme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setTheme(opt.id)}
                className={`flex flex-col gap-2 rounded-xl bg-background p-3 text-start transition-shadow focus-visible:outline-2 focus-visible:outline-primary ${
                  selected ? 'ring-2 ring-primary' : 'ring-1 ring-border hover:ring-primary/50'
                }`}
              >
                <span className={`flex h-20 flex-col justify-end gap-1.5 rounded-lg p-2 ${opt.surface}`}>
                  <span className={`h-2 w-3/4 rounded ${opt.bar}`} />
                  <span className={`h-2 w-1/2 rounded ${opt.bar}`} />
                </span>
                <span className="flex items-center justify-between text-sm font-semibold">
                  {opt.label}
                  {selected && <Check className="size-4 text-primary" aria-hidden="true" />}
                </span>
                <span className="text-xs text-muted-foreground">{opt.hint}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          <span id="accent-label" className="text-xs font-semibold">Interface Accent</span>
          <div role="radiogroup" aria-labelledby="accent-label" className="flex flex-wrap items-center gap-3">
            {accentOptions.map((opt) => {
              const selected = accent === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={opt.label}
                  title={opt.label}
                  onClick={() => update({ accent: opt.id })}
                  style={{ backgroundColor: opt.swatch }}
                  className={`flex size-8 items-center justify-center rounded-full transition-[scale] hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    selected ? 'ring-2 ring-foreground ring-offset-2 ring-offset-card' : ''
                  }`}
                >
                  {selected && <Check className="size-4 text-white" aria-hidden="true" />}
                </button>
              );
            })}
            <span className="font-mono text-xs text-muted-foreground">{activeAccent?.label}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
          <div>
            <p className="text-sm font-semibold">Higher contrast</p>
            <p className="text-xs text-muted-foreground">Stronger borders and darker secondary text for easier reading.</p>
          </div>
          <Switch checked={highContrast} onChange={(v) => update({ highContrast: v })} label="Higher contrast" />
        </div>
        <div className="border-t border-border pt-4">
          <LanguageField />
        </div>
      </div>
    </SettingsCard>
  );
}