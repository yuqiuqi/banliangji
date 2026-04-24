# Roadmap: 半两记

## Milestones

| 版本 | 名称 | 范围 | 封板日 |
|------|------|------|--------|
| v1.0 | 离线记账 MVP | Phases 1–4 | 2026-04-21 |
| v2.0 | SharkBook 体验融合 | Phases 5–7 | 2026-04-22 |
| v2.1 | 账单流 · 查账 · 我的 | Phase 8 | 2026-04-22 |
| ✅ **v2.2** | **iOS 26 全局 Chrome（Liquid Glass）** | **Phase 9** | **2026-04-22** |
| **v2.3** | 质量验证与系统外观 | Phases 10–12 + 结转 | 结转 v2.4 |
| **v2.4** | iOS 26 Chrome 副路径全量对齐 | Phase 13 | 2026-04-23 |
| **v3.0** | **iOS 26 动效·交互·组件全面质感打磨** | **Phases 14–20** | — |

- **完整路线图（v1–v2.2 全文）：** [`.planning/milestones/v2.2-ROADMAP.md`](milestones/v2.2-ROADMAP.md)  
- **v2.4 需求快照：** 已并入下方 v3.0 结转  
- **当前里程碑需求：** [`.planning/REQUIREMENTS.md`](REQUIREMENTS.md)（**v3.0** + 结转）

---

## v3.0 iOS 26 动效·交互·组件全面质感打磨（Phase 14）

**目标：** 以 iOS 26 / Liquid Glass **物理弹簧感知**为锚，对 **半两记全部屏幕与组件** 实施系统性动效与交互打磨——分段 Spring Thumb、图表 Stagger 柱生长、全站 Spring 按压、触觉反馈、Modal Spring 进出场、大标题折叠、Reduce Motion 降级。

**研究规格：** [`.planning/research/IOS26-MOTION-INTERACTION-SPEC.md`](research/IOS26-MOTION-INTERACTION-SPEC.md)

### Phase 14: iOS 26 全局动效与交互质感打磨（v3.0）

| 项 | 内容 |
|----|------|
| **Goal** | 新建 `motion.ts` 弹簧常量 + `SpringPressable`（`Pressable` 透传）+ `expo-haptics` + 图表 stagger 动效 + 分段 Spring Thumb + 列表入场 + Modal Spring + Scroll Header Collapse；全应用感知对齐 iOS 26 |
| **Requirements** | ANIM-01~06, INT-01, HAP-01, MOT-01 |
| **Canonical spec** | `.planning/research/IOS26-MOTION-INTERACTION-SPEC.md`、`UI-SPEC.md`、`11-MATERIAL-MOTION-SPEC.md` |
| **Success criteria** | 1) `motion.ts` 存在，所有 spring 参数经由此模块 2) `SegmentedTwo` / 图表分段指示器有弹簧位移 3) 图表柱切换有 stagger spring（含切换取消与 ≤12 根 stagger）4) 所有主路径可点击使用 `SpringPressable`（`PressableProps` 透传）5) `expo-haptics` 主路径（保存/删除/选择）接入且 `haptics` 封装 try/catch 6) Reduce Motion 开启时所有动效降级 7) Header collapse 与 `contentInset`/补偿联动避免列表跳变 8) `npm run verify` 通过 |

---

## v2.3–v2.4 历史（结转参考）

### Phase 10: 持久化与 UAT 闭环（Executed · DATA-02 BLOCKED）
### Phase 11: 深色 · 无障碍 · LG-01（Complete · 11-VERIFICATION 待手测签字）  
### Phase 12: DATA-02 与 Phase 10 验证归档（Executed · DATA-02 仍 BLOCKED）
### Phase 13: iOS 26 副路径 Chrome 全量对齐（Executed · LG-02 Done）

---

## Phases（摘要）

<details>
<summary>✅ 已完成 Phases 1–9（点击展开）</summary>

