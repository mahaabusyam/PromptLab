import { Cloud, KeyRound, ShieldCheck } from 'lucide-react';
import { SettingsCard } from './SettingsParts';

const tiles = [
  { icon: Cloud, label: 'AI features', value: 'Not connected', hint: 'Improve, Variations and real runs arrive with the secure proxy.' },
  { icon: KeyRound, label: 'API keys', value: 'None stored', hint: 'Secret keys must never live in the browser or in VITE_* variables.' },
  { icon: ShieldCheck, label: 'Data location', value: 'This browser only', hint: 'No backend: everything is saved in localStorage.' },
];

export function ApiSection() {
  return (
    <SettingsCard
      id="api"
      icon={KeyRound}
      title="API & Security"
      description="Where your data lives and how AI features will connect later."
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