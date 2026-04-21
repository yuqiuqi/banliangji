import { describe, expect, it } from "vitest";
import { aggregateExpenseByCategory, chartPointsWeekOrMonth, chartPointsYear, filterExpense } from "./chartAggregate";
import type { Bill } from "../types/models";
import { yearMonthPointsForChart } from "../utils/dates";

function bill(partial: Partial<Bill> & Pick<Bill, "id" | "type" | "categoryId" | "amount" | "billTime">): Bill {
  return {
    icon: null,
    name: "cat",
    remark: null,
    createTime: null,
    updateTime: null,
    ...partial,
  };
}

describe("filterExpense", () => {
  it("keeps only expense rows (type 1)", () => {
    const bills = [
      bill({ id: 1, type: 1, categoryId: 1, amount: "10", billTime: 100 }),
      bill({ id: 2, type: 2, categoryId: 2, amount: "99", billTime: 100 }),
    ];
    const ex = filterExpense(bills);
    expect(ex).toHaveLength(1);
    expect(ex[0]?.id).toBe(1);
  });
});

describe("aggregateExpenseByCategory", () => {
  it("sums amounts and ratios sum to 1", () => {
    const bills = [
      bill({ id: 1, type: 1, categoryId: 1, amount: "30", billTime: 1, name: "a" }),
      bill({ id: 2, type: 1, categoryId: 2, amount: "70", billTime: 2, name: "b" }),
    ];
    const agg = aggregateExpenseByCategory(bills);
    expect(agg).toHaveLength(2);
    const sumR = agg.reduce((s, x) => s + x.ratio, 0);
    expect(sumR).toBeCloseTo(1, 6);
    const sumAmt = agg.reduce((s, x) => s + x.amount, 0);
    expect(sumAmt).toBe(100);
  });
});

describe("yearMonthPointsForChart", () => {
  it("uses half-open [monthStart, nextMonth) and parseAmount", () => {
    const y = 2024;
    const jan31 = new Date(y, 0, 31, 12, 0, 0);
    const feb1 = new Date(y, 1, 1, 8, 0, 0);
    const bills = [
      { billTime: jan31.getTime() / 1000, amount: "100" },
      { billTime: feb1.getTime() / 1000, amount: "50" },
    ];
    const pts = yearMonthPointsForChart(new Date(y, 0, 1), bills);
    expect(pts[0]?.amount).toBe(100);
    expect(pts[1]?.amount).toBe(50);
    expect(pts[2]?.amount).toBe(0);
  });
});

describe("chartPointsWeekOrMonth", () => {
  it("aggregates by calendar day in range", () => {
    const start = new Date(2024, 5, 10, 0, 0, 0);
    const endExclusive = new Date(2024, 5, 13, 0, 0, 0);
    const dayKey = (d: Date) => d.getTime() / 1000;
    const bills = [
      bill({
        id: 1,
        type: 1,
        categoryId: 1,
        amount: "25",
        billTime: dayKey(new Date(2024, 5, 11, 15, 0, 0)),
      }),
    ];
    const pts = chartPointsWeekOrMonth(start, endExclusive, bills, true);
    expect(pts.length).toBe(3);
    const mid = pts[1];
    expect(mid?.amount).toBe(25);
    expect(mid?.hasData).toBe(true);
  });
});

describe("chartPointsYear", () => {
  it("delegates to yearMonthPointsForChart for expense bills", () => {
    const y = 2023;
    const bills = [
      bill({
        id: 1,
        type: 1,
        categoryId: 1,
        amount: "12",
        billTime: new Date(y, 5, 15).getTime() / 1000,
      }),
    ];
    const pts = chartPointsYear(new Date(y, 0, 1), bills);
    expect(pts[5]?.amount).toBe(12);
    expect(pts[5]?.hasData).toBe(true);
  });
});
