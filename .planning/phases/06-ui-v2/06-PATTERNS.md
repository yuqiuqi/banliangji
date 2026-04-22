# Phase 6 — Pattern Map（PATTERNS）

**Output for:** `gsd-planner` / 执行代理  
**Sources:** `06-CONTEXT.md`, `06-RESEARCH.md`

---

## Theme & tokens

| 目标 | 最近类比 | 摘录 / 路径 |
|------|----------|-------------|
| 圆角 / 阴影 / hairline | `src/theme/layout.ts` | `radii.card`, `shadows.card`, `hairlineBorder` |
| 调色板 | `src/theme/colors.ts` | `colors.canvas`, `colors.main`, `colors.body` |

---

## 列表行 + Pressable

| 目标 | 最近类比 | 路径 |
|------|----------|------|
| 明细列表行 | `HomeScreen` 内 `Pressable` 包裹行 | `src/screens/HomeScreen.tsx` |
| 预算 / 资产 | Phase 5 白卡行 | `src/screens/BudgetScreen.tsx`, `src/screens/AssetScreen.tsx` |

---

## 图表壳（勿动数据）

| 目标 | 最近类比 | 路径 |
|------|----------|------|
| 分段 / 卡片容器 | 现有 Chart 布局 | `src/screens/ChartScreen.tsx` |
| **禁止修改** | 聚合语义 | `src/chart/chartAggregate.ts`, `src/chart/chartAggregate.test.ts` |

---

## 导航

| 目标 | 最近类比 | 路径 |
|------|----------|------|
| Tab / Stack | 五 Tab 结构 | `src/navigation/RootNavigator.tsx` |

---

## PATTERN MAPPING COMPLETE
