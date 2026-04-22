---
phase: 07
slug: shark-v2
status: approved
preset: clay-rn
created: 2026-04-22
---

# Phase 7 — UI Design Contract（图表 Tab 表现层 / REF-03）

> **平台：** Expo 54 / React Native。**仅** 图表 **内部** 表现层；数据层见 Phase 3；壳层分段见 Phase 6。  
> **目标：** 在 **CHART-01/02** 数字不变前提下，提升 **柱条、周期切换、分类列表、空态** 的层次感与 SharkBook README 方向的 **信息密度**（非像素级复刻）。

---

## 非目标

- 修改 `chartAggregate.ts` 导出函数的过滤、区间或返回形状  
- 默认新增 `react-native-reanimated` 或 `expo-linear-gradient`  
- 替换周/月/年 **数据语义**（仍仅支出）

---

## 柱 / 条（主图区）

| 项 | 规则 |
|----|------|
| 形状 | 竖条；**顶部圆角** ≥ 4px（可在现 `borderRadius: 4` 上微调） |
| 颜色 | 仅 `colors.title` / `colors.main` / `colors.body` 等 **已有令牌**；有数据 vs 无数据（`barOn`）对比清晰 |
| 高度 | 仍相对 `maxAmount` 归一化；**最小可视高度** ≥ 4px（与现一致可保留） |
| 柱宽 / 间距 | 允许收窄柱宽、略增 `marginHorizontal` 以提高 **可读性**（具体数值由实现定，须全区间一致） |

---

## 周期切换（横向 chips，图表区内）

| 项 | 规则 |
|----|------|
| 动效 | 切换选中周期时，**主图区**（柱行容器）**opacity** 动画约 **150–250ms**，或等价轻量 `Animated.timing`；**不** 要求 PagerView |
| 与壳层 | Phase 6 已处理顶部分段器；本契约针对 **ScrollView 内周期 chips + 下方柱区** 的连贯感 |

---

## 分类列表（图下）

| 项 | 规则 |
|----|------|
| 布局 | 保持 **列表在卡片外或卡片内** 与当前 `ChartScreen` 结构一致方向；以 **类别名 + 金额 + 细进度条** 为层次 |
| 字号 | 与 `02-UI-SPEC` Body 16 / 标签 12–13 档位兼容；**金额** 可略加重 |
| 进度条 | 高度 6–8px、圆角与 `colors.main` / `body` 对比足够 |

---

## 空态

| 场景 | 文案方向（可微调，须 grep 可验） |
|------|----------------------------------|
| 区间无支出 | 保留「该时间段暂无支出记录」类说明 + 提示切换区间 |
| 全局无数据 | 与现有「本区间暂无支出」体系一致，避免矛盾 |

可选 **单图标**（`@expo/vector-icons`），**无** 大图插画包。

---

## 动效实现约束

- 使用 RN **`Animated`** 或 **`LayoutAnimation`**；动画常量可复用 `layout.ts` 中 `pressDurationMs` 作数量级参考或新增 `chartFadeMs`（若新增须集中导出）。  
- **`npm run verify`** 必须全绿。

---

## 实现对照清单（执行 Phase 7 时勾选）

| # | 项 | 07-01 / 07-02 |
|---|----|----------------|
| 1 | 柱顶圆角 + 令牌色 + 柱间距可感知提升 | |
| 2 | 周期切换时主图区 fade（或等价 Animated） | |
| 3 | 分类列表层次（字重/行距/进度条） | |
| 4 | 空态文案与 Phase 3 一致化检查 | |
| 5 | `chartAggregate` 零语义 diff | |
| 6 | `npm run verify` 绿 | |

---

*Phase: 07-shark-v2 · UI contract for REF-03*
