import { describe, expect, it } from "vitest";
import { isDraftDirty } from "./draftDirty";

const initial = JSON.stringify({ title: "", content: "" });

describe("isDraftDirty", () => {
  it("is clean while the draft is unchanged", () => {
    expect(isDraftDirty(true, initial, { title: "", content: "" })).toBe(false);
  });

  it("is dirty once the draft changes", () => {
    expect(isDraftDirty(true, initial, { title: "", content: "Hello" })).toBe(
      true,
    );
  });

  it("is clean again if the user reverts the change", () => {
    expect(isDraftDirty(true, initial, { title: "", content: "" })).toBe(false);
  });

  it("never warns for existing prompts (they autosave)", () => {
    expect(isDraftDirty(false, initial, { title: "x", content: "y" })).toBe(
      false,
    );
  });
});
