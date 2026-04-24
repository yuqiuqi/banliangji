# iOS 26 设计指南 — 交叉 AI 评审汇总

> **被评文件：** `.planning/IOS26-DESIGN-GUIDE.md` (v1.1, 1444 行)
> **评审日期：** 2026-04-24
> **评审方：** Codex CLI (OpenAI) + Gemini CLI (Google) 独立评审，本 Agent（Claude Opus 4.7）汇总 & 幻觉甄别
> **原始产物：**
> - `/tmp/codex-review.md` — Codex 全文
> - `/tmp/gemini-review.md` — Gemini 全文
> - `/tmp/design-guide-review-prompt.md` — 共用评审 prompt

---

## 执行摘要（Executive Summary）

| 评审方 | 判定 | 核心立场 |
|--------|------|----------|
| **Codex (OpenAI)** | **CONDITIONAL** | 方向正确，但把「Apple 官方 / 作者推断 / RN 近似」三类陈述混写；4 条事实性错误（含 2 High）；漏了 `glassEffectUnion`、App Icon、控件尺寸 Extra-Large 三大概念；多条 RN 近似在 Expo 54 下不成立或有风险。 |
| **Gemini (Google)** | **CONDITIONAL** | 结构清晰，决策树友好；指出 §1.2 与 §9.5 的玻璃定义矛盾；建议 P0 强推 `useSpringPress`；但**存在 1 条严重幻觉**（见下）。 |
| **本 Agent 汇总** | **CONDITIONAL — 需修订至 v1.2 方可作为「设计宪法」** | 整体立意正确；但存在 **4 条独立可验证的事实错误**、**3 项官方概念缺失**、**2 处内部规范冲突**、**若干 RN 落地风险**；需在 Phase 16 启动前完成修订。 |

---

## 一、Gemini 幻觉甄别（必须前置拆穿）

Gemini 的「7. 最有价值改进建议」第 1 条原文：

> 「**立即修正版本号偏差**：将全文的『iOS 26』修正为『iOS 20』，引用来源修正为『iOS 20 Preview (2026)』，以维持文档的严肃性和事实准确性。」

**结论：完全错误，属于模型幻觉。**

**独立证据：**
- Apple Newsroom 原文标题（2025-06-09）：*Apple introduces a delightful and elegant new software design* —— 配套系统正式命名为 **iOS 26 / iPadOS 26 / macOS Tahoe 26 / watchOS 26 / tvOS 26 / visionOS 26**（对齐自 2025 发布、贯穿 2026 年的年份号）。
  <https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/>
- Apple Developer 文档所有 Liquid Glass 页面版权均标记「Copyright © 2026 Apple Inc.」，并明确叙述 iOS 26 / iPadOS 26。
- 不存在任何「iOS 20」命名（iOS 19 被跳过以对齐年份）。

**处置：** 本汇总所有采纳项均排除 Gemini 建议 #1；文档**不修改**版本号。

---

## 二、事实性错误（已独立验证）

以下 4 条来自 Codex，**全部经本 Agent 独立核对官方文档后确认**：

### Err-01 — SwiftUI Glass API 非「私有」

- **位置：** 文档 §开头 > 权威来源下方「RN/Expo 边界」段
- **原文：** *「SwiftUI 私有 `.glassEffect()` / `GlassEffectContainer` / `glassEffectID` 等 API 无法直接迁移」*
- **事实：** 三者均为**公开文档化** SwiftUI API：
  - `glassEffect(_:in:)` → <https://developer.apple.com/documentation/swiftui/view/glasseffect(_:in:)>
  - `GlassEffectContainer` → <https://developer.apple.com/documentation/swiftui/glasseffectcontainer>
  - `glassEffectID(_:in:)` → <https://developer.apple.com/documentation/swiftui/view/glasseffectid(_:in:)>
- **严重度：** **High**（把公开 API 说成私有会误导迁移决策）
- **修订建议：** 改为「SwiftUI 公开 API `.glassEffect()` / `GlassEffectContainer` / `glassEffectID` 无 React Native 原生对应，需在 Expo/RN 生态做工程近似」。

### Err-02 — §3.2「Apple 明确规定 `.clear` 三条件」非官方原文

