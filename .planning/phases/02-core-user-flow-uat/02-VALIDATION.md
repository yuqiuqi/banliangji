---
phase: 02
slug: core-user-flow-uat
status: draft
nyquist_compliant: false
wave_0_complete: true
created: 2026-04-21
---

# Phase 2 — Validation Strategy

> React Native / Expo 项目：无单元测试套件；本阶段以 **typecheck + lint + 手工 UAT** 为主。

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — TypeScript + ESLint only |
| **Config file** | `tsconfig.json`, `eslint.config.js` |
| **Quick run command** | `npm run typecheck && npm run lint` |
| **Full suite command** | 同 quick（无分离的 test suite） |
| **Estimated runtime** | ~30–90 seconds |

---

## Sampling Rate

- **After every task commit（改代码的任务）:** `npm run typecheck && npm run lint`
- **After Plan 02 wave:** 同上 + 建议完整跑一遍 Plan 01 主路径冒烟
- **Before `/gsd-verify-work`:** typecheck + lint 全绿；UAT 表在 `02-UAT-RECORD.md` 已填
- **Max feedback latency:** 120 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 1 | FEAT-01..05 | P2-T01 / — | N/A | manual | `test -f .../02-01-ISSUES.md` | ✅ | ⬜ pending |
| 2-01-02 | 01 | 1 | FEAT-01..05 | — | N/A | manual | grep 表头 | ✅ | ⬜ pending |
| 2-02-* | 02 | 2 | FEAT-* | P2-T* | 本地沙箱 | hybrid | `npm run typecheck` | ✅ | ⬜ pending |
| 2-03-01 | 03 | 3 | FEAT-01..05 | — | N/A | manual | `test -f .../02-UAT-RECORD.md` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] **Existing infrastructure covers phase requirements** — `typecheck` / `lint` 已存在；本 phase 不强制引入 Jest。

*No new stub test files required.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 月份切换与汇总 | FEAT-01 | RN 导航与手势 | 明细页切换月份，确认总收入/总支出与列表一致 |
| 记一笔保存 | FEAT-02 | 模态与键盘 | 打开记一笔，选支出/收入、类别、金额，保存回明细 |
| 编辑账单 | FEAT-03 | 表单回填 | 从详情编辑金额/备注，保存后列表与详情一致 |
| 删除账单 | FEAT-04 | 确认与列表刷新 | 删除后该项从明细/日历消失 |
| 日历入口与按日查看 | FEAT-05 | 多屏跳转 | 明细→日历，选日查看/发起记账（与当前导航一致） |
| 3 分钟主路径 | ROADMAP SC-1 | 端到端 | 新用户路径：记一笔→明细→日历→详情编辑/删除，计时与阻塞点记录 |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or manual UAT rows above
- [ ] Sampling continuity: code tasks chained with typecheck/lint
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags in plan verify steps
- [ ] `nyquist_compliant: true` set in frontmatter **after** Phase 2 execution sign-off

**Approval:** pending
