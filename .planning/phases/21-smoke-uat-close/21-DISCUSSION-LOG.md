# Phase 21: 验证闭合（smoke-uat-close）- Discussion Log

> **Audit trail only.** Decisions live in `21-CONTEXT.md`.

**Date:** 2026-04-24  
**Phase:** 21-smoke-uat-close  
**Mode:** Auto-equivalent（无交互；推荐默认一次性锁定）  
**Areas covered:** DATA-02 证据格式 · 11-VERIFICATION 签字 · iOS 主测 · Phase 22 边界  

---

## DATA-02 与 Kill protocol

| Option | Description | Selected |
|--------|-------------|----------|
| A | 严格遵循 `DATA-02-SMOKE.md`，仅更新 Result/Environment/Investigation | ✓ |
| B | 放宽杀进程定义（不推荐） | |

**User's choice:** N/A — `[auto]` Selected A（与项目既有文档一致）

---

## THEME / A11Y / LG 清单载体

| Option | Description | Selected |
|--------|-------------|----------|
| A | 继续使用 `11-chrome-depth/11-VERIFICATION.md` + Sign-off | ✓ |
| B | 新建并行 checklist（增加漂移风险） | |

**User's choice:** `[auto]` Selected A

---

## 执行平台

| Option | Description | Selected |
|--------|-------------|----------|
| A | iOS Simulator/真机为主；Android 本相不强制，未测则 deviation 说明 | ✓ |
| B | iOS + Android 双端必测 | |

**User's choice:** `[auto]` Selected A

---

## Phase 22 范围隔离

| Option | Description | Selected |
|--------|-------------|----------|
| A | Phase 21 仅验证文档 + 最小缺陷修复；GLASS 工作全部 Phase 22 | ✓ |
| B | 合并 Modal/Shimmer 进 Phase 21 | |

**User's choice:** `[auto]` Selected A

---

## Claude's Discretion

- Planner 可将手测拆分为多 Wave；executor 以 `21-CONTEXT.md` 的 D-xx 为硬约束。

## Deferred Ideas

- Android 全量；999.x SUMMARY backlog（见 CONTEXT deferred）
