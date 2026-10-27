import { describe, expect, it } from "vitest";
import { makeFolder, makePrompt } from "@/test/factories";
import { applyFilters, collectFolderIds } from "./filterPrompts";
import type { LibraryFilters } from "./types";

// f-dev
//  └─ f-react
//      └─ f-hooks
// f-mkt
const folders = [
  makeFolder("f-dev"),
  makeFolder("f-react", "f-dev"),
  makeFolder("f-hooks", "f-react"),
  makeFolder("f-mkt"),
];

const react = makePrompt({
  id: "react",
  title: "React Refactor",
  description: "Modernize components",
  content: "Refactor {{component}}",
  category: "coding",
  model: { name: "Claude", provider: "anthropic" },
  tags: ["React", "TypeScript"],
  folderId: "f-react",
  isFavorite: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-03-01T00:00:00.000Z",
});
const copy = makePrompt({
  id: "copy",
  title: "SaaS Hero Copy",
  content: "Write copy for {{product_topic}}",
  category: "marketing",
  model: { name: "GPT-4o", provider: "openai" },
  tags: ["Marketing"],
  folderId: "f-mkt",
  createdAt: "2026-02-10T00:00:00.000Z",
  updatedAt: "2026-02-01T00:00:00.000Z",
});
const hooks = makePrompt({
  id: "hooks",
  title: "Hooks Guide",
  category: "education",
  model: { name: "Gemini", provider: "google" },
  tags: ["React"],
  folderId: "f-hooks",
  createdAt: "2026-01-05T00:00:00.000Z",
  updatedAt: "2026-01-15T00:00:00.000Z",
});
const archived = makePrompt({
  id: "archived",
  title: "Old Draft",
  isArchived: true,
  updatedAt: "2026-04-01T00:00:00.000Z",
});
const prompts = [copy, archived, hooks, react]; // deliberately not in sorted order

const base: LibraryFilters = {
  search: "",
  sort: "updated",
  model: "all",
  tag: null,
  category: "all",
  scope: { kind: "all" },
};
const run = (patch: Partial<LibraryFilters>) =>
  applyFilters(prompts, { ...base, ...patch }, folders).map((p) => p.id);

describe("collectFolderIds", () => {
  const sorted = (ids: Set<string>) => [...ids].sort();

  it("includes the folder and all its descendants, but not siblings", () => {
    expect(sorted(collectFolderIds(folders, "f-dev"))).toEqual([
      "f-dev",
      "f-hooks",
      "f-react",
    ]);
  });

  it("returns just the folder for a leaf or an unknown id", () => {
    expect(sorted(collectFolderIds(folders, "f-hooks"))).toEqual(["f-hooks"]);
    expect(sorted(collectFolderIds(folders, "missing"))).toEqual(["missing"]);
  });
});

describe("applyFilters: scope", () => {
  it('"all" hides archived prompts and sorts by last update', () => {
    expect(run({})).toEqual(["react", "copy", "hooks"]);
  });

  it('"archive" shows only archived prompts', () => {
    expect(run({ scope: { kind: "archive" } })).toEqual(["archived"]);
  });

  it('"starred" shows only favorites', () => {
    expect(run({ scope: { kind: "starred" } })).toEqual(["react"]);
  });

  it("a folder scope includes prompts from its sub-folders", () => {
    expect(run({ scope: { kind: "folder", folderId: "f-dev" } })).toEqual([
      "react",
      "hooks",
    ]);
  });

  it("a folder scope excludes other folders", () => {
    expect(run({ scope: { kind: "folder", folderId: "f-mkt" } })).toEqual([
      "copy",
    ]);
  });
});

describe("applyFilters: category, model and tag", () => {
  it("filters by category", () => {
    expect(run({ category: "marketing" })).toEqual(["copy"]);
  });

  it("filters by model provider", () => {
    expect(run({ model: "google" })).toEqual(["hooks"]);
  });

  it("filters by tag (exact, case-sensitive)", () => {
    expect(run({ tag: "React" })).toEqual(["react", "hooks"]);
    expect(run({ tag: "react" })).toEqual([]);
  });

  it("combines filters with AND", () => {
    expect(run({ tag: "React", category: "coding" })).toEqual(["react"]);
  });
});

describe("applyFilters: search", () => {
  it("matches the title, ignoring case", () => {
    expect(run({ search: "refactor" })).toEqual(["react"]);
  });

  it("matches the content, so variable names are searchable", () => {
    expect(run({ search: "PRODUCT_TOPIC" })).toEqual(["copy"]);
  });

  it("matches tags and descriptions", () => {
    expect(run({ search: "typescript" })).toEqual(["react"]);
    expect(run({ search: "modernize" })).toEqual(["react"]);
  });

  it("ignores surrounding spaces", () => {
    expect(run({ search: "  hero  " })).toEqual(["copy"]);
  });

  it("returns nothing when nothing matches", () => {
    expect(run({ search: "zzz-no-match" })).toEqual([]);
  });
});

describe("applyFilters: sorting", () => {
  it("sorts by creation date, newest first", () => {
    expect(run({ sort: "created" })).toEqual(["copy", "hooks", "react"]);
  });

  it("sorts by title, A to Z", () => {
    expect(run({ sort: "title" })).toEqual(["hooks", "react", "copy"]);
  });

  it("never reorders the array that was passed in", () => {
    const before = prompts.map((p) => p.id);
    applyFilters(prompts, { ...base, sort: "title" }, folders);
    expect(prompts.map((p) => p.id)).toEqual(before);
  });
});
