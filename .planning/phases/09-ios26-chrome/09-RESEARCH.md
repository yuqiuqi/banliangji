# Phase 9 — RESEARCH.md

**Status:** Complete  
**Date:** 2026-04-22

## Summary

React Native + Expo 实现 iOS 26 取向 UI：使用 **`expo-blur`** 的 `BlurView` 作 Tab/可选 header 材质；**语义色**集中在 theme；**分组列表**用白卡片 + `StyleSheet.hairlineWidth` 分隔线近似 HIG；**React Navigation 7** `tabBarBackground`、`screenOptions` 统一栈顶栏。iPad 用 **`maxWidth`（如 600–700）+ `alignSelf: "center"`** 或外层 `View` 包裹限制可读宽度。

## Technical notes

- `@react-navigation/bottom-tabs`：`tabBarBackground` 返回 `BlurView`；`tabBarStyle.backgroundColor` iOS 设 `transparent`。
- 分段控件：无强制原生 `UISegmentedControl`；两 `Pressable` + `09-UI-SPEC` 样式即可。
- 性能：模糊层数控制在 **Tab + 至多 1 层 header**，避免 Android 过度模糊。

## Risks

- Android `elevation` 与 iOS 阴影不一致 → 接受平台差异并文档化。  
- 真·连续圆角分组 cell → RN 不强制，用单卡片容器替代。

## Validation Architecture

本阶段以 **视觉回归 + 静态检查** 为主：无新增业务算法 TDD。验证维度：

1. **自动化：** 每次任务后 `npm run verify`（`tsc` + `eslint` + `vitest`）。  
2. **手工：** `09-VERIFICATION.md` 逐屏勾选 + 可选 Figma 截图。  
3. **安全：** 无新网络与权限；威胁模型见各 PLAN `<threat_model>`。

---

## RESEARCH COMPLETE
