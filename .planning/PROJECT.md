# SwiftCostRN

## What This Is

基于 [IANIx/SwiftCost](https://github.com/IANIx/SwiftCost) 的 **React Native（Expo）复刻版**：本地 SQLite 记账、按月明细、记一笔（含计算器）、日历、图表（周/月/年支出聚合）与账单详情/编辑/删除。面向需要在 iOS/Android 上获得与原版相近体验、同时采用现代 TS 技术栈的开发者与用户。

**体验参考（非技术栈）：** [SharkBookProject](https://github.com/MichaelFeng823/SharkBookProject) — 功能与流程可对齐；**不引入 Qt**。**视觉与交互（当前）：** 以 **iOS / iPadOS 26 Chrome** 为 **单一来源**（`DESIGN.md` 首节、`src/theme/colors.ts` 含 `iosSemantic`、`src/components/ios/*`）。v2.1 的 Tesla 向为历史阶段；突破性规格见 `.planning/phases/09-ios26-chrome/09-BREAKTHROUGH-SPEC.md`。

## Core Value

**离线可用的「记一笔 → 立刻在明细/日历/图表中看到」闭环必须稳定可靠**；数据仅存本机、可预期、可维护。

## Current State（shipped）

**v2.2 — iOS 26 全局 Chrome（2026-04-22）** 已封板：全站语义色与 Liquid Glass 取向、`src/components/ios/` 原语、根目录 **`UI-SPEC.md`**、宽屏居中；归档见 `.planning/milestones/v2.2-ROADMAP.md` / `v2.2-REQUIREMENTS.md`。

## Next Milestone Goals

**待定。** 运行 **`/gsd-new-milestone`** 建立下一版本目标与新的 `.planning/REQUIREMENTS.md`。候选强化项（非承诺）：DATA-02 设备杀进程记录、UAT 表与 VERIFICATION 对齐、Dark Mode、无障碍（降低透明度）全链路。

---

## Requirements

### Validated

- [x] **Phase 1 — 数据层基线**：`bill_list` / `main.db` 与 Swift 参考模型对齐；本地驻留与冒烟步骤见「数据驻留、备份与手工冒烟」。
- [x] **Phase 2 — 核心用户流程**：明细 / 记一笔 / 详情 / 编辑 / 删除 / 日历主路径 UAT（见 `.planning/phases/02-core-user-flow-uat/`）。
- [x] **v2.0 里程碑（Phase 3–7）**：CHART/QA/REF-01~04 等已收束（见 `MILESTONES.md` / 各相 `*SUMMARY.md`）。
- [x] **v2.1（Phase 8）— 账单流 · 查账 · 我的**：V21-01～03、V21Q-01（账单子流、按日/区间查账、本地我的；当时 UI 为 Tesla，已由 v2.2 覆盖为 iOS 26 Chrome）。
- [x] **v2.2（Phase 9）— iOS 26 全局 Chrome**：IOS26-CHROME / UX / COMP / IPAD / VERIFY（工程交付见 `09-SUMMARY.md`；设备与 Figma 像素对照可为后续补丁）。

### Active

- （空）— 下一里程碑由 `/gsd-new-milestone` 写入新需求文件。

### Follow-up / 未在需求表关闭

- [ ] **DATA-02（执行记录）**：杀进程再启动数据仍在 — 步骤见下文「数据驻留」；**建议在下一补丁或里程碑中补一次设备记录并勾选归档需求**。

### Out of Scope

- **服务端同步 / 多设备云备份** — 本里程碑不承诺；与 Core Value 冲突的能力须单独 REQ。
- **像素级复刻** SharkBook / Qt / 资源图。
- **发现页、通讯录、网络图库、万年历 API** 等（见 `REF-OPTIONAL` / backlog）。
- **云登录/注册为多用户账号体系** — v2.1 默认不做；若产品坚持，另里程碑 + 威胁模型 + 网络策略。

## Context

- 工作区上级目录可含参考克隆 `SwiftCost/`；RN 实现在本仓库 `src/`。
- 技术栈：Expo SDK 54、React 19、React Navigation、expo-sqlite、date-fns、`@react-native-community/datetimepicker`。
- 类别数据源自原版 `data.plist` → `assets/categories.json`。

## Constraints

- **Tech stack**：Expo 托管工作流；新原生模块须与当前 SDK 兼容。
- **Type safety**：不引入 `any`；JSON 边界显式类型。
- **Data**：`main.db` / `bill_list`；已有预算/资产表以 ADR 为准，**不破坏**既有语义。

## 数据驻留、备份与手工冒烟

数据仅存本机 SQLite。库文件名为 `main.db`。表名含 `bill_list` 等。无云同步为默认产品假设。

1. 在干净安装或已有数据下启动应用。
2. 使用「记一笔」插入可识别测试账单并保存。
3. 完全关闭应用进程后冷启动，仍能查到该条（验证 `DATA-02` 类场景）。

用户级「备份」依赖系统备份；应用内导出为远期/bottom-up 能力。开发者调试见历史章节（沙箱路径勿泄露隐私）。

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| GSD `.planning/` 在仓库根 | 与代码同版本、便于 `gsd-tools commit` | 沿用 |
| v2.1 不拆多 Phase 编号 | 产品希望同一发布列车交付 V21-01~03 | 单 **Phase 8** 内以多 plan 切波 |
| 视觉 Tesla 向 | 用户选定 getdesign Tesla，替代黄/Clay 主色 | 见 `DESIGN.md`、`colors.ts`（v2.2 起由 Phase 9 过渡到 **iOS 26 Chrome**） |
| v2.2 全站 iOS 26 Chrome | 全屏 UI/UX 与 Figma / HIG 对齐，作为下一突破 | **已 ship**；`UI-SPEC.md`、`09-SUMMARY.md` |

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
*Last updated: 2026-04-22 — after v2.2 milestone complete（/gsd-complete-milestone）*
