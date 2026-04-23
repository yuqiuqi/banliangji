---
phase: 05
slug: mvp-v2
status: approved
shadcn_initialized: false
preset: clay-rn
created: 2026-04-21
reviewed: 2026-04-21
---

# Phase 5 — UI Design Contract（预算 / 资产 MVP）

> **平台：** Expo SDK 54 / React Native。**延续** Phase 2 `02-UI-SPEC.md` 的 Clay 令牌与 `DESIGN.md`；本阶段新增 **预算**、**资产** 两 Tab 及对应屏幕，**不**追求 Phase 6 级全局动效。

---

## Design System（继承）

与 `.planning/phases/02-core-user-flow-uat/02-UI-SPEC.md` 一致：`colors.ts`、`DESIGN.md`、系统字体、`@expo/vector-icons`（MaterialCommunityIcons）、卡片圆角 **12**、燕麦边框 `colors.body`。

---

## 导航

| 顺序（左→右） | Tab 文案 | 图标建议 | 说明 |
|---------------|----------|----------|------|
| 1 | 明细 | `receipt` | 现有 HomeStack |
| 2 | 图表 | `chart-arc` | 现有 |
| 3 | **预算** | `chart-pie` 或 `cash` | 新建 `BudgetScreen` |
| 4 | **资产** | `wallet` | 新建 `AssetScreen` |
| 5 | 我的 | `account-circle` | 现有 `MineScreen` |

**TabBar：** 5 个 Tab 时标签可用 **11–12px**，避免截断；必要时缩短文案为「预算」「资产」（两字）。

---

## 屏幕：预算（REF-01）

| 元素 | 规则 |
|------|------|
| **主焦点** | 当前月标题（如 `2026年4月`）+ **已用 / 预算** 两行数字（已用 = 当月支出合计，与图表口径一致） |
| **进度** | 横向进度条；比例 `min(1, spent/cap)`；**超支**时进度条填充与文案使用 **destructive / 警告红**（与 `02-UI-SPEC` 删除色一致方向） |
| **超支** | 常驻可见一句：**「已超出预算」**（或等价），满足「可辨别」 |
| **编辑 cap** | 主按钮或工具栏入口：**设置本月预算**；表单为 **金额 + 保存**（可 Modal 或内联卡片）；cap 存 SQLite（执行层实现） |
| **月份** | MVP 默认 **当前日历月**；若实现「上月/下月」切换，须与 `billRepo.queryBillsForMonth` 的月份边界一致 |
| **空态** | 无 cap 时：提示「设置本月预算」+ CTA；无账单时已用为 0、进度 0% |

---

## 屏幕：资产（REF-02）

| 元素 | 规则 |
|------|------|
| **列表** | 白卡行：账户名 + **余额**（`formatAmountDisplay`）；Clay 列表行 |
| **空态** | 「添加账户」引导 + CTA |
| **新建/编辑** | 名称 + 余额（数字键盘友好）；保存回 SQLite；**不**要求与账单自动联动（弱耦合文案可放在副标题或 `Mine`） |
| **删除** | 可选；若做需确认对话框（destructive） |

---

## 可达性

- 预算进度条与超支文案对读屏友好：`accessibilityLabel` 含「已使用 x，预算 y」。

---

## 明确不做（本 Phase）

- 多币种选择器、资产走势图、预算分类饼图扩展（可 defer）
- 高规格转场动画（Phase 6）

---

*Phase: 05-mvp-v2 · UI contract for planning / execution*
