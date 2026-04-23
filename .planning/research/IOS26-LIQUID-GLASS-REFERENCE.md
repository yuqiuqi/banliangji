# iOS 26 / Liquid Glass — 里程碑 v2.4 权威参考（摘录）

**用途：** 为「副路径屏」Chrome 对齐提供**可引用的官方表述**，避免凭感觉实现。  
**非替代：** 仍须以仓库内 `UI-SPEC.md`、`DESIGN.md`、`11-MATERIAL-MOTION-SPEC.md` 为工程契约；RN/`expo-blur` 边界以 **Accepted deviation** 记录。

## 官方来源（优先阅读顺序）

1. **Liquid Glass（Apple Developer）**  
   https://developer.apple.com/documentation/TechnologyOverviews/liquid-glass  
   - 材质：光学特性 + 流动性；控件与导航可自动呈现该设计语言。  
   - **设计原则（与 HIG 一致）：** **Hierarchy**（内容焦点）、**Harmony**（与软硬件形态一致）、**Consistency**（跨尺寸与平台可预期）。  
   - **采纳路径：** 最新 Xcode 构建；材料/控件/图标的视觉刷新；导航与搜索体验；窗口/模态/菜单/工具栏最佳实践；**跨平台测试**。

2. **Human Interface Guidelines**（总入口）  
   https://developer.apple.com/design/human-interface-guidelines/  
   - 与 Liquid Glass 配套的布局、导航、色彩节制（让内容「浸透」控件）、标准图标与操作位置等。

3. **Apple Newsroom（设计叙事，非 API）**  
   https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/  
   - **Liquid Glass** 反射/折射环境、随内容与环境（含浅色/深色）变化。  
   - **控件层**位于内容之上、可随需求形变；**Tab 栏**在滚动时收缩、回滚时展开，以保持内容焦点（**动态层次**）。  
   - 与圆角硬件/窗口 **同心（concentric）** 布局。

4. **iOS 26 功能 PDF（设计章节摘要）**  
   https://www.apple.com/os/pdf/All_New_Features_iOS_26_Sept_2025.pdf  
   - 控件（按钮、滑块、开关）在交互中的「活」态；工具栏/导航的流体形变；**动态 Tab 栏** 等行为级描述。

## 对本仓库的工程含义（v2.4）

| Apple 要点 | 半两记落地（React Native / Expo） |
|------------|-------------------------------------|
| Hierarchy：内容优先、导航/控件可让位 | 图表/预算/资产/我的：**列表与图表为主体**；顶栏/Tab/Sheet 使用与 Tier-1 一致的 **材质栈**，避免「灰雾一块」压过内容。 |
| Harmony：与圆角、安全区、动态岛区域协调 | 四屏 **GroupedInset / 圆角卡片** 与 `iosSemantic` 边距、**Scroll + Tab 栏** 行为与 `11-MATERIAL-MOTION-SPEC` Tier-2 对齐。 |
| Consistency：与系统应用可比的交互预期 | **按压、过渡、Sheet、分段控制** 等与 `src/components/ios/*` 原语复用；禁止四屏各自一套临时样式。 |
| 动态 Tab 栏（滚动收缩/展开） | 若主路径已实现，**副路径 Tab 内子页滚动**须复用同一套逻辑或明确 deviation。 |
| 色彩节制 | **控件与导航**不过度饱和；内容色与语义色来自 `iosSemantic` / `UI-SPEC`，深色与「降低透明度」须单独验收（THEME-01 / A11Y-01）。 |

## 视频（可选深潜）

- Apple Developer 站内 WWDC 2025 相关 Session（Liquid Glass / 采纳）：见 Technology Overviews 页面 **Videos** 列表。

---

*Gathered for GSD milestone v2.4 · 2026-04-23*
