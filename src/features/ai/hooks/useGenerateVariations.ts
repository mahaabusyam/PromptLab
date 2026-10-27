import { useMutation } from "@tanstack/react-query";
import type { AiError } from "../errors";
import { generateVariations } from "../services/aiClient";
import type { VariationsRequest, VariationsResponse } from "../types";

export function useGenerateVariations() {
  return useMutation<VariationsResponse, AiError, VariationsRequest>({
    mutationFn: generateVariations,
    retry: false,
  });
}
