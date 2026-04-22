---
phase: 08
slug: tesla-v2-1
status: draft
preset: tesla-rn
created: 2026-04-22
---

# Phase 8 — UI Design Contract（账单 / 查账 / 我的 · V21 · Tesla）

> **平台：** Expo 54 / React Native。在 Phase 5–7 已有 Tesla 主题上，锁定 **V21-01~03** 的导航、查账、我的屏 **布局与文案**，避免执行期现编风格。

## 非目标

- 不改为 Web / 不引入 shadcn  
- 不实现真实云设置或登录页  
- 不修改 `chartAggregate` 的「仅支出」语义（与查账/明细无关）

## 与「明细」的文案与层次

| 屏 | 标题（header） | 角色 |
|----|----------------|------|
| `HomeMain` | `明细` | 当前 **月** 的默认流水（按日 section） |
| `BillQuery` | `账单` | **单日** 或 **自—至** 区间 筛选后的流水 |
| 进入方式 | 从 `HomeMain` 顶栏 | 见下节 |

**避免重复感：** `BillQuery` 在 **单日** 模式下 **默认选中「今日」**（设备本地日历日界），进入即有数据或该日空态；**区间** 模式需用户选定起止日，未选全时展示引导或空态（实现选一种，须在 `08-01-PLAN` 写死并可 grep）。

## 顶栏（HomeMain）

- 背景 `colors.main`，标题与图标 `colors.onMain`（与现一致）。  
- **左侧**：`calendar-month` → `Calendar`（保留）。  
- **右侧**（**从左到右**）：`filter-variant`（或 `tune`）→ 导航到 **`BillQuery`**，accessibilityLabel 必须包含子串 `查账` 或 `账单` 之一；`plus-circle-outline` → `CreateBill`（保留）。  
- 两图标均使用 `headerBtn` 式 hitSlop ≥12。

## 账单 / 查账屏（BillQuery）

### 模式

- **Segmented 或 双行**：`单日` / `区间` 二选一。  
- **单日**：一个 DateTimePicker/日期选择 → 数据 `queryBillsForCalendarDay(selected)` 或 **等价** 的 `queryBillsInRange(当日 start, 次日 exclusive)`。  
- **区间**：`开始日` + `结束日`（**含结束日**）→ 转 `endExclusive` = 结束日+1 天 0 点；`start` = 开始日 0 点。非法（结束<开始）时 **不崩溃**，展示错误文案（见下）。

### 列表与行

- 行样式与 `HomeScreen` 列表行 **同一信息层级**（金额、类别/图标、时间）；可复用 `CategoryIcon`、金额格式化工具。  
- 点击行 → `BillDetail`（`billId` 已有）。

### 空态

| 场景 | 方向 |
|------|------|
| 无数据 | 必有中文说明，子串二选一或并存：`该条件下暂无` 或 `暂无账单` |
| 未选区（若采用「必须先选日」） | 提示选择日期/区间 |

### 错误 / 边距

- 区间 `结束 < 开始`：提示中须含 **「结束」** 与 **「开始」** 或 **「时间」** 之一。  
- 不展示精确 DB 文件路径在列表区（隐私）；路径仅在「我的」说明。

## 我的（MineTab）

- 顶区：大标题 `我的`，背景 `colors.main`，标题色 `colors.onMain`。  
- 至少 **2 个** 可点击区块（`Pressable` + `accessibilityLabel`）：  
  1. **关于** — app 名、Expo 版本、开源说明（可延续现文案方向）。  
  2. **数据与存储** — 说明数据**仅本机** SQLite、无账号同步；**不得** 承诺已上线导出若未实现。  
- **设置**（第三块可选）：可导航到子屏或占位列，文案可含 `后续` 或 `占位`。  
- 全页 Tesla：**留白、卡片 `radii.card`、hairline 边框与 `shadows.card` 与 Phase 6/7 一致**；主操作若出现按钮，**primary** 仅 `colors.accent`，禁止大面积黄底。

## Tesla / 可访问性

- 可感知按压：`pressedOpacity` 与现有屏一致。  
- `npm run verify` 为 Phase 8 收口红线（V21Q-01）。

## 实现对照清单

| # | 项 | 计划 |
|---|----|------|
| 1 | `BillQuery` 与 `HomeMain` 顶栏入口 | 08-01 |
| 2 | 单日/区间 + 与 billRepo 一致 | 08-01 |
| 3 | 我的 关于 + 数据说明 + 设置占位 | 08-02 |
| 4 | 跨入口一致矩阵 + verify | 08-02 |

---

*Phase: 08-tesla-v2-1 · UI contract for V21*
