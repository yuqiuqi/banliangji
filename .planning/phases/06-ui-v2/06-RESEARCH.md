# Phase 6 — Technical Research（全局 UI / 动效）

**Phase:** 06 — 全局 UI 与动效精研（v2）  
**Question:** 在 **不引入 Reanimated** 的前提下，如何在 RN 0.81 + Expo 54 上统一按压反馈与轻层次？

---

## Findings

### 1. Press feedback（首选）

- **`Pressable`** 的 `style={({ pressed }) => [...]}` 是项目现状（如 `HomeScreen`）。  
- 与 `06-CONTEXT.md` **D-M01** 一致：用 `opacity`、`scale`（`transform`）、可选 `translateY`；避免 `LayoutAnimation` 除非列表重排确有需求。

### 2. Animated API

- React Native **`Animated.timing`** 可用于 **焦点过渡**（如分段选中指示条）；成本高于纯 Pressable，按需用于 **单屏 1–2 处**，避免全局滥用。

### 3. 主题集中化

- 现有 `src/theme/layout.ts` 已有 `radii`、`shadows.card`、`hairlineBorder`。  
- **增量：** `radii.chip`、`shadows.raised`、以及 `pressedOpacity` / `pressScale` / `pressDurationMs`（见 `06-UI-SPEC.md`）。

### 4. Chart 壳层 vs 数据

- `ChartScreen` 改版须 **只读** `03-CONTEXT.md` / `chartAggregate.ts` 语义；任何周月年数据绑定 **不得** 改函数签名或区间定义。

### 5. TabBar 限制

- React Navigation bottom tabs 的 **原生 Tab 按下** 样式受限；可选：**自定义 tabBarButton** 包裹 `Pressable`，或接受 **激活色 + 图标** 为主要反馈，在 `06-02` 计划中写清采用方案。

---

## Risks

| Risk | Mitigation |
|------|------------|
| 过度动画导致卡顿 | 优先 opacity；scale 限制在 0.96–0.99 |
| 误改图表聚合 | `read_first` 强制含 `chartAggregate.ts`；任务 action 写明「不修改」 |
| 样式散落 | 所有按压常量从 theme 导入，禁止魔法数 |

---

## Validation Architecture

> Nyquist Dimension 8 — 本 phase 以 **自动化门禁 + 轻量手工走查** 为主。

| Dimension | 策略 |
|-----------|------|
| 回归 | 每 wave 结束运行 `npm run verify`（typecheck + lint + test） |
| 按压一致性 | 手工 UAT：每关键屏至少 1 条列表/按钮确认有 pressed 视觉变化 |
| 图表 | 对照 Phase 3：切换周月年 **数字不变**（抽样） |
| 安全 | 无新增网络/权限；本地 UI only |

**测试框架：** Vitest + 现有 `npm run test`；**快速命令：** `npm run verify`。

---

## RESEARCH COMPLETE

本研究支持：主题令牌扩展（06-01）与逐屏 Pressable/层次（06-02），并与 Phase 7 图表表现层解耦。
