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
| ✅ **v3.0** | **iOS 26 动效·交互·组件全面质感打磨** | **Phases 14–20** | **2026-04-24** |
| **v3.1** | **验证闭合与 Liquid Glass 纵深收尾** | **Phases 21–22** | — |

- **v1–v2.2 全文归档：** [`.planning/milestones/v2.2-ROADMAP.md`](milestones/v2.2-ROADMAP.md)  
- **v3.0 路线图全文归档：** [`.planning/milestones/v3.0-ROADMAP.md`](milestones/v3.0-ROADMAP.md)  
- **v3.0 需求全文归档：** [`.planning/milestones/v3.0-REQUIREMENTS.md`](milestones/v3.0-REQUIREMENTS.md)  
- **当前里程碑需求：** [`.planning/REQUIREMENTS.md`](REQUIREMENTS.md)（**v3.1**）

---

## 当前焦点（v3.1）

**Phase 21** — 设备与文档化验证（**UAT-01～04**）：DATA-02 冒烟；THEME / A11Y / LG-01 与 `11-VERIFICATION` 对齐的签字或等效记录。  
**Phase 22** — **GLASS-01 / GLASS-02**：`useMaterialize` 接入 Modal 进出场；`GlassShimmer` 接入 FAB/主 CTA。

### Phase 21: 验证闭合（smoke-uat-close）

| 项 | 内容 |
|----|------|
| **Goal** | 关闭 v2.3/v2.4 结转：**DATA-02**、**THEME-01**、**A11Y-01**、**LG-01**；更新对应 `*-VERIFICATION.md` / `DATA-02-SMOKE.md`。 |
| **Requirements** | UAT-01, UAT-02, UAT-03, UAT-04 |
| **Success criteria** | 1) `DATA-02-SMOKE.md` 的 `Result:` 为 **PASS** 或 **BLOCKED** 且含日期与说明 2) `11-VERIFICATION`（或指定替代清单）对 THEME/A11Y/LG-01 有 **Signed / 等效记录** 或明确延期条目 3) `REQUIREMENTS.md` 追溯表中 Phase 21 行可标 Done 或 Blocked+理由 4) 不引入 `npm run verify` 回归 |

### Phase 22: Modal 材质化与 Shimmer/FAB（glass-deferred）

| 项 | 内容 |
|----|------|
| **Goal** | 落实 `20-VERIFICATION` 推迟项：**useMaterialize → Modal**；**GlassShimmer → Fab**（及必要时一处 CTA）。 |
| **Requirements** | GLASS-01, GLASS-02 |
| **Success criteria** | 1) 至少 **BudgetScreen / AssetScreen**（及清单中其他 RN `Modal`）进出场使用 `useMaterialize` 协调动画，Reduce Motion 降级可用 2) `Fab`（或约定 CTA）集成 `GlassShimmer`，主路径可点、无障碍标签保留 3) `npm run verify` 绿 4) 关键行为记入 `22-VERIFICATION.md`（或本相验证文档） |

**Depends on:** Phase 21（验证可与开发并行时，以 PROJECT 决策为准；默认顺序先 21 再 22 以降低回归风险）。

<details>
<summary>✅ v3.0（Phases 14–20）— 已于 2026-04-24 封板</summary>

| Phase | 摘要 |
|-------|------|
| 14 | 全局动效：`motion.ts`、`SpringPressable`、`expo-haptics`、图表 stagger、Modal Spring、Header collapse 等 |
| 15 | Executed（后整段 revert，历史见归档） |
| 16 | `IOS26-DESIGN-GUIDE.md` v1.2 |
| 17 | 设计宪法落地骨架（motion / haptics / SpringPressable） |
| 18 | 玻璃体系（Container / Union / VibrantText / Shimmer + hooks） |
| 19 | UI 集成（多屏接入 + `HeaderIconButton` 等） |
| 20 | UI 精修（按压隔离、毛玻璃 Modal、日期选择、分段拇指、图表质感等） |

**完整段落与计划清单：** 见 [`v3.0-ROADMAP.md`](milestones/v3.0-ROADMAP.md)。

</details>

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
| 13 | 2/2 | Executed（LG-02 Done） | 2026-04-23 |
| 14–20 | 见归档 | **Complete（v3.0 封板）** | 2026-04-24 |
| **21** | **TBD** | **Not started** | — |
| **22** | **TBD** | **Not started** | — |

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

*Phase 1–20 执行目录仍位于 `.planning/phases/`；v3.0 详情见 `milestones/v3.0-ROADMAP.md`。v3.1 自 Phase 21 起新增目录（待 `/gsd-plan-phase`）。*
