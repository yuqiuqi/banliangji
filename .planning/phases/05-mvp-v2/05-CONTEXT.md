# Phase 5: 预算与资产管家 MVP（v2）- Context

**Gathered:** 2026-04-21  
**Status:** Ready for planning  

<domain>
## Phase Boundary

对标 SharkBook 的 **预算** 与 **资产管家** 子模块，在本仓库内交付 **MVP 可离线验收** 能力（`REQUIREMENTS.md` **REF-01 / REF-02**）：用户能设 **至少一种** 预算周期并看到 **进度**；能维护 **至少一个** 资产账户并看到 **余额或快照**；与现有 `bill_list` **schema 不破坏兼容**，迁移策略写入 `PROJECT.md` 或极短 ADR。  

**不在本 phase：** 云同步、多用户、发现页/网络 API、自动对账式「资产↔账单」联动、Phase 6/7 级全局动效与图表表现层精研（仅要求 Clay 一致、功能可测）。

</domain>

<decisions>
## Implementation Decisions

### 预算（REF-01）
- **D-B01:** MVP 优先交付 **按自然月（calendar month）的「全月支出预算」** 一条 cap（与 ROADMAP「建议：按月」一致）。**分类级预算** 若工期允许可作为同一 phase 的增量（复用同一表、按 `categoryId` 区分）；若排期紧，**可仅全月总额** 仍满足 REF-01「至少一种周期」。
- **D-B02:** 已花费金额 **仅统计支出**：与 `src/chart/chartAggregate.ts` 一致，**`type === 1` 为支出**；按 `billTime` 落入当月 `[monthStart, monthEnd)` 的账单，`amount` 求和（与现有金额字符串语义一致，避免重复定义解析规则）。
- **D-B03:** 展示：**进度条（或条形比例）+ 已用/预算数值**；**超支**（已用 > 预算）时 **警告色 + 简短文案**（如「已超出预算」）；角标/动画属 **Claude's Discretion**。
- **D-B04:** 持久化：**新表**（例如 `budget_cap` 或等价命名），字段至少包含：月份键（建议 `YYYY-MM` 文本或 `monthStart` Unix）、`amount` cap、可选 `categoryId`（NULL = 全月总预算）。**禁止** ALTER `bill_list` 破坏现有列语义。

### 资产管家（REF-02）
- **D-A01:** **至少一个资产账户** 行：名称、**用户可编辑的余额快照**（`amount`/`balance` 存法与 `bill_list.amount` 一致：文本 + 现有金额工具），`updateTime`。**MVP 不强制** 从 `bill_list` 自动轧差（避免对账与账户模型爆炸）；与记账 **弱耦合** 在文案/PROJECT 中写明即可。
- **D-A02:** 列表 + 进入编辑/新建；空态引导创建第一个账户。**多币种** 非 MVP，默认单一本币（与现账一致）。

### 数据与迁移
- **D-S01:** 在 `src/db/database.ts` 沿用 **`CREATE TABLE IF NOT EXISTS`** 模式追加新表；若需版本化迁移，使用 **`PRAGMA user_version`** 或项目已有模式，**不得**破坏已有 `bill_list` 读写。
- **D-S02:** 在 **`PROJECT.md` Key Decisions** 或 **`.planning/` 下 1 页 ADR** 写清：新表职责、与 `bill_list` 关系、回滚/备份提示（满足 ROADMAP Success #3）。

### 导航与信息架构
- **D-N01:** **底部 Tab 增加「预算」「资产」**，与 SharkBook「子模块」心智一致；建议顺序：**明细 → 图表 → 预算 → 资产 → 我的**（实现可在 `RootNavigator` / `RootTabParamList` 扩展）。若 5 Tab 过于拥挤，**Claude's Discretion** 可改为「预算｜资产」**单 Tab 内分段控件**，但 **默认推荐双独立 Tab** 以降低 MVP 交互深度。
- **D-N02:** 新屏使用与 Phase 2 一致的 **Clay**（`DESIGN.md`、`src/theme/colors.ts`）；**不**以 Phase 6 动效标准为 blocker。

### Claude's Discretion
- 预算表精确字段名、索引、是否做「下月复制上月预算」快捷。
- 资产账户是否支持「备注」、图标。
- 分类预算是否在本 phase 一并交付（在 D-B01 允许范围内）。

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 产品 / 规划
- `.planning/PROJECT.md` — Core Value、Out of Scope、数据与备份说明
- `.planning/ROADMAP.md` — Phase 5 Goal、Success Criteria、Plans 05-01 / 05-02
- `.planning/REQUIREMENTS.md` — **REF-01**、**REF-02**
- `.planning/research/SHARKBOOK-SUMMARY.md` — 预算/资产融合方向（只读参考）

### 前序阶段（已锁定）
- `.planning/phases/01-data-layer-baseline/01-CONTEXT.md` — 数据层边界
- `.planning/phases/01-data-layer-baseline/01-01-AUDIT.md` — `bill_list` 字段与语义
- `.planning/phases/02-core-user-flow-uat/02-CONTEXT.md` — **Clay / DESIGN.md** 视觉约束
- `.planning/phases/03-chart-consistency/03-CONTEXT.md` — 图表支出口径（CHART-01/02），预算进度需与同口径 **仅支出（type 1）** 对齐

### 实现锚点
- `src/db/database.ts` — `main.db`、`bill_list` 初始化模式
- `src/db/billRepo.ts` — 查询与时间过滤惯例
- `src/chart/chartAggregate.ts` — **支出 type === 1** 口径（与预算进度一致）
- `src/navigation/RootNavigator.tsx`、`src/navigation/types.ts` — Tab 接入点
- `DESIGN.md`、`src/theme/colors.ts` — Clay 与色板

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `BillsRefreshProvider` / 账单刷新上下文 — 记一笔后刷新列表；预算屏如需「改账后进度更新」可复用或并列 `useFocusEffect` 拉取。
- `src/chart/chartAggregate.ts` — 支出过滤与区间逻辑；预算当月汇总应对齐或抽取共享纯函数（由实现定）。

### Established Patterns
- SQLite：单例 `getDatabase()` + `execSync` 建表。
- 导航：React Navigation Bottom Tabs + Home Stack modal。
- 样式：`StyleSheet` + `colors` / `radii`（图表屏已有 `radii.card` 等）。

### Integration Points
- `RootTabParamList` 与 `Tabs`：新增 `BudgetTab`、`AssetTab`（或等价命名）。
- `database.ts`：新表 DDL 与可选 `user_version` 迁移。

</code_context>

<specifics>
## Specific Ideas

- 体验参考：**SharkBook README** 中预算 / 资产为 **独立子模块**；本仓库以 **离线 SQLite** 实现，不引入 Qt。
- 超支提示需「可辨别」（REF-01）：至少 **色 + 文案**，不必上复杂动效。

</specifics>

<deferred>
## Deferred Ideas

- 资产与流水的 **自动对账**、多币种、投资组合视图 — 后续里程碑。
- 预算 **滚动结余 / 年化** — 非本 MVP。
- 登录注册与云同步 — `PROJECT.md` Out of Scope。

**None — discussion stayed within phase scope**（无跨 phase todo 折叠项）。

</deferred>

---

*Phase: 05-mvp-v2*  
*Context gathered: 2026-04-21*
