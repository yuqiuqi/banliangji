# Phase 12: DATA-02 与 Phase 10 验证归档 — Context

**Gathered:** 2026-04-23  
**Status:** Ready for planning（**2026-04-23 `/gsd-plan-phase 12 --reviews`**：已并入 `12-REVIEWS.md` 共识）  
**Source:** ROADMAP § Phase 12、`v2.3-MILESTONE-AUDIT.md`

## Phase Boundary

在**不改动业务代码**的前提下，用**设备可引用证据**闭合 **DATA-02**，并补齐 **Phase 10** 与审计期望对齐的 **`10-*-VERIFICATION.md`**。成功标准见 `ROADMAP.md` Phase 12 表格。

## Completion Semantics（Cross-AI review — 锁定）

审阅指出 ROADMAP「终态 PASS/FAIL」与短期 `BLOCKED`、以及「计划跑完」与「里程碑证据闭环」易被混淆。以下用语在本 Phase **固定**：

| 术语 | 含义 |
|------|------|
| **`DATA-02-SMOKE.md` 的 `Result:`** | **唯一**事实源；`10-VERIFICATION` / `REQUIREMENTS` / `STATE` 须与之**镜像**或引用，不得矛盾。 |
| **Plan 01 完成** | 已存在可检索的 `10-VERIFICATION.md`，且其中明示 **DATA-02 证据仍以待 SMOKE 终态为准**。**不**表示 DATA-02 已验收。 |
| **Plan 02 完成（执行层面）** | 维护者已按任务更新 SMOKE / 关联文档；允许 `Result:` 仍为 **BLOCKED** 且附带 **dated** 取证计划（与 ROADMAP「不得长期 BLOCKED 且无计划」一致）。 |
| **Phase 12 / DATA-02 里程碑闭合** | 当且仅当 `Result:` 为 **`PASS` 或 `FAIL`**，且 `REQUIREMENTS.md` / `STATE.md` 已按诚实规则同步。**`BLOCKED` 不是闭合态。** |
| **Investigation notes（FAIL）** | 只记录**可观察事实**（现象、步骤、对比：如划掉杀进程 vs 仅退后台）；避免长篇根因分析；是否需 **另开 bugfix** 用一句话标明即可。 |
| **平台范围** | `PASS` 仅覆盖 **Environment 表所填平台**（如仅 iOS Simulator）；不得默认「全平台已验证」。 |
| **超期未跑** | 若超过 SMOKE 内 dated 目标日仍无法取证：维护者须更新同一「下一步取证计划」（新日期或改判 **FAIL：资源/环境不可用**），**不得**静默滞留。 |

## Implementation Decisions（锁定）

- **Kill 协议与步骤** 以现有 `DATA-02-SMOKE.md` 为唯一事实源；本阶段只更新 **Result / Environment / 证据**，不重写协议语义。
- **`Result:`** 必须是 `PASS` 或 `FAIL`；若环境仍不可用，允许短期 `BLOCKED` **仅当** 同文件内「下一步取证计划」含** dated** 跟进行动与责任人占位（本阶段目标仍为尽快落到 PASS/FAIL）。
- **QA-04** 已在 Phase 10 闭合；`10-VERIFICATION.md` **引用** `10-QA-04-ALIGNMENT.md` / `08-UAT` / `09-UAT` 终态，不重复造 UAT 表。
- **`npm run verify`** 不证明 DATA-02；执行后仍需绿，但不替代杀进程手测。
- **Traceability（DATA-02 闭合后）**：`REQUIREMENTS.md` 表中 **Phase** 列统一为 **`Phase 12`**（实现若在 Phase 10 已在正文说明，不另造多标签）。

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
