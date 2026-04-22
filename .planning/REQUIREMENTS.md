# Requirements: SwiftCostRN

**Milestone:** v2.3 — 质量验证与系统外观  
**Defined:** 2026-04-22  
**Core Value:** 离线「记一笔 → 明细/日历/图表即时一致」闭环稳定可靠；在 iOS 26 Chrome 基线上补齐**可验证的持久化与验收**，并覆盖**深色与系统辅助设置**下的可读性。

## v2.3 Requirements（本里程碑）

### 数据与持久化 (DATA)

- [ ] **DATA-02**: 用户在真机或模拟器上完成「记一笔 → 杀进程 → 冷启动」后，该条账单仍在明细/图表中可查；**执行步骤与结果**写入 Phase 文档或 `STATE` 可引用处（关闭 v2.2 未勾选项）。

### 质量与验收 (QA)

- [x] **QA-04**: `.planning/phases/08-*` / `09-*` 下 **UAT** 表中仍为 `pending` 的项，已逐项 **pass / skip（注明理由）/ 与 `09-VERIFICATION` 结论一致**；不存在与验证文档矛盾的「未处理 pending」。

### 系统外观与无障碍 (SYS)

- [ ] **THEME-01**: 在**系统深色外观**（或应用内若已有外观开关）下，关键屏（Tab、明细、记一笔、账单流、设置）使用语义色与对比度可接受，无大面积不可读文字或控件；与 `UI-SPEC.md` / `DESIGN.md` 的 dark 取向一致或可引用 Accepted deviation。
- [ ] **A11Y-01**: 当系统开启**降低透明度**（及同类辅助设置，以 iOS 设置为准）时，依赖 `BlurView`/毛玻璃的区域具备**可辨识的不透明或降级样式**（非空白、非不可点击），主路径仍可完成记一笔与查看明细。

### Liquid Glass 纵深与动效 (LG)

- [ ] **LG-01**: **动效、透明度层次与立体感** 在工程上向 **iOS 26 Liquid Glass** 对齐：遵循 `.planning/phases/11-chrome-depth/11-MATERIAL-MOTION-SPEC.md` 的 **材质分层（blur + tint + 边缘高光 + 随尺度调整的阴影）** 与 **动效分层（Reanimated spring、按压抬升、避免主导线性过渡）**；对 Tab 栏、主列表顶栏、记一笔 Dock/Sheet 等 **Tier-1** 表面验收；无法复刻处须 **Accepted deviation** 并指向官方原则（如 Lensing）与 RN 限制说明。

## Future（本里程碑不做）

- **SYNC-***：云同步、多设备（见 `PROJECT.md` Out of Scope）。
- **像素级** Figma / 第三方 App 逐帧对照（除非作为 THEME/A11Y 的 Accepted deviation 备注）。

## Out of Scope

| Feature | Reason |
|---------|--------|
| 新业务能力（新报表类型、社交、账户体系） | v2.3 为质量与系统外观补全 |
| 替换 SQLite 或改动 `bill_list` 语义 | 仅验证与表现层；schema 变更另开里程碑 |

## Traceability

| Requirement | Phase | Status |
|---------------|-------|--------|
| DATA-02 | Phase 10 | Blocked（见 `DATA-02-SMOKE.md`，待设备补跑） |
| QA-04 | Phase 10 | Done |
| THEME-01 | Phase 11 | Pending |
| A11Y-01 | Phase 11 | Pending |
| LG-01 | Phase 11 | Pending |
