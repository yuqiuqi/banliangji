# Phase 13 — Verification（v2.4 · LG-02 Tier-2）

**Phase:** 13-chrome-uat-signoff  
**REQ:** **LG-02**；结转 **THEME-01**、**A11Y-01**、**LG-01**（与 `.planning/phases/11-chrome-depth/11-VERIFICATION.md` 交叉核对）

## LG-02 — 副路径四屏（iOS 26 Chrome）

| 屏 | 浅色 | 深色 | 降低透明度 | 备注 / deviation |
|----|------|------|------------|------------------|
| Chart | [ ] | [ ] | [ ] | Wave 1：`GroupedInset` 包裹 KPI / 趋势 / 分类列表；分段条 `tertiaryFill` + hairline；周期 chip 去 `shadows.card` |
| Budget | [ ] | [ ] | [ ] | Wave 1：`GroupedInset` 主卡片；超支条与文案 `colors.expense`；Modal `modalScrim`；顶栏 canvas + hairline |
| Asset | [ ] | [ ] | [ ] | Wave 1：顶栏无 `colors.main` 实心块；账户列表单组 `GroupedInset`；Modal `modalScrim` |
| Mine | [ ] | [ ] | [ ] | Wave 1：顶栏 canvas + hairline，标题 `colors.title`；正文仍为 `GroupedInset` |

## 工程验收（Phase 13 / Plan 01）

- `npm run verify`：在合并前须 **退出码 0**（CI 与本地一致）。
- grep（Plan 01）：`BudgetScreen` 无 `OVER_BUDGET_COLOR` / `#dc3545`；`ChartScreen` 含 `GroupedInset`；`AssetScreen` 顶栏样式块无 `backgroundColor: colors.main`。

## 结转 THEME / A11Y / LG-01

- [ ] 与 `11-VERIFICATION.md` 结论一致或本文件 **Accepted deviation** 更新

## Accepted deviation（工程相对 iOS 26）

| ID | 范围 | 原因（RN/`expo-blur`/工期） | 记录日期 |
|----|------|------------------------------|----------|
| — | — | — | — |

---

*模板由 `/gsd-discuss-phase 13 --auto` + `/gsd-plan-phase 13 --auto` 创建；手测完成后勾选。*
