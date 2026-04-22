---
phase: 8
reviewers: [gemini, codex]
reviewed_at: 2026-04-22T03:12:08Z
plans_reviewed: []
review_type: "pre-plan scope review (no *-PLAN.md yet)"
---

# Cross-AI Plan Review — Phase 8

> 当前阶段尚无 `08-*-PLAN.md`；本次为 **范围预评审**（基于 `PROJECT` / `ROADMAP` / V21 需求），供后续 `/gsd-plan-phase 8 --reviews` 吸收。

## Gemini Review

This review assesses the scope and pre-planning for **Phase 8 (v2.1)**, focusing on the delivery of a dedicated "Bill" sub-flow, query consistency across the app, and the completion of the "Mine" tab under the Tesla design system.

### 1. Summary

Phase 8 represents the "convergence" phase where fragmented features are unified into a professional, cohesive user experience. The primary goal is to bridge the gap between simple transaction logging and a robust "ledger" experience. The scope is ambitious but achievable given the existing data layer baseline. However, the distinction between "Detail (明细)" and "Bills (账单)" must be clearly defined in the upcoming `PLAN.md` to avoid navigational confusion.

### 2. Strengths

- **Design Readiness:** The `DESIGN.md` (Tesla system) provides a very strong visual North Star. The "radical subtraction" philosophy aligns well with a minimalist ledger app.
- **Data Layer Maturity:** The `billRepo.ts` already contains the necessary primitives (`queryBillsInRange`, `queryBillsForMonth`) to support the required query consistency.
- **Infrastructure:** The navigation stack and refresh context are already established, providing a solid foundation for the new sub-flow.

### 3. Concerns

- **Information Architecture Ambiguity (MEDIUM):** Requirement **V21-01** calls for an "independent reachable Bill sub-module." Currently, the "Home" tab acts as the primary transaction list ("明细").
  - *Risk:* If "Bills" becomes a sixth tab or a redundant list, it may clutter the UI.
  - *Gap:* The plan must specify whether "Bills" is a search-oriented view, a renamed "Home" tab, or a new section entirely.
- **Query & Display Consistency (MEDIUM):** Requirement **V21-02** emphasizes that day/range queries must match the repo and calendar views.
  - *Risk:* Floating-point errors or timezone mismatches in Date object handling could lead to "ghost" amounts where the total on the Home screen doesn't match the Bill list.
- **UI Placeholder Debt (LOW):** `MineScreen.tsx` is currently a bare-bones placeholder.
  - *Risk:* To meet the Tesla design standards, this screen needs more than just functionality — it needs the "luxury whitespace" and "geometric precision" described in `DESIGN.md`.

### 4. Suggestions for future `PLAN.md`

- **IA Definition:** Explicitly define the "Bills" sub-flow entry point. Consider transforming the current "Home" (Month view) into a "Daily Flow" and adding a "Search/Filter" icon that leads to the "Bills" sub-module.
- **Query Standardization:** Create a unified `BillFilter` type and a single `useBillQuery` hook (or similar pattern) to ensure that the Home screen, Calendar, and the new Bill sub-flow always use identical logic for filtering.
- **Tesla-fying "Mine":** The `MineScreen` should be refactored into a "Tesla Account" style view — clean, card-less or large-format cards, using the `Electric Blue` accent only for primary actions (like "Export Data" or "Contact Support").
- **Validation Steps:** The `VERIFICATION.md` should include a "Consistency Audit" where a set of test data is checked across the Home, Chart, and Bill List screens to ensure identical sums.

### 5. Risk Assessment: **MEDIUM**

The technical risk is low, as the SQLite schema and repo functions are mostly ready. The primary risk is **Product/UX inconsistency**. Without a clear definition of the boundary between the "Daily Detail" and the "Bill Sub-module," the app might feel fragmented.

**Final Verdict:** The phase is well-scoped for a v2.1 release. The upcoming `08-01-PLAN.md` MUST prioritize the Navigation/IA layout and the Query logic consolidation to ensure the "Tesla Convergence" is more than just skin-deep.

*（Gemini CLI 在审查前因配额重试了数次；未改本仓库文件。）*

---

## Codex Review

*模型：OpenAI `gpt-5.4`（Codex `exec`，`read-only` sandbox）。*

### Summary

Phase 8 is directionally well-scoped and mostly coherent with the current repo: the app already has stable local SQLite primitives, month/day query conventions in `src/db/billRepo.ts`, a tab shell in `src/navigation/RootNavigator.tsx`, and a basic `MineScreen.tsx`. The main planning risk is not feasibility but ambiguity: “账单” vs “明细” is not yet defined well enough to prevent duplicated IA, and V21-02 needs explicit timezone/range semantics or the team will ship inconsistent numbers between day, month, calendar, and future range query entry points. In one phase this is achievable, but only if the eventual PLAN files lock scope tightly around IA, shared query semantics, regression coverage, and acceptance examples.

### Strengths