- **位置：** §3.2「玻璃必备的三条必要条件（Apple 明确规定）」
- **原文：** 列了「富媒体 / 内容不会被 dimming 负向影响 / 玻璃之上文字粗大亮」三条
- **事实：** 这三条是 Medium 技术文章 *iOS 26 Liquid Glass: Comprehensive Reference* 的总结，并非 Apple 官方明文。Apple 官方 [Glass](https://developer.apple.com/documentation/swiftui/glass) + [Adopting Liquid Glass](https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass) 仅给出 `.clear` 变体说明与「优先用系统组件」的总原则，没有三条硬门槛。
- **严重度：** **Medium**（把社区归纳冒充官方规则会稀释宪法权威性）
- **修订建议：** 把小标题改为「`.clear` 社区公认最佳实践（非 Apple 明文）」，或降级为「本仓库使用准则」。

### Err-03 — §5.3「最小正文 17pt（HIG 硬性要求）」混淆默认值与最小值

- **位置：** §5.3 排版铁律 Rule 1
- **原文：** *「最小正文 17pt（HIG 硬性要求 + 可访问性）」*
- **事实：** Apple Typography 页明确区分：**iOS/iPadOS 默认正文 17pt，技术最小 11pt**。17pt 是「推荐默认」，不是「硬性最小」。
- **严重度：** **High**（决定大量低优先级信息的最小字号空间，现状过严）
- **修订建议：** 改为「**推荐正文 17pt**（Apple 默认值）；技术最小 11pt，本仓库限制 `footnote` 13 / `caption1` 12 作为下限」。

### Err-04 — §5.1「iOS 26 废弃 ALL CAPS」过度泛化

- **位置：** §5.1 iOS 26 字体三大变化
- **原文：** *「iOS 26 废弃 ALL CAPS …… 所有 SectionHeader 禁止 `textTransform: 'uppercase'`」*
- **事实：** 社区观察到 Settings 等系统 app 改用 sentence case，但 Apple 官方并未发布「全局废弃 ALL CAPS」通用禁令；Lists & Tables HIG 页仍要求 **title-style capitalization**（每个实词首字母大写），不是一律句子式。
- **严重度：** **Low**（方向对，但措辞过绝）
- **修订建议：** 改为「**iOS 26 倾向 sentence case**：新建屏优先 sentence case；与既有系统区（如列表列标题）仍允许 title-case」。

---

## 三、关键概念缺失（来自 Codex）

### Miss-01 — `glassEffectUnion(id:namespace:)` 完全漏写

- **重要性：** **High**（Apple 公开 API，与 `GlassEffectContainer`、`glassEffectID` 并列的三大核心玻璃组织 API）
- **事实确认：** 独立验证 —— <https://developer.apple.com/documentation/swiftui/view/glasseffectunion(id:namespace:)>
- **与现有 §3.10/§3.11 区别：**
  | API | 用途 |
  |-----|------|
  | `GlassEffectContainer` | 提供**共享采样区**（让多玻璃元素不冲突） |
  | `glassEffectID` | **动态 Morphing** —— 状态切换时的形变 |
  | `glassEffectUnion` | **静态合并** —— 把多个相同 shape/variant 的玻璃融合为**单一形体**（如地图 App 上「定位 + 图层」两个按钮合并成一块玻璃） |
- **应插入位置：** §3.10 之后、§3.11 之前，新增 **§3.10bis — G4 GlassEffectUnion（静态合并）**
- **RN 近似：** 同屏多玻璃 chip/按钮共享 `BlurView` 采样层 + 共享 `borderRadius`，子元素间不留 gap 或以 hairline 分隔。

### Miss-02 — App Icon 的 Liquid Glass 适配

- **重要性：** **High**（Apple 官方「Adopting Liquid Glass」单列章节 + Icon Composer 专用工具）
- **缺失内容：**
  - 多层图标：背景 / 中层 / 前景分层，系统可施加反射、折射、阴影
  - 四种外观变体：**default / dark / clear / tinted**
  - 用 **Icon Composer** 工具设计与预览
  - 建议移除文字、简化构图、使用纯色大面积
- **应插入位置：** §4 后，或 §19 新增「19.7 App Icon 规范」
- **本仓库状态：** 当前 `assets/icon.png` 未对齐 iOS 26 多层规范 —— 需列为 Phase 16 P1 任务

### Miss-03 — 控件尺寸与 Extra-Large + 硬件曲率同心规则

- **重要性：** **High**（Apple Adopting Liquid Glass 的 Controls 章节明示）
- **缺失要点：**
  - iOS 26 控件「更圆、更贴合硬件曲率」，并提供 `.extraLarge` control size（比 `large` 更大的 60+ pt）
  - 官方建议：**不要写死布局度量**，让系统控件自动吸收新尺寸
  - 本仓库现状：大量写死 36 / 40 / 44 / 56 pt
- **应插入位置：** §9 总述开头，新增「9.0 控件尺寸策略 — 何时写死 vs 何时随系统」

---

## 四、RN 工程近似的可行性评估（来自 Codex + Gemini）

### 红灯（❌ 不可行或需重写）

#### Red-01 — §3.11 Morphing Tier 1 `react-native-shared-element` 失效

- **Codex 原话：** 「该库不在依赖树里，而且 Expo SDK 49 起不再随 Expo Go 提供，Expo managed 需 dev build；维护状态也偏弱。」
- **本仓库验证：** `package.json` 未包含此依赖；且项目目前用 Expo Go 开发流。
- **处置：** Tier 1 应**降级**为 Reanimated `LayoutAnimation` / `useAnimatedStyle` 手算坐标；`react-native-shared-element` 保留为「需 dev build 的可选项」。

#### Red-02 — §3.9「触点辐射传染到相邻玻璃元素」在 RN 无法物理正确

- **Codex 原话：** 「在当前栈里没有 SwiftUI 那种真实共享玻璃场；最多做多个元素共享同一组动画值的 overlay，不是物理一致的传播。」
- **处置：** 文案降级为「多元素共享同一 shared value 触发近似波纹」，不再承诺「物理传播」。

### 黄灯（⚠️ 可行但有风险，需加注）

| 位置 | 风险 | 加注建议 |
|------|------|---------|
| §3.6 E1 Tier 2 Skia Lensing | 当前仓库未装 Skia；shader 在列表/低端机易掉帧 | 明确列为 Phase 16+ **探索项**，非默认规范；引用 Gemini 建议：单屏 Skia Canvas 渲染面积 ≤ 20% |
| §3.7 E2 陀螺仪高光 | `expo-sensors` 订阅耗电、抖动 | 明确降级为 **P2 视觉增强**，不列入玻璃「必备项」 |
| §3.8 E7 `VibrantText` 固定色 + text-shadow | 非真正 vibrancy（内容感知） | 明确标注「可读性兜底，不是系统级 vibrancy 等价」 |
| §3.9 Touch-Point Illumination | RN/Expo 无原生 radial gradient | 改用 SVG / Skia / 模糊圆形近似；文档当前描述过简 |
| §3.10 RN `GlassEffectContainer` | 不等价于 SwiftUI 的 GPU 共享采样 | 文案降级为「统一配置层 + 减少 BlurView 数量」 |
| §11.5 图表柱 `setTimeout` stagger | JS 线程定时器，主线程忙时节奏漂移 | 改用 Reanimated `withDelay(i * 30, withSpring(...))` |
| §13 Haptics「同一帧触发」 | `expo-haptics` API 是 async，系统调度，无法严格保证 | 改为「**尽最大努力同步**」，并提示某些场景（如滚动边界）默认关闭以防过量 |
| §3.12 Materialization 大量并发 `BlurView` intensity 动画 | `expo-blur` 并发动画性能差 | 明确「单屏并发玻璃进出场 ≤ 2」 |

### 新发现的工程约束（**文档完全漏写**）

- **Expo Blur 已知问题：** `BlurView` 对动态内容（如 `FlatList`）有已知 render 先后顺序问题 —— 若 Blur 先于动态列表渲染，模糊不会更新。来源：<https://docs.expo.dev/versions/latest/sdk/blur-view/>
- **处置：** 在 §3 增加「3.15 Expo Blur 实战约束」小节，罗列所有已知限制。

---

## 五、结构与规范冲突（来自 Codex + Gemini）

### Conflict-01 — 玻璃范围自我矛盾（双方同时指出）

- **§1.2 / §2：** 「玻璃只用于导航层，绝不用于内容」
- **§9.5：** FAB 使用玻璃（FAB 属于控件层？还是内容上的浮层？）
- **判决：** FAB 明确归入 **L2 导航/控件层**（见 §2 表格已列），但文档在 §1.2 的措辞「控件」是否等于「导航层」不清晰。
- **修订：** §1.2 R1 改为「玻璃只用于 **Layer 2（导航/控件/浮层）**，不用于 Layer 1 内容」，与 §2 分层模型对齐。

### Conflict-02 — 「必须 Container」vs「多 BlurView 独立 Accepted」

- **§3.10：** 「同屏 ≥ 2 个玻璃相邻 **必须** `GlassEffectContainer`」
- **§21 D2：** 「`GlassEffectContainer` 共享采样 + morphing → RN 多 `BlurView` 独立 → **Accepted**」
- **判决：** 规则级冲突。
- **修订：** §3.10 改为「**建议** 使用 Container 模式（统一配置 + 减少 BlurView 数）；若性能 / 工程复杂度不允许，可按 §21 D2 Accepted Deviation 处理」。

### Conflict-03 — R5「三位一体」vs §14「默认无自定义声音」

- **§1.3 R5：** 「视觉 × 触觉 × **声音** 同帧触发」
- **§14：** 「默认不引入自定义音效」
- **判决：** R5 「三位一体」听起来像硬规则，实际只有视觉 + 触觉两件。
- **修订：** R5 改为「视觉 × 触觉 **同帧**（声音交给系统，不自建）」。

### Conflict-04 — 冗余（Codex 指出）

- §3.5–§3.14「八大效果」与 §21 Accepted Deviation 逐项重复。
- **修订：** §21 改为「**按 §3 各效果章节内 RN 近似子节派生**」的索引式总表，不重复内容。

### Conflict-05 — 章节查阅顺序（Codex + Gemini 同时指出）

- 当前章节次序偏「哲学优先」：R1-R5 → 分层 → 材质 → 色彩 → 字体 → …
- 工程师编码时更需要「**组件 → 推荐实现 → 降级路径 → 依赖要求**」的索引。
- **修订：** 在目录之后新增「**快速查阅索引**」—— 按组件类型给直达章节链接。

---

## 六、可操作性缺陷（共同观察）

两个评审员都指出：文档目前是「**高质量设计评论稿**」，还不是「**可直接编码的实施规范**」。

**共同根因：** 没有稳定区分四类陈述 ——
1. Apple 官方事实
2. 作者归纳 / 业界共识
3. RN 当前可执行
4. RN 需新依赖 / Phase 16+ 探索

### 共同建议 —— 每条规则打标签

改为四栏表：

| 规则条 | 类型 | RN 当前状态 | 依赖要求 |
|--------|------|-------------|----------|
| 例如「玻璃只用于导航层」 | Apple 官方 | ✅ 可执行 | 无 |
| 例如「Specular 陀螺仪高光」 | 作者扩展 | ⏳ Phase 16+ | `expo-sensors` |

### Gemini 建议的可视化补充

- 对比图（脏磨砂 vs Liquid Glass）存 `assets/docs/`
- Token 与 Figma 变量一一对应说明

### Codex 建议的补充

- 每个关键组件的「**实施卡片**」：组件名 / 推荐做法 / 降级方案 / 代码骨架 / 依赖 / 当前仓库状态

---

## 七、汇总：v1.2 修订行动清单

按**优先级**排序：

### P0 — 必须立即修正（事实错误 + 严重幻觉）

1. **修正「SwiftUI 私有 API」表述** → Err-01
2. **修正「最小正文 17pt 硬性要求」** → Err-03
3. **解决 Conflict-01：玻璃只用于 Layer 2** 明确措辞
4. **解决 Conflict-02：Container「建议」而非「必须」**
5. **解决 Conflict-03：R5 只讲视觉 + 触觉，移除声音**

### P1 — Phase 16 启动前必须完成

6. **新增 §3.10bis — `glassEffectUnion` 静态合并** → Miss-01
7. **新增 §9.0 — 控件尺寸策略（Extra-Large + 不写死度量）** → Miss-03
8. **降级 §3.2「Apple 明确规定」措辞** → Err-02
9. **降级 §5.1「废弃 ALL CAPS」措辞** → Err-04
10. **修正 §3.11 Morphing Tier 1**：`react-native-shared-element` 降级为可选 → Red-01
11. **修正 §3.9「触点传染」文案** → Red-02
12. **新增 §3.15 — Expo Blur 实战约束**（动态内容 render 顺序问题）
13. **新增 §19.7 — App Icon Liquid Glass 规范** → Miss-02
14. **给所有规则加「官方 / 归纳 / RN 近似 / 依赖」四栏标签**

### P2 — 工程化补强（可分阶段）

15. **目录后新增「快速查阅索引」**（按组件直达）
16. **§9 和 §19 新增「组件实施卡片」**：组件 × 推荐 × 降级 × 骨架 × 依赖
17. **§21 改为索引式总表**，不重复内容
18. **修正 §11.5 stagger 用 `withDelay` 取代 `setTimeout`**
19. **加注所有 RN 风险项**（⚠️ 黄灯表）
20. **补充对比图 + Figma 变量映射**（Gemini 建议）

---

## 八、双方评审强项对比

| 维度 | Codex | Gemini |
|------|-------|--------|
| 事实核查 | **强** — 4 条事实错误 + 3 项概念缺失，全部附官方 URL | 弱 — 有 1 条严重幻觉（iOS 20） |
| RN 工程可行性 | **强** — 基于 Expo 54 实依赖树逐条评估 | 中 — 提到 Skia 性能红线有价值 |
| 结构 / 冲突识别 | 中 — 指出 §3.10 vs §21 D2、R5 vs §14 | **强** — 指出 §1.2 vs §9.5 的玻璃范围矛盾 |
| 实施建议务实度 | **强** — 三条改进建议（标签四栏、P0/P1/P2 矩阵、组件卡片）全部可直接落地 | 中 — 「立即修正为 iOS 20」这条无效；「强推 SpringPressable P0」这条有效 |
| 可读性 | 较长但每条有证据 | 简洁，有表情符号导视 |

**最终采纳权重：** Codex 反馈占 **80%**，Gemini 反馈占 **20%**（扣除幻觉建议后剩余几条结构性观察采纳）。

---

## 九、本次评审对文档权威性的判断

- 原文 v1.1 作为「设计宪法」**条件性可用**：
  - 作为「**方向性**」与「**分层模型**」与「**反模式清单**」**立即可用**。
  - 作为「**Apple 官方事实依据**」**需等到 v1.2 修订完成**，否则可能误导团队。
  - 作为「**RN 工程实施规范**」**需 v1.2 补齐依赖表 + 实施卡片**。

- **建议流程：**
  1. 本 Review 提交入库（本文件）。
  2. 创建 `Phase 16` （或插入 Phase 15.5）「iOS 26 设计宪法 v1.2 修订」，按 §七 行动清单闭环。
  3. v1.2 通过后才开启后续 UI 类 Phase 的编码。

---

## 附录 A — 评审 Prompt

见 `/tmp/design-guide-review-prompt.md`（七项结论：整体判定 / 事实错误 / 概念缺失 / RN 可行性 / 结构可读性 / 可操作性 / Top 3 改进建议）。

## 附录 B — 评审原文归档位置

> 临时路径 `/tmp/codex-review.md` 与 `/tmp/gemini-review.md` 会被系统清理；如需长期归档，建议在入库时一并迁移至 `.planning/research/IOS26-DESIGN-GUIDE-REVIEW-RAW/`。

## 附录 C — 修订记录

| 版本 | 日期 | 变更 | 负责人 |
|------|------|------|--------|
| v1.0 | 2026-04-24 | 初版汇总；Codex + Gemini 交叉评审；Gemini「iOS 20」幻觉甄别；4 条事实错误 + 3 项概念缺失 + 若干 RN 风险确认 | Cursor Agent（Claude Opus 4.7） |
