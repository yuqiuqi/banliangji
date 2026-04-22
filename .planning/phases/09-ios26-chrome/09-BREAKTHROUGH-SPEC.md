# Phase 9 — iOS & iPadOS 26 全局 Chrome 突破性规格

**状态:** 规划输入（待 `/gsd-plan-phase 9` 细化为 PLAN.md / 分波执行）  
**设计参照:** Figma Community「iOS and iPadOS 26」类 UI Kit（例：`fileKey` `V64rXztAJGn34HIEJfINcS` 等）+ [Apple Design Resources](https://developer.apple.com/design/resources/)  
**工程事实:** React Native（Expo）；已实现主题初切（`colors.ts` / Tab `BlurView`）；**完整 1:1 需在 Cursor 中启用 Figma MCP**（`get_design_context` / `get_screenshot`）逐 frame 对齐。

---

## 1. 我们对「下一个突破」的共同定义

- **范围:** **每一个**已有业务屏 + **每一个**共享组件（导航壳、列表、表单、图表壳、计算器、空态）在 **UI（看得见的）** 与 **UX（怎么操作、反馈、层次）** 上统一收敛到 **iOS / iPadOS 26 设计语言**，而不是局部换色。
- **验收:** 存在 **全屏清单式** 的 `09-VERIFICATION.md`（或等价），每条对应 Figma 节点或 Apple HIG 条款；`npm run verify` 持续绿。
- **与 v2.1 关系:** v2.1（Phase 8）以 **Tesla** 为约束收口功能；**Phase 9 明确替代**主视觉与交互规范为 **iOS 26 Chrome**（`DESIGN.md` / `PROJECT.md` 需在阶段过渡时更新「单一视觉来源」引用）。

---

## 2. 设计语言要点（实现侧理解）

| 维度 | 要点 |
|------|------|
| **材质** | **Liquid Glass** 取向：顶栏、底栏、浮动按钮、底部 sheet 等使用 **模糊 + 半透明层级**（`expo-blur`），避免大块实色「贴图感」；与内容区对比度仍满足可读。 |
| **颜色** | **语义色**：`systemGroupedBackground`、`secondarySystemGroupedBackground`、`label`、`secondaryLabel`、`separator`、**systemBlue**（强调）、**systemGreen**（收入）、**systemRed**（支出强调）等；深浅色模式若本阶段只做 Light，须在规格中写明 **Dark 为 follow-up**。 |
| **形状** | 卡片 / 分组圆角、连续圆角（若 RN 侧用近似）、列表行分割线 **hairline**；避免与 HIG 冲突的过大阴影。 |
| **类型** | iOS 默认动态字体族（RN 默认 San Francisco on iOS）；标题 / 正文 / 脚注 **层级**与字重与稿或 HIG 对齐。 |
| **动效** | 按压 **opacity / scale** 轻微；模态 **自底向上**；导航 **系统向** 转场（在 React Navigation 能力内逼近）。 |
| **密度** | 触控目标 ≥ 44pt 等效；列表行高、分段控件高度与稿或 HIG 一致。 |

---

## 3. 全屏幕矩阵（UI + UX 必须逐项达标）

以下路径均指 **当前代码中的屏**（`src/screens/*.tsx`）；**UX** 列写行为与反馈期望。

| # | 路由 / 入口 | 屏 | UI（要统一的视觉） | UX（要统一的交互） |
|---|----------------|-----|---------------------|---------------------|
| 1 | `HomeTab` → `HomeMain` | **明细** | 分组灰底 + 白内容区；月汇总条为 **材质条或系统栏层次**；列表为 **inset/grouped 连续圆角** 或系统等价；section header 字色/字重；行分割线；支出/收入色语义 | 左右上角 **日历 / 查账 / 记一笔** 与系统 **toolbar** 行为一致；月份选择器 **iOS spinner + 完成** 范式；列表滚动与 Tab 栏 **安全区** 无遮挡 |
| 2 | `HomeStack` → `BillQuery` | **账单（查账）** | 单日/区间 **分段或稿定控件**；日期条与列表同一 Chrome；筛选状态可读 | 切换单日/区间 **不丢状态**；进详情返回 **层次正确**；空态 **系统向文案 + 插图密度** |
| 3 | `HomeStack` → `BillDetail` | **账单详情** | Hero 区与 **分组信息列表**（左标题右值）；底栏 **双操作** 与分隔线；删除 **destructive** 样式 | 编辑/删除 **预期反馈**；删除 **Alert** 系统范式；滚动内容不被底栏遮挡 |
| 4 | `HomeStack` modal → `CreateBill` | **记一笔** | **表单分组**、类别网格/列表 **cell** 化；主按钮 **填充蓝**；类型切换 **分段控件** | 保存/取消 **模态 dismiss**；校验反馈 **轻提示**；与计算器联动 **不打断** |
| 5 | `CreateBill` 内嵌 / 关联 | **计算器键盘区** | 键帽 **圆角、分隔、按压态** 贴近系统数字键盘气质 | 连续运算、删除、小数点 **符合用户肌肉记忆**；无障碍读法 |
| 6 | `HomeStack` modal → `Calendar` | **日历** | 月标题条 **toolbar**；网格 **选中/今日/有数据点**；侧列表 **分组列表** | 选日 **列表联动**；FAB **材质圆形** + 记一笔；与明细数据 **一致** |
| 7 | `ChartTab` | **图表** | 周/月/年 **分段**；卡片/图区 **留白与层级**；分类列表 **系统 cell**；进度/条形 **语义色** | 切换粒度 **动效可感知**；空态；与 Phase 3 **数据真理**不冲突 |
| 8 | `BudgetTab` | **预算** | 进度、卡片、提示 **统一分组与字体** | 超支/预警 **可辨识不吓人**（HIG 向） |
| 9 | `AssetTab` | **资产** | 账户列表 **分组**；数值层级 | 空态与首启 |
| 10 | `MineTab` | **我的** | **Inset grouped** 列表（设置 app 向）；关于/数据 **折叠或 push 二级** 由稿定；**chevron/disclosure** 视觉 | 展开/折叠或导航 **符合心理模型**；无云登录仍 **可信** |
| 11 | `RootNavigator` | **Tab 栏** | **Liquid Glass** 底栏；选中/未选中 **系统灰与蓝**；顶部分隔线 **ultra-thin** | 五 Tab **可发现**；按压反馈；与 Home Stack **header** 材质协调 |
| 12 | 全局 | **导航栈顶栏** | 标准高度、**背景材质或纯色**与稿一致；`headerShadowVisible` / 大标题（若采纳）**全栈统一** | **返回**、**模态关闭**、**深层链接**（若有）一致 |
| 13 | iPad（若单列） | **适配** | 可读最大宽度 **居中**；横屏边距；图表 **不拉伸失真** | 旋转与分屏 **不截断**；后续可升 **split**（本规格允许 Phase 内分两步：先单列居中，再分栏） |

**共享组件（必须纳入同一 Chrome，不单列屏但同等验收）:**  
`CategoryIcon`、`BillCalculator`、各屏 **空态**、**Alert** 文案样式、**DateTimePicker** 封装呈现。

---

## 4. 组件与 Token 策略（避免逐屏漂移）

1. **集中 token:** `src/theme/colors.ts`、`layout.ts` 扩展 **语义别名**（与 Apple 名称对齐），禁止屏内散落硬编码色（图表特殊透明色除外，须注释绑定 `accent`）。  
2. **布局原语（建议执行期创建）:** `IOSGroupedList`、`IOSToolbar`、`IOSSectionHeader`、`IOSPrimaryButton`、`IOSDestructiveButton`、`IOSGlassTabBar`（或等价命名）— **屏仅组合原语**。  
3. **模糊与性能:** Tab/顶栏 `BlurView` **强度**与 **降级策略**（低端 Android 可退纯色，须在 VERIFICATION 标注）。  

---

## 5. 设计交付与对照流程（Figma MCP 可用时）

1. 为每个 **§3 表格行** 绑定 **Figma `node-id`**（或整页 frame）。  
2. 执行前 **`get_metadata`** 大结构 → **`get_design_context`** 分块 → **`get_screenshot`** 存证。  
3. 实现后 **截图对比**（模拟器/真机）入 `09-VERIFICATION.md`。  
4. **偏差记录:** 若 RN 无法实现（如真·连续圆角），在规格 **Deviations** 表登记原因与替代方案。

---

## 6. 成功判据（供 ROADMAP / REQUIREMENTS 引用）

1. §3 中 **全部屏与全局行** 在 `09-VERIFICATION.md` 有 **Pass** 或已登记 **Accepted deviation**。  
2. **IOS26-*** 需求条（见 `REQUIREMENTS.md`）可追溯至 commit。  
3. `npm run verify` 全绿；**无**未解释的硬编码主色回退到 Tesla 绿。  
4. （可选加强）**VoiceOver** 抽样路径通过。

---

## 7. 依赖与风险

- **Depends on:** Phase 8 功能闭环；Figma MCP 与账号由开发者环境保证。  
- **风险:** Android 上 **模糊与字体** 与 iOS 不一致 → 规格允许 **平台微调**，但需文档化。  
- **Out of scope（本 Phase 默认不做）:** 云同步、账号体系、像素级复刻非社区稿的私有 Apple 资源。

---

*本文件为产品/设计/工程对齐用的突破性规格；执行拆波以 `09-*-PLAN.md` 为准。*
