# Requirements: 半两记

**Milestone:** **v3.0** — iOS 26 动效·交互·组件全面质感打磨（**Phase 14**）  
**Defined:** 2026-04-23  
**Core Value:** 离线「记一笔 → 明细/日历/图表即时一致」闭环稳定可靠；数据以 **本机存储** 为准。**v3.0 专注感知质量**：所有界面的 **弹簧动效、触觉反馈与交互手感** 须与 **Apple iOS 26 / Liquid Glass** 系统级取向一致。

---

## v3.0 Requirements（本里程碑 · 新增）

### 动效系统 (ANIM)

- [ ] **ANIM-01**: 新建 `src/theme/motion.ts`，集中声明 `SPRING.UI / THUMB / SHEET / GESTURE`、`REDUCE_SPRING`、`FADE_MS` 等全局常量；所有动效文件引用此模块，**禁止**各屏自行硬编码 `damping / stiffness`。
- [ ] **ANIM-02**: 分段控件（图表周/月/年、`SegmentedTwo`）选中状态改为 **Spring Thumb**：独立 `Animated.View` 指示器以 `withSpring(SPRING.THUMB)` 在选项间滑行；视觉：白块 + `shadows.keyCap`；快速连点时追随不重置。
- [ ] **ANIM-03**: `ChartScreen` 柱图切换周期/粒度时，各柱从 `height: 0` 以 `withSpring(SPRING.UI)` + `index × 30ms` stagger 弹起；整区改为 Reanimated `withTiming` fade 替代 `Animated.timing`；`chartFadeMs` 保留为 fallback 常量引用。
- [ ] **ANIM-04**: 账单列表（`HomeScreen`）、分类构成列表（`ChartScreen`）、资产列表（`AssetScreen`）数据从无到有时，每行以 Reanimated `FadeInDown.delay(i * 40).springify()` 入场；Reduce Motion 时直接显示（无 stagger）。
- [ ] **ANIM-05**: `BudgetScreen` / `AssetScreen` Modal 改为自定义 Spring 进出场：卡片 `translateY: 60 → 0` + `SPRING.SHEET`；Scrim `opacity: 0 → 1` 并行 `withTiming(250ms)`；关闭反向；保持 `colors.modalScrim`。
- [ ] **ANIM-06**: `BudgetScreen` / `AssetScreen` / `MineScreen` 副路径屏实现 Scroll Header Collapse：大标题高度 72 → 44pt 随 `scrollY` 弹性插值；顶栏底 hairline 与内容层 shadow 协同显隐；`ChartScreen` 不折叠（固定分段区）。

### 交互系统 (INT)

- [ ] **INT-01**: 新建 `src/components/SpringPressable.tsx`（`forwardRef` + **`PressableProps` 全量透传**），内用 Reanimated `withSpring(SPRING.UI)` 实现 `scale(0.97)` + `opacity(0.92)`；全站 **所有可点击行/卡片/按钮** 优先替换为 `SpringPressable`，替代零散 `pressedOpacity`；可选 `useSpringPress.ts` 仅作非 Pressable 容器内部复用（**14-REVIEWS** 主路径）。

### 触觉反馈 (HAP)

- [ ] **HAP-01**: 安装 `expo-haptics`，新建 `src/utils/haptics.ts` 封装 `haptic.select / success / error / light / medium`；全路径接入：
  - 分段/chip 切换 → `select`
  - 记一笔保存成功 → `success`
  - 删除账单/账户 Alert 确认 → `error`
  - Modal 开启 → `light`
  - 预算设置保存 → `success`
  - 滚动到列表边界（可选）→ `light`

### 无障碍适配 (MOT)

- [ ] **MOT-01**: 新建 `src/hooks/useReduceMotion.ts`，监听 `AccessibilityInfo.isReduceMotionEnabled`；所有动效组件接受降级参数：scale/平移 → 短 opacity fade；stagger 入场 → 同帧显示；spring → `REDUCE_SPRING`；haptics 保留。

---

## v2.4 Requirements（结转 · 仍有效直至勾选）

### Liquid Glass · Tier-2

- [x] **LG-02**: 副路径四屏 iOS 26 Chrome 全量对齐 — **Done**（`13-UAT` 6/6；`13-VERIFICATION` 全矩阵）；Chart 动效 deviation **P13-D13-04**

### 数据与持久化 (DATA)

- [ ] **DATA-02**: 杀进程冷启动冒烟 — 仍 **BLOCKED**；见 `.planning/phases/10-persist-uat/DATA-02-SMOKE.md`；目标 2026-05-01 设备补跑

### 系统外观与无障碍 (SYS)

- [ ] **THEME-01**: 系统深色外观下关键屏可读（Phase 11 `11-VERIFICATION` 手测仍待签字）
- [ ] **A11Y-01**: 降低透明度下主路径可用（同上）

### Liquid Glass 纵深与动效 (LG)

- [ ] **LG-01**: Tier-1 动效/材质 spot-check（Phase 11 手测仍待签字）

---

## Future（后续里程碑）

- **ANIM-07**：Tab 栏动态收缩（P2；需 RootNavigator 深度改造）
- **INT-02**：Swipe-to-delete 手势（P2；需 gesture-handler + Reanimated）
- **SYNC-\***：云同步、多设备（Out of Scope）

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| 像素级复刻 Apple 私有 GlassEffect / glassEffect() API | RN 不可用；以 Accepted deviation 文档化 |
| 新业务功能（新报表、社交等） | v3.0 为感知质量专项 |
| 服务端 / 网络能力 | 与 Core Value 冲突 |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| **ANIM-01** | Phase 14（v3.0） | Pending |
| **ANIM-02** | Phase 14（v3.0） | Pending |
| **ANIM-03** | Phase 14（v3.0） | Pending |
| **ANIM-04** | Phase 14（v3.0） | Pending |
| **ANIM-05** | Phase 14（v3.0） | Pending |
| **ANIM-06** | Phase 14（v3.0） | Pending |
| **INT-01**  | Phase 14（v3.0） | Pending |
| **HAP-01**  | Phase 14（v3.0） | Pending |
| **MOT-01**  | Phase 14（v3.0） | Pending |
| LG-02 | Phase 13（v2.4） | Done |
| DATA-02 | Phase 12 / v2.4 结转 | Blocked |
| QA-04 | Phase 10 | Done |
| THEME-01 | Phase 13 结转 | Pending（11-VERIFICATION 未签字） |
| A11Y-01 | Phase 13 结转 | Pending |
| LG-01 | Phase 13 结转 | Pending |
