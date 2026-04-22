# Milestones: SwiftCostRN

## v1.0 — 离线记账 MVP

**目标：** 数据可信 → 主路径 UAT → 图表一致 → 质量门禁。

| 状态 | 说明 |
|------|------|
| Phase 1–4 | **Complete**（2026-04-21）— 数据层、主路径 UAT、图表、QA/发布门禁 |

**参考实现：** [IANIx/SwiftCost](https://github.com/IANIx/SwiftCost)（流程/信息架构）。

---

## v2.0 — SharkBook 体验融合（已封板至 Phase 7）

**启动：** 2026-04-21  
**封板：** 2026-04-22（Phases 5–7 与 REF-01~04 已收束，见 `ROADMAP` / `*SUMMARY`）

**曾达成目标：** 在 **不移植 Qt/C++** 的前提下，将 [SharkBookProject](https://github.com/MichaelFeng823/SharkBookProject) 所代表的 **预算、资产、图表精美度、全局动效/层级** 融合进 **Expo + TypeScript + SQLite**；后序视觉已迁移为 **Tesla 向**（由 v2.1 在文档与全站收束中明确）。

**原则（历史不变）：** 参考交互与信息架构；`bill_list` 为主；网络-only 功能 defer/可选。

---

## v2.1 — 账单流 · 查账 · 我的（**当前里程碑**）

**启动：** 2026-04-22（`/gsd-new-milestone v2.1`）

**目标：** 在 **单 Phase 8** 内交付 **V21-01 账单子流/导航**、**V21-02 按日/区间查账与一致**、**V21-03 本地我的/设置/关于**；**V21Q-01** 质量与 Tesla 可读性；功能面对齐 SharkBook 能力、**不**以云多用户为必达。

**下一动作：** `/gsd-plan-phase 8`

---

*Format: GSD milestone log — update on `/gsd-complete-milestone`.*
