import { openDatabaseSync, type SQLiteDatabase } from "expo-sqlite";

let instance: SQLiteDatabase | null = null;

export function getDatabase(): SQLiteDatabase {
  if (instance === null) {
    const db = openDatabaseSync("main.db");
    db.execSync(`
      CREATE TABLE IF NOT EXISTS bill_list (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        type INTEGER NOT NULL,
        categoryId INTEGER NOT NULL,
        icon TEXT,
        name TEXT,
        remark TEXT,
        amount TEXT,
        createTime REAL,
        updateTime REAL,
        billTime REAL
      );
      CREATE TABLE IF NOT EXISTS budget_cap (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        month_key TEXT NOT NULL,
        category_id INTEGER NOT NULL DEFAULT -1,
        cap_amount TEXT NOT NULL,
        create_time REAL,
        update_time REAL,
        UNIQUE(month_key, category_id)
      );
      CREATE TABLE IF NOT EXISTS asset_account (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        name TEXT NOT NULL,
        balance TEXT NOT NULL DEFAULT '0',
        create_time REAL,
        update_time REAL
      );
    `);
    instance = db;
  }
  return instance;
}
