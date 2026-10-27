import type { Folder, Prompt } from "@/features/prompts/types";

/** Builds a valid Prompt for tests. Pass only the fields the test cares about. */
export function makePrompt(
  overrides: Partial<Prompt> & Pick<Prompt, "id">,
): Prompt {
  const content = overrides.content ?? "Hello {{name}}";
  return {
    title: `Prompt ${overrides.id}`,
    description: "",
    content,
    status: "draft",
    category: "writing",
    tags: [],
    model: { name: "GPT-4o", provider: "openai" },
    folderId: null,
    isFavorite: false,
    isArchived: false,
    versions: [
      {
        id: `${overrides.id}-v1`,
        label: "v1.0",
        content,
        note: "Initial version",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

export function makeFolder(id: string, parentId: string | null = null): Folder {
  return { id, name: `Folder ${id}`, parentId };
}
