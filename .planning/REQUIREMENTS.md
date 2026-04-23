# Requirements: 半两记

**Milestone:** **v2.4** — iOS 26 Chrome 副路径全量对齐（**Phase 13**）  
**Defined:** 2026-04-23（v2.3 条目保留为结转）  
**Core Value:** 离线「记一笔 → 明细/日历/图表即时一致」闭环稳定可靠；数据以 **本机存储** 为准。**本里程碑规划不纳入网络/云服务**（见 Out of Scope）。**视觉与交互**须以 **Apple iOS / iPadOS 26**（Liquid Glass、HIG：**Hierarchy / Harmony / Consistency**）与仓库 `UI-SPEC.md` / `DESIGN.md` 为锚点——**图表、预算、资产、我的** 不得长期偏离 Tier-1 已建立的 Chrome。

## v2.4 Requirements（本里程碑 · 新增）

### Liquid Glass · Tier-2 表面 (LG)

- [ ] **LG-02**: **副路径四屏**——**图表**（含周/月/年聚合与图表主路径）、**预算**、**资产**、**我的**——在 **色彩**（仅 `iosSemantic` / 设计令牌，禁止临时 hex 拼凑）、**透明度与材质分层**（与 `11-MATERIAL-MOTION-SPEC` Tier-2 及 `src/components/ios/*` 一致）、**动效**（导航/Sheet/列表滚动与 **Tab/顶栏协同** 若适用）、**交互**（按钮、列表行、分组、分段控件等）上与 **iOS 26 系统取向**一致；浅色与深色外观均验收。**无法**在 RN 复刻处须写入 **Accepted deviation** 表（链接到 `UI-SPEC.md` 或 Phase 13 `VERIFICATION`）。

## v2.3 Requirements（结转 · 仍有效直至勾选）

### 数据与持久化 (DATA)

- [ ] **DATA-02**: 用户在真机或模拟器上完成「记一笔 → 杀进程 → 冷启动」后，该条账单仍在明细/图表中可查；**执行步骤与结果**写入 Phase 文档或 `STATE` 可引用处（关闭 v2.2 未勾选项）。

### 质量与验收 (QA)

- [x] **QA-04**: `.planning/phases/08-*` / `09-*` 下 **UAT** 表中仍为 `pending` 的项，已逐项 **pass / skip（注明理由）/ 与 `09-VERIFICATION` 结论一致**；不存在与验证文档矛盾的「未处理 pending」。

### 系统外观与无障碍 (SYS)

- [ ] **THEME-01**: 在**系统深色外观**（或应用内若已有外观开关）下，关键屏（Tab、明细、记一笔、账单流、设置）使用语义色与对比度可接受，无大面积不可读文字或控件；与 `UI-SPEC.md` / `DESIGN.md` 的 dark 取向一致或可引用 Accepted deviation。
- [ ] **A11Y-01**: 当系统开启**降低透明度**（及同类辅助设置，以 iOS 设置为准）时，依赖 `BlurView`/毛玻璃的区域具备**可辨识的不透明或降级样式**（非空白、非不可点击），主路径仍可完成记一笔与查看明细。

### Liquid Glass 纵深与动效 (LG)

- [ ] **LG-01**: **动效、透明度层次与立体感** 在工程上向 **iOS 26 Liquid Glass 取向** 对齐（仅 **本机 UI**，不涉及网络）：遵循 `.planning/phases/11-chrome-depth/11-MATERIAL-MOTION-SPEC.md` 的 **材质分层** 与 **动效分层**；对 Tab 栏、主列表顶栏、记一笔 Dock/Sheet 等 **Tier-1** 表面验收；无法复刻处须 **Accepted deviation** 并说明设计原则（如 Lensing）与 RN/`expo-blur` 限制。

## Future（本里程碑不做）

- **SYNC-***：云同步、多设备（见 `PROJECT.md` Out of Scope）。
- **像素级**逐帧抄录任意第三方 App 或 Apple 未公开规格（除非记为 Accepted deviation）。

## Out of Scope

| Feature | Reason |
|---------|--------|
| 新业务能力（新报表类型、社交、账户体系） | v2.4 为 **表现层与 Chrome 对齐**，不扩张业务 |
| 替换 SQLite 或改动 `bill_list` 语义 | 仅验证与表现层；schema 变更另开里程碑 |
| **任何联网能力**（云同步、在线图库、远程配置、登录注册等） | 与产品 **本地存储核心** 不符 |

## Traceability

| Requirement | Phase | Status |
|---------------|-------|--------|
| **LG-02** | **Phase 13（v2.4）** | **Pending** — 代码 Wave 1 已合主干；**浅色/深色/降低透明度** 手测见 `13-VERIFICATION.md`（**P13-LG02-UAT**），补测通过后勾选本 REQ |
| DATA-02 | Phase 12（收口）/ v2.4 结转 | Blocked — 见 `.planning/phases/10-persist-uat/DATA-02-SMOKE.md`（`Result: BLOCKED`）；目标 **2026-05-01** 前设备补跑 |
| QA-04 | Phase 10 | Done |
| THEME-01 | Phase 13 | Pending |
| A11Y-01 | Phase 13 | Pending |
| LG-01 | Phase 13 | Pending |
