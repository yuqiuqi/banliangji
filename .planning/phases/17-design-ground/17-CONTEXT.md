# Phase 17: 设计宪法落地 — 源码骨架与资产 - Context

**Gathered:** 2026-04-24
**Status:** Ready for planning
**Source:** `/gsd-plan-phase 17` 直接进入（`/gsd-discuss-phase 17` 推荐默认 15 秒规则落地：A / 测试-A / 替换-A / 分支-A / haptics-A）

<domain>
## Phase Boundary

承接 v1.2 §18.2「缺失资产」清单，建立 iOS 26 设计语言的**最小可用源码地基** —— Phase 18+ 页面重构时有成熟 import。

**本相位范围：Option A — motion/haptics 基础资产（1 Wave，小）**
- 重建 `src/theme/motion.ts`（`SPRING` / `REDUCE_SPRING` / `FADE_MS`）
- 新建 `src/hooks/useReduceMotion.ts`
- 新建 `src/utils/haptics.ts`
- 新建 `src/components/SpringPressable.tsx`
- 重装 `expo-haptics`（Expo SDK 54 兼容）

**严格非目标：**
- ❌ 替换现有任何业务组件的 `Pressable`（全部留 Phase 18）
- ❌ 创建任何玻璃相关原语（Option B 留下一相位）
- ❌ 创建 App Icon / Extra-Large token（Option C 留更后相位）
- ❌ 修改 `.planning/IOS26-DESIGN-GUIDE.md` v1.2
- ❌ 修改任何屏幕文件
</domain>

<decisions>
## Implementation Decisions

### D-P17-01 范围（GA-P17-1: A）

本相位 = **Option A**：motion/haptics 基础 5 件套。B 与 C 留下一相位承接（可能是 Phase 18 = 玻璃体系 / Phase 19 = App Icon + Extra-Large）。

### D-P17-02 测试策略（GA-P17-2: 测试-A）

- 纯函数（`haptics` wrapper）→ **vitest 覆盖**，与现有 `src/chart/`、`src/budget/` 风格对齐
- UI 组件（`SpringPressable`）→ 只做 `tsc --noEmit` 类型检查 + `eslint` lint，不引入 `@testing-library/react-native`
- `motion.ts` / `useReduceMotion` → 常量或 RN 平台 API 包装，**只做类型检查，不单测**

### D-P17-03 既有 Pressable 替换策略（GA-P17-3: 替换-A）

本相位**只建**组件，**不替换**任何现有业务代码。`SpringPressable` 将在 Phase 18 的具体屏幕改造中被使用。

### D-P17-04 分支策略（GA-P17-4: 分支-A）

继续在 `cursor/phase-16-design-v1.2` 分支上做 Phase 17。完成后：
1. 合并 `cursor/phase-16-design-v1.2` → `cursor/ios26-design-guide`
2. `cursor/ios26-design-guide` 开 PR 入 master
3. 下个相位再从 master 分出新分支

### D-P17-05 expo-haptics 重装（GA-P17-5: haptics-A）

```bash
npx expo install expo-haptics
```

Expo 会自动解析 SDK 54 兼容版本（预期 `~15.0.8`）。不硬锁版本号。

### Claude's Discretion

- `SpringPressable` 组件的具体 props 接口（保持与 RN `Pressable` 透传即可）
- `motion.ts` 具体导出命名（只要满足 v1.2 §11.1 `SPRING.UI/THUMB/SHEET/GESTURE`）
- `haptics.ts` wrapper 的 try/catch 策略（系统无触觉时静默失败）
</decisions>

<canonical_refs>
## Canonical References

### 本仓库权威依据
- `.planning/IOS26-DESIGN-GUIDE.md` **v1.2** — 设计宪法正本
  - **§11.1 全局弹簧表** — `SPRING.UI/THUMB/SHEET/GESTURE` + `REDUCE_SPRING` + `FADE_MS.fast/normal/slow`
  - **§11.3 按压弹簧（Spring Press）** — `SpringPressable` 行为契约
  - **§11.9 Reduce Motion 降级（全局）** — `useReduceMotion` 契约
  - **§13 触感反馈** — `haptics` 场景映射
  - **§18.2 缺失资产** — 本相位输入清单
- `.planning/phases/16-design-guide-v1.2/16-VERIFICATION.md` — 上一相位验收

### 历史研究（可引用）
- `.planning/research/IOS26-MOTION-INTERACTION-SPEC.md` — Phase 14 动效研究
- `.planning/research/IOS26-LIQUID-GLASS-REFERENCE.md` — 玻璃参考

### Apple 官方
- `https://developer.apple.com/documentation/uikit/uifeedbackgenerator` — 触感官方 API
- `https://docs.expo.dev/versions/latest/sdk/haptics/` — expo-haptics SDK 参考

