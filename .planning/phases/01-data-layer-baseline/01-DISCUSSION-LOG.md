# Phase 1: 数据层与基线验证 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.  
> Decisions are captured in `01-CONTEXT.md`.

**Date:** 2026-04-21  
**Phase:** 1 — 数据层与基线验证  
**Areas discussed:** 文档策略、Schema 演进、验证深度、时间/查询语义（合并为一次收敛）

---

## Session note

单次会话完成：`/gsd-discuss-phase 1` 未带 `--auto` / `--batch`，且 Phase 1 以基础设施与对照审查为主。下列灰色地带按 **ROADMAP 成功标准 + 现有代码** 收敛为推荐项，并写入 CONTEXT；若需调整可编辑 `01-CONTEXT.md` 或重跑 discuss。

---

## 文档策略

| Option | Description | Selected |
|--------|-------------|----------|
| A | 仅更新 `.planning/PROJECT.md`（必要时 README 短节） | ✓ |
| B | 新建 `docs/DATA.md` 作为主文档 | |
| C | 大型 `docs/` 树 | |

**User's choice:** A（推荐默认）  
**Notes:** 与 Phase 1 Plans 01-02「面向开发者说明」一致，避免过早膨胀文档结构。

---

## Schema 演进

| Option | Description | Selected |
|--------|-------------|----------|
| A | v1 仅 `IF NOT EXISTS`，迁移另开 phase | ✓ |
| B | 引入版本表 + 迁移 runner | |

**User's choice:** A  
**Notes:** 满足 D-02/D-03，降低 Phase 1 范围蔓延。

---

## 验证深度

| Option | Description | Selected |
|--------|-------------|----------|
| A | 审查 + 手工冒烟；单测归 Phase 4 | ✓ |
| B | Phase 1 即加 Jest 数据层测试 | |

**User's choice:** A  
**Notes:** 与 `ROADMAP` Phase 4 QA 分工一致。

---

## 时间与区间语义

| Option | Description | Selected |
|--------|-------------|----------|
| A | Unix 秒 + 半开区间（与当前 `billRepo` 一致） | ✓ |
| B | 改为毫秒或其他约定 | |

**User's choice:** A  
**Notes:** 时间戳统一为 Unix 秒，与业务层解析约定对齐。

---

## Claude's Discretion

- 审查交付物形式（对照表是否写入 PROJECT.md）。

## Deferred Ideas

- 云备份、导出 CSV — 见 `PROJECT.md` / Phase 后续。
