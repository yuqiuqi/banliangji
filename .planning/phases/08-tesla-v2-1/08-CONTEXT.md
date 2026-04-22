# Phase 8: 账单流 · 查账 · 我的与 Tesla 收敛（v2.1）— Context

**Gathered:** 2026-04-22  
**Status:** Ready for planning  
**Source:** Roadmap v2.1 + `08-REVIEWS.md` 共识 + `/gsd-plan-phase 8 --auto --reviews`（以评审吸收为定案）

<domain>
## Phase Boundary

单 Phase 8 内交付：可导航的「**账单/查账**」子流（V21-01）、与 `bill_list` 一致的**按日/按区间**查询（V21-02）、**本地「我的」** 关于/数据说明/设置占位（V21-03）、以及 Tesla 可读性与 `npm run verify`（V21Q-01）。不引入云账号与多用户。
</domain>

<decisions>
## Implementation Decisions（锁定）

### IA / 导航
- **不新增**第 6 个底部 Tab；**保持** 现有 5 Tab（明细 / 图表 / 预算 / 资产 / 我的）。
- **「账单 / 查账」** 主屏为 **HomeStack 内** 新屏 **`BillQuery`**（导航名固定为 `BillQuery`），`options.title` 为 **「账单」** 或与 UI-SPEC 一致的中文标题。
- **入口**：`HomeMain` 顶栏**右侧** 在 **「记一笔」** 旁增加 **可到达 `BillQuery` 的入口**（图标 `filter-variant` 或 `magnify`，与 `08-UI-SPEC` 一致）；**不** 替换现有「记一笔」主 CTA 位置；**不** 去掉「日历」入口（左侧仍进 `Calendar`）。
- **语义区分（文档与验收可 grep）**  
  - **明细**（`HomeMain`）= **当前月** 内按日分组的**默认月视图**；  
  - **账单**（`BillQuery`）= 用户**显式选择「单日」或「日期区间」** 后的**筛选流水**（仍使用同一 `Bill` 行与进 `BillDetail`）；二者关系写在 `08-UI-SPEC.md` 与本文件。

### 时间语义（与 08-REVIEWS / Codex 对齐）
- 所有新代码与 `billRepo.queryBillsInRange(startSec, endSecExclusive)` 对齐；**`billTime` 为秒级 UNIX**（与现库一致）。
- **日界** = 设备 **本地日历** 的 00:00:00.000 至 次日 00:00 前，**半开区间** `[start, end)`。
- 若 **UI 展示「结束日期」为含当日**，在调用 `queryBillsInRange` 前**必须**转换为 **endExclusive = 选中日期的次日 0 点**（与 `queryBillsForCalendarDay` 语义一致）；不得使用 UTC 日界代替本地日界，除非在文档与测试中单独论证。

### 数据与显示
- 查账结果列表**默认**同时包含收入/支出行（`type` 1/2），**不在本 Phase 引入** 仅支出于查账的默认（与 `HomeScreen` 月汇总一致；图表仍仅支出为 Phase 3/7 既有语义）。
- 与 **日历单日** 同一自然日的合计：使用 **同一** `dayBounds` 转换后调用 `queryBillsInRange`，使 `BillQuery` 的「单日」与 `queryBillsForCalendarDay` **同一条件同一集合**（验收矩阵见 08-02）。

### 我的
- `MineTab` 保留；扩展为含 **关于**、**数据位置 / 本地存储说明**、**设置**（可点开空白态或 “Coming soon / 未实现” 文案，**不** 做云同步开关为真实功能，除非标为占位）。

### 与评审的关系
- `08-REVIEWS.md` 中 **「账单 vs 明细」**、**时间语义**、**跨入口一致** 为 **P0 设计约束**；本 CONTEXT 为执行层定稿。若与旧 Clay 文冲突，以 **Tesla + 本文件** 为准。

### Claude's Discretion
- `BillQuery` 布局（SectionList 复用 vs 简单 FlatList）由实现者选，须满足 UI-SPEC 可访问性标签与 `npm run verify`。
</decisions>

<canonical_refs>
## Canonical References

- `DESIGN.md` — Tesla 视觉与 Electric Blue 使用边界  
- `src/theme/colors.ts` — 运行时主题令牌  
- `src/db/billRepo.ts` — 查询与半开区间唯一来源  
- `.planning/phases/08-tesla-v2-1/08-UI-SPEC.md` — 本相 UI/文案契约  
- `.planning/phases/08-tesla-v2-1/08-REVIEWS.md` — 跨模型评审与共识
</canonical_refs>

<deferred>
## Deferred Ideas

- 云同步、账号、多设备、导出 CSV（见 REQUIREMENTS 远期）  
- 为 `billTime` 建索引（本 Phase 可记 ADR 为「按数据量再评」）  
- 新第六 Tab
</deferred>

---

*Phase: 08-tesla-v2-1 · Context for V21-01~03*
