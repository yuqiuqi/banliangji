# Roadmap: SwiftCostRN

## Overview

在已实现的 Expo + TS + SQLite 基线上，按「数据可信 → 功能验收 → 图表一致 → 质量门禁」顺序收敛到可发布的 v1；优先保证离线闭环与类型/静态检查。

## Phases

- [ ] **Phase 1: 数据层与基线验证** — SQLite 契约、回归检查、关键路径文档化  
- [ ] **Phase 2: 核心用户流程 UAT** — 明细/记一笔/详情/编辑/删除/日历走查与缺陷修复  
- [ ] **Phase 3: 图表与分析一致性** — 周/月/年支出聚合与分类展示对齐产品预期  
- [ ] **Phase 4: 质量门禁与发布准备** — typecheck/lint/手工 UAT 清单与版本说明  

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

- [ ] 01-01: 对照 Swift `THomeBillModel` 与 RN `billRepo` 做一次字段与查询语义审查  
- [ ] 01-02: 补充或更新面向开发者的数据层说明（可放在 `PROJECT.md` Context 或短 README 节）  

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

- [ ] 02-01: 明细 / 记一笔 / 详情 / 日历走查与问题列表  
- [ ] 02-02: 修复 P0/P1 交互与导航问题  
- [ ] 02-03: 复测并通过简要 UAT 记录  

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

- [ ] 03-01: 图表聚合逻辑与边界日期单测或固定样例校验  
- [ ] 03-02: UI 微调（标签、空态、可读性）  

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

## Progress

**Execution Order:** 1 → 2 → 3 → 4  

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. 数据层与基线验证 | 0/2 | Not started | - |
| 2. 核心用户流程 UAT | 0/3 | Not started | - |
| 3. 图表与分析一致性 | 0/2 | Not started | - |
| 4. 质量门禁与发布准备 | 0/2 | Not started | - |
