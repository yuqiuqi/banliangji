/** 近似 Swift `Float.string()` 的展示规则 */
export function formatAmountDisplay(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  if (Number.isInteger(rounded)) {
    return String(rounded);
  }
  const two = rounded.toFixed(2);
  if (two.endsWith("0") && !two.endsWith("00")) {
    return rounded.toFixed(1);
  }
  return two;
}

export function parseAmount(s: string | null | undefined): number {
  if (s === null || s === undefined || s === "") {
    return 0;
  }
  const v = parseFloat(s);
  return Number.isFinite(v) ? v : 0;
}
