# Phase 8 — Pattern Map（PATTERNS）

**Phase:** 08-tesla-v2-1  
**Generated:** 2026-04-22 · 与 `08-CONTEXT` / 代码库对齐（非子代理长文输出）

## 角色与类比

| 新/改 | 角色 | 最近类比 | 摘录 |
|-------|------|----------|------|
| `BillQueryScreen` | Stack 内列表 + 日期控制 | `HomeScreen`（SectionList + `queryBillsForMonth`） | 复用 `CategoryIcon`、`formatAmountDisplay`、列表行密度 |
| `HomeMain` header 双右键 | `headerLeft`/`headerRight` | 现 `HomeScreen` `useLayoutEffect` | 追加 `Pressable` + `MaterialCommunityIcons` |
| 日/区间 → SQL | 时间边界 | `billRepo.queryBillsForCalendarDay` / `queryBillsInRange` | 不再新造 SQL，只统一 **秒级 [start, end)** |
| `MineScreen` | 静态信息 + 卡片 | 现 `MineScreen.tsx` | 扩列表节，不改导航结构 |
| 刷新 | 列表与详情一致 | `BillsRefreshContext` | `useBillsRefresh` 在 `BillQuery` focus 时 `refresh` 与 `Home` 同代 |

## 新文件（建议路径）

- `src/utils/billTimeRange.ts` — 本地日界 ↔ `startSec`/`endSecExclusive` 纯函数  
- `src/utils/billTimeRange.test.ts` — 与 `chartAggregate.test` 同风格  
- `src/screens/BillQueryScreen.tsx` — 新屏  

## 数据流

```
[Date UI] → billTimeRange → queryBillsInRange(start, end) → Bill[] → list → BillDetail
```

## PATTERN MAPPING COMPLETE

---

*08-PATTERNS.md — 供 gsd-planner/executor 快速对齐既有写法*
