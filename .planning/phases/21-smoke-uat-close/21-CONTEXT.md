# Phase 21: 验证闭合（smoke-uat-close）- Context

**Gathered:** 2026-04-24  
**Status:** Ready for planning  
**Mode:** `[auto]` 无交互收口 — 采用推荐默认项，便于维护者在真机/Simulator 上执行。

<domain>
## Phase Boundary

本阶段 **不交付新功能**，仅通过 **设备手测 + 规划文档更新** 闭合 v3.1 之 **UAT-01～UAT-04**：杀进程冷启动冒烟（DATA-02）、系统深色（THEME-01）、降低透明度（A11Y-01）、Tier-1 材质/动效 spot-check（LG-01）。  
若在冒烟中出现 **FAIL**，允许在本相内做 **最小代码/数据修复** 并重跑冒烟；超出最小修复的缺陷应记入 `Deferred` 并另开相位或 backlog。

</domain>

<decisions>
## Implementation Decisions

### DATA-02（UAT-01）证据与流程
- **D-01:** 以 `.planning/phases/10-persist-uat/DATA-02-SMOKE.md` 为 **唯一规范**；`Result:` 仅允许 **`PASS` / `FAIL` / `BLOCKED`**（与文件现状一致）。
- **D-02:** 「杀进程」**必须**符合文内 **Kill protocol**（App Switcher 上划或系统等效强制停止）；停止 Metro **不算**。
- **D-03:** 执行后在 **Environment** 表补全：**Date、Git（HEAD 短 SHA）、设备或 Simulator 标识、OS 版本**；可选 SQLite 取证段按文件说明填写或标 `Skipped`。
- **D-04:** 若维护者需新一次干净跑，可将 **Test data 识别串** 更新为 `DATA02-YYYYMMDD` 新串，并在 Steps 中同步替换；旧串可保留一行说明「历史跑次」。
- **D-05:** `FAIL` 时 **Investigation notes** 必填结论；`BLOCKED` 须写明阻塞（无设备、无签名账号等）及 **下一步取证计划** 第 4 条责任人/日期栏。

### THEME-01 / A11Y-01 / LG-01（UAT-02～04）清单与签字
- **D-06:** 权威手测清单为 `.planning/phases/11-chrome-depth/11-VERIFICATION.md`（同一文件勾选 **THEME / A11Y / LG** 与 **Sign-off**）。
- **D-07:** **Done 定义**：`11-VERIFICATION.md` 中相关 `[ ]` 全部勾选 **或** 在 **Accepted deviations** 表登记例外（含原因与 UI-SPEC/DESIGN 指针）；**Sign-off** 区填写 **执行人 + 日期**。
- **D-08:** 执行平台以 **iOS（Simulator 或真机）为主**；Android 本相 **不强制**，若仅测 iOS 须在 Accepted deviations 或本 CONTEXT 的 `deferred` 中注明「Android 未测」以免与全平台承诺混淆。
- **D-09:** Phase 11 文档顶部 **门禁** `npm run verify` 日期栏：在 Phase 21 收尾时于本机跑一次 `npm run verify` 并填日期（与 `21-VERIFICATION` 可互链）。

### 与 Phase 22 的边界
- **D-10:** **GLASS-01 / GLASS-02**（Modal 材质化、Shimmer/FAB）**不在 Phase 21 实现**，归入 Phase 22；本相仅更新验证类 Markdown 与（如有）冒烟缺陷的最小修复。

### Claude's Discretion
- 规划阶段可将「手测」拆成可勾选子任务（环境准备 / 单条用例 / 文档回填）；具体由 planner 按仓库习惯写 PLAN。
- 若 `11-VERIFICATION` 勾选与 `REQUIREMENTS.md` 措辞需轻微对齐，以 **不扩大 REQ 范围** 为原则做文案同步。

</decisions>

<canonical_refs>
## Canonical References

**下游在规划/执行前必须阅读：**

### 冒烟与持久化
- `.planning/phases/10-persist-uat/DATA-02-SMOKE.md` — Kill protocol、步骤、Result 规则、Investigation notes
- `.planning/PROJECT.md` — 「数据驻留、备份与手工冒烟」与 Core Value

### 深色 / 无障碍 / Tier-1 材质
- `.planning/phases/11-chrome-depth/11-VERIFICATION.md` — THEME-01、A11Y-01、LG-01 勾选与 Sign-off
- `.planning/IOS26-DESIGN-GUIDE.md` — Liquid Glass / Reduce Motion / 对比度取向（解释 LG-01 预期时引用章节，按需）

### 里程碑与追溯
- `.planning/REQUIREMENTS.md` — v3.1 **UAT-01～04** 条目与 Traceability 表
- `.planning/ROADMAP.md` — Phase 21 成功标准

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- 记账主路径：`HomeScreen`、`CreateBillScreen`、`src/db/billRepo.ts`（`main.db` / `bill_list`）；冒烟仅验证持久化与 UI 可读性，一般不改 schema。
- 主题：`src/theme/ThemeContext.tsx`、`AppPalette` — THEME-01 验证深浅色 token 是否可读。

### Established Patterns
- 验证产物以 **Markdown 勾选 + Sign-off** 为主，与 Phase 10/11 一致。
- `npm run verify` 不覆盖杀进程路径（DATA-02 文档已说明）。

### Integration Points
- 手测通过后：更新 `REQUIREMENTS.md` Traceability 表中 Phase 21 对应行状态为 **Done**（或 **Blocked** + 指针到本相 `21-VERIFICATION.md`）。

</code_context>

<specifics>
## Specific Ideas

- 无额外产品愿景输入；范围以 v3.1 `REQUIREMENTS.md` 与 ROADMAP Phase 21 为准。

</specifics>

<deferred>
## Deferred Ideas

- **Android 全量手测** — 若仅完成 iOS，写入 `11-VERIFICATION` Accepted deviations 或 Phase 22+ / backlog。
- **999.x backlog（补 SUMMARY）** — 不属于 Phase 21；仍见 `ROADMAP.md` Backlog。

</deferred>

---

*Phase: 21-smoke-uat-close*  
*Context gathered: 2026-04-24 — `/gsd-discuss-phase 21`（auto-equivalent）*
