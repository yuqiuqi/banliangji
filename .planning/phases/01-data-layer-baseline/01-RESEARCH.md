# Phase 1 — Technical Research (lightweight)

**Phase:** 数据层与基线验证  
**Date:** 2026-04-21  
**Status:** Complete — planning support only  

## Summary

本阶段不引入新存储技术；工作重点是 **对照本仓库 `expo-sqlite` DDL 与 `billRepo` 实现**，确认 `main.db` / `bill_list` 列语义、`type` 归一、时间戳为 Unix 秒、区间查询为半开区间 `[start, end)`。验证以静态审查与手工冒烟为主（见 `01-CONTEXT.md` D-06）。

## References

- 权威实现：`src/db/database.ts`、`src/db/billRepo.ts`、`src/types/models.ts`
- 审计产出：`.planning/phases/01-data-layer-baseline/01-01-AUDIT.md`

## Risks / Notes

- `CREATE TABLE IF NOT EXISTS` 无版本迁移：与 CONTEXT D-02 一致；未来列变更必须单独立项。
- 同步 `runSync` API 在主线程阻塞为已知权衡，本 phase 不改异步。

## Validation Architecture

本阶段 **无** 新增自动化测试框架（Jest 等归入 Phase 4）。反馈闭环为：

1. **每个计划完成后**：`npm run typecheck` 与 `npm run lint` 必须通过（与 `QA-01`/`QA-02` 对齐，本阶段作为门禁抽样）。
2. **Plan 01-01**：产出 `01-01-AUDIT.md`（列级对照 + 查询语义说明）；若发现与 DDL 不一致，在 `database.ts` / `billRepo.ts` / `models.ts` 修正并再跑 typecheck/lint。
3. **Plan 01-02**：在 `PROJECT.md` 写明数据文件驻留含义与「杀进程再启动」冒烟步骤，支撑 `DATA-02` 人工确认。
4. **`/gsd-verify-work` 之前**：Phase 4 将扩展为完整 UAT；本 phase 仅记录手工步骤与结论占位。

---

## RESEARCH COMPLETE
