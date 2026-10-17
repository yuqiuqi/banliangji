import { describe, expect, it } from "vitest";
import { createBackupJson, parseBackupJson, type BackupData } from "./backupFormat";

const empty: BackupData = { bills: [], budgets: [], assets: [] };
const full: BackupData = {
  bills: [{
    id: 10, type: 1, categoryId: 5, icon: null, name: "午饭",
    remark: "测试备份", amount: "18.50", createTime: 1, updateTime: 2, billTime: 3,
  }],
  budgets: [{
    id: 2, month_key: "2026-10", category_id: -1,
    cap_amount: "1000", create_time: null, update_time: 4,
  }],
  assets: [{
    id: 3, name: "现金", balance: "250.00",
    create_time: 5, update_time: null,
  }],
};

describe("banliangji backup v1", () => {
  it("round-trips empty and populated backups", () => {
    expect(parseBackupJson(createBackupJson(empty)).data).toEqual(empty);
    expect(parseBackupJson(createBackupJson(full, "2026-10-17T00:00:00.000Z")).data).toEqual(full);
  });

  it("rejects corrupt JSON, wrong version and wrong format", () => {
    expect(() => parseBackupJson("{")).toThrow("malformed");
    expect(() => parseBackupJson('{"format":"unknown","version":1}')).toThrow("Unsupported");
    expect(() => parseBackupJson(createBackupJson(empty).replace('"version":1', '"version":2'))).toThrow("Unsupported");
  });

  it("rejects invalid bill type and non-finite timestamps", () => {
    const invalidType = JSON.parse(createBackupJson(full));
    invalidType.data.bills[0].type = 9;
    expect(() => parseBackupJson(JSON.stringify(invalidType))).toThrow("type");
    const invalidTimestamp = JSON.parse(createBackupJson(full));
    invalidTimestamp.data.bills[0].createTime = "yesterday";
    expect(() => parseBackupJson(JSON.stringify(invalidTimestamp))).toThrow("createTime");
  });

  it("rejects duplicate IDs and duplicate budget keys", () => {
    const duplicateBill = JSON.parse(createBackupJson(full));
    duplicateBill.data.bills.push({ ...duplicateBill.data.bills[0] });
    expect(() => parseBackupJson(JSON.stringify(duplicateBill))).toThrow("duplicate bill_list");
    const duplicateBudget = JSON.parse(createBackupJson(full));
    duplicateBudget.data.budgets.push({ ...duplicateBudget.data.budgets[0], id: 99 });
    expect(() => parseBackupJson(JSON.stringify(duplicateBudget))).toThrow("duplicate month/category");
  });

  it("rejects missing collections and malformed field values", () => {
    const missing = JSON.parse(createBackupJson(empty));
    delete missing.data.assets;
    expect(() => parseBackupJson(JSON.stringify(missing))).toThrow("assets");
    const badAmount = JSON.parse(createBackupJson(full));
    badAmount.data.assets[0].balance = null;
    expect(() => parseBackupJson(JSON.stringify(badAmount))).toThrow("balance");
  });

  it("filters unknown fields rather than trusting unparsed data", () => {
    const augmented = JSON.parse(createBackupJson(full));
    augmented.data.bills[0].injected = "ignored";
    expect(parseBackupJson(JSON.stringify(augmented)).data.bills[0]).not.toHaveProperty("injected");
  });
});
