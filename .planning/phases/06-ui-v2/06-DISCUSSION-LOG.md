# Phase 6: 全局 UI 与动效精研（v2）- Discussion Log

> **Audit trail only.** Decisions: `06-CONTEXT.md`.

**Date:** 2026-04-21  
**Phase:** 6  
**Mode:** `discuss`；无交互式问答 API 时采用 **ROADMAP / REF-04 / Phase 7 分工** 的默认结论。

**Areas discussed:** Phase 6/7 界面边界、动效技术选型、设计令牌、UI-SPEC 增量、我的 Tab 范围  

---

## Phase 6 vs Phase 7（图表）

| Option | Description | Selected |
|--------|-------------|----------|
| A | Phase 6：图表 **壳层/分段/卡片**；Phase 7：图表 **内部** Shark 向 | ✓ |
| B | Phase 6 一次做完图表内外全部 Shark 向 |  |

---

## 动效依赖

| Option | Description | Selected |
|--------|-------------|----------|
| A | 不新增 Reanimated；Pressable + RN Animated / LayoutAnimation | ✓ |
| B | 引入 Reanimated 做全局动效 |  |

---

## 「我的」Tab

| Option | Description | Selected |
|--------|-------------|----------|
| A | 仅令牌对齐，不做 REF-04 级专项改版 | ✓ |
| B | 纳入与五关键屏同等 Shark 向改版 |  |

---

## UI-SPEC

| Option | Description | Selected |
|--------|-------------|----------|
| A | 新建 `06-UI-SPEC.md` 作为 02/05 的增量 + 实现对照清单 | ✓ |
| B | 仅口头约定，不写 SPEC |  |

---

*End of log.*
