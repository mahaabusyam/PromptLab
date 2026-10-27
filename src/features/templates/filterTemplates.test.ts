import { describe, expect, it } from "vitest";
import {
  DEFAULT_TEMPLATE_FILTERS,
  countByCategory,
  filterTemplates,
  toListItem,
} from "./filterTemplates";
import type { Template } from "./schemas";

function make(overrides: Partial<Template> & Pick<Template, "id">): Template {
  return {
    title: "Untitled",
    description: "A template",
    category: "coding",
    provider: "openai",
    complexity: "zero-shot",
    tags: [],
    content: "Hello {{name}}",
    ...overrides,
  };
}

const items = [
  make({
    id: "a",
    title: "Zebra email",
    category: "marketing",
    content: "Write to {{persona}}",
  }),
  make({
    id: "b",
    title: "Alpha parser",
    category: "coding",
    tags: ["sql"],
    content: "x".repeat(400),
  }),
  make({
    id: "c",
    title: "Mid summary",
    category: "marketing",
    provider: "google",
    featured: true,
  }),
].map(toListItem);

describe("filterTemplates", () => {
  it("finds templates by variable name, case-insensitively", () => {
    const result = filterTemplates(items, {
      ...DEFAULT_TEMPLATE_FILTERS,
      query: "PERSONA",
    });
    expect(result.map((i) => i.template.id)).toEqual(["a"]);
  });

  it("finds templates by tag", () => {
    const result = filterTemplates(items, {
      ...DEFAULT_TEMPLATE_FILTERS,
      query: "sql",
    });
    expect(result.map((i) => i.template.id)).toEqual(["b"]);
  });

  it("filters by provider", () => {
    const result = filterTemplates(items, {
      ...DEFAULT_TEMPLATE_FILTERS,
      provider: "google",
    });
    expect(result.map((i) => i.template.id)).toEqual(["c"]);
  });

  it("puts featured templates first, then sorts by title", () => {
    const result = filterTemplates(items, {
      ...DEFAULT_TEMPLATE_FILTERS,
      sort: "featured",
    });
    expect(result.map((i) => i.template.id)).toEqual(["c", "b", "a"]);
  });

  it("sorts by shortest token count", () => {
    const result = filterTemplates(items, {
      ...DEFAULT_TEMPLATE_FILTERS,
      sort: "tokens",
    });
    expect(result[result.length - 1]?.template.id).toBe("b"); // the 400-char one is the longest
  });

  it("does not mutate the original array when sorting", () => {
    const before = items.map((i) => i.template.id);
    filterTemplates(items, { ...DEFAULT_TEMPLATE_FILTERS, sort: "name" });
    expect(items.map((i) => i.template.id)).toEqual(before);
  });
});

describe("countByCategory", () => {
  it("ignores the category filter but respects the other filters", () => {
    const counts = countByCategory(items, {
      ...DEFAULT_TEMPLATE_FILTERS,
      category: "coding",
      provider: "openai",
    });
    // openai templates: a (marketing) and b (coding)
    expect(counts).toEqual({ all: 2, marketing: 1, coding: 1 });
  });
});
