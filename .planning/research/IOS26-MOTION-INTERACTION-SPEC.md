# iOS 26 动效·交互·组件质感 — 研究规格文档

**版本：** v3.0 研究基线  
**日期：** 2026-04-23  
**来源：** Apple Developer Documentation、SwiftUI Animations Guide 2026、Liquid Glass Reference、HIG 2026、仓库现有代码审计  
**适用阶段：** Phase 14 — 全局动效与交互打磨

> **注意：** Apple 不公开逐像素弹簧三元组。本文参数为「可验收工程近似」，真机调优时记入 `14-VERIFICATION Accepted deviation`。  
> **RN 边界：** `GlassEffect / .glassEffect()` 等 SwiftUI 私有 API 无法直接用于 React Native；本文档给出等效工程近似方案。

---

## 一、核心哲学（iOS 26 设计叙事）

| 原则 | 叙事 | RN 落地含义 |
|------|------|-------------|
| **物理即语言** | 动效模拟真实弹簧物理（惯性 → 超调 → 稳定），区别于线性 ease | 全部使用 `withSpring`；避免 `Animated.timing` 作为主要过渡 |
| **Liquid Glass：Interactive** | 控件在按压时表面「充能」：轻微 scale up、光晕扫过、触点增亮 | Reanimated `withSpring(0.97)` + `expo-haptics` `light impact` |
| **Morphing 连贯** | 状态切换时形态连续变化（非硬切），通过 `GlassEffectID` 标识同一「对象」 | 同一 `GroupedInset` / 指示器沿位移连续过渡，避免闪现 |
| **弹性边界** | 滚动/拖拽到边界时有「橡皮筋」感，松手弹回 | `ScrollView` + `react-native-gesture-handler` 边界弹回 |
| **触觉一体** | 视觉、声音、触觉同步 | `expo-haptics` 与动效同帧触发 |
| **Reduce Motion 降级** | 系统「减少动画」开启时：替换 scale/平移为短 opacity；保留语义反馈 | `useReduceMotion` hook 挂载全局降级参数 |

---

## 二、全局弹簧参数表（Reanimated 4.x）

> SwiftUI 标准：`spring(response: 0.4, dampingFraction: 0.7)` 映射为下表「主弹簧」。

```ts
// src/theme/motion.ts （新建文件）
export const SPRING = {
  /** 主弹簧：按钮、分段指示器、列表行 */
  UI:      { damping: 15, stiffness: 220, mass: 1 },
  /** 轻盈弹簧：chip、徽章、小标签（更活泼） */
  THUMB:   { damping: 13, stiffness: 260, mass: 0.9 },
  /** 厚重弹簧：sheet 底栏、大浮层（更稳） */
  SHEET:   { damping: 20, stiffness: 200, mass: 1.1 },
  /** 极快弹簧：手势跟随/复位（接近 interactiveSpring） */
  GESTURE: { damping: 12, stiffness: 300, mass: 1 },
} as const;

export const REDUCE_SPRING = { damping: 50, stiffness: 400, mass: 1 }; // 几乎无弹跳
export const FADE_MS = { fast: 120, normal: 200, slow: 350 } as const;
```

---

## 三、分场景规格（全屏适用）

### 3.1 分段控件 / 周期 Chip — **弹簧拇指（Spring Thumb）**

**现状问题（ChartScreen）：**
- 周/月/年：瞬时切换样式，无位移动效
- 周期 chip 行：仅切换 `backgroundColor`，无共享动态指示器

**iOS 26 期望：**
- 选中指示器为独立的浮起白块（`surface` + `shadows.keyCap`），随选中项用 `withSpring(SPRING.THUMB)` 滑动至目标位置
- 快速连点时指示器追随，不重置动画

**RN 实现方案：**

```tsx
// SegmentedSpring 示例
const thumbX = useSharedValue(0);
const thumbWidth = useSharedValue(0);

// onLayout 中量测各段宽度 → 存入 positions[]
// onPress 中:
thumbX.value = withSpring(positions[idx].x, SPRING.THUMB);
thumbWidth.value = withSpring(positions[idx].width, SPRING.THUMB);

// Animated.View 作为拇指层，绝对定位，z-index 于 segBar 内部
```

**适用组件：** `ChartScreen`（周/月/年）、`SegmentedTwo`、将来任何分段切换

---

### 3.2 列表行 / 卡片按压 — **统一 Spring 按压**

**现状问题：**
- 90% 屏使用 `pressedOpacity: 0.92` 纯 opacity 实现（无 spring scale）
- 仅 Tab 图标与 Dock 有 Reanimated spring

**iOS 26 期望：**
- 按下：`scale → 0.97` + `opacity → 0.92`，用 `SPRING.UI` 驱动
- 松手：`scale → 1.0` + `opacity → 1`，弹回（轻微超调 + 稳定）

