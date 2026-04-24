# Phase 20 Verification — UI Polish

**Date:** 2026-04-24
**Scope:** 用户 6 条真机反馈精修
**Result:** **PASS**

## 逐条验收

### 1. Header 按钮按压连带感彻底消除
- [x] `HeaderIconButton` 外层 `View` 固定 `headerFabSize × headerFabSize`，永不变形
- [x] 内层 `SpringPressable` scale 收敛到 0.97（相邻按钮无视觉溢出）
- [x] 按压动画只在 outer wrapper 内部 transform，**100% 不影响** sibling layout

### 2. 弹出窗口毛玻璃 + VibrantText
- [x] HomeScreen / BillQueryScreen / CreateBillScreen 三屏 date picker 容器全部换成 `GlassEffectContainer` `intensity=70`
- [x] 「完成」按钮用 `VibrantText`（色 `colors.accent` + iOS textShadow 兜底）
- [x] Overlay scrim 用 `colors.modalScrim`（v1.2 语义色替代硬编码）
- [x] 卡片圆角 20pt（对齐 iOS 26 Sheet 规范 v1.2 §10.1）

### 3. Date picker inline 模式（所有屏统一）
- [x] `display="spinner"` → `display="inline"`（iOS 14+ 日历网格外观）
- [x] `accentColor={colors.accent}` 同步品牌色
- [x] `themeVariant` 动态跟随深浅模式

### 4. SegmentedTwo Spring Thumb + 立体
- [x] 新增 `Animated.View thumb` 层，absolute 定位
- [x] `SPRING.THUMB` 驱动切换滑动（非瞬切）
- [x] thumb 有立体阴影（`shadowOpacity: 0.12, offset: {0,2}, radius: 4`）
- [x] 顶部高光 `rgba(255,255,255,0.6)` hairline border
- [x] `haptic.select` 切换触发
- [x] Reduce Motion 降级为 timing

### 5. Chart 柱图 + 进度条立体玻璃感
- [x] 柱体外层加 shadow（`shadowColor: colors.expense, opacity: 0.28`），营造"发光"感
- [x] 柱内用 `LinearGradient` 从 `colors.expense` → `rgba(255,59,48,0.55)`（上深下浅 3D）
- [x] 顶部 hairline 高光白 0.55 opacity
- [x] 分类占比进度条同样渐变 + 高光处理

### 6. BillQuery range date picker 统一 inline
- [x] 同任务 3（共用同一 picker overlay 组件抽象未做，但三屏分别一次性升级）

## 推迟到后续相位

| 项 | 理由 | 相位 |
|---|------|------|
| **陀螺仪高光** (`useGyroHighlight` + `expo-sensors`) | 需新依赖 + 真机电量评估，v1.2 §3.7 P2 | Phase 21 |
| **3D 视角柱图**（Skia shader） | v1.2 §3.6 Tier 3 探索项，工程成本高 | Phase 22+ |
| **GlassShimmer 应用到 FAB / CTA 按压** | 组件已建但未集成 | Phase 21 |
| **useMaterialize 应用到 Modal 进出场** | 当前 Modal 仍用 `animationType` | Phase 21 |

## verify

```
tsc --noEmit                          ✓ 0
eslint . --max-warnings 0             ✓ 0
vitest 4 files / 17 tests passed      ✓
```

## 改动文件统计

| 文件 | 改动 |
|------|------|
| `src/components/ios/HeaderIconButton.tsx` | 重写 — fixed outer + scale 0.97 |
| `src/components/ios/SegmentedTwo.tsx` | 重写 — Spring Thumb + 立体 |
| `src/components/ios/GlassEffectContainer.tsx` | style prop 类型 `StyleProp<ViewStyle>` |
| `src/components/ios/GlassEffectUnion.tsx` | 同上 |
| `src/screens/HomeScreen.tsx` | picker 玻璃化 + inline + VibrantText |
| `src/screens/BillQueryScreen.tsx` | 同上 |
| `src/screens/CreateBillScreen.tsx` | 同上 |
| `src/screens/ChartScreen.tsx` | 柱图立体渐变 + 进度条渐变 |

---

*Phase: 20-ui-polish*
*Verified: 2026-04-24*
