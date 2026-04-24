# Phase 19: iOS 26 UI 集成 - Context

**Gathered:** 2026-04-24
**Status:** Ready for execution
**Source:** 用户审计反馈 — Phase 17/18 资产零集成

<domain>
## Phase Boundary

把 Phase 17/18 的 12 件资产（`SpringPressable` / `GlassEffectContainer` / `GlassEffectUnion` / `VibrantText` / `GlassShimmer` / `useTouchRipple` / `useMaterialize` / `haptic.*` 等）**全仓集成**到各屏幕 UI，同时修正用户反馈的具体问题（截图所示 header "+" / filter 按压连带感）。

**3 Wave：**
- **19-01** Header 按钮标准化 — 新建 `HeaderIconButton` + 所有屏幕 headerRight/headerLeft 替换
- **19-02** 列表行 + 主 CTA + 触感 — 所有 `Pressable` 列表行换 `SpringPressable` + haptic
- **19-03** 玻璃 + 旧 token 清理 — 副路径卡片用玻璃、Modal 用 `useMaterialize`、移除 `pressedOpacity/pressScale`

**严格非目标：**
- ❌ 引入新屏幕 / 新路由
- ❌ 改 v1.2 设计宪法
- ❌ 本相位不集成 `useGyroHighlight`（P2 推迟 Phase 20）
</domain>

<decisions>
## Implementation Decisions

### D-P19-01 新建 `HeaderIconButton` 统一原语
在 `src/components/ios/HeaderIconButton.tsx` 建一个**顶栏专用**按钮组件，解决截图反馈的问题：
- **每个按钮独立 `SpringPressable` wrapper** —— 点 "+" 只有 "+" 动
- 内置 `hitSlop: 8`、`headerFabSize: 36` 默认
- 支持 `variant: "wash" | "accent"` 对应现有 `headerChipWash` / `headerChipAccent`
- 内置 `haptic.light` 或 `haptic.medium`（accent 变体自动 medium）

### D-P19-02 `pressedOpacity` / `pressScale` 彻底废弃
Wave 3 从 `src/theme/layout.ts` 移除这两个 token（已违反 v1.2 §19.6）。所有残留使用改为 `SpringPressable`。

### D-P19-03 触感默认值
- Header 主按钮（accent） → `haptic.medium` on pressIn
- Header 次按钮（wash） → `haptic.light`
- 列表行 → `haptic.light`
- 保存 / 创建成功 → `haptic.success`
- 删除确认 → `haptic.error`（Alert 确认前）
- 分段切换（SegmentedTwo） → `haptic.select`

### D-P19-04 玻璃应用范围（本相位最小）
- **Budget/Asset/Mine/BillDetail/Calendar 的 GroupedInset 内部卡片** —— 不做（保持实色，避免玻璃内嵌玻璃违反 §3.15 约束 4）
- **Modal / Sheet Scrim 背景** —— 保持现有 `colors.modalScrim` 实色
- **什么时候用？** 仅在 HeaderRight 按钮的**整体外层**（若视觉需要统一胶囊感）—— 可选，视觉上更靠近 iOS 26 原生 app
- **decision：** Wave 1 先不加玻璃外层，保持单按钮设计；Wave 3 评估

### D-P19-05 Switch 组件审查
仓库无 React Native `<Switch>`；用户所指可能是 `SegmentedTwo`（支出/收入切换）。本相位 Wave 2 给 `SegmentedTwo` 加 `haptic.select`。

### D-P19-06 向后兼容：新旧按压并存
- Wave 1 先建 `HeaderIconButton` + 改 header 按钮（不删老 token）
- Wave 2 改列表行 + 主按钮
- Wave 3 统一清理 `pressedOpacity` / `pressScale` 导入 + 从 `layout.ts` 删除

### Claude's Discretion
- `HeaderIconButton` 具体样式（边框 / 阴影）保持与现有 `headerChipWash/Accent` 一致，props 命名稍作简化
- 各屏幕改动：优先**批量替换** + 手工校正边缘情形
</decisions>

