# Phase 1 — 数据层列级审计（半两记）

> **产品叙事**：权威来源为本仓库 `database.ts` / `billRepo.ts` / `models.ts`。本表「审计备注」列仅保留历史核对痕迹，**不**构成「迁移自某旧产品」的对外说法。

**日期:** 2026-04-21  
**结论（单行）:** 表名 `bill_list`、库文件名 `main.db` 与 `database.ts` 中 DDL 一致；列集合与可空语义自洽，**无需**为对齐而改 DDL。

## 列对照表

| sql_column | ts_field | nullability | 审计备注 |
|------------|----------|-------------|----------|
| id | `Bill.id` / `BillRow.id` | 持久化行均有 id；插入前由 AUTOINCREMENT 赋值 | INTEGER PRIMARY KEY |
| type | `Bill.type` / `BillRow.type` | 非空语义；`rowToBill` 将非 2 归为 `1` | INTEGER NOT NULL，业务 1 支出 / 2 收入 |
| categoryId | `categoryId` | 整数非空 | INTEGER NOT NULL |
| icon | `icon` | 可选文本 | TEXT |
| name | `name` | 可选 | TEXT |
| remark | `remark` | 可选 | TEXT |
| amount | `amount` | 可空字符串 | TEXT；金额解析在业务层 |
| createTime | `createTime` | Unix 秒，可空 | REAL |
| updateTime | `updateTime` | 同上 | REAL |
| billTime | `billTime` | 同上 | REAL |

### type 归一

- SQL：`INTEGER NOT NULL`；读入后 `rowToBill` 将 `row.type === 2 ? 2 : 1`（`billRepo.ts`）。

### 时间戳

- `createTime` / `updateTime` / `billTime`：SQL `REAL`，TS `number | null`，语义为 **Unix 秒**。

## queryBillsInRange

`billRepo.ts` L93–L100：

```sql
SELECT * FROM bill_list WHERE billTime >= ? AND billTime < ?
 ORDER BY billTime DESC, updateTime DESC
```

谓词为半开区间 **`billTime >= startSec` 且 `billTime < endSecExclusive`**。

## amount 存储语义

- SQL：`amount TEXT`（`database.ts`）；RN：`Bill.amount` 为 `string | null`（`models.ts`）。
- 算术与展示解析在业务层（计算器 / 图表聚合等）完成；存储层保持 TEXT。

## 日界与时区

- `queryBillsForMonth`（`billRepo.ts` L81–L84）与 `queryBillsForCalendarDay`（L87–L90）使用 `new Date(y, m, d)` 构造日起点，依赖 **JavaScript 本地时区**。
- **结论：** `billTime` 的日/月边界按**设备本地日历日**解释，不是强制 UTC 日界。

## Required actions

None
