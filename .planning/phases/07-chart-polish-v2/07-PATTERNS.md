# Phase 7: Pattern Map (07-chart-polish-v2)

**Created:** 2026-04-22  
**Purpose:** 为执行器提供「最近类比」与修改面，非规范全文。

## Target files (规划修改)

| File | Role | Closest analog |
|------|------|----------------|
| `src/screens/ChartScreen.tsx` | 图表 Tab 唯一主屏；柱 + chips + 列表 | 自身为锚；参考 `06` 各屏的 `pressedOpacity` / `shadows.raised` 用法 |
| `src/theme/layout.ts` | 新增 `chartFadeMs`（或等价） | `pressDurationMs` 同级导出模式（`06-01-PLAN`） |
| `src/theme/colors.ts` | 只读引用；不改语义色 | — |

## Non-touch

- `src/chart/chartAggregate.ts` — **禁止** 改导出语义（与 Phase 3 单测绑死）。

## PATTERN MAPPING COMPLETE
