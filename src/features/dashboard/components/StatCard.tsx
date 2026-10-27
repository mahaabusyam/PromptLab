import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  icon: LucideIcon;
  iconClassName?: string;
  iconFilled?: boolean;
  children: ReactNode;
}

export function StatCard({
  label,
  icon: Icon,
  iconClassName = "text-primary",
  iconFilled = false,
  children,
}: StatCardProps) {
  return (
    <div
      data-reveal
      className="group relative flex flex-col justify-between rounded-xl bg-surface-container-low p-space-md shadow-md transition-colors hover:bg-surface-container"
    >
      <div className="flex items-center justify-between">
        <span className="text-label-md font-semibold uppercase tracking-wider text-outline">
          {label}
        </span>
        <div
          className={`grid size-8 place-items-center rounded-lg bg-surface-container-high transition-transform group-hover:scale-110 ${iconClassName}`}
        >
          <Icon
            className="size-[18px]"
            fill={iconFilled ? "currentColor" : "none"}
          />
        </div>
      </div>
      {children}
    </div>
  );
}
