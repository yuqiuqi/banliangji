# Phase 3: 图表与分析一致性 — Context

**Status:** Execution  
**Date:** 2026-04-21  

## Boundary

- **CHART-01 / CHART-02**：周/月/年仅 **支出**；区间筛选与 `billRepo` 半开语义一致。  
- **交付**：聚合校验（自动化）+ 图表 Tab 空态/说明/可读性。

## Canonical

- `src/chart/chartAggregate.ts`、`src/utils/dates.ts`（`yearMonthPointsForChart`）  
- `src/screens/ChartScreen.tsx`  
- `.planning/REQUIREMENTS.md` — CHART-01, CHART-02  
