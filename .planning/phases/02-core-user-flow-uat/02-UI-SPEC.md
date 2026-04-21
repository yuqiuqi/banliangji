---
phase: 02
slug: core-user-flow-uat
status: approved
shadcn_initialized: false
preset: clay-rn
created: 2026-04-21
reviewed: 2026-04-21
---

# Phase 2 — UI Design Contract (React Native / Clay)

> **Platform:** Expo SDK ~54 / React Native 0.81。**不**使用 shadcn；视觉对齐根目录 `DESIGN.md` 与 `src/theme/colors.ts`。Phase 2 **不**接入 Roobert（见 `02-CONTEXT.md` D-02）。

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none（RN StyleSheet） |
| Preset | Clay（getdesign） |
| Component library | React Native core + React Navigation |
| Icon library | `@expo/vector-icons`（与现有一致） |
| Font | **System**（SF Pro / Roboto）；字重层次：标题偏粗、正文 regular、标签 medium |

---

## Visual hierarchy（主路径锚点）

| Screen | Primary focal（第一眼） | Secondary |
|--------|-------------------------|-----------|
| **Home（明细）** | 当月 **总收入 / 总支出** 汇总区（Lemon 条或卡片顶区） | 其下账单 **列表**（白卡行，可滚动） |
| **记一笔** | **金额显示 + 计算器** 区域 | 类别网格 / 保存操作条 |
| **详情** | **金额行** 与类型（支出/收入） | 备注与元数据 |
| **日历** | **当前月标题 + 网格** | 选中日期的明细预览或入口 |

图标型 Tab / header 按钮：保留 `accessibilityLabel`（或等价），避免纯图标无读屏文案。

---

## Spacing Scale

Declared values（4px 基准；与现有屏内 padding 对齐时可微调）：

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | 图标间隙 |
| sm | 8px | 紧凑行内距 |
| md | 16px | 默认屏幕水平边距、卡片内边距 |
| lg | 24px | 区块间距、大卡片圆角上限参考 |
| xl | 32px | 少用大留白 |

**Exceptions:** 导航 header 高度遵循 React Navigation 默认；计算器键区可用更紧的 sm 网格。

---

## Typography

| Role | Size | Weight | Line height | Notes |
|------|------|--------|-------------|-------|
| Screen title / 大标题 | 21 | 600 | 28 | `colors.title`（固定一档，避免区间漂移） |
| Section / 卡片标题 | 17 | 600 | 24 | |
| **Body（列表主行）** | **16** | **400** | **24（1.5）** | 次要信息仍用 `colors.lightTitle`，**同字号** |
| Label / 按钮 | 16 | 500 | 24 | |
| Tab label | 12 | 500–600 | 16 | 与 `tabbarTint` 激活态 |

---

## Color（与 `colors.ts` 一致）

**60 / 30 / 10（Clay on RN）：** 约 **60%** 暖色画布 + 白卡（`canvas` + `white` 列表面）；**30%** 结构中性（`body` 边框、`light` 条带、`lightTitle` 字）；**10%** 品牌/语义强调（`main` 顶栏、`income`/Tab 的 Matcha、必要时 **destructive**）。

| Role | Token / Hex | Usage |
|------|-------------|-------|
| Canvas | `colors.canvas` `#faf9f7` | 屏幕背景 |
| Card / row surface | `colors.white` `#ffffff` | 列表行、卡片浮在 canvas 上 |
| Primary header bar | `colors.main` `#fbbd41` | 顶栏、主 CTA 条（与现有 Lemon 一致） |
| Border / divider | `colors.body` `#dad4c8` | 燕麦边框、分隔线 |
| Strip / subtle panel | `colors.light` `#eee9df` | 分段底、计算器区 |
| Primary text | `colors.title` `#000000` | |
| Muted text | `colors.lightTitle` `#9f9b93` | |
| Income / positive | `colors.income` / `tabbarTint` `#078a52` | 收入、Tab 激活（Matcha） |
| On-main secondary | `colors.onMainSecondary` `#55534e` | 黄条上的次要字 |
| **Destructive** | `#dc3545`（或 `Platform.select` 使用系统红） | **删除账单**、不可逆操作按钮与确认文案强调；**不**用于普通导航 |

**Accent 使用：** Matcha 用于收入与 Tab 强调；**禁止**把所有可点元素都改成高饱和色块。

---

## Shape & elevation（Clay on mobile）

| Element | Rule |
|---------|------|
| 卡片 / 主列表容器 | `borderRadius` **12**（允许 10–16 单屏内统一） |
| 大面板 / modal 外框 | 可向 **16–24** 过渡 |
| 边框 | `borderWidth: 1` + `borderColor: colors.body`，或 `hairlineWidth` + 同色 |
| 阴影 | iOS：`shadowOpacity` 低（0.06–0.12）、`shadowRadius` 6–12、轻微 `shadowOffset`；Android：`elevation` 2–4。**不**要求复刻 Web 多层 inset |

---

## Motion & press

| Interaction | Rule |
|-------------|------|
| Pressable 默认 | `pressed`：`opacity` ≤ 0.96 或 `scale` 0.98 或 `translateY` 1 |
| **禁止** Phase 2 目标 | Web 级 `rotateZ(-8deg)` + 大位移 hover |

---

## Copywriting Contract（沿用现有文案时可不强制改字）

| Element | Copy 原则 |
|---------|------------|
| Primary CTA | 动词 + 对象（保存、完成、记一笔） |
| Empty state | 说明「暂无数据」+ 下一步（去记一笔） |
| Error | 问题 + 可执行修复（检查金额、重试） |
| Destructive | 明确动作名 + 二次确认 |

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| N/A（RN） | — | 新增依赖需与 Expo 兼容；不引入 Web-only 组件库 |

---

## Scope（本 Phase 屏幕）

必须对照本契约走查/收敛：**`HomeScreen`**、**`CreateBillScreen`**、**`BillDetailScreen`**、**`CalendarScreen`**、**`ChartScreen`**（仅壳与分段，不改聚合语义）、**`MineScreen`**、**`RootNavigator`** Tab/Stack 容器。

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS（含主路径视觉锚点表）
- [x] Dimension 3 Color: PASS（60/30/10 + destructive）
- [x] Dimension 4 Typography: PASS（Body 16 / lh 24）
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-04-21（`/gsd-ui-phase 2` 校验并入 FLAG 修复）
