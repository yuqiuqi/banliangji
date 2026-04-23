# Phase 2 — Pattern Map

**Phase:** 02 — core-user-flow-uat  
**Output:** Closest analogs for Clay UAT + UI convergence.

## Files to touch（primary）

| File | Role | Closest pattern / analog |
|------|------|---------------------------|
| `src/screens/HomeScreen.tsx` | 明细、月份、FEAT-01 | 现有 `StyleSheet` + `colors.*`；列表 `FlatList`/`ScrollView` 分区 |
| `src/screens/CreateBillScreen.tsx` | 记一笔 FEAT-02 | 模态/stack；`BillCalculator`；`CategoryIcon` |
| `src/screens/BillDetailScreen.tsx` | 编辑 FEAT-03 | 表单行 + 保存导航返回 |
| `src/screens/CalendarScreen.tsx` | 日历 FEAT-05 | 月网格 + 日选择；导航到记账 |
| `src/screens/ChartScreen.tsx` | Tab 图表壳 | 分段控件 + 卡片；**不改**聚合服务 |
| `src/screens/MineScreen.tsx` | Tab 一致性 | header/卡片与其他屏对齐 |
| `src/navigation/RootNavigator.tsx` | Tab + Stack | `contentStyle` / 主题色已接 `canvas` |
| `src/theme/colors.ts` | 色源 | 扩展：`radii` / `shadows` 可选新文件 |
| `src/components/CategoryIcon.tsx` | 共享 | 记一笔/列表一致 |
| `src/components/BillCalculator.tsx` | 金额输入 | 边界与小数（UAT） |

## Data / refresh

| Integration | Notes |
|-------------|-------|
| `BillsRefreshProvider` | 走查后保存/删除须触发列表一致 |
| `src/db/billRepo.ts` | 只读对照；Phase 2 以 UI/流程为主，避免改查询语义 |

## PATTERN MAPPING COMPLETE
