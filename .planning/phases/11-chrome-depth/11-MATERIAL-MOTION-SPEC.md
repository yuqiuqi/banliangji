# Phase 11 — 材质、透明度与动效（对齐 iOS 26 Liquid Glass）

**状态：** 规格草案（供 Phase 11 规划/实现）  
**日期：** 2026-04-22  
**上游：** Apple *Meet Liquid Glass*（WWDC25 Session [219](https://developer.apple.com/videos/play/wwdc2025/219)）、*Build a SwiftUI app with the new design*（[323](https://developer.apple.com/videos/play/wwdc2025/323)）、[Liquid Glass | Technology Overviews](https://developer.apple.com/documentation/technologyoverviews/liquid-glass)

---

## 1. 问题陈述（与系统差距）

当前 RN + `expo-blur` 实现的是 **传统实时模糊（近似 iOS 7 以来 UIBlurEffect）**：高斯/噪声型散射，**缺少** Apple 在 iOS 26 描述的 **Lensing（折光/聚光）** 与 **随交互瞬时「充能」的凝胶态形变**。因此会出现：

| 维度 | iOS 26 Liquid Glass（官方叙述） | 常见 RN 实现 | 感知差距 |
|------|----------------------------------|--------------|----------|
| **光学** | 动态弯曲、塑造、**集中**光线；与「散射型」模糊区分 | `BlurView` + 半透明叠色 | 偏「雾面」，缺少**透镜感**与边缘折射暗示 |
| **纵深** | 多层材质协同；大尺寸浮层时**更厚**、阴影更深、lensing 更强 | 单层 blur + 固定 shadow | **立体感弱**，Tab/Sheet 与内容层分离不明显 |
| **透明度** | 各层随背后内容**连续自适应**（对比度、着色、分离阴影） | 固定 `tint` / `intensity` | 滚动或内容变化时**分离度与可读性**不如系统 |
| **动效** | **视觉与动效一体设计**；按压即时 flex、状态迁移时材质**形变/融合** | 线性 opacity 或简单 scale | 缺**流体感**与「控件抬升为玻璃」的叙事 |

> 结论：**不是「再调大一点 blur」能解决的**，需要在 **分层策略 + 动效曲线 + 降级语义** 上重新设计；原生 Liquid Glass 由系统渲染，RN 侧应以 **可验收的近似 + 文档化偏差** 为目标。

---

## 2. 设计原则（从官方材料抽取）

以下表述综合自 WWDC25-219 演讲稿要点（意译，实现以官方视频/HIG 更新为准）：

1. **Lensing 作为识别特征** — 用「光的弯折」传达**存在、运动与形态**，在让内容透出的同时保持与背景的分离。
2. **显隐过渡** — 避免简单淡入淡出；通过 **逐步调制 lensing** 保持材质光学一致性。
3. **动效与材质同源** — 动效应参考液体：**顺滑、响应快、省力**；交互时材质 **instant flex + energize with light**。
4. **按压抬升** — 控件可在交互时**临时进入更显著的玻璃态**，静止时保持视觉安静。
5. **上下文形变** — 状态切换时控件在**同一浮动平面上 morph**，避免「硬切」导航层。
6. **多层与自适应** — Liquid Glass 由**多层**构成；随背后内容变化调整 tint、动态范围与**分离用阴影**（例如文字滚过下方时阴影加重）。
7. **尺度与厚度** — 浮层变大时，材质模拟**更厚**：更深阴影、更强 lensing、更柔的散射（系统行为；RN 需 **分段参数** 近似）。

---

## 3. React Native / Expo 技术现实

| 能力 | 现状 | 对 Phase 11 的含义 |
|------|------|---------------------|
| `expo-blur` | iOS 原生 `UIVisualEffectView`；**非** Liquid Glass 私有 API | 保留为 **Tier-1 底座**；通过 **叠层**（细线高光、内阴影近似、渐变 mask）增强「透镜边缘」 |
| Reanimated | 与手势/布局线程动画 | **Tier-1**：按压 scale/spring、Tab 转场、Sheet 与列表联动 |
| 自定义原生视图 | 可封装未来 API | **Tier-2 可选**：若后续 SDK 暴露新材质，再抽 `IOSLiquidGlassView`（本规格不强制） |
| Android | Blur 路径与 iOS 不一致 | 维持 Phase 9 既定：**实色近似 + 文档标注**；不与 iOS 强行像素一致 |

已知坑（Expo 文档与社区）：`BlurView` 与动态列表层序、blur 更新时机 — Phase 11 任务中需 **显式验收** 关键屏层序。

---

## 4. 专业落地方案（分层）

### 4.1 材质栈（建议）

对 **Tab 栏、顶栏、大浮层（记一笔 Dock、Sheet 把手区）** 采用统一「栈」，按 elevation 选参数：

```
[ 内容 ]
  ↑
[ 可选：极薄分隔阴影层 — Scroll 时增强对比，模拟「内容滚过加重阴影」]
  ↑
[ BlurView — systemUltraThinMaterialLight/Dark 或项目约定 enum ]
  ↑
[ 半透明 tint — 随 ColorScheme 与 iosSemantic 绑定 ]
  ↑
[ 1px hairline 顶部高光（线性渐变）— 增强「玻璃边缘」]
  ↑
[ 圆角裁切 + 外阴影 — 大浮层用较大 radius + 较深 shadowOpacity ]
```

- **小控件**（分段、小按钮）：blur 可减弱或退化为 **实色 + 按压高光**，避免「糊成一团」。
- **大浮层**：提高 **shadowRadius / opacity**，略提高 **tint 不透明度**，模仿官方「变厚」。

### 4.2 动效栈（建议）

| 场景 | 推荐 | 参数方向 |
|------|------|----------|
| 按压 | `Pressable` + Reanimated `withSpring` | 轻微 scale（0.97–0.99）+ **短促** opacity/blur intensity 微调（若性能允许） |
| Tab 切换 | 选中指示器 spring；图标 **同步** 轻微位移 | 避免线性 200ms `timing` 一统天下 |
| 导航转场 | React Navigation 配置 + Reanimated 自定义 | 与 Phase 9 栈顶阴影 **连贯**；避免卡片与 Tab 栏 **脱节** |
| Sheet / 记一笔 Dock | 出现时 **自下而上 spring** + 背景遮罩 **非线性** 进入 | 参考液体「整体连成一片」而非硬弹 |

**曲线：** 优先 **spring（低阻尼、适中刚度）**；避免 Material 默认 sharp curve 直接套在「玻璃」上。

### 4.3 透明度与可读性（与 A11Y 衔接）

- **降低透明度**（`UIAccessibility.isReduceTransparencyEnabled`）：在 Phase 11 **统一封装** `useReduceTransparency()`（或等价），Blur 路径切换为 **不透明底 + 保留分隔线与字色**（与 **A11Y-01** 一致）。
- **深色模式**：tint 与 `iosSemantic` **联动**；避免浅色 blur tint 在 Dark 下发灰不可读（**THEME-01**）。

### 4.4 验收（建议写入 Phase 11 VERIFICATION）

1. **静态：** Tab、记一笔 Dock、主列表顶栏 — 截图对比「边缘是否有过渡层次」而非仅一块灰雾。
2. **滚动：** 列表快速滚动时，固定顶栏/Tab 区域 **字与背景分离仍可读**（主观 + 对比度 spot-check）。
3. **动效：** 按压、Tab 切换、打开记一笔 — **无线性僵硬感**（团队 checklist）。
4. **辅助功能：** 降低透明度开/关各跑一遍主路径。

---

## 5. 风险与诚实边界

- **无法 1:1 复刻** 系统 Liquid Glass 着色器；本方案为 **工程近似**。
- 若 Apple 后续在 **公开 API** 中提供可嵌入 RN 的材质，应 **单点替换** `BlurView` 封装，而非全屏重写。
- 性能：多层 blur + Reanimated 需 **真机** 测帧时间；必要时对 Android 与旧 iPhone **降级层数**。

---

## 6. 参考链接（网络检索摘要）

- [Meet Liquid Glass - WWDC25](https://developer.apple.com/videos/play/wwdc2025/219) — Lensing、动效一体、多层自适应、尺度增厚。
- [Build a SwiftUI app with the new design - WWDC25](https://developer.apple.com/videos/play/wwdc2025/323) — 导航、控件、自定义视图与 `backgroundExtensionEffect` 等 API 方向。
- [Liquid Glass | Apple Developer Documentation](https://developer.apple.com/documentation/technologyoverviews/liquid-glass) — 技术总览。
- [Expo BlurView](https://docs.expo.dev/versions/latest/sdk/blur-view/) — RN 侧实现边界与平台差异。

---

*本文件为 Phase 11 的单一来源补充规格；实现任务应在 `11-*-PLAN.md` 中拆解并链接至此。*
