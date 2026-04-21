import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  getISOWeek,
  getISOWeekYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { zhCN } from "date-fns/locale";
import { parseAmount } from "./money";

export function formatBillDayKey(d: Date): string {
  return format(d, "yyyyMMdd");
}

export function formatHeaderYear(d: Date): string {
  return format(d, "yyyy年", { locale: zhCN });
}

export function formatHeaderMonth(d: Date): string {
  return format(d, "MM月", { locale: zhCN });
}

export function formatSectionTitleFromKey(key: string): string {
  if (key.length !== 8) {
    return key;
  }
  const y = Number(key.slice(0, 4));
  const m = Number(key.slice(4, 6));
  const day = Number(key.slice(6, 8));
  const d = new Date(y, m - 1, day);
  return format(d, "M月d日 EEEE", { locale: zhCN });
}

export function formatDetailDate(d: Date): string {
  return format(d, "yyyy年M月d日 EEEE", { locale: zhCN });
}

export function formatTimeShort(d: Date): string {
  return format(d, "HH:mm");
}

export function monthRangeExclusive(anchor: Date): { start: Date; endExclusive: Date } {
  const start = startOfMonth(anchor);
  const endExclusive = addMonths(start, 1);
  return { start, endExclusive };
}

export function dayRangeExclusive(day: Date): { start: Date; endExclusive: Date } {
  const start = startOfDay(day);
  const endExclusive = addDays(start, 1);
  return { start, endExclusive };
}

export function calendarGridMonth(anchor: Date): Date[] {
  const start = startOfMonth(anchor);
  const end = endOfMonth(anchor);
  return eachDayOfInterval({ start, end });
}

/** 以周一为一周起始，对齐常见中文日历习惯 */
export function weekStartMonday(d: Date): Date {
  return startOfWeek(d, { weekStartsOn: 1 });
}

export function addCalendarMonth(d: Date, delta: number): Date {
  return addMonths(d, delta);
}

export function rangeForChartPeriod(
  start: Date,
  granularity: "week" | "month" | "year",
): { start: Date; endExclusive: Date } {
  if (granularity === "week") {
    const s = startOfDay(start);
    const endExclusive = addDays(s, 7);
    return { start: s, endExclusive };
  }
  if (granularity === "month") {
    const s = startOfMonth(start);
    const endExclusive = addMonths(s, 1);
    return { start: s, endExclusive };
  }
  const s = startOfYear(start);
  const endExclusive = addYearsSafe(s);
  return { start: s, endExclusive };
}

function addYearsSafe(d: Date): Date {
  return addMonths(d, 12);
}

export function chartWeekPeriods(firstBill: Date, lastBill: Date): { start: Date; label: string }[] {
  const lo = firstBill.getTime() <= lastBill.getTime() ? firstBill : lastBill;
  const hi = firstBill.getTime() <= lastBill.getTime() ? lastBill : firstBill;
  let cursor = weekStartMonday(lo);
  const end = weekStartMonday(hi);
  const out: { start: Date; label: string }[] = [];
  let guard = 0;
  while (cursor.getTime() <= end.getTime() && guard < 520) {
    out.push({
      start: cursor,
      label: `${getISOWeekYear(cursor)}-${String(getISOWeek(cursor)).padStart(2, "0")}周`,
    });
    cursor = addWeeks(cursor, 1);
    guard += 1;
  }
  if (out.length === 0) {
    const s = weekStartMonday(new Date());
    out.push({
      start: s,
      label: `${getISOWeekYear(s)}-${String(getISOWeek(s)).padStart(2, "0")}周`,
    });
  }
  return out;
}

export function chartMonthPeriods(firstBill: Date, lastBill: Date): { start: Date; label: string }[] {
  const lo = firstBill.getTime() <= lastBill.getTime() ? firstBill : lastBill;
  const hi = firstBill.getTime() <= lastBill.getTime() ? lastBill : firstBill;
  let cursor = startOfMonth(lo);
  const end = startOfMonth(hi);
  const out: { start: Date; label: string }[] = [];
  let guard = 0;
  while (cursor.getTime() <= end.getTime() && guard < 600) {
    const sameYear = cursor.getFullYear() === new Date().getFullYear();
    const label = sameYear ? `${cursor.getMonth() + 1}月` : `${cursor.getFullYear()}-${cursor.getMonth() + 1}月`;
    out.push({ start: cursor, label });
    cursor = addMonths(cursor, 1);
    guard += 1;
  }
  if (out.length === 0) {
    const s = startOfMonth(new Date());
    out.push({ start: s, label: `${s.getMonth() + 1}月` });
  }
  return out;
}

export function chartYearPeriods(firstBill: Date, lastBill: Date): { start: Date; label: string }[] {
  const lo = firstBill.getTime() <= lastBill.getTime() ? firstBill : lastBill;
  const hi = firstBill.getTime() <= lastBill.getTime() ? lastBill : firstBill;
  const y0 = lo.getFullYear();
  const y1 = hi.getFullYear();
  const out: { start: Date; label: string }[] = [];
  for (let y = y0; y <= y1; y += 1) {
    out.push({ start: new Date(y, 0, 1), label: `${y}年` });
  }
  if (out.length === 0) {
    const y = new Date().getFullYear();
    out.push({ start: new Date(y, 0, 1), label: `${y}年` });
  }
  return out;
}

export function weekdayLabels(): string[] {
  return ["一", "二", "三", "四", "五", "六", "日"];
}

export function padCalendarLeadingBlanks(monthAnchor: Date): (Date | null)[] {
  const days = calendarGridMonth(monthAnchor);
  if (days.length === 0) {
    return [];
  }
  const first = days[0];
  if (first === undefined) {
    return [];
  }
  const wd = getDay(first);
  const mondayBased = wd === 0 ? 6 : wd - 1;
  const cells: (Date | null)[] = [];
  for (let i = 0; i < mondayBased; i += 1) {
    cells.push(null);
  }
  for (const d of days) {
    cells.push(d);
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  return cells;
}

export function yearMonthPointsForChart(yearStart: Date, billsExpense: { billTime: number | null; amount: string | null }[]): {
  label: string;
  amount: number;
  hasData: boolean;
}[] {
  const y = yearStart.getFullYear();
  const points: { label: string; amount: number; hasData: boolean }[] = [];
  const labeledMonths = new Set([1, 3, 6, 9, 12]);
  for (let m = 1; m <= 12; m += 1) {
    const s = new Date(y, m - 1, 1);
    const startSec = s.getTime() / 1000;
    const endExclusiveSec = addMonths(s, 1).getTime() / 1000;
    let sum = 0;
    let count = 0;
    for (const b of billsExpense) {
      const t = b.billTime;
      if (t === null) {
        continue;
      }
      if (t >= startSec && t < endExclusiveSec) {
        sum += parseAmount(b.amount);
        count += 1;
      }
    }
    points.push({
      label: labeledMonths.has(m) ? `${m}月` : "",
      amount: sum,
      hasData: count > 0,
    });
  }
  return points;
}