- [x] Phase 1 — 数据层与基线验证（2026-04-21）
- [x] Phase 2 — 核心用户流程 UAT（2026-04-21）
- [x] Phase 3 — 图表与分析一致性（2026-04-21）
- [x] Phase 4 — 质量门禁与发布准备（2026-04-21）
- [x] Phase 5 — 预算与资产 MVP v2（2026-04-21）
- [x] Phase 6 — 全局 UI 精研 v2（2026-04-22）
- [x] Phase 7 — 图表表现层 v2（2026-04-22）
- [x] Phase 8 — 账单流 / 查账 / 我的 v2.1（2026-04-22）
- [x] Phase 9 — iOS 26 全局 Chrome v2.2（2026-04-22）

细则见 **里程碑归档** `v2.2-ROADMAP.md`。

</details>

## Progress（快照）

| Phase | Plans | Status | Completed |
|-------|-------|--------|-----------|
| 1–9 | 24/24 | Complete | 2026-04-22 |
| 10 | 2/2 | Executed（DATA-02 BLOCKED） | 2026-04-22 |
| 11 | 3/3 | Complete（verify 绿；手测签字待补） | 2026-04-23 |
| 12 | 2/2 | Executed（DATA-02 仍 BLOCKED） | 2026-04-23 |
| 13 | 2/2 | Executed（LG-02 Done；v2.4 收口） | 2026-04-23 |
| **14** | **3/3** | **Executed** | 2026-04-23 |
| **15** | **3/3** | **Executed（已 revert）** | 2026-04-23 |
| **16** | **3/3** | **Executed** — v1.2 发布，20 条 REVIEW 全闭环 | 2026-04-24 |
| **17** | **1/1** | **Executed** — Wave 1 Option A 完成（5 资产 + expo-haptics），verify 绿 | 2026-04-24 |
| **18** | **2/2** | **Executed** — Tier 1 + Tier 2（7 资产 + expo-linear-gradient），verify 绿 | 2026-04-24 |
| **19** | **1/1** | **Executed** — UI 集成 9 屏 + 新建 HeaderIconButton + 3 基础组件升级 | 2026-04-24 |
| **20** | **1/1** | **Executed** — UI 精修（按压隔离/毛玻璃 Modal/inline DatePicker/SegmentedThumb/柱图立体） | 2026-04-24 |
| **21** | **1/1** | **Executed** — 见 `21-VERIFICATION.md`（UAT 手测多为 Blocked/Deferred） | 2026-04-24 |
| **22** | **1/1** | **Executed** — MaterializeModal + Budget/Asset；Fab + GlassShimmer；`22-VERIFICATION` | 2026-04-24 |

### Phase 15: ui的动画已经完美可是ui的美观度非常的差，你要以一个专业的美工角度去修正

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 14
**Plans:** 3 plans

Plans:
- [x] `15-01-PLAN.md` — 排版 / SegmentedTwo / layout 节奏 / GroupedInset
- [x] `15-02-PLAN.md` — 嵌套导航类型 + Home / Chart / BillQuery / Budget 空态与图表色
- [x] `15-03-PLAN.md` — Asset / Mine / CreateBill header + BillCalculator 文案 + Calendar + 15-VERIFICATION

### Phase 16: iOS 26 设计宪法 v1.2 修订（design-guide-v1.2）

**目录：** [`.planning/phases/16-design-guide-v1.2/`](phases/16-design-guide-v1.2/)

**输入：** [`.planning/IOS26-DESIGN-GUIDE.md`](IOS26-DESIGN-GUIDE.md) (v1.1) · [`.planning/IOS26-DESIGN-GUIDE-REVIEW.md`](IOS26-DESIGN-GUIDE-REVIEW.md)（Codex + Gemini 交叉评审）

**Goal:** 按 REVIEW §七 行动清单（**P0 5 条 + P1 9 条 + P2 6 条**）将设计指南升级至 v1.2，使其可作为 Phase 17+ 所有 UI 编码的权威「设计宪法」。

