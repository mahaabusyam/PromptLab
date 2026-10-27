import { describe, expect, it } from "vitest";
import { diffLines, summarizeDiff, type DiffLine } from "./diff";

const same = (text: string): DiffLine => ({ type: "same", text });
const added = (text: string): DiffLine => ({ type: "added", text });
const removed = (text: string): DiffLine => ({ type: "removed", text });

describe("diffLines", () => {
  it("marks identical text as unchanged", () => {
    expect(diffLines("a\nb", "a\nb")).toEqual([same("a"), same("b")]);
  });

  it("detects an added line", () => {
    expect(diffLines("a\nc", "a\nb\nc")).toEqual([
      same("a"),
      added("b"),
      same("c"),
    ]);
  });

  it("detects a removed line", () => {
    expect(diffLines("a\nb\nc", "a\nc")).toEqual([
      same("a"),
      removed("b"),
      same("c"),
    ]);
  });

  it("shows a changed line as removed then added", () => {
    expect(diffLines("a\nb\nc", "a\nX\nc")).toEqual([
      same("a"),
      removed("b"),
      added("X"),
      same("c"),
    ]);
  });

  it("handles completely different text", () => {
    expect(diffLines("a\nb", "c\nd")).toEqual([
      removed("a"),
      removed("b"),
      added("c"),
      added("d"),
    ]);
  });

  it("treats an empty string as one empty line", () => {
    expect(diffLines("", "")).toEqual([same("")]);
    expect(diffLines("", "x")).toEqual([removed(""), added("x")]);
  });

  // The diff must always be "lossless": same + removed rebuilds the old text,
  // same + added rebuilds the new text.
  it.each([
    ["a\nb\nc\nd", "b\nd\ne"],
    ["x", "x\ny\nz"],
    ["1\n2\n3", "3\n2\n1"],
    ["same\nsame", "same"],
  ])("can rebuild both sides from the diff of %j → %j", (before, after) => {
    const lines = diffLines(before, after);
    const oldText = lines
      .filter((l) => l.type !== "added")
      .map((l) => l.text)
      .join("\n");
    const newText = lines
      .filter((l) => l.type !== "removed")
      .map((l) => l.text)
      .join("\n");
    expect(oldText).toBe(before);
    expect(newText).toBe(after);
  });
});

describe("summarizeDiff", () => {
  it("counts added and removed lines", () => {
    expect(summarizeDiff(diffLines("a\nb\nc", "a\nX\nc"))).toEqual({
      added: 1,
      removed: 1,
    });
  });

  it("returns zeros for an empty diff", () => {
    expect(summarizeDiff([])).toEqual({ added: 0, removed: 0 });
  });
});
