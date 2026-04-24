---
phase: 22
slug: modal-shimmer-fab-glass-deferred
status: draft
nyquist_compliant: true
created: 2026-04-24
---

# Phase 22 — Validation Strategy

| Property | Value |
|----------|-------|
| **Quick** | `npm run verify` |
| **Full** | `npm run verify` |
| **Framework** | Vitest + tsc + eslint |

- 关相前：全量 `npm run verify` 绿。  
- 手测：Modal 开闭 ×2、Fab 按压缩放 shimmer（见 `22-VERIFICATION.md` spot-check 表，执行时补全）。

**Approval:** pending
