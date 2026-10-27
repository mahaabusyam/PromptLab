import { z } from "zod";

export const saveVersionSchema = z.object({
  note: z
    .string()
    .trim()
    .min(3, "Describe what changed (at least 3 characters).")
    .max(200, "Keep it under 200 characters."),
  bump: z.enum(["minor", "major"]),
});

export type SaveVersionValues = z.infer<typeof saveVersionSchema>;
