---
phase: 1
slug: data-layer-baseline
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-21
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for Phase 1（审查 + 手工冒烟，无 Wave 0 测试套件）。

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — Phase 1 不新增 Jest/Vitest（见 CONTEXT D-06） |
| **Config file** | `tsconfig.json` / `eslint.config.js` |
| **Quick run command** | `npm run typecheck && npm run lint` |
| **Full suite command** | 同 quick（本 phase） |
| **Estimated runtime** | ~30–60 seconds |

---

## Sampling Rate

- **After every task commit:** `npm run typecheck && npm run lint`
- **After every plan wave:** 同上
- **Before `/gsd-verify-work`:** 由 Phase 4 定义完整清单
- **Max feedback latency:** ~120 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| T1 | 01-01 | 1 | DATA-01 | T1-02 | 本地数据说明准确 | manual+static | `npm run typecheck` | 01-01-AUDIT.md | ⬜ pending |
| T2 | 01-01 | 1 | DATA-03 | — | N/A | manual+static | `npm run lint` | 01-01-AUDIT.md | ⬜ pending |
| T3 | 01-02 | 1 | DATA-02 | T1-02 | 无意外数据出境 | manual | `npm run typecheck` | PROJECT.md 段落 | ⬜ pending |

---

## Wave 0 Requirements

- Existing infrastructure covers phase requirements — TypeScript + ESLint 已就绪。

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 杀进程后账单仍在 | DATA-02 | 需真实应用生命周期 | 见 Plan 01-02 中「手工冒烟」编号步骤；插入一条账单 → 强制关闭应用 → 冷启动 → 明细仍可见该条 |

---

## Validation Sign-Off

- [ ] 所有任务含可执行 verify（typecheck/lint 或文档路径检查）
- [ ] 手工步骤在 `PROJECT.md` 可检索
- [ ] `nyquist_compliant: true` 留待 Phase 4 测试矩阵补齐后更新

**Approval:** pending
