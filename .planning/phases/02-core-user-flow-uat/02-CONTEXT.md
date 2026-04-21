# Phase 2: 核心用户流程 UAT - Context

**Gathered:** 2026-04-21  
**Status:** Ready for planning  

<domain>
## Phase Boundary

按 `ROADMAP.md`，本阶段交付 **主路径无阻塞缺陷**：新用户能在约 3 分钟内完成「记一笔 → 明细 → 日历 → 详情编辑/删除」；记录问题单并修复 P0/P1；复测并留下简要 UAT 记录。**不**新增产品能力（无新功能 phase），仅澄清现有流程上的交互、布局与视觉在 RN 上的实现方式。

用户在本轮讨论中明确要求：**修改 UI**，且产品视觉方向已倾向 **Clay 风格**（见根目录 `DESIGN.md` 与已落地的 `src/theme/colors.ts`）。因此 Phase 2 的「HOW」包含：**在走查与修复缺陷的同时，将各主路径屏幕的组件样式向 Clay 规范收敛**（圆角、燕麦边框、卡片层级、按压反馈等），**不得**以「换肤」为由推迟或掩盖功能性 P0/P1。

</domain>

<decisions>
## Implementation Decisions

### UI 方向（Clay / DESIGN.md）
- **D-01:** Phase 2 内所有 **FEAT 主路径涉及屏幕**（明细 `HomeScreen`、记一笔 `CreateBillScreen`、详情 `BillDetailScreen`、日历 `CalendarScreen`；Tab 壳层与 `RootNavigator` 已在 Phase 1 后配色对齐）应在本次迭代中 **可感知地** 应用 Clay：`DESIGN.md` 中的 **圆角刻度**（卡片/列表行优先 12px 量级；大块容器可向 24px 过渡）、**燕麦色边框**（`#dad4c8` 或主题中等价 token）、**暖奶油画布**（已与 `colors.canvas` 一致）、列表行/卡片 **白底浮在 cream 上** 的层次；阴影采用 RN 可实现的 **轻量多层或单影近似**（不必 1:1 复刻 Web 的 inset 组合，但需比纯扁平更有「Clay Shadow」感）。
- **D-02:** **不强制** 在 Phase 2 引入 **Roobert** 字体或完整 OpenType stylistic sets（Expo 字体接入可作为后续独立任务）；正文继续系统默认栈，仅通过字重/字号层次贴近 DESIGN 的 600/500/400 规则。
- **D-03:** **不强制** 实现 Clay 官网级 **hover 旋转 + translateY + 硬偏移阴影**；以 **Pressable 缩放/透明度/轻微 translate** 作为移动端等价「俏皮反馈」。若某组件实现成本过高，记入问题单并 **defer** 到 Phase 4 体验打磨，但须在 CONTEXT / UAT 中写明。
- **D-04:** 图表 Tab（`ChartScreen`）属主路径之一：在走查中一并做 **Clay 化卡片与分段控件**，但 **不改变** Phase 3 才严格验收的聚合语义；若仅样式调整，归 Phase 2；若涉及聚合逻辑，仅记缺陷、**不**在本 phase 改算法（与 Phase 3 边界一致）。

### UAT 与缺陷优先级
- **D-05:** 执行顺序：**02-01 走查列问题 → 02-02 先修 P0/P1 功能与导航 → 02-03 复测**；UI/Clay 收敛与缺陷修复 **同一波提交可交错**，但 **崩溃、阻塞流程、错误数据** 永远优先于纯视觉。
- **D-06:** UAT 记录格式：**Markdown 表格或编号列表** 即可（路径、步骤、预期、实际、严重级别、关联 commit/PR）；**不**强制新工具，与 Phase 1「文档 + 手工」文化一致。

### 与参考 Swift 的关系
- **D-07:** 流程与信息架构仍以 **Swift 参考 App** 为「流程等价」对照；**视觉**以 **Clay + 当前 RN 实现** 为准，**不**要求像素级复刻 UIKit（与 `PROJECT.md` Out of Scope 一致）。

### Claude's Discretion
- 各屏幕上 **具体** 圆角数值（10–16px 区间微调）、分隔线用 `hairlineWidth` 还是 1px 实线、阴影在 Android/iOS 上的统一写法。
- 空态/加载态文案与插图级别（文字空态即可，无需插画）。
- 问题单模板字段的极简列集。

</decisions>

<specifics>
## Specific Ideas

- 用户明确偏好 **getdesign Clay** 系 UI；项目已安装 **`DESIGN.md`**（`npx getdesign@latest add clay`）且 **`src/theme/colors.ts`** 已切到暖奶油 + 柠檬金 + Matcha 点缀。
- 本轮口令 **「修改 UI」** 解释为：Phase 2 在 UAT 修复之外，**主动推进 Clay 视觉而不仅是配色**。

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 设计系统
- `DESIGN.md` — Clay 圆角、边框、阴影、字重层级、色板角色（项目根）
- `src/theme/colors.ts` — 已落地颜色令牌

### 规划与需求
- `.planning/PROJECT.md` — 产品边界、Core Value、Out of Scope
- `.planning/ROADMAP.md` — Phase 2 Goal、Success Criteria、Plans 02-01…03
- `.planning/REQUIREMENTS.md` — FEAT-01 … FEAT-05

### 前序阶段
- `.planning/phases/01-data-layer-baseline/01-CONTEXT.md` — 数据与时间语义等已锁定决策
- `.planning/phases/01-data-layer-baseline/01-01-AUDIT.md` — 持久化字段与查询语义（调试时对照）

### 参考实现（流程，只读）
- `../SwiftCost/TestSwiftDemo/` — 原版流程与信息架构对照（路径相对工作区上级 `SwiftCost`）

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/theme/colors.ts` — 单一颜色源；可扩展 `radii` / `shadows` 对象供 Clay 化（由实现者决定）
- `src/components/CategoryIcon.tsx`、`BillCalculator.tsx` — 记一笔与列表共用
- `src/navigation/RootNavigator.tsx` — Tab + Stack；主题色与 `contentStyle` 已接 `canvas`

### Established Patterns
- 各 `Screen` 使用 `StyleSheet.create` + `colors.*`；改 UI 时应 **集中新增主题常量** 避免魔法数散落
- `SafeAreaView` + 各屏 `header`/`banner` 分区已存在，适合套卡片圆角与分隔

### Integration Points
- `BillsRefreshProvider`、`billRepo` — 走查与修复时需保证刷新与导航参数不变
- FEAT 覆盖屏幕：`HomeScreen.tsx`、`CreateBillScreen.tsx`、`BillDetailScreen.tsx`、`CalendarScreen.tsx`；`ChartScreen.tsx`、`MineScreen.tsx` 参与 Tab 一致性与 Clay 化

</code_context>

<deferred>
## Deferred Ideas

- **全量 Roobert + OpenType ss*** 字体包接入与全局 `Text` 封装
- **Web 级 hover 倾斜 + 硬阴影** 的完整复刻
- **图表聚合逻辑** 的深度校验与单测（Phase 3）
- **主题切换 / 深色模式**（未在 v1 范围则保持 out of scope）

</deferred>

---

*Phase: 02-core-user-flow-uat*  
*Context gathered: 2026-04-21*
