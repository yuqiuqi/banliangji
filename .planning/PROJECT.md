# SwiftCostRN

## What This Is

基于 [IANIx/SwiftCost](https://github.com/IANIx/SwiftCost) 的 **React Native（Expo）复刻版**：本地 SQLite 记账、按月明细、记一笔（含计算器）、日历、图表（周/月/年支出聚合）与账单详情/编辑/删除。面向需要在 iOS/Android 上获得与原版相近体验、同时采用现代 TS 技术栈的开发者与用户。

## Core Value

**离线可用的「记一笔 → 立刻在明细/日历/图表中看到」闭环必须稳定可靠**；数据仅存本机、可预期、可维护。

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 明细首页按月聚合、展示收入/支出汇总与分日列表
- [ ] 记一笔：支出/收入切换、分类网格、计算器与账单日期
- [ ] 日历：按月浏览、按日查看账单、快捷进入记账
- [ ] 图表：周/月/年区间、支出柱状示意与分类占比
- [ ] 账单详情、编辑、删除；SQLite 与 Swift 版 `bill_list` 字段语义对齐
- [ ] TypeScript strict，禁止 `any`；`npm run typecheck` 与 `npm run lint` 作为质量基线

### Out of Scope

- **服务端同步 / 多设备云备份** — 首版专注离线单机；后续里程碑再议
- **像素级复刻 Xcode 资源图** — 使用矢量图标映射类别，非位图 1:1
- **应用商店上架物料与合规全套** — 可在发布阶段里程碑再补

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
*Last updated: 2026-04-21 after initialization*
