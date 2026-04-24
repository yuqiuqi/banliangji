# Phase 17 Verification — Design Ground

**Date:** 2026-04-24
**Scope:** Wave 1 / Option A — motion/haptics/SpringPressable 5 件基础资产
**Result:** **PASS**

---

## Task-level 验收

### T1: expo-haptics 重装
- [x] **通过**
- 证据：
  - `package.json` 含 `"expo-haptics": "~15.0.8"`
  - `npm ls expo-haptics` 显示单一版本 `expo-haptics@15.0.8`
  - 由 `npx expo install expo-haptics` 自动解析（Expo SDK 54 兼容）

### T2: `src/theme/motion.ts`
- [x] **通过**
- 证据：
  - 5 导出齐全：`SPRING` / `REDUCE_SPRING` / `FADE_MS` / `SpringPreset` + 默认导出 const
  - `SPRING` 含 UI/THUMB/SHEET/GESTURE 四预设，与 v1.2 §11.1 一致
  - `REDUCE_SPRING` damping:50 stiffness:400 mass:1
  - `FADE_MS` fast:120 / normal:200 / slow:350
  - tsc 通过

### T3: `src/hooks/useReduceMotion.ts`
- [x] **通过**
- 证据：
  - `useReduceMotion()` 导出
  - 使用 `AccessibilityInfo.isReduceMotionEnabled()` 初始读取
  - 使用 `reduceMotionChanged` listener 响应变更
  - 双路径 cleanup（`active` flag + `sub.remove()`）
  - tsc 通过，与 `useReduceTransparency.ts` 风格一致

### T4: `src/utils/haptics.ts`
- [x] **通过**
- 证据：
  - 6 方法齐全：`select` / `success` / `warning` / `error` / `light` / `medium`
  - `safe()` wrapper 提供 try/catch（静默失败）
  - `HapticKind` 类型导出
  - 对齐 v1.2 §13.2 场景映射表
  - tsc 通过

### T5: `src/utils/haptics.test.ts`
- [x] **通过**
- 证据：
  - 7 vitest tests 全部通过
  - 覆盖：6 API 各 1 个 + 1 个静默失败验证
  - `vi.mock("expo-haptics", ...)` 策略正确
  - 测试耗时 6ms，快速

### T6: `src/components/SpringPressable.tsx`
- [x] **通过**
- 证据：
  - `SpringPressable` + `SpringPressableProps` 双导出
  - `React.forwardRef` 支持 ref 透传
  - 使用 `Animated.createAnimatedComponent(Pressable)` 原生包装
  - 三分支逻辑：
    - `down()` / `up()` 处理 press 动画
    - `fire()` 处理触觉
    - `reduce` 检查切换 spring → timing
  - 5 可配 props：`spring` / `hapticOn` / `hapticIntensity` / `scaleTo` / `opacityTo`
  - tsc + eslint 通过

### T7: `npm run verify` 绿 + 本验收文件
- [x] **通过**
- `tsc --noEmit` → 0 error
- `eslint . --max-warnings 0` → 0 warning / 0 error
- `vitest run` → **4 test files** / **17 tests passed**（原 10 + 新 7）
- 测试文件：
  - ✓ `src/utils/billTimeRange.test.ts` (2)
  - ✓ **`src/utils/haptics.test.ts` (7)** ← 新增
  - ✓ `src/chart/chartAggregate.test.ts` (5)
  - ✓ `src/budget/monthExpense.test.ts` (3)

---

## v1.2 §18.2 资产清单闭环

| 资产 | v1.2 §18.2 标记 | Phase 17 Wave 1 产出 | 状态 |
|------|-----------------|----------------------|------|
| `src/theme/motion.ts` | 缺失 | ✅ 重建 | **Done** |
| `src/hooks/useReduceMotion.ts` | 缺失 | ✅ 新建 | **Done** |
| `src/utils/haptics.ts` | 缺失 | ✅ 新建（+ 单测） | **Done** |
| `src/components/SpringPressable.tsx` | 缺失 | ✅ 新建 | **Done** |
| `expo-haptics` 依赖 | 缺失 | ✅ 重装 (`~15.0.8`) | **Done** |
| `src/components/ios/GlassEffectContainer.tsx` | 缺失 | ❌ 推迟 Phase 18（Option B） | Deferred |
| `src/components/ios/GlassEffectUnion.tsx` | 缺失 | ❌ 推迟 | Deferred |
| `src/components/ios/VibrantText.tsx` | 缺失 | ❌ 推迟 | Deferred |
| `src/components/ios/GlassShimmer.tsx` | 缺失 | ❌ 推迟 | Deferred |
| `src/hooks/useTouchRipple.ts` | 缺失 | ❌ 推迟 | Deferred |
| `src/hooks/useGyroHighlight.ts` | 缺失 | ❌ 推迟（RN-T2） | Deferred |
| `src/hooks/useMaterialize.ts` | 缺失 | ❌ 推迟 | Deferred |
| `expo-linear-gradient` 依赖 | 缺失 | ❌ 推迟 Phase 18（Option B） | Deferred |

**本相位完成：5 / 13（38%）**，聚焦最关键的 motion + haptics + SpringPressable 地基。

---

## 分支与提交

- 分支：`cursor/phase-17-exec`（从 master 分出，master HEAD = `9d802f1`）
- 单一原子提交（计划）：`feat(17-01): 设计宪法基础资产 — motion/haptics/SpringPressable + expo-haptics`

## 下一步

- [ ] **Phase 18**：Option B 玻璃体系
  - `GlassEffectContainer.tsx` / `GlassEffectUnion.tsx` / `VibrantText.tsx` / `GlassShimmer.tsx`
  - `expo-linear-gradient` 安装
- [ ] **Phase 19（或更后）**：Option C App Icon 四变体 + Extra-Large token
- [ ] **各屏幕替换裸 `Pressable` 为 `SpringPressable`** —— 另立相位（Phase 18 内部分 Wave 或独立相位）

---

*Phase: 17-design-ground*
*Verified: 2026-04-24 by Cursor Agent (Claude Opus 4.7)*
*Verify result: tsc ✓ / eslint ✓ / vitest 4 files / 17 tests ✓*
