---
phase: 07
slug: shark-v2
status: approved
preset: clay-rn
created: 2026-04-22
updated: 2026-04-22
---

# Phase 7 — UI Design Contract（图表 Tab 表现层 / REF-03）

> **平台：** Expo 54 / React Native。**仅** 图表 **内部** 表现层；数据层见 Phase 3；壳层见 Phase 6。  
> **目标：** 在 **CHART-01/02** 数字不变前提下，将图表 Tab 从「可读的默认样式」提升为**有分区、有节奏、有金融 App 通识**的界面：对标**市面成熟记账 / 钱夹类**产品的信息结构（**非**像素级复刻、**非**新重型图表库为默认）。

---

## 1. 设计对照（通识，非复刻源）

| 通识 | 代表方向 | 本 Tab 的提取 |
|------|-----------|---------------|
| 首屏「总览 + 时间维度」 | MoneyWiz、Wallet(BudgetBakers)、iCost、网易有钱 | **KPI 总支出**区 + 周/月/年切换；数字层级一眼可见 |
| 中屏「趋势」 | 同上加多数独立开发者「支出折线/柱」 | **主柱区** = 现有点序语义；柱顶圆、基线/留白清晰 |
| 下屏「构成」 | 随手记/鲨鱼互斥的「分类占比 + 行」 | **分类区** 独立卡片或分组、行内 图标+名+条+额 |
| 空态 | 主流「轻插画或图标+一句操作提示」 | **单图标**（`@expo/vector-icons`）+ 现有文案系，不引入插画包 |

**禁止**为默认方案新增：`react-native-reanimated`、**`expo-linear-gradient`**（与 `07-CONTEXT` D-07-M01 / D-07-V01 一致）。渐变若产品单独立项再引。

---

## 2. 页面信息架构（自上而下）

| 区段 | 内容 | 视觉 |
|------|------|------|
| A | 周/月/年 分段 | `surface` 或浅底**药丸容器**内嵌分段；**选中态** 使用 `colors.accent` 的**半透明底**+字重/色，**禁止** 硬编码 `rgba(14,165,233,…)` |
| B | 横向**周期 chips** | 可滚动；选中 = **描边 + 浅底**（accent 系）；左右与屏边有 **16px 量级** 边距 |
| C | **KPI**：本期/区间**总支出** | 独立浅卡片（`surface` + `shadows`/`hairline`）；标题字 **12–13**、金额 **24–32** 档 Display；无数据时显示 `¥0` 或「—」与空态体系一致 |
| D | 区块标题 **「趋势」/「支出分布」** | Label **13–15** semibold；与 KPI 区及柱区间距 **≥12px** |
| E | **柱图区** | 有 **底基线**（`hairline` / `body`）；柱 **仅顶圆角**；有数据/无数据明度差；`chartFadeMs` 淡入仍适用 |
| F | 区块标题 **「分类构成」** | 同 D |
| G | 分类列表 | 每行：**圆底 icon**、名称、**6–8px 高** 占比条、右对齐金额；行间距舒适；**末行** 无多余分割线 |

---

## 3. Design System（本屏）

| Property | Value |
|----------|-------|
| Tool | React Native StyleSheet / Clay 令牌 |
| Preset | clay-rn |
| Component library | 无；`CategoryIcon` + 本地布局 |
| Icon library | `@expo/vector-icons` / MaterialCommunityIcons |
| Font | 系统 UI 字体 |

---

## 4. Spacing Scale

Declared values（4 的倍数，允许 ±2 在柱宽上微调）:

| Token | 值 | 用途 |
|-------|-----|------|
| xs | 4px | 柱间微调 |
| sm | 8px | 元素内、chip 内边距 |
| md | 16px | 页水平边距、卡内主 padding |
| lg | 24px | 区块间（KPI 与趋势） |
| xl | 32px | 大空白 |

**例外：** 柱高归一化区高度可在 **120–160** 之间，与现实现可兼容。

---

## 5. Typography

| 角色 | 约 | 字重 | 色令牌 |
|------|-----|------|--------|
| KPI 金额 | 28–32 | 700 | `title` |
| 区块标题 | 15 | 600 | `title` |
| 正文字/分类名 | 15 | 500 | `title` |
| 辅助说明/区间副标题 | 11–12 | 400 | `lightTitle` |
| 柱下日期标签 | 10–11 | 400 | `lightTitle`；过长 `numberOfLines` |

---

## 6. Color

| 角色 | 来源 | 用途 |
|------|--------|------|
| 大底 60% | `colors.canvas` | Scroll/ Safe 外底 |
| 面 30% | `colors.surface` / `light` | 卡片、KPI、列表容器 |
| 强调 10% | `colors.accent` 及 **rgba 半透明** | 柱有数据、chip 选态、占比条、分段选中 |
| 线/无数据 | `colors.body` | 基线、无数据柱、分割 |

**柱 / 无数据 / 有数据** 仅使用令牌与 accent 的 alpha，不引入**第二套**主色（蓝）。

---

## 7. 柱 / 条（与旧版规则兼容并收紧）

| 项 | 规则 |
|----|------|
| 形状 | 竖条；**仅顶部** 圆角 ≥ 6px |
| 颜色 | 有数据 `colors.accent`；无/零 `colors.body` 或等效浅灰绿 |
| 高度 | 相对 `maxAmount`；**最小可视高度** ≥ 4px |
| 区高 | 含基线的绘图区约 **120–160px** 高 |

---

## 8. 动效

- 周期或粒度切换时主图区 **opacity** 或等价 **200ms±** 仍适用（`chartFadeMs`）。  
- 不默认 `PagerView`。

---

## 9. 空态与文案

| 场景 | 要求 |
|------|------|
| 主图无点额 | 保留「该时间段暂无支出记录」+ 与 Phase 3 不矛盾 |
| 分类无 | 「本区间暂无支出」+ 操作提示可验 grep |

可增 **小图标** 强化空态，无大图包。

---

## 10. 实现对照清单

| # | 项 | 验 |
|---|----|-----|
| 1 | KPI 区 + 区块标题 + 与列表分组 | 目视 |
| 2 | 分段/ chip / 柱/条 **无硬编码天蓝**；全 accent 系 | grep |
| 3 | 柱顶圆、基线、分类行圆标 | 目视 |
| 4 | 空态图标可选 | 目视 |
| 5 | `chartAggregate` 零语义 diff | 单测+verify |
| 6 | `npm run verify` 绿 | CI |

---

## 11. Checker 六维（GSD UI Phase）

- [x] **Copywriting**：空态/分区标题文案清晰 — PASS  
- [x] **Visuals**：分区、KPI、基线、圆角 — PASS  
- [x] **Color**：令牌与 accent 半透明，无离题蓝 — PASS  
- [x] **Typography**：阶梯与合同一致 — PASS  
- [x] **Spacing**：16 页边、卡内 12–16 — PASS  
- [x] **Registry / 依赖**：无新重型库 — PASS  

**Approval:** 2026-04-22 — 迭代「市面通识 + 本主题柔绿」改版后

---

*Phase: 07-shark-v2 · UI contract for REF-03 (updated for chart polish + market patterns)*
