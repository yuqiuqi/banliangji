# Phase 8 — Verification / Consistency

**Date:** 2026-04-22

## Consistency matrix

| Surface | Query condition | Expected source | Pass/Fail | Notes |
|---------|-----------------|-----------------|-----------|-------|
| Home（明细） | 当前月 `monthAnchor` | `queryBillsForMonth` → 月内全量行 | 待测 | 用「日 section 金额加总」与月顶栏 收入+支出 交叉核对（同月内） |
| Calendar | 选中某 `dayKey` 的列表 | 与 `queryBillsForCalendarDay(该日)` 一致 | 待测 | 同一 `dayKey` 在 BillQuery「单日=该日」下列表集合应一致（同 `billId` 集合） |
| BillQuery | 单日=某日 | `queryBillsForCalendarDay(anchor)` | 待测 | 与上 Calendar 单日同源；不重复造 SQL |

> 不填具体金额，人工在设备上选同一日对比「笔数+总额」与 Home 月内该日 section。

## Manual UAT

- [x] `npm run verify`（tsc + eslint + vitest）
- [ ] 设备：明细 → 查账（账单） → 选单日 → 点一条进详情 → 返回
- [ ] 设备：记一笔 → 回明细/账单 列表可见新记录
- [ ] 设备：我的 → 关于 / 数据与存储 展开正文可读、无要求登录

## Phase 8 implementation notes

- `BillQuery` 为 HomeStack 内屏；`billTime` 区间半开，见 `src/utils/billTimeRange.ts`。
