import { describe, expect, it } from "vitest";
import {
  getLocalDayEndExclusiveSec,
  getLocalDayStartSec,
  getRangeFromInclusiveStartEndDay,
} from "./billTimeRange";

describe("billTimeRange", () => {
  it("getLocalDayStartSec / getLocalDayEndExclusiveSec 对齐本地日界", () => {
    const d = new Date(2024, 5, 15, 12, 0, 0);
    const start = new Date(2024, 5, 15, 0, 0, 0);
    const endEx = new Date(2024, 5, 16, 0, 0, 0);
    expect(getLocalDayStartSec(d)).toBe(start.getTime() / 1000);
    expect(getLocalDayEndExclusiveSec(d)).toBe(endEx.getTime() / 1000);
  });

  it("getRangeFromInclusiveStartEndDay 为半开 3 日，反序则抛错", () => {
    const a = new Date(2024, 5, 10);
    const b = new Date(2024, 5, 12);
    const { startSec, endSecExclusive } = getRangeFromInclusiveStartEndDay(a, b);
    expect(endSecExclusive - startSec).toBe(3 * 86400);
    expect(() => getRangeFromInclusiveStartEndDay(b, a)).toThrow();
  });
});
