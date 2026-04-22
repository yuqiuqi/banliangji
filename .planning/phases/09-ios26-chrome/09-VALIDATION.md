---
phase: 9
slug: ios26-chrome
status: draft
nyquist_compliant: false
wave_0_complete: true
created: 2026-04-22
---

# Phase 9 — Validation Strategy

> Phase 9 以 UI 收敛为主；自动化依赖现有 Vitest + typecheck + lint。

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.x |
| **Config file** | `vitest` inline / package.json scripts |
| **Quick run command** | `npm run verify` |
| **Full suite command** | `npm run verify` |
| **Estimated runtime** | ~15 seconds |

## Sampling Rate

- **After every task commit:** `npm run verify`
- **After every plan wave:** `npm run verify`
- **Before `/gsd-verify-work`:** Full suite green

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 9-01-* | 01 | 1 | IOS26-COMP | lint/grep | `npm run verify` | ⬜ |
| 9-02-* | 02 | 1 | IOS26-CHROME | lint | `npm run verify` | ⬜ |
| 9-03-* | 03 | 2 | IOS26-CHROME, IOS26-UX | lint | `npm run verify` | ⬜ |
| 9-04-* | 04 | 2 | IOS26-CHROME, IOS26-UX | lint | `npm run verify` | ⬜ |
| 9-05-* | 05 | 3 | IOS26-CHROME, IOS26-UX | lint | `npm run verify` | ⬜ |
| 9-06-* | 06 | 3 | IOS26-CHROME, IOS26-UX | lint | `npm run verify` | ⬜ |
| 9-07-* | 07 | 4 | IOS26-IPAD, IOS26-VERIFY | lint + manual | `npm run verify` | ⬜ |

## Wave 0 Requirements

- [x] 现有 `npm run verify` 已覆盖工程 — 无需新建测试框架

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|---------------------|
| Tab 模糊与可读性 | IOS26-CHROME | 模拟器/真机 | iOS：目视 Tab 下内容滚动时对比度可接受 |
| 全屏 UI 矩阵 | IOS26-VERIFY | 设计判断 | 按 `09-VERIFICATION.md` 逐项勾选 |

## Validation Sign-Off

- [ ] Phase 完成时 `nyquist_compliant: true`（若仍无单元新增，保持 manual 为主并注明）
- [ ] `09-VERIFICATION.md` 全表已填

**Approval:** pending
