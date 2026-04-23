# Roadmap: SwiftCostRN

## Milestones

| 版本 | 名称 | 范围 | 封板日 |
|------|------|------|--------|
| v1.0 | 离线记账 MVP | Phases 1–4 | 2026-04-21 |
| v2.0 | SharkBook 体验融合 | Phases 5–7 | 2026-04-22 |
| v2.1 | 账单流 · 查账 · 我的 | Phase 8 | 2026-04-22 |
| ✅ **v2.2** | **iOS 26 全局 Chrome（Liquid Glass）** | **Phase 9** | **2026-04-22** |
| **v2.3** | **质量验证与系统外观** | Phases 10–12 + 结转 | 结转中 |
| **v2.4** | **iOS 26 Chrome 副路径全量对齐** | **Phase 13**（扩大） | — |

- **完整路线图（v1–v9 全文）：** [`.planning/milestones/v2.2-ROADMAP.md`](milestones/v2.2-ROADMAP.md)  
- **需求快照（至 v2.2）：** [`.planning/milestones/v2.2-REQUIREMENTS.md`](milestones/v2.2-REQUIREMENTS.md)  
- **当前里程碑需求：** [`.planning/REQUIREMENTS.md`](REQUIREMENTS.md)（**v2.4** + v2.3 结转）

## v2.4 iOS 26 Chrome 副路径全量对齐（Phase 13）

**目标：** **图表 / 预算 / 资产 / 我的** 与 **iOS / iPadOS 26**（Liquid Glass、HIG：**Hierarchy / Harmony / Consistency**）在 **色彩、材质/透明度、动效、交互** 上系统性一致；权威摘录见 [`.planning/research/IOS26-LIQUID-GLASS-REFERENCE.md`](research/IOS26-LIQUID-GLASS-REFERENCE.md)。**结转** v2.3：**DATA-02**、**THEME-01**、**A11Y-01**、**LG-01**；**新增** **LG-02**。

## v2.3 质量验证与系统外观（历史编号 Phases 10–12）

编号自 **Phase 9** 延续至 **12**；**未闭合项**由 **v2.4 / Phase 13** 承接。需求与阶段映射见 `REQUIREMENTS.md` Traceability。

### Phase 10: 持久化与 UAT 闭环

| 项 | 内容 |
|----|------|
| **Goal** | 用可引用证据关闭 **DATA-02**；**QA-04** 使 08/09 UAT 与验证文档一致。 |
| **Requirements** | DATA-02, QA-04 |
| **Success criteria** | 1) 至少在一种目标环境（真机或官方模拟器）完成杀进程冒烟，步骤与截图/日志摘要写入 `.planning/phases/10-*/` 或等价位置。 2) `REQUIREMENTS.md` 中 DATA-02 可勾选或明确记录阻塞原因与跟进取证计划。 3) 相关 UAT Markdown 中无未解释的 `pending`；与 `09-VERIFICATION` 冲突处已 resolution 或 Accepted deviation。 4) `npm run verify` 仍通过。 |

### Phase 11: 深色 · 无障碍 · Liquid Glass 材质/动效纵深

| 项 | 内容 |
|----|------|
| **Goal** | **THEME-01** / **A11Y-01**：深色与降低透明度。**LG-01**：在 RN/`expo-blur` 能力边界内，缩小与 **iOS 26 Liquid Glass** 在 **动效、透明度层次、立体感** 上的感知差距（非像素级抄系统）。 |
| **Canonical spec** | [`.planning/phases/11-chrome-depth/11-MATERIAL-MOTION-SPEC.md`](phases/11-chrome-depth/11-MATERIAL-MOTION-SPEC.md)（本地材质/动效分层；**不含网络能力**） |
| **非目标** | **不计划** 云同步、在线资源、账号/登录、远程配置等任何联网需求；核心仍为 **本机 SQLite + 本地 UI**。 |
| **Requirements** | THEME-01, A11Y-01, **LG-01** |
| **Success criteria** | 1) 深色外观下关键屏可读（THEME-01）。 2) 降低透明度下主路径可完成（A11Y-01）。 3) **LG-01**：按 `11-MATERIAL-MOTION-SPEC` §4 完成 **材质栈 + 动效栈** 中约定的 Tab/顶栏/记一笔 Dock 等 **Tier-1** 改造，或逐项 **Accepted deviation** 记入 Phase 11 `VERIFICATION`；真机 spot-check 无「单层灰雾 Tab」与「线性僵硬」主导体验。 4) `UI-SPEC.md` / `DESIGN.md` 同步偏差说明。 5) `npm run verify` 通过。 |

### Phase 12: DATA-02 与 Phase 10 验证归档（缺口收口）