**RN 实现方案：**

```tsx
// useSpringPress hook（新建 src/hooks/useSpringPress.ts）
export function useSpringPress() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  const onPressIn = () => {
    scale.value = withSpring(0.97, SPRING.UI);
    opacity.value = withSpring(0.92, SPRING.UI);
  };
  const onPressOut = () => {
    scale.value = withSpring(1, SPRING.UI);
    opacity.value = withSpring(1, SPRING.UI);
  };
  return { style, onPressIn, onPressOut };
}
```

**适用范围：**
- `ListRow`、`GroupedInset` 内 `Pressable`
- Chart 分段/chip、Budget/Asset Modal 按钮
- Mine 折叠块、Home 账单行

---

### 3.3 图表柱图 — **Staggered Spring 生长**

**现状问题：**
- `ChartScreen` 柱高度直接由布局决定，无动画生长
- 仅有整区 `Animated.timing` 200ms fade（`chartFadeMs`）

**iOS 26 期望：**
- 切换周期/粒度时，每根柱从 `height: 0` 到目标高度，用 `withSpring(SPRING.UI)` 驱动
- 错时入场：每柱延迟 `index × 30ms`（stagger）
- 整区 fade 保留，改为 Reanimated `withTiming(1, { duration: 150 })` 并行

**RN 实现方案：**

```tsx
// 每根柱用 useSharedValue(0)，useEffect 监听 points 变化
const barHeights = useMemo(() => points.map(() => useSharedValue(0)), []);

useEffect(() => {
  points.forEach((pt, i) => {
    const targetH = maxAmount > 0 ? (pt.amount / maxAmount) * 132 : 0;
    setTimeout(() => {
      barHeights[i].value = withSpring(Math.max(4, targetH), SPRING.UI);
    }, i * 30);
  });
}, [points, maxAmount]);
```

**Reduce Motion 降级：** `useReduceMotion` 为 true 时，所有柱同时切到目标值（无 stagger），短 fade 替代

---

### 3.4 触觉反馈（Haptic Feedback）— **全局触觉策略**

**现状问题：** 零实现（`expo-haptics` 未安装）

**安装：**
```bash
npx expo install expo-haptics
```

**iOS 26 触觉映射表：**

| 场景 | API | 时机 |
|------|-----|------|
| 分段/周期 chip 切换 | `Haptics.selectionAsync()` | `onPress` 同帧 |
| 记一笔「保存」成功 | `Haptics.notificationAsync(success)` | 保存完成后 |
| 删除账单/账户确认 | `Haptics.notificationAsync(error)` | Alert 确认按 destructive 前 |
| 滚动到列表边界 | `Haptics.impactAsync(light)` | `onScroll` 检测顶/底边界 |
| 长按进入编辑 | `Haptics.impactAsync(medium)` | `onLongPress` 触发时 |
| 预算设置保存 | `Haptics.notificationAsync(success)` | `saveCap()` 完成后 |
| Modal 呈现 | `Haptics.impactAsync(light)` | `setModalOpen(true)` 时 |

**封装：**
```ts
// src/utils/haptics.ts
import * as Haptics from 'expo-haptics';
export const haptic = {
  select: () => Haptics.selectionAsync(),
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  error:   () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  light:   () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  medium:  () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
};
```

---

### 3.5 列表项入场 — **Stagger FadeIn**

**现状问题：** 分类列表、账单列表等直接渲染，无入场动效

**iOS 26 期望：**
- 数据从无到有（首屏、筛选后）：每行从 `opacity: 0, translateY: 8` → `opacity: 1, translateY: 0`
- 错时 `index × 40ms`
- 已可见状态切换（分页、日期切换）：整组短 fade，不错时

**RN 实现方案（Reanimated Entering）：**
```tsx
// 每行包 Animated.View
<Animated.View
  entering={FadeInDown.delay(index * 40).springify().damping(15)}
>
  <ListRow ... />
</Animated.View>
```

**Reduce Motion 降级：** 直接 `entering={undefined}`（无动效）

---

### 3.6 Modal Sheet — **Spring 进出场 + Scrim 联动**

**现状问题：**
- Budget/Asset Modal 使用系统 `<Modal animationType="fade">`
- Scrim 与卡片动效无联动（两者异步）

**iOS 26 期望：**
- Sheet 卡片从 `translateY: 60 + opacity: 0` → `translateY: 0 + opacity: 1`，`withSpring(SPRING.SHEET)`
- Scrim 从 `opacity: 0` → `1`，并行 `withTiming(1, { duration: 250 })`
- 关闭：同步反向

