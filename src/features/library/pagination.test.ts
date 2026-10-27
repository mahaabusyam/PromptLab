import { describe, expect, it } from "vitest";
import { getPageItems } from "./pagination";

describe("getPageItems", () => {
  it.each([
    [1, 1, [1]],
    [1, 5, [1, 2, 3, 4, 5]],
    [3, 7, [1, 2, 3, 4, 5, 6, 7]],
  ])(
    "shows every page when there are 7 or fewer (page %i of %i)",
    (current, total, expected) => {
      expect(getPageItems(current, total)).toEqual(expected);
    },
  );

  it("returns nothing when there are no pages", () => {
    expect(getPageItems(1, 0)).toEqual([]);
  });

  it("shows ellipses on both sides when in the middle", () => {
    expect(getPageItems(10, 22)).toEqual([
      1,
      "ellipsis",
      9,
      10,
      11,
      "ellipsis",
      22,
    ]);
  });

  it("shows one ellipsis near the start", () => {
    expect(getPageItems(1, 22)).toEqual([1, 2, "ellipsis", 22]);
  });

  it("shows one ellipsis near the end", () => {
    expect(getPageItems(22, 22)).toEqual([1, "ellipsis", 21, 22]);
  });

  it("shows the page itself instead of an ellipsis that would hide only one page", () => {
    expect(getPageItems(4, 10)).toEqual([1, 2, 3, 4, 5, "ellipsis", 10]);
    expect(getPageItems(7, 10)).toEqual([1, "ellipsis", 6, 7, 8, 9, 10]);
  });

  it("has no ellipsis when the window touches the first page", () => {
    expect(getPageItems(3, 10)).toEqual([1, 2, 3, 4, "ellipsis", 10]);
  });
});
