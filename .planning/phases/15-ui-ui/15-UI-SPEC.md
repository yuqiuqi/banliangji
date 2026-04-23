---
status: approved
reviewed_at: "2026-04-23"
phase: 15
phase_slug: ui-ui
---

# Phase 15 — UI 设计契约（视觉美观 · 层次 · 专业美工向）

**阶段意图：** 动效与交互契约已由 **Phase 14** 落地；本阶段以 **专业视觉设计** 收口——**层次、留白、表面质感、图表可读性、组件统一度**，在 **不改动** `motion.ts` / `SpringPressable` 主路径与弹簧参数的前提下提升「好看」与「像成品 App」。

**冻结（非本阶段改动面）：** `.planning/phases/14-ios26-motion-polish/14-UI-SPEC.md` 中动效令牌、Reduce Motion、触觉映射、Modal Spring、Header collapse 数值与实现策略。

**工程根契约：** 仓库根 `UI-SPEC.md`（色票、材质、模态 scrim、Liquid Glass 工程近似）。

---

## Design System

| Tool | Role |
|------|------|
| Expo + React Native | 宿主与导航 |
| `src/theme/*` | 色票、排版、圆角、阴影、间距 token（本阶段 **优先改 token 与组件样式**，不改 Reanimated 曲线） |
| `expo-blur` | Tab / Chrome 材质（与根契约一致） |

**禁止：** 为「更好看」在业务文件引入 **新的** 硬编码色值或第三套圆角体系；一律走 `palette` / `layout` / 组件级封装。

---

## Copywriting Contract

**原则：** 中文、动词 + 名词或明确对象；避免英文占位与无信息空态。

| Surface | Primary CTA | Secondary | Empty state (示例方向) | Error / destructive |
|--------|---------------|-----------|-------------------------|---------------------|
| 记一笔 / 表单 | **保存账单** | **放弃本次编辑** | — | **删除本条记录**（destructive + 二次确认） |
| 预算编辑 | **保存预算** | **取消修改** | 「还没有预算，点下方添加」类 **可操作** 提示 | — |
| 资产 / 账户 | **保存账户** | **暂不保存** | 「暂无资产卡片」+ 主按钮 **添加资产** | 删除：**确认删除该账户** |
| 账单列表 | — | — | 「本周还没有账单」+ **去记一笔** | — |
| 图表 / 分析 | — | — | 「暂无统计数据」+ 引导筛选或记账 | — |

> 不允许作为主 CTA 的泛标签：**确定 / 好的 / 提交 / OK / Save** 单独使用。系统 `Alert` 仍可用「删除 / 取消」配对，但须在工程内与上表 **语义一致**。

---

## Visual Language & Hierarchy

**参考文献（≥3）：**

| # | Reference | 用途 |
|---|-----------|------|
| 1 | [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) | 层次、对齐、可读性、控件标准外观 |
| 2 | 根 `UI-SPEC.md` | 材质、色票、分组卡片禁则 |
| 3 | `.planning/phases/14-ios26-motion-polish/14-UI-SPEC.md` | 动效与按压 **只读对齐**，本阶段不改参数 |

### 主屏视觉锚点（Focal point）

| Screen | 第一眼锚点 | 次级层次 |
|--------|------------|----------|
| 首页 / 概览 | 当日或周期 **核心数字**（金额/结余） | 分组列表区头 → 行内次要说明 |
| 预算 | **预算余量/进度** 主图形或首卡 | 分类行、次要指标 |
| 资产 | **总资产** 或顶部汇总卡 | 各资产行 |
| 图表 | **主图区**（柱/线） | 分段器、图例、辅助数字 |
| 我的 | 头像/昵称 **或** 首屏设置分组标题 | 列表项 chevron 与副标题 |

**图标：** 主路径避免 **无文案的图标按钮**；若必须图标-only（如导航栏），须 **`accessibilityLabel` / 无障碍名** 与根契约一致。

---

## Color Strategy (60 · 30 · 10)

