# Phase 22 — Technical Research

**Status:** 规划前摘要（`--skip-research` 等效；正式实现以 PLAN 与代码为准）

## 范围

- `useMaterialize` + RN `Modal` + Reanimated 三联动（见 `src/hooks/useMaterialize.ts`）。
- `expo-blur` / `GlassEffectContainer` 与 `blurIntensity` 的可绑路径（`useAnimatedProps` 或经文档化的降级近似）。
- `GlassShimmer` 与 `Fab` 的层叠与 `pressIn` 生命周期（见 `Fab.tsx` / `GlassShimmer.tsx`）。

## Validation Architecture

- **快反馈：** 每批变更后 `npm run verify`。
- **本相以 UI 与手测为主：** 无单独 E2E 设备矩阵；`22-VERIFICATION` 为人工 spot-check 清单 + 动效说明。
- **与 Nyquist 对齐：** 每个 PLAN 波次结束跑全量 verify；不引入 `watch` 长驻测试命令。

## RESEARCH COMPLETE
