# Phase 16: iOS 26 设计宪法 v1.2 修订 - Context

**Gathered:** 2026-04-24
**Status:** Ready for planning
**Source:** Discussion (auto mode, GA-1~5 recommended defaults)

<domain>
## Phase Boundary

将 `.planning/IOS26-DESIGN-GUIDE.md` 从 **v1.1（1444 行）** 升级到 **v1.2**，严格依据 `.planning/IOS26-DESIGN-GUIDE-REVIEW.md` §七 的 20 条行动清单（P0 5 条 + P1 9 条 + P2 6 条）闭环修订，并产出 `.planning/phases/16-design-guide-v1.2/16-VERIFICATION.md` 逐项勾选。

**交付物：**
1. `.planning/IOS26-DESIGN-GUIDE.md` v1.2 正式版
2. `.planning/phases/16-design-guide-v1.2/16-VERIFICATION.md` 逐 20 条勾选，附引用章节行号

**严格非目标（一律不越界）：**
- ❌ 新建 / 修改 `src/**` 任何源码（Phase 17+ 承接）
- ❌ 改动 `REQUIREMENTS.md` 主体结构（仅追加新需求行 `DESIGN-SPEC-02`）
- ❌ 变动 `ROADMAP.md` 其他相位
- ❌ 触发 `/gsd-ui-phase`（Phase 16 是纯文档相位，无 UI 变更）
- ❌ 安装任何 npm 依赖
</domain>

<decisions>
## Implementation Decisions

### D-01 拆 Wave 策略（GA-1: A）

**3 Wave 按优先级**拆分：
- **Wave 1 / 16-01**（P0 — 5 条）：事实错误 + 规范冲突，**先止血**
- **Wave 2 / 16-02**（P1 — 9 条）：新增章节 + RN 文案降级 + 新增 §3.15 Expo Blur 实战约束
- **Wave 3 / 16-03**（P2 — 6 条）：四栏标签全文扫描 + 组件实施卡片 + 快速查阅索引 + §21 索引化 + 验收

每 Wave 内部任务串行（同一 markdown 文件），Wave 之间顺序执行。

### D-02 四栏标签粒度 × 视觉（GA-2: A）

**每条规则尾部 emoji + 缩写**，不打断阅读：

| 标签 | Emoji | 含义 |
|------|-------|------|
| `OFF` | 🍎 | Apple 官方事实（有官方 URL 引用） |
| `AUTH` | 📝 | 作者归纳 / 业界共识（非官方原文） |
| `RN-T1` / `RN-T2` / `RN-T3` | 🛠️ | RN 工程近似分级（T1=当前可执行 / T2=需新依赖 / T3=Phase 17+ 探索） |
| `DEP:<name>` | 📦 | 依赖需求（如 `DEP:expo-haptics`） |

**示例：** 「玻璃只用于导航层 🍎 OFF」「Shimmer 用 LinearGradient 🛠️ RN-T1 📦 expo-linear-gradient」

未来审查一条规则时，一眼看出它的权威来源、RN 可实施性与依赖成本。

### D-03 新增章节插入位置（GA-3: A）

**就近插入**，以 `bis` / 小数编号明示 v1.2 新增，保留 v1.1 原章节编号索引不断链：

| 新章节 | 插入位置 | 来源 |
|--------|----------|------|
| **§3.10bis G4 GlassEffectUnion（静态合并）** | §3.10 之后、§3.11 之前 | REVIEW Miss-01 |
| **§3.15 Expo Blur 实战约束** | §3.14 之后、§四 之前 | REVIEW §四 新发现 |
| **§4bis App Icon Liquid Glass 规范** | §4 之后、§5 之前 | REVIEW Miss-02 |
| **§9.0 控件尺寸策略（Extra-Large + 不写死度量）** | §9 章节开头（现有 §9.1 按钮之前） | REVIEW Miss-03 |

### D-04 验收机制（GA-4: A）

**写 `16-VERIFICATION.md` 逐 20 条勾选 + 引用 v1.2 章节行号**。每条格式：

```markdown
### Item N: <REVIEW 原条目>
- [x] 已闭环 / [ ] 未闭环
- **v1.2 位置：** `IOS26-DESIGN-GUIDE.md` §X.Y（L nnnn-mmmm）
- **证据：** <修改前后的关键 diff 片段>
- **Accepted deviation：** <若未完全闭环的合理说明>
```

