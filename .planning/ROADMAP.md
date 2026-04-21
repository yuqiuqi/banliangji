# Roadmap: SwiftCostRN

## Overview

在已实现的 Expo + TS + SQLite 基线上，按「数据可信 → 功能验收 → 图表一致 → 质量门禁」顺序收敛到可发布的 **v1.0**；随后以 **milestone v2.0** 融合 [SharkBookProject](https://github.com/MichaelFeng823/SharkBookProject) 所代表的 **预算、资产、图表精美度与全局 UI**（不引入 Qt）。优先保证离线闭环与类型/静态检查。

## Phases

- [x] **Phase 1: 数据层与基线验证** — SQLite 契约、回归检查、关键路径文档化   (completed 2026-04-21)
- [x] **Phase 2: 核心用户流程 UAT** — 明细/记一笔/详情/编辑/删除/日历走查与缺陷修复   (completed 2026-04-21)
- [x] **Phase 3: 图表与分析一致性** — 周/月/年支出聚合与分类展示对齐产品预期   (completed 2026-04-21)
- [ ] **Phase 4: 质量门禁与发布准备** — typecheck/lint/手工 UAT 清单与版本说明  
- [ ] **Phase 5: 预算与资产管家 MVP（v2）** — REF-01 / REF-02；SQLite 扩展与 Tab/导航  
- [ ] **Phase 6: 全局 UI 与动效精研（v2）** — REF-04；Clay+ 层级、转场与关键屏改版  
- [x] **Phase 7: 图表 Shark 级表现层（v2）** — REF-03；依赖 Phase 3 数据正确   (completed 2026-04-21)

## Phase Details

### Phase 1: 数据层与基线验证

**Goal**: 确认持久化层与参考模型一致，并建立可重复的本地验证步骤。  
**Depends on**: Nothing (first phase)  
**Requirements**: DATA-01, DATA-02, DATA-03  
**UI hint**: no  
**Success Criteria** (what must be TRUE):

1. `bill_list`  schema 与 `PROJECT.md` / `billRepo` 描述一致，无静默迁移需求或已记录迁移策略  
2. 文档中写清数据库文件位置与备份提示（用户可理解「数据在本机」）  
3. 在干净安装与已有数据两种情况下，抽样 CRUD 后查询结果正确  

**Plans**: 2 plans  

Plans:

- [x] 01-01: 对照 Swift `THomeBillModel` 与 RN `billRepo` 做一次字段与查询语义审查  
- [x] 01-02: 补充或更新面向开发者的数据层说明（可放在 `PROJECT.md` Context 或短 README 节）  

### Phase 2: 核心用户流程 UAT

**Goal**: 主路径无阻塞缺陷，交互与参考 App 在流程上等价。  
**Depends on**: Phase 1  
**Requirements**: FEAT-01, FEAT-02, FEAT-03, FEAT-04, FEAT-05  
**UI hint**: yes  
**Success Criteria** (what must be TRUE):

1. 新用户可在 3 分钟内完成「记一笔 → 明细看到 → 日历看到 → 详情编辑/删除」全流程  
2. 月份切换、模态记账、日期选择无崩溃；边界金额（小数、删除键）可预期  
3. 记录的问题单有对应修复或明确defer 到 v2  

**Plans**: 3 plans  

Plans:

- [x] 02-01: 明细 / 记一笔 / 详情 / 日历走查与问题列表  
- [x] 02-02: 修复 P0/P1 交互与导航问题  
- [x] 02-03: 复测并通过简要 UAT 记录  

### Phase 3: 图表与分析一致性

**Goal**: 图表 Tab 在周/月/年切换下，支出汇总与分类列表可信、可解释。  
**Depends on**: Phase 2  
**Requirements**: CHART-01, CHART-02  
**UI hint**: yes  
**Success Criteria** (what must be TRUE):

1. 与同一数据集对比，图表区间筛选与「仅支出」规则自洽  
2. 无数据与有数据区间均有合理空态/非空展示  
3. 与产品说明（`PROJECT.md`）无未解决冲突  

**Plans**: 2 plans  

Plans:

- [x] 03-01: 图表聚合逻辑与边界日期单测或固定样例校验  
- [x] 03-02: UI 微调（标签、空态、可读性）  

### Phase 4: 质量门禁与发布准备

**Goal**: typecheck/lint/UAT 全部满足，具备对外说明的版本与变更摘要。  
**Depends on**: Phase 3  
**Requirements**: QA-01, QA-02, QA-03  
**UI hint**: no  
**Success Criteria** (what must be TRUE):

1. CI 或本地脚本可一键运行 `typecheck` + `lint` 且失败即阻断合并  
2. `QA-03` 手工清单有日期与执行人/摘要  
3. `package.json` / `app.json` 版本与对外 Release Note 一致（若发布）  

**Plans**: 2 plans  

Plans:

- [ ] 04-01: 脚本与文档：质量门禁、运行方式  
- [ ] 04-02: 发布检查清单（Expo EAS 或侧载所需项勾选）  

### Phase 5: 预算与资产管家 MVP（v2）

**Goal**: 对标 SharkBook 的「预算」「资产管家」子模块，提供 **MVP 可验收** 的离线能力。  
**Depends on**: Phase 2  
**Requirements**: REF-01, REF-02  
**UI hint**: yes  
**Success Criteria** (what must be TRUE):

1. 用户可创建/编辑**至少一种**预算周期（建议：按月）并看到**进度**  
2. 用户可维护**至少一个**资产账户并看到**余额或快照**  
3. 与现有 `bill_list` **不破坏**兼容；迁移策略写在 `PROJECT.md` 或 ADR 短节  

**Plans**: 2 plans（占位 — 由 `/gsd-plan-phase 5` 生成）  

Plans:

- [ ] 05-01: 数据模型与持久化（预算/资产表或安全扩展）  
- [ ] 05-02: 预算页 + 资产页 + Tab 导航接入  

### Phase 6: 全局 UI 与动效精研（v2）

**Goal**: 在 Clay 基线上达到 SharkBook README 所展示方向的 **精美度**（层级、微交互、信息密度）。  
**Depends on**: Phase 5  
**Requirements**: REF-04  
**UI hint**: yes  
**Success Criteria** (what must be TRUE):

1. 关键屏（明细、记一笔、预算、资产、图表壳）有统一的 **UI-SPEC 增量** 与实现对照清单  
2. 按压/列表/卡片层次有可感知的 **动效或过渡**（不要求 1:1 抄 Qt）  
3. `npm run typecheck` / `lint` 仍通过  

**Plans**: 2 plans（占位）  

Plans:

- [ ] 06-01: UI-SPEC v2 + Design token 扩展（radii/shadow/motion）  
- [ ] 06-02: 逐屏改版与回归 UAT  

### Phase 7: 图表 Shark 级表现层（v2）

**Goal**: 在 Phase 3 **图表数据逻辑**验收通过后，对标 SharkBook **图表界面** 的表现层。  
**Depends on**: Phase 3, Phase 6  
**Requirements**: REF-03, CHART-01, CHART-02  
**UI hint**: yes  
**Success Criteria** (what must be TRUE):

1. 与 Phase 3 同一数据集下图表 **数字一致**  
2. 空态/有数据/切换周月年 的 **布局与动效** 达到产品认可的「Shark 向」标准（以 `UI-SPEC` 为准）  
3. 无未关闭的 P0 图表展示缺陷  

**Plans**: 2 plans（占位）  

Plans:

- [ ] 07-01: 图表组件结构与主题绑定  
- [ ] 07-02: 动效、图例、空态与高对比可读性  

## Progress

**Execution Order（建议）:** 1 → 2 → **3 → 4**（v1 收口）→ **5 → 6 → 7**（v2）  

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. 数据层与基线验证 | 2/2 | Complete    | 2026-04-21 |
| 2. 核心用户流程 UAT | 3/3 | Complete    | 2026-04-21 |
| 3. 图表与分析一致性 | 2/2 | Complete    | 2026-04-21 |
| 4. 质量门禁与发布准备 | 0/2 | Not started | - |
| 5. 预算与资产 MVP（v2） | 0/2 | Not started | - |
| 6. 全局 UI 精研（v2） | 0/2 | Not started | - |
| 7. 图表表现层（v2） | 0/2 | Not started | - |
