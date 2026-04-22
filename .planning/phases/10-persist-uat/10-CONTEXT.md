# Phase 10: 持久化与 UAT 闭环 — Context

**Gathered:** 2026-04-22  
**Status:** Ready for planning  
**Mode:** `/gsd-discuss-phase 10 --auto --analyze`（决策为推荐项自动选定，见 `10-DISCUSSION-LOG.md`）

<domain>

## Phase Boundary

本阶段**不实现新业务能力**：仅产出**可引用的 DATA-02 杀进程冒烟证据**，并把 **08-UAT / 09-UAT** 中仍为 `pending` 的项与 **`09-VERIFICATION.md`**（及必要时 `08-VERIFICATION.md`）**对齐**，使 `REQUIREMENTS.md` 中 **DATA-02、QA-04** 可诚实勾选或记录阻塞与跟进取证计划。全程保持 **`npm run verify` 通过**。

</domain>

<decisions>

## Implementation Decisions

### DATA-02 证据与环境（灰区 1）

- **D10-01:** 冒烟记录采用 **书面步骤 + 执行日期 + 环境标识**（设备型号或「iOS Simulator + runtime」+ 应用版本/commit 可选）；**截图或录屏为可选增强**，有则一并归档。
- **D10-02:** **iOS** 上至少完成 **一种** 目标环境（**真机或 Apple 官方模拟器**）即可关闭 DATA-02；不要求本 Phase 内必须双端都跑。
- **D10-03:** **Android** 上同场景冒烟 **不作为 Phase 10 必达**；若执行可记在同级文档「Extra」段，不阻塞 DATA-02 勾选。

### QA-04 裁决与编辑位置（灰区 2–3）

- **D10-04:** 当 UAT 表与验证矩阵冲突时，以 **`.planning/phases/09-ios26-chrome/09-VERIFICATION.md`** 为 **屏幕/项级事实源**（Phase 9 交付契约）；`08-VERIFICATION.md` 用于 Phase 8 范围项。UAT 行必须改为 **pass**、**skip（含理由）** 或 **Accepted deviation（指向 VERIFICATION 或本 Phase 备注）**。
- **D10-05:** **新建**本目录下 **`DATA-02-SMOKE.md`**（或等价命名）承载杀进程记录；**UAT/VERIFICATION 的修订**在**原文件** `.planning/phases/08-tesla-v2-1/08-UAT.md`、`.planning/phases/09-ios26-chrome/09-UAT.md` 内完成，便于历史追溯。
- **D10-06:** 不得在 Phase 10 引入「未解释的 pending」；若环境不可用，写入 **阻塞：…** 与 **下一步取证计划**（并同步 `STATE.md` 可选）。

### Claude's Discretion

- 冒烟用测试数据的**具体文案/金额**（便于检索）由执行者选定。  
- `09-UAT` 与 `09-VERIFICATION` 对齐时，**表格格式**（增列 vs 脚注）可小幅调整，只要可追溯。

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 需求与路线

- `.planning/REQUIREMENTS.md` — DATA-02、QA-04 原文  
- `.planning/ROADMAP.md` — Phase 10 成功标准  
- `.planning/PROJECT.md` — 「数据驻留、备份与手工冒烟」步骤  

### Phase 8 / 9 验收与 UAT

- `.planning/phases/08-tesla-v2-1/08-UAT.md`  
- `.planning/phases/08-tesla-v2-1/08-VERIFICATION.md`  
- `.planning/phases/09-ios26-chrome/09-UAT.md`  
- `.planning/phases/09-ios26-chrome/09-VERIFICATION.md`  

### 上一阶段上下文（避免重复问 Dark Mode）

- `.planning/phases/09-ios26-chrome/09-CONTEXT.md` — Dark Mode 为 follow-up（由 Phase 11 承接）

### 实现侧（若需确认持久化路径）

- `src/` 下 SQLite / `expo-sqlite` 使用处（Planner 按需检索 `main.db`、`openDatabase`）

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- 现有记账/列表/图表屏与 `billRepo`；本 Phase **以验证与文档为主**，代码改动仅在为满足 `verify` 或修复冒烟阻塞时最小化进行。

### Established Patterns

- 规划文档集中在 `.planning/phases/{nn-slug}/`；Phase 9 已建立 `09-VERIFICATION` / `09-UAT` 成对使用习惯。

### Integration Points

- DATA-02 验证 **端到端数据路径**（记一笔 → SQLite → 冷启动读回）；与具体 OS 任务切换/杀进程方式相关，记录在冒烟文档而非代码注释中。

</code_context>

<specifics>

## Specific Ideas

- 无额外产品创意；范围以 `REQUIREMENTS.md` v2.3 Phase 10 为准。

</specifics>

<deferred>

## Deferred Ideas

- **Android** 杀进程冒烟全量纳入 → 可作为 v2.3 补丁或后续里程碑，**不阻塞** Phase 10 关闭条件。  
- **深色模式 / 降低透明度** → **Phase 11**（THEME-01、A11Y-01）。

</deferred>

---

*Phase: 10-persist-uat*
