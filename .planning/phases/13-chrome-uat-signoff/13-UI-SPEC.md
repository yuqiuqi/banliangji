---
phase: 13
slug: chrome-uat-signoff
status: approved
shadcn_initialized: false
preset: not-applicable
created: 2026-04-23
parent_contract: UI-SPEC.md
requirements:
  - LG-02
  - THEME-01
  - A11Y-01
  - LG-01
---

# Phase 13 — UI Design Contract（LG-02 · Tier-2 副路径）

> **范围：** **图表 / 预算 / 资产 / 我的** 四屏与 **Tier-1**（`HomeScreen`、`src/components/ios/*`）在视觉与交互上的一致性。  
> **全局契约：** 颜色/材质/动效总则仍以仓库根目录 **`UI-SPEC.md`**、**`DESIGN.md`**、**`11-MATERIAL-MOTION-SPEC.md`** 为准；本文件只锁 **Phase 13 增量与验收口径**，不重复 Tier-1 全文。

---

## Design System（本阶段）

| Property | Value |
|----------|-------|
| 平台 | React Native · Expo |
| 设计令牌 | `src/theme/palette.ts`（`AppPalette`）、`src/theme/layout.ts`（`radii`、`shadows`） |
| 组件原语 | `GroupedInset`、`ListRow`、`SegmentedTwo`、`Fab`、`IOSChromeGlassBackground` 等 `src/components/ios/*` |
| 主题 API | `useAppTheme().colors` + `useMemo` 样式工厂 |
| Icon | `@expo/vector-icons`（与现工程一致） |
| 字体 | 系统字体；类型刻度见 **`src/theme/typography.ts`**（`iosType`） |

**禁止：** 业务屏长期硬编码 hex 作为唯一强调色（预算超支等须 `colors.expense` 或 palette 扩展项）；Modal scrim 须 `colors.modalScrim`（见根 `UI-SPEC` Tier-2 行）。

---

## Spacing Scale（Phase 13 适用区）

与根合同 **列表水平 inset 16** 一致；本阶段声明值均为 **4 的倍数**（`StyleSheet.hairlineWidth` 仅用于分隔线，不作为布局网格成员）。

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4 | chip 内间隙、密铺 |
| sm | 8 | 顶栏/分段条内边距、行距 |
| md | 16 | 默认水平边距、`GroupedInset` 外 margin、卡内主 padding |
| lg | 24 | Modal 外围 padding |
| xl | 32 | 大垂直留白（空态） |

**Exceptions：** 无额外非 4 倍数布局间距；周/月/年 **chip 行** 可与 `11-MATERIAL-MOTION-SPEC` Tier-2 微调但须记录于 `13-VERIFICATION.md`。

---

## Typography（本阶段 ≤4 档字号 · ≤2 种字重）

与 `iosType` 对齐，执行时 **fontSize** 仅使用下列四档；**字重全局仅允许 `400` 与 `600` 两档**（禁止再引入 `700`，以免超过 checker 上限）。

| Role | Size (px) | Weight | Line height (px) | 备注 |
|------|-----------|--------|------------------|------|
| Caption | **13** | 400 | **18** | 副标题、周期说明；与 `iosType.footnote` 字号一致 |
| Body | **17** | 400 | **24** | 列表主行、表单；金额强调 **17 / 600** 仍属本档 |
| Title / section | **20** | 600 | **24** | 屏标题；与 `iosType.largeTitle` 一致 |
| Display / KPI | **30** | 600 | **36** | 图表屏「本期支出」主数 |

工程实现若未单列 `lineHeight`，须与上表或 `src/theme/typography.ts` 后续扩展对齐，避免执行期随意插值。

---

## Color（LG-02 · 防止滥用）

**父级：** 根 `UI-SPEC` Light/Dark token 表。本阶段 **Accent（systemBlue 取向）** 仅用于：

- Tab 与导航强调、**主按钮填充**（`tabbarTint` / `accent`）
- **周期 chip / 分段** 选态描边与选态浅底（`accent`、`accentSelection`）
- **图表柱**「有数据」状态（`accent`）

**语义红 `expense`：** 仅用于 **支出强调、预算超支进度与警示文案**；禁止另起裸 `#dc3545` 类长期色。

