# Requirements: SwiftCostRN

**Defined:** 2026-04-21  
**Core Value:** 离线「记一笔 → 明细/日历/图表即时一致」闭环稳定可靠

## v1 Requirements

### 数据与持久化 (DATA)

- [x] **DATA-01**: 应用使用 SQLite（`main.db` / `bill_list`）持久化账单，字段语义与参考 Swift 模型一致
- [ ] **DATA-02**: 用户记账后杀进程再启动，明细与图表数据不丢失（文档与步骤已交付；**设备上杀进程冒烟待执行并记录**）
- [x] **DATA-03**: 支持按日/按月/按时间区间查询账单（与仓库内 `billRepo` 能力一致）

### 核心功能 (FEAT)

- [x] **FEAT-01**: 用户可在明细首页切换月份并查看该月总收入与总支出
- [x] **FEAT-02**: 用户可打开「记一笔」，选择支出或收入、类别，输入金额并保存
- [x] **FEAT-03**: 用户可编辑已有账单并保存，列表与详情展示一致更新
- [x] **FEAT-04**: 用户可删除账单并在列表中消失
- [x] **FEAT-05**: 用户可从明细进入日历，按日查看记录并从日历发起记账

### 图表 (CHART)

- [ ] **CHART-01**: 图表 Tab 提供周/月/年维度切换，并仅对**支出**做聚合展示
- [ ] **CHART-02**: 用户可看到所选区间内分类支出占比或排序列表（与当前 `ChartScreen` 行为一致）

### 工程质量 (QA)

- [ ] **QA-01**: `npm run typecheck` 无错误
- [ ] **QA-02**: `npm run lint` 无错误（含禁止 `any`）
- [ ] **QA-03**: 关键路径有人工 UAT 记录（记一笔、编辑、删、日历、图表）

## v2 Requirements

### 同步与账户 (SYNC)

- **SYNC-01**: 可选云备份 / 多设备同步  
- **SYNC-02**: 导入导出 CSV 或与其他记账格式互操作  

### 体验增强 (UX)

- **UX-01**: 更贴近原版的自定义图标/主题包  
- **UX-02**: 桌面 Web 或 Tablet 布局优化  

## Out of Scope

| Feature | Reason |
|---------|--------|
| 服务端账号体系 | v1 离线优先 |
| 像素级还原全部 Asset Catalog | 已用矢量映射替代 |
| 内购 / 广告 | 非当前产品目标 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DATA-01 | Phase 1 | Complete |
| DATA-02 | Phase 1 | Partial — 待设备冒烟 |
| DATA-03 | Phase 1 | Complete |
| FEAT-01 | Phase 2 | Complete |
| FEAT-02 | Phase 2 | Complete |
| FEAT-03 | Phase 2 | Complete |
| FEAT-04 | Phase 2 | Complete |
| FEAT-05 | Phase 2 | Complete |
| CHART-01 | Phase 3 | Pending |
| CHART-02 | Phase 3 | Pending |
| QA-01 | Phase 4 | Pending |
| QA-02 | Phase 4 | Pending |
| QA-03 | Phase 4 | Pending |

**Coverage:**

- v1 requirements: 12 total  
- Mapped to phases: 12  
- Unmapped: 0 ✓  

---
*Requirements defined: 2026-04-21*  
*Last updated: 2026-04-21 after roadmap creation*
