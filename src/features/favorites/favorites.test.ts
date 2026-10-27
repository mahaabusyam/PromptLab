import { describe, expect, it } from "vitest";
import type { Prompt } from "@/features/prompts/types";
import type { Template } from "@/features/templates/schemas";
import { toListItem } from "@/features/templates/filterTemplates";
import { buildFavoriteEntries, buildFavoriteStats } from "./buildFavorites";
import { buildFavoritesExport } from "./exportFavorites";
import {
  DEFAULT_FAVORITE_FILTERS,
  countByTab,
  filterFavorites,
} from "./filterFavorites";
import { buildFolderCounts, buildTopVariables } from "./sidebarData";

function prompt(overrides: Partial<Prompt> & Pick<Prompt, "id">): Prompt {
  return {
    title: "Prompt",
    description: "A prompt",
    content: "Hello {{name}}",
    status: "draft",
    category: "coding",
    tags: [],
    model: { name: "GPT-4o", provider: "openai" },
    folderId: null,
    isFavorite: true,
    isArchived: false,
    versions: [
      {
        id: "v1",
        label: "v1.0",
        content: "x",
        note: "n",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function template(
  overrides: Partial<Template> & Pick<Template, "id">,
): Template {
  return {
    title: "Template",
    description: "A template",
    category: "writing",
    provider: "google",
    complexity: "zero-shot",
    tags: [],
    content: "Write about {{topic}} for {{name}}",
    ...overrides,
  };
}

const oldPrompt = prompt({
  id: "p-old",
  title: "Old",
  updatedAt: "2026-01-01T00:00:00.000Z",
  folderId: "f1",
  tags: ["seo"],
});
const newPrompt = prompt({
  id: "p-new",
  title: "New",
  updatedAt: "2026-03-01T00:00:00.000Z",
  folderId: "f1",
  content: "{{a}} {{b}}",
});
const hidden = prompt({ id: "p-archived", isArchived: true });
const notFav = prompt({ id: "p-not-fav", isFavorite: false });
const tpl = template({ id: "t1", title: "Tpl" });
const tplNotFav = template({ id: "t2" });

const entries = buildFavoriteEntries(
  [oldPrompt, newPrompt, hidden, notFav],
  [toListItem(tpl), toListItem(tplNotFav)],
  ["t1"],
);

describe("buildFavoriteEntries", () => {
  it("keeps only favorite, non-archived prompts and favorite templates", () => {
    expect(entries.map((e) => e.key).sort()).toEqual([
      "prompt:p-new",
      "prompt:p-old",
      "template:t1",
    ]);
  });
});

describe("buildFavoriteStats", () => {
  it("totals tokens, variables and finds the primary provider", () => {
    const stats = buildFavoriteStats(entries);
    expect(stats.total).toBe(3);
    expect(stats.prompts).toBe(2);
    expect(stats.templates).toBe(1);
    expect(stats.distinctVariables).toBe(4); // name, a, b, topic
    expect(stats.primaryProvider).toEqual({ provider: "openai", percent: 67 });
  });

  it("handles an empty list", () => {
    expect(buildFavoriteStats([]).primaryProvider).toBeNull();
  });
});

describe("filterFavorites", () => {
  it("sorts by recently updated and puts undated templates last", () => {
    const result = filterFavorites(entries, {
      ...DEFAULT_FAVORITE_FILTERS,
      sort: "updated",
    });
    expect(result.map((e) => e.id)).toEqual(["p-new", "p-old", "t1"]);
  });

  it("filters by tab and counts ignore the tab filter", () => {
    const filters = { ...DEFAULT_FAVORITE_FILTERS, tab: "template" as const };
    expect(filterFavorites(entries, filters).map((e) => e.id)).toEqual(["t1"]);
    expect(countByTab(entries, filters)).toEqual({
      all: 3,
      prompt: 2,
      template: 1,
    });
  });

  it("searches by tag, variable and model name", () => {
    const byTag = filterFavorites(entries, {
      ...DEFAULT_FAVORITE_FILTERS,
      query: "#seo",
    });
    expect(byTag.map((e) => e.id)).toEqual(["p-old"]);

    const byVariable = filterFavorites(entries, {
      ...DEFAULT_FAVORITE_FILTERS,
      query: "topic",
    });
    expect(byVariable.map((e) => e.id)).toEqual(["t1"]);

    const byModel = filterFavorites(entries, {
      ...DEFAULT_FAVORITE_FILTERS,
      query: "gpt-4o",
    });
    expect(byModel).toHaveLength(2);
  });

  it("a folder filter keeps only prompts of that folder", () => {
    const result = filterFavorites(entries, {
      ...DEFAULT_FAVORITE_FILTERS,
      folderId: "f1",
    });
    expect(result.map((e) => e.kind)).toEqual(["prompt", "prompt"]);
  });

  it("a variable filter keeps only items that use it", () => {
    const result = filterFavorites(entries, {
      ...DEFAULT_FAVORITE_FILTERS,
      variable: "name",
    });
    expect(result.map((e) => e.id).sort()).toEqual(["p-old", "t1"]);
  });
});

describe("sidebar data", () => {
  it("counts favorites per folder and hides empty folders", () => {
    const folders = [
      { id: "f1", name: "Production" },
      { id: "f2", name: "Empty" },
    ];
    expect(buildFolderCounts(entries, folders)).toEqual([
      { id: "f1", name: "Production", count: 2 },
    ]);
  });

  it("ranks variables by how many favorites use them", () => {
    const top = buildTopVariables(entries);
    expect(top[0]).toEqual({ name: "name", count: 2 });
    expect(top.map((v) => v.name)).toEqual(["name", "a", "b", "topic"]);
  });
});

describe("buildFavoritesExport", () => {
  it("splits prompts and templates into separate lists", () => {
    const file = buildFavoritesExport(
      entries,
      new Date("2026-05-01T00:00:00.000Z"),
    );
    expect(file.prompts).toHaveLength(2);
    expect(file.templates).toHaveLength(1);
    expect(file.exportedAt).toBe("2026-05-01T00:00:00.000Z");
  });
});
