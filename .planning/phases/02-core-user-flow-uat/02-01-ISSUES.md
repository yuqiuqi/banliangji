# Phase 2 — Walkthrough Issues (02-01)

**Date:** 2026-04-21

## Environment

- **Platform:** iOS / Android（Expo）
- **Device:** Simulator / Emulator（本地开发构建）
- **Branch:** `master`

## Walkthrough matrix

| ID | FEAT | Path | Steps | Expected | Actual | Severity | Area | Notes |
|----|------|------|-------|----------|--------|----------|------|-------|
| W-01 | FEAT-01 | 明细 Home | 打开明细 → 点月份 → 选另一月 | 总收入/总支出与列表一致 | 逻辑正确 | — | Clay-UI | 列表区缺 Clay 卡片包边与轻阴影 |
| W-02 | FEAT-02 | 记一笔 | 明细 + → 选支出/类别 → 计算器确认 | 保存后回到明细且新行出现 | 流程通 | P2 | Clay-UI | 类别格与分段缺统一圆角/按压反馈 |
| W-03 | FEAT-03 | 账单详情 | 点一条 → 编辑 → 改金额保存 | 详情与列表一致 | 流程通 | P2 | Clay-UI | 详情信息区非白卡浮层，缺 shadows.card |
| W-04 | FEAT-04 | 账单详情 | 点删除 → 确认 | 列表不再出现该条 | Alert 二次确认正常 | P2 | Clay-UI | 删除按钮无 destructive 色区分（02-UI-SPEC） |
| W-05 | FEAT-05 | 日历 | 明细日历图标 → 选日 → FAB + | 可记账/看当日列表 | 流程通 | P2 | Clay-UI | 日历网格与列表区缺卡片化容器 |

## Clay / DESIGN 对照（摘要）

- `02-UI-SPEC.md`：**圆角** 列表主容器 `radii.card`（12）+ 燕麦边框 `colors.body`。
- `02-UI-SPEC.md`：**按压** Pressable `opacity` ≤0.96 或轻微 scale。
- `DESIGN.md` / `colors.ts`：暖色 canvas + 白卡层次，**Clay Shadow** 用 RN 轻量 shadow/elevation 近似。

## Deferred to Phase 3+

- 图表聚合语义与 CHART 验收深度（仅 Phase 2 壳层）。

## Plan 02 notes

No P0/P1 functional issues — UI-only scope.
