---
phase: 5
slug: mvp-v2
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-21
---

# Phase 5 — Validation Strategy

> 与 `05-RESEARCH.md` 中 Validation Architecture 对齐。

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.x |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npm run test` |
| **Full suite command** | `npm run verify` |
| **Estimated runtime** | ~5–15s |

---

## Sampling Rate

- **After every task commit:** `npm run test`
- **After every plan wave:** `npm run verify`
- **Before `/gsd-verify-work`:** `npm run verify` 全绿

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | REF-01 / REF-02 | P5-T01 / — | 本地 DB，无新网络 | unit | `npm run test` | ✅ vitest | ⬜ pending |
| 05-02-01 | 02 | 2 | REF-01 / REF-02 | P5-T01 / — | 无权限扩张 | manual+verify | `npm run verify` | — | ⬜ pending |

---

## Wave 0 Requirements

- 现有 Vitest 已安装；本 phase **不**强制新建 Wave 0，除非引入新测试框架。

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 5 Tab 导航与预算/资产主路径 | REF-01, REF-02 | 设备 TabBar 与焦点刷新 | 真机/模拟器：切换 Tab、设 cap、记一笔支出、回预算看已用变化 |

---

## Validation Sign-Off

- [ ] 采样连续：`npm run test` 在数据任务后绿
- [ ] `npm run verify` 在 wave 2 末绿
- [ ] `nyquist_compliant: true` 于执行收尾时置位

**Approval:** pending
