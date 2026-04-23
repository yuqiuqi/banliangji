# Phase 7: 图表 高规格表现层（v2）- Context

**Gathered:** 2026-04-22  
**Status:** Ready for planning  

<domain>
## Phase Boundary

在 **Phase 3 已锁定的图表数据语义**（CHART-01/02：仅支出、周/月/年区间与 `chartAggregate` / `billRepo` 一致）之上，对 **图表 Tab 内部** 做 **图表精致化向表现层**：柱/条视觉、**可感知**区间切换与空态、分类列表与标签层次，使可读性与信息密度达到 **`07-UI-SPEC` / 半两记图表合同** — **非**第三方像素级抄屏、**不**改聚合函数签名或区间定义。

**本 phase 主战场：** `src/screens/ChartScreen.tsx` 内 **数据可视化区、周期 chips、主卡片内图表区、分类列表行**；**禁止** 修改 `src/chart/chartAggregate.ts` 中导出函数的语义（可与 Phase 3 单测对照回归）。

**不在本 phase：** 新聚合维度、联网、替换 SQLite、引入第三方原生 UI 框架、Phase 6 已完成的 **壳层分段器** 大规模重做（仅可在表现层需要时微调样式且不改导航结构）。

</domain>

<decisions>
## Implementation Decisions

### 动效与技术栈（延续 Phase 6）
- **D-07-M01:** **默认不新增** `react-native-reanimated`。图表柱高变化、区间切换主路径使用 RN **`Animated`**（`timing` / `Value`）或短促 **`LayoutAnimation`**；与 `06-CONTEXT` D-M01 一致。
- **D-07-M02:** 周/月/年 **周期条（横向 chips）** 切换：推荐 **opacity 淡入淡出**（约 150–250ms）或轻 `translateY`，**不**引入 `PagerView` 全屏滑动作为默认方案。
- **D-07-M03:** **禁止** 为动效关闭 TypeScript 严格性或滥用 `any`。

### 柱 / 条视觉（图表精致化向、无新重型依赖）
- **D-07-V01:** 柱条 **圆角顶**（与现 `styles.bar` 一致方向，可略增 `borderRadius`）；**填充色** 仅来自 `src/theme/colors.ts`（如 `title` / `main` / `body` 语义）— **不** 为渐变默认新增 `expo-linear-gradient`；若日后产品强要求渐变，单独立项再引入依赖。
- **D-07-V02:** **柱间留白** 可微调（`marginHorizontal` / `bar` 宽度）以提高可读性；**最大柱高区** 保持与现逻辑一致（归一化到 `maxAmount`）。
- **D-07-V03:** **选中周期 chip** 与 **分段器** 已在 Phase 6 处理；Phase 7 仅当 **图表区内** 动效需要时与之协调色与圆角，不推翻 Phase 6 令牌。

### 分类列表与标签层次
- **D-07-L01:** 分类列表 **仍在主卡片下方**（现 `categories.map` 区域）；优化 **行距、字号阶梯、进度条高度/圆角**，与 `02-UI-SPEC` 字重层次一致。
- **D-07-L02:** **金额右对齐**、**类别名** 为主眼；占比条为辅助 — 信息密度 **↑** 但不挤成不可读。

### 空态与文案
- **D-07-E01:** 空态以 **Clay 文案 + 可选 `MaterialCommunityIcons`** 为主；**不** 引入重型插画资源包。
- **D-07-E02:** 「无支出」与「切换区间」提示 **分工明确**：避免与 Phase 3 已交付文案冲突，可在 `07-UI-SPEC` 逐条写死最终字符串供 PLAN 勾选。

### 验收与对标
- **D-07-Q01:** **数字一致性**：任意数据集下周/月/年切换，**总额与分类合计** 与 Phase 3 行为一致（以现有单测 + `npm run verify` 为门禁）。
- **D-07-Q02:** **产品认可**：以 `07-UI-SPEC.md` + `06-VERIFICATION` 式手工 UAT 清单勾选「图表精致化向」**可接受**；不追求与外部演示逐帧一致。

### Claude's Discretion
- `Animated` 与 `LayoutAnimation` 在具体柱动画上的 **择一或组合**；`Easing` 曲线与 **stagger** 是否值得为分类列表做轻量延迟。
- 是否将柱条抽成 **小函数组件**（同文件或 `src/components/chart/`）以控制重渲染 — 不强制文件数上限。

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 需求与路线
- `.planning/ROADMAP.md` — Phase 7 Goal、Success Criteria、Plans 07-01 / 07-02  
- `.planning/REQUIREMENTS.md` — **REF-03**, CHART-01, CHART-02  
- `.planning/STATE.md` — 当前里程碑位置  

### Phase 锁定上下文
- `.planning/phases/03-chart-consistency/03-CONTEXT.md` — 支出口径、区间语义；`chartAggregate` / `ChartScreen` 锚点  
- `.planning/phases/06-ui-v2/06-CONTEXT.md` — Phase 6/7 分工、无 Reanimated 默认  
- `.planning/phases/06-ui-v2/06-UI-SPEC.md` — Clay 按压与壳层（图表 **内** 归 Phase 7）  

### 实现锚点
- `src/chart/chartAggregate.ts` — **只读**；禁止改聚合语义  
- `src/chart/chartAggregate.test.ts` — 回归基准  
- `src/screens/ChartScreen.tsx` — 本 phase 主修改面  
- `src/theme/colors.ts`, `src/theme/layout.ts` — 令牌单一来源  
- `.planning/research/V2-CAPABILITY-BLUEPRINT.md` — v2 能力蓝图（只读）  

### 本 phase UI 契约
- `.planning/phases/07-chart-polish-v2/07-UI-SPEC.md` — 图表表现层增量  

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ChartScreen` 已具备：`granularity` state、`periods` / `points` / `categories`、`styles.bar` / `barRow`、Clay 色与 `hairlineBorder`  
- `chartAggregate.ts`：`chartPointsWeekOrMonth`, `chartPointsYear`, `aggregateExpenseByCategory` — Phase 7 **调用方不变**  

### Established Patterns
- Phase 6：`pressedOpacity`、`radii.chip`、`shadows.raised` 已用于壳层；Phase 7 **向内** 深化柱与列表  
- 质量门禁：`npm run verify`  

### Integration Points
- `useBillsRefresh` → `generation` 驱动 `queryAllBills`；动画不得破坏依赖数组与 memo 语义  
- **当前实现锚点（再验 `ChartScreen.tsx`）：** 顶部分段 `segBar`（`granularity`）、**横向** `ScrollView` 周期 chips（`periodIndex`）、主图区 `styles.chartRow` + `bar` / `barOn` 归一化高度 `*(120 / maxAmount)` 且 **最小 4px**；`chartEmpty` 与列表空态 `emptyWrap` 文案分路。

</code_context>

<specifics>
## Specific Ideas

- 市面记账类产品的 **通识信息结构** 仅作启发；**像素级规格** 以本仓库 `UI-SPEC` 与验收表为准。  

</specifics>

<deferred>
## Deferred Ideas

- **柱状渐变 / 多色渐变填充** — 若坚持要渐变，评估 `expo-linear-gradient` 依赖与包体，单列 Phase 7 后小步或 backlog。  
- **图表导出 / 分享图片** — 新能力，非 Phase 7。  

**None — discussion stayed within phase scope** for other items.

</deferred>

---

*Phase: 07-chart-polish-v2*  
*Context gathered: 2026-04-22 via `/gsd-discuss-phase 7 --auto --analyze`*  
