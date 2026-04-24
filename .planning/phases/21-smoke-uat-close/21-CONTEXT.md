# Phase 21: 验证闭合（smoke-uat-close）- Context

**Gathered:** 2026-04-24
**Status:** Ready for planning
**Milestone:** v3.1 — 验证闭合与 Liquid Glass 纵深收尾

<domain>
## Phase Boundary

本相**仅**闭合 **UAT-01～UAT-04**（见 `.planning/REQUIREMENTS.md`），不实现 **GLASS-01/02**（归 **Phase 22**）。

**交付物形态（范围内）：**

- 更新/固化 **DATA-02** 与 **Phase 11** 的**文档化手测**证据链（`DATA-02-SMOKE.md`、`.planning/phases/11-chrome-depth/11-VERIFICATION.md` 或经批准的等效文件）。
- 保持 **不引入** `npm run verify` 回归；每次变更文书或流程后，在可自动化侧运行 `npm run verify`。
- **不包含**：新动效/新组件/Modal 材质化大改（该等属 Phase 22）；除非发现**阻断级数据丢失**的 bug 需 hotfix，否则本相不改业务逻辑。

**不在此相争论「是否做 GLASS 推迟项」** — 已写入 REQUIREMENTS 的后续相位。

</domain>

<decisions>
## Implementation Decisions

### D-21-01 — UAT-01 / DATA-02 的「完成」判据

- **D-21-01a:** `DATA-02-SMOKE.md` 的 `Result:` 允许两种终态：**PASS**（手测走通 Kill protocol）或 **BLOCKED**（须含 **更新日期、设备/环境、阻塞原因**；与 ROADMAP Success criteria 一致）。不得无限期留空 `Result:` 而无说明。
- **D-21-01b:** Kill 协议以该文件现文为准；**停 Metro 不算杀进程**。真机用 App Switcher 划掉，或文档所列替代路径二选一，并在 Environment 区注明。
- **D-21-01c:** 可选 **Simulator** 时，可辅以文档中的 SQLite 检查句；**不得**用「仅 CI」冒充设备杀进程完成。

### D-21-02 — UAT-02 / UAT-03 / UAT-04 与 11-VERIFICATION

- **D-21-02a:** **THEME-01、A11Y-01、LG-01** 的 Done 以 `11-VERIFICATION` 中**对应 checklist 可勾选**为准；条目与 Phase 11 现文一致，不另起炉灶验收表。
- **D-21-02b:** **「Signed / 等效记录」** 指：在 `11-VERIFICATION` 的 **Sign-off**（或经 PROJECT 同意迁移到的单一追踪文件）中具备：**执行人、日期**；各小节 hand-test 有 **可核验的简要见证**（例如「在 iOS 18.4 / 深色 下主路径可完成记一笔」）。**单人维护者自签**可接受，**无需**第二审批人，除非之后章程变更。
- **D-21-02c:** 若需 **延期** 某子项，须在 **同一文件** 中写明「延期到 / 原因」，避免静默缺口。

### D-21-03 — 自动化与范围

- **D-21-03a:** 本相默认**无**新 E2E 设备农场；`npm run verify` 为**每轮文书或脚本变更**后的必跑门（若只读手测、未改仓，不强制重复）。
- **D-21-03b:** `REQUIREMENTS.md` 追溯表 Phase 21 行：UAT-01～04 可标 **Done**；若受依赖阻塞可标 **Blocked+理由**（与上列判据自洽），不得留「Pending」而不说明原因。

### D-21-04 — 与 Phase 22 的边界

- **D-21-04a:** **GLASS-01、GLASS-02** 明确 **不在** Phase 21；讨论中如提出「顺手做 Modal 材质化」，**记入 Deferred**，由 Phase 22 承接（见 `REQUIREMENTS.md`）。

### Claude's Discretion

- 手测**步骤截图**或 **HUMAN-UAT** 附属文件的命名/编号（只要可追溯至同一 commit / 日期）。
- `11-VERIFICATION` 中「Accepted deviations」行表填写格式与措辞润色，只要不弱化清单语义。
- 将分散在 STATE 的结转句与 Phase 11/10 文件**交叉引用**的句子级编辑。

</decisions>

<specifics>
## Specific Ideas

- 测试识别串可用现有 `DATA-02-SMOKE` 中约定（如 `DATA02-*` 格式）；若重跑，维护者在同一文件 `Test data` 区**更新串与日期**以免脏数据混检。
- LG-01 的 3 秒滚动 / 3 次 Tab 等 **spot-check 时长**为**最低建议**，可略延长但须记录若结果依赖时长。

**若无额外产品愿景：** 以 `REQUIREMENTS.md` 与本 Context 为权威。

</specifics>

<canonical_refs>
## Canonical References

**实施与审阅前必读：**

### 验证与追溯
- `.planning/REQUIREMENTS.md` — v3.1 中 UAT-01～04 全文与 Traceability 表
- `.planning/phases/10-persist-uat/DATA-02-SMOKE.md` — DATA-02 Kill protocol、`Result:`
- `.planning/phases/11-chrome-depth/11-VERIFICATION.md` — THEME / A11Y / LG-01 与 Sign-off

### 状态与路线
- `.planning/STATE.md` — Blockers、Deferred 结转
- ROADMAP 中 **Phase 21: 验证闭合（smoke-uat-close）** — Success criteria 四行（以仓库最新 ROADMAP 为准）

[若 ROADMAP 中「当前焦点」与 Phase 表冲突，以 **Phase 小节表格 + REQUIREMENTS** 为优先。]

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `npm run verify` — 回归门；本相变更文书的 PR 前必绿。
- 无新代码复用点 — 以 **手测 + Markdown** 为主。

### Established Patterns
- 结转问题历史上与 **DATA-02 BLOCKED**、**11-VERIFICATION 手测未签** 绑定；本相专门收口。

### Integration Points
- 更新 `REQUIREMENTS.md` Traceability 行 **Status** 时，与上述文件 `Result:` / Sign-off 同步，避免表与文件漂移。

</code_context>

<deferred>
## Deferred Ideas

- **GLASS-01 / GLASS-02**（Modal 材质化、GlassShimmer + FAB/CTA）— **Phase 22**，见 `REQUIREMENTS.md`。
- 更大范围 **动画/动效** 增强 — 不属本相；见各期 `*-VERIFICATION` 推迟表。

[若无更多：**None beyond GLASS-01/02**]

</deferred>

---

*Phase: 21-smoke-uat-close*  
*Context gathered: 2026-04-24 — `gsd-discuss-phase 21`（以 REQUIREMENTS/ROADMAP/既有验收文件为据归并灰区）*
