# Phase 5: 预算与资产管家 MVP（v2）- Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.  
> Decisions are captured in `05-CONTEXT.md`.

**Date:** 2026-04-21  
**Phase:** 5 — 预算与资产管家 MVP（v2）  
**Mode:** 默认 `workflow.discuss_mode = discuss`；**无交互式问答 API**（Cursor 会话），灰区采用 **ROADMAP / REF-01/02 / 既有代码口径** 的 **推荐默认**，写入 CONTEXT 供 `/gsd-plan-phase 5` 使用。若需改决策，人工编辑 `05-CONTEXT.md` 后再规划。

**Areas discussed:** 预算粒度与口径、资产余额来源、Schema/迁移、导航结构、超支提示、Clay 延续  

---

## 预算：周期与粒度

| Option | Description | Selected |
|--------|-------------|----------|
| A | 仅自然月「全月支出」一笔 cap | ✓ |
| B | 首版即强制「每分类」独立预算 |  |
| C | 仅周预算 |  |

**Notes:** 与 ROADMAP「建议：按月」及 REF-01「至少一种」对齐；分类预算标为可选增量（见 CONTEXT D-B01）。

---

## 预算：已用金额口径

| Option | Description | Selected |
|--------|-------------|----------|
| A | 与 `chartAggregate` 一致：`type === 1` 为支出，按 `billTime` 月入 | ✓ |
| B | 重新定义 type 语义 |  |

---

## 资产：余额来源（MVP）

| Option | Description | Selected |
|--------|-------------|----------|
| A | 用户手动维护余额快照；不与 `bill_list` 自动轧差 | ✓ |
| B | MVP 即从账单自动汇总为账户余额 |  |

**Notes:** 满足 REF-02「弱耦合」与 MVP 复杂度控制。

---

## 导航：预算 / 资产入口

| Option | Description | Selected |
|--------|-------------|----------|
| A | 底部 Tab 增加「预算」「资产」（推荐顺序：明细·图表·预算·资产·我的） | ✓ |
| B | 收入「我的」下二级入口，不增加 Tab |  |

**Notes:** 若 5 Tab 过挤，允许实现阶段改为单 Tab 内分段（CONTEXT Claude's Discretion）。

---

## 超支提示

| Option | Description | Selected |
|--------|-------------|----------|
| A | 进度条 + 警告色 + 短文案 | ✓ |
| B | 仅 Toast，无常驻视觉 |  |

---

## Schema

| Option | Description | Selected |
|--------|-------------|----------|
| A | 新表 + `CREATE TABLE IF NOT EXISTS`；不 ALTER `bill_list` | ✓ |
| B | 扩展 `bill_list` 列承载预算 |  |

---

*End of log.*
