import { Bot, Brain, Gem } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ModelProvider } from "../types";

const icons: Record<ModelProvider, LucideIcon> = {
  anthropic: Brain,
  openai: Bot,
  google: Gem,
};

interface ProviderIconProps {
  provider: ModelProvider;
  className?: string;
}

export function ProviderIcon({ provider, className }: ProviderIconProps) {
  const Icon = icons[provider];
  return <Icon className={className} />;
}
