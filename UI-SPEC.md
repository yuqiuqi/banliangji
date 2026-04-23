# 半两记 — UI 设计契约（iOS 26 / Liquid Glass 全量设计语义）

**Phase 关联：** 09-ios26-chrome  
**Companion：** `.planning/phases/09-ios26-chrome/09-BREAKTHROUGH-SPEC.md`（全屏矩阵）

本文档 **合并** 两类内容：

1. **半两记 工程合同** — Token、组件、禁则、验收（可直接驱动 `src/theme` 与代码评审）。  
2. **iOS 26 / Liquid Glass 设计风格与语言细节** — 以 **Apple 开发者文档 / HIG 公开表述** 为主干，辅以社区技术文章仅作补充，并 **逐条标注** 与 React Native 的 **可实现映射** 与 **不可达边界**。

> **单一事实来源优先级：** Apple Developer Documentation（Liquid Glass、Adopting Liquid Glass）→ Human Interface Guidelines → WWDC25 会话 → Apple Newsroom → 第三方解读（**不得**把第三方数值当作 Apple 强制规范）。

---

# 第一篇：半两记 工程合同

## 1. Color tokens（Light）

| Token / 语义 | Apple 语义对齐（概念） | 用途 | 值 |
|--------------|------------------------|------|-----|
| groupedBackground | `systemGroupedBackground` | 屏大底、分组列表外场 | `#F2F2F7` |
| secondaryGrouped | `secondarySystemGroupedBackground` | 卡片、列表容器、cell 堆叠面 | `#FFFFFF` |
| label | `label` | 主正文、标题 | `#000000` |
| secondaryLabel | `secondaryLabel` | 辅助说明、区头、次行 | `rgba(60,60,67,0.6)` |
| divider | `separator`（半透明取向） | 列表内分隔、hairline | `rgba(60,60,67,0.18)` |
| body（备用） | `separator` opaque | 仅少数需强对比分隔 | `#C6C6C8` |
| systemBlue | `systemBlue` | 强调、链接、主按钮填充 | `#007AFF` |
| systemGreen | `systemGreen` | 收入 | `#34C759` |
| systemRed | `systemRed` | 支出强调、destructive 取向 | `#FF3B30` |
| tabBarInactive | 未选中 Tab 标签 | 灰阶 | `#8E8E93` |
| tertiaryFill | `tertiarySystemFill` 取向 | 密铺格、浅底 | `rgba(118,118,128,0.08)` |
| accentSelection | 选中铺色（低饱和蓝） | 网格选中等 | `rgba(0,122,255,0.12)` |

实现：集中在 `src/theme/colors.ts`、`iosSemantic`；**禁止**业务文件写死历史品牌色。

**Dark Mode / 高对比：** 若尚未做 Dark，本仓库 **Light 为唯一强制合同**；Dark 须在本文档后续版本 **单独补表**（不得静默混用 Light token）。

## 2. 材质与 Chrome（工程约定）

| 区域 | 约定 |
|------|------|
| Tab 栏 | iOS：`BlurView` + `tint="light"`；Android：实心 `#F9F9F9` + 顶部分隔 `rgba(60,60,67,0.29)` hairline |
| 导航栏 | 非模态栈：可 `headerBackground` + Blur；**模态**优先实色 `main`（`#F6F6F6`）保可读 |
| FAB | 统一 `Fab` 组件：`systemBlue` 圆盘 + `shadows.fab` + 细高光边 |
| 计算器 Dock | iOS：`BlurView`；Android：`calculatorDockFallback` 半透明冷灰 |
| 分组卡片 | `shadows.grouped`；**禁止**粗实线外框作为主层次手段 |

## 3. 类型与密度（工程最低线）

