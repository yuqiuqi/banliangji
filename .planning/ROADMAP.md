# Roadmap: SwiftCostRN

## Milestones

| 版本 | 名称 | 范围 | 封板日 |
|------|------|------|--------|
| v1.0 | 离线记账 MVP | Phases 1–4 | 2026-04-21 |
| v2.0 | SharkBook 体验融合 | Phases 5–7 | 2026-04-22 |
| v2.1 | 账单流 · 查账 · 我的 | Phase 8 | 2026-04-22 |
| ✅ **v2.2** | **iOS 26 全局 Chrome（Liquid Glass）** | **Phase 9** | **2026-04-22** |
| **v2.3** | **质量验证与系统外观** | **Phases 10–11** | — |

- **完整路线图（v1–v9 全文）：** [`.planning/milestones/v2.2-ROADMAP.md`](milestones/v2.2-ROADMAP.md)  
- **需求快照（至 v2.2）：** [`.planning/milestones/v2.2-REQUIREMENTS.md`](milestones/v2.2-REQUIREMENTS.md)  
- **当前里程碑需求：** [`.planning/REQUIREMENTS.md`](REQUIREMENTS.md)

## v2.3 质量验证与系统外观

编号自上一里程碑 **Phase 9** 延续：**10–11**。需求与阶段映射见 `REQUIREMENTS.md` Traceability。

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

---

*Phase 1–9 历史目录保留在 `.planning/phases/`；v2.3 请新建 `10-*` / `11-*` 子目录承载计划与 UAT。*