不再邀请 Codex/Gemini 二次评审（成本 vs 幻觉风险不匹配）；若自验后存疑，单独立项。

### D-05 代码骨架是否同步建（GA-5: B）

**完全不碰源码。** `motion.ts` / `useSpringPress` / `SpringPressable` / `haptics.ts` / `VibrantText` / `GlassEffectContainer` 等全部由 **Phase 17** 承接。Phase 16 的产出是文档 + 验收记录，PR 边界最干净。

### Claude's Discretion

- v1.2 文档内部**具体措辞**、标签符号细节、章节编号风格（只要符合 D-02/D-03 约束）
- 修改记录（§附录 C）具体描述
- 必要时可微调分 Wave 边界（如 Wave 1 某条依赖 Wave 2 的新章节，可挪动）
</decisions>

<canonical_refs>
## Canonical References

**下游 planner / executor MUST 读这些文件，不得二次检索。**

### 评审依据（权威）
- `.planning/IOS26-DESIGN-GUIDE-REVIEW.md` — Codex + Gemini 交叉评审汇总，§七行动清单是本相位唯一 scope 来源
- `.planning/IOS26-DESIGN-GUIDE.md` — v1.1 原文（1444 行），修订基线
- `/tmp/codex-review.md` — Codex 原始评审文本（若 /tmp 已清理，可忽略）
- `/tmp/gemini-review.md` — Gemini 原始评审文本（同上）

### Apple 官方（用于事实核查）
- `https://developer.apple.com/documentation/TechnologyOverviews/liquid-glass` — Liquid Glass 总入口
- `https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass` — 采纳指南（App Icon / Controls / Extra-Large 官方描述）
- `https://developer.apple.com/documentation/swiftui/view/glasseffect(_:in:)` — 证明 `glassEffect` 是**公开** API（Err-01 证据）
- `https://developer.apple.com/documentation/swiftui/glasseffectcontainer` — GlassEffectContainer 官方
- `https://developer.apple.com/documentation/swiftui/view/glasseffectid(_:in:)` — glassEffectID 官方
- `https://developer.apple.com/documentation/swiftui/view/glasseffectunion(id:namespace:)` — **glassEffectUnion 官方**（Miss-01 填补证据）
- `https://developer.apple.com/design/human-interface-guidelines/typography` — 17pt 是**默认**非最小（Err-03 证据）
- `https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/` — iOS 26 命名官方来源（Gemini 幻觉反证）

### Expo / RN 工程约束
- `https://docs.expo.dev/versions/latest/sdk/blur-view/` — BlurView 动态内容 render 顺序问题（§3.15 新增证据）
- `https://docs.expo.dev/versions/latest/sdk/haptics/` — `expo-haptics` async 本质（§13 文案降级依据）
- `https://www.npmjs.com/package/react-native-shared-element` — 库状态与 Expo Go 不兼容性（Red-01 证据）

### 项目上下文
- `.planning/ROADMAP.md` — Phase 16 在 v3.0 milestone 位置
- `.planning/STATE.md` — Roadmap Evolution 已登记 Phase 16
- `.planning/research/IOS26-LIQUID-GLASS-REFERENCE.md` — v2.4 研究底稿（v1.2 可引用但不修改）
- `.planning/research/IOS26-MOTION-INTERACTION-SPEC.md` — Phase 14 动效研究底稿（v1.2 可引用但不修改）
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets（仅用于 v1.2 文档引用，不修改）
- `src/theme/palette.ts` — `lightPalette` / `darkPalette`
- `src/theme/layout.ts` — `radii` / `shadows` / `listContentInset` / `fabSize`
- `src/theme/typography.ts` — `iosType`（v1.2 §5 说明「唯一来源」）
- `src/theme/colors.ts` — `getIosSemantic()`
- `src/theme/useAppTheme.ts` — 运行时主题
- `src/components/ios/IOSChromeGlassBackground.tsx` — 玻璃背景
- `src/components/ios/SegmentedTwo.tsx` / `GroupedInset.tsx` / `ListRow.tsx` / `Fab.tsx`
- `src/hooks/useReduceTransparency.ts`

