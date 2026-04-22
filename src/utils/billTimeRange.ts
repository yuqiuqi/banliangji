// billTime 在 bill_list 中为 UNIX 秒，与项目其余代码一致。区间均为半开 [startSec, endSecExclusive)。

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addLocalDays(d: Date, days: number): Date {
  const s = startOfLocalDay(d);
  return new Date(s.getFullYear(), s.getMonth(), s.getDate() + days);
}

/** 该自然日 0:00:00 的 UNIX 秒（本地日历）。 */
export function getLocalDayStartSec(d: Date): number {
  return startOfLocalDay(d).getTime() / 1000;
}

/** 下一自然日 0:00:00 的 UNIX 秒，即 [当日 0:00, 该秒) 覆盖当天全部 billTime。 */
export function getLocalDayEndExclusiveSec(d: Date): number {
  return getLocalDayStartSec(addLocalDays(d, 1));
}

/**
 * 含首含尾的两天日历区间 → 半开 [startSec, endSecExclusive)。
 * 当结束日（日历）早于开始日时抛错，message 含「开始」与「结束」。
 */
export function getRangeFromInclusiveStartEndDay(
  startInclusive: Date,
  endInclusive: Date,
): { startSec: number; endSecExclusive: number } {
  const a = startOfLocalDay(startInclusive);
  const b = startOfLocalDay(endInclusive);
  if (b.getTime() < a.getTime()) {
    throw new Error("结束日不能早于开始日");
  }
  const startSec = a.getTime() / 1000;
  const endSecExclusive = getLocalDayStartSec(addLocalDays(endInclusive, 1));
  return { startSec, endSecExclusive };
}