- 导航标题：`fontSize: 17`，`fontWeight: "600"`（`Headline` 取向）。  
- 列表主行：`16`–`17`；次行 `12`–`14`，`secondaryLabel`。  
- 分段控件高度 **≥ 32pt**；可点行 **≥ 44pt** 触控目标。  
- 列表水平 inset：统一 `listContentInset`（16）。

## 4. 组件合同（可复用原语）

| 原语 | 责任 |
|------|------|
| GroupedInset | inset 分组白容器；`shadows.grouped`；无整圈粗描边 |
| ListRow | `divider` + hairline 底部分隔 |
| SegmentedTwo | 灰轨道 `segmentedTrack`；选中白底微阴影 |
| Fab | 主浮动按钮；阴影与高光统一 |
| BillCalculator | 键帽圆角、hairline 格线、`keyCap` / `keyCapAccent` |

## 5. 质感禁则

- 禁止分组大卡片 `borderWidth: 1` + `#C6C6C8` 外轮廓。  
- 禁止 **glass-on-glass**（模糊面上再叠整块模糊列表）。  
- 禁止列表滚动区域 **整块** 强 Blur。

## 6. 模态与反馈

- 记一笔 / 日历：`presentation: "modal"`。  
- 删除：`Alert` destructive。  
- 日期：iOS `spinner` + 「完成」`systemBlue`。

## 7. 验收

以 `09-BREAKTHROUGH-SPEC.md` §3 与 `09-VERIFICATION.md` 为准；`npm run verify` 持续绿。

## Phase 11 — Theme、深色与无障碍（工程补充）

### Dark mode（Phase 11）

- **驱动：** `ThemeProvider`（`src/theme/ThemeContext.tsx`）根据 `useColorScheme` 在 `lightPalette` / `darkPalette`（`src/theme/palette.ts`）间切换。  
- **用法：** 界面取色统一 `useAppTheme().colors` + `useMemo` 样式工厂；与系统深色 **非像素级** 对齐，偏差记入 `.planning/phases/11-chrome-depth/11-VERIFICATION.md` Accepted deviations。

### Reduce transparency（降低透明度）（Phase 11）

- **检测：** `AccessibilityInfo.isReduceTransparencyEnabled` 与 `reduceTransparencyChanged`，封装见 `src/hooks/useReduceTransparency.ts`。  
- **表现：** Tab / 记一笔相关条带由 `IOSChromeGlassBackground`（`src/components/ios/IOSChromeGlassBackground.tsx`）在开启「降低透明度」时走 **不透明降级栈** + hairline，避免空白或对比不足；关闭后恢复 Blur 路径。

### Liquid Glass 工程近似（Phase 11）

- React Native **无**系统级 Liquid Glass lensing；本仓库以 **Blur + 语义 tint + 阴影** 叠出纵深。**非像素级复刻** Apple 平台公开材质；验收与 spot-check 以 `11-VERIFICATION.md` 为准。

---

# 第二篇：iOS 26 / Liquid Glass — 设计风格与设计语言（详细）

以下章节用于 **产品 / 设计 / 工程** 对齐「像 OS26」的 **语义与细节**，而不仅是换色。

---

## 8. Liquid Glass 是什么（Apple 官方定义摘要）

