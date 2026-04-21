# Phase 1 — Swift ↔ RN 数据层对照审计

**日期:** 2026-04-21  
**结论（单行）:** 表名 `bill_list`、库文件名 `main.db` 与参考 Swift（`THomeBillModel` / `TableName.billList`）一致；RN `database.ts` DDL 与 Swift GRDB 建表在列集合与可空语义上对齐，无需为对齐而改 DDL。

## 列对照表

| sql_column | swift_property | ts_field | nullability | notes |
|------------|------------------|----------|-------------|-------|
| id | `id` (`Int?`，插入前可为空) | `Bill.id` / `BillRow.id` | 持久化行：一致（均有 id）；插入前 Swift 允许 nil，RN 由 AUTOINCREMENT 赋值 | Swift 模型 L38；RN 读行后 `id` 为 `number` |
| type | `type` (`Int`，默认 1) | `Bill.type` / `BillRow.type` | 一致：均非空语义；RN `rowToBill` 将非 2 归为 `1` | Swift L13；RN `billRepo.ts` `rowToBill` |
| categoryId | `categoryId` (`Int`，默认 0) | `categoryId` | 一致：整数非空 | Swift L16 |
| icon | `icon` (`String?`) | `icon` | 一致：可选文本 | Swift L19 |
| name | `name` (`String?`) | `name` | 一致 | Swift L21 |
| remark | `remark` (`String?`) | `remark` | 一致 | Swift L24 |
| amount | `amount` (`String?`) | `amount` | 一致：均为可空字符串 | Swift L27 |
| createTime | `createTime` (`Double?`) | `createTime` | 一致：Unix 秒，可空 | Swift L30；RN `number \| null` |
| updateTime | `updateTime` (`Double?`) | `updateTime` | 一致 | Swift L33 |
| billTime | `billTime` (`Double?`) | `billTime` | 一致 | Swift L36 |

### type 归一

- Swift 侧为 `Int`（见 `THomeBillModel.swift` L13）。
- RN 持久化 `INTEGER NOT NULL`，读入后 `rowToBill` 将 `row.type === 2 ? 2 : 1`（`billRepo.ts`）。

### 时间戳

- `createTime` / `updateTime` / `billTime` 在 Swift 为 `Double?`（秒级 `timeIntervalSince1970`，见 Swift `query(date:)` L123–L124）；RN 为 `REAL` 与 `number | null`，语义为 **Unix 秒**。

## queryBillsInRange

`billRepo.ts` L93–L100：

```sql
SELECT * FROM bill_list WHERE billTime >= ? AND billTime < ?
 ORDER BY billTime DESC, updateTime DESC
```

谓词为半开区间 **`billTime >= startSec` 且 `billTime < endSecExclusive`**，与 Swift `THomeBillModel.query(startTimeInterval:endTimeInterval:)` L161–L162（`>=` 与 `<`）一致。

## amount 存储语义

- Swift：`THomeBillModel.swift` L27 **`var amount: String?`** — 金额为**字符串**存储，非 `Double`。
- SQL：`amount TEXT`（`database.ts`）；RN：`Bill.amount` 为 `string | null`（`models.ts`）。
- 算术与展示解析在业务层（计算器 / 图表聚合等）完成；存储层保持 TEXT 与原版一致。

## 日界与时区

- `queryBillsForMonth`（`billRepo.ts` L81–L84）与 `queryBillsForCalendarDay`（L87–L90）使用 `new Date(y, m, d)` 构造日起点，依赖 **JavaScript 本地时区**。
- **结论：** `billTime` 的日/月边界按**设备本地日历日**解释，不是强制 UTC 日界；与 Swift 使用 `Calendar.current`（`THomeBillModel.swift` L122、L140）的取向一致。

## Required actions

None
