# Phase 19 Verification — UI Integration

**Date:** 2026-04-24
**Scope:** 把 Phase 17/18 资产（SpringPressable / haptic / iOS 原语）集成到全部屏幕 + 基础组件
**Result:** **PASS**

---

## 一、改动覆盖

### 新增 1 个组件
- ✅ `src/components/ios/HeaderIconButton.tsx` — 顶栏图标按钮（wash / accent），每个按钮独立 SpringPressable，彻底修复截图里的「按压连带感」

### 升级 3 个基础组件
- ✅ `Fab.tsx` — `Pressable` → `SpringPressable` + `haptic.medium`
- ✅ `ListRow.tsx` — `Pressable` → `SpringPressable` + `haptic.light`
- ✅ `SegmentedTwo.tsx` — `Pressable` → `SpringPressable` + `haptic.select`

### 屏幕集成（9 个屏幕）
| Screen | 改动 |
|--------|------|
| `HomeScreen.tsx` | headerRight/headerLeft 用 `HeaderIconButton`；月份 banner / 列表行 / iOS picker 全部 `SpringPressable` + haptic |
| `ChartScreen.tsx` | 周/月/年分段、周期 chip 全部 `SpringPressable` + `haptic.select` |
| `CalendarScreen.tsx` | 月份切换箭头、日期格、列表行全部 `SpringPressable` + haptic |
| `BudgetScreen.tsx` | 设置/修改/Modal 按钮全部 `SpringPressable`，保存触发 `haptic.success` |
| `AssetScreen.tsx` | 账户行/添加按钮/Modal 按钮，长按触发 `haptic.medium`，保存 `success` |
| `BillQueryScreen.tsx` | 日期条 / range / 列表行 / picker 按钮全部 `SpringPressable` + haptic |
| `BillDetailScreen.tsx` | 编辑/删除按钮 `SpringPressable`，删除确认触发 `haptic.error` |
| `MineScreen.tsx` | 3 个折叠卡片全部 `SpringPressable` + `haptic.light` |
| `CreateBillScreen.tsx` | 分类网格单元 / iOS picker 完成按钮 `SpringPressable` + haptic |

### Token 清理
- ✅ 从 `src/theme/layout.ts` 移除废弃 token：`pressScale` / `pressTranslateY` / `pressDurationMs`
- ✅ 保留 `pressedOpacity` 仅作 React Navigation `PlatformPressable` 兼容值

---

## 二、grep 验收

### SpringPressable 覆盖
- `grep -r "SpringPressable" src/screens | wc -l` 覆盖 9 个屏幕

### 老式按压彻底移除
- `grep -rn "pressedOpacity\|pressScale\|pressTranslateY" src/screens` → **0 hits** ✅
- `grep -n "pressedOpacity" src/theme/layout.ts` → 仅保留注释说明 + 一个导出
- `grep -n "pressOpacity" src/navigation/RootNavigator.tsx` → 1 hit（Tab bar PlatformPressable，故意保留）

### haptic 调用分布
- `grep -rn "haptic\." src/screens` → 覆盖所有交互面

---

## 三、修复用户截图问题

**问题：** 点击 "+"（蓝色加号）或 filter（白色）时，整个椭圆背景跟着动
**根因：** 两个 `Pressable` 并列时共享同一 Animated 父级，或按压动画跨越边界
**修复：**
- 新建 `HeaderIconButton` 作为**封闭原语** —— 每个按钮内部拥有独立 `SpringPressable` → 独立 `useSharedValue(scale/opacity)`
- `scale → 0.94` + `opacity → 0.92`（`SPRING.UI`）
- 按下 `haptic.medium`（accent）或 `haptic.light`（wash）同帧触发
- `Reduce Motion` 开启时自动降级为短 timing

---

## 四、verify 门禁

```
tsc --noEmit                          ✓ 0 error
eslint . --max-warnings 0             ✓ 0 warning / 0 error
vitest run                            ✓ 4 test files / 17 tests passed
  ✓ src/utils/billTimeRange.test.ts       (2)
  ✓ src/utils/haptics.test.ts             (7)
  ✓ src/chart/chartAggregate.test.ts      (5)
  ✓ src/budget/monthExpense.test.ts       (3)
```

---

## 五、对齐 v1.2 设计宪法

| v1.2 条款 | 本相位落地 |
|------|------|
| **§11.3 按压弹簧** | 所有 Pressable → SpringPressable ✅ |
| **§11.9 Reduce Motion 降级** | SpringPressable 内部自动降级 ✅ |
| **§13.2 触觉场景映射表** | 全仓 haptic 覆盖（light/medium/select/success/error） ✅ |
| **§19.6 组件内禁区** | 「Pressable 裸用无动效无触觉」一票否决 → 已肃清 ✅ |

---

## 六、推迟到后续相位

### Phase 20 候选
- 玻璃应用到 HeaderIconButton 外层（若视觉需要统一胶囊感，评估性能后定）
- App Icon 4 变体 + `controlSize.extraLarge` token
- 陀螺仪高光（P2）

### Phase 21+ 候选
- Modal 进出场改用 `useMaterialize`（替代 `animationType="fade"`）
- Chart 柱图 Stagger 接入 `withDelay`（v1.2 §11.5）
- 大标题 Scroll-Driven Collapse

---

## 七、用户可感知的变化

即刻可体验：
1. **Home 顶栏 + / filter / 日历按钮** — 点击各自独立弹性缩放 + 触觉
2. **所有列表行** — 按压轻微缩放 + 弱触觉
3. **图表分段切换** — Spring 弹性 + selection 触觉
4. **预算 / 资产保存** — 保存成功瞬间 success 触觉
5. **账户长按** — medium 触觉（暗示操作重要性）
6. **日期选择器完成** — selection 触觉
7. **分类网格单选** — Spring scale + selection 触觉

---

*Phase: 19-ui-integration*
*Verified: 2026-04-24 by Cursor Agent*
*verify: tsc ✓ / eslint ✓ / 4 files 17 tests passed*
