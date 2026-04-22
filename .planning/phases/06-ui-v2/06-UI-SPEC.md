---
phase: 06
slug: ui-v2
status: approved
shadcn_initialized: false
preset: clay-rn
created: 2026-04-22
reviewed: 2026-04-22
---

# Phase 6 — UI Design Contract（全局层次 + 按压 / 轻动效）

> **平台：** Expo SDK 54 / React Native。**增量**于 `02-UI-SPEC.md` 与 `05-UI-SPEC.md`；满足 **REF-04**。  
> **边界：** 本阶段负责 **全局 Clay 层次、列表行、卡片、顶区、可感知按压与轻过渡**。**图表 Tab 内** 柱/条/图例/周月年切换的 Shark 向表现归 **Phase 7（REF-03）**；Phase 6 仅可改 `ChartScreen` 的 **分段器、卡片容器、标题区、外壳列表行**，**禁止** 改动 `chartAggregate.ts` 及区间语义。

---

## Design System（继承）

| 来源 | 规则 |
|------|------|
| 颜色 | `src/theme/colors.ts` 单一来源；新增语义色须具名 token |
| 圆角 / 阴影 / 边框 | `src/theme/layout.ts` 增量；与 `02-UI-SPEC` Shape & elevation 一致方向 |
| 字体 | 系统字体 + Phase 2 字重层次；不强制 Roobert |
| 图标 | `@expo/vector-icons`（与现有一致） |

---

## Motion & interaction tokens（新增 — 须在代码中落地）

以下数值为 **默认值**；实现时集中放在 `src/theme/layout.ts` **或** 新建 `src/theme/motion.ts` 并导出：

| Token | 值 | 用途 |
|-------|-----|------|
| `pressedOpacity` | `0.92` | `Pressable` `style` 回调中 pressed 态主表面 |
| `pressScale` | `0.98` | 可选 `transform: [{ scale }]`，与 opacity **二选一或叠加**（勿超过 0.96–0.99 区间以免眩晕） |
| `pressTranslateY` | `1`（px） | 可选轻微下压 |
| `pressDurationMs` | `100` | 文档化；`Animated` 若使用则 `duration` 接近此量级 |

**禁止：** 默认不引入 `react-native-reanimated`；禁止 Web Clay 级大角度 `rotateZ` + 大位移（与 `02-UI-SPEC` Motion 一致）。

**覆盖范围：** 所有 **可点列表行**、**主按钮**、**Tab 图标区域**（在 RN 能力内）、**预算/资产主 CTA**、**明细月份切换等 icon 按钮** — 须有 **≥100ms 可辨** 的视觉反馈（opacity 或 scale 或二者）。

---

## Elevation & shape 增量

| Token | 规则 |
|-------|------|
| `radii.chip` | `10` — 分段控件、小标签容器 |
| `shadows.raised` | iOS：`shadowOpacity` 0.08–0.12，`shadowRadius` 8–12，轻 `shadowOffset`；Android：`elevation` 3–4 |
| 列表行 | 保持白卡 + `hairlineBorder` 或间距分隔；**层次**通过 **阴影略抬升汇总条/首卡** 与 **行 pressed 态** 体现 |

---

## 逐屏契约

### Home（明细）

| 元素 | 规则 |
|------|------|
| 汇总条 / 顶区 | 相对列表 **略强** 层次（`shadows.card` 或 `shadows.raised` 二选一档位统一） |
| 列表行 | 每行 `Pressable`；pressed 应用 `pressedOpacity` 或 `pressScale` |
| 月份 / 操作 icon | 可点处同上 |

### CreateBill（记一笔）

| 元素 | 规则 |
|------|------|
| 类别网格格 | 单元格 `Pressable` + pressed 态 |
| 主操作（保存等） | 明确 pressed；计算器键区可更紧但仍需反馈 |

### BillDetail / Calendar

| 元素 | 规则 |
|------|------|
| 主列表 / 日期格 / 主要按钮 | 统一按压令牌 |

### ChartScreen（壳层 only）

| 元素 | 规则 |
|------|------|
| 周/月/年 **分段器** | 选中/未选中对比 + **分段控件 pressed** |
| 卡片容器 / 标题区 | 与 Phase 2 spacing 一致方向下 **略抬升** |
| **禁止** | 修改聚合查询、区间边界、`chartAggregate` 行为 |

### BudgetScreen / AssetScreen

| 元素 | 规则 |
|------|------|
| 列表行、进度区可点部分、「设置预算」等 CTA | 统一按压；超支色保持 `05-UI-SPEC` destructive 方向 |

### MineScreen（我的）

| 元素 | 规则 |
|------|------|
| 范围 | **仅令牌对齐**（色/圆角/按压若与明细复用组件则一并一致） |
| 不做 | 单独 Shark 向信息架构改版 |

---

## 导航壳

| 元素 | 规则 |
|------|------|
| TabBar | 在可行范围内为 Tab 按下提供反馈（RN Tab 限制下以 **图标/标签样式** 或 **wrapper** 实现文档化方案） |
| Stack | 沿用 React Navigation 默认转场；不强制共享元素 |

---

## 回归与质量

- 改版后 **`npm run verify`**（`typecheck` + `lint` + `test`）必须全绿。
- 禁止为动效新增 `any` 或关闭 eslint 规则。

---

## 实现对照清单（执行 Phase 6 时勾选）

| # | 项 | 06-01 / 06-02 |
|---|----|----------------|
| 1 | `pressedOpacity` / `pressScale`（或 `motion.ts`）已导出并在主题文档化 | |
| 2 | `radii.chip`、`shadows.raised`（若采用）已落地 | |
| 3 | `HomeScreen` 列表行 + 顶区层次 | |
| 4 | `CreateBillScreen` 类别格 + 主按钮 | |
| 5 | `BillDetailScreen`、`CalendarScreen` 可点控件 | |
| 6 | `ChartScreen` 仅壳层 / 分段 / 容器（未改数据层） | |
| 7 | `BudgetScreen`、`AssetScreen` | |
| 8 | `MineScreen` 令牌对齐（若适用） | |
| 9 | `npm run verify` 绿 | |

---

*Phase: 06-ui-v2 · UI contract for REF-04 / planning / execution*
