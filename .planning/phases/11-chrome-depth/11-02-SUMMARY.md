---
phase: 11-chrome-depth
plan: 02
subsystem: ui
tags: [a11y, reduce-transparency, expo-blur, material]

requires:
  - phase: 11-chrome-depth
    provides: ThemeContext、Tier-1 配色入口
provides:
  - useReduceTransparency 钩子
  - IOSChromeGlassBackground 材质栈（Blur / 不透明降级 / hairline）
  - Tab 与记一笔 Dock 接入降级路径
affects: [11-chrome-depth]

tech-stack:
  added: []
  patterns:
    - "降低透明度时 BlurView 让位于不透明 tint + 分隔，避免空白 Tab"

key-files:
  created: [src/hooks/useReduceTransparency.ts, src/components/ios/IOSChromeGlassBackground.tsx]
  modified:
    - src/navigation/RootNavigator.tsx
    - src/screens/CreateBillScreen.tsx

key-decisions:
  - "Android 维持不透明近似栈，不假装系统 Blur"

patterns-established:
  - "IOSChromeGlassBackground 统一 TabBar / 记一笔条带的玻璃与降级"

requirements-completed: [A11Y-01, LG-01]

duration: 0min
completed: 2026-04-23
---

# Phase 11 Plan 02 — SUMMARY

**集中「降低透明度」降级：Tab 与记一笔 Tier-1 使用材质栈（Blur + tint + hairline + shadow），开启系统降低透明度时走不透明近似，避免空白与对比不足。**

## Performance

- **Completed:** 2026-04-23（补档）
- **Tasks:** 3/3

## Accomplishments

- `useReduceTransparency` 读取无障碍设置。
- `IOSChromeGlassBackground` 实现 Blur / solid 分支。
- `RootNavigator` TabBar、`CreateBillScreen` Dock 接入。

## Self-Check

- `npm run verify`：**PASSED**（2026-04-23）

## Deviations

- 无代码级偏差；真机 spot-check 仍以 `11-VERIFICATION.md` 为准。