- The roadmap goal matches the repo’s current architecture: local-only SQLite, existing detail/edit flow, existing tab shell, no cloud dependency.
- V21-01/V21-02/V21-03 are product-adjacent and can be staged within one phase without schema upheaval.
- Existing `billRepo` already establishes a strong base: month/day queries use a consistent half-open interval `[start, endExclusive)`.
- Existing calendar/home/chart flows already create a natural consistency target for "same condition, same number".
- V21Q-01 is practical because `npm run verify` already exists in `package.json`; it is a concrete gate, not vague QA language.
- "No cloud multi-user as must-have" is a good constraint; it prevents Phase 8 from expanding into auth/sync.

### Concerns

- **HIGH**: “账单” vs “明细” boundary is underdefined. Current `HomeTab` is already titled “明细” and has list → detail flow; without a written IA decision, Phase 8 can easily produce two near-duplicate list surfaces.
- **HIGH**: V21-02 lacks an explicit canonical definition for date-range semantics. `billRepo` currently uses local-device calendar boundaries and half-open intervals; if range UI uses inclusive end dates or UTC normalization, numbers will diverge.
- **HIGH**: Traceability requirement is stated, but no plan artifact is yet required to prove “same filter, same result” across Home, Calendar, Chart, and future Bill query UI.
- **MEDIUM**: Current chart code filters expenses only in `src/chart/chartAggregate.ts`. If the new “查账” surface mixes income/expense totals without stating the default scope, users may see valid but conflicting numbers.
- **MEDIUM**: Current navigation has five tabs already. Adding a “账单” entry as a new tab could cause tab sprawl or regress the existing Budget/Asset/Chart layout. If it is not a new tab, the entry point still needs a clear location and back behavior.
- **MEDIUM**: “我的” already exists as a basic About card. The risk is underplanning V21-03 as trivial placeholder work while missing required data-location wording, settings IA, and local-only privacy messaging.
- **MEDIUM**: SQLite range filtering is probably fine for current scale, but the plan should still call out expected sort/filter behavior and whether an index on `billTime` is needed or explicitly deferred.
- **MEDIUM**: Regression risk on existing Home/Calendar refresh behavior. Current flows rely on `BillsRefreshProvider`; new bill-query/edit entry points can easily miss refresh synchronization after save/delete.
- **LOW**: Tesla acceptance is still somewhat subjective. “可接受” readability needs a concrete checklist or screenshots/UAT notes, otherwise review will become taste-based.
- **LOW**: Security/privacy scope is acceptable for local-only, but the plan should still ensure About/数据位置 copy does not overclaim backup/export capabilities that do not yet exist.

### Suggestions

- Add a dedicated PLAN task for **IA decision and UI-SPEC text** (账单 vs 明细 vs 月视图 vs 日历；入口与回退栈).
- Add a **shared query semantics** task: local calendar boundaries + half-open `[start, end)`; inclusive end date in UI vs internal conversion; DST/timezone.
- **Cross-entry consistency validation**: matrix Home month / Calendar day / Bill daily / Bill range; fixture-based same totals.
- **Query surface contract**: income+expense default scope; which totals; sort, empty, invalid range.
- **Navigation regression protection**: 五 Tab 不劣化；各入口 list→detail→edit→返回与删后刷新.
- **Mine/About**: version、本地数据位置、未实现项明示；无云登录入口.
- **Performance**: `billTime` 索引或明确 defer 与数据量级假设.
- **Tesla QA**: 关键屏清单 + 设备上手测而不仅是 verify.
- **Documentation**: `PROJECT` / Phase 8 `UI-SPEC` 与「同条件同数」可复查样例.

### Risk Assessment

**Overall risk: MEDIUM** — 技术可行；主要风险是语义与 IA 若不在 PLAN 首波锁死，会通过功能验收取样但**仍无法满足可追溯一致**这一 Phase 8 核心承诺。

---

## Consensus Summary

### Agreed Concerns（优先吸收进 `/gsd-plan-phase 8`）

- **“账单”与「明细/首页月视图」的 IA 必须书面定案**，否则易重复列表或第六 Tab 失控（Gemini **MEDIUM**，Codex **HIGH**）。
- **日期/区间与 `billRepo` 的规范一致**（半开区间、本地日历日界、时区）必须写进 PLAN 任务，否则多入口数字漂移（两评审均强调）。
- **整阶段综合风险为 MEDIUM** — 非 SQLite 做不动，而是产品与可追溯性未锁定时失败。

### Agreed Strengths

- 数据层与 `billRepo` 已具备月/日/区间类能力；Tesla 设计文档可作为 UI 主参照；`npm run verify` 是明确工程门；本地-only 降低范围膨胀。

### Divergent Views

- **风险分级**：Codex 将「IA / 时间语义 / 追溯矩阵」标为 **HIGH**；Gemini 将 IA 与查询一致性多标为 **MEDIUM** — 建议在 PLANS 中按 **HIGH** 处理追溯与语义，与较严观点对齐。

### Suggested one-liner for planner

> Phase 8 的 PLAN 必须把 **信息架构定稿、共享查询语义、跨入口一致性验证明示化** 列为第一波 blocking 任务，再落 UI 与「我的」扩展。

---

*Temp prompts: `/tmp/gsd-review-prompt-8.md`（可删）*