| Role | ~% | Semantic tokens（实现源） |
|------|-----|---------------------------|
| Dominant | 60 | `groupedBackground` — 大屏底 |
| Secondary | 30 | `secondaryGrouped`、`tertiaryFill`、卡片表面 |
| Accent | 10 | **`systemBlue`** — **仅**下列用途（非「所有可点元素」） |

**Accent 保留清单（reserved for）：**

1. **主 FAB** 填充、**行内主链接**（单屏 ≤1 条主链接时用色）。  
2. **分段控件选中态** 上的强调（与 `SegmentedTwo` 轨道对比，而非整行染色）。  
3. **日期选择器「完成」** 等系统级强调控件（与根 `UI-SPEC.md` §6 一致）。

**语义色（非装饰 accent）：** 收入 `systemGreen`、支出 / destructive `systemRed` — 与 `systemBlue` 并列语义，**不得**把红绿当「点缀色」滥用。

**Destructive：** 删除类操作使用 `systemRed` + `Alert` destructive；见 Copywriting 表。

---

## Typography

**唯一刻度** — `src/theme/typography.ts` · `iosType`（≤4 字号，≤2 字重）。

| Role | fontSize | fontWeight | lineHeight |
|------|----------|------------|------------|
| Nav title | 17 | 600 | 22 |
| Body | 17 | 400 | 22 |
| Large title | 20 | 600 | 25 |
| Footnote | 13 | 400 | 18 |
| Caption | 12 | 400 | 16 |

**美观约束：** 金额类数字允许 **等宽或 tabular 取向**（若引入字体变体须在 `typography.ts` 单列一行，不增加第五档 **字号**）；区头与正文对比主要靠 **颜色 `secondaryLabel`** 而非额外字重。

---

## Spacing & Vertical Rhythm

**刻度（4 的倍数）：** `4, 8, 12, 16, 24, 32, 48, 64`。

| 用途 | 值 | 说明 |
|------|-----|------|
| 列表水平 inset | 16 | `listContentInset` |
| 相邻分组块间距 | 16–24 | 优先 24 做大呼吸 |
| 卡片内边距 | 12–16 | 与 `radii.card` 12 协调 |
| 屏头标题下留白 | 8–16 | 与大标题折叠动画衔接 Phase 14 |

**禁则：** 新增外边距/内边距不得使用 **非 4 倍数**（验收例外记入 `15-VERIFICATION.md`）。

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| —（RN 工程，无 shadcn registry） | — | not required |

---

## Phase 15 — 美观度执行要点（Planner 可拆任务）

以下 **不改变** Phase 14 动画曲线，仅视觉层：

1. **表面：** 统一卡片/分组 **阴影、圆角、底与分割线** 与根契约；消灭「白盒+粗线」廉价感（禁则见根 `UI-SPEC.md`）。  
2. **图表：** 柱/轴标签对比度、留白、选中态与未选中态 **明度差**；避免彩虹色无语义堆叠。  
3. **列表行：** 主行 / 次行 **字色与字级** 严格用 token；金额正负与语义色一致。  
4. **空态：** 每类列表/图必须有 **插图或图标 + 一句说明 + 一条主操作**（文案见上表）。  
5. **分段与 Chip：** 轨道、选中填充、与 **accent 保留清单** 对齐，避免整屏高饱和。  

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

## UI-SPEC VERIFIED

**Phase:** 15 — ui-ui（视觉美观专向）  
**Status:** APPROVED

### Dimension Results

| Dimension | Verdict | Notes |
|-----------|---------|-------|
| 1 Copywriting | PASS | 中文 CTA 具体；空态有引导；destructive 有确认语义 |
| 2 Visuals | PASS | HIG + 根契约 + Phase 14；主屏 focal 表齐全 |
| 3 Color | PASS | 60/30/10；accent 保留清单非「全部可交互」 |
| 4 Typography | PASS | 四档字号、两字重、lineHeight 声明 |
| 5 Spacing | PASS | 4 倍数 + 垂直节奏表 |
| 6 Registry Safety | PASS | 无 shadcn 注册表 |

**Recommendations (non-blocking):** 执行期可补 `15-VERIFICATION.md` 截屏对比（Before/After）作为美工验收附件。
