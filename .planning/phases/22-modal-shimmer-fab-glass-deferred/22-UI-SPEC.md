# Phase 22 — UI 契约（GLASS-01 / GLASS-02）

**Milestone:** v3.1  
**Authority:** `22-CONTEXT.md` · `.planning/IOS26-DESIGN-GUIDE.md` v1.2 §3.9 / §3.12

## GLASS-01 — Modal 材质化

- **目标观感：** 进出场为 **opacity + scale + 材质（blur 强度有可见变化）**，取代单独依赖 RN `Modal` 自带 `animationType` 的平铺淡入。
- **屏：** 首波 **`BudgetScreen` / `AssetScreen`** 的预算/资产编辑 `Modal`；`HomeScreen` 月份 `Modal` **不纳入首波**（可记入 `22-VERIFICATION` Deferred）。
- **无障碍：** 现有 `accessibilityLabel` / 角色 **不降级**；Reduce Motion 走 `useReduceMotion` 与 `useMaterialize` 内已有 `REDUCE_SPRING` / `withTiming` 分支。
- **实现约束：** 必须消费 `useMaterialize` 的 **`blurIntensity`**（如经 `useAnimatedProps` 绑定 `BlurView`，或经书面 Accepted deviation 的等效可见映射——见 22-VERIFICATION）。

## GLASS-02 — Fab + GlassShimmer

- **目标：** 在 **`Fab`** 的圆形主区上叠一层 **`GlassShimmer`**（`pointerEvents: none` 已由组件保证），在 **pressIn**（或等效短脉冲）触发 `active`。
- **尺寸：** `width` / `height` 与 `fabSize` 对齐或略小，**不挡** 中心图标点击。
- **对比度：** 保留现有 `colors.accent` 盘面；Shimmer 为高光扫过，**不**用浅色全盘替换主色致 WCAG 回退（若偏差须在 22-VERIFICATION 记 Accepted deviation）。

## 验收

- 关键动效与覆盖文件记入 **`22-VERIFICATION.md`**。  
- **`npm run verify` 绿。**

---

*22-UI-SPEC — plan-phase 门控补档*
