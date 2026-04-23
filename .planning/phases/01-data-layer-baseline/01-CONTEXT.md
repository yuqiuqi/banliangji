# Phase 1: 数据层与基线验证 - Context

**Gathered:** 2026-04-21  
**Status:** Ready for planning  

<domain>
## Phase Boundary

确认 SQLite `bill_list` / `main.db` 的工程契约（DDL、`Bill` / `BillRow` 类型、查询与时间语义）**可复查、可冒烟验证**，并在文档中说明数据驻留位置与备份含义。本阶段**不**引入云同步、不扩展新字段、不实现自动化迁移框架。

</domain>

<decisions>
## Implementation Decisions

### 文档与沟通受众
- **D-01:** 开发者向说明以 `.planning/PROJECT.md` 的 Context / Constraints 为主；若需面向贡献者，可在仓库根 `README.md` 增加简短「数据与隐私（本地 SQLite）」小节。**Phase 1 不强制**新建独立 `docs/` 目录；若 Phase 4 发布需要再抽离正式文档。

### Schema 与演进策略
- **D-02:** v1 维持 `CREATE TABLE IF NOT EXISTS` 初始化策略，**不**引入 SQLite 版本表或迁移 runner。
- **D-03:** 任何未来列变更、重命名或迁移脚本必须在**独立 phase** 中设计、评审与交付；本 phase 仅锁定当前 schema 与仓库内实现一致。

### 时间与查询语义
- **D-04:** `createTime` / `updateTime` / `billTime` 均为 **Unix 时间戳（秒）**，与业务层日期解析约定一致。
- **D-05:** 按日/按月区间查询沿用 `billRepo` 的 **半开区间** `[startSec, endSecExclusive)`，与现有 JS `Date` 边界构造一致；审查时以审计文档与冒烟用例确认无 off-by-one。

### 验证与测试深度
- **D-06:** Phase 1 完成标准以 **静态审查 + 手工冒烟** 为主：字段对照、`insert/update/delete/query` 路径各至少一条真实数据验证；**不**在本 phase 新增 Jest/单测套件（统一纳入 Phase 4 质量门禁统筹）。

### Claude's Discretion
- 审查笔记的详细程度（是否在 `PROJECT.md` 附列级对照摘要或仅保留 checklist）。
- 手工冒烟步骤的排版（表格 vs 编号列表）。

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 规划与需求
- `.planning/PROJECT.md` — 产品边界、数据约束、Core Value  
- `.planning/REQUIREMENTS.md` — DATA-01 … DATA-03 验收条目  
- `.planning/ROADMAP.md` — Phase 1 Goal、Success Criteria、Plans 01-01 / 01-02  

### 本仓库实现（审查入口）
- `src/db/database.ts` — `openDatabaseSync("main.db")` 与 DDL  
- `src/db/billRepo.ts` — CRUD 与区间查询  
- `src/types/models.ts` — `Bill` / `BillRow` / `BillAmountKind`  

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `getDatabase()` 单例：`database.ts` 已在首访时 `execSync` 建表，与 Phase 审查直接相关。  
- `billRepo.ts` 集中所有 SQL；Phase 1 计划 01-01 应以本文件与 `01-01-AUDIT.md` 列级结论逐列对照为主。

### Established Patterns
- 同步 `runSync` / `getAllSync` / `getFirstSync`（expo-sqlite）；审查时注意主线程阻塞风险已在代码层接受，本 phase 不改为异步除非后续性能 phase 要求。  
- `type` 归一为 `1 | 2` 的 `rowToBill` 与持久化 `INTEGER` 语义一致。

### Integration Points
- 所有屏幕经 `billRepo` 访问数据；无第二数据源；审查范围可限制在 `src/db/` + `src/types/models.ts`。

</code_context>

<specifics>
## Specific Ideas

- 成功标准之一：干净安装与**已有安装**两种场景下 CRUD 行为一致（无静默丢列、无重复建表失败）。

</specifics>

<deferred>
## Deferred Ideas

- 自动化迁移、Room/Watermelon 式 schema 版本 — 非本 phase。  
- 面向终端用户的「导出备份」功能 — 属 v2 / 单独 phase（见 `PROJECT.md` Out of Scope）。  

</deferred>

---

*Phase: 01-data-layer-baseline*  
*Context gathered: 2026-04-21*
