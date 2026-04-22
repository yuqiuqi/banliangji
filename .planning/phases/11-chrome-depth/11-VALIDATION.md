---
phase: 11
slug: chrome-depth
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-22
---

# Phase 11 — Validation Strategy

> 反馈采样以 **静态门禁** 为主，**系统外观 / 辅助功能** 以 `11-VERIFICATION.md` 手工表为准。

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript + ESLint + vitest（`npm run test`） |
| **Config file** | `package.json`、`tsconfig.json`、项目内 ESLint / vitest 配置 |
| **Quick run command** | `npm run verify` |
| **Full suite command** | `npm run verify` |
| **Estimated runtime** | 依机器，通常 1–3 分钟级 |

---

## Sampling Rate

- **After every task commit:** `npm run verify`
- **After every plan wave:** `npm run verify`
- **Before phase sign-off:** `npm run verify` 绿 + `11-VERIFICATION.md` 必填行已填

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 11-01-01 | 01 | 1 | THEME-01 | — | N/A | static | `npm run verify` | ✅ | ⬜ pending |
| 11-01-02 | 01 | 1 | THEME-01 | — | N/A | static | `npm run verify` | ✅ | ⬜ pending |
| 11-02-01 | 02 | 1 | A11Y-01 | — | N/A | static | `npm run verify` | ✅ | ⬜ pending |
| 11-02-02 | 02 | 1 | LG-01 | — | N/A | static | `npm run verify` | ✅ | ⬜ pending |
| 11-02-03 | 02 | 1 | LG-01 | — | N/A | static | `npm run verify` | ✅ | ⬜ pending |
| 11-03-01 | 03 | 2 | LG-01 | — | N/A | static | `npm run verify` | ✅ | ⬜ pending |
| 11-03-02 | 03 | 2 | LG-01 / THEME / A11Y | — | N/A | manual | 见 `11-VERIFICATION.md` | ✅ | ⬜ pending |

---

## Wave 0 Requirements

现有 `npm run verify` 已覆盖类型检查 / lint / 测试 — **不强制**为本 Phase 新建 UI 快照测试。

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|---------------|------------|-------------------|
| 系统深色下对比度 | THEME-01 | 像素与观感 | `11-VERIFICATION.md` § 深色 |
| 降低透明度开/关 | A11Y-01 | 系统设置 | `11-VERIFICATION.md` § 辅助功能 |
| Tab / Dock 材质与动效 | LG-01 | 手感 | `11-VERIFICATION.md` § LG |

---

## Validation Sign-Off

- [x] Wave 0：现有 verify 链可用
- [ ] 所有 PLAN 任务有 automated 或 manual 映射
- [ ] `nyquist_compliant: true` 于本文件 frontmatter（本策略承认以手工表补 UI）

**Approval:** pending
