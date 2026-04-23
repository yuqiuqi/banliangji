# Phase 14 — UI 设计契约（动效 · 交互 · 触觉）

**阶段：** 14 — iOS 26 全局动效与交互质感打磨（v3.0）  
**状态：** Planning 基线  
**日期：** 2026-04-23  
**canonical：** `.planning/research/IOS26-MOTION-INTERACTION-SPEC.md`、`UI-SPEC.md`、`.planning/phases/11-chrome-depth/11-MATERIAL-MOTION-SPEC.md`

---

## 1. 范围

- **在册：** 全应用 **按压手感**、**分段 Spring Thumb**、**图表柱 stagger**、**列表入场 stagger**、**Modal Spring**、**Scroll Header Collapse**、**expo-haptics** 映射、**Reduce Motion** 降级。
- **不在册：** SwiftUI 私有 `glassEffect`；Tab 栏动态收缩（ANIM-07）；Swipe-to-delete（INT-02）。

---

## 2. 动效令牌（实现源）

所有 `withSpring` / `springify` **必须**从 `src/theme/motion.ts` 引用，**禁止**业务文件硬编码 `damping` / `stiffness` / `mass`（ANIM-01）。

| 令牌 | 用途 |
|------|------|
| `SPRING.UI` | 按压回弹、列表、通用过渡 |
| `SPRING.THUMB` | 分段指示器位移 |
| `SPRING.SHEET` | Modal / Sheet 主体 |
| `SPRING.GESTURE` | 手势跟随（若使用） |
| `REDUCE_SPRING` | Reduce Motion 时替代高弹跳弹簧 |
| `FADE_MS` | 与 opacity `withTiming` 配对的毫秒常量 |

---

## 3. 按压原语：`SpringPressable`（INT-01）

**评审结论：** 以 **`src/components/SpringPressable.tsx`** 为主（`forwardRef` + **`PressableProps` 全量透传**），便于从 `<Pressable` 机械替换并保留 `hitSlop`、`onLongPress`、`delayLongPress`、`style` 函数等。

- **视觉：** 按下 `scale → 0.97`、`opacity → 0.92`；抬起 `→ 1` / `→ 1`，均 `withSpring(SPRING.UI)`。
- **Reduce Motion：** 跳过 scale（或极短 timing），仅保留短 opacity 变化（MOT-01）。
- **例外（须在 `14-VERIFICATION.md` Accepted deviation 登记）：** 第三方封装、`TextInput` 外框、明确不需要缩放的纯文本链接。

可选：`src/hooks/useSpringPress.ts` 仅作为 **非 Pressable 容器**（如 `Animated.View` 包裹）的内部实现细节，**不**作为全站主路径。

---

## 4. Stagger 与取消（ANIM-03 / ANIM-04）

- **最大 stagger 项数：** 前 **12** 条使用 index 延迟；超出部分 **同帧显示**或 **固定短 delay**（避免长列表首屏掉帧）。
- **周期/数据切换：** 必须在依赖变化时 **清除** 待执行的 `setTimeout` / `requestAnimationFrame` 链，并对正在运行的 Reanimated 动画 **以新目标覆盖**（避免周/月快速切换「叠影」）。
- **柱图 SharedValue：** **禁止**在 `useMemo(() => points.map(() => useSharedValue(0)))` 中创建 hooks；使用 **`useRef<SharedValue<number>[]>`** + `useEffect` 按数据长度对齐数组。

---

## 5. 触觉（HAP-01）

封装：`src/utils/haptics.ts`，**所有** `impactAsync` / `notificationAsync` 调用包在 **try/catch**（模拟器/不支持设备静默失败）。

| 事件 | 方法 |
|------|------|
| 分段 / chip 切换 | `selection`（或项目内命名 `select`） |
| 记一笔保存成功、预算保存 | `notificationSuccess` |
| 删除确认（Alert 确认 destructive） | `notificationError` |
| Modal 打开 | `impactLight` |
| 列表滚到边界（若实现） | `impactLight` |

---

## 6. Scroll Header Collapse（ANIM-06）

- **屏：** Budget、Asset、Mine（**不含** Chart 固定分段区）。
- **高度：** 大标题区 **72 → 44** pt 随 `scrollY` 插值；顶栏 hairline / 分离阴影与 `11-MATERIAL-MOTION-SPEC` 一致。
- **列表稳定：** `ScrollView` / `FlatList` 的 **`contentInset` / `contentOffset` 补偿**须与动画头高度联动，验收 **快速滚动无跳变**（见 `14-VERIFICATION.md`）。

---

## 7. Modal Spring（ANIM-05）

- Sheet 主体：`translateY` **60 → 0**，`withSpring(SPRING.SHEET)`。
- Scrim：`opacity` **0 → 1**，`withTiming(250ms)`（或 `FADE_MS.normal`）；颜色 **`colors.modalScrim`**。
- 关闭：反向；Reduce Motion 时缩短平移、保留 scrim 语义。

---

## 8. 验收引用

执行期与签字以 `.planning/phases/14-ios26-motion-polish/14-VERIFICATION.md` 为准；与 `14-REVIEWS.md` Planner Directives 对齐。
