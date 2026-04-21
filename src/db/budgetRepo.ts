import { getDatabase } from "./database";

export function upsertBudgetCap(
  monthKey: string,
  categoryId: number,
  capAmount: string,
  nowSec: number,
): void {
  const db = getDatabase();
  db.runSync(
    `INSERT INTO budget_cap (month_key, category_id, cap_amount, create_time, update_time)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(month_key, category_id) DO UPDATE SET
       cap_amount = excluded.cap_amount,
       update_time = excluded.update_time`,
    [monthKey, categoryId, capAmount, nowSec, nowSec],
  );
}

export function getBudgetCap(monthKey: string, categoryId: number): string | null {
  const db = getDatabase();
  const row = db.getFirstSync<{ cap_amount: string }>(
    "SELECT cap_amount FROM budget_cap WHERE month_key = ? AND category_id = ?",
    [monthKey, categoryId],
  );
  return row === null ? null : row.cap_amount;
}
