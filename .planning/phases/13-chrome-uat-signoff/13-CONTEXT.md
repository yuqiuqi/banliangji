# Phase 13: chrome-uat-signoff — Context

**Gathered:** 2026-04-23  
**Status:** Ready for planning  
**Mode:** `[auto]` + `[analyze]` — 灰区全选；选项取 **与 Tier-1 / 官方 Liquid Glass 原则一致** 的推荐路径（见各条 **Trade-off**）。

<domain>
## Phase Boundary

**v2.4 / Phase 13**（见 `ROADMAP.md`）：**LG-02** — **图表、预算、资产、我的** 四屏在 **色彩、透明度/材质、动效、交互** 上与 **iOS / iPadOS 26 Chrome + Liquid Glass** 及仓库 **`UI-SPEC.md` / `DESIGN.md` / `11-MATERIAL-MOTION-SPEC.md`** 系统性一致；**结转** **DATA-02**、**THEME-01**、**A11Y-01**、**LG-01** 的验收与文档。**不**新增业务功能；**不**引入网络能力。

本阶段讨论仅澄清 **如何实现** 上述已锁定范围，不扩张新能力。

</domain>

<decisions>
## Implementation Decisions

### D13 — 副路径改造策略（灰区：一刀切 vs 分屏）

- **Trade-off:** 四屏同 PR 风险高、难审；逐屏合并更易回滚，但周期略长。  
- **D13-01 [auto · recommended]:** **按屏顺序交付**：**Chart → Budget → Asset → Mine**；每屏合并后 `npm run verify` 绿，再下一屏。Chart 先定义 **Tier-2** 图表区材质与 chip/分段范式，后续屏复用。

### D13 — 与 Tier-1 的对齐方式（灰区：局部调色 vs 原语化）

- **Trade-off:** 仅改色快但易与 **Liquid Glass 层次**脱节；全面换 `src/components/ios/*` + 令牌工作量大但更一致。  
- **D13-02 [auto · recommended]:** **以组件原语 + 语义色为主**：四屏列表/卡片/顶区优先对齐 **`GroupedInset` / `ListRow` / 导航栈顶行为**（与 `HomeScreen` Tier-1 一致）；**禁止**新增裸 hex 作为长期方案（预算屏当前 `OVER_BUDGET_COLOR` 等须迁入 **palette / iosSemantic**）。

### D13 — Chart 周期选择 UI（灰区：三档 vs 双 SegmentedTwo）

- **Trade-off:** 产品需 **周/月/年** 三档；`SegmentedTwo` 仅两槽。  
- **D13-03 [auto · recommended]:** **保留三档 chip/行**，但 **视觉与动效** 须符合 `UI-SPEC` Tier-2 **chip/segment** 令牌（背景、边框、选态、**按压**），去除「厚灰方块」与 Tier-1 不符的 `shadows.card` 堆砌（按 `11-MATERIAL-MOTION-SPEC` 调整）。

### D13 — 动效栈（灰区：RN Animated vs Reanimated）

- **Trade-off:** 现 `ChartScreen` 等仍用 `Animated`；Tier-1 已引入 Reanimated 时，混用可接受但难统一弹簧参数。  
- **D13-04 [auto · recommended]:** **本 Phase 内新增或重写的过渡/显隐** 优先 **`react-native-reanimated`** + `11-MATERIAL-MOTION-SPEC` 参数；遗留 `Animated` 可在同屏重构时一并迁移，否则记入 **Accepted deviation**（单屏一条）。

### D13 — Sheet / Scrim（灰区：自定义 rgba vs 设计令牌）

- **Trade-off:** 硬编码 `rgba(0,0,0,0.35)` 快但不随深色/降低透明度适配。  
- **D13-05 [auto · recommended]:** Budget/Asset **Modal** 的 **backdrop / scrim** 与 **modal 卡片** 使用 **`UI-SPEC` / `layout` / palette** 中已有或新增的 **scrim、sheet** 令牌，与 `CreateBillScreen` Tier-1 行为对齐。

### D13 — 验收与环境（灰区：仅浅色模拟器 vs 全矩阵）

- **Trade-off:** 全矩阵耗时；用户明确要求与 **iOS 26** 一致。  
- **D13-06 [auto · recommended]:** 每屏至少在 **浅色 + 深色** 下 spot-check；**降低透明度** 对四屏各走主路径一次；结果写入 **`11-UAT.md` / `13-VERIFICATION.md`**（随 PLAN 创建）。**DATA-02** 仍独立以 `DATA-02-SMOKE.md` 为准。

