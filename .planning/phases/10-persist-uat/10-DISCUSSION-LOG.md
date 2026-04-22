# Phase 10: 持久化与 UAT 闭环 — Discussion Log

> **Audit trail only.** 规划/执行以 `10-CONTEXT.md` 为准。

**Date:** 2026-04-22  
**Phase:** 10 — 持久化与 UAT 闭环  
**Mode:** `--auto --analyze`  
**Areas discussed:** DATA-02 证据与环境、QA-04 裁决与编辑位置、Android 范围

---

## DATA-02：证据形式与运行环境

**Trade-off analysis**

| Approach | Pros | Cons |
|----------|------|------|
| 仅文字步骤 | 快、无隐私顾虑 | 难审计、易争议 |
| 文字 + 环境标识 + 可选截图（推荐） | 可引用、可复测 | 需稍加整理 |
| 强制真机 | 最接近用户 | 成本高、模拟器仍具代表 |

**Recommended:** 文字 + 日期 + 环境标识 + 可选截图；iOS 真机或模拟器**二选一**即可完成；Android 本 Phase 非必达。

**User's choice:** [auto] 选用 **Recommended**  
**Notes:** `[auto] Selected: Recommended default`

---

## QA-04：UAT 与 VERIFICATION 不一致时以谁为准

**Trade-off analysis**

| Approach | Pros | Cons |
|----------|------|------|
| 以 UAT 表为准 | 保留人工手感 | 易与矩阵契约脱节 |
| 以 09-VERIFICATION 为准（推荐） | 与 Phase 9 合同一致 | 需回写 UAT 行 |
| 另起合并表 | 中立 | 维护成本高 |

**Recommended:** **09-VERIFICATION**（及 08 范围用 08-VERIFICATION）为项级依据；UAT 更新为 pass / skip+理由 / Accepted deviation。

**User's choice:** [auto] 选用 **Recommended**  
**Notes:** `[auto] Selected: Recommended default`

---

## 证据与修订文件落点

**Trade-off analysis**

| Approach | Pros | Cons |
|----------|------|------|
| 只改 08/09 | 少文件 | DATA-02 长文可能冲淡 UAT |
| 新建 `10-persist-uat/DATA-02-SMOKE.md` + 原处改 UAT（推荐） | 职责清晰 | 多一个文件 |

**Recommended:** 新建 **`DATA-02-SMOKE.md`**；UAT 仍在 **08-UAT / 09-UAT** 原路径修订。

**User's choice:** [auto] 选用 **Recommended**

---

## Android 是否纳入 DATA-02 必达

**Trade-off analysis**

| Approach | Pros | Cons |
|----------|------|------|
| 双端必测 | 覆盖最大 | 拉长 Phase 10 |
| iOS 必测、Android defer（推荐） | 符合当前 ROADMAP 表述与 Phase 9 iOS 主轴 | Android 债务后移 |

**User's choice:** [auto] 选用 **Recommended**

---

## Claude's Discretion

- 表格排版、冒烟测试数据选取（Planner/执行阶段）。

## Deferred Ideas

- Android 全量杀进程冒烟；深色/无障碍（Phase 11）。