<canonical_refs>
## Canonical References

### v1.2 关键章节
- **§11.3 按压弹簧** — 所有 Pressable 必须 SpringPressable
- **§13.2 触觉场景映射表** — haptic 选择依据
- **§19 组件级实现规范** — 19.1-19.6
- **§19.6 组件内禁区** — 「Pressable 裸用无动效无触觉」一票否决

### 本仓库依赖
- `src/components/SpringPressable.tsx`（Phase 17）
- `src/utils/haptics.ts`（Phase 17）
- `src/hooks/useReduceMotion.ts`（Phase 17）
- `src/components/ios/GlassEffectContainer.tsx` / `Union.tsx` / `VibrantText.tsx` / `GlassShimmer.tsx`（Phase 18）
- `src/hooks/useTouchRipple.ts` / `useMaterialize.ts`（Phase 18）

### 待改文件清单（14 个，Wave 分配在 PLAN 里）
- `src/navigation/RootNavigator.tsx`
- `src/screens/*.tsx` ×9
- `src/components/ios/SegmentedTwo.tsx` / `Fab.tsx` / `ListRow.tsx`
- `src/components/BillCalculator.tsx`
- `src/theme/layout.ts`（Wave 3 token 清理）
</canonical_refs>

<code_context>
## Existing Code Insights

### 每屏 headerRight 重复模式
HomeScreen / ChartScreen / BudgetScreen / AssetScreen / MineScreen 等都有类似的圆形 chip 按钮（wash + accent 组合）。建 `HeaderIconButton` 是明显收益。

### SegmentedTwo 当前状态
使用 `Pressable` 裸组合，有 `onPress`，无触觉、无 spring 指示器。Wave 2 加 haptic。

### FAB 当前状态
`src/components/ios/Fab.tsx` 是仓库唯一有 spring 动画的组件，但用的是局部 `withSpring`，未接入 `motion.ts`。Wave 2 改用 `SpringPressable` 包装。

### ListRow 当前状态
基础版 `Pressable + pressedOpacity`。Wave 2 改 `SpringPressable + haptic.light`。
</code_context>

<specifics>
## Specific Ideas

### 立即修复截图问题（Wave 19-01）
HomeScreen `headerRight`：
```tsx
// 之前
<View style={styles.headerActions}>
  <Pressable ...><MaterialCommunityIcons name="filter-variant" /></Pressable>
  <Pressable ...><MaterialCommunityIcons name="plus" /></Pressable>
</View>

// 之后
<View style={styles.headerActions}>
  <HeaderIconButton variant="wash" icon="filter-variant" onPress={...} accessibilityLabel="查账-打开账单" />
  <HeaderIconButton variant="accent" icon="plus" onPress={...} accessibilityLabel="记一笔" />
</View>
```

每个 `HeaderIconButton` 内部是独立 `SpringPressable` + 独立 shared value，彼此按压不干扰。

### Wave 19-02 列表行改造模板
```tsx
<SpringPressable onPress={...} hapticOn="pressIn" hapticIntensity="light" style={styles.row}>
  {/* 原内容 */}
</SpringPressable>
```

### Wave 19-03 玻璃应用（克制）
本相位只把 TabBar 已有的 IOSChromeGlassBackground 保留；不强推玻璃到屏幕内部 —— 避免违反 v1.2 §3.15 约束 4。
</specifics>

<deferred>
## Deferred Ideas

### Phase 20+ 候选
- `useGyroHighlight` + `expo-sensors`（玻璃动态高光）
- App Icon 4 变体 + Extra-Large token（原 Option C）
- Chart 柱 Stagger 接入 `withDelay`（v1.2 §11.5）
- 大标题 Scroll-Driven Collapse（v1.2 §11.7）
- 真机 UAT + VoiceOver 全量
</deferred>

---

*Phase: 19-ui-integration*
*Context: 2026-04-24 快速集成，响应用户审计反馈*
