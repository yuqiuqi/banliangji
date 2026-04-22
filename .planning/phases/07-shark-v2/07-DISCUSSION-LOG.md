# Phase 7: 图表 Shark 级表现层（v2）- Discussion Log

> **Audit trail only.** Decisions live in `07-CONTEXT.md`.

**Date:** 2026-04-22  
**Phase:** 7 — shark-v2  
**Mode:** `--auto` + `--analyze`（全灰区自动选「推荐」项）

**Areas auto-selected:** 动效技术、柱条视觉、周期切换、分类列表、空态、验收对标  

---

## 1. 图表区内动效技术

**Trade-off analysis**

| Approach | Pros | Cons |
|----------|------|------|
| Reanimated | 高性能复杂手势/串联动画 | 新依赖、与 Phase 6「默认不加」冲突 |
| RN `Animated` + 少量 `LayoutAnimation` | 与 Phase 6 一致、Expo 现成 | 极复杂编排代码量略高 |
| 纯样式无动画 | 最简单 | 难达「Shark 向」切换与柱反馈 |

**Recommended:** RN `Animated` / `LayoutAnimation` only — 对齐 `06-CONTEXT` D-M01。

**[auto]** Selected: **RN Animated / LayoutAnimation，不默认加 Reanimated**  

---

## 2. 柱 / 条视觉（渐变 vs 实心）

**Trade-off analysis**

| Approach | Pros | Cons |
|----------|------|------|
| 线性渐变（expo-linear-gradient） | 视觉冲击强 | 新依赖、维护成本 |
| 主题色实心 + 圆角顶 + 轻阴影 | 无新依赖、Clay 一致 | 较「平」 |
| SVG 渐变 | 灵活 | 引入 svg 路径与性能考量 |

**Recommended:** **实心 + 圆角顶**，色自 `colors.ts`；渐变 defer 到 Deferred Ideas。

**[auto]** Selected: **实心柱 + `colors` 令牌，不默认加 gradient 依赖**  

---

## 3. 周/月/年区间切换动效

| Approach | Pros | Cons |
|----------|------|------|
| 横向 PagerView | 沉浸 | 重构大、超 scope |
| 淡入淡出 / 轻位移 | 实现快、风险低 | 较含蓄 |
| 仅数据刷新无动画 | 零风险 | 不满足 Shark 向期望 |

**Recommended:** **opacity（+ 可选轻 translateY）150–250ms**。

**[auto]** Selected: **淡入淡出为主**  

---

## 4. 分类列表与信息密度

**Recommended:** 保留列表在图下；调 **行距、字号、进度条** 提升层次，不改为全新导航结构。

**[auto]** Selected: **列表位置不变，密度与层次微调**  

---

## 5. 空态

**Recommended:** 文案 + 可选矢量图标；无插画包。

**[auto]** Selected: **Clay 文案空态**  

---

## 6. 验收与数据不变量

**Recommended:** `chartAggregate` **不改语义**；`npm run verify` + 与 Phase 3 数字一致抽样；产品认可以 `07-UI-SPEC` + UAT 为准。

**[auto]** Selected: **数据语义锁定 + verify 门禁 + UI-SPEC 驱动验收**  

---

## Deferred Ideas（来自分析）

- 柱体渐变 / expo-linear-gradient  
- 图表导出分享  

## Folded Todos

无（`todo match-phase 7` 空）

---

## Re-validation（本次 `/gsd-discuss-phase 7 --auto --analyze`）

- **[auto]** 已有 `07-CONTEXT.md` — 按工作流选 **Update**，不重问交互项。  
- **Todo：** `todo match-phase 7` → `todo_count: 0`，无折叠项。  
- **代码再验：** `src/screens/ChartScreen.tsx` 结构仍为「分段器 → 周期 chips → 主卡片柱图 → 分类列表」；`chartAggregate` 未在本会话修改。  
- **结论：** 既有 D-07-* 决策与 `07-UI-SPEC.md` 仍适用；`code_context` 已补一行**实现锚点**供执行与 PLAN 引用。