### 缺失资产（v1.2 §18 需明确标注「Phase 17 必补」）
- `src/theme/motion.ts`（已被 Phase 15 revert 清除）
- `src/components/SpringPressable.tsx`
- `src/hooks/useReduceMotion.ts`
- `src/utils/haptics.ts`
- `src/components/ios/GlassEffectContainer.tsx`（新）
- `src/components/ios/VibrantText.tsx`（新）
- `src/components/ios/GlassShimmer.tsx`（新）
- `src/hooks/useTouchRipple.ts`（新）
- `src/hooks/useGyroHighlight.ts`（新）
- `src/hooks/useMaterialize.ts`（新）

### Integration Points（Phase 17 会用，本相位不触碰）
- 当前分支 `cursor/phase-16-design-v1.2` 从 `cursor/ios26-design-guide` 分出
- 合并路径：v1.2 完成 → 与 `cursor/ios26-design-guide` 合并后一起 PR 入 master
</code_context>

<specifics>
## Specific Ideas

- **v1.2 修订记录**（§附录 C）必须明确列出本次的 4 事实错误 / 3 概念缺失 / 2 规范冲突 / 若干 RN 风险 的逐项修正点
- **R5 改写**（§1.3）：`视觉 × 触觉 × 声音同帧` → `视觉 × 触觉 同帧（声音交给系统）`
- **R1 改写**（§1.3）：`玻璃只用于导航层，绝不用于内容` → `玻璃只用于 Layer 2（导航 / 控件 / 浮层），不用于 Layer 1 内容`
- **§3.10 措辞**：`必须 GlassEffectContainer` → `建议 GlassEffectContainer；若工程复杂度不允许，按 §21 D2 Accepted Deviation 处理`
- **§3.11 Morphing Tier 1** 降级路径：`react-native-shared-element` → `Reanimated LayoutAnimation + 手算坐标`
- **§3.9 触点传染** 文案：`会传染到相邻玻璃元素` → `多元素共享同一 shared value 触发近似波纹（非物理传播）`
- **§5.3 Rule 1**：`最小正文 17pt（HIG 硬性要求）` → `推荐正文 17pt（Apple 默认值）；技术最小 11pt，本仓库 footnote/caption1 下限 12`
- **§5.1 ALL CAPS**：`iOS 26 废弃 ALL CAPS` → `iOS 26 倾向 sentence case（系统 app 大量改用）；列表列标题仍允许 title-case`

## 四栏标签应用范围（D-02 具体化）

Wave 3 对 v1.1 每条规则 / 每个 Token 扫描一遍，按以下模板追加标签：

| 原规则 | v1.2 追加 |
|---|---|
| 「玻璃只用于 Layer 2」 | 🍎 OFF |
| 「iOS 26 倾向 sentence case」 | 📝 AUTH |
| 「BlurView intensity 60 + 顶部 hairline」 | 🛠️ RN-T1 📦 expo-blur |
| 「陀螺仪高光」 | 🛠️ RN-T2 📦 expo-sensors |
| 「Skia Lens shader」 | 🛠️ RN-T3 📦 @shopify/react-native-skia |
| 「glassEffectUnion 用法」 | 🍎 OFF 🛠️ RN-T2 |

标签放在规则结尾，用空格分隔，不单列一列表格。
</specifics>

<deferred>
## Deferred Ideas

### 推迟到 Phase 17
- 创建 `src/theme/motion.ts` / `src/utils/haptics.ts` 等所有源码骨架（GA-5: B 决定）
- 重新安装 `expo-haptics` / `expo-linear-gradient` / `expo-sensors` 依赖
- 实际改任何 UI 组件

### 推迟到 Phase 18+
- Skia Lensing Tier 2 探索（性能 + 依赖成本评估未完成）
- iPad Sidebar Background Extension（非目标平台）
- 真机 VoiceOver 全量手测

### 审查但未折入本相位
- Gemini 建议的「Figma Token 映射图」 —— 当前无 Figma 源文件，推迟到 Phase 18+
- Gemini 建议的「Before/After 对比图」 —— 需要真机截图资产，推迟到 Phase 17 执行后
</deferred>

---

*Phase: 16-design-guide-v1.2*
*Context gathered: 2026-04-24 via --auto (GA-1~5: A/A/A/A/B)*