依据 [Liquid Glass | Apple Developer Documentation](https://developer.apple.com/documentation/TechnologyOverviews/liquid-glass)：

- **定义：** Liquid Glass 是一种 **动态材质（dynamic material）**，将 **玻璃的光学特性** 与 **流动感（fluidity）** 结合。  
- **范围：** 跨 Apple 平台界面；**标准控件与导航元素**（SwiftUI、UIKit、AppKit）会 **自动** 呈现该材质的外观与行为；也可在 **自定义界面元素** 中实现类似效果。  
- **目标：** 建立 **层次（hierarchy）**、**和谐（harmony）**、跨设备与平台 **一致性（consistency）**。  
- **采纳路径：** 并非从零重写应用；在最新 Xcode 工具链上构建，遵循界面最佳实践，使应用 **融入系统体验**。

**本工程映射：** RN 无系统自动材质；用 **`expo-blur` + 语义色 + 阴影 token** 做 **静态近似**；动态光学（实时折射、系统级 lensing）**不可复刻**，须在验收时标注为 **Accepted deviation** 或 **Follow-up（原生壳）**。

---

## 9. 设计原则（Apple 文档 + HIG 取向）

以下内容综合 Apple「Liquid Glass」文档中的 **Design principles** 指引与 HIG 常见条款（**中文释义**；英文原文以 Apple 站为准）。

### 9.1 布局与导航 — 内容处于焦点（Layout focus）

- **原则：** 选择能 **让最重要内容处于焦点** 的布局与导航结构。  
- **细节：**  
  - **内容层** 应占据用户注意力中心（列表、图表、正文）。  
  - **Chrome**（顶栏、底栏、侧边、浮动控件）服务于 **定位、模式切换、全局操作**，不抢夺内容主叙事。  
  - 跨平台时保持 **组织方式与信息架构** 可预期（用户从 iPhone 到 iPad 能识别同一套结构）。

**本工程映射：** 明细/图表 **白分组 + 灰底**；Tab/导航 **模糊或实色条**；避免在内容区中央铺大块装饰性半透明。

### 9.2 图标与品牌 — 维度与简洁（App icon）

- **原则：** 以 **简洁、醒目、分层** 的方式重塑 App 图标，在多种设备与外观下保持 **立体感与一致性**。  
- **细节：** 少即是多；层次来自 **清晰图层** 与 **光照一致**，而非复杂描边。

**本工程映射：** App 图标不在本文档范围；若更新图标，需与 **系统圆角网格** 与 **无特斯拉遗留色** 对齐。

### 9.3 颜色 — 节制使用（Judicious color）

- **原则：** 在控件与导航中 **审慎用色**，保持 **易读**，并让 **内容能够「浸透」控件**（content shine through — 与玻璃/半透明语境一致）。  
- **细节：**  
  - **语义色**（蓝/红/绿/灰）表达 **意义** 与 **状态**，而非装饰。  
  - 避免高饱和大块面抢戏；**主按钮** 可用 systemBlue **填充**，列表背景保持 **中性灰/白**。  
  - **深色模式 / 增强对比** 下系统会调整对比策略；工程上需预留 **降级路径**。

**本工程映射：** `colors.ts` 仅语义 token；**支出/收入** 用 systemRed/systemGreen；**禁止** 回到品牌绿主色。

### 9.4 硬件与软件一体（Fit in）

- **原则：** 界面元素应与 **设备软硬件设计** 协调（圆角屏幕、安全区、Home 指示条、动态岛区域等）。  
- **细节：** 尊重 **safe area**；横竖屏与分屏时 **不截断关键操作**。

**本工程映射：** `SafeAreaView` edges；`App.tsx` **maxWidth** 居中；iPad 后续可扩展 **可读宽度 + 分栏**（见 BREAKTHROUGH-SPEC）。

### 9.5 图标与操作位置（Standard iconography）

- **原则：** 采用 **标准图标体系** 与 **可预期的操作位置**（如导航栏右侧主操作、返回在左上）。  
- **细节：** SF Symbols 取向的 **线面一致**；自定义图标避免与系统 **语义冲突**（如把删除做成「加号」形状）。

**本工程映射：** `@expo/vector-icons` 选择与系统 **语义接近** 的 glyph；记一笔 **加号** 与系统一致。

### 9.6 采纳清单（Apple「Adopting Liquid Glass」取向）

官方文档建议现有应用：

1. **拥抱** 材质、控件、图标的视觉更新。  
2. 提供跨平台的 **统一导航与搜索** 体验（若产品范围包含多平台）。  
3. **组织与布局** 与其他系统应用 **一致**。  
4. 对 **窗口、模态、菜单、工具栏** 遵循最佳实践。  
5. **跨平台测试**。

**本工程映射：** 模态记一笔、日历；`Alert`；导航栈 `headerShadowVisible` 统一；Android **模糊降级** 文档化。

---

## 10. 材质分层模型（设计语言细节）

### 10.1 三层模型（概念）

| 层 | 名称 | 视觉职责 | OS26 典型处理 | 本工程实现 |
|----|------|----------|---------------|----------------|
| L0 | **场（Canvas）** | 最底，铺全场 | `systemGroupedBackground` 浅灰 | `colors.canvas` |
| L1 | **内容面（Surfaces）** | 卡片、列表承载 | 白/次级分组白，实底为主 | `colors.surface`、`GroupedInset` |
| L2 | **Chrome（玻璃层）** | 浮在内容之上 | Liquid Glass：模糊、透光、随动效略变 | `BlurView`（Tab、可选 header、计算器 dock） |

### 10.2 「透光」与可读性

- **意图：** 玻璃下 **隐约可见** 内容漂移，形成 **深度**，但 **前景文字必须始终可读**。  
- **系统做法：** Vibrancy、标签色阶、动态对比（由系统计算）。  
- **RN 近似：** 玻璃上文字用 **label / secondaryLabel** 实色；避免 **半透明白字** 浮在强模糊上；必要时 **加极薄实色底** 或 **降低 blur intensity**。

### 10.3 深度与层次（Dimensional hierarchy）

社区与 Apple 叙述中共同强调：**层次来自材质与光照叙事，而非厚重描边堆叠**。

- **宜：** 大圆角卡片 + **轻阴影** + **hairline 分隔** + **灰场与白面**对比。  
- **忌：** 粗灰框、多圈描边、阴影过重（「贴纸箱」）。

**本工程：** `shadows.grouped`、`divider`、`hairlineBorder` 仅用于 **模态卡片边缘** 等少数场景。

### 10.4 材质诚实（Material honesty）

- **原则：** 界面 **看起来像玻璃/实体**，交互反馈应 **符合该隐喻**（例如按下时 **略微压实/变暗**，而非无关联的弹跳）。  
**本工程：** `pressedOpacity`、`pressScale` 统一；FAB / 主按钮 **同一套反馈**。

---

## 11. 颜色系统（语义与层级）

### 11.1 语义色（Semantic colors）

| 语义 | 用途 | 注意 |
|------|------|------|
| Blue | 主操作、链接、选中强调 | 不要用蓝当 **大背景** |
| Red | 破坏操作、错误、支出强调 | 与「删除」destructive 一致 |
| Green | 成功、收入 | 与红 **不** 互换语义 |
| Gray | 分隔、禁用、轨道 | 用 **半透明** 优先于实灰粗线 |

### 11.2 标签色阶（Label hierarchy）

- **Primary label：** 主标题、主金额、行内主信息。  
- **Secondary label：** 区头、说明、时间、辅助字段名。  
- **Tertiary / Quaternary：**（若扩展）更低强调；**本项目** 可用 `lightTitle` + 透明度近似。

### 11.3 填充色阶（Fill / Track）

- `secondarySystemFill`、`tertiarySystemFill` 取向：用于 **选中底、轨道、图标背板**，饱和度 **极低**。  
**本工程：** `light`、`tertiaryFill`、`segmentedTrack`、`accentSelection`。

### 11.4 让内容「映」在控件上（官方语境）

Apple 强调控件与导航上 **节制用色**，使 **内容能映过（shine through）** —— 在玻璃控件上尤其明显。  
**含义：** 避免 **不透明彩色顶栏/底栏** 盖住下方内容 **除非** 可读性不足；**本工程** 模态顶栏可用实色 **正是** 可读性优先。

---

## 12. 字体与排版（Typography）

iOS 使用 **SF Pro**（设备上 RN 默认即系统字体）。以下 **样式阶梯** 对齐 Apple **Text Styles** 常用取值（**pt 为 iOS 逻辑点**；精确行高与字间距以 **HIG / SF 规范** 为准）。

| 样式（HIG 名） | 典型用途 | 典型字级 / 字重（参考） |
|----------------|----------|-------------------------|
| Large Title | 大标题、极少用全屏抬头 | 34 / Bold（Display） |
| Title 1 | 页面主标题 | 28 / Regular（Display） |
| Title 2 | 次级标题 | 22 / Regular |
| Title 3 | 卡片标题 | 20 / Regular |
| Headline | 导航栏标题、强调行 | 17 / Semibold |
| Body | 列表主行、正文 | 17 / Regular |
| Callout | 次要段落、说明 | 16 / Regular |
| Subheadline | 行内次级信息 | 15 / Regular |
| Footnote | 区头、元数据 | 13 / Regular |
| Caption 1 / 2 | 时间戳、极小标注 | 12 / 11 |

**本工程最低合同：** 见第一篇 §3；详细排版可扩展 `src/theme/typography.ts`（`iosType`）与上表 **逐条对齐**。

**Dynamic Type：** 完整跟随系统字号需 `PixelRatio` / `useWindowDimensions` / 可缩放组件；**Follow-up** 可在 VERIFICATION 登记。

---

## 13. 控件与模式（Controls & Patterns）

### 13.1 导航栏（Navigation bar）

- **标准高度**、标题居中或大标题模式（若采用）。  
- **材质：** Liquid Glass 下 **可半透明**；**模态** 常仍用 **实色** 保对比。  
- **阴影：** `headerShadowVisible` 与栈内统一；避免一屏有一屏无。

### 13.2 标签栏（Tab bar）

- **玻璃底**、选中 **systemBlue**、未选中 **灰**。  
- **顶部分隔：** ultra-thin / 半透明线。

### 13.3 工具栏与顶区按钮

- **图标按钮：** 可 **圆形浅底**（tertiary）+ **主操作实心圆**（与日历 FAB **同系不同尺寸**）。  
- **位置：** 筛选、日历、添加等 **符合平台预期**。

### 13.4 分段控件（Segmented control）

- **轨道：** 浅灰 **无粗描边**。  
- **选中：** **浮起滑块**（白 + 轻阴影），**非** 整段高饱和蓝底（旧 iOS 样式）。

### 13.5 分组列表（Grouped / Inset grouped）

- **外场灰、内场白**；**圆角 12**（或稿定连续圆角）。  
- **行：** 左标题右值（设置向）；**hairline** 分隔。  
- **区头：** Footnote 级、secondaryLabel。

### 13.6 主按钮与破坏按钮

- **Primary：** systemBlue **填充** + 白字 + **轻阴影** + **细高光边**（工程近似）。  
- **Destructive：** systemRed **字色** 或系统 Alert destructive；**避免** 大块红底除非系统要求。

### 13.7 底部区域与 Sheet

- **计算器、日期选择：** 底部 **圆角上沿** + **模糊或实色** + **顶部分隔**；内容 **清晰分区**（显示区 / 键区）。

### 13.8 浮动操作按钮（FAB）

- **圆形**、**systemBlue**、**白加号**、**明显但不过曝的阴影**（「浮在内容与底栏之上」）。

---

## 14. 动效与交互（Motion）

- **按压：** 轻微 **不透明度** + **缩放**（`Reduce Motion` 时关闭缩放）。  
- **转场：** 模态 **自底向上**；导航 **系统向侧滑返回**。  
- **图表 / 列表：** 出现可用 **短 fade**（已有 `chartFadeMs`）。  
- **禁忌：** 与材质无关的 **夸张弹跳**、**过度抛物线**（除非品牌刻意）。

---

## 15. iPad 与自适应

- **可读宽度：** 大屏 **居中 maxWidth**（已实现 720 取向）。  
- **未来：** 分栏、边栏（sidebar）、inspector — 见 BREAKTHROUGH-SPEC **分阶段**。  
- **横屏：** 图表不拉伸失真；安全区正确。

---

## 16. 无障碍与系统设置（必须设计）

Apple 明确 Liquid Glass 体验须配合系统辅助功能（具体行为以 HIG 为准）。工程上须 **预留或实现**：

| 设置 | 用户期望 | 本工程取向 |
|------|----------|----------------|
| **降低透明度** | 玻璃 → **近实色** | Tab/Header/Blur **降级实色** |
| **增强对比度** | 对比 **抬高** | 字色、分隔线 token **可切换加强** |
| **减少动态效果** | 减弱 **缩放/视差** | `pressScale` 禁用或减弱 |
| **按钮形状**（若系统提供） | 控件 **边界更可辨** | 关键按钮保留 **清晰外形** |

---

## 17. 反模式（Anti-patterns）

1. **Glass on glass：** 多层强模糊叠放。  
2. **装饰性模糊：** 无层级意义的大面积 Blur。  
3. **粗描边分组：** 代替阴影与灰白对比。  
4. **语义色滥用：** 整屏蓝/绿底。  
5. **忽视安全区与 Home 指示条。**  
6. **模态顶栏半透明导致标题不可读。**

---

## 18. 第三方技术细节的处置

部分文章会写 **「模糊半径 10–20px」** 等数值 —— **并非 Apple 新闻稿原文**；不同设备、不同层级的实现 **差异极大**。  
**合同规则：** 以 **`expo-blur` 的 `intensity` 与实机截图** 调校；数值 **记入 VERIFICATION** 与代码注释，**不** 写入本文档作为「Apple 强制 px」。

---

## 19. RN / Expo 能力边界（诚实清单）

| OS26 / HIG 能力 | RN 现状 |
|-----------------|--------|
| 系统 Liquid Glass 自动渲染 | **无**；仅近似 |
| 实时 lensing / 折射 | **无** |
| 系统 Vibrancy 文本 | **无**；用实色字替代 |
| `BlurView` 毛玻璃 | **有**（`expo-blur`），需控层数与降级 |
| 分组列表连续圆角 | **近似**（单层圆角 + overflow） |
| Reduce Transparency | **`AccessibilityInfo`** Follow-up 可接 |
| 导航/模态 | **React Navigation** 能力内逼近 |

---

## 20. 头脑风暴附录（工程 vs 体验）

### 20.1 工程视角（Codex 向）

- 分层：**canvas → surface → chrome(Blur)**。  
- 性能：模糊层 **少而精**；列表 **不** 整表 Blur。  
- 长期：**原生壳** 吃系统玻璃 API。

### 20.2 体验视角（Gemini 向）

- **光线叙事：** 前景亮锐、后景哑、过渡靠模糊带宽。  
- **高级毛玻璃：** 背后 **隐约可见**；前景 **对比充足**。  
- **动效即材质：** 轻反馈减轻贴纸感。

---

## 21. 官方与推荐参考链接

| 资源 | URL |
|------|-----|
| Liquid Glass（Apple Developer） | https://developer.apple.com/documentation/TechnologyOverviews/liquid-glass |
| Adopting Liquid Glass | https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass |
| Human Interface Guidelines | https://developer.apple.com/design/human-interface-guidelines |
| Meet Liquid Glass（WWDC25-219） | https://developers.apple.com/videos/play/wwdc2025/219 |
| Get to know the new design system（WWDC25-356） | https://developers.apple.com/videos/play/wwdc2025/356 |
| Apple Newsroom 设计更新稿 | https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/ |

---

*文档版本：与 Phase 9 / v2.2 对齐；后续 Dark Mode、Dynamic Type、原生壳玻璃等 **增量** 请在本文件追加章节并更新版本注记。*
