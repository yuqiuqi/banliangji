# Milestones: SwiftCostRN

## v2.3 — 质量验证与系统外观（进行中）

**Started:** 2026-04-22 · **Scope:** Phases 10–11（DATA-02、UAT 对齐、深色、降低透明度）— 见 `.planning/ROADMAP.md`、`.planning/REQUIREMENTS.md`。

---

## v2.2 — iOS 26 全局 Chrome（Liquid Glass）

**Shipped:** 2026-04-22  
**Scope:** Phase 9 only（全屏 UI/UX 收敛至 iOS / iPadOS 26 语义与 Liquid Glass 取向）

**Stats:** 9 cumulative phases, 24 plans（本里程碑交付 Phase 9 / 7 plans + 阶段总结）

**Key accomplishments:**

- `iosSemantic`、`src/components/ios/`（GroupedInset、ListRow、SegmentedTwo、Fab）与根目录 **`UI-SPEC.md`** 设计契约。
- 逐屏分组列表、导航 Tab `BlurView`、栈顶阴影、记一笔计算器毛玻璃 Dock、宽屏 `App` **maxWidth 720** 居中。
- `DESIGN.md` / `PROJECT.md` 单一视觉来源切换为 **iOS 26 Chrome**；`npm run verify` 持续绿。

**Known gaps at close:**

- **DATA-02** 设备杀进程冒烟记录仍未在需求表中勾选（见 `v2.2-REQUIREMENTS.md`）。
- **09-UAT.md / 08-UAT.md** 仍有多项人工 `pending`，与 `09-VERIFICATION.md` 部分 Pass 需后续对齐。

**Archive:** [v2.2-ROADMAP.md](milestones/v2.2-ROADMAP.md) · [v2.2-REQUIREMENTS.md](milestones/v2.2-REQUIREMENTS.md)

---

## v2.1 — 账单流 · 查账 · 我的

**Shipped:** 2026-04-22（Phase 8）  
**Goal:** V21-01～03、V21Q-01；当时主视觉为 Tesla，已由 v2.2 替代为 iOS 26 Chrome。

---

## v2.0 — SharkBook 体验融合

**封板:** 2026-04-22（Phases 5–7）  
**Goal:** 预算、资产、图表表现、全局 UI 精研（REF-01～04）。

---

## v1.0 — 离线记账 MVP

**封板:** 2026-04-21（Phases 1–4）  
**Goal:** 数据可信、主路径 UAT、图表一致、质量门禁。

---

*当前里程碑：v2.3（进行中）。*
