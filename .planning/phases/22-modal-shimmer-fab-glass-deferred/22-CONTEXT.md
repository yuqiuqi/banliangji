# Phase 22: Modal 材质化与 Shimmer/FAB（glass-deferred）- Context

**Gathered:** 2026-04-24  
**Status:** Ready for planning  
**Milestone:** v3.1 — 验证闭合与 Liquid Glass 纵深收尾

<domain>
## Phase Boundary

落实 **GLASS-01 / GLASS-02**（`.planning/REQUIREMENTS.md`）：

- **GLASS-01：** 在 **预算 / 资产** 等使用 React Native **`Modal`** 的进出场，用 **`useMaterialize`**（`src/hooks/useMaterialize.ts`）协调 **opacity + scale + blurIntensity**，替代仅靠 `animationType="fade"`；**Reduce Motion** 须走 `useReduceMotion` 已有降级路径。
- **GLASS-02：** 在 **`Fab`**（`src/components/ios/Fab.tsx`）上集成 **`GlassShimmer`**（`src/components/ios/GlassShimmer.tsx`），主路径可点、**`accessibilityLabel` 等行为保留**；可按需增加 **一处主路径 CTA**（须与 Fab 不重复、不降低热区与对比度）。

**不在本相：** 陀螺仪高光、Skia 柱图、Tab 动态收缩、云同步、Phase 21 未闭合的 UAT 手测本身（可并行开发，但不靠本相「代签」）。

**依赖说明：** ROADMAP 写「默认先 21 再 22 降回归」；若 **PROJECT/团队** 接受并行，本相仍可开工，但 **`npm run verify` 与回归**由执行者负责。

</domain>

<decisions>
## Implementation Decisions

### D-22-01 — Modal 范围与优先级

- **D-22-01a:** **必做：** `BudgetScreen.tsx`、`AssetScreen.tsx` 内各自 `Modal`（当前 `animationType="fade"` + `transparent`）。  
- **D-22-01b:** **选做（第二波）：** `HomeScreen.tsx` 月份选择 `Modal` — 仅当与预算/资产同一套 `useMaterialize` 包装成本可控时纳入；否则记入 `22-VERIFICATION` 的 **Deferred** 并指向后续小相或 backlog，**不阻塞** GLASS-01 对预算/资产的 Done。

### D-22-02 — useMaterialize 与 Blur 的接线

- **D-22-02a:** `useMaterialize` 返回的 **`blurIntensity`** 须有 **消费方**（例如与 `GlassEffectContainer` / `BlurView` 或现有玻璃层绑定的 Reanimated `useAnimatedProps`），禁止仅改 opacity/scale 却令 `blurIntensity` 恒为 0 的「假材质化」。
- **D-22-02b:** `materialize` / `dematerialize` 与 **`Modal` `visible`** 同步：打开时 `materialize`，关闭时 `dematerialize`；避免未卸载时残留 shared value。
- **D-22-02c:** 与 v1.2 **§3.12 E3** 叙事一致即可；若 RN 侧用近似（非真 CA filter），在 `22-VERIFICATION` 记 **Accepted deviation** 一句。

### D-22-03 — GlassShimmer + Fab

- **D-22-03a:** **默认行为：** 在 **按压链路** 上短暂触发 `GlassShimmer`（例如 `pressIn` 或一次「激活」窗口），**不得** 永久全屏挡点击；`width`/`height` 与 **`fabSize`**（`src/theme/layout.ts`）一致或略小一圈，保持可视「光盘」不挡 icon。
- **D-22-03b:** **Reduce Motion：** 依 `GlassShimmer` 内既有逻辑（不跑位移、仅淡入淡出）— **不** 新增与 `useReduceMotion` 冲突的旁路。
- **D-22-03c:** **可选 CTA：** 仅当与日历 `Fab` 主路径不重复时，在 **CreateBill / 主链保存** 等选一处处 `SpringPressable` 加 shimmer；**未选做** 则仅 **Fab** 即满足 GLASS-02 字面。

### D-22-04 — 验证与需求追溯

- **D-22-04a:** 本相落 **`22-VERIFICATION.md`**（或等效名），含：覆盖的 Modal 文件列表、Fab 上 Shimmer 触发条件、`npm run verify` 与关键截图/动效**文字描述**（无强制截图入库）。
- **D-22-04b:** `REQUIREMENTS.md` 中 **GLASS-01 / GLASS-02** 在相末可标 Done（或 Blocked+理由），与 `22-VERIFICATION` 一致。

### Claude's Discretion

- `useMaterialize` 与 `Modal` 子树内 **Reanimated 动画组件** 的具体层级（`Animated.View` 包壳顺序、`pointerEvents`）。
- **Home** 月份 Modal 是否进第一波：由实装中复杂度 **≤1 个 PR 可控** 则纳入，否则走 D-22-01b Deferred。

</decisions>

<specifics>
## Specific Ideas

- 设计权威：`.planning/IOS26-DESIGN-GUIDE.md` v1.2 **§3.9 Shimmer、§3.12 Materialize**；动效常量以 `src/theme/motion.ts` 为准，避免硬编 magic number（除非与现有 tier 一致）。
- `Fab` 当前使用 `SpringPressable` + 实心 `colors.accent` 圆片 — Shimmer 宜为 **叠加层**，勿替代整个 disc 的底色以致对比度不足。

[无更多产品方主观陈述 — 以 ROADMAP Success criteria 为准。]

</specifics>

<canonical_refs>
## Canonical References

- `.planning/REQUIREMENTS.md` — **GLASS-01、GLASS-02**
- `.planning/ROADMAP.md` — **Phase 22** 表（Goal、Success criteria、Depends on）
- `.planning/phases/20-ui-polish/20-VERIFICATION.md` — 推迟项（Materialize / GlassShimmer→FAB 来源）
- `.planning/IOS26-DESIGN-GUIDE.md` v1.2 — §3.9、§3.12
- `src/hooks/useMaterialize.ts` — 已实现 API
- `src/components/ios/GlassShimmer.tsx` — 已实现 `active` 与 RM 降级
- `src/components/ios/Fab.tsx` — 集成点
- `src/screens/BudgetScreen.tsx`、`src/screens/AssetScreen.tsx` — 必做 Modal
- `src/hooks/useReduceMotion.ts` — 降级

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`useMaterialize`**：已提供 `materialize` / `dematerialize` 与 `opacity` / `scale` / `blurIntensity` shared values。
- **`GlassShimmer`**：需 `active` + 尺寸；适合薄叠加层。
- **`Fab`**：`fabSize` / `SpringPressable`；接入 Shimmer 时保持 `accessibilityLabel`。

### Established Patterns
- 预算/资产 Modal：`transparent` + 内层卡片 + 关闭按钮；尚未接 `useMaterialize`。

### Integration Points
- 可能需将 Modal 子内容包在可应用 **Reanimated 动画样式** 的容器上，并与 `BlurView` 或设计允许的玻璃层结合。

</code_context>

<deferred>
## Deferred Ideas

- **HomeScreen** 月份 `Modal`（D-22-01b）— 视第二波或 backlog。
- **陀螺仪 / Skia 柱图** — 仍属 `20-VERIFICATION` 与 Future，**不**进 Phase 22。

</deferred>

---

*Phase: 22-modal-shimmer-fab-glass-deferred*  
*Context: 2026-04-24 — ROADMAP + REQUIREMENTS + 代码库扫描，无 TUI 交互收束灰区。*
