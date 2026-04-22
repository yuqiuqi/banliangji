# Phase 11: chrome-depth — Context

**Gathered:** 2026-04-22  
**Status:** Ready for planning  
**Mode:** `/gsd-discuss-phase 11 --auto --analyze`（全部灰区自动选定为推荐项；见 `11-DISCUSSION-LOG.md`）

<domain>

## Phase Boundary

在 **不新增业务能力、不引入任何联网能力** 的前提下，交付 **THEME-01**（系统深色外观下关键屏可读）、**A11Y-01**（系统「降低透明度」下毛玻璃区域可辨识且主路径可用），以及 **LG-01**：在 RN / `expo-blur` / Reanimated 能力边界内，按 `11-MATERIAL-MOTION-SPEC.md` 的 **材质栈 + 动效栈** 缩小与 iOS 26 Liquid Glass 在 **动效、透明度层次、立体感** 上的感知差距（非像素级复刻）。验收以 ROADMAP 成功标准 + `npm run verify` 为准；偏差写入 `UI-SPEC.md` / `DESIGN.md` 与 Phase 11 `VERIFICATION`。

</domain>

<decisions>

## Implementation Decisions

### 深色外观（THEME-01）

- **D11-01:** **以系统外观为唯一来源**：使用 React Native **`useColorScheme()`**（或等价 API）驱动亮/暗；新增 **成对语义 token**（扩展现有 `colors` / 独立 `theme` 模块均可），使导航、分组列表、Tab、记一笔等 **Tier-1** 与 `UI-SPEC.md` / `DESIGN.md` 的 dark 取向一致或可文档化 **Accepted deviation**。
- **D11-02:** **Phase 11 不新增**「应用内主题开关」。`REQUIREMENTS.md` 虽写「或应用内若已有」，当前代码 **无** 该开关；应用内强制主题记入 **backlog**，避免本阶段范围膨胀。

### 降低透明度（A11Y-01）

- **D11-03:** **集中检测 + 集中降级**：使用 `AccessibilityInfo` **订阅**「降低透明度」（及文档中需对齐的同类设置）；提供 **单一封装组件或 Hook**（例如自适应毛玻璃容器：开 → 不透明底 + 分隔线/字色；关 → 现有 Blur 栈），在 **Tab 栏、记一笔 Dock/Sheet 相关 Tier-1** 接入，避免各屏复制 `if` 分支。
- **D11-04:** 降级样式须 **非空白、可点击、可辨识**；与 `11-MATERIAL-MOTION-SPEC` §4.3 一致。

### Liquid Glass 纵深（LG-01）

- **D11-05:** **材质栈按 §4.1 工程化**：在 `src/components/ios/` 增加 **可复用的分层表面原语**（Blur + 语义 tint + 可选顶区 hairline + 与 elevation 绑定的 shadow），供 Tab 背景、大浮层（记一笔 Dock）、必要时顶栏区域组合使用；**禁止**仅为「再调大一点 blur」而无分层。
- **D11-06:** **动效栈按 §4.2 最小有效集**：Tier-1 交互（按压、Tab 切换、记一笔 Sheet/Dock 呈现）优先 **Reanimated `withSpring`**，避免主导性的单一线性 `timing`；全应用 Pressable 大迁移 **不在** Phase 11 必达。
- **D11-07:** **Android** 维持 Phase 9 约定：**不透明近似 + 文档标注**，不与 iOS 强行一致。
- **D11-08:** **无法 1:1** 处逐项 **Accepted deviation**，说明设计原则（如 Lensing）与 RN / `expo-blur` 限制；在 Phase 11 **`VERIFICATION`** 中可勾选或偏差闭环。

### 文档与验收

- **D11-09:** 新建或更新本目录 **`11-VERIFICATION.md`**（或项目等价命名），覆盖 ROADMAP 中静态 / 滚动 / 动效 / 辅助功能 spot-check；并同步根目录 **`UI-SPEC.md`**、**`DESIGN.md`** 的 dark / 降级 / 材质偏差说明。

