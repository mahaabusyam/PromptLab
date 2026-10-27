import { Fragment } from "react";
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useLenis } from "@/hooks/useLenis";
import { useApplyTheme } from "@/hooks/useApplyTheme";
import { useApplyLanguage } from "@/hooks/useApplyLanguage";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  useLenis();
  useApplyTheme();
  useApplyLanguage();
  const { i18n } = useTranslation();

  // Remount the app when the language changes, so every date and number is recomputed
  return (
    <QueryClientProvider client={queryClient}>
      <Fragment key={i18n.resolvedLanguage}>{children}</Fragment>
    </QueryClientProvider>
  );
}