| 项 | 内容 |
|----|------|
| **Goal** | 用**设备可引用证据**关闭 **DATA-02**；补齐 **Phase 10** 与 ROADMAP 对齐的验证产出（`10-*-VERIFICATION.md` 或等价、`DATA-02-SMOKE.md` 终态）。 |
| **Requirements** | DATA-02 |
| **Gap closure** | 来源：`v2.3-MILESTONE-AUDIT.md`（DATA-02 unsatisfied、无 `10-VERIFICATION`、E2E 杀进程流 blocked）。 |
| **Success criteria** | 1) `DATA-02-SMOKE.md` 为 `PASS` 或 `FAIL`（不得长期 `BLOCKED` 且无计划）。 2) `REQUIREMENTS.md` 中 DATA-02 可 honest 勾选或记录 **Accepted deviation** + 跟进取证。 3) 存在可检索的 `10-*-VERIFICATION.md`（或审计认可的等价物）。 4) `npm run verify` 仍通过。 |

### Phase 13: iOS 26 副路径 Chrome 全量对齐 + v2.3 验收收口（v2.4）

| 项 | 内容 |
|----|------|
| **Goal** | **（主）** 交付 **LG-02**：**图表、预算、资产、我的** 四屏与 **Tier-1** 及 **Apple iOS 26 Liquid Glass / HIG** 在 **色彩、透明度/材质、动效、交互** 上可验收一致（RN 边界以 **Accepted deviation** 文档化）。**（结转）** 设备上完成 **THEME-01 / A11Y-01 / LG-01** 验收并回填 `11-VERIFICATION.md` / `11-UAT.md`；**DATA-02** 至 **PASS/FAIL**。 |
| **Requirements** | **LG-02**；**THEME-01**, **A11Y-01**, **LG-01**；**DATA-02**（结转） |
| **Canonical spec** | `UI-SPEC.md`、`DESIGN.md`、`.planning/phases/11-chrome-depth/11-MATERIAL-MOTION-SPEC.md`；官方锚点：`.planning/research/IOS26-LIQUID-GLASS-REFERENCE.md` |
| **Gap closure** | 维护者结论：副路径四屏**当前不符合**核心 UI/UX；原审计 **THEME/A11Y/LG partial**（`v2.3-MILESTONE-AUDIT.md`）。 |
| **Success criteria** | 1) 四屏 **LG-02** 在浅色/深色与（适用时）**降低透明度**下 **spot-check** 无「脱离 `iosSemantic` / 组件原语」的临时实现；动效与导航协同符合 `11-MATERIAL-MOTION-SPEC` Tier-2 或已记 deviation。 2) `11-VERIFICATION` / `11-UAT`（及必要时 `13-VERIFICATION`）中相关项 **pass** 或 **Accepted deviation** 表可查。 3) `REQUIREMENTS.md` 中 **LG-02** 与结转项可 **honest** 勾选（DATA-02 以 `DATA-02-SMOKE.md` 为准）。 4) `npm run verify` 通过。 |

## Phases（摘要）

<details>
<summary>✅ 已完成 Phases 1–9（点击展开）</summary>

- [x] Phase 1 — 数据层与基线验证（2026-04-21）
- [x] Phase 2 — 核心用户流程 UAT（2026-04-21）
- [x] Phase 3 — 图表与分析一致性（2026-04-21）
- [x] Phase 4 — 质量门禁与发布准备（2026-04-21）
- [x] Phase 5 — 预算与资产 MVP v2（2026-04-21）
- [x] Phase 6 — 全局 UI 精研 v2（2026-04-22）
- [x] Phase 7 — 图表表现层 v2（2026-04-22）
- [x] Phase 8 — 账单流 / 查账 / 我的 v2.1（2026-04-22）
- [x] Phase 9 — iOS 26 全局 Chrome v2.2（2026-04-22）

细则见 **里程碑归档** `v2.2-ROADMAP.md`。

</details>

## Progress（快照）

| Phase | Plans | Status | Completed |
|-------|-------|--------|-----------|
| 1–9 | 24/24 | Complete | 2026-04-22 |
| 10 | 2/2 | Executed（DATA-02 文档已建，手测 BLOCKED；QA-04 已闭环） | 2026-04-22 |
| 11 | 3/3 | **Complete**（`11-01`…`11-03` SUMMARY 已归档；verify 绿；手测见 `11-VERIFICATION`） | 2026-04-23 |
| 12 | 2/2 | **Executed**（文档与跟踪已更新；**DATA-02 设备 Result 仍为 BLOCKED**，见 SMOKE §3） | 2026-04-23 |
| 13 | 2/2 | **Executed**（`13-01-SUMMARY` / `13-02-SUMMARY`；LG-02 设备矩阵与 DATA-02 仍待本地补证） | — |

---

*Phase 1–9 历史目录保留在 `.planning/phases/`；v2.3 含 `10-*`…`13-*` 子目录（12–13 为审计后缺口阶段）。*
