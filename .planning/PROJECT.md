# 半两记

## What This Is

**React Native（Expo）** 离线记账应用：本地 SQLite 记账、按月明细、记一笔（含计算器）、日历、图表（周/月/年支出聚合）与账单详情/编辑/删除。**产品体验**按 **半两记自有规格** 从头设计：主路径、信息密度与动效均以 **iOS / iPadOS 26 Chrome + Liquid Glass** 为 **唯一视觉来源**（`DESIGN.md` 首节、`src/theme/colors.ts` 的 `iosSemantic`、`src/components/ios/*`）。v2.1 的 Tesla 主题为历史存档，不再代表当前主视觉；突破性规格见 `.planning/phases/09-ios26-chrome/09-BREAKTHROUGH-SPEC.md`。

## Core Value

**离线可用的「记一笔 → 立刻在明细/日历/图表中看到」闭环必须稳定可靠**；数据仅存本机、可预期、可维护。

## Current State（shipped）

**v2.2 — iOS 26 全局 Chrome（2026-04-22）** 已封板：全站语义色与 Liquid Glass 取向、`src/components/ios/` 原语、根目录 **`UI-SPEC.md`**、宽屏居中；归档见 `.planning/milestones/v2.2-ROADMAP.md` / `v2.2-REQUIREMENTS.md`。

## Current Milestone: v3.0 — iOS 26 动效·交互·组件全面质感打磨

**Goal:** 以 **iOS 26 / Liquid Glass** 物理动效与交互范式为锚，将 **半两记所有屏幕与组件** 从「视觉对齐」升级为「感知对齐」——弹簧动效、触觉反馈、分段滑动指示器、图表 stagger 生长、列表入场、Modal Spring 进出场、大标题折叠，统一 `motion.ts` 弹簧常量，全局 Reduce Motion 降级。**一个集中阶段，所有界面，彻底贴合 Apple iOS 26 手感。**

**Target features:**

- **ANIM-01** — `motion.ts` 全局弹簧常量（`SPRING.UI / THUMB / SHEET / GESTURE`），替代散落参数；Reduce Motion 全局 hook  
- **ANIM-02** — 分段控件 **Spring Thumb**：选中指示器以弹簧滑行，适用图表周/月/年与全局 `SegmentedTwo`  
- **ANIM-03** — 图表柱图 **Staggered Spring 生长**：切换周期时各柱错时弹起；整区 Reanimated fade 替代 `Animated.timing`  
- **ANIM-04** — 列表项 **Stagger FadeIn**：分类列表、账单列表数据从无到有时错时入场  
- **ANIM-05** — Modal/Sheet **Spring 进出场**：卡片弹入 + Scrim 淡入联动；关闭弹出  
- **ANIM-06** — 副路径屏 **Scroll Header Collapse**：大标题随滚动弹性收缩，顶栏材质协同  
- **INT-01** — **useSpringPress** 全站统一：所有 `Pressable` 改 Reanimated `withSpring` scale + opacity  
- **HAP-01** — **expo-haptics 全局触觉**：分段切换 selection、保存成功 notification、删除 error、边界 light；封装 `haptics.ts`  
- **MOT-01** — **Reduce Motion 全局降级**：`useReduceMotion` hook，所有动效场景接受降级参数

**范围说明：** 不新增业务功能；不改数据库；允许全量重写各屏动效与按压代码；`src/theme/motion.ts`（新文件）为单一弹簧来源；允许 Accepted deviation（记入 `14-VERIFICATION`）。

---

## Prior milestone: v2.4 — iOS 26 Chrome 副路径全量对齐

**Goal:** 图表/预算/资产/我的四屏 Tier-2 Chrome 对齐；LG-02 已验收（`13-UAT` 6/6 pass）。DATA-02 仍 BLOCKED（设备待补证）。

**Status:** Code complete；LG-02 Done；DATA-02 / 11 结转待设备签字。

---

## Prior milestone（结转）: v2.3 — 质量验证与系统外观

**Goal:** 关闭可验证债务并推进 **Tier-1** Liquid Glass 纵深；**未完全闭合项**并入 **v2.4 / Phase 13**（见 `.planning/REQUIREMENTS.md`）。

**Target features（仍为产品承诺直至勾选）：**

- **DATA-02**、**THEME-01**、**A11Y-01**、**LG-01**（定义见 `REQUIREMENTS.md`）；**QA-04** 已完成。

---

## Requirements

### Validated

- [x] **Phase 1 — 数据层基线**：`bill_list` / `main.db` 工程契约稳定、可审计；本地驻留与冒烟步骤见「数据驻留、备份与手工冒烟」。
- [x] **Phase 2 — 核心用户流程**：明细 / 记一笔 / 详情 / 编辑 / 删除 / 日历主路径 UAT（见 `.planning/phases/02-core-user-flow-uat/`）。
- [x] **v2.0 里程碑（Phase 3–7）**：CHART/QA/REF-01~04 等已收束（见 `MILESTONES.md` / 各相 `*SUMMARY.md`）。
- [x] **v2.1（Phase 8）— 账单流 · 查账 · 我的**：V21-01～03、V21Q-01（账单子流、按日/区间查账、本地我的；当时 UI 为 Tesla，已由 v2.2 覆盖为 iOS 26 Chrome）。
- [x] **v2.2（Phase 9）— iOS 26 全局 Chrome**：IOS26-CHROME / UX / COMP / IPAD / VERIFY（工程交付见 `09-SUMMARY.md`；设备与 Figma 像素对照可为后续补丁）。

### Active（v2.4 + v2.3 结转）

- 以 `.planning/REQUIREMENTS.md` 为准：**LG-02**（副路径四屏）、**DATA-02**、**THEME-01**、**A11Y-01**、**LG-01**；**QA-04** 已完成。

### Follow-up（并入 v2.3 后，此处仅作历史提示）

- **DATA-02**、**08/09-UAT** 原列于 v2.2 封板债务，现由 v2.3 REQ 承接。

### Out of Scope

- **服务端同步 / 多设备云备份** — 本里程碑不承诺；与 Core Value 冲突的能力须单独 REQ。
- **像素级抄屏** 任意第三方 App / 私有设计稿（除非明确列为 Accepted deviation）。
- **发现页、通讯录、网络图库、万年历 API** 等（见 `REF-OPTIONAL` / backlog）。
- **云登录/注册为多用户账号体系** — v2.1 默认不做；若产品坚持，另里程碑 + 威胁模型 + 网络策略。

## Context

- 实现代码与产品契约以本仓库 `src/` 与根目录 `UI-SPEC.md` / `DESIGN.md` 为准。
- 技术栈：Expo SDK 54、React 19、React Navigation、expo-sqlite、date-fns、`@react-native-community/datetimepicker`。
- 类别数据源自种子 `data.plist` → `assets/categories.json`。

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
*Last updated: 2026-04-23 — 启动 **v2.4**（Phase 13 扩大：副路径四屏 iOS 26 Chrome 全量对齐）；官方参考见 `.planning/research/IOS26-LIQUID-GLASS-REFERENCE.md`*
