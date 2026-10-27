import type { ParseKeys } from "i18next";
import {
  LayoutDashboard,
  FolderOpen,
  SquareTerminal,
  LayoutGrid,
  History,
  Star,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  labelKey: ParseKeys;
  to: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { labelKey: "nav.dashboard", to: "/", icon: LayoutDashboard },
  { labelKey: "nav.library", to: "/library", icon: FolderOpen },
  { labelKey: "nav.editor", to: "/editor", icon: SquareTerminal },
  { labelKey: "nav.templates", to: "/templates", icon: LayoutGrid },
  { labelKey: "nav.history", to: "/history", icon: History },
  { labelKey: "nav.favorites", to: "/favorites", icon: Star },
  { labelKey: "nav.settings", to: "/settings", icon: Settings },
];
