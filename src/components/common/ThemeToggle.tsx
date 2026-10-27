import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "@/stores/themeStore";
import { IconButton } from "./IconButton";

export function ThemeToggle() {
  const { t } = useTranslation();
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <IconButton
      aria-label={t("common.toggleTheme")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Moon className="size-5" /> : <Sun className="size-5" />}
    </IconButton>
  );
}
