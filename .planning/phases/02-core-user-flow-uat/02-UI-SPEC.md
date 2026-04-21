---
phase: 02
slug: core-user-flow-uat
status: draft
shadcn_initialized: false
preset: clay-rn
created: 2026-04-21
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

| Role | Size | Weight | Notes |
|------|------|--------|-------|
| Screen title / 大标题 | 20–22 | 600 | `colors.title` |
| Section / 卡片标题 | 17–18 | 600 | |
| Body | 15–16 | 400 | 主列表次要信息 `colors.lightTitle` |
| Label / 按钮 | 15–16 | 500 | |
| Tab label | 11–12 | 500–600 | 与 `tabbarTint` 激活态 |

---

## Color（与 `colors.ts` 一致）

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

- [ ] Dimension 1 Copywriting: PASS（抽查）
- [ ] Dimension 2 Visuals: PASS（圆角/边框/层次）
- [ ] Dimension 3 Color: PASS（仅 tokens，无硬编码散落新增）
- [ ] Dimension 4 Typography: PASS（系统字体层次）
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending（Plan 03 UAT 后由执行者勾选）
