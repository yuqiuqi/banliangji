# iOS 26 设计语言指南（Design Language Guide）

> **身份：** 本仓库（`banliangji` / SwiftCostRN）自此版本起的 **设计宪法**。所有未来的 UI / UX / 动效 / 交互 / 触感 / 反馈编码**必须**遵循本文；与本文抵触的实现一律视为缺陷。
> **范围：** Phase 14 之后所有新开发（Phase 16+）与重构均以本文为先导。
> **权威来源（优先阅读序）：**
> 1. Apple Developer — [Liquid Glass Overview](https://developer.apple.com/documentation/TechnologyOverviews/liquid-glass)
> 2. Apple Developer — [Adopting Liquid Glass](https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass)
> 3. Apple Developer — [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
> 4. Apple Newsroom — [A delightful and elegant new software design (2025-06-09)](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/)
> 5. 仓库研究产物：`.planning/research/IOS26-LIQUID-GLASS-REFERENCE.md`、`.planning/research/IOS26-MOTION-INTERACTION-SPEC.md`
> **RN/Expo 边界：** SwiftUI **公开 API** `.glassEffect(_:in:)` / `GlassEffectContainer` / `glassEffectID(_:in:)` / `glassEffectUnion(id:namespace:)` 均为 iOS 26 SwiftUI 官方文档化接口（见 [Liquid Glass Overview](https://developer.apple.com/documentation/TechnologyOverviews/liquid-glass)），但**无 React Native 原生对应**；本文为每条规范提供 **React Native 工程近似** 与 **Accepted Deviation** 判定标准。 🍎 OFF

---

## 目录

1. [核心设计哲学](#一核心设计哲学)
2. [分层模型（Layer Model）](#二分层模型layer-model)
3. [Liquid Glass 材质系统](#三liquid-glass-材质系统)
4. [色彩系统](#四色彩系统)
5. [字体与排版（Typography）](#五字体与排版typography)
6. [间距 / 圆角 / 同心（Concentric）几何](#六间距--圆角--同心concentric几何)
7. [阴影与层次（Elevation）](#七阴影与层次elevation)
8. [导航与布局结构](#八导航与布局结构)
9. [控件语言（Controls）](#九控件语言controls)
10. [Sheet / Modal / Popover / Alert](#十sheet--modal--popover--alert)
11. [动效系统（Motion）](#十一动效系统motion)
12. [手势与交互（Interaction）](#十二手势与交互interaction)
13. [触感反馈（Haptics）](#十三触感反馈haptics)
14. [声音反馈（Sound）](#十四声音反馈sound)
15. [反馈层级与状态叙事（Feedback & State）](#十五反馈层级与状态叙事feedback--state)
16. [无障碍（Accessibility）](#十六无障碍accessibility)
17. [性能与取舍（Performance）](#十七性能与取舍performance)
18. [本仓库 Token 映射](#十八本仓库-token-映射)
19. [组件级实现规范](#十九组件级实现规范)
20. [验收清单（Reviewer Checklist）](#二十验收清单reviewer-checklist)
21. [Accepted Deviation（RN 工程近似）](#二十一accepted-deviationrn-工程近似)

---

## 一、核心设计哲学

iOS 26 的设计语言可以归结为 **三大原则** × **一种材质** × **五条潜规则**：

### 1.1 三大原则（HIG 总纲）

| 原则 | 英文 | 定义 | 本仓库落地含义 |
|------|------|------|-----------------|
| **层次** | **Hierarchy** | 让 **内容** 始终是视觉焦点；导航与控件作为「浮在内容之上的功能层」存在，可自适应让位。 | 账单列表、图表、金额是主角；Tab / Header / FAB / 分段控件让位。 |
| **和谐** | **Harmony** | 控件几何须与 **硬件（圆角屏、动态岛、安全区）** 和 **窗口/卡片容器** 同心；软硬一致。 | 使用 **同心圆角**（见第 6 节）；所有浮层从屏幕边缘内缩 ≥ `listContentInset (16pt)`。 |
| **一致** | **Consistency** | 跨尺寸、跨场景、跨平台可预期；系统应用怎么做，你的应用就怎么做。 | 禁止在四屏各自实现临时样式；所有分段 / 列表行 / 卡片 / 空状态复用 `src/components/ios/*` 原语。 |

### 1.2 一种材质 — **Liquid Glass**

> Liquid Glass 是 iOS 26 引入的 **动态半透明材质**，专用于 **导航层（the functional overlay）**：
> 不是磨砂玻璃、不是模糊、更不是色块 + opacity。它同时具备：
>
> - **Lensing（透镜）**：实时折射下方内容（不同于模糊的散射）。
> - **Materialization（物化显现）**：通过调制光线弯曲「生长」出界面。
> - **Fluidity（流动性）**：胶状柔性，触点即时响应。
> - **Morphing（形变）**：控件状态之间连续形变，而非硬切。
> - **Adaptivity（自适应）**：根据内容 / 色调 / 浅深色 / 环境光多层组合自调。
>
> **Apple 原文立场：**「Liquid Glass is best reserved for the navigation layer that floats above the content of your app.」

### 1.3 五条潜规则（Implicit Rules）

| # | 潜规则 | 违反后果 |
|---|--------|-----------|
| R1 | **玻璃只用于 Layer 2（导航 / 控件 / 浮层），不用于 Layer 1 内容** 🍎 OFF | 列表行本体、卡片体、图表背景（Layer 1）若加玻璃，将与控件视觉混战、信息层级崩塌；Layer 2 涵盖 Toolbar / TabBar / Sheet / FAB / Popover / 分段控件 —— 见 §2 分层模型表格。 |
| R2 | **色彩节制（Restrained Color）** | 控件与导航的饱和度要让位给内容，避免「彩色 Chrome」喧宾夺主。 |
| R3 | **同心圆角（Concentric Corners）** | 子元素圆角 = 父容器圆角 − 内边距；破坏同心 → 视觉「错位」。 |
| R4 | **动效是物理，而非时序** | 所有状态切换优先走弹簧（Spring），`timing` 只用于 opacity / Scrim 类辅助。 |
| R5 | **视觉 × 触觉 同帧触发**（声音交给系统，不自建） 📝 AUTH | 任何交互的视觉反馈出现时，触觉必须**同一帧**触发；异步 > 50ms 即为缺陷。音效遵守 §14 原则 —— 默认不引入自定义声音，由系统触觉附带的微声承担。 |

---

## 二、分层模型（Layer Model）

```
╔════════════════════════════════════════════════════════════╗
║ Layer 3 — Overlay   (Alerts, Tooltips, Vibrancy fills)     ║ ← 仅用于玻璃之上
╠════════════════════════════════════════════════════════════╣
║ Layer 2 — Navigation / Chrome  (Toolbar, TabBar, Sheet)    ║ ← Liquid Glass
║           Controls (Buttons, Segments, Sliders, FAB)       ║
╠════════════════════════════════════════════════════════════╣
║ Layer 1 — Content   (Lists, Charts, Cards, Media)          ║ ← 纯色 / 语义色，无玻璃
╚════════════════════════════════════════════════════════════╝
```

**判别规则：**
- 如果一个元素**跟随滚动消失**（列表行、图表、卡片） → Layer 1，**不加玻璃**。
- 如果一个元素**浮在滚动之上**（Tab 栏、顶栏、FAB、Sheet、Popover、分段控件） → Layer 2，**可考虑玻璃**。
- 如果一个元素**短暂出现**（Alert、Toast、菜单） → Layer 3，**必然玻璃或实色强调**。

**落地映射：**
| 屏幕元素 | 层级 | 材质 | 备注 |
|-----------|------|------|------|
| 账单列表行 | L1 | `colors.surface` 实色 + `shadows.grouped` | 禁止背景玻璃 |
| 图表柱 / 进度条 | L1 | 语义色（`colors.expense` / `colors.income`） | 禁止玻璃 |
| `HomeScreen` 顶部月份 Banner | L2 | 实色 Banner（目前方案） / 未来可选玻璃 | 见 §19.1 |
| TabBar | L2 | `IOSChromeGlassBackground`（已实现） | RN 近似 |
| 记一笔 FAB | L2 | `colors.accent` + `shadows.fab` | 悬浮 |
| `BillCalculator` Dock | L2 | `calculatorDockFallback` 半透明 | 玻璃近似 |
| Budget / Asset Modal | L2 | `surface` + `modalScrim` | Scrim = L3 |
| 系统 `Alert` | L3 | 系统默认（iOS 自带玻璃） | 不动 |

---

## 三、Liquid Glass 材质系统

### 3.1 三种变体（Apple 官方）

| 变体 | 何时用 | 透明度 | 自适应 | RN 近似 |
|------|--------|--------|--------|---------|
| **`.regular`** | **默认**：Toolbar / TabBar / Sheet / 分段控件 / 标准控件 | 中 | 完整，适配任意内容 | `expo-blur` `BlurView intensity={60} tint="default"` + 边缘高光 overlay |
| **`.clear`** | 媒体（照片/地图/视频）之上的小浮控 | 高 | 有限；需加 dimming 层 | `BlurView intensity={30}` + 深色 overlay `rgba(0,0,0,0.18)` |
| **`.identity`** | 条件性禁用（降低透明度 / 性能降级） | — | 无 | 回退为实色（见 `useReduceTransparency`） |

### 3.2 玻璃必备的三条必要条件（Apple 明确规定）

仅当**全部成立**时可使用 `.clear`：
1. 元素覆盖在 **富媒体内容** 上；
2. 内容**不会**被 dimming 层负向影响；
3. 玻璃之上的文字 / 图标**大且亮**（白色、粗体、≥ 20pt）。

任何一条不满足 → 用 `.regular` 或直接实色。

### 3.3 RN 工程近似（本仓库）

```tsx
// src/components/ios/IOSChromeGlassBackground.tsx（已实现）
// 等效 .regular：
<BlurView intensity={60} tint={scheme === 'dark' ? 'dark' : 'default'}>
  <View style={{ backgroundColor: scheme === 'dark'
      ? 'rgba(28,28,30,0.55)'
      : 'rgba(255,255,255,0.70)' }}/>
  {/* 顶部 1px 高光描边 */}
  <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.35)' }}/>
</BlurView>

// 等效 .identity（降低透明度 / Android 回退）：
<View style={{ backgroundColor: colors.surface }}/>  // 完全实色
```

**边缘高光（Specular Highlight）必做：** 玻璃面顶部 1px 白色 / 半透明描边，模拟光线擦过，**这是与「脏磨砂」的关键区别**。

### 3.4 禁区（Anti-Patterns）

| ❌ 禁止 | ✅ 改成 |
|--------|---------|
| 卡片本体加 `BlurView` | 实色 `colors.surface` + `shadows.grouped` |
| 图表背景加玻璃 | 纯 `colors.canvas` |
| 列表行按压态加玻璃 | Spring scale + opacity（§11） |
| 灰雾一块的 Tab 栏（无边缘高光） | 必须有 1px 顶部 hairline 高光 |
| 玻璃上贴玻璃（无 Container） | 用 `GlassEffectContainer` 共享采样（§3.10） |
| 玻璃上**直接**放深色/低对比文字 | 走 **Vibrancy**（§3.8），或改为实色容器 |

---

### 3.5 八大核心视觉效果总览（Signature Effects）

> 以下八条是 Liquid Glass **必须具备**的视觉签名。任何声称「做了玻璃效果」的实现，都应逐项对照；少一条，味道就淡一档。

| # | 效果 | 一句话定义 | 级别 | RN 可实现性 |
|---|------|-----------|------|------------|
| E1 | **Lensing（透镜折射）** | 实时弯曲下方内容光路（非模糊的散射） | ⭐⭐⭐⭐⭐ | 低（近似：Blur + 边缘 warp；真 lensing 需 Skia） |
| E2 | **Specular Highlights（动态高光）** | 跟随设备姿态 / 触点移动的高光条 | ⭐⭐⭐⭐⭐ | 中（陀螺仪驱动） |
| E3 | **Materialization（物化显现）** | 控件通过调制折射 **生长** 出界面，不是淡入 | ⭐⭐⭐⭐ | 中（scale + opacity + blur 组合） |
| E4 | **Interactive Shimmer（交互闪光）** | 按压时一条高光从触点扫过整个玻璃面 | ⭐⭐⭐⭐ | 中（LinearGradient + Reanimated） |
| E5 | **Touch-Point Illumination（触点辐射）** | 按压点外扩光晕，会传染到相邻玻璃 | ⭐⭐⭐⭐ | 中（RadialGradient + Container） |
| E6 | **Morphing（状态形变）** | 同一逻辑对象在不同状态间**连续形变**，非硬切 | ⭐⭐⭐⭐ | 中（SharedElement / Reanimated layout） |
| E7 | **Vibrancy（活力着色）** | 玻璃上的文字/图标自动根据下方内容调色 | ⭐⭐⭐⭐ | 低（近似：`colors.title` + 加粗阴影补偿） |
| E8 | **Adaptive Depth（自适应深度）** | 玻璃透明度/折射强度随下方内容明暗而变 | ⭐⭐⭐ | 中（监听 scroll + 内容采样） |

> **附加核心概念（非视觉但同等重要）：**
>
> - **G1 GlassEffectContainer（共享采样区）** —— 多个玻璃元素必须共享一个采样源，否则「玻璃不能采样玻璃」的物理约束会崩溃。
> - **G2 Fluidity（胶体流动性）** —— 按压/拖拽时玻璃像胶体一样有粘滞感，松手弹回，不是刚体。
> - **G3 Tint（语义着色）** —— 玻璃可被染色，但仅用于传达语义（主操作蓝、警告橙），不用于装饰。

---

### 3.6 E1 — Lensing（透镜折射）

**Apple 原话：** 「Lensing bends and concentrates light in real-time, rather than traditional blur which scatters it.」

**视觉特征：**
- 传统 Blur：像玻璃起雾，均匀散射
- Liquid Glass Lensing：像半透明水滴，下方内容**被拉伸、弯曲、放大**，边缘尤其明显

**RN 工程近似（梯度降级）：**

```tsx
// Tier 1（首选）：BlurView + 边缘 warp 模拟
<BlurView intensity={60} tint="default">
  {/* 顶部 1px 白高光 */}
  <View style={{
    position: 'absolute', top: 0, left: 0, right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.35)',
  }}/>
  {/* 底部 1px 黑收边 */}
  <View style={{
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.08)',
  }}/>
</BlurView>

// Tier 2（未来 P2）：@shopify/react-native-skia 自定义 lens shader
// import { Canvas, Fill, Shader, Sksl } from '@shopify/react-native-skia';
// const lensShader = Sksl.Shader`
//   uniform shader content;
//   half4 main(float2 coord) {
//     float2 uv = coord / iResolution.xy;
//     float2 lens = (uv - 0.5) * (1.0 + 0.15 * dot(uv-0.5, uv-0.5));
//     return content.eval(lens * iResolution.xy);
//   }
// `;
```

**判定：** Tier 1 为 **必做基线**，Tier 2 Skia lens 列入 Phase 16+ **Accepted Deviation** —— 若 2 个工作日无法稳定，保持 Tier 1。

---

### 3.7 E2 — Specular Highlights（动态高光）

**视觉特征：** 玻璃表面有一条或多条高光带，**随设备倾斜 / 触点移动而位移**。关键：**高光不是静态描边**，而是活的。

**三个层次：**

| 层次 | 来源 | RN 可行性 |
|------|------|----------|
| **静态边缘高光** | 顶部 1px 白 hairline | ✅ 已实现 |
| **触点响应高光** | 按压时高光从触点扫过 | 见 §3.9 Shimmer |
| **设备姿态高光** | 陀螺仪驱动的「水银感」高光 | 需 `expo-sensors` |

**设备姿态高光工程近似：**

```tsx
import { DeviceMotion } from 'expo-sensors';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

function useGyroHighlight() {
  const tiltX = useSharedValue(0);

  useEffect(() => {
    DeviceMotion.setUpdateInterval(50);
    const sub = DeviceMotion.addListener(({ rotation }) => {
      // rotation.gamma ∈ [-π/2, π/2]，左右倾斜
      tiltX.value = rotation?.gamma ?? 0;
    });
    return () => sub.remove();
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: tiltX.value * 20 }], // 最大 ±20pt 位移
  }));
  return style;
}

// 用法（Tab 栏玻璃层内）：
<BlurView intensity={60}>
  <Animated.View style={[styles.highlightBand, gyroStyle]}>
    <LinearGradient
      colors={['transparent', 'rgba(255,255,255,0.35)', 'transparent']}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
    />
  </Animated.View>
</BlurView>
```

**判定：** 主屏 FAB、TabBar 可选启用（**P2**，不阻塞主线）；性能考虑：`setUpdateInterval(50)` 即 20Hz，勿更高。

---

### 3.8 E7 — Vibrancy（活力着色）—— 玻璃上文字/图标的自适应

**Apple 原话：** 「Text on glass automatically receives vibrant treatment — adjusts color, brightness, saturation based on background.」

**这是玻璃上文字可读性的关键**：白文字在亮背景上会自动压暗、在暗背景上会自动提亮，**始终保持对比度**。

**iOS 原生行为：**
- `.foregroundStyle(.primary)` 在玻璃上自动走 Vibrancy
- Symbol（SF Symbols）同理

**RN 工程近似（三档降级）：**

| 档 | 实现 | 说明 |
|----|------|------|
| **Tier 1（必做）** | 玻璃上文字一律 `color: colors.title` + `text-shadow` 轻描边 | 保证深浅背景都可读 |
| **Tier 2（推荐）** | 玻璃上文字 `fontWeight: '600'` 及以上 | 粗体天生对比度更高 |
| **Tier 3（可选）** | 监听 `scrollY` / 判断下方内容亮度，动态切换文字色 | 高成本，仅 P2 |

**工程规则：**

```tsx
// 玻璃层内的文字必须使用此组件包装，禁止裸用 <Text>
function VibrantText({ children, style }: Props) {
  const { colors } = useAppTheme();
  return (
    <Text style={[
      styles.vibrant,
      { color: colors.title },
      Platform.OS === 'ios' && {
        textShadowColor: 'rgba(0,0,0,0.12)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
      },
      style,
    ]}>
      {children}
    </Text>
  );
}
```

**必须应用范围：**
- TabBar 标签文字
- Sheet / Popover 内文字
- FAB 图标（用 `tintColor` 替代 `color`）
- 任何 `BlurView` 内部文字

---

### 3.9 E4 + E5 — Interactive Effects（交互四件套）

按压时玻璃控件的四种响应，缺一不可：

#### ① 按压形变（Press Morph）

已在 §11.3 覆盖：`scale → 0.97 + opacity → 0.92`，`SPRING.UI`。

#### ② Shimmer（高光扫过）

**视觉：** 按压瞬间，一条对角高光带从触点出发，沿 45° 方向扫过整个玻璃面，0.4s 消失。

**RN 实现：**

```tsx
// src/components/ios/GlassShimmer.tsx（未来组件）
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { withTiming, runOnJS } from 'react-native-reanimated';

function GlassShimmer({ active, width, height }: Props) {
  const x = useSharedValue(-width);

  useEffect(() => {
    if (active) {
      x.value = -width;
      x.value = withTiming(width, { duration: 400 });
    }
  }, [active]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { rotateZ: '20deg' }],
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, style, { overflow: 'hidden' }]}>
      <LinearGradient
        colors={['transparent', 'rgba(255,255,255,0.28)', 'transparent']}
        locations={[0.4, 0.5, 0.6]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ width: width * 0.4, height: '100%' }}
      />
    </Animated.View>
  );
}
```

**应用范围：** FAB 按压、主按钮「保存账单」按压、Tab 切换。

#### ③ Touch-Point Illumination（触点辐射光晕）

**视觉：** 按压点有一圈从小到大扩散的 radial 白光晕，**会传染到相邻玻璃元素**（这是 `GlassEffectContainer` 最大价值所在）。

**RN 实现（单元素版）：**

```tsx
function useTouchRipple() {
  const rippleX = useSharedValue(0);
  const rippleY = useSharedValue(0);
  const rippleR = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);

  const onPressIn = (e: GestureResponderEvent) => {
    rippleX.value = e.nativeEvent.locationX;
    rippleY.value = e.nativeEvent.locationY;
    rippleR.value = 0;
    rippleOpacity.value = 0.32;
    rippleR.value = withTiming(120, { duration: 480 });
    rippleOpacity.value = withTiming(0, { duration: 480 });
  };

  return { onPressIn, rippleX, rippleY, rippleR, rippleOpacity };
}
```

**辐射到相邻元素（多元素版）：** 需 §3.10 `GlassEffectContainer` 配合 —— 在容器层共享光晕 shared value。

#### ④ Drag 响应（胶体粘滞）

**视觉：** 拖拽玻璃 chip / slider 时，它**不是刚体**，边缘会有 3–5pt 的延迟形变。

**RN 实现：** Reanimated `withSpring` `mass: 1.2, damping: 10`，加上 `followDelay` 驱动子层跟随延迟。

**判定：** Drag 响应 **P2**，首版可省略。

---

### 3.10 G1 — GlassEffectContainer（共享采样区）

**Apple 铁律：** **玻璃不能采样玻璃。** 如果你在玻璃 A 上再叠一个玻璃 B，B 会看到一片灰蒙（因为 A 已经是模糊结果，不是原始内容）。

**SwiftUI 解法：** 把多个玻璃元素放进 `GlassEffectContainer`，容器提供**共享采样源**（从内容层统一采样一次），所有子玻璃都从此共享结果渲染 —— 并获得：
1. 性能提升（一次采样 vs N 次）
2. 统一视觉（所有子玻璃光影一致）
3. **Morphing 前置条件**（见 §3.11）

**RN 工程近似：**

```tsx
// src/components/ios/GlassEffectContainer.tsx（未来组件）
// 策略：只允许在容器外层做一次 BlurView 采样，内部子元素仅用 tint + hairline
function GlassEffectContainer({ children, intensity = 60, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      {/* 共享采样层 —— 整个容器只有这一层 BlurView */}
      <BlurView intensity={intensity} style={StyleSheet.absoluteFill} />
      {/* 子元素在此渲染，但子元素内禁止再嵌 BlurView */}
      <View style={styles.children}>{children}</View>
    </View>
  );
}

// 使用：TabBar 一个容器，内部三个 Tab 按钮只做 tint，不再各自 Blur
<GlassEffectContainer>
  <TabButton tint="accent"/>
  <TabButton tint="default"/>
  <TabButton tint="default"/>
</GlassEffectContainer>
```

**应用场景（建议）：** 🍎 OFF（SwiftUI 官方行为） 🛠️ RN-T2（近似，非物理等价）
- TabBar（多 Tab 图标）
- 工具栏多按钮（如 Chart 周/月/年分段 + 粒度分段并列时）
- FAB 展开菜单（主 FAB + 子 FAB 同为玻璃态时）
- Modal 内的分段控件组

**降级路径：** 若 `GlassEffectContainer` 模式的工程复杂度（多层嵌套、跨导航路由）不允许，按 **§21 D2 Accepted Deviation** 使用独立 `BlurView`，但须在对应相位 `VERIFICATION.md` 登记偏差原因。

**禁区：**
- ❌ 容器内再嵌 `BlurView`（打破共享采样原则）
- ❌ 容器跨屏（必须限定在一个屏幕内的相邻区）

---

### 3.11 E6 — Morphing（状态形变）

**Apple 原话：** 「Morphing — smooth shape transitions between glass elements as they appear, disappear, or change position. Enabled through `glassEffectID(_:in:)` combined with a `@Namespace`.」

**视觉：** 一个玻璃按钮点击后「长出」一行玻璃子按钮 —— 新按钮不是 fade-in，而是从原按钮的**形状边缘生长**出来，像水滴分裂。

**必要条件（SwiftUI）：**
1. 所有相关元素在同一 `GlassEffectContainer`
2. 每个元素有 `glassEffectID("unique-id", in: namespace)`
3. 元素条件渲染（`if expanded { ... }`）
4. 状态切换包 `withAnimation(.bouncy)`

**RN 工程近似（三档）：**

| 档 | 方案 | 效果 |
|----|------|------|
| **Tier 1（推荐）** | `react-native-shared-element` + 共享 ID | 接近 SwiftUI |
| **Tier 2** | 手动计算起止坐标 + Reanimated `withSpring` 驱动 `x/y/scale` | 需定制 |
| **Tier 3（保底）** | `FadeInDown` + `Scale 0.8→1` + `SPRING.THUMB` | 能用不惊艳 |

**示例（Tier 2）：**

```tsx
// FAB 主按钮展开为三子菜单
const expanded = useSharedValue(0); // 0 = 收起，1 = 展开
const child1Style = useAnimatedStyle(() => ({
  transform: [
    { translateY: interpolate(expanded.value, [0, 1], [0, -72]) },
    { scale: interpolate(expanded.value, [0, 1], [0.6, 1]) },
  ],
  opacity: expanded.value,
}));

const onToggle = () => {
  expanded.value = withSpring(expanded.value ? 0 : 1, SPRING.THUMB);
};
```

**判定：** Morphing 是 Liquid Glass 的灵魂之一，但 RN 成本高 —— Phase 16+ **重点 P1**，首版 FAB 菜单可用 Tier 3 保底。

---

### 3.12 E3 — Materialization（物化显现）

**视觉差异：**
- 普通 fade-in：元素透明度 0 → 1
- Liquid Glass Materialization：元素**同时** opacity 上升 + blur intensity 上升 + scale 微放大（0.92 → 1），**像水珠在空中凝结**

**RN 实现：**

```tsx
// 用于 Modal / Sheet / FAB 菜单首次出现
const opacity = useSharedValue(0);
const scale = useSharedValue(0.92);
const blurIntensity = useSharedValue(0); // 需 BlurView 的 animatedProps 支持

const materialize = () => {
  opacity.value = withTiming(1, { duration: 280 });
  scale.value = withSpring(1, SPRING.THUMB);
  blurIntensity.value = withTiming(60, { duration: 280 });
};

const dematerialize = () => {
  opacity.value = withTiming(0, { duration: 200 });
  scale.value = withSpring(0.92, SPRING.THUMB);
  blurIntensity.value = withTiming(0, { duration: 200 });
};
```

**应用：** 所有 Sheet / Modal / Popover / FAB 菜单的进出场，**替代** RN 默认 `animationType="fade"` 或 `"slide"`。

---

### 3.13 G3 — Tint（语义着色）

**原则：** Tint 只用于**传达语义**，绝不是装饰。

| Tint 语义 | 使用场景 | 本仓库映射 |
|----------|----------|------------|
| **Accent（蓝）** | 主操作 / CTA | `colors.accent` — FAB、保存按钮 |
| **Destructive（红）** | 删除 / 危险 | `colors.expense` — 删除按钮、Alert Destructive |
| **Success（绿）** | 确认 / 成功 | `colors.income` — Toast 成功态（未来） |
| **无 Tint** | 默认控件 | 不着色，保持透明玻璃 |

**RN 实现：**

```tsx
// 在玻璃容器上叠一层语义色 overlay（低 opacity）
<BlurView intensity={60}>
  {tint && (
    <View style={[
      StyleSheet.absoluteFill,
      { backgroundColor: tint, opacity: 0.24 },
    ]}/>
  )}
  {children}
</BlurView>
```

**禁区：**
- ❌ 用 Tint 当装饰（紫色玻璃做风格、粉色玻璃搞圣诞）
- ❌ 同屏 ≥ 2 种不同 Tint 的玻璃（混淆语义）
- ❌ Tint 饱和度 > 原色的 30%（一过就喧宾夺主）

---

### 3.14 玻璃效果验收清单（Reviewer Sub-Checklist）

PR 若涉及玻璃控件，**必须**逐项勾：

- [ ] **E1 Lensing**：至少 Tier 1（BlurView + 顶部高光 + 底部收边）
- [ ] **E2 Specular**：顶部 1px hairline 高光（动态姿态为 P2 可选）
- [ ] **E3 Materialization**：进出场使用 opacity + scale + blur 三联动，非单 fade
- [ ] **E4 Shimmer**：主操作按压有高光扫过（FAB 必做、次按钮可选）
- [ ] **E5 Ripple**：按压有触点辐射（至少单元素版）
- [ ] **E6 Morphing**：状态切换用 `SharedElement` 或 Tier 3 保底，不可硬切
- [ ] **E7 Vibrancy**：玻璃内所有文字用 `VibrantText` 或等效策略
- [ ] **E8 Adaptive Depth**：暗背景下玻璃 `intensity` ↑（Dark 走 `tint="dark"`）
- [ ] **G1 Container**：同屏 ≥ 2 个玻璃相邻 → 必须 `GlassEffectContainer`
- [ ] **G3 Tint**：仅语义色（accent / expense / income），无装饰着色

---

## 四、色彩系统

### 4.1 色彩哲学：**内容浸透控件（Content Infuses Controls）**

控件 / 导航**不要**饱和着色 —— 让下方内容的颜色透过玻璃反映到控件上。Apple 原文：「Be judicious with your use of color in controls and navigation so they stay legible and allow your content to infuse them and shine through.」

**本仓库 60/30/10 配比（强制）：**
- **60%** `colors.canvas` / `colors.surface` 中性底（画布）
- **30%** `colors.title` / `colors.lightTitle` 文本
- **10%** `colors.accent`（蓝）/ `colors.expense`（红）/ `colors.income`（绿） —— **仅用于强调与语义**

### 4.2 强调色使用清单（Accent Reserved List）

`colors.accent`（`#007AFF` / dark `#0A84FF`）**只允许**出现在：

| 允许场景 | 举例 |
|----------|------|
| 主操作 FAB | 记一笔按钮 |
| 主按钮 / CTA | 「保存账单」、「添加资产」 |
| 选中 Tab 图标 & 文字 | `tabBarActive` |
| 选中分段拇指文字 | `SegmentedTwo` 激活态 |
| 可点击链接 | 设置项中的「详情」 |
| 金额编辑态中的小数点光标 | Create 界面金额 |

**禁止**：大面积 Banner 底、列表行默认背景、图表主色。

### 4.3 语义色双通道

| 语义 | Light | Dark | 使用场景 |
|------|-------|------|----------|
| 支出 | `#FF3B30` | `#FF453A` | 账单金额（支出）、图表柱（支出）、Chart 进度条 |
| 收入 | `#34C759` | `#30D158` | 账单金额（收入）、图表柱（收入） |
| 文本 | `#000000` | `#FFFFFF` | 主要标题 |
| 次文本 | `rgba(60,60,67,0.6)` | `rgba(235,235,245,0.6)` | 副标题 / 副信息 |
| 分隔 | `rgba(60,60,67,0.18)` | `rgba(84,84,88,0.65)` | `hairlineBorder` |

### 4.4 深色模式（Dark Mode）

- **必须**：所有新组件同时测试 Light / Dark；未测试 → 不得合并。
- **实现**：使用 `useAppTheme().colors`（Phase 11 已就绪），**禁止**直接 import `lightPalette` 作为硬编码。
- **Dark 校准**：iOS 在深色下把纯黑 `#000` 用作 canvas，是刻意的 OLED 省电策略 —— 不要改成 `#1C1C1E`；surface 仍用 `#1C1C1E`。

### 4.5 色彩禁区

- ❌ 自定义渐变用于主流场景（除非受明确 UI-SPEC 授权）
- ❌ 饱和度高于系统 Blue 的自定义蓝
- ❌ 非语义色（紫 / 橙 / 粉）用于控件 —— 仅可用于分类图标（category icons）

---

## 五、字体与排版（Typography）

### 5.1 iOS 26 字体三大变化

| 变化 | 描述 | 本仓库应用 |
|------|------|-------------|
| **废弃 ALL CAPS** | 设置分组标题从 `"VISION"` 改为 `"Vision"` | 所有 SectionHeader **禁止** `textTransform: 'uppercase'` |
| **左对齐替代居中** | Alert / Onboarding / 设置头部 —— 左对齐更易读 | `Alert` 文案使用系统默认；自建说明块左对齐 |
| **列表标题增大 + 加粗** | 相比 iOS 18，列表标题字号增大，权重补偿 | `iosType.navTitle` 17/600（已对齐） |

### 5.2 字阶（Type Scale）— 强制

> 本仓库 `src/theme/typography.ts` 定义为**唯一来源**。禁止在 StyleSheet 直接写 `fontSize` / `fontWeight`，**必须** 从 `iosType` 或本表派生。

| Token | fontSize | weight | lineHeight | 用途 |
|-------|----------|--------|------------|------|
| `largeTitle` | 20 | 600 | 26 | 屏顶大标题（Home 月份数字） |
| `navTitle` | 17 | 600 | 22 | 屏幕标题、卡片标题、Section 头 |
| `body` | 17 | 400 | 22 | 列表主文案、按钮文字 |
| `callout` *(新增)* | 16 | 400 | 21 | 副文案 / 较小的 body |
| `footnote` | 13 | 400 | 18 | 辅助说明、日期、金额小数 |
| `caption1` | 12 | 400 | 16 | 图表轴、角注、微提示 |

**扩展规则：** 若需新字阶，必须先在 `typography.ts` 增加，再 PR 引用；不得在组件内 one-off。

### 5.3 排版铁律

1. **推荐正文 17pt**（Apple Typography 默认值，见 [HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography) 🍎 OFF）；**技术最小 11pt**（系统允许），**本仓库下限 12pt**（仅 `caption1` 使用），13pt 以上（`footnote`）为辅助信息区，17pt（`body` / `navTitle`）为主信息区。
2. **行高 / 字号 = 1.2 ~ 1.35**（已在上表固化）。
3. **等宽数字（Tabular Numerals）** 用于金额：
   ```ts
   { fontVariant: ['tabular-nums'] as const }
   ```
4. **金额张力（Amount Tension）**：
   - 整数部分 `fontSize: 28, fontWeight: '700'`
   - 小数部分 `fontSize: 20, fontWeight: '500', opacity: 0.78`
   - 货币符号 `fontSize: 16, fontWeight: '500'`
   - 三者共用基线（`lineHeight` 对齐），形成「大数字 + 小数 + 符号」的视觉节奏
5. **禁止**：字符间距 `letterSpacing` 在中文上用（会破坏 kerning）；英文标题可 `-0.4`。
6. **Dynamic Type** 支持：关键文案**未来**要响应 `PixelRatio.getFontScale()`，保持 8pt 网格自适应（Phase 16+ 开启）。

---

## 六、间距 / 圆角 / 同心（Concentric）几何

### 6.1 8pt 网格（Apple HIG）

所有 `padding` / `margin` / `gap` **必须**是 4pt 的倍数，优先 8pt 节律：

```
4  8  12  16  20  24  32  40  48
```

禁止出现 5、7、11、13、15、17、19、22 等「反网格」数值。

### 6.2 间距 Token 映射（本仓库）

| 语义 | 数值 | 引用 |
|------|------|------|
| 列表水平 inset | `16` | `listContentInset` |
| Section 紧凑 | `16` | 卡片之间 |
| Section 舒适 | `24` | 不同逻辑分组之间 |
| 行内图标间距 | `8` | 图标与文字 |
| 大标题底距 | `12` | largeTitle 下到 sub |
| FAB 到屏边 | `16` | 右下 |
| FAB 到底部安全区 | `24` | 垂直 |

### 6.3 圆角规模（iOS 26：「更圆更松」）

| Token | 半径 | 用途 | 建议改进 |
|-------|------|------|-----------|
| `radii.chip` | 10 | chip / 小徽章 | 保持 |
| `radii.card` | 12 | 卡片 / 列表分组 | **建议提升到 14**（对齐 iOS 26 的 `sheet`） |
| `radii.sheet` | 14 | Sheet / Modal | **建议提升到 20**（iOS 26 Sheet 半径 ~20-24） |
| `radii.pill` | 999 | 胶囊按钮 | 保持 |
| *新增* `radii.roundedButton` | 22 | FAB 小尺寸 | 新 token，覆盖 `SegmentedTwo` 拇指 |

### 6.4 同心圆角（Concentric Corners）

**定义：** 子元素 `cornerRadius` = 父元素 `cornerRadius` − `padding`，从而内外圆角中心重合，视觉上「同心」。

**规则：**
```
父容器（cornerRadius=16, padding=12）
  └─ 子元素（cornerRadius = 16 - 12 = 4）
```

**工程化（本仓库）：**
```ts
// src/theme/layout.ts（未来新增）
export const concentricRadius = (outerRadius: number, padding: number) =>
  Math.max(0, outerRadius - padding);
```

**典型场景：**
| 场景 | 外层 | 内边距 | 内层应用 |
|------|------|--------|----------|
| 卡片内按钮 | 14 | 12 | 2（近直角，刚好） |
| Sheet 内分组 | 20 | 16 | 4 |
| Modal 内卡片 | 20 | 20 | 0（矩形 OK） |
| 屏幕内 GroupedInset | 设备圆角 ~47 | 16 | 14 ≈ `radii.card` ✅ |

### 6.5 同心安全区

所有 L2 控件（TabBar、Sheet、Toolbar）**必须**从屏幕边缘内缩 ≥ 16pt，使其圆角与设备屏幕圆角「同心」。已在 `listContentInset` 中实施 — 未来新组件继承此约定。

---

## 七、阴影与层次（Elevation）

### 7.1 iOS 26 阴影语言：**极轻、大模糊半径**

iOS 26 的阴影**不是**为了「立体」，而是为了**锚定层级**。视觉特征：**低 opacity × 大 blur × 小 offset**。

### 7.2 阴影 Token（本仓库已固化）

| Token | offset | opacity | blur | 用途 |
|-------|--------|---------|------|------|
| `shadows.card` | 0/1 | 0.06 | 3 | 列表行轻微抬起 |
| `shadows.raised` | 0/1 | 0.08 | 4 | 次级按钮、Modal 内卡片 |
| `shadows.grouped` | 0/4 | 0.05 | 14 | 分组卡片浮起（主力） |
| `shadows.fluentButton` | 0/2 | 0.12 | 4 | 主按钮 |
| `shadows.keyCap` | 0/2 | 0.12 | 3 | 计算器键帽 |
| `shadows.keyCapAccent` | 0/3 | 0.2 | 4 | 计算器主键 |
| `shadows.fab` | 0/6 | 0.24 | 12 | 悬浮主按钮 |
| `shadows.headerFab` | 0/3 | 0.18 | 6 | 导航栏小圆按钮 |
| `shadows.headerIconWash` | 0/1 | 0.08 | 3 | 次级头部图标底 |
| `shadows.categoryCellOn` | 0/1 | 0.09 | 3 | 分类格选中 |

### 7.3 规则

1. **同层同阴影**：同一视觉层级的元素必须复用同一阴影 token，绝不混用。
2. **暗色模式**：iOS 在 OLED 上阴影几乎不可见；Dark 模式下**不做**阴影变体 —— 改用 `border` + `divider` 描边强化层级。
3. **Android 回退**：使用 `Platform.select` + `elevation`（已在 tokens 中实现）。
4. **禁止**：`shadowRadius > 20` 的「光晕阴影」；`shadowColor` 非黑（除非特殊语义，如 FAB 呼吸光晕）。

### 7.4 替代层级手段（无阴影时）

- `backgroundColor` 对比：`canvas (#F2F2F7)` vs `surface (#FFFFFF)`
- `hairlineBorder`：`StyleSheet.hairlineWidth` + `divider`
- `padding` 留白呼吸

---

## 八、导航与布局结构

### 8.1 四种导航骨架（按使用频率）

| 骨架 | 场景 | 本仓库对应 |
|------|------|-------------|
| **Tab Bar** | 根导航（3–5 个） | `RootNavigator` 四屏 Tab |
| **Navigation Stack（Toolbar）** | 内页递进 | `CreateBillScreen`、`BillDetailScreen` |
| **Sheet / Modal** | 异步任务、上下文操作 | Budget / Asset Modal、`BillCalculator` |
| **Popover**（iPad） | 弱操作菜单 | N/A（本仓库暂不支持 iPad 独立布局） |

### 8.2 Tab Bar（iOS 26 浮动 Tab）

- **位置**：屏幕底部，左右各留 `listContentInset` 同心内缩。
- **材质**：Liquid Glass `.regular`（`IOSChromeGlassBackground`）。
- **动态收缩（Dynamic Collapse）**：向下滚动时标签文字渐隐，仅留图标；回滚展开。
- **搜索位于底部**（iOS 26 新规）：Tab 项若含搜索，搜索入口应放在 Tab 栏内最右而非顶部。
- **本仓库当前**：已有 `IOSChromeTabBarButton`；**未来**（Phase 16+）增加 Dynamic Collapse，见 §11.7。

### 8.3 Toolbar（原 Navigation Bar）

- **iOS 26 更名为 Toolbar**；支持 **subtitle**（次级标题）。
- **左对齐** 支持（不再强制居中）。
- **操作图标优先于文字**（`Labeled actions → Icon buttons`）。
- **Icon buttons 带容器**：Back 按钮变为 **圆形深色底容器** + 箭头，而非纯文字 `< Back`。

**本仓库落地：**
```tsx
// 未来 Toolbar 规范
<Stack.Screen options={{
  headerTitle: "明细",
  headerSubtitle: "2026 年 4 月",          // 新支持
  headerTitleAlign: "left",                 // 左对齐
  headerBackTitleVisible: false,            // 去除 "Back" 文字
  headerBackImage: () => <CircularBackButton />, // 圆形容器 + 箭头
}}/>
```

### 8.4 内容边缘效果（Scroll Edge Effect）

- 当内容滚动到顶栏/底栏之下时，顶栏会自动 **模糊遮蔽** 穿过的内容 —— 保持易读性。
- **本仓库 RN 实现**：`onScroll` + `scrollY > 40` 时给 Toolbar 加 `BlurView`；回滚到 `scrollY < 20` 恢复透明。

### 8.5 背景延展（Background Extension）

iOS 26 新概念：Sidebar / Inspector 之下的内容 **镜像延展** 到侧栏底下，产生「内容无边」错觉。手机端**较少用**，仅 Phase 16+ iPad 适配时考虑。

### 8.6 交互重心下沉

**核心规则：** 主操作落在屏幕 **下 1/3**（拇指舒适区）。

| 元素 | 位置要求 |
|------|----------|
| 主 FAB（记一笔） | 右下，距底 24pt、距右 16pt |
| 主 CTA 按钮 | 底部 dock 或 Sheet 底部 |
| 搜索入口 | Tab 栏内 或 屏幕底部 |
| 分段切换（周/月/年） | 内容顶部附近（弱操作）或底部（强操作） |
| 危险操作（删除） | Sheet 底部、红色、二次确认 |

---

## 九、控件语言（Controls）

### 9.1 按钮（Button）

| 类型 | SwiftUI | RN 近似（本仓库） | 用途 |
|------|---------|------------------|------|
| Prominent | `.buttonStyle(.glassProminent)` | `View` 实色 `colors.accent` + `shadows.fluentButton` | 主操作 |
| Glass | `.buttonStyle(.glass)` | `BlurView` + `colors.surface overlay` | 次操作 |
| Plain | `.buttonStyle(.plain)` | `Pressable` 无背景 | 文字链接 |
| Bordered | — | `hairlineBorder` + `surface` | 辅助 |

**尺寸（iOS 26 新增 `.extraLarge`）：**

| Token | height | 用途 |
|-------|--------|------|
| small | 32 | 辅助 chip |
| regular | 44 | **默认**（HIG 最小触控 44×44） |
| large | 50 | 表单主按钮 |
| extraLarge | 60 | 着陆 CTA、记一笔保存 |

**禁令：**
- ❌ 文字按钮宽度 < 44pt
- ❌ 按钮内文字 + 图标间距 ≠ 8pt
- ❌ 主按钮文字 < 17pt

### 9.2 分段控件（Segmented Control）

- **iOS 26 行为：** 拇指（Thumb）**必须** 用弹簧滑动过渡，非瞬切。
- **本仓库：** `SegmentedTwo` **未来升级** 为 `SpringSegmented`（见 §11.1）。
- **尺寸：** 轨道高 32、拇指高 28、水平 padding 2。
- **文字：** `iosType.footnote` 13/600（激活态）、13/400（默认态）。

### 9.3 列表行（List Row）

- **最小高度 44pt**（触控必须）。
- **图标区 40×40**，**文字区** flex，**副信息区** 右对齐。
- **按压态**：`scale → 0.97` + `opacity → 0.92` + 弹簧回弹。
- **选中态**：`colors.accentSelection` 半透明底。
- **禁止**：自定义 checkbox 形态；分隔线与系统 hairline 不一致。

### 9.4 Slider / Stepper / Toggle

- iOS 26：拇指在交互时**变为 Liquid Glass**（微抬起 + 高光扫过）。
- **本仓库未来**：如果引入 Slider，必须用 Reanimated 拇指 + `expo-haptics selectionAsync()` 每个刻度 tick。

### 9.5 FAB（Floating Action Button）

- **形状**：圆形 `radii.pill`。
- **大小**：56×56（主）、36×36（导航内）、64×64（扩展大号）。
- **阴影**：`shadows.fab`。
- **按压**：`scale → 0.94` + 同帧 `Haptics.impactAsync(Medium)`。
- **位置**：右下固定；滚动**不动**（绝对定位）。
- **多 FAB（菜单展开）**：必须用 **Morphing**（见 §11.3），不可简单 fade。

### 9.6 分类网格（Category Grid）—— 记一笔专用

- **列数**：4 列（宽屏 5 列）。
- **Cell 尺寸**：`(screenWidth - listContentInset*2) / 4 - gap` 自适应。
- **选中态**：不加玻璃，用**色相化圆形底**（category color @ 0.12 opacity）+ `shadows.categoryCellOn`。
- **标签**：`iosType.caption1` 12/400，最多 4 字符，过长 tail-truncate。

---

## 十、Sheet / Modal / Popover / Alert

### 10.1 Sheet（iOS 26 重塑）

| 属性 | iOS 26 规范 | 本仓库落地 |
|------|-------------|-------------|
| 圆角 | 20–24pt（更圆） | `radii.sheet` 升级到 20 |
| 内缩 | 四周距屏边 8pt（露出下层内容） | `margin: 8` |
| 背景 | Liquid Glass `.regular` | `surface` 实色 + `BlurView`（未来） |
| 顶部 handle | 深色 hairline 短横 | `divider` `width: 36, height: 5` |
| 分级高度 | 支持 `medium` / `large`，自动切换到 **opaque background** 于 `large` | RN 手势可选（Phase 16+） |
| 进出场 | Spring `SHEET` | `withSpring({damping:20, stiffness:200})`（见 §11.4） |
| Scrim | `colors.modalScrim` `rgba(0,0,0,0.42)` | 已实现 |

### 10.2 Modal

- **全屏 Modal**：仅用于**完整独立任务**（如创建/编辑账单）—— 本仓库的 `CreateBillScreen` 就是典型。
- **进出场**：从底部滑入（Stack 原生）+ Spring；退出时「放弃本次编辑」确认（Alert）。

### 10.3 Popover（iPad / 未来支持）

- 小型临时菜单，位置**跟随触发点**。
- 手机端退化为**底部 Action Sheet**。
- **iOS 26 新规**：Popover / Action Sheet **出现在手指点击位置附近**，而非屏幕中央。

### 10.4 Alert（系统级）

- **始终用系统 `Alert.alert()`** —— 不要自建 Alert UI。
- **文字**：标题左对齐、内容左对齐（iOS 26 新）。
- **Destructive 按钮**：红色、在 Cancel 上方。
- **触觉**：呼出 = `light`、Destructive 按下 = `error`。

---

## 十一、动效系统（Motion）

> **核心公式：** 位置/尺寸过渡走弹簧；颜色/透明度走 timing。

### 11.1 全局弹簧表（**唯一来源** `src/theme/motion.ts`）

> *当前仓库的 `src/theme/motion.ts` 已被 Phase 15 revert 清除。本文声明其为**未来必恢复资产**，Phase 16 第一件事即重建此文件。*

```ts
export const SPRING = {
  UI:      { damping: 15, stiffness: 220, mass: 1    }, // 主弹簧
  THUMB:   { damping: 13, stiffness: 260, mass: 0.9  }, // 分段拇指、chip
  SHEET:   { damping: 20, stiffness: 200, mass: 1.1  }, // 底部 sheet / 大浮层
  GESTURE: { damping: 12, stiffness: 300, mass: 1    }, // 手势复位
} as const;

export const REDUCE_SPRING = { damping: 50, stiffness: 400, mass: 1 };

export const FADE_MS = {
  fast: 120,   // 小 fade（按压 opacity）
  normal: 200, // 图表整区 fade
  slow: 350,   // Scrim / 背景过渡
} as const;
```

### 11.2 分段拇指（Spring Thumb） — **P0**

- 拇指层绝对定位，onLayout 量测各段位置。
- 点击：`thumbX.value = withSpring(positions[i].x, SPRING.THUMB)`。
- 快速连点时 **不重置**，跟随最后目标。

### 11.3 按压弹簧（Spring Press） — **P0**

统一 Hook `useSpringPress`：
- `onPressIn`: `scale → 0.97` + `opacity → 0.92`，`SPRING.UI`。
- `onPressOut`: `scale → 1` + `opacity → 1`，`SPRING.UI`。
- **同帧**触发 `Haptics.selectionAsync()`（见 §13）。

**覆盖范围：** 所有 `Pressable` / 列表行 / 按钮 / FAB / chip / 分类格。

### 11.4 Sheet 进出场

```tsx
// 打开
slideY.value = withSpring(0, SPRING.SHEET);
scrimOpacity.value = withTiming(1, { duration: FADE_MS.normal });
// 关闭
slideY.value = withSpring(80, SPRING.SHEET);
scrimOpacity.value = withTiming(0, { duration: FADE_MS.fast });
```

### 11.5 图表柱 Stagger Spring — **P1**

```tsx
useEffect(() => {
  points.forEach((pt, i) => {
    setTimeout(() => {
      barHeights[i].value = withSpring(targetH, SPRING.UI);
    }, i * 30); // stagger 30ms
  });
}, [points]);
```

### 11.6 列表入场（FadeInDown Stagger）

```tsx
<Animated.View entering={FadeInDown.delay(i * 40).springify().damping(15)}>
  <ListRow ... />
</Animated.View>
```

切页、筛选不用 stagger（整组 `withTiming(1, FADE_MS.fast)`）。

### 11.7 Header 收缩（Scroll-Driven Collapse）

```tsx
const scrollY = useSharedValue(0);
const headerHeight = useAnimatedStyle(() => ({
  height: interpolate(scrollY.value, [0, 60], [72, 44], Extrapolate.CLAMP),
}));
```

回滚到顶 → 大标题重展开。

### 11.8 Morphing（RN 近似）

SwiftUI 的 `glassEffectID` 无法直接复刻。RN 近似：
- 对同一逻辑对象（如 FAB 展开为菜单）使用 `SharedElement`（`react-native-shared-element`），或
- 手动计算起止坐标 + Reanimated `withSpring` 驱动 `scale/x/y` 形变。

判定边界：若 SwiftUI 原生 Morphing 耗时 ≥ 2 个工作日实现，可 **Accepted Deviation** 降级为 `FadeIn + Translate` 合成动效。

### 11.9 Reduce Motion 降级（全局）

```ts
const reduce = useReduceMotion();
const spring = reduce ? REDUCE_SPRING : SPRING.UI;
```

规则：
- Scale 动效 → `withTiming(val, {duration: 100})` 短 fade
- Stagger 入场 → 全部同帧（delay=0）
- 弹簧 → `REDUCE_SPRING`（几乎无弹跳）
- **触觉保留**（触觉本身是辅助功能）

---

## 十二、手势与交互（Interaction）

### 12.1 手势库

- **默认** `react-native-gesture-handler`（与 Reanimated 天然协作）。
- 优先 `Gesture.Tap()` / `Gesture.Pan()` / `Gesture.LongPress()`。
- 禁止继续使用老的 `PanResponder`（性能 + 一致性差）。

### 12.2 标准手势清单

| 手势 | 语义 | 本仓库场景 |
|------|------|-------------|
| Tap | 选中 / 执行 | 所有 Pressable |
| Long Press（500ms） | 进入编辑 / 呼出菜单 | 账单行进入编辑（Phase 16+ 计划） |
| Swipe Left | 行内删除 | 账单行「删除」（Phase 16+） |
| Swipe Right | 行内标记 | 账单行「设为已付」（Phase 17+） |
| Pan（sheet handle） | 下拉关闭 | Sheet 手柄 |
| Pinch | 图表缩放 | **不采用**（复杂度 vs 价值不匹配） |
| Double Tap | 快速切换 | **不采用**（与 Tap 歧义） |

### 12.3 边界回弹（Rubber Band）

ScrollView 顶/底边界的「橡皮筋」—— iOS 原生自动，RN 需：
- `bounces: true`（iOS 默认）
- 自定义 Pan 拖拽时，`translationY > maxY` 用 `0.55^n` 递减因子限位。

### 12.4 触点反馈（Touch Illumination）

- iOS 26 玻璃控件：触点处**向外辐射**光晕。
- RN 近似：按压态 `radial-gradient` 或 `Animated.View` 在触点坐标放大 opacity。
- **优先级 P2**，非阻塞。

---

## 十三、触感反馈（Haptics）

### 13.1 iOS 触感三大类

| 类别 | API（SwiftUI） | expo-haptics 等效 | 使用场景 |
|------|---------------|-------------------|----------|
| **Impact** | `.sensoryFeedback(.impact(.light/medium/heavy))` | `Haptics.impactAsync(Light/Medium/Heavy)` | 按压、碰撞、状态达成 |
| **Notification** | `.sensoryFeedback(.success/warning/error)` | `Haptics.notificationAsync(Success/Warning/Error)` | 操作结果通告 |
| **Selection** | `.sensoryFeedback(.selection)` | `Haptics.selectionAsync()` | 选择器 tick、分段切换 |

### 13.2 全仓库场景映射表（强制）

> *此表对应原 `src/utils/haptics.ts`。Phase 16 第一件事即恢复该文件。*

| 场景 | 类别 | 强度 | 触发时机 |
|------|------|------|----------|
| 分段 / 周期 chip 切换 | Selection | — | `onPress` 同帧（动画启动前） |
| 列表行按压 | Impact | Light | `onPressIn` 同帧 |
| FAB 按压 | Impact | Medium | `onPressIn` 同帧 |
| 记一笔保存成功 | Notification | Success | `onSave` 回调后 |
| 记一笔校验失败 | Notification | Error | Alert 弹出前 |
| 删除账单 / 账户确认 | Notification | Error | 确认 Destructive 前（预警） |
| 滚动到边界 | Impact | Light | onScroll 命中顶/底 |
| 长按进入编辑 | Impact | Medium | `onLongPress` 触发点 |
| 预算 / 资产 保存 | Notification | Success | 持久化成功后 |
| Modal / Sheet 呼出 | Impact | Light | `setVisible(true)` |
| Modal / Sheet 关闭 | — | — | 不触发（避免与按键叠加） |
| 开关 Toggle | Selection | — | 状态切换 |
| 日期选择器滚动 tick | Selection | — | 每个值 |
| 周/月/年切换 | Selection | — | `onPress` |

### 13.3 触感铁律

1. **同帧**：触觉与视觉必须同一帧触发；异步 > 50ms 即为缺陷。
2. **不过量**：`impactAsync(Heavy)` 全仓库限用 **0 次**（太震），默认最多用到 Medium。
3. **Reduce Motion 保留**：触觉是辅助功能本身，不跟随 Reduce Motion 关闭。
4. **系统开关**：用户在 Settings 关闭触觉时自动失效 —— 不需要 app 层判断。
5. **Android 行为**：`expo-haptics` 在 Android 映射到 `Vibrator`，体验次一档 —— 允许，不禁用。

---

## 十四、声音反馈（Sound）

- **默认：不引入自定义音效。** iOS 系统本身在触觉上附带微声反馈（如删除邮件的「噗」）—— 交给系统。
- **例外**：仅在以下场景允许**系统声**：
  - 删除成功 → `SystemSoundID(1104)` （可选）
  - 成功提交 → 仅触觉，无声
- **禁止**：自定义 `mp3` / `wav` 背景音、按钮音效（低端感）。
- **未来扩展**：若引入游戏化 Phase（如「记账连击」），可单独评审。

---

## 十五、反馈层级与状态叙事（Feedback & State）

### 15.1 即时反馈三位一体

```
用户操作 → 视觉（按压/移动） ──┐
          → 触觉（同帧）     ─ 100ms 内双轨到位
```

（声音：默认交给系统触觉附带的微声；自定义音效见 §14 —— 非常规情况不引入）

### 15.2 状态叙事（State Storytelling）

| 状态 | 视觉语言 | 动效 | 触觉 | 文案 |
|------|---------|------|------|------|
| **空** | 插图 + 引导 CTA | `FadeInDown` | 无 | 「还没有账单，去记一笔 →」 |
| **加载** | Skeleton 或 Spinner | 循环 pulse | 无 | 无文案（避免嘈杂） |
| **成功** | 绿色微光 + 对勾 | `scale 0→1.1→1` 弹簧 | Success | 「已保存」 |
| **失败** | 红色震动 + 圆 X | `translateX ±6` 两次 | Error | 具体原因（非「出错了」） |
| **确认** | Alert | 原生 | Light（呼出时） | 「确定删除吗？」 |

### 15.3 空状态（Empty State）铁律

1. **永远有 CTA**：不能只摆一句「暂无数据」。本仓库规范：
   - 账单空 → 「去记一笔」按钮
   - 图表空 → 「去记一笔」按钮
   - 预算空 → 「设置本月预算」按钮
   - 资产空 → 「添加资产」按钮
2. **插图可选**：若有，必须**单色线稿 + `colors.lightTitle`**，不要花哨。
3. **文案**：对话感、口语化；禁用「尚未」/「不存在」/「没有找到」。
4. **CTA 是 SpringPressable**：必须走按压弹簧 + 触觉。

### 15.4 错误处理

- 表单校验：**行内提示**（字段下方红字 `caption1`），而非 Alert。
- 系统错误：Alert + Error 触觉 + 「重试」CTA。
- 网络错误：本 App 纯本地 SQLite，**不存在** —— 若未来引入，按上条。

---

## 十六、无障碍（Accessibility）

### 16.1 必做项（不做即缺陷）

| # | 项 | 验证手段 |
|---|----|----------|
| A1 | 最小触控 44×44pt | Figma / 手测 |
| A2 | 对比度 ≥ 4.5:1（正文）/ 3:1（大文本） | Xcode Accessibility Inspector |
| A3 | `accessibilityLabel` 齐全（图标按钮必填） | VoiceOver 跑一遍 |
| A4 | `accessibilityRole` 正确（button/header/link） | 同上 |
| A5 | Dynamic Type 支持（未来 Phase 16+） | 设置 → 文字大小拉最大 |
| A6 | Reduce Motion 全局降级（见 §11.9） | 设置 → 辅助功能 → 运动 |
| A7 | Reduce Transparency 全局降级 | `useReduceTransparency` hook 已实现 |
| A8 | Increased Contrast 适配 | 系统开启后验证 hairline 可见性 |
| A9 | Tinted Mode（iOS 26.1+）不崩 | 系统开启后验证 |

### 16.2 VoiceOver 清单

- 所有 `Pressable` 必有 `accessibilityLabel`；图标按钮必有。
- 列表行 `accessibilityLabel` 格式：`"金额 时间 分类"`，用逗号分隔帮助断句。
- 分组 Section 用 `accessibilityRole="header"`。
- 图表：提供 **数据 summary 文本**（如「4 月支出 ¥3,240，收入 ¥5,000」），而非依赖视觉。

### 16.3 禁区

- ❌ 纯色阻塞（无对比）
- ❌ 仅颜色传达状态（必须 + 图标/文字）
- ❌ 动画无降级路径

---

## 十七、性能与取舍（Performance）

### 17.1 帧率目标

- **主操作 60 FPS**（iPhone 12 mini 及以上）。
- **动画 120 FPS**（支持 ProMotion 的机型；`Reanimated 4.x` worklet 原生驱动）。
- **JS 线程帧率 ≥ 55 FPS**（开发模式宽松）。

### 17.2 玻璃性能预算

- **同屏 `BlurView` ≤ 3 个**；超过分层合并。
- Android `BlurView` 性能差，回退为半透明实色 + hairline。
- `BlurView` 嵌套 `Animated.View` 时，动画只改 `opacity/transform`，**不改 blur intensity**（昂贵）。

### 17.3 列表性能

- 长列表（> 50）**必须** `FlatList` + `keyExtractor` + `getItemLayout`（可能）。
- 图标组 `SectionList`（账单按日分组已做）。
- 行组件 `React.memo`，props 变化走浅比较。

### 17.4 取舍矩阵

| 项 | 代价 | 收益 | 判断 |
|----|------|------|------|
| 列表行 Spring Press | 低 | 高 | **必做** |
| 图表 Stagger | 低 | 高 | **必做** |
| Morphing FAB | 高 | 中 | Phase 16+ 评审 |
| Scroll Header Collapse | 中 | 中 | Phase 16 |
| 自定义玻璃（非系统 BlurView） | 极高 | 低 | **不做** |
| 自定义 Skia Lensing | 极高 | 视觉震撼 | **不做**（等 RN 原生提供） |

---

## 十八、本仓库 Token 映射

### 18.1 现有资产（可直接使用）

| 类别 | 文件 | 导出 |
|------|------|------|
| 色彩 | `src/theme/palette.ts` | `lightPalette`, `darkPalette`, `AppPalette` |
| 色彩（运行时） | `src/theme/useAppTheme.ts` | `useAppTheme().colors` |
| iOS 语义色 | `src/theme/colors.ts` | `getIosSemantic(palette)` |
| 字体 | `src/theme/typography.ts` | `iosType` |
| 圆角 / 阴影 / 间距 | `src/theme/layout.ts` | `radii`, `shadows`, `listContentInset`, `fabSize`, ... |
| 玻璃背景 | `src/components/ios/IOSChromeGlassBackground.tsx` | 组件 |
| 分段控件 | `src/components/ios/SegmentedTwo.tsx` | 组件 |
| 分组 inset | `src/components/ios/GroupedInset.tsx` | 组件 |
| 列表行 | `src/components/ios/ListRow.tsx` | 组件 |
| FAB | `src/components/ios/Fab.tsx` | 组件 |
| Reduce Transparency | `src/hooks/useReduceTransparency.ts` | Hook |

### 18.2 缺失资产（**Phase 16 必补**）

| 类别 | 文件 | 说明 |
|------|------|------|
| 动效 tokens | `src/theme/motion.ts` | `SPRING`, `REDUCE_SPRING`, `FADE_MS` |
| 按压 Hook | `src/hooks/useSpringPress.ts` | 统一按压弹簧 |
| Reduce Motion Hook | `src/hooks/useReduceMotion.ts` | 全局降级 |
| 触觉 Helper | `src/utils/haptics.ts` | 包装 `expo-haptics` |
| Spring 按压组件 | `src/components/SpringPressable.tsx` | 通用按压壳 |
| 同心圆角 Helper | `src/theme/layout.ts` 增加 | `concentricRadius(outer, padding)` |
| 字阶扩展 | `src/theme/typography.ts` 增加 | `callout`, 加 `lineHeight` |
| 圆角扩展 | `src/theme/layout.ts` 增加 | `radii.roundedButton` = 22；`radii.sheet` → 20 |
| **玻璃容器（共享采样）** | `src/components/ios/GlassEffectContainer.tsx` | 多玻璃元素共用一层 BlurView（§3.10） |
| **Vibrancy 文本** | `src/components/ios/VibrantText.tsx` | 玻璃内文字统一壳（§3.8） |
| **玻璃 Shimmer** | `src/components/ios/GlassShimmer.tsx` | 按压高光扫过（§3.9 ②） |
| **触点辐射 Hook** | `src/hooks/useTouchRipple.ts` | 按压点 radial gradient（§3.9 ③） |
| **陀螺仪高光 Hook** | `src/hooks/useGyroHighlight.ts` | 设备姿态驱动高光（§3.7，P2） |
| **物化进出场 Hook** | `src/hooks/useMaterialize.ts` | opacity + scale + blur 三联动（§3.12） |

> **依赖新增：** `expo-sensors`（陀螺仪）、`expo-linear-gradient`（shimmer / tint overlay）、可选 `@shopify/react-native-skia`（Tier 2 Lensing）、`react-native-shared-element`（Tier 1 Morphing）。

> **依赖：** `expo-haptics` 需重新安装 —— Phase 15 revert 时被移除。

---

## 十九、组件级实现规范

### 19.1 HomeScreen

- **顶栏**：保留当前月份 Banner 实色（非玻璃）；未来 Phase 16+ 可选 Scroll Header Collapse。
- **FAB 列**：右下 3 个（日历、查账、记一笔）；记一笔为主 FAB 56×56 `colors.accent`，其余 36×36 `colors.surface`。
- **列表**：`SectionList` 按日分组；每行 SpringPress + Haptic Light；Stagger 入场 40ms。
- **空状态**：「还没有账单」+ SpringPressable「去记一笔」。

### 19.2 CreateBillScreen

- **Header**：系统 Stack Toolbar；左「放弃本次编辑」（圆形 `shadows.headerFab`）、中「记一笔」(`navTitle`)、右占位 40×40 保持平衡。
- **分类网格**：4 列，Cell 宽 `(w - 32) / 4 - 8`；选中态不加玻璃，用类色 @ 0.12 opacity 圆 + `shadows.categoryCellOn`。
- **Kind 分段**：`SegmentedTwo` + Spring Thumb（未来）+ Haptic Selection。
- **金额 Dock**：`BillCalculator`；数字键 `keyCap`、主键「保存账单」`keyCapAccent`。

### 19.3 ChartScreen

- **周期分段**：`SegmentedTwo` 置顶；Spring Thumb + Haptic。
- **柱图**：切换数据时 Stagger Spring（30ms/柱）；柱色 `colors.expense`。
- **KPI 数字**：金额张力排版（§5.3 Rule 4）；`tabular-nums` 必须。
- **空状态**：「本月尚无支出/收入数据」+ SpringPressable「去记一笔」。

### 19.4 BudgetScreen / AssetScreen

- **卡片**：`GroupedInset` + `shadows.grouped`；`radii.card` = 14（升级后）。
- **新增入口**：每组末尾 SpringPressable 带 `+` 图标。
- **Modal**：底部滑入 Sheet（`radii.sheet` = 20）+ Scrim `modalScrim`；进出场 `SPRING.SHEET`。
- **成功保存**：Haptic Success。

### 19.5 BillDetailScreen / BillQueryScreen / CalendarScreen / MineScreen

- 共用 `GroupedInset` + `ListRow`；所有行走 SpringPressable。
- 日历格点击 Haptic Selection。
- 筛选面板复用 Sheet 规范。

### 19.6 组件内禁区（审查时一票否决）

- ❌ `fontSize` / `fontWeight` 写死数字（必须 `iosType.x`）
- ❌ `borderRadius` 写死数字（必须 `radii.x`）
- ❌ `shadowColor` / `shadowOpacity` 写死（必须 `shadows.x`）
- ❌ `Animated.timing` 驱动 scale / translate（必须 `withSpring`）
- ❌ `Pressable` 裸用，无按压动效 + 无触觉
- ❌ 空状态无 CTA
- ❌ `Alert` 自实现

---

## 二十、验收清单（Reviewer Checklist）

> Code Review 时**逐项勾**，任意一项 `N` → 不合并。

### 20.1 视觉

- [ ] 颜色仅来自 `useAppTheme().colors` / `getIosSemantic()`
- [ ] 字体仅来自 `iosType.*`
- [ ] 圆角仅来自 `radii.*`；子元素与父容器同心
- [ ] 阴影仅来自 `shadows.*`；同层一致
- [ ] 无任何 `ALL CAPS` 文本
- [ ] 8pt 网格（4/8/12/16/...）
- [ ] **若涉及玻璃控件：完成 §3.14 八大效果 sub-checklist**

### 20.2 布局

- [ ] 主 CTA 位于屏幕下 1/3
- [ ] Tab / Toolbar / Sheet 距屏边 ≥ `listContentInset`
- [ ] 所有 `Pressable` 触控区 ≥ 44×44
- [ ] 空状态有 CTA

### 20.3 动效

- [ ] 所有位置/尺寸过渡走 `SPRING.*`，非 timing
- [ ] 按压统一走 `useSpringPress`
- [ ] 图表数据变化走 Stagger Spring
- [ ] Sheet 走 `SPRING.SHEET` + Scrim timing
- [ ] Reduce Motion 降级到位

### 20.4 触感

- [ ] 所有按压有 Haptic
- [ ] 分段 / 周期切换 Selection
- [ ] 成功操作 Success；失败 Error
- [ ] 触觉与视觉同帧

### 20.5 无障碍

- [ ] VoiceOver 全屏可用
- [ ] `accessibilityLabel` 齐全
- [ ] Reduce Motion / Reduce Transparency 分别测过
- [ ] Light / Dark 各测过
- [ ] Increased Contrast 测过（hairline 仍可见）

### 20.6 性能

- [ ] 同屏 `BlurView` ≤ 3
- [ ] 长列表 `FlatList` 且 memo
- [ ] 动画 worklet（Reanimated）而非 JS 线程
- [ ] Android 关键路径已验证（玻璃回退）

### 20.7 文档

- [ ] 新 Token 已加入 `.planning/IOS26-DESIGN-GUIDE.md`（即本文）
- [ ] 偏差已登记到对应阶段 `VERIFICATION.md` Accepted Deviation

---

## 二十一、Accepted Deviation（RN 工程近似）

> 以下偏差**允许存在**，但必须逐项登记到对应 Phase 的 `VERIFICATION.md`：

| # | SwiftUI 原生 | RN 近似 | 差距 | 判定 |
|---|--------------|---------|------|------|
| D1 | `.glassEffect(.regular)` 真实 lensing | `BlurView + overlay + hairline` | 无实时折射 | Accepted |
| D2 | `GlassEffectContainer` 共享采样 + morphing | 多 `BlurView` 独立 | 无 morphing 合并 | Accepted，Phase 16+ 评审 |
| D3 | `glassEffectID` 形变 | 手写 `SharedElement` 或省略 | 缺少 | Accepted（除非声明 P0） |
| D4 | `.containerConcentric` 自动同心 | `concentricRadius()` 手算 | 需手算 | Accepted，helper 托管 |
| D5 | Slider / Toggle 拇指变玻璃 | 纯色拇指 + 阴影 | 缺玻璃态 | Accepted |
| D6 | Dynamic Type 自动刻度 | 手动 `PixelRatio` 响应 | 局部支持 | 递进，Phase 16+ |
| D7 | Toolbar subtitle 原生 | 手写 `headerTitle` 双行 | 需组合 | Accepted |
| D8 | 触点辐射光晕 | 无 | 缺 | Accepted，P2 |
| D9 | `.buttonStyle(.glass)` | `BlurView + tint` 手做 | 需手做 | Accepted |
| D10 | iPad Sidebar 背景延展 | 不支持 iPad 独立布局 | 缺 | Accepted，非目标 |

---

## 附录 A — 快速决策树

```
要加样式吗？
├─ 颜色 → useAppTheme().colors.xxx
├─ 字体 → iosType.xxx
├─ 圆角 → radii.xxx
├─ 阴影 → shadows.xxx
├─ 间距 → listContentInset / 4/8/12/16/...
└─ 都不匹配？ → 先在 theme 新增 token，再 PR

要做动效吗？
├─ scale/translate → withSpring(SPRING.UI)
├─ opacity/颜色 → withTiming(FADE_MS.normal)
├─ 数据切换 → Stagger Spring
└─ 用户触发？ → 叠加 Haptic

要做交互吗？
├─ 单击 → Pressable + useSpringPress + haptic.light
├─ 切换 → SegmentedSpring + haptic.select
├─ 提交 → 成功 haptic.success / 失败 haptic.error
└─ 危险操作 → Alert + Destructive + error haptic

要做空状态吗？
└─ 必带 CTA，CTA 必是 SpringPressable + haptic
```

## 附录 B — 引用与版本

| 来源 | 版本 / 日期 |
|------|-------------|
| Apple Liquid Glass Technology Overview | 2025-06-09 发布，2026-04 最新 |
| Apple Human Interface Guidelines | 2026 版 |
| WWDC 2025 Sessions 219/356/323/284/310 | 2025-06 |
| iOS 26 All New Features PDF | 2025-09 |
| 仓库研究：`IOS26-LIQUID-GLASS-REFERENCE.md` | 2026-04-23 |
| 仓库研究：`IOS26-MOTION-INTERACTION-SPEC.md` | 2026-04-23 |

## 附录 C — 本文修订记录

| 版本 | 日期 | 变更 | 负责人 |
|------|------|------|--------|
| v1.0 | 2026-04-24 | 初版，整合 Liquid Glass / HIG / 动效 / 触感 / 仓库现状 | Cursor Agent（Claude Opus 4.7） |
| v1.1 | 2026-04-24 | §3.5–§3.14 补齐八大核心玻璃视觉效果（Lensing / Specular / Materialization / Shimmer / Ripple / Morphing / Vibrancy / Adaptive Depth）与 RN 工程近似；§18 新增 6 类玻璃 helper 资产；§20 验收加 sub-checklist 指针 | Cursor Agent |

---

**此文件是宪法。任何改动需走 PR 并在 `.planning/STATE.md` 登记；未登记的偏离实现一律视为缺陷。**
