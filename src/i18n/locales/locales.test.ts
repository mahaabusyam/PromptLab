import { describe, expect, it } from "vitest";
import { ar } from "./ar";
import { en } from "./en";

function flatten(object: object, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(object)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") result[path] = value;
    else if (typeof value === "object" && value !== null)
      Object.assign(result, flatten(value, path));
  }
  return result;
}

const placeholders = (text: string) =>
  (text.match(/\{\{\s*\w+\s*\}\}/g) ?? [])
    .map((p) => p.replace(/\s/g, ""))
    .sort();

const flatEn = flatten(en);
const flatAr = flatten(ar);

describe("locales", () => {
  it("have exactly the same keys", () => {
    expect(Object.keys(flatAr).sort()).toEqual(Object.keys(flatEn).sort());
  });

  it("have no empty strings", () => {
    for (const [key, value] of [
      ...Object.entries(flatEn),
      ...Object.entries(flatAr),
    ]) {
      expect(value.trim(), key).not.toBe("");
    }
  });

  it("use the same interpolation placeholders in both languages", () => {
    for (const [key, value] of Object.entries(flatEn)) {
      expect(placeholders(flatAr[key] ?? ""), key).toEqual(placeholders(value));
    }
  });
});
