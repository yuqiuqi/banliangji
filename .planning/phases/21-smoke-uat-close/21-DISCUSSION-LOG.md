# Phase 21: 验证闭合（smoke-uat-close）- Discussion Log

> **Audit trail only.** 不作为 planner/research/execute 的输入。决策以 `21-CONTEXT.md` 为准。

**Date:** 2026-04-24  
**Phase:** 21-smoke-uat-close  
**Areas covered:** DATA-02 终态、11-VERIFICATION 签字/等效、设备环境、与 Phase 22 边界、verify 门

**Session type:** 单次会话、无 TUI 交互；灰区在 **`REQUIREMENTS.md`、ROADMAP Phase 21 Success criteria、既有 `DATA-02-SMOKE.md` / `11-VERIFICATION.md`** 下收束为 Context 决策，替代逐项口头问答。

---

## DATA-02：PASS 与 BLOCKED 何者为「相完成可接受」

| Option | Description | Selected |
|--------|-------------|----------|
| A | 必须跑通 `PASS` 才允许关闭 Phase 21 |  |
| B | `PASS` 或**带日期的** `BLOCKED`+原因+环境信息均算满足 SC | ✓ |

**Rationale:** 与 ROADMAP 明文 Success criteria 及历史「Agent/CI 无法代手测」一致，避免本相被无限阻塞。

---

## 11-VERIFICATION：「Signed / 等效」操作定义

| Option | Description | Selected |
|--------|-------------|----------|
| A | 必须纸质/第二人双签 |  |
| B | 维护者单人 Sign-off + 日期 + 各节 checklist 可核验见证 | ✓ |
| C | 完全省略手测、仅打勾不写字 |  |

**Rationale:** 小团队/单维护者；等效=可追溯书面记录，非空勾。

---

## 执行环境：真机 vs Simulator

| Option | Description | Selected |
|--------|-------------|----------|
| A | 仅接受真机 |  |
| B | 真机或 Simulator 均可，Kill protocol 与 `DATA-02` 一致即可；Simulator 可配合 sqlite3 注记 | ✓ |

---

## Phase 与 GLASS 边界

| Option | Description | Selected |
|--------|-------------|----------|
| A | Phase 21 可顺手做 GLASS-01/02 |  |
| B | 严格不纳入 21，GLASS 仅 Phase 22 / REQUIREMENTS 映射 | ✓ |

---

## Claude's Discretion

- 文件间交叉引用、措辞与编号格式，由实现阶段在不改变语义前提下列入 Context「Claude's Discretion」。

## Deferred Ideas

- GLASS-01、GLASS-02 — 见 `21-CONTEXT.md` `<deferred>` 与 `REQUIREMENTS.md`。
