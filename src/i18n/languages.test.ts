import { describe, expect, it } from "vitest";
import { detectLanguage, resolveLanguage } from "./languages";

describe("detectLanguage", () => {
  it("picks Arabic from regional variants", () => {
    expect(detectLanguage(["ar-EG", "en-US"])).toBe("ar");
  });
  it("uses the first supported language in the browser list", () => {
    expect(detectLanguage(["fr-FR", "ar", "en"])).toBe("ar");
  });
  it("falls back to English when nothing matches or the list is empty", () => {
    expect(detectLanguage(["fr-FR", "de"])).toBe("en");
    expect(detectLanguage([])).toBe("en");
  });
});

describe("resolveLanguage", () => {
  it("follows the browser when set to auto", () => {
    expect(resolveLanguage("auto", ["ar-SA"])).toBe("ar");
  });
  it("manual choice wins over the browser", () => {
    expect(resolveLanguage("en", ["ar-SA"])).toBe("en");
    expect(resolveLanguage("ar", ["en-US"])).toBe("ar");
  });
});
