import { describe, expect, it } from "vitest";
import { getPageNumbers, paginate } from "./paginate";

const items = Array.from({ length: 25 }, (_, i) => i + 1);

describe("paginate", () => {
  it("returns the right slice and range text values", () => {
    const r = paginate(items, 2, 10);
    expect(r.items).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    expect([r.from, r.to, r.total, r.totalPages]).toEqual([11, 20, 25, 3]);
  });

  it("clamps an out-of-range page", () => {
    expect(paginate(items, 99, 10).page).toBe(3);
    expect(paginate(items, -5, 10).page).toBe(1);
  });

  it("handles an empty list", () => {
    const r = paginate([], 1, 10);
    expect([r.items.length, r.from, r.to, r.totalPages]).toEqual([0, 0, 0, 1]);
  });
});

describe("getPageNumbers", () => {
  it("shows every page when there are few", () => {
    expect(getPageNumbers(2, 3)).toEqual([1, 2, 3]);
  });

  it("uses gaps for long ranges", () => {
    expect(getPageNumbers(1, 11)).toEqual([1, 2, null, 11]);
    expect(getPageNumbers(6, 11)).toEqual([1, null, 5, 6, 7, null, 11]);
  });
});
