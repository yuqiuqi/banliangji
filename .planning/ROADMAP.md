# Roadmap: 半两记

## Milestones

| 版本 | 名称 | 范围 | 封板日 |
|------|------|------|--------|
| v1.0 | 离线记账 MVP | Phases 1–4 | 2026-04-21 |
| v2.0 | SharkBook 体验融合 | Phases 5–7 | 2026-04-22 |
| v2.1 | 账单流 · 查账 · 我的 | Phase 8 | 2026-04-22 |
| ✅ **v2.2** | **iOS 26 全局 Chrome（Liquid Glass）** | **Phase 9** | **2026-04-22** |
| **v2.3** | 质量验证与系统外观 | Phases 10–12 + 结转 | 结转 v2.4 |
| **v2.4** | iOS 26 Chrome 副路径全量对齐 | Phase 13 | 2026-04-23 |
| **v3.0** | **iOS 26 动效·交互·组件全面质感打磨** | **Phase 14** | — |

- **完整路线图（v1–v2.2 全文）：** [`.planning/milestones/v2.2-ROADMAP.md`](milestones/v2.2-ROADMAP.md)  
- **v2.4 需求快照：** 已并入下方 v3.0 结转  
- **当前里程碑需求：** [`.planning/REQUIREMENTS.md`](REQUIREMENTS.md)（**v3.0** + 结转）

---

## v3.0 iOS 26 动效·交互·组件全面质感打磨（Phase 14）

**目标：** 以 iOS 26 / Liquid Glass **物理弹簧感知**为锚，对 **半两记全部屏幕与组件** 实施系统性动效与交互打磨——分段 Spring Thumb、图表 Stagger 柱生长、全站 Spring 按压、触觉反馈、Modal Spring 进出场、大标题折叠、Reduce Motion 降级。

**研究规格：** [`.planning/research/IOS26-MOTION-INTERACTION-SPEC.md`](research/IOS26-MOTION-INTERACTION-SPEC.md)

### Phase 14: iOS 26 全局动效与交互质感打磨（v3.0）

| 项 | 内容 |
|----|------|
| **Goal** | 新建 `motion.ts` 弹簧常量 + `useSpringPress` + `expo-haptics` + 图表 stagger 动效 + 分段 Spring Thumb + 列表入场 + Modal Spring + Scroll Header Collapse；全应用感知对齐 iOS 26 |
| **Requirements** | ANIM-01~06, INT-01, HAP-01, MOT-01 |
| **Canonical spec** | `.planning/research/IOS26-MOTION-INTERACTION-SPEC.md`、`UI-SPEC.md`、`11-MATERIAL-MOTION-SPEC.md` |
| **Success criteria** | 1) `motion.ts` 存在，所有 spring 参数经由此模块 2) `SegmentedTwo` / 图表分段指示器有弹簧位移 3) 图表柱切换有 stagger spring（含切换取消与 ≤12 根 stagger）4) 所有主路径可点击使用 `SpringPressable`（`PressableProps` 透传）5) `expo-haptics` 主路径（保存/删除/选择）接入且 `haptics` 封装 try/catch 6) Reduce Motion 开启时所有动效降级 7) Header collapse 与 `contentInset`/补偿联动避免列表跳变 8) `npm run verify` 通过 |

---

## v2.3–v2.4 历史（结转参考）

### Phase 10: 持久化与 UAT 闭环（Executed · DATA-02 BLOCKED）
### Phase 11: 深色 · 无障碍 · LG-01（Complete · 11-VERIFICATION 待手测签字）  
### Phase 12: DATA-02 与 Phase 10 验证归档（Executed · DATA-02 仍 BLOCKED）
### Phase 13: iOS 26 副路径 Chrome 全量对齐（Executed · LG-02 Done）

---

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
| 10 | 2/2 | Executed（DATA-02 BLOCKED） | 2026-04-22 |
| 11 | 3/3 | Complete（verify 绿；手测签字待补） | 2026-04-23 |
| 12 | 2/2 | Executed（DATA-02 仍 BLOCKED） | 2026-04-23 |
| 13 | 2/2 | Executed（LG-02 Done；v2.4 收口） | 2026-04-23 |
| **14** | **3/3** | **Ready to execute** | — |

---

*Phase 1–13 历史目录保留在 `.planning/phases/`；v3.0 从 Phase 14 起续编。*
