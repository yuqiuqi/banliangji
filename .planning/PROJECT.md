# SwiftCostRN

## What This Is

基于 [IANIx/SwiftCost](https://github.com/IANIx/SwiftCost) 的 **React Native（Expo）复刻版**：本地 SQLite 记账、按月明细、记一笔（含计算器）、日历、图表（周/月/年支出聚合）与账单详情/编辑/删除。面向需要在 iOS/Android 上获得与原版相近体验、同时采用现代 TS 技术栈的开发者与用户。

**v2.0 额外对标（体验，非技术栈）：** [SharkBookProject](https://github.com/MichaelFeng823/SharkBookProject) — Qt 高仿「鲨鱼记账」中的 **预算、资产管家、图表层次与整体 UI 精美度**；融合时 **不引入 Qt**，仅吸收交互与视觉契约（见 `.planning/research/SHARKBOOK-SUMMARY.md`）。

## Core Value

**离线可用的「记一笔 → 立刻在明细/日历/图表中看到」闭环必须稳定可靠**；数据仅存本机、可预期、可维护。

## Current Milestone: v2.0 SharkBook 体验融合

**Goal:** 在 **Expo + TS + SQLite** 不变的前提下，把 SharkBook/鲨鱼记账级的 **功能细度（预算、资产）** 与 **UI/动效精美度** 分阶段融入；**不移植 Qt/C++**。

**Target features:**

- 预算模块 MVP（月度/分类预算、进度与超支提示）
- 资产管家 MVP（账户余额视图、与记账弱耦合）
- 图表与分析在 **Phase 3 数据正确** 之上，做 Shark 级 **布局、动效、空态** 迭代
- 全局 UI 体系：在现有 Clay 令牌上扩展 **层级、微交互、关键屏信息密度**（对齐参考 GIF 所表达的体验，非像素抄）

**参考只读：** `https://github.com/MichaelFeng823/SharkBookProject`（README 功能列表与界面说明）。

---

## Requirements

### Validated

- [x] **Phase 1 — 数据层基线**：`bill_list` / `main.db` 与 Swift 参考模型对齐（见 `.planning/phases/01-data-layer-baseline/01-01-AUDIT.md`）；本地驻留与冒烟步骤见「数据驻留、备份与手工冒烟」。
- [x] **Phase 2 — 核心用户流程**：明细 / 记一笔 / 详情 / 编辑 / 删除 / 日历主路径与 Clay 主路径 UI（见 `.planning/phases/02-core-user-flow-uat/`）。

### Active（v1.0 收尾 — 仍在本仓库 ROADMAP Phase 3–4）

- [ ] 图表：周/月/年区间、支出聚合与分类展示（CHART-01/02，Phase 3）
- [ ] 质量门禁与发布文档（QA-01..03，Phase 4）

### Active（v2.0 本里程碑）

- [ ] 预算与超支体验（REF-01）
- [ ] 资产管家 MVP（REF-02）
- [ ] 图表 Tab Shark 级视觉与交互（REF-03，依赖 Phase 3 逻辑验收）
- [ ] 全局 UI/动效与信息架构精研（REF-04）

### Out of Scope

- **服务端同步 / 多设备云备份** — 首版专注离线单机；后续里程碑再议
- **像素级复刻 Xcode 资源图** — 使用矢量图标映射类别，非位图 1:1
- **应用商店上架物料与合规全套** — 可在发布阶段里程碑再补
- **SharkBook 中的 Qt 技术栈、登录注册多用户云账号** — v2.0 默认不实现；若未来要做，单独里程碑 + 与 Core Value 对齐
- **发现页通讯录 / 网络图片 API / 万年历 API** — 与离线 Core Value 弱相关；默认 **v2.0 不做**，可在 `REF-OPTIONAL` 种子中保留

## Context

- 工作区上级目录含参考克隆 `SwiftCost/`（UIKit + GRDB）；RN 实现在本仓库 `src/`。
- 技术栈：Expo SDK 54、React 19、React Navigation、expo-sqlite、date-fns、`@react-native-community/datetimepicker`。
- 类别数据源自原版 `data.plist`，已导出为 `assets/categories.json`。

## Constraints

- **Tech stack**：保持 Expo 托管工作流；原生模块需与当前 SDK 兼容。
- **Type safety**：不引入 `any`；JSON 边界用显式类型与断言。
- **Data**：SQLite 文件名 `main.db`，表 `bill_list`，与参考实现对齐以便心智模型一致。

## 数据驻留、备份与手工冒烟

数据仅存本机 SQLite。库文件名为 main.db。表名为 bill_list。无云同步。

1. 在干净安装或已有数据的情况下启动应用。
2. 使用「记一笔」或等价入口，插入一条带可识别金额或备注的测试账单并保存。
3. 完全关闭应用进程（非仅退到后台）；在系统任务管理器中**强制关闭**或划掉应用。
4. 重新冷启动应用后，在明细列表或同一数据源中仍能查到该条测试账单（验证杀进程后数据仍在）。

用户级数据「备份」目前依赖设备系统备份与应用数据保留策略；v1 不提供应用内导出至文件；应用内导出见 v2 / 上文 **Out of Scope**。

### 开发者调试（沙箱内查找 main.db）

本应用通过 **Expo SQLite** 在 **应用沙箱** 内打开 **`main.db`**。调试时可在 iOS 侧使用 **Xcode** 的 Devices 窗口查看应用容器中的数据库文件；在 Android 侧使用 **Android Studio** 的 Device File Explorer 浏览应用私有存储中的同名库文件。请勿在文档或截图中粘贴真实 UDID、用户姓名或可追踪个人的完整 home 路径。

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| GSD `.planning/` 放在本 Git 仓库根（SwiftCostRN） | 与工作区上级无 `.git` 分离，便于 `gsd-tools commit` 与版本一致 | — Pending |
| 跳过初始 `/gsd-map-codebase` | 代码量可控且已有实现；若架构文档化不足可后补 | — Pending |
| 研究阶段跳过（本轮） | 栈已选定并落地；后续阶段按需补 `.planning/research/` | — Pending |
| Phase 5 预算 / 资产表 | 在 `main.db` 内新增 `budget_cap` 与 `asset_account`，不改动 `bill_list`；语义与备份见 ADR | `.planning/ADR-2026-04-21-budget-assets-sqlite.md` |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):

1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):

1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-21 — milestone v2.0 started (SharkBook 体验融合)*
