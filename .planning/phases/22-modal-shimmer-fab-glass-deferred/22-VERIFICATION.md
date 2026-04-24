# Phase 22 — Verification

**Phase:** 22-modal-shimmer-fab-glass-deferred  
**Date:** 2026-04-24

## 覆盖与实现

| 项 | 说明 |
|----|------|
| **MaterializeModal** | `src/components/ios/MaterializeModal.tsx` — `useMaterialize()`；卡片区 `opacity`/`scale`；背景 `Animated.createAnimatedComponent(BlurView)` + `useAnimatedProps` 绑定 `blurIntensity` → `intensity`；`Modal` 根为 `animationType="none"` + `transparent` |
| **BudgetScreen** | 预算编辑浮层已接入 `MaterializeModal` |
| **AssetScreen** | 资产添加/编辑浮层已接入 `MaterializeModal`；取消 `SpringPressable` 补 `accessibilityLabel="取消"` |
| **Fab** | `GlassShimmer`（`width`/`height` = `fabSize`）、`onPressIn` 触发单次扫光、约 500ms 后复位；`disc` 增加 `overflow: "hidden"`；a11y 与热区未收窄 |

## Deferred（与 22-CONTEXT 一致）

- **Home** 等屏 **月份/年份** 选择用 `Modal` 仍保留既有方案；本相未改为 `MaterializeModal`（首波外 Deferred）。

## Accepted deviation

- 无。`expo-blur` `BlurView` 经 `useAnimatedProps` 驱动 `intensity`（0–`TARGET_BLUR` 经 `round`+截断至 0–100），`blurIntensity` 在进出场中可观测变化。

## 自动化

- `npm run verify`: **exit 0**（2026-04-24，git `12dacd3`）

## Spot-check（设备侧 / 维护者补签）

| # | 检查项 | 结果 |
|---|--------|------|
| 1 | 预算：打开/关闭 Modal ×2，进出场为材质化+模糊（非仅系统 fade） | 待手测 |
| 2 | 资产：同上 | 待手测 |
| 3 | **Reduce Motion 开**：`useMaterialize` 经 `useReduceMotion` 使用 timing/reduced spring | 待手测 |
| 4 | 日历记一笔 FAB：短按有单次扫光，图标可读 | 待手测 |

---

*Phase: 22-modal-shimmer-fab-glass-deferred*