**60 / 30 / 10（取向）：** 屏背景 `canvas` + 分组面 `surface` 占主导；`main` 仅用于与 Tier-1 一致的 **栈顶 Chrome**（副路径可采用 **canvas + hairline 顶栏** 分层，见 `13-CONTEXT` D13-02）；强调色 **≤10%** 可视面积。

**Destructive：** `Alert` destructive、删除确认；列表长按删除走系统 `Alert`，不另造高饱和 destructive 按钮色 unless HIG 取向一致。

---

## Visual hierarchy（四屏焦点）

| 屏 | 第一视觉锚点 | 次级 |
|----|----------------|------|
| Chart | 本期支出 KPI（Display） | 趋势柱区 → 分类构成列表 |
| Budget | 进度条（有预算时） | 已用/预算数值；空态为说明 + **设置预算** |
| Asset | 分组列表首行或空态说明 | **+ 添加账户** |
| Mine | 分组卡片首段（关于/数据） | 折叠副文案 |

**Icon-only：** 本四屏无新增纯图标主 CTA；若后续增加须带 `accessibilityLabel`（结转 A11Y-01）。

---

## Copywriting Contract（中文 · 具体动词）

| Element | Copy |
|---------|------|
| 预算 · 主 CTA（空态） | **设置预算** |
| 预算 · 次按钮 | **修改预算** |
| 预算 · 模态主按钮 | **保存预算** |
| 预算 · 模态取消 | **取消**（系统表单惯例；.dismiss 无二次确认） |
| 预算 · 超支提示 | **已超出预算** |
| 资产 · 空态主 CTA | **添加账户** |
| 资产 · 列表底部 | **+ 添加账户** |
| 资产 · 模态标题（新建） | **添加账户** |
| 资产 · 模态标题（编辑） | **编辑账户** |
| 资产 · 模态主按钮 | **保存账户** |
| 资产 · 删除确认标题 | **删除账户** |
| 资产 · 删除确认 destructive | **删除**（`Alert` 沿用 iOS 规范单字 destructive；非泛化表单 CTA） |
| Chart · 空数据（趋势） | **该时间段暂无支出记录** |
| Chart · 空数据（分类） | **本区间暂无支出**；次行 **切换周/月/年或选择其他周期试试** |
| Mine · 关于折叠提示 | **点按展开** |
| Mine · 数据折叠提示 | **点按了解本机存储** |

**Error：** 表单校验失败时须 **问题 + 下一步**（例：名称为空 → 保持焦点并提示「请填写名称」）；不单独使用「出错了」。

---

## Tier-2 组件与材质（与 13-CONTEXT 对齐）

- **分组容器：** KPI、趋势卡、分类列表、预算/资产主卡片使用 **`GroupedInset`**（或等效 `shadows.grouped` 单层，禁止重复堆叠 `shadows.card` 破坏层次）。
- **周/月/年条：** `tertiaryFill` + hairline 边框取向；选态 `accentSelection`；禁止「厚灰块」主导。
- **周期 chip：** 默认 `surface` + `divider` hairline；选态 `accent` 边框 + `accentSelection` 底；**不**默认叠 `shadows.card`。
- **Modal：** backdrop = **`modalScrim`**；卡片 `radii.sheet` + `shadows.grouped`；与记一笔 Sheet 行为一致。
- **动效：** 本 Phase **新增/重写** 的过渡优先 **Reanimated**；遗留 `Animated` 须在 `13-VERIFICATION` 或根 **Accepted deviation** 可检索说明（D13-04）。

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn / 第三方 UI 注册表 | *无* | **N/A** — 本仓库为 RN，不适用 |
| `src/components/ios` | 自有原语 | 代码评审对照 Tier-1；无第三方 registry |

---

## Checker Sign-Off（gsd-ui-checker · 2026-04-23）

- [x] Dimension 1 Copywriting: PASS（含 destructive **删除** 的 iOS 惯例说明）
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS（字重 400/600；行高见上表）
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-04-23 — **APPROVED**（无 BLOCK；非阻断建议已吸收：行高数值、destructive 说明）

---

## UI-SPEC COMPLETE

本契约可供 `/gsd-plan-phase 13` 修订执行任务引用；与实现不一致处写入 **`13-VERIFICATION.md` Accepted deviation**。
