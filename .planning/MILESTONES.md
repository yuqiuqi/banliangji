# Milestones: SwiftCostRN

## v1.0 — 离线记账 MVP（进行中）

**目标：** 数据可信 → 主路径 UAT → 图表一致 → 质量门禁。

| 状态 | 说明 |
|------|------|
| Phase 1–2 | **Complete**（2026-04-21）— 数据层基线、核心用户流程 UAT + Clay 主路径 |
| Phase 3–4 | **Planned** — 图表一致性、发布与 QA 门禁（见 `ROADMAP.md`） |

**参考实现：** [IANIx/SwiftCost](https://github.com/IANIx/SwiftCost)（流程/信息架构）。

---

## v2.0 — SharkBook 体验融合（当前里程碑）

**启动：** 2026-04-21  
**目标：** 在 **不移植 Qt/C++** 的前提下，将 [MichaelFeng823/SharkBookProject](https://github.com/MichaelFeng823/SharkBookProject)（高仿鲨鱼记账）中 **更细的功能面** 与 **更精美的 UI/动效层次** 融合进现有 **Expo + TypeScript + SQLite** 工程。

**原则：** 参考 **交互与视觉层级**，数据源仍以本机 `bill_list` 为主；网络-only 演示功能默认 **defer** 或 **可选模块**。

---

*Format: GSD milestone log — update on `/gsd-complete-milestone`.*
