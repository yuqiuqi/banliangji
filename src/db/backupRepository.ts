/**
 * SQLite backup/restore core only.
 *
 * Deliberately not wired to UI until file picker, preview and explicit
 * destructive-restore confirmation have been implemented and device-tested.
 */
import { getDatabase } from "./database";
import {
  createBackupJson,
  parseBackupJson,
  type BackupAsset,
  type BackupBill,
  type BackupBudget,
} from "./backupFormat";

export interface BackupCounts {
  bills: number;
  budgets: number;
  assets: number;
}

export function exportBackupJson(): string {
  const db = getDatabase();
  return createBackupJson({
    bills: db.getAllSync<BackupBill>(
      "SELECT id, type, categoryId, icon, name, remark, amount, createTime, updateTime, billTime FROM bill_list ORDER BY id",
    ),
    budgets: db.getAllSync<BackupBudget>(
      "SELECT id, month_key, category_id, cap_amount, create_time, update_time FROM budget_cap ORDER BY id",
    ),
    assets: db.getAllSync<BackupAsset>(
      "SELECT id, name, balance, create_time, update_time FROM asset_account ORDER BY id",
    ),
  });
}

/**
 * Full replacement: validated BEFORE opening the write transaction.
 * Never callable without an explicit destructive-operation opt-in.
 * Any SQL error throws and expo-sqlite rolls back the transaction.
 */
export function restoreBackupJson(
  json: string,
  options: { replaceAll: true },
): BackupCounts {
  if (options?.replaceAll !== true) {
    throw new Error("Refusing to overwrite existing data without replaceAll: true");
  }
  const backup = parseBackupJson(json);
  const { bills, budgets, assets } = backup.data;
  const db = getDatabase();
  db.withTransactionSync(() => {
    db.execSync("DELETE FROM bill_list; DELETE FROM budget_cap; DELETE FROM asset_account;");
    for (const row of bills) {
      db.runSync(
        `INSERT INTO bill_list
         (id, type, categoryId, icon, name, remark, amount, createTime, updateTime, billTime)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [row.id, row.type, row.categoryId, row.icon, row.name, row.remark,
          row.amount, row.createTime, row.updateTime, row.billTime],
      );
    }
    for (const row of budgets) {
      db.runSync(
        `INSERT INTO budget_cap
         (id, month_key, category_id, cap_amount, create_time, update_time)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [row.id, row.month_key, row.category_id, row.cap_amount,
          row.create_time, row.update_time],
      );
    }
    for (const row of assets) {
      db.runSync(
        `INSERT INTO asset_account (id, name, balance, create_time, update_time)
         VALUES (?, ?, ?, ?, ?)`,
        [row.id, row.name, row.balance, row.create_time, row.update_time],
      );
    }
  });
  return { bills: bills.length, budgets: budgets.length, assets: assets.length };
}
