# Phase 2 — Technical Research (UAT + Clay on RN)

**Status:** Complete  
**Date:** 2026-04-21  

## Summary

Phase 2 以 **手工 UAT** 为主：在模拟器/真机上走完「记一笔 → 明细 → 日历 → 详情编辑/删除」，对照 `REQUIREMENTS.md` 的 FEAT-01…05 与 `02-CONTEXT.md` 的 Clay 决策。**不**在 Phase 2 修改图表聚合算法（属 Phase 3）。

实现侧要点：

- **样式**：集中常量（建议在 `src/theme/` 增加 `radii.ts` / `shadows.ts` 或扩展现有模块），避免魔法数散落在各 `Screen`。
- **按压反馈**：`Pressable` 的 `style` 回调中使用 `pressed` 做 `opacity` 0.92–0.96、`scale` 0.98 或 `translateY` 1px 量级；**不**追求 Web 级 hover 旋转。
- **圆角与边框**：卡片/列表行优先 **12**（允许 10–16 微调）；边框色使用 `colors.body`（`#dad4c8`）或 `StyleSheet.hairlineWidth` + 主题色。
- **验证**：每轮改 UI/交互后执行 `npm run typecheck` 与 `npm run lint`；功能路径以 `02-VALIDATION.md` 与 `02-UAT-RECORD.md` 为准。

## Risks / Defer

- Roobert 字体与 OpenType：按 CONTEXT **defer**。
- `ChartScreen` 仅 Clay 壳层；聚合语义变更 **defer** 到 Phase 3。

## RESEARCH COMPLETE

---

## Validation Architecture

本阶段 Nyquist 对齐策略：**无 Jest/Vitest**；以 **typecheck + lint** 为每波自动化采样，**FEAT 主路径**以人工步骤表驱动（见 `02-VALIDATION.md`）。

| 维度 | 手段 | 频率 |
|------|------|------|
| 构建/类型 | `npm run typecheck` | Plan 02 每次代码变更任务后；Plan 03 收尾 |
| 静态质量 | `npm run lint` | 同上 |
| 功能 FEAT-01…05 | 模拟器/真机步骤 | Plan 01 记录问题；Plan 03 复测勾选 |
| 视觉 Clay | 对照 `02-UI-SPEC.md` + `DESIGN.md` | Plan 01/03 走查 |

**Wave 0：** 不适用（无新测试框架）；在 `02-VALIDATION.md` 中显式声明「Existing infrastructure: typecheck + lint + manual UAT」。

**Dimension 8（计划—验证闭环）：** 每个 PLAN 任务的 `<acceptance_criteria>` 必须包含可 grep 或命令退出码可验证的条目；手工步骤在 `02-UAT-RECORD.md` 留痕。
