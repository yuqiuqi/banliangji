# Phase 1 — Pattern Map (PATTERNS.md)

## Purpose

为审查任务提供「最接近类比」的现有代码位置，避免执行时代入错误假设。

## File → Analog → Excerpt summary

| Planned touch / review | Closest analog | Role |
|------------------------|----------------|------|
| `src/db/database.ts` | Swift `THomeBillModel.createTable()` + `TDataManager` | DDL、`main.db` 文件名 |
| `src/db/billRepo.ts` | Swift `THomeBillModel` CRUD / GRDB 查询 | 全部 SQL 与区间语义 |
| `src/types/models.ts` | Swift `THomeBillModel` 字段 | `Bill` / `BillRow` 与可空列 |

## Conventions to mirror

- `type`：持久化为 `1 | 2`，`rowToBill` 将非 2 归一为 1。
- 时间：`createTime` / `updateTime` / `billTime` 为 **Unix 秒**（`REAL` / `number`）。
- 区间：`queryBillsInRange(startSec, endSecExclusive)` 使用 `billTime >= ? AND billTime < ?`。

## PATTERN MAPPING COMPLETE
