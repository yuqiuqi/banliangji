# Phase 20 — UI 设计契约（iOS 26 UI 精致化）

**Phase:** 20-ui-polish  
**Status:** As-built（与 2026-04-24 合入与 `20-VERIFICATION.md` 对齐）  
**Supersedes:** 无；与 `.planning/IOS26-DESIGN-GUIDE.md` v1.2 一致

## 1. 范围

- 顶栏 `HeaderIconButton`：固定尺寸外层隔离 + 内层 `SpringPressable`（本实现为 `scaleTo={1}` + 透明度压感，非几何缩放外溢）
- 日期/月份选择：`GlassEffectContainer` + `VibrantText`「完成」+ `modalScrim` + inline `DateTimePicker`（Bill/Create 屏）；首页月份用 `MonthYearPickerSheet`（内含玻璃化）
- `SegmentedTwo`：Spring Thumb 滑动层 + 立体阴影/高光
- 图表：柱体与分类进度条 — 阴影 + `LinearGradient` + 顶侧 hairline 高光
- 明确 **不在** 本相：`useGyroHighlight`、Skia 3D 柱图（见 `20-VERIFICATION` 推迟表）

## 2. 组件与屏

| 区域 | 关键文件 / 行为 |
|------|------------------|
| 顶栏图标 | `src/components/ios/HeaderIconButton.tsx` — `headerFabSize` 外框固定 |
| 分段 | `src/components/ios/SegmentedTwo.tsx` — `SPRING.THUMB` |
| 玻璃容器/文字 | `GlassEffectContainer.tsx` / `VibrantText.tsx` |
| 屏 | `BillQueryScreen` / `CreateBillScreen` / `HomeScreen`（经 `MonthYearPickerSheet`）/ `ChartScreen` |

## 3. 视觉令牌（本相使用）

- `intensity`：约 70（Bill/Create picker），`MonthYearPickerSheet` 约 72（以代码为准）
- 圆角：与 `radii.card` / sheet 卡一致
- 品牌色：`colors.accent` / `colors.modalScrim` / `colors.expense`（图表白皮书）

## 4. 动效与无障碍

- Reduce Motion：分段 thumb 用 timing 降级（见 `SegmentedTwo` 实现）
- Haptics：分段 `select` 等按既有封装

## 5. 验收锚点

与 `20-VERIFICATION.md` 逐条 PASS 及 `20-01-PLAN.md` 中 `<acceptance_criteria>` 可 grep 一致。

---

*UI-SPEC 为 `/gsd-plan-phase 20` 门控补档；设计决策权威仍以 `20-CONTEXT.md` 为准。*
