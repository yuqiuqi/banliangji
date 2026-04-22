# Phase 6 — Verification

**Date:** 2026-04-22

## Automated

- [x] `npm run verify`（typecheck + lint + test）— 退出码 0

## Manual（建议设备上抽样）

- [ ] 明细 / 记一笔 / 预算 / 资产 / 图表壳：点按可见 opacity 变化
- [ ] Tab 栏：点按有轻微 opacity 动画（iOS；Android 为 ripple + 动画目标 opacity）

## Data integrity

- [x] `git diff src/chart/chartAggregate.ts` 为空（执行后无改动）

## Phase goal（ROADMAP）

- [x] 关键屏统一使用主题 `pressedOpacity` / 层次令牌
- [x] 工程门禁仍通过

**Status:** PASS（自动化）；手工 UAT 待用户在设备上勾选
