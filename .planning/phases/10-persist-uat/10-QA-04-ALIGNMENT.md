# QA-04 — UAT ↔ VERIFICATION 对齐映射（Phase 10）

**事实源：** `09-VERIFICATION.md` 为 Phase 9 屏幕矩阵事实源；`08-VERIFICATION.md` 为 Phase 8 范围事实源（与 `10-CONTEXT.md` D10-04 一致）。

## 映射表

| UAT 文件 | 用例（小标题） | 原状态 | VERIFICATION 锚点 | 决议 | 说明 |
|----------|----------------|--------|-------------------|------|------|
| `08-UAT.md` | §1 明细 → 账单 → 单日 → 详情 → 返回 | pending | `08-VERIFICATION.md` §Manual UAT 第 1 条；§Consistency matrix Home/BillQuery | **skip** | 与 Phase 8 文档一致：矩阵多项「待测」、Manual UAT 勾选仍待真机；消解 pending，不声称已设备通过。 |
| `08-UAT.md` | §2 记一笔 → 明细/账单可见 | pending | §Manual UAT 第 2 条；matrix BillQuery | **skip** | 同上。 |
| `08-UAT.md` | §3 我的 — 关于 / 数据与存储 | pending | §Manual UAT 第 3 条 | **skip** | 同上。 |
| `08-UAT.md` | §4（可选）同日数据一致 | pending | §Consistency matrix（Home section vs BillQuery 单日） | **skip** | 可选项；与矩阵「待测」一致，设备复测可改 pass。 |
| `09-UAT.md` | §1 明细 — 分组列表与顶栏 | pending | `09-VERIFICATION.md` 表 #1 `HomeMain` | **pass** | 矩阵 UI/UX **Pass**；UAT 与矩阵对齐。 |
| `09-UAT.md` | §2 账单 — 单日/区间分段与列表 | pending | 表 #2 `BillQuery` | **pass** | 同上。 |
| `09-UAT.md` | §3 账单详情 — 分组卡与删除字色 | pending | 表 #3 `BillDetail` | **pass** | 同上。 |
| `09-UAT.md` | §4 记一笔 — 分段与完成按钮 | pending | 表 #4 `CreateBill` | **pass** | 同上。 |
| `09-UAT.md` | §5 我的 — 三块分组卡片与大标题 | pending | 表 #10 `Mine` | **pass** | 同上。 |
| `09-UAT.md` | §6 Tab 栏 — iOS 雾化与分隔 | pending | 表 #11 Tab 栏 | **pass** | 同上。 |
| `09-UAT.md` | §7 宽屏 — 内容最大宽度居中 | pending | 表 #12 iPad 适配 **Partial** | **pass** | 与矩阵 **Partial** 一致（`maxWidth: 720`）；记为工程验收对齐，非像素级 Figma。 |
| `09-UAT.md` | §8 图表 — 周/月/年仍可用 | pending | 表 #7 `Chart` | **pass** | 矩阵 UI/UX **Pass**。 |

**行数：** 12（08: 4；09: 8）。

---

*Phase 10 执行于 2026-04-22；设备独占项以 `skip`+文档引用闭环 pending，不引入未解释 `pending`。*
