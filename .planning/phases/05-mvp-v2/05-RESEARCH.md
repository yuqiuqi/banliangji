# Phase 5 — Technical Research（预算 / 资产 MVP）

**Date:** 2026-04-21  
**Question:** 在 Expo + expo-sqlite 与现有 `bill_list` 不变前提下，如何落地预算 cap、资产账户与 UI Tab？

## Findings

### SQLite 与迁移

- **模式：** 延续 `src/db/database.ts` 单例 `openDatabaseSync("main.db")` + `execSync` 内 `CREATE TABLE IF NOT EXISTS`。
- **新表（建议命名）：**
  - `budget_cap`：`id`, `month_key`（`TEXT` `YYYY-MM`）, `category_id`（`INTEGER`，`-1` 表示全月总预算，避免 SQLite UNIQUE 与 NULL 歧义）, `cap_amount`（`TEXT`，与 `bill_list.amount` 一致）, `create_time`/`update_time`（`REAL` Unix 秒）。
  - `asset_account`：`id`, `name`（`TEXT`）, `balance`（`TEXT`）, `create_time`/`update_time`（`REAL`）。
- **唯一性：** `UNIQUE(month_key, category_id)`；MVP 仅使用 `category_id = -1` 行亦可。
- **兼容性：** 不 `ALTER` `bill_list`；新表失败不影响旧表读写。

### 支出合计（与图表一致）

- **口径：** `type === 1` 为支出（见 `src/chart/chartAggregate.ts` / 单测）。
- **区间：** 与 `billRepo.queryBillsForMonth` 相同：本地日历月 `[monthStart, nextMonthStart)` 半开，`billTime` 为 Unix 秒。
- **金额：** `parseAmount`（`src/utils/money.ts`）对 `amount` 求和；可抽 `sumExpenseForMonth(monthAnchor: Date): number` 于 `billRepo.ts` 或 `src/budget/monthExpense.ts` 供预算屏与测试复用。

### 导航

- `RootTabParamList` 增加 `BudgetTab`、`AssetTab`；`Tabs` 插入顺序见 `05-UI-SPEC.md`。
- 新屏顶部 **header**：可用 `Tab.Navigator` `options` 的 `headerShown: true` 仅对预算/资产 Tab，或与现 Chart 一致的全局策略；需与 `colors.main` 顶栏一致。

### 刷新

- 记一笔后回到预算 Tab：使用 `useFocusEffect` 重新读 cap + spent，或扩展 `BillsRefreshProvider`（Claude's discretion）。

### 测试

- **Vitest** 已有；为 `sumExpenseForMonth`（或等价）与 `budgetRepo` 解析写单测，避免与 `chartAggregate` 口径漂移。

---

## Validation Architecture

> Nyquist / Dimension 8：本 phase 的反馈采样与自动化锚点。

| Dimension | 本 phase 要点 |
|-----------|----------------|
| 1 正确性 | 同月同数据下，预算「已用」与 `chartAggregate` 支出合计一致（单测用固定 `Bill[]`） |
| 2 完整性 | cap 为 0 / 未设置 / 超支三种 UI 状态可到达 |
| 3 一致性 | `month_key` 与 `queryBillsForMonth` 边界同一套本地 Date 构造 |
| 4 可观测 | `npm run test` 覆盖纯函数；`npm run verify` 全绿 |
| 5 回归 | `bill_list` DDL 与现有 `billRepo` 行为不变（grep /  smoke） |
| 6 安全 | 无新网络；数据仍在应用沙箱 |
| 7 性能 | 月内账单全表扫描可接受 MVP；列表 <1000 条量级 |
| 8 文档 | `PROJECT.md` 或 ADR 一句说明新表与备份 |

---

## RESEARCH COMPLETE
