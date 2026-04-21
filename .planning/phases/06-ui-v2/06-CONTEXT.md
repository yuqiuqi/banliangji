# Phase 6: 全局 UI 与动效精研（v2）- Context

**Gathered:** 2026-04-21  
**Status:** Ready for planning  

<domain>
## Phase Boundary

在 **Clay + 现有 RN 实现** 上满足 **REF-04**：统一关键屏的 **按压反馈、列表/卡片层次、信息密度方向**（对齐 SharkBook README 所表达的「精美度」方向，**非** Qt 像素级复刻）。交付 **UI-SPEC v2 增量** + **逐屏实现对照**；**不**替代 Phase 7 对 **图表内部**（柱形、图例、周月年切换动效）的深度表现层验收。

**本 phase 覆盖的关键屏（与 ROADMAP 一致）：** 明细（`HomeScreen`）、记一笔（`CreateBillScreen`）、**图表 Tab 外壳与现有控件**（`ChartScreen` 的 **壳层/分段/卡片**，图表 **主体数据可视化** 的 Shark 向精研归 **Phase 7**）、预算（`BudgetScreen`）、资产（`AssetScreen`）。**「我的」** 不在 REF-04 列举内：仅做 **令牌对齐**（色/圆角/按压若可复用），不单独开 Shark 向改版任务。

**不在本 phase：** 新业务功能、联网能力、引入 Qt、替换 SQLite；**不默认** 引入重型动效依赖（见下）。

</domain>

<decisions>
## Implementation Decisions

### 与 Phase 7 的界面分工
- **D-P7-01:** **Phase 6** 负责 **全局一致** 的 Clay 层次、列表行、卡片、顶区/汇总条、**可感知** 按压与轻过渡。**Phase 7** 负责 **图表 Tab 内** 布局密度、柱/条/空态动效、图例与周月年切换的 **Shark 向** 专项（见 ROADMAP Phase 7 / REF-03）。Phase 6 修改 `ChartScreen` 时 **允许** 调整 **分段器、卡片容器、标题区、列表行**；**避免** 重写聚合与数据层逻辑（CHART-01/02 已由 Phase 3 锁定）。
- **D-P7-02:** 若 Phase 6 需动图表区 **非结构性** 样式（字号、间距、色），须 **不改变** 数据绑定与区间语义；存疑处对照 `03-CONTEXT.md` / `chartAggregate.ts`。

### 动效与技术栈
- **D-M01:** 当前 `package.json` **无** `react-native-reanimated`。**默认不新增** Reanimated；动效以 **`Pressable` 状态样式**（`opacity` / `scale` / 轻 `translateY`）与 React Native **`Animated` / `LayoutAnimation`**（按需）为主，成本与风险可控。
- **D-M02:** **Modal/Stack** 沿用 React Navigation / RN 默认转场；不强制自定义共享元素过渡。
- **D-M03:** 所有可点列表行、主按钮、Tab 图标态须有 **可感知反馈**（视觉 ≥100ms 级变化即可），满足 REF-04「统一按压」精神，**不**要求 Web Clay 级 hover 旋转 + 硬阴影。

### 设计令牌（Design tokens）
- **D-T01:** 在 `src/theme/layout.ts`（或新增 `src/theme/motion.ts`，由实现定）**扩展** 文档化常量：`pressedOpacity`、`pressScale`、可选 `durationMs`；**阴影/圆角** 在现有 `radii` / `shadows` 上 **增量**（如 `shadows.raised`、`radii.chip`），与 `DESIGN.md` / `02-UI-SPEC.md` 不冲突。
- **D-T02:** **颜色** 仍以 `src/theme/colors.ts` 为单一来源；新增语义色（如 section strip）须 **命名 token**，禁止散落魔法色（除已存在的 destructive 红等）。

### UI-SPEC 工件
- **D-U01:** 在 `.planning/phases/06-ui-v2/` 交付 **`06-UI-SPEC.md`**（或等价命名），作为 **`02-UI-SPEC.md` / `05-UI-SPEC.md` 的增量**：逐屏列出 **布局焦点、间距档位、按压规则、壳层结构**；并含 **实现对照清单**（供 06-02 PLAN 勾选）。
- **D-U02:** **Typography** 维持 Phase 2 结论：系统字体 + 字重层次；**不**在 Phase 6 强制接入 Roobert。

### 回归与质量
- **D-Q01:** 改版后 **`npm run verify`**（typecheck + lint + test）必须保持绿；**不**为动效关闭 `eslint` 规则或引入 `any`。

### Claude's Discretion
- 各屏 **具体** 圆角档位（10–16px）、列表分隔策略（hairline vs 间距）、**Animated** 与 **LayoutAnimation** 择一或混用的细节。
- 预算/资产屏与明细屏 **组件复用**（如统一 `ScreenHeader`、`ListRow`）的抽取粒度。

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 需求与路线
- `.planning/ROADMAP.md` — Phase 6 Goal、Success Criteria、Plans 06-01 / 06-02；**Phase 7** 与图表表现层边界
- `.planning/REQUIREMENTS.md` — **REF-04**
- `.planning/research/SHARKBOOK-SUMMARY.md` — 体验参考（只读）
- `.planning/PROJECT.md` — Core Value、Clay 方向

### 既有 UI 契约
- `.planning/phases/02-core-user-flow-uat/02-UI-SPEC.md` — Clay RN 主路径基线
- `.planning/phases/02-core-user-flow-uat/02-CONTEXT.md` — Clay 决策
- `.planning/phases/05-mvp-v2/05-UI-SPEC.md` — 预算/资产屏
- `DESIGN.md` — getdesign Clay 文案参考

### 实现锚点
- `src/theme/colors.ts`、`src/theme/layout.ts`
- `src/navigation/RootNavigator.tsx` — Tab / Stack 壳层
- `src/screens/HomeScreen.tsx`、`CreateBillScreen.tsx`、`BillDetailScreen.tsx`、`CalendarScreen.tsx`
- `src/screens/ChartScreen.tsx`、`BudgetScreen.tsx`、`AssetScreen.tsx`
- `.planning/phases/03-chart-consistency/03-CONTEXT.md` — 图表数据语义

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `hairlineBorder`、`radii.card`、`shadows.card` — 已广泛用于 `MineScreen`、`ChartScreen`、预算/资产
- `BillsRefreshProvider` — 明细/图表刷新一代；改版时勿破坏

### Established Patterns
- 各屏 `SafeAreaView` + 顶区 `colors.main` 或 canvas 背景
- `Pressable` + `pressed ? { opacity: 0.96 }` 等 — Phase 6 应 **统一** 为 token 化规则

### Integration Points
- 记一笔、日历为 **Modal Stack**；动效改版须注意 **presentation: modal** 行为
- 五 Tab 顺序已固定；TabBar 样式在 `RootNavigator` `screenOptions`

</code_context>

<specifics>
## Specific Ideas

- SharkBook：**信息密度 + 层次** 优先于 **动效炫技**；离线 App 以 **可维护、可验证** 为先。

</specifics>

<deferred>
## Deferred Ideas

- **图表内部** Shark 级表现（柱、图例、切换动效）— **Phase 7 / REF-03**
- **Roobert 字体**、Reanimated 复杂编排 — 非本 phase 默认
- **「我的」** 独立产品级改版 — 非 REF-04 必达；仅 token 对齐

</deferred>

---

*Phase: 06-ui-v2*  
*Context gathered: 2026-04-21*
