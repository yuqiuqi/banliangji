# Phase 7: chart-polish-v2 - Research

**Researched:** 2026-04-22  
**Domain:** React Native (Expo 54) chart presentation — `Animated`, StyleSheet, Clay tokens  
**Confidence:** HIGH (codebase + CONTEXT 锁定；RN API 为 [CITED: React Native docs 概念])

## Summary

Phase 7 在 **Phase 3 聚合逻辑不变** 的前提下，专注 `ChartScreen` 内柱条、周期 chips、分类列表与空态的 **表现层**。LOCKED：`chartAggregate.ts` 导出语义不改、默认不引入 `react-native-reanimated` / `expo-linear-gradient`、动效以 `Animated` / `LayoutAnimation` 为主。

**Primary recommendation:** 在 `layout.ts` 集中新增 **chart 动效时长常量**（如 `chartFadeMs`），主图区用 `Animated.Value` 驱动 **opacity** 响应 `periodIndex` / `granularity` 变化；柱条仅使用 `colors.ts` 令牌并微调 `barCol` 间距与 `borderRadius`。

## User Constraints

（自 `07-CONTEXT.md` — 规划与实现须一致）

- 禁止修改 `src/chart/chartAggregate.ts` 导出函数语义。  
- 默认不新增 `react-native-reanimated`；动效主路径：`Animated` 或 `LayoutAnimation`。  
- 周期切换：**opacity 淡入淡出**（约 150–250ms）或轻 `translateY`，**不**默认上 `PagerView`。  
- 柱色仅 `src/theme/colors.ts`；柱顶圆角、柱间距可读性优化；不默认加渐变依赖。  
- 分类列表仍在主卡片下方；金额右对齐、类别名为主眼。  
- 空态：Clay 文案 + 可选 `MaterialCommunityIcons`，无重型插画包。  
- 验收：`npm run verify` + 与 Phase 3 数字一致；产品对 `07-UI-SPEC.md` + UAT。

## Standard Stack

| Concern | Choice | Notes |
|---------|--------|--------|
| 动效 | `react-native` **`Animated`** (`timing`, `Value`) | [CITED: RN core] 与 Phase 6 一致；满足 150–250ms 区间 |
| 布局 | 现有 `ScrollView` + `View` 柱行 | 无新导航结构 |
| 主题 | `colors.ts` + `layout.ts` | 单一来源；可增 `chartFadeMs` |
| 数据 | `chartAggregate` + `billRepo` | 只读调用方 |

## Architecture Patterns

- **柱高归一化** 保持 `maxAmount` 与 **min 4px** 与现 `ChartScreen` 一致 [VERIFIED: `src/screens/ChartScreen.tsx`]。  
- **双空态**：`chartEmpty`（区间内无柱）vs `categories.length === 0`（下方列表空）— 规划任务须分别覆盖文案与动效不破坏两者。  
- **memo 边界**：动画 state 应 **不** 扩大 `useMemo([generation])` 的不稳定依赖 [VERIFIED: 现有 `queryAllBills` 模式]。

## Don't Hand-Roll

- 勿复制第二套聚合逻辑 — 一切汇总仍经 `chartPointsWeekOrMonth` / `chartPointsYear` / `aggregateExpenseByCategory`。  
- 勿为「渐变」自写 Canvas — 已 defer 至 `07-CONTEXT` Deferred Ideas。

## Common Pitfalls

- **`Animated` 与 `ScrollView` 子树**：主图区 fade 应绑在 **柱行容器**上，避免整页 `ScrollView` 重挂载。  
- **周/月/年切换**：`setGranularity` 已 `setPeriodIndex(0)` — 动效应同时覆盖 **granularity 与 periodIndex** 变化。  
- **TypeScript**：禁止 `any`（项目 lint 规则）。

## Code Examples

- 伪代码：`<Animated.View style={{ opacity: chartOpacity }}>{chartRow}</Animated.View>`，`useEffect` 在 `safeIndex`/`granularity` 变化时 `Animated.timing(chartOpacity, { toValue: 0, duration: chartFadeMs/2, useNativeDriver: true })` 然后切数据再 `toValue: 1`。实现细节以 PLAN 为准。

## Validation Architecture

> Nyquist / 手工验收 — 本 phase **无** 独立自动化截图对比；以 **`npm run verify`**、`chartAggregate` 单测不改为门禁，**图表 Tab 手工 UAT**（周/月/年、有数据/无数据、分类列表与总额肉眼一致）为 Dimension 8 证据来源。

| Dimension | Evidence |
|-----------|----------|
| 功能正确性 | 现有 `chartAggregate.test.ts` + 手动交叉核对总额 |
| 视觉/动效 | `07-UI-SPEC` 清单 + 会话 UAT 记录 |
| 回归 | `npm run verify` 退出码 0 |

## RESEARCH COMPLETE
