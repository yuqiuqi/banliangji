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

### Phase 11: 深色模式与辅助功能

| 项 | 内容 |
|----|------|
| **Goal** | **THEME-01**：系统深色下关键屏可读、语义一致。**A11Y-01**：降低透明度下毛玻璃降级可辨识、主路径可用。 |
| **Requirements** | THEME-01, A11Y-01 |
| **Success criteria** | 1) 深色外观下 Tab/明细/记一笔/账单/设置无不可读主文案（对比度可人工 spot-check）。 2) 开启「降低透明度」后，原先 Blur 主导航或关键容器仍有可见背景/边框，记一笔与返回主列表可完成。 3) 行为与 `UI-SPEC.md` 一致或偏差已记在 Phase 11 文档。 4) `npm run verify` 通过。 |

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
| 10–11 | 0/? | Not started | — |

---

*Phase 1–9 历史目录保留在 `.planning/phases/`；v2.3 请新建 `10-*` / `11-*` 子目录承载计划与 UAT。*
