# Phase 18: iOS 26 玻璃体系 - Context

**Gathered:** 2026-04-24
**Status:** Ready for planning
**Source:** `/gsd-discuss-phase 18` auto-default（Option B，Tier 1 + Tier 2 合并）

<domain>
## Phase Boundary

承接 Phase 17 基础资产，按 v1.2 §3.10 / §3.10bis / §3.8 / §3.9 / §3.12 建立 iOS 26 **玻璃体系**的 RN 工程近似组件 —— 让 Phase 19+ 页面改造（TabBar / Sheet / FAB 菜单）有成熟原语可用。

**本相位范围：Option B（Tier 1 + Tier 2，8 件资产 + 1 依赖）**

### Wave 1 — Tier 1 必备（4 件）
- `src/components/ios/GlassEffectContainer.tsx` —— 共享采样层（§3.10 G1）
- `src/components/ios/GlassEffectUnion.tsx` —— 静态合并（§3.10bis G4）
- `src/components/ios/VibrantText.tsx` —— 玻璃内文字 vibrancy 近似（§3.8 E7）
- 安装 `expo-linear-gradient`

### Wave 2 — Tier 2 推荐（3 件）
- `src/components/ios/GlassShimmer.tsx` —— 按压高光扫过（§3.9 E4）
- `src/hooks/useTouchRipple.ts` —— 触点辐射 Hook（§3.9 E5）
- `src/hooks/useMaterialize.ts` —— 进出场 opacity + scale + blur 三联动（§3.12 E3）

**严格非目标：**
- ❌ `useGyroHighlight` + `expo-sensors`（§3.7 E2 动态高光，P2，推迟 Phase 19）
- ❌ 修改任何屏幕（留 Phase 19+ 页面改造）
- ❌ 安装 `@shopify/react-native-skia`（§3.6 Tier 2 Lensing，保持 Tier 1 BlurView + hairline 近似）
- ❌ 修改 v1.2 设计宪法
</domain>

<decisions>
## Implementation Decisions

### D-P18-01 范围（Option B 完整版）
Tier 1 + Tier 2 合并，两个 Wave 执行。Tier 3（陀螺仪 + Skia）推迟。

### D-P18-02 GlassEffectContainer 实现策略
对齐 v1.2 §3.10 与 §3.15 约束 1：**单外层 `BlurView` + 内部仅 tint/borderRadius**，避免嵌套玻璃。Props 透传 `intensity`（默认 60）、`tint`（default/dark，随 `useAppTheme()` 自动切换）。

### D-P18-03 GlassEffectUnion 实现策略
作为 `GlassEffectContainer` 内的子元素包装：共享 `borderRadius`，子元素 gap = 0，顶部 hairline 高光。不提供跨屏幕合并（按 v1.2 §3.10bis「同容器内」规定）。

### D-P18-04 VibrantText 实现策略
Tier 1 兜底（v1.2 §3.8）：`color: useAppTheme().colors.title` + iOS 下 `textShadow` 轻描边（`rgba(0,0,0,0.12)` @ 2px blur）+ 推荐 `fontWeight ≥ '600'`。不做 Tier 3 内容感知切换（PR 维度过大）。

### D-P18-05 GlassShimmer 实现策略
`LinearGradient` 带动的对角光带（宽度 40% 容器宽），`Reanimated` `withTiming(400ms)` 单向扫过后消失。由外部 `active` 触发，不内置按压监听（便于复用到 FAB / CTA / Tab 切换等任意场景）。

### D-P18-06 useTouchRipple 实现策略
单元素近似（v1.2 §3.9 ③，Red-02 降级后）：返回 `{onPressIn, rippleX, rippleY, rippleR, rippleOpacity}`，供业务组件自行叠加 radial gradient View。**不承诺**跨元素物理传染（按 Red-02）。

### D-P18-07 useMaterialize 实现策略
进出场三联动（v1.2 §3.12 E3）：`opacity` + `scale` + `blurIntensity` 三个 SharedValue，由 Reanimated worklet 并发驱动；开放 `materialize()` / `dematerialize()` 命令式 API。blur intensity 通过 `Animated.createAnimatedComponent(BlurView)` 动画化。

### D-P18-08 测试策略
- Hook（`useTouchRipple` / `useMaterialize`）→ 类型检查 + lint（不单测，RN 运行时依赖重）
- 组件（Container / Union / VibrantText / Shimmer）→ 类型检查 + lint + 手工 Storybook-like 不做
- 保持 Phase 17 风格：新资产不加 vitest，除非有纯函数可测

### D-P18-09 分支策略
新分支 `cursor/phase-18-exec` 从 **已 merge 到 master 的 Phase 17 代码** 之后分出（预期 PR #2 合并后）。若 PR #2 未合，仍可从当前 `cursor/phase-17-exec` 分出，merge 时按需 rebase。

### Claude's Discretion
- 具体 props 接口小改（只要遵守「不违反 v1.2 对应章节 RN 近似段」）
- 组件内部样式常量（颜色 / 圆角 / padding 从 `src/theme/` 引，不硬编码）
- Shimmer 方向（45° / 水平任选，默认 45° 对齐 v1.2 §3.9 ②）
</decisions>