**RN 实现方案：**
```tsx
// BottomModal 组件（可选封装）
const slideY = useSharedValue(80);
const scrimOpacity = useSharedValue(0);

const open = () => {
  setVisible(true);
  slideY.value = withSpring(0, SPRING.SHEET);
  scrimOpacity.value = withTiming(1, { duration: 250 });
};
const close = () => {
  slideY.value = withSpring(80, SPRING.SHEET);
  scrimOpacity.value = withTiming(0, { duration: 200 });
  setTimeout(() => setVisible(false), 250);
};
```

---

### 3.7 大标题折叠（Scroll Header Collapse）

**现状问题：** 副路径屏（预算、资产、我的）使用静态 `headerBanner` + hairline，无滚动联动

**iOS 26 期望：**
- 向下滚动 > 50pt：顶栏 `BlurView`（降低透明度时实色）显现，大标题高度渐收缩
- 回滚到顶：大标题重新展开
- 顶栏底部 hairline 随材质出现/消失

**RN 实现方案：**
```tsx
const scrollY = useSharedValue(0);
const headerHeight = useAnimatedStyle(() => ({
  height: interpolate(scrollY.value, [0, 60], [72, 44], Extrapolate.CLAMP),
}));
const blurOpacity = useAnimatedStyle(() => ({
  opacity: interpolate(scrollY.value, [40, 70], [0, 1], Extrapolate.CLAMP),
}));
// onScroll: scrollY.value = e.nativeEvent.contentOffset.y （Reanimated scrollHandler）
```

---

### 3.8 Tab 栏动态收缩（可选 P2）

**现状问题：** Tab 栏固定高度，滚动时不收缩

**iOS 26 期望（动态 Tab 栏）：**
- 向下滚动时，Tab 标签文字渐隐（仅显示图标），底栏高度微缩
- 回滚到顶：文字重新显示

**RN 实现方案：**
- 通过 `ScrollView` `onScroll` + Reanimated 驱动 `tabLabelOpacity`
- 需对 `RootNavigator.tsx` 的 `IOSChromeTabBarButton` 扩展

---

## 四、组件改造优先级矩阵

| 组件/场景 | 优先级 | 工作量 | 影响感知度 |
|-----------|--------|--------|------------|
| **Spring Thumb（分段指示器）** | **P0** | 中 | 极高（用户点击图表必见） |
| **useSpringPress 全站替换** | **P0** | 中 | 高（所有交互） |
| **expo-haptics 基础触觉** | **P0** | 低 | 高（iOS 原生感知核心） |
| **柱图 Staggered Spring** | **P1** | 中 | 高（图表主视角） |
| **列表项 Stagger FadeIn** | **P1** | 低-中 | 中高（首屏感知） |
| **Modal Spring 进出场** | **P1** | 中 | 中（预算/资产） |
| **motion.ts 弹簧常量统一** | **P0** | 低 | 中（工程基础） |
| **Scroll Header Collapse** | **P1** | 中-高 | 中（副路径屏） |
| **Tab 动态收缩** | **P2** | 高 | 中低（非阻塞） |
| **Swipe-to-delete 手势** | **P2** | 高 | 中（账单/资产） |

---

## 五、Reduce Motion 全局策略

```ts
// src/hooks/useReduceMotion.ts
import { AccessibilityInfo } from 'react-native';
import { useEffect, useState } from 'react';

export function useReduceMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduce);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce);
    return () => sub.remove();
  }, []);
  return reduce;
}

// 用法：
// const reduceMotion = useReduceMotion();
// const spring = reduceMotion ? REDUCE_SPRING : SPRING.UI;
```

**降级规则：**
- Scale 动效 → 改为 opacity 短 fade（`withTiming(val, { duration: 100 })`）
- Stagger 入场 → 全部同帧出现（无 delay）
- 弹簧过渡 → 改 `REDUCE_SPRING`（阻尼极大，几乎线性）
- Haptics → **保留**（触觉是辅助功能本身，非减少对象）

---

## 六、与现有规格的差距总表

| 维度 | 现状代码 | v3.0 期望 | 差距等级 |
|------|----------|-----------|----------|
| 弹簧参数统一 | 散落各屏，部分无 Reanimated | `motion.ts` 单一来源 | **严重** |
| 分段指示器 | 瞬切样式 | Spring Thumb 滑动 | **严重** |
| 列表按压 | 纯 opacity Pressable | Spring scale + opacity | **中** |
| 柱图动效 | `Animated.timing` 整区 fade | 柱级 spring + stagger | **中** |
| 触觉反馈 | 零 | 场景化 haptics | **严重** |
| 列表入场 | 无 | Stagger FadeIn | **低-中** |
| Modal 动效 | 系统 fade | Spring 进出场 | **中** |
| Header 折叠 | 静态 | Scroll-driven collapse | **中** |
| Reduce Motion | 仅 `IOSChromeGlassBackground` | 全局降级 hook | **中** |

---

*本文档由 `/gsd-new-milestone v3.0` 创建，作为 Phase 14 CONTEXT 与 PLAN 的设计依据。*
