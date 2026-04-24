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

- **v1–v2.2 全文归档：** [`.planning/milestones/v2.2-ROADMAP.md`](milestones/v2.2-ROADMAP.md)  
- **v3.0 路线图全文归档：** [`.planning/milestones/v3.0-ROADMAP.md`](milestones/v3.0-ROADMAP.md)  
- **v3.0 需求全文归档：** [`.planning/milestones/v3.0-REQUIREMENTS.md`](milestones/v3.0-REQUIREMENTS.md)  
- **下一里程碑：** 运行 `/gsd-new-milestone` 后更新本表并新建 `REQUIREMENTS.md`。

---

## 当前焦点

下一里程碑尚未在路线图立项。请先 **`/gsd-new-milestone`**，再展开阶段规划。

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

*Phase 1–20 执行目录仍位于 `.planning/phases/`；v3.0 详情见 `milestones/v3.0-ROADMAP.md`。*
