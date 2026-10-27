import { describe, expect, it } from "vitest";
import { nextVersionLabel } from "./versionLabel";

const labels = (...list: string[]) => list.map((label) => ({ label }));

describe("nextVersionLabel", () => {
  it("minor bump increments the second number", () => {
    expect(nextVersionLabel(labels("v1.0", "v1.4"), "minor")).toBe("v1.5");
  });

  it("major bump increments the first number and resets the second", () => {
    expect(nextVersionLabel(labels("v1.4"), "major")).toBe("v2.0");
  });

  it("does not roll v1.9 over into v2.0 on a minor bump", () => {
    expect(nextVersionLabel(labels("v1.9"), "minor")).toBe("v1.10");
  });

  it("starts at v1.0 when there are no versions", () => {
    expect(nextVersionLabel([], "minor")).toBe("v1.0");
    expect(nextVersionLabel([], "major")).toBe("v1.0");
  });

  it("falls back to simple numbering when the last label is unusual", () => {
    expect(nextVersionLabel(labels("draft"), "minor")).toBe("v2.0");
    expect(nextVersionLabel(labels("v3.2", "weird"), "minor")).toBe("v3.0");
  });

  it("bases the next label on the LAST version, not the highest one", () => {
    // e.g. after restoring/deleting versions the order in the list is what counts
    expect(nextVersionLabel(labels("v1.0", "v2.3", "v1.1"), "minor")).toBe(
      "v1.2",
    );
  });
});
