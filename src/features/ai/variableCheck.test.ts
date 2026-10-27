import { describe, expect, it } from "vitest";
import { compareVariables } from "./variableCheck";

describe("compareVariables", () => {
  it("reports nothing when variables are unchanged", () => {
    expect(compareVariables("Hi {{name}}", "Hello dear {{name}}!")).toEqual({
      missing: [],
      added: [],
    });
  });

  it("reports variables the AI dropped", () => {
    expect(
      compareVariables("{{topic}} in {{tone}}", "Write about {{topic}}")
        .missing,
    ).toEqual(["tone"]);
  });

  it("reports variables the AI invented", () => {
    expect(compareVariables("Hi", "Hi {{name}}").added).toEqual(["name"]);
  });
});
