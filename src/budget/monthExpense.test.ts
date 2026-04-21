import { describe, expect, it } from "vitest";
import { filterExpense } from "../chart/chartAggregate";
import type { Bill } from "../types/models";
import { parseAmount } from "../utils/money";
import { sumExpenseForCalendarMonth } from "./monthExpense";

function bill(partial: Partial<Bill> & Pick<Bill, "type" | "categoryId" | "amount" | "billTime">): Bill {
  return {
    id: partial.id ?? 0,
    type: partial.type,
    categoryId: partial.categoryId,
    icon: partial.icon ?? null,
    name: partial.name ?? null,
    remark: partial.remark ?? null,
    amount: partial.amount ?? null,
    createTime: partial.createTime ?? null,
    updateTime: partial.updateTime ?? null,
    billTime: partial.billTime,
  };
}

describe("sumExpenseForCalendarMonth", () => {
  const monthAnchor = new Date(2026, 3, 15);
  const inMonthSec = new Date(2026, 3, 10).getTime() / 1000;

  it("counts only type 1 (expense) in the calendar month", () => {
    const bills: Bill[] = [
      bill({ type: 1, categoryId: 1, amount: "10", billTime: inMonthSec }),
      bill({ type: 2, categoryId: 2, amount: "99", billTime: inMonthSec }),
    ];
    expect(sumExpenseForCalendarMonth(monthAnchor, bills)).toBe(10);
  });

  it("matches chartAggregate expense filter total for same bills", () => {
    const bills: Bill[] = [
      bill({ type: 1, categoryId: 1, amount: "12.5", billTime: inMonthSec }),
      bill({ type: 1, categoryId: 2, amount: "3.5", billTime: inMonthSec }),
      bill({ type: 2, categoryId: 3, amount: "1000", billTime: inMonthSec }),
    ];
    const ex = filterExpense(bills);
    const fromChartLogic = ex.reduce((s, b) => s + parseAmount(b.amount), 0);
    expect(sumExpenseForCalendarMonth(monthAnchor, bills)).toBe(fromChartLogic);
  });

  it("excludes bills outside the month", () => {
    const prevMonthSec = new Date(2026, 2, 31).getTime() / 1000;
    const bills: Bill[] = [bill({ type: 1, categoryId: 1, amount: "5", billTime: prevMonthSec })];
    expect(sumExpenseForCalendarMonth(monthAnchor, bills)).toBe(0);
  });
});