<canonical_refs>
## Canonical References

### 本仓库权威依据
- `.planning/IOS26-DESIGN-GUIDE.md` v1.2
  - **§3.8 E7 Vibrancy** — VibrantText 三档降级策略
  - **§3.9 E4 Shimmer + E5 Touch-Point Illumination** — GlassShimmer / useTouchRipple 工程示例
  - **§3.10 G1 GlassEffectContainer** — Container 共享采样原则
  - **§3.10bis G4 GlassEffectUnion** — Union 静态合并 + 必要条件
  - **§3.12 E3 Materialization** — useMaterialize 三联动
  - **§3.15 Expo Blur 实战约束** —— 约束 1 (render 顺序) + 约束 4 (嵌套限制) + 约束 5 (GPU 预算) **本相位必读**
  - **§18.2 缺失资产** — 本相位输入清单

### 前相位依赖
- `src/theme/motion.ts`（Phase 17 产物）—— `FADE_MS.fast/normal/slow` 供 Shimmer / Materialize 使用
- `src/hooks/useReduceMotion.ts`（Phase 17）—— useMaterialize 降级路径参考
- `src/theme/palette.ts` / `useAppTheme.ts` —— Container tint 依据

### Apple 官方
- `https://developer.apple.com/documentation/swiftui/glasseffectcontainer`
- `https://developer.apple.com/documentation/swiftui/view/glasseffectunion(id:namespace:)`
- `https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass`

### Expo / RN 工程
- `https://docs.expo.dev/versions/latest/sdk/blur-view/` —— BlurView 动态内容 render 顺序 + intensity 动画
- `https://docs.expo.dev/versions/latest/sdk/linear-gradient/` —— Shimmer 的 LinearGradient API
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `expo-blur ~15.0.8`（package.json 已有）—— Container 基础
- `react-native-reanimated 4.1.1` —— Shimmer / Materialize / useTouchRipple 所有动画
- `src/theme/motion.ts` —— FADE_MS 节奏
- `src/theme/palette.ts` —— 颜色 token
- `src/theme/layout.ts` —— `radii.card` / `shadows.*`
- `src/hooks/useReduceTransparency.ts` —— 降低透明度降级
- `src/hooks/useReduceMotion.ts` —— 降低动画降级

### 新增依赖
- `expo-linear-gradient` —— 由 `npx expo install` 自动解析版本

### Integration Points
- 新文件路径（不动现有）：
  - `src/components/ios/GlassEffectContainer.tsx`
  - `src/components/ios/GlassEffectUnion.tsx`
  - `src/components/ios/VibrantText.tsx`
  - `src/components/ios/GlassShimmer.tsx`
  - `src/hooks/useTouchRipple.ts`
  - `src/hooks/useMaterialize.ts`
</code_context>

<specifics>
## Specific Ideas

### GlassEffectContainer 接口
```tsx
type Props = {
  intensity?: number;         // 默认 60
  tint?: 'default' | 'dark' | 'light';  // 默认跟随 useAppTheme
  borderRadius?: number;      // 默认 radii.card
  style?: ViewStyle;
  children?: React.ReactNode;
};
```

### GlassEffectUnion 接口
```tsx
type Props = {
  borderRadius?: number;  // 默认继承父 Container
  style?: ViewStyle;
  children?: React.ReactNode;  // 所有子元素 gap: 0
};
```

### VibrantText 接口
```tsx
type Props = TextProps & {
  vibrantWeight?: TextStyle['fontWeight'];  // 默认 '600'
};
```

### GlassShimmer 接口
```tsx
type Props = {
  active: boolean;        // 触发扫过
  width: number;
  height: number;
  durationMs?: number;    // 默认 400
  angle?: number;         // 默认 20（度）
};
```

### useTouchRipple 签名
```tsx
function useTouchRipple(): {
  onPressIn: (e: GestureResponderEvent) => void;
  rippleStyle: ViewStyle;  // 已合成的 radial 展开样式
};
```

### useMaterialize 签名
```tsx
function useMaterialize(): {
  opacity: SharedValue<number>;
  scale: SharedValue<number>;
  blurIntensity: SharedValue<number>;
  materialize: () => void;
  dematerialize: () => void;
};
```
</specifics>

<deferred>
## Deferred Ideas

### Phase 19 候选
- Option C App Icon 四变体 + `src/theme/controlSize.ts`（`extraLarge`）
- 陀螺仪高光：`useGyroHighlight.ts` + `expo-sensors`（P2）
- Skia lens shader Tier 2 探索（v1.2 §3.6 P2）

### Phase 20+ 候选
- 实际页面改造：TabBar / Sheet / FAB 菜单使用本相位产物
- 跨屏 Morphing（`react-native-shared-element`，需 dev build）

### 本仓库不做
- iPad Sidebar Background Extension（非目标平台）
- 真机 VoiceOver 全量手测（Phase 20+ UAT）
</deferred>

---

*Phase: 18-glass-system*
*Context gathered: 2026-04-24 via `/gsd-discuss-phase 18` auto-default (Option B, Tier 1 + Tier 2)*
