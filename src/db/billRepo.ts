import type { Bill, BillAmountKind, BillRow } from "../types/models";
import { getDatabase } from "./database";

function rowToBill(row: BillRow): Bill {
  const t = row.type === 2 ? 2 : 1;
  return {
    id: row.id,
    type: t,
    categoryId: row.categoryId,
    icon: row.icon,
    name: row.name,
    remark: row.remark,
    amount: row.amount,
    createTime: row.createTime,
    updateTime: row.updateTime,
    billTime: row.billTime,
  };
}

export function insertBill(input: Omit<Bill, "id">): void {
  const db = getDatabase();
  db.runSync(
    `INSERT INTO bill_list (type, categoryId, icon, name, remark, amount, createTime, updateTime, billTime)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.type,
      input.categoryId,
      input.icon,
      input.name,
      input.remark,
      input.amount,
      input.createTime,
      input.updateTime,
      input.billTime,
    ],
  );
}

export function updateBill(bill: Bill): void {
  if (bill.id <= 0) {
    throw new Error("updateBill: missing id");
  }
  const db = getDatabase();
  db.runSync(
    `UPDATE bill_list SET type = ?, categoryId = ?, icon = ?, name = ?, remark = ?, amount = ?,
     createTime = ?, updateTime = ?, billTime = ? WHERE id = ?`,
    [
      bill.type,
      bill.categoryId,
      bill.icon,
      bill.name,
      bill.remark,
      bill.amount,
      bill.createTime,
      bill.updateTime,
      bill.billTime,
      bill.id,
    ],
  );
}

export function deleteBillById(id: number): void {
  const db = getDatabase();
  db.runSync("DELETE FROM bill_list WHERE id = ?", [id]);
}

export function getBillById(id: number): Bill | null {
  const db = getDatabase();
  const row = db.getFirstSync<BillRow>("SELECT * FROM bill_list WHERE id = ?", [id]);
  return row === null ? null : rowToBill(row);
}

export function queryAllBills(): Bill[] {
  const db = getDatabase();
  const rows = db.getAllSync<BillRow>(
    "SELECT * FROM bill_list ORDER BY billTime DESC, updateTime DESC",
  );
  return rows.map(rowToBill);
}

export function queryBillsForMonth(monthAnchor: Date): Bill[] {
  const start = new Date(monthAnchor.getFullYear(), monthAnchor.getMonth(), 1);
  const endExclusive = new Date(monthAnchor.getFullYear(), monthAnchor.getMonth() + 1, 1);
  return queryBillsInRange(start.getTime() / 1000, endExclusive.getTime() / 1000);
}

export function queryBillsForCalendarDay(day: Date): Bill[] {
  const start = new Date(day.getFullYear(), day.getMonth(), day.getDate());
  const endExclusive = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
  return queryBillsInRange(start.getTime() / 1000, endExclusive.getTime() / 1000);
}

export function queryBillsInRange(startSec: number, endSecExclusive: number): Bill[] {
  const db = getDatabase();
  const rows = db.getAllSync<BillRow>(
    `SELECT * FROM bill_list WHERE billTime >= ? AND billTime < ?
     ORDER BY billTime DESC, updateTime DESC`,
    [startSec, endSecExclusive],
  );
  return rows.map(rowToBill);
}

export function groupBillsByDayKey(bills: Bill[]): Map<string, Bill[]> {
  const map = new Map<string, Bill[]>();
  for (const bill of bills) {
    const t = bill.billTime;
    if (t === null || t === undefined) {
      continue;
    }
    const d = new Date(t * 1000);
    const key = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    const list = map.get(key);
    if (list === undefined) {
      map.set(key, [bill]);
    } else {
      list.push(bill);
    }
  }
  for (const [, list] of map) {
    list.sort((a, b) => (b.updateTime ?? 0) - (a.updateTime ?? 0));
  }
  return map;
}

export type NewBillInput = {
  type: BillAmountKind;
  categoryId: number;
  icon: string | null;
  name: string | null;
  remark: string | null;
  amount: string;
  billTimeSec: number;
};

export function createBillNow(input: NewBillInput): void {
  const now = Date.now() / 1000;
  insertBill({
    type: input.type,
    categoryId: input.categoryId,
    icon: input.icon,
    name: input.name,
    remark: input.remark,
    amount: input.amount,
    createTime: now,
    updateTime: now,
    billTime: input.billTimeSec,
  });
}
