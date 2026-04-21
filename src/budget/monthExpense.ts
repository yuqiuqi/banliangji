import type { Bill } from "../types/models";
import { parseAmount } from "../utils/money";

/** 与 `billRepo.queryBillsForMonth` 相同的本地日历月半开区间 [start, endExclusive)（billTime 为 Unix 秒）。 */
export function sumExpenseForCalendarMonth(monthAnchor: Date, bills: Bill[]): number {
  const y = monthAnchor.getFullYear();
  const m = monthAnchor.getMonth();
  const start = new Date(y, m, 1);
  const endExclusive = new Date(y, m + 1, 1);
  const startSec = start.getTime() / 1000;
  const endSec = endExclusive.getTime() / 1000;
  let sum = 0;
  for (const bill of bills) {
    if (bill.type !== 1) {
      continue;
    }
    const t = bill.billTime;
    if (t === null || t === undefined) {
      continue;
    }
    if (t < startSec || t >= endSec) {
      continue;
    }
    sum += parseAmount(bill.amount);
  }
  return sum;
}
