# Research Summary — SharkBookProject → SwiftCostRN v2

**Source:** [SharkBookProject](https://github.com/MichaelFeng823/SharkBookProject)（Qt 5.14 / C++ / Android，README 与界面说明）  
**Date:** 2026-04-21  

## 可融合能力（产品/UX，非技术栈）

| 领域 | SharkBook 描述要点 | RN 融合方式 |
|------|-------------------|-------------|
| 记账主路径 | 记支出流程 GIF、分类/详情/编辑 | 增强现有 `CreateBill` / `BillDetail` 的信息密度与动效 |
| 明细与日期 | 按日期查账单 | 与现有日历/明细对齐；可加日聚合视图 |
| **预算** | 独立「预算」子模块 | 新增预算数据模型 + UI（月度/分类预算） |
| **资产管家** | 资产子页面 | 简单「账户/资产」余额与流水入口（SQLite 新表或扩展） |
| 图表 | 「高度还原原版」图表页 | 在 Phase 3 数据正确基础上做 **视觉与交互** 升级 |
| 登录/注册/切换用户 | README 大量演示 | **默认不纳入 v2 核心**（与离线单机 Core Value 冲突）；可作为后续「可选账号」 |
| 发现 / 通讯录 / 图片 API / 万年历 API | 演示向功能 | **默认 Out of Scope**；若要做，单独「插件里程碑」 |

## 技术约束

- **禁止** 引入 Qt / JNI 混合栈作为交付物；仅 **行为与 UI 契约** 参考。  
- 与 `PROJECT.md` **Core Value** 冲突的能力（强依赖云登录、纯在线 API）须单独 REQ + Out of Scope 说明。

## 下游消费

- `REQUIREMENTS.md` — `REF-*` 需求  
- `ROADMAP.md` — Phase 5–7  

## RESEARCH COMPLETE
