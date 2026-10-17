/**
 * 半两记备份 JSON v1：纯数据契约，不依赖 SQLite / React Native。
 * 修改格式前必须提供独立迁移器；不得静默接受未来版本。
 */
export const BACKUP_FORMAT = "banliangji/backup" as const;
export const BACKUP_VERSION = 1 as const;
const MAX_JSON_LENGTH = 20_000_000;
const MAX_ROWS_PER_TABLE = 50_000;

export interface BackupBill {
  id: number;
  type: 1 | 2;
  categoryId: number;
  icon: string | null;
  name: string | null;
  remark: string | null;
  amount: string | null;
  createTime: number | null;
  updateTime: number | null;
  billTime: number | null;
}

export interface BackupBudget {
  id: number;
  month_key: string;
  category_id: number;
  cap_amount: string;
  create_time: number | null;
  update_time: number | null;
}

export interface BackupAsset {
  id: number;
  name: string;
  balance: string;
  create_time: number | null;
  update_time: number | null;
}

export interface BackupData {
  bills: BackupBill[];
  budgets: BackupBudget[];
  assets: BackupAsset[];
}

export interface BackupV1 {
  format: typeof BACKUP_FORMAT;
  version: typeof BACKUP_VERSION;
  exportedAt: string;
  data: BackupData;
}

function object(value: unknown, path: string): Record<string, unknown> {
  if (value === null || Array.isArray(value) || typeof value !== "object") {
    throw new Error(`Invalid backup: ${path} must be an object`);
  }
  return value as Record<string, unknown>;
}

function integer(value: unknown, path: string, positive = false): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || (positive && value <= 0)) {
    throw new Error(`Invalid backup: ${path} must be a ${positive ? "positive " : ""}integer`);
  }
  return value;
}

function str(value: unknown, path: string, nonEmpty = false): string {
  if (typeof value !== "string" || (nonEmpty && value.length === 0)) {
    throw new Error(`Invalid backup: ${path} must be a ${nonEmpty ? "nonempty " : ""}string`);
  }
  return value;
}

function nullableString(value: unknown, path: string): string | null {
  return value === null ? null : str(value, path);
}

function nullableNumber(value: unknown, path: string): number | null {
  if (value === null) return null;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Invalid backup: ${path} must be a finite number or null`);
  }
  return value;
}

function rows(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value) || value.length > MAX_ROWS_PER_TABLE) {
    throw new Error(`Invalid backup: ${path} must be an array of at most ${MAX_ROWS_PER_TABLE} rows`);
  }
  return value as unknown[];
}

function uniqueIds<T extends { id: number }>(items: T[], path: string): T[] {
  const seen = new Set<number>();
  for (const item of items) {
    if (seen.has(item.id)) throw new Error(`Invalid backup: duplicate ${path} id ${item.id}`);
    seen.add(item.id);
  }
  return items;
}

export function createBackupJson(data: BackupData, exportedAt = new Date().toISOString()): string {
  const payload: BackupV1 = {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt,
    data,
  };
  return JSON.stringify(payload);
}

/** Returns validated and field-filtered data; never hand an unparsed JSON object to SQL. */
export function parseBackupJson(json: string): BackupV1 {
  if (typeof json !== "string" || json.length > MAX_JSON_LENGTH) {
    throw new Error("Invalid backup: file is too large or not text");
  }
  let raw: unknown;
  try {
    raw = JSON.parse(json) as unknown;
  } catch {
    throw new Error("Invalid backup: malformed JSON");
  }
  const root = object(raw, "root");
  if (root.format !== BACKUP_FORMAT || root.version !== BACKUP_VERSION) {
    throw new Error("Unsupported backup format or version (expected banliangji/backup v1)");
  }
  const exportedAt = str(root.exportedAt, "exportedAt", true);
  if (!Number.isFinite(Date.parse(exportedAt))) {
    throw new Error("Invalid backup: exportedAt must be a date");
  }
  const data = object(root.data, "data");
  const bills = uniqueIds(rows(data.bills, "bills").map((input, index): BackupBill => {
    const path = `bills[${index}]`;
    const r = object(input, path);
    const type = integer(r.type, path + ".type");
    if (type !== 1 && type !== 2) throw new Error("Invalid backup: bill type must be 1 or 2");
    return {
      id: integer(r.id, path + ".id", true),
      type,
      categoryId: integer(r.categoryId, path + ".categoryId"),
      icon: nullableString(r.icon, path + ".icon"),
      name: nullableString(r.name, path + ".name"),
      remark: nullableString(r.remark, path + ".remark"),
      amount: nullableString(r.amount, path + ".amount"),
      createTime: nullableNumber(r.createTime, path + ".createTime"),
      updateTime: nullableNumber(r.updateTime, path + ".updateTime"),
      billTime: nullableNumber(r.billTime, path + ".billTime"),
    };
  }), "bill_list");
  const budgets = uniqueIds(rows(data.budgets, "budgets").map((input, index): BackupBudget => {
    const path = `budgets[${index}]`;
    const r = object(input, path);
    return {
      id: integer(r.id, path + ".id", true),
      month_key: str(r.month_key, path + ".month_key", true),
      category_id: integer(r.category_id, path + ".category_id"),
      cap_amount: str(r.cap_amount, path + ".cap_amount", true),
      create_time: nullableNumber(r.create_time, path + ".create_time"),
      update_time: nullableNumber(r.update_time, path + ".update_time"),
    };
  }), "budget_cap");
  const budgetKeys = new Set<string>();
  for (const budget of budgets) {
    const key = JSON.stringify([budget.month_key, budget.category_id]);
    if (budgetKeys.has(key)) throw new Error("Invalid backup: duplicate month/category budget");
    budgetKeys.add(key);
  }
  const assets = uniqueIds(rows(data.assets, "assets").map((input, index): BackupAsset => {
    const path = `assets[${index}]`;
    const r = object(input, path);
    return {
      id: integer(r.id, path + ".id", true),
      name: str(r.name, path + ".name", true),
      balance: str(r.balance, path + ".balance", true),
      create_time: nullableNumber(r.create_time, path + ".create_time"),
      update_time: nullableNumber(r.update_time, path + ".update_time"),
    };
  }), "asset_account");
  return { format: BACKUP_FORMAT, version: BACKUP_VERSION, exportedAt, data: { bills, budgets, assets } };
}
