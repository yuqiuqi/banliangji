# Phase 9 — UI Design Contract（iOS / iPadOS 26 Chrome）

**Phase:** 09-ios26-chrome  
**Status:** Active contract（`/gsd-ui-phase` 更新基线）  
**Companion:** `09-BREAKTHROUGH-SPEC.md`  
**设计参照:** Apple Human Interface Guidelines + Apple Design Resources（iOS 26）+ Figma Community「iOS and iPadOS 26」类 UI Kit（**节点级 1:1 需 Figma MCP `get_design_context`**）

---

## 0. 意图声明（为何之前「不够贴」）

仅换 **语义色 + 白卡片** 不等于 iOS 26。**必须**同时约定：

1. **导航栏材质** — 主栈使用 **system chrome 模糊**（`headerBlurEffect: systemChromeMaterial` + `headerTransparent`），与 **Liquid Glass** 同一材料家族；模态栈保持 **不透明** 以免与表单重叠冲突。  
2. **大标题与滚动** — 主列表屏（明细等）在能力具备时启用 **`headerLargeTitle`**，且列表 **`contentInsetAdjustmentBehavior="automatic"`**，避免内容顶到栏下缘。  
3. **分段控件** — 视觉对齐 **UISegmentedControl**：**灰底轨道（tertiarySystemFill）** + **选中段白底浮起** + 选中字用 **label**（非仅描蓝字）。  
4. **字体** — iOS 使用 **SF Pro（系统默认）**；不在业务组件写死非系统 `fontFamily`（除非品牌例外）。  
5. **图标** — 长期方向为 **SF Symbols 语义**；当前工程仍可用 Vector Icons，但 **Tab/顶栏** 应优先 **轮廓/线宽一致** 的图标，避免 Material 厚重感与 iOS 26 稿冲突。

---

## 1. Color tokens（Light）

| Token / 语义 | 用途 | 十六进制或 rgba |
|--------------|------|------------------|
| groupedBackground | 屏大底 | `#F2F2F7` |
| secondaryGrouped | 卡片/列表容器底 | `#FFFFFF` |
| label | 主文 | `#000000` |
| secondaryLabel | 次文 | `rgba(60,60,67,0.6)` |
| separator | 分割线 | `#C6C6C8` |
| tertiarySystemFill | 分段轨道底、浅铺 | `#E5E5EA`（工程内 `colors.light`） |
| systemBlue | 强调、链接、Tint | `#007AFF` |
| systemGreen | 收入金额 | `#34C759` |
| systemRed | 支出金额强调 | `#FF3B30` |
| tabBarInactive | Tab 未选中 | `#8E8E93` |

**禁止** 业务文件硬编码 Tesla 绿 `#4A8B6A` 作为主强调。

---

## 2. 材质（Liquid Glass / Materials）

| 区域 | iOS | Android |
|------|-----|---------|
| **主导航栈顶栏** | `headerTransparent: true` + `headerBlurEffect: "systemChromeMaterial"`；`headerShadowVisible: false`（由材质承担层次） | 不透明 `#F6F6F6` + `headerShadowVisible: true` |
| **模态栈顶栏** | 不透明 `colors.main`，**不用** blur（避免与键盘/大标题边沿叠化冲突） | 同左 |
| **Tab 栏** | `BlurView` + `tint="light"` + 顶部分隔 `rgba(60,60,67,0.29)` | 实心 `#F9F9F9` + 分隔线 |
| **FAB** | 实心 `systemBlue` + 白图标 | 同左 |

> **Dev note:** `react-native-screens` 注释：iOS 26 上 `headerBlurEffect` 与 `scrollEdgeEffects` 同开可能重叠 — 本工程 **仅用 headerBlurEffect**，不额外开 `scrollEdgeEffects`，直至单屏验证通过。

---

## 3. 类型与密度

- **标准导航栏标题：** 17pt、**semibold**（`fontWeight: "600"`）。  
- **大标题（Large Title）：** 34pt（由系统渲染；仅开启 `headerLargeTitle`，不手写 34）。  
- **列表主行：** 17pt 或 16pt；次行 13–15pt，`secondaryLabel`。  
- **Section header（分组列表）：** 13pt、**semibold** 或常规 per HIG；字色 `secondaryLabel`；可与系统一样 **全大写** 仅在对照 Figma 后启用（当前默认 **中文文案不大写**）。  
- **触控目标：** ≥ 44×44 pt。

---

## 4. 组件合同（工程原语）

| 原语 | iOS 26 取向 |
|------|-------------|
| **GroupedInset** | 水平 inset 16；圆角 10–12；白底；hairline 边框可与系统「仅分隔线」二选一，以不破坏整体玻璃层次为准。 |
| **ListRow** | 最小高度 44；分隔线 `separator`；按压 opacity。 |
| **SegmentedTwo** | 轨道 `tertiarySystemFill`；选中段 **白底** + 轻阴影（iOS）；选中文字 **label** 色；未选中 **secondaryLabel**。 |
| **PrimaryButton** | `systemBlue` 填充 + `onAccent` 字（记一笔确认等）。 |

---

## 5. 屏级导航行为（摘要）

- **明细 `HomeMain`：** 大标题 + 模糊顶栏 + 列表 `contentInsetAdjustmentBehavior` automatic（iOS）。  
- **账单 `BillQuery`：** 标准标题或大标题（与产品一致即可，默认标准标题）；同栈模糊。  
- **记一笔 / 日历：** 模态；顶栏不透明。  
- **Tab 屏（图表/预算/资产/我的）：** Tab 内自建标题的，用 **Title2/Large** 层级近似（见各屏 `iosType`）。

---

## 6. 验收

- 真机：顶栏在滚动时 **模糊与内容分离清晰**；分段 **白底选中段** 可见；无 Tesla 主绿。  
- `npm run verify` 绿。  
- Figma MCP 可用时：逐 frame `get_screenshot` 与实现 **像素对照**（本契约不替代 Figma 节点）。

---

*最后更新：2026-04-22 — 响应「更贴 iOS 26」的契约补强。*
