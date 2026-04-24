# Requirements: 半两记

**Milestone:** **v3.1** — 验证闭合与 Liquid Glass 纵深收尾  
**Defined:** 2026-04-24  
**Core Value:** 离线「记一笔 → 明细/日历/图表即时一致」闭环稳定可靠；数据以 **本机存储** 为准。v3.1 在 v3.0 感知质量之上，**闭合设备与文档化验证债务**，并补齐 **Modal 材质化 + Shimmer/FAB** 等推迟项。

---

## v3.1 Requirements（本里程碑）

### 验证与持久化 (UAT)

- [ ] **UAT-01**: **DATA-02** — 按 `.planning/phases/10-persist-uat/DATA-02-SMOKE.md` 完成杀进程冷启动冒烟；`Result:` 更新为 **PASS** 或保持 **BLOCKED** 并注明日期、设备、阻塞原因。
- [ ] **UAT-02**: **THEME-01** — 系统深色外观下关键屏可读；以 Phase 11 `11-VERIFICATION` **手测签字或等效书面记录**为 Done 准则。
- [ ] **UAT-03**: **A11Y-01** — 「降低透明度」开启时主路径可用；同上签字/记录准则。
- [ ] **UAT-04**: **LG-01** — Tier-1 动效/材质 spot-check；同上签字/记录准则。

### Liquid Glass · 推迟项落地 (GLASS)

- [ ] **GLASS-01**: 将 **`useMaterialize`**（或等效协调的 opacity/scale/spring）应用于 **预算/资产** 等使用 `Modal` 的进出场，替代仅 `animationType` 的默认观感；**Reduce Motion** 路径须降级（见 v1.2 / `useReduceMotion`）。
- [ ] **GLASS-02**: 将 **`GlassShimmer`** 接入 **`Fab`**（及必要时一处主路径 CTA）；不得显著降低点击热区与对比度；需通过 `npm run verify`。

---

## Future（后续里程碑 · 不纳入 v3.1）

- **ANIM-07**：Tab 栏动态收缩（P2）
- **INT-02**：Swipe-to-delete（P2）
- **柱图 Skia / Tier-3 3D**（`20-VERIFICATION` 推迟）
- **SYNC-***：云同步（Out of Scope）

---

## Out of Scope（v3.1）

| Feature | Reason |
|---------|--------|
| Skia 柱图 shader / 真 3D 透视 | Tier-3 探索；成本与维护高 |
| 新业务报表/账户体系 | 本里程碑为验证 + 材质收尾 |
| 服务端 / 网络能力 | 与 Core Value 默认冲突 |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| UAT-01 | Phase 21 | Blocked — DATA-02 仍为 Kill 手测 BLOCKED，见 `DATA-02-SMOKE.md` 与 `21-VERIFICATION.md` |
| UAT-02 | Phase 21 | Blocked — THEME-01 手测未执行，已登记 Deferred UAT，见 `11-VERIFICATION.md` |
| UAT-03 | Phase 21 | Blocked — A11Y-01 手测未执行，同上 |
| UAT-04 | Phase 21 | Blocked — LG-01 手测未执行，同上 |
| GLASS-01 | Phase 22 | Pending |
| GLASS-02 | Phase 22 | Pending |

**Coverage:** v3.1 需求 6 条；已映射 6 条；Unmapped: 0。

---

*Requirements defined: 2026-04-24 — `/gsd-new-milestone`*