**Scope 摘要：**
1. 修正 4 处事实错误（SwiftUI 公开 API 误标为私有、17pt 默认 vs 最小、`.clear` 三条件非官方、ALL CAPS 过度泛化）
2. 补 3 项概念缺失（`glassEffectUnion` / App Icon Liquid Glass / 控件 Extra-Large + 不写死度量）
3. 解决 3 处规范冲突（§1.2 vs §9.5、§3.10 vs §21 D2、§1.3 R5 vs §14）
4. 降级 RN 不可行承诺（`react-native-shared-element` Tier 1、触点物理传染）
5. 新增 §3.15 Expo Blur 实战约束
6. 给所有规则加四栏标签（官方 / 归纳 / RN 近似 / 依赖）
7. 新增组件实施卡片 + 快速查阅索引

**Requirements**: DESIGN-SPEC-02（新建，见 REQUIREMENTS.md）

**Depends on:** `IOS26-DESIGN-GUIDE.md` v1.1（已入库）

**Plans:** 3 plans（3 Wave：P0 / P1 / P2）

Plans:
- [x] `16-01-PLAN.md` — P0 止血：事实错误与规范冲突 5 条 ✅
- [x] `16-02-PLAN.md` — P1 新增 4 章节 + RN 文案降级 8 条 ✅
- [x] `16-03-PLAN.md` — P2 工程化 + 四栏标签 + `16-VERIFICATION.md` ✅

**产物：** `IOS26-DESIGN-GUIDE.md` v1.2（1731 行，+287）· `16-VERIFICATION.md` 20 条全勾 · `npm run verify` 绿

### Phase 17: iOS 26 设计宪法落地 — 源码骨架与资产（design-ground）

**目录：** [`.planning/phases/17-design-ground/`](phases/17-design-ground/)

**输入：** [`.planning/IOS26-DESIGN-GUIDE.md`](IOS26-DESIGN-GUIDE.md) v1.2 §18.2「缺失资产」表 + §19 组件级实现规范

**Goal:** 承接 v1.2「必补资产」清单，为仓库建立 iOS 26 设计语言的基础源码骨架（motion tokens / hooks / 组件原语），让 Phase 18+ 的页面级重构有可引用的 import。

**候选范围（`/gsd-discuss-phase 17` 待定）：** A / B / C / D 四档，对应 v1.2 §18.2 的渐进/整合策略。

**Requirements**: DESIGN-GROUND-01（Phase 17 Plan 阶段补入 REQUIREMENTS.md）

**Depends on:** Phase 16（v1.2 设计宪法）

**Plans:** 0 plans — 待 `/gsd-plan-phase 17` 拆分

Plans:
- [x] `17-01-PLAN.md` — Option A：motion/haptics/SpringPressable + expo-haptics 重装（7 tasks）✅

**产物：** `src/theme/motion.ts` · `src/hooks/useReduceMotion.ts` · `src/utils/haptics.ts` (+ .test.ts) · `src/components/SpringPressable.tsx` · `expo-haptics ~15.0.8` · `17-VERIFICATION.md`
**verify：** 4 test files / 17 tests passed

### Phase 18: iOS 26 玻璃体系（glass-system）

**目录：** [`.planning/phases/18-glass-system/`](phases/18-glass-system/)

**Goal:** 承接 Phase 17 基础资产，按 v1.2 §3.10/§3.10bis/§3.8/§3.9/§3.12 建立 iOS 26 玻璃体系 RN 工程近似（Container / Union / VibrantText / Shimmer + 3 Hook），为 Phase 19+ 页面改造提供原语。

**Scope（Option B，Tier 1 + Tier 2，8 资产 + 1 依赖）：**
- Wave 1: `GlassEffectContainer` + `GlassEffectUnion` + `VibrantText` + `expo-linear-gradient`
- Wave 2: `GlassShimmer` + `useTouchRipple` + `useMaterialize` + `18-VERIFICATION.md`

