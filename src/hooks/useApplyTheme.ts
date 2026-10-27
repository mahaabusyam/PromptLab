import { useEffect } from "react";
import { useThemeStore } from "@/stores/themeStore";

export function useApplyTheme(): void {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const isDark = theme === "dark" || (theme === "system" && media.matches);
      document.documentElement.classList.toggle("dark", isDark);
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);
}
