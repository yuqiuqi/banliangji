---
phase: 06
slug: ui-v2
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-22
---

# Phase 06 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.x |
| **Config file** | `vitest` 默认配置（项目根） |
| **Quick run command** | `npm run verify` |
| **Full suite command** | `npm run verify` |
| **Estimated runtime** | ~30–90 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run verify`
- **After every plan wave:** Run `npm run verify`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 120 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | REF-04 | T-06-01 / — | 无网络；仅主题常量 | verify | `npm run verify` | ✅ | ⬜ pending |
| 06-02-01 | 02 | 1 | REF-04 | T-06-02 / — | 无新权限 | verify | `npm run verify` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] 现有 Vitest + `npm run verify` 覆盖工程门禁 — **无需** Wave 0 新装框架

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 各关键屏按压可见反馈 | REF-04 | 视觉 | 明细/记一笔/预算/资产/图表壳各点按 1 次，确认 opacity 或 scale 变化 |
| 图表数字与 Phase 3 一致 | CHART-01/02 | 设备抽样 | 周月年切换同一数据集对比总额 |

---

## Validation Sign-Off

- [ ] All tasks have `<verify>` or `npm run verify` in plan
- [ ] Sampling continuity: verify after theme + after screens
- [ ] No watch-mode flags in CI commands
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
