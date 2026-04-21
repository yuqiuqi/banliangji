# ADR: Phase 5 预算与资产 — SQLite 表

**Date:** 2026-04-21  
**Status:** Accepted  

## Context

在保留现有 `bill_list` 与不破坏已有列语义的前提下，为 REF-01（预算）与 REF-02（资产管家 MVP）增加持久化。

## Decision

1. **`budget_cap`**：按月存储支出上限；`month_key` 为 `YYYY-MM`；`category_id = -1` 表示**全月总预算**（非 NULL，避免 SQLite UNIQUE 与 NULL 重复行问题）；金额为 `TEXT`，与 `bill_list.amount` 一致。
2. **`asset_account`**：用户维护的账户名与**余额快照**（`TEXT`）；与 `bill_list` **不共享行**、不做自动对账。
3. **备份**：仍为设备/系统级应用数据备份；无云同步。

## Consequences

- 仅 `CREATE TABLE IF NOT EXISTS`；不 `ALTER` `bill_list`。
- 预算「已用」与图表一致：仅统计 `type === 1`、按本地日历月半开区间过滤 `billTime`。
