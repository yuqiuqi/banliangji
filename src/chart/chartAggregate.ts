import { addDays, eachDayOfInterval, format } from "date-fns";
import type { Bill, CategorySpend, ChartPoint } from "../types/models";
import { parseAmount } from "../utils/money";
import { formatBillDayKey, yearMonthPointsForChart } from "../utils/dates";

export function filterExpense(bills: Bill[]): Bill[] {
  return bills.filter((b) => b.type === 1);
}

export function aggregateExpenseByCategory(bills: Bill[]): CategorySpend[] {
  const ex = filterExpense(bills);
  if (ex.length === 0) {
    return [];
  }
  const total = ex.reduce((s, b) => s + parseAmount(b.amount), 0);
  if (total <= 0) {
    return [];
  }
  const byCat = new Map<number, Bill[]>();
  for (const b of ex) {
    const list = byCat.get(b.categoryId);
    if (list === undefined) {
      byCat.set(b.categoryId, [b]);
    } else {
      list.push(b);
    }
  }
  const rows: CategorySpend[] = [];
  for (const [categoryId, list] of byCat) {
    const amount = list.reduce((s, b) => s + parseAmount(b.amount), 0);
    const first = list[0];
    rows.push({
      categoryId,
      name: first?.name ?? `类别 ${categoryId}`,
      icon: first?.icon ?? null,
      amount,
      ratio: amount / total,
    });
  }
  rows.sort((a, b) => b.ratio - a.ratio);
  return rows;
}

function showMonthDayLabel(totalDays: number, dayIndex1: number): boolean {
  const day = dayIndex1;
  if (day === 1 || day === totalDays) {
    return true;
  }
  if (totalDays > 30) {
    return day % 5 === 0 && day !== 30;
  }
  return true;
}

export function chartPointsWeekOrMonth(
  start: Date,
  endExclusive: Date,
  bills: Bill[],
  isWeek: boolean,
): ChartPoint[] {
  const endDay = addDays(endExclusive, -1);
  const days = eachDayOfInterval({ start, end: endDay });
  const totalDays = days.length;
  const ex = filterExpense(bills);
  const points: ChartPoint[] = [];
  days.forEach((d, idx) => {
    const key = formatBillDayKey(d);
    let sum = 0;
    let count = 0;
    for (const b of ex) {
      const t = b.billTime;
      if (t === null) {
        continue;
      }
      const bk = formatBillDayKey(new Date(t * 1000));
      if (bk === key) {
        sum += parseAmount(b.amount);
        count += 1;
      }
    }
    let label = "";
    if (isWeek) {
      label = format(d, "M-d");
    } else if (showMonthDayLabel(totalDays, idx + 1)) {
      label = format(d, "d");
    }
    points.push({ label, amount: sum, hasData: count > 0 });
  });
  return points;
}

export function chartPointsYear(yearStart: Date, bills: Bill[]): ChartPoint[] {
  const ex = filterExpense(bills);
  return yearMonthPointsForChart(yearStart, ex);
}