**Requirements**: DESIGN-GLASS-01
**Depends on:** Phase 17
**Plans:** 2

Plans:
- [x] `18-01-PLAN.md` — Wave 1 Tier 1（4 tasks）✅
- [x] `18-02-PLAN.md` — Wave 2 Tier 2（4 tasks）✅

**产物：** `GlassEffectContainer` / `GlassEffectUnion` / `VibrantText` / `GlassShimmer` + `useTouchRipple` / `useMaterialize` + `expo-linear-gradient ~15.0.8`
**v1.2 §18.2 进度：** 12/13 资产完成（92%），仅剩陀螺仪高光 P2 可选项

### Phase 19: iOS 26 UI 集成 — Phase 17/18 资产接入各屏幕（SpringPressable/GlassEffect/haptic 全仓替换）

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 18
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 19 to break down)

### Phase 20: iOS 26 UI 精致化 — 按压联动消除/Modal毛玻璃/DatePicker inline/SegmentedTwo SpringThumb/Chart玻璃立体

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 19
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 20 to break down)

---

## Backlog

### Phase 999.1: Follow-up — Phase 15 plans without SUMMARY (BACKLOG)

**Goal:** Resolve plans that ran without producing summaries during Phase 15 execution.

**Source phase:** 15（`15-ui-ui`）

**Deferred at:** 2026-04-23 during /gsd-next（选项 C）advancement to v3.0 Phase 20 closeout

**Plans:**

- [ ] 15-01: ran, no `15-01-SUMMARY.md`
- [ ] 15-02: ran, no `15-02-SUMMARY.md`
- [ ] 15-03: ran, no `15-03-SUMMARY.md`

### Phase 999.2: Follow-up — Phase 16 plans without SUMMARY (BACKLOG)

**Goal:** Resolve plans that ran without producing summaries during Phase 16 execution.

**Source phase:** 16（`16-design-guide-v1.2`）

**Deferred at:** 2026-04-23 during /gsd-next（选项 C）advancement to v3.0 Phase 20 closeout

**Plans:**

- [ ] 16-01: ran, no `16-01-SUMMARY.md`
- [ ] 16-02: ran, no `16-02-SUMMARY.md`
- [ ] 16-03: ran, no `16-03-SUMMARY.md`

### Phase 999.3: Follow-up — Phase 17 plan without SUMMARY (BACKLOG)

**Goal:** Resolve plans that ran without producing summaries during Phase 17 execution.

**Source phase:** 17（`17-design-ground`）

**Deferred at:** 2026-04-23 during /gsd-next（选项 C）advancement to v3.0 Phase 20 closeout

**Plans:**

- [ ] 17-01: ran, no `17-01-SUMMARY.md`

### Phase 999.4: Follow-up — Phase 18 plans without SUMMARY (BACKLOG)

**Goal:** Resolve plans that ran without producing summaries during Phase 18 execution.

**Source phase:** 18（`18-glass-system`）

**Deferred at:** 2026-04-23 during /gsd-next（选项 C）advancement to v3.0 Phase 20 closeout

**Plans:**

- [ ] 18-01: ran, no `18-01-SUMMARY.md`
- [ ] 18-02: ran, no `18-02-SUMMARY.md`

### Phase 999.5: Follow-up — Phase 19 planning artifacts (BACKLOG)

**Goal:** A phase directory has `CONTEXT.md` but no `*-PLAN.md` files; record formal plans or document why verify-only is canonical.

**Source phase:** 19（`19-ui-integration`）

**Deferred at:** 2026-04-23 during /gsd-next（选项 C）advancement to v3.0 Phase 20 closeout

**Plans:**

- [ ] Phase 19: has `19-CONTEXT.md` + `19-VERIFICATION.md`, no `19-*-PLAN.md` (planning not recorded on disk)

---

*Phase 1–13 历史目录保留在 `.planning/phases/`；v3.0 从 Phase 14 起续编。*