### Claude's Discretion

- 语义 token 文件组织（单文件 `colors` 扩展 vs `colors.light` / `colors.dark`）以实现清晰为准。  
- Tier-1 是否包含「所有 Stack header」由 planner 按改动面与风险在 PLAN 中收敛，但 **Tab + 记一笔 Dock + 至少一处主列表顶栏** 为 ROADMAP 明示验收面。

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 11 规格与需求

- `.planning/phases/11-chrome-depth/11-MATERIAL-MOTION-SPEC.md` — 材质栈 / 动效栈 / 验收建议 / 本地-only 约束  
- `.planning/REQUIREMENTS.md` — THEME-01, A11Y-01, LG-01；Out of Scope（含联网）  
- `.planning/ROADMAP.md` — Phase 11 目标、成功标准、非目标  

### 产品视觉与上一阶段

- `UI-SPEC.md` — 视觉与交互合同（需同步 dark / 偏差）  
- `DESIGN.md` — 设计取向（需同步）  
- `.planning/phases/09-ios26-chrome/09-CONTEXT.md` — iOS 26 Chrome 锁定决策；Dark 由 Phase 11 承接  
- `.planning/phases/09-ios26-chrome/09-BREAKTHROUGH-SPEC.md` — 全屏矩阵（对照回归范围时参考）  
- `.planning/phases/09-ios26-chrome/09-VERIFICATION.md` — Phase 9 基线验收  
- `.planning/phases/09-ios26-chrome/09-UI-SPEC.md` — 若与根 `UI-SPEC.md` 并存，以根目录当前合约为准并交叉核对  

### 实现入口

- `src/navigation/RootNavigator.tsx` — Tab `BlurView`、导航主题  
- `src/screens/CreateBillScreen.tsx` — 记一笔 Blur / Dock  
- `src/theme/colors.ts`, `src/theme/layout.ts` — 语义色与布局 token  
- `src/components/ios/` — 既有 iOS 原语（GroupedInset、Fab 等）  

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `src/components/ios/*` — GroupedInset、ListRow、Fab、SegmentedTwo；Phase 11 材质原语应 **扩展此目录** 而非在业务屏堆叠重复 Blur。  
- `RootNavigator` — iOS Tab 已用 `BlurView` + `tabBarStyle`；是 Tier-1 材质栈的首要集成点。  
- `CreateBillScreen` — 记一笔区域已有 `BlurView`；与 SPEC 大浮层「变厚」参数一致化优先级高。

### Established Patterns

- Phase 9：**iOS = `expo-blur`**，**Android = 不透明降级**（`09-CONTEXT` D9-02）。  
- Tab 按压：`PlatformPressable` + `pressedOpacity`（`layout.ts`）。

### Integration Points

- `NavigationContainer` 的 `navTheme` 与 **header** 样式需与 **dark** token 联动。  
- 记一笔为 **modal** 组内屏；Sheet/Dock 动效与栈转场需 **视觉连贯**（SPEC §4.2）。

</code_context>

<specifics>

## Specific Ideas

- 用户约束：**项目核心为本地存储**；Phase 11 **禁止**将云同步、在线资源、账号、远程配置等纳入计划或任务分解。

</specifics>

<deferred>

## Deferred Ideas

- **应用内主题开关**（独立于系统）— 未在 REQ 强制；现无实现 → backlog。  
- **自定义原生 Liquid Glass 视图**（Tier-2）— SPEC 允许未来 SDK；非 Phase 11 必达。  
- **联网相关能力** — 与产品核心冲突；另里程碑。

### Reviewed Todos (not folded)

- `todo match-phase 11` 无匹配项 — 本节省略。

</deferred>

---

*Phase: 11-chrome-depth*  
*Context gathered: 2026-04-22*
