# Phase 12: DATA-02 与 Phase 10 验证归档 — Context

**Gathered:** 2026-04-23  
**Status:** Ready for planning  
**Source:** ROADMAP § Phase 12、`v2.3-MILESTONE-AUDIT.md`

## Phase Boundary

在**不改动业务代码**的前提下，用**设备可引用证据**闭合 **DATA-02**，并补齐 **Phase 10** 与审计期望对齐的 **`10-*-VERIFICATION.md`**。成功标准见 `ROADMAP.md` Phase 12 表格。

## Implementation Decisions（锁定）

- **Kill 协议与步骤** 以现有 `DATA-02-SMOKE.md` 为唯一事实源；本阶段只更新 **Result / Environment / 证据**，不重写协议语义。
- **`Result:`（canonical）：** 全仓库以 **`DATA-02-SMOKE.md` 中唯一一行 `Result:`** 为 DATA-02 真相源；`10-VERIFICATION.md` / `REQUIREMENTS.md` / `STATE.md` **仅镜像或引用**，不得与之矛盾。
- **`Result:`** 终态须为 `PASS` 或 `FAIL`（**ROADMAP Phase 12 成功标准**）。若环境仍不可用，允许短期 `BLOCKED` **仅当** 同文件「下一步取证计划」含 **dated** 目标日与跟进行动；**不得**将长期 `BLOCKED` 当作里程碑已闭合。
- **完成语义（评审收口）：**
  - **12-01 / 12-02「计划已执行」**：指 PLAN 中任务按诚实状态落盘（含文档更新、`npm run verify` 绿）；**不等于** DATA-02 已在 REQ 意义上 **Done**。
  - **Phase 12 里程碑在 DATA-02 上「证据闭合」**：仅当 `DATA-02-SMOKE.md` 为 **`PASS` 或 `FAIL`**（非无限期 `BLOCKED`），且 `REQUIREMENTS.md` / `STATE.md` 已与该 Result 同步。
- **ROADMAP Progress 快照**：若行内写 **Executed**，**必须**同时可读地标明 DATA-02 为 **PASS/FAIL** 或 **BLOCKED + 目标日**，避免被误读为需求已勾选。
- **QA-04** 已在 Phase 10 闭合；`10-VERIFICATION.md` **引用** `10-QA-04-ALIGNMENT.md` / `08-UAT` / `09-UAT` 终态，不重复造 UAT 表。
- **`npm run verify`** 不证明 DATA-02；执行后仍需绿，但不替代杀进程手测。
- **平台范围：** `PASS` **仅**覆盖 `DATA-02-SMOKE.md` **Environment** 表所填平台（如仅 iOS Simulator）；不得默示 Android 或未测平台已验证。
- **逾期取证：** 若超过取证计划目标日仍无法设备验证，须在 `DATA-02-SMOKE.md` Investigation / 取证计划或 `STATE.md` **Deferred** 中写明 **升级路径**（责任人、下一动作、是否转 FAIL / 另开 bugfix 阶段）。

## Canonical References

- `.planning/v2.3-MILESTONE-AUDIT.md` — 缺口来源  
- `.planning/ROADMAP.md` — Phase 12 目标与成功标准  
- `.planning/REQUIREMENTS.md` — DATA-02 勾选与 Traceability  
- `.planning/phases/10-persist-uat/DATA-02-SMOKE.md` — 手测协议与 Result  
- `.planning/phases/10-persist-uat/10-QA-04-ALIGNMENT.md` — QA-04 映射  
- `.planning/PROJECT.md` — 数据驻留与冒烟语境（与 Phase 01 文档交叉）

## Deferred

- Android 专用杀进程路径：若本阶段仅测 iOS，在 `10-VERIFICATION` 或 `DATA-02-SMOKE` 的 Environment 中 **声明范围**；不强制本 Phase 双端。

---

*Phase: 12-data02-closeout*
