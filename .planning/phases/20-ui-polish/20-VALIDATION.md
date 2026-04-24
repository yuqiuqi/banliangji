---
phase: 20
slug: ui-polish
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-23
---

# Phase 20 — Validation Strategy

> Phase 20 为 UI 层精修；Wave 0 基础设施继承既有 Vitest + ESLint。本表为补档对齐 Nyquist。

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest |
| **Config file** | `vitest.config.ts` / 项目内既有配置 |
| **Quick run command** | `npm run verify` |
| **Full suite command** | `npm run verify` |
| **Estimated runtime** | ~60 秒（视机） |

---

## Sampling Rate

- **After every task commit:** `npm run verify`
- **Before `/gsd-verify-work`:** `npm run verify` 全绿
- **Max feedback latency:** 以本地 CI 为准

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 20-01-1 | 01 | 1 | 精修回归 | — | N/A（纯 UI） | verify | `npm run verify` | ✅ | ✅ green |

*Status: ✅ green（本相已合并，补档）*

---

## Wave 0 Requirements

- [x] 现有 `npm run test` / `vitest` 覆盖 Phase 17/18 以来工具函数与组件测例
- [x] 无新增 DB / schema

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|---------------------|
| 顶栏双键不连带、玻璃对比度 | `20-VERIFICATION` §1–2 | 真机像素/对比 | 参考 `20-VERIFICATION.md` |

---

## Validation Sign-Off

- [x] 全相以 `npm run verify` 为自动化门
- [x] 手测见 `20-VERIFICATION.md`
- [x] `nyquist_compliant: true`

**Approval:** approved 2026-04-23（补档）
