import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { modelCatalog } from "@/features/prompts/constants";
import { usePromptStore } from "@/stores/promptStore";
import type { Template } from "../schemas";

export function useUseTemplate() {
  const addPrompt = usePromptStore((s) => s.addPrompt);
  const navigate = useNavigate();

  return useCallback(
    (template: Template) => {
      // A template recommends a provider; a prompt stores a concrete model name
      const modelName =
        modelCatalog.find((m) => m.provider === template.provider)?.name ??
        template.provider;

      const created = addPrompt({
        title: template.title,
        description: template.description,
        content: template.content,
        category: template.category,
        tags: template.tags,
        model: { name: modelName, provider: template.provider },
      });
      navigate(`/editor/${created.id}`);
    },
    [addPrompt, navigate],
  );
}
