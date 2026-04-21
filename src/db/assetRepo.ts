import { getDatabase } from "./database";

export interface AssetAccountRow {
  id: number;
  name: string;
  balance: string;
  create_time: number | null;
  update_time: number | null;
}

export function listAssetAccounts(): AssetAccountRow[] {
  const db = getDatabase();
  return db.getAllSync<AssetAccountRow>(
    "SELECT * FROM asset_account ORDER BY id ASC",
  );
}

export function insertAssetAccount(name: string, balance: string, nowSec: number): void {
  const db = getDatabase();
  db.runSync(
    "INSERT INTO asset_account (name, balance, create_time, update_time) VALUES (?, ?, ?, ?)",
    [name, balance, nowSec, nowSec],
  );
}

export function updateAssetAccount(id: number, name: string, balance: string, nowSec: number): void {
  const db = getDatabase();
  db.runSync(
    "UPDATE asset_account SET name = ?, balance = ?, update_time = ? WHERE id = ?",
    [name, balance, nowSec, id],
  );
}

export function deleteAssetAccount(id: number): void {
  const db = getDatabase();
  db.runSync("DELETE FROM asset_account WHERE id = ?", [id]);
}