### 工程环境
- `package.json` — Expo ~54.0.33 / RN 0.81.5 / react-native-reanimated 4.1.1（已有）
- `src/theme/` 已有 `palette.ts` / `colors.ts` / `layout.ts` / `typography.ts`
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/theme/palette.ts` — `lightPalette` / `darkPalette`
- `src/theme/layout.ts` — `radii` / `shadows` / `listContentInset`（提供按压阴影等）
- `src/theme/typography.ts` — `iosType`
- `react-native-reanimated` 4.1.1 —— `withSpring` / `useSharedValue` / `useAnimatedStyle` 可用
- `react-native` 的 `AccessibilityInfo.isReduceMotionEnabled` —— `useReduceMotion` 实现依据

### Integration Points
- 新资产目录：
  - `src/theme/motion.ts`（新）
  - `src/hooks/useReduceMotion.ts`（新，与现有 `useReduceTransparency.ts` 同目录）
  - `src/utils/haptics.ts`（新）
  - `src/components/SpringPressable.tsx`（新）
- `package.json` 新增 `expo-haptics`
- 测试目录 `src/**/*.test.ts` —— 已有 vitest 配置可直接添加 `haptics.test.ts`

### Missing Before Phase 18
- 玻璃原语（`GlassEffectContainer` / `GlassEffectUnion` / `VibrantText` / `GlassShimmer`）→ 下一相位
- App Icon 四变体资产 → 更后相位
- `controlSize.ts`（Extra-Large）→ 更后相位
</code_context>

<specifics>
## Specific Ideas

### `motion.ts` 导出签名（固化）

```ts
export const SPRING = {
  UI:      { damping: 15, stiffness: 220, mass: 1    },
  THUMB:   { damping: 13, stiffness: 260, mass: 0.9  },
  SHEET:   { damping: 20, stiffness: 200, mass: 1.1  },
  GESTURE: { damping: 12, stiffness: 300, mass: 1    },
} as const;

export const REDUCE_SPRING = { damping: 50, stiffness: 400, mass: 1 } as const;

export const FADE_MS = {
  fast: 120,
  normal: 200,
  slow: 350,
} as const;
```

### `useReduceMotion` 签名

```ts
export function useReduceMotion(): boolean;
```

用 `AccessibilityInfo.isReduceMotionEnabled` + `reduceMotionChanged` listener 实现；SSR 安全默认 `false`。

### `haptics.ts` wrapper

```ts
export const haptic = {
  select: () => Promise<void>,
  success: () => Promise<void>,
  warning: () => Promise<void>,
  error: () => Promise<void>,
  light: () => Promise<void>,
  medium: () => Promise<void>,
};
```

全部 try/catch 包装（系统无触觉时静默失败），对齐 v1.2 §13 场景映射。

### `SpringPressable` 组件

```tsx
type Props = PressableProps & {
  spring?: keyof typeof SPRING;        // 默认 "UI"
  hapticOn?: "pressIn" | "press" | false; // 默认 "pressIn"
  hapticIntensity?: "light" | "medium" | "select"; // 默认 "light"
  scaleTo?: number;                    // 默认 0.97
  opacityTo?: number;                  // 默认 0.92
};
```

内部：
- `useSharedValue(1)` × 2（scale / opacity）
- `onPressIn` 触发 `withSpring(scaleTo)` + haptic
- `onPressOut` 触发 `withSpring(1)`
- `useReduceMotion` 为 true 时 → 用 `withTiming(1, { duration: 100 })` 替代

### 测试

- `src/utils/haptics.test.ts` —— mock `expo-haptics` 模块，校验每个 wrapper 调用对应 API
- 不测 UI 组件（D-P17-02）

### verify 门禁

新代码必须全部通过 `npm run verify`（tsc + eslint + vitest）。
</specifics>

<deferred>
## Deferred Ideas

### 下一相位候选（B / C）
- **玻璃原语**（B）：`GlassEffectContainer.tsx` / `GlassEffectUnion.tsx` / `VibrantText.tsx` / `GlassShimmer.tsx` + `expo-linear-gradient`
- **App Icon 四变体** + **Extra-Large**（C）：`assets/icon/default.png` / `dark.png` / `tinted.png` + `src/theme/controlSize.ts`

### 推迟到页面改造相位（Phase 18+）
- 实际替换各屏幕 `Pressable` 为 `SpringPressable`
- 图表柱 `withDelay` stagger 改造
- 列表 `FadeInDown` 入场动画
- Sheet / Modal Spring 进出场

### 不在本仓库做
- Dynamic Type 全屏响应式（iOS 独有能力评估）
- Skia Lensing shader（Phase 15/Phase 16 已明确 RN-T3 探索项）
- 跨导航路由 Morphing（RN 工程代价过高）
</deferred>

---

*Phase: 17-design-ground*
*Context gathered: 2026-04-24 via `/gsd-plan-phase 17` (no-discuss → defaults applied)*