### Claude's Discretion

- 具体 **弹簧曲线 ms、blur 强度数值**：在 `11-MATERIAL-MOTION-SPEC` 与 `expo-blur` 能力边界内由实现者微调，但须在 **VERIFICATION** 中可复述「为何如此」。
- **图表几何**（柱宽、留白）可在不改变数据语义下优化，以可读性优先。

</decisions>

<specifics>
## Specific Ideas

- 维护者明确：**图表、预算、资产、我的** 当前 **不符合** 核心 UI/UX；须与 **Apple OS 26** 在 **动画、透明度、交互、色彩** 上对齐。  
- 权威摘录链接：`.planning/research/IOS26-LIQUID-GLASS-REFERENCE.md`（Apple Developer Liquid Glass、HIG、**Hierarchy / Harmony / Consistency**）。

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 产品与设计契约

- `.planning/PROJECT.md` — v2.4 目标与范围  
- `.planning/REQUIREMENTS.md` — **LG-02** 与结转 REQ  
- `.planning/ROADMAP.md` — Phase 13 Success criteria  
- `UI-SPEC.md` — Tier-1/Tier-2 视觉与交互契约  
- `DESIGN.md` — 单一视觉来源（iOS 26 Chrome）  
- `.planning/phases/11-chrome-depth/11-MATERIAL-MOTION-SPEC.md` — 材质栈、动效栈、Tab/顶栏协同  
- `.planning/research/IOS26-LIQUID-GLASS-REFERENCE.md` — Apple 官方入口与原则摘录  

### 代码锚点（Tier-1 参考实现）

- `src/screens/HomeScreen.tsx` — `GroupedInset`、顶栏 chip、列表行范式  
- `src/components/ios/*` — 原语库  
- `src/theme/palette.ts` / `src/theme/colors.ts` / `ThemeContext` — 语义色唯一来源  

### 本阶段主要改动面（现状与 Tier-1 差距）

- `src/screens/ChartScreen.tsx` — 大量本地 `StyleSheet` + chip/card 阴影，**未**与 `GroupedInset` 列表主路径统一语感  
- `src/screens/BudgetScreen.tsx` / `src/screens/AssetScreen.tsx` — **实心 `colors.main` 顶栏** + 卡片 `shadows.grouped`，与 **Liquid Glass 分层顶栏** 不一致；**裸 hex** 警示色  
- `src/screens/MineScreen.tsx` — 已用 `GroupedInset`，但 **顶栏** 仍为实心块，需与 **栈/大标题** 范式对齐  

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- **`GroupedInset` / `ListRow` / `SegmentedTwo` / `Fab`**（`src/components/ios/`）— Tier-1 已验证；副路径应 **最大化复用**，减少一次性 `StyleSheet` 方块。  
- **`useAppTheme()` + `AppPalette`** — 全屏须统一；禁止长期 `OVER_BUDGET_COLOR = "#dc3545"` 这类 **逃逸令牌**。  
- **`HomeScreen`** — 顶栏 actions、列表 inset、按压 `pressedOpacity` / `pressScale` 模式可作为 **副路径顶栏与列表** 的对照。

### Established Patterns

- **语义色与深浅**：已由 Phase 11 锁定；副路径须 **消费同一套 token**，并在 **降低透明度** 下验证 **Blur / 降级填充**。  
- **阴影令牌**（`shadows.card` / `grouped` / `fluentButton`）— 须对照 `11-MATERIAL-MOTION-SPEC`：**Tier-2** 不应默认堆叠「重卡片」而破坏 **Hierarchy（内容优先）**。

### Integration Points

- **导航**：四屏位于 Tab 子栈；须与 **Tab 栏滚动收缩/展开**（若已实现）行为无冲突 — 见 `RootNavigator` / Phase 11 导航改动。  
- **Modal**：Budget/Asset 编辑流 — scrim/sheet 与 Tier-1 **记一笔 / Sheet** 一致。

</code_context>

<deferred>
## Deferred Ideas

- **像素级**复刻 Apple 私有实现或第三方 App 截图 — 显式 **Out of Scope**；仅 **Accepted deviation** 文档化。  
- **Android 专属** Material 动效 — 本里程碑以 **iOS 26** 为验收主轴；Android 不扩张 scope。

</deferred>

---

*Phase: 13-chrome-uat-signoff*  
*Context gathered: 2026-04-23 — `/gsd-discuss-phase 13 --auto --analyze`*
