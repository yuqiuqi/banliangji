# Phase 20 — Technical Research

**Status:** 回溯档（本相代码已于 2026-04-24 合入；本文为规划/验证补链）

## 执行摘要

Phase 20 在 React Native + Expo 上，用既有 Phase 17/18 资产（`SpringPressable`、`GlassEffectContainer`、`VibrantText`、`SegmentedTwo` 等）落实真机 6 条 UI 精修。无新后端；风险主要为视觉回归与可访问性，依赖 `npm run verify` + 手测表。

## 技术栈

- Expo / RN、现有主题 `useAppTheme`、`src/theme/*`
- `expo-blur`、`expo-linear-gradient`（见 Phase 18 依赖）
- 测试：Vitest + `npm run verify` 管线

## 与上级规格关系

- `.planning/IOS26-DESIGN-GUIDE.md` v1.2：§3.10/§3.8/§11 与实现对应关系见 `20-CONTEXT.md` 与 `20-UI-SPEC.md`
- 推迟项：陀螺仪/Modal materialize 等写入 `20-VERIFICATION.md` 表

## Validation Architecture

> Nyquist 维度 8：本相为 **全前端 UI 变更**，自动化以 **类型 + lint + 单测** 为连续反馈；**视觉与触感** 以 `20-VERIFICATION.md` 为人工采样清单（非自动化替代）。

- **快反馈：** 每任务/提交后 `npm run verify`（`tsc` + `eslint` + `vitest`）
- **波次前：** 全量 `npm run verify` 必绿
- **关闭相位前：** `20-VERIFICATION.md` 全勾 + 推迟项已登记
- **缺口：** 无「仅手测、无自动」之连续 3 任务不跑 verify 的路径 — 本 repo 以 verify 为统一 gate

## RESEARCH COMPLETE
