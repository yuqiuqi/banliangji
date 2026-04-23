# Phase 13 — Verification（v2.4 · LG-02 Tier-2）

**Phase:** 13-chrome-uat-signoff  
**REQ:** **LG-02**；结转 **THEME-01**、**A11Y-01**、**LG-01**（与 `.planning/phases/11-chrome-depth/11-VERIFICATION.md` 交叉核对）

## LG-02 — 副路径四屏（iOS 26 Chrome）

> **手测占位说明：** 下列矩阵勾选须由维护者在 **真机或官方 iOS Simulator** 完成。当前编排会话 **无法** 划掉 App 或切换系统「降低透明度」，故各单元格 **备注** 统一引用 **Accepted deviation [P13-LG02-UAT]**，直至补测后改为 `[x]` 并填写设备证据。

| 屏 | 浅色 | 深色 | 降低透明度 | 备注 / deviation |
|----|------|------|------------|------------------|
| Chart | [ ] | [ ] | [ ] | Wave 1 代码已合入；手测 **P13-LG02-UAT** |
| Budget | [ ] | [ ] | [ ] | 含 Modal scrim；手测 **P13-LG02-UAT** |
| Asset | [ ] | [ ] | [ ] | 含 Modal；手测 **P13-LG02-UAT** |
| Mine | [ ] | [ ] | [ ] | 手测 **P13-LG02-UAT** |

## 工程验收（自动化）

- [x] `npm run verify` 退出码 0（最近一次于执行机跑过；合并前须再跑）
- [x] grep：`BudgetScreen` 无 `OVER_BUDGET_COLOR` / `#dc3545`；`ChartScreen` 含 `GroupedInset`；`AssetScreen` 顶栏样式块无 `backgroundColor: colors.main`

## 结转 THEME / A11Y / LG-01

- [x] 已对照 `.planning/phases/11-chrome-depth/11-VERIFICATION.md`（2026-04-23）：其中 **门禁 / THEME-01 / A11Y-01 / LG-01** 列表项 **仍为 `[ ]`**，属 Phase 11 手测签字范围；**本 Phase 未**在缺少 11 手测证据的情况下勾选 `REQUIREMENTS.md` 中 THEME-01 / A11Y-01 / LG-01。
- [x] 与 `11-VERIFICATION` **无矛盾**：13 仅交付副路径四屏实现与本文档矩阵；系统级深色/降低透明度/Tier-1 动效仍以 11 为准。

## D13-04 — Chart 动效栈

- [x] **Accepted：** `ChartScreen` 图表区过渡仍使用 RN **`Animated`**（非本会话迁移 Reanimated）；与 `13-CONTEXT` D13-04「遗留 Animated 可记 deviation」一致。见下表 **P13-D13-04**。

## Accepted deviation（工程相对 iOS 26）

| ID | 范围 | 原因（RN/`expo-blur`/工期/环境） | 记录日期 |
|----|------|----------------------------------|----------|
| **P13-LG02-UAT** | LG-02 四屏 × 浅色/深色/降低透明度矩阵 | Agent/CI 无法执行 iOS 划掉 App、系统外观切换；须维护者本地补测后勾选上表并替换本备注为设备型号+iOS 版本 | 2026-04-23 |
| **P13-D13-04** | `ChartScreen` 柱图区 `chartOpacity` | 仍为 `Animated.timing`；迁移 Reanimated 留作后续 PR 或下里程碑 | 2026-04-23 |

---

*Wave 1 模板来自 Plan 01；Wave 2（Plan 02）补齐文档诚实收口与 deviation。*
