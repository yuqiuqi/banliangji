# Phase 1 — Pattern Map (PATTERNS.md)

## Purpose

为审查任务提供「最接近类比」的现有代码位置，避免执行时代入错误假设。

## File → Analog → Excerpt summary

| Planned touch / review | Closest analog | Role |
|------------------------|----------------|------|
| `src/db/database.ts` | DDL 与 `main.db` 初始化 | `CREATE TABLE bill_list` |
| `src/db/billRepo.ts` | 全部 CRUD / 区间查询 SQL | 半开区间、`rowToBill` |
| `src/types/models.ts` | `Bill` / `BillRow` 类型 | 与 DDL 列语义一致 |

## Conventions to mirror

- `type`：持久化为 `1 | 2`，`rowToBill` 将非 2 归一为 1。
- 时间：`createTime` / `updateTime` / `billTime` 为 **Unix 秒**（`REAL` / `number`）。
- 区间：`queryBillsInRange(startSec, endSecExclusive)` 使用 `billTime >= ? AND billTime < ?`。

## PATTERN MAPPING COMPLETE
