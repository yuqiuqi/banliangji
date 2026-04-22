# Phase 9 — 验收清单（骨架）

**状态:** 待 Phase 9 执行过程中逐项勾选  
**规格来源:** `09-BREAKTHROUGH-SPEC.md` §3 全屏幕矩阵

执行时每一项补充：**Pass** / **Accepted deviation**（理由 + 截图或 PR）/ **Blocked**。

| # | 屏 / 范围 | UI | UX | 证据（截图/节点） |
|---|-----------|----|----|-------------------|
| 1 | 明细 `HomeMain` | Pass | Pass | GroupedInset + iosType 区头 |
| 2 | 账单 `BillQuery` | Pass | Pass | SegmentedTwo + GroupedInset 列表 |
| 3 | 账单详情 `BillDetail` | Pass | Pass | GroupedInset；删除色 `colors.expense` |
| 4 | 记一笔 `CreateBill` | Pass | Pass | SegmentedTwo；完成按钮 systemBlue |
| 5 | 计算器 `BillCalculator` | Pass | Pass | `radii.chip` 键帽 |
| 6 | 日历 `Calendar` | 待设备 | 待设备 | 既有 iOS 26 色；未改结构 |
| 7 | 图表 `Chart` | Pass | Pass | 注释三档 chip；色已为 systemBlue |
| 8 | 预算 `Budget` | 待设备 | 待设备 | token 继承 theme |
| 9 | 资产 `Asset` | 待设备 | 待设备 | token 继承 theme |
| 10 | 我的 `Mine` | Pass | Pass | GroupedInset ×3；`iosType.largeTitle` |
| 11 | Tab 栏 + 全局导航壳 | Pass | Pass | BlurView Tab；栈顶阴影 |
| 12 | iPad 适配 | Partial | Partial | `maxWidth: 720` 居中 |
| 13 | 共享：`CategoryIcon`、空态、Alert | 待设备 | 待设备 | — |

**工程门禁:** `npm run verify` — 阶段完成时必须 **Pass**
