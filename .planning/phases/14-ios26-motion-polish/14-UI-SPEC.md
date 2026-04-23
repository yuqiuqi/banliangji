---
status: approved
reviewed_at: "2026-04-23"
phase: 14
phase_slug: ios26-motion-polish
---

# Phase 14 — UI 设计契约（工程基线 · 动效 · 交互 · 触觉）

**阶段：** 14 — iOS 26 全局动效与交互质感打磨（v3.0）  
**canonical：** 仓库根 `UI-SPEC.md`、`.planning/research/IOS26-MOTION-INTERACTION-SPEC.md`、`.planning/phases/11-chrome-depth/11-MATERIAL-MOTION-SPEC.md`

本文件在 **根 `UI-SPEC.md` 工程合同** 之上，锁定 Phase 14 的 **动效 / 按压 / 触觉 / Modal / Header** 契约，并补齐 GSD UI checker 六维所需表格。

---

## Design System

| Tool | Role |
|------|------|
| Expo + React Native | 宿主与导航 |
| react-native-reanimated | Spring、`SharedValue`、手势友好动画 |
| expo-blur | Tab / Chrome 材质近似 |
| expo-haptics | 选择成功 / 轻触 / 通知类反馈（经 `src/utils/haptics.ts`） |

**组件取向：** 业务交互控件优先 `SpringPressable`；材质与色票遵循根 `UI-SPEC.md`，**禁止**业务文件硬编码历史品牌色或私自引入 Web 组件注册表。

---

## Copywriting Contract

**全局文案与禁则**以根 `UI-SPEC.md` §6（模态与反馈）及工程内 `Alert` destructive 模式为准。Phase 14 涉及的 **触觉对齐**（非替换系统文案）：

| Surface | Tone | Primary CTA | Destructive confirmation |
|--------|------|-------------|---------------------------|
| 记一笔 / 预算保存成功 | 中性肯定 | （系统或现有「完成」） | — |
| 删除账户 / 流水 | 明确后果 | 取消 / 删除 | 删除：二次确认，destructive |
| 分段 / Chip 切换 | 无弹层 | — | — |
| Modal 打开 | 轻提示 | 关闭 / 完成 | — |

**空态 / 错误：** 不新增营销式副文案；与现网 `REQUIREMENTS` 及对应屏 copy 一致。

---

## Visual Language

| # | Reference | How we use it |
|---|-----------|---------------|
| 1 | [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) | 触控目标、层级、反馈语义 |
| 2 | 根 `UI-SPEC.md`（Liquid Glass 工程近似） | 材质、色票、模态 scrim |
| 3 | `.planning/phases/11-chrome-depth/11-MATERIAL-MOTION-SPEC.md` | Header collapse、hairline、阴影与滚动联动 |
| 4 | `.planning/research/IOS26-MOTION-INTERACTION-SPEC.md` | 动效意图与 RN 边界 |

---

## Color Strategy (60 · 30 · 10)

**全部取值以 `src/theme/colors.ts` / `palette.ts` 及根 `UI-SPEC.md`  token 表为准**，不在此重复十六进制；比例描述用于评审与 spot-check：

| Role | % | Maps to (semantic) |
|------|---|---------------------|
| Dominant（屏底、大背景） | ~60 | `groupedBackground` |
| Secondary（卡片、分组容器） | ~30 | `secondaryGrouped`、`tertiaryFill` 等表面 |
| Accent（主操作、链接、强调） | ~10 | `systemBlue`；收支语义 `systemGreen` / `systemRed` |

**深色 / 高对比：** 由 Phase 11 `ThemeProvider` 与 `darkPalette` 驱动；Phase 14 动效不改变色票，仅改变过渡曲线。

---

## Typography

**实现源：** `src/theme/typography.ts` — `iosType`。以下为 **唯一允许的刻度**（≤4 字号、≤2 字重）。

| Role | fontSize | fontWeight | lineHeight | Notes |
|------|----------|------------|------------|--------|
| Nav title | 17 | 600 | 22 | 与导航栏对齐 |
| Body | 17 | 400 | 22 | 列表主行、正文 |
| Large title（屏头） | 20 | 600 | 25 | Budget / Asset / Mine 大标题区 |
| Footnote（区头 / 次要） | 13 | 400 | 18 | section 标签 |
| Caption | 12 | 400 | 16 | 辅助一行 |

> **字重仅** `400`（Regular）与 `600`（Semibold）。其它样式用颜色（`secondaryLabel`）而非第三档字重。

---

## Spacing

**标准刻度（均为 4 的倍数）：** `4, 8, 12, 16, 24, 32, 48, 64`。

| Token / 用途 | Value | 来源 |
|--------------|-------|------|
| 列表水平 inset | 16 | `listContentInset`（`src/theme/layout.ts`） |
| 屏头与列表间距 | 8–16 | 取上表 |
| 卡片圆角 | 12 | `radii.card` |
| Sheet 圆角 | 14 | `radii.sheet` |

**禁则：** 不在契约外引入 **非 4 倍数** 的 margin/padding 作为新规范（个别像素对齐可在 `14-VERIFICATION.md` 记 Accepted deviation）。

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| —（本工程为 RN，无 shadcn/ui 注册表） | — | not required |

第三方 **npm** 包（Reanimated、expo-haptics 等）按 `RESEARCH` / 锁文件版本管理；**不**通过 shadcn registry 拉取 UI 块。

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-04-23

---

# 动效与交互专章（Phase 14 增量）

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

---

## UI-SPEC VERIFIED

**Phase:** 14 — ios26-motion-polish  
**Status:** APPROVED

### Dimension Results

| Dimension | Verdict | Notes |
|-----------|---------|-------|
| 1 Copywriting | PASS | 与根契约及 Phase 触觉表对齐；无占位符文案 |
| 2 Visuals | PASS | ≥3 权威/工程引用（HIG、根 UI-SPEC、11-MATERIAL、研究稿） |
| 3 Color | PASS | 60/30/10 与语义 token 映射明确 |
| 4 Typography | PASS | 四档字号、两字重；正文 lineHeight 已声明 |
| 5 Spacing | PASS | 4 倍数刻度 + `listContentInset` / radii |
| 6 Registry Safety | PASS | RN 无 shadcn 注册表；Safety Gate N/A |

**Recommendations (non-blocking):** 无。
