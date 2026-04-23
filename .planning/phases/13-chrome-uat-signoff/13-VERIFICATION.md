# Phase 13 — Verification（v2.4 · LG-02 Tier-2）

**Phase:** 13-chrome-uat-signoff  
**REQ:** **LG-02**；结转 **THEME-01**、**A11Y-01**、**LG-01**（与 `.planning/phases/11-chrome-depth/11-VERIFICATION.md` 交叉核对）

## LG-02 — 副路径四屏（iOS 26 Chrome）

**手测证据：** `.planning/phases/13-chrome-uat-signoff/13-UAT.md` — **6/6 pass**（`status: complete`，2026-04-23）。维护者可补记 **设备型号 / iOS 版本** 于 UAT frontmatter 或本表备注。

| 屏 | 浅色 | 深色 | 降低透明度 | 备注 / deviation |
|----|------|------|------------|------------------|
| Chart | [x] | [x] | [x] | UAT Test 1 / 5 / 6（Tab 与四屏路径；降低透明度与全局 Tab/Modal 行为一并确认） |
| Budget | [x] | [x] | [x] | UAT Test 2 / 5 / 6（含 Modal scrim） |
| Asset | [x] | [x] | [x] | UAT Test 3 / 5 / 6（含 Modal） |
| Mine | [x] | [x] | [x] | UAT Test 4 / 5 / 6 |

## 工程验收（自动化）

- [x] `npm run verify` 退出码 0（合并前须再跑）
- [x] grep：`BudgetScreen` 无 `OVER_BUDGET_COLOR` / `#dc3545`；`ChartScreen` 含 `GroupedInset`；`AssetScreen` 顶栏样式块无 `backgroundColor: colors.main`

## 结转 THEME / A11Y / LG-01

- [x] 已对照 `.planning/phases/11-chrome-depth/11-VERIFICATION.md`（2026-04-23）：其中 **门禁 / THEME-01 / A11Y-01 / LG-01** 列表项 **仍为 `[ ]`**，属 Phase 11 **Tier-1** 手测签字范围。
- [x] **Phase 13 UAT** 已覆盖 **副路径四屏** 的深色与降低透明度（见上表）；**不**等同于勾选 `REQUIREMENTS.md` 全文 **THEME-01 / A11Y-01 / LG-01**（后者仍含 Tab/记一笔/主列表等 Tier-1 项，见 11-VERIFICATION）。

## D13-04 — Chart 动效栈

- [x] **Accepted：** `ChartScreen` 图表区过渡仍使用 RN **`Animated`**。见下表 **P13-D13-04**。

## Accepted deviation（工程相对 iOS 26）

| ID | 范围 | 原因（RN/`expo-blur`/工期/环境） | 记录日期 |
|----|------|----------------------------------|----------|
| **P13-D13-04** | `ChartScreen` 柱图区 `chartOpacity` | 仍为 `Animated.timing`；迁移 Reanimated 留作后续 PR 或下里程碑 | 2026-04-23 |

---

*LG-02 矩阵已由 `13-UAT.md` 关闭（2026-04-23）。*
