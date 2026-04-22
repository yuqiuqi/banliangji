# Phase 11: chrome-depth — Research

**Researched:** 2026-04-22  
**Domain:** React Native (Expo) · 系统外观 · 无障碍 · 毛玻璃 / Reanimated 动效  
**Confidence:** HIGH（栈与仓库现状一致）/ MEDIUM（真机帧率需执行期测量）

## Summary

Phase 11 在 **CONTEXT** 锁定决策下，将 **系统深色** 与 **降低透明度** 接到现有 iOS 26 Chrome 语义 token，并把 Tab / 记一笔等 **Tier-1** 的 `expo-blur` 实现升级为 **分层材质栈**（tint + 可选高光 + shadow），动效侧用 **Reanimated spring** 收敛「线性僵硬」主导问题。不引入网络、不新增业务 schema。

**Primary recommendation:** 用 **ThemeContext**（或等价）集中提供 `light`/`dark` palette；用 **`AccessibilityInfo.isReduceTransparencyEnabled()`** 驱动单一 **AdaptiveGlass** 封装；Tier-1 表面统一走共享 `IOSChrome*` 原语。

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| 亮/暗语义色 | `src/theme/*` + Context | 各 Screen/Component 消费 | 单一来源，避免逐文件 `useColorScheme` 分叉 |
| 降低透明度降级 | 封装组件 + hook | RootNavigator / CreateBill | 与 CONTEXT D11-03 一致 |
| 材质分层（LG） | `src/components/ios/` | TabBar / Dock | 与 Phase 9 原语目录一致 |
| 流体动效 | Reanimated | Tab 按压、Sheet/Dock | SPEC §4.2 |
| 验收与偏差文档 | `11-VERIFICATION.md` + 根 UI 文档 | — | ROADMAP 成功标准 |

## User Constraints

（自 `11-CONTEXT.md` 摘录 — planner **不得**违背）

### 深色外观（THEME-01）

- **D11-01:** 以系统外观为唯一来源：`useColorScheme()`；成对语义 token；Tier-1 与 UI-SPEC/DESIGN 一致或可 Accepted deviation。  
- **D11-02:** Phase 11 **不新增**应用内主题开关。

### 降低透明度（A11Y-01）

- **D11-03:** 集中检测 + 集中降级；Tier-1 接入。  
- **D11-04:** 降级非空白、可点击、可辨识。

### Liquid Glass 纵深（LG-01）

- **D11-05:** 可复用分层表面原语于 `src/components/ios/`。  
- **D11-06:** Tier-1 动效最小集 + `withSpring`。  
- **D11-07:** Android 不透明近似 + 文档。  
- **D11-08:** 无法 1:1 处 Accepted deviation + VERIFICATION。  

### 文档与验收

- **D11-09:** `11-VERIFICATION.md` + 根 `UI-SPEC.md` / `DESIGN.md` 同步。

### Claude's Discretion

- token 文件组织；Tier-1 是否含「全部 Stack header」由 PLAN 收敛。

## Standard Stack

| Concern | Choice | Notes |
|---------|--------|-------|
| 深色 | `useColorScheme` from `react-native` | [VERIFIED: `package.json` / RN 19] |
| 降低透明度 | `AccessibilityInfo` from `react-native` | [ASSUMED: RN API 稳定；执行期真机确认] |
| 模糊 | `expo-blur` `BlurView` | [VERIFIED: `RootNavigator.tsx`, `CreateBillScreen.tsx`] |
| 动效 | `react-native-reanimated` | [VERIFIED: Phase SPEC 与常见 Expo 54 栈] |
| 导航主题 | `@react-navigation/native` theme | [VERIFIED: `RootNavigator.tsx` 已有 `navTheme`] |

## Architecture Patterns

1. **ThemeContext** — `paletteLight` / `paletteDark`，与现有 `colors` 键空间对齐，减少业务改动面。  
2. **Adaptive chrome surface** — `(reduceMotion | reduceTransparency) ⇒ opaque + hairline`；否则走 Blur 栈。  
3. **Tier-1 first** — Tab bar、记一笔 Dock/Blur 区、主列表顶栏（ROADMAP）；其余可后续。

## Don't Hand-Roll

- 不要自写 iOS 原生 Liquid Glass 着色器 — 超出范围；用叠层近似。  
- 不要为 Phase 11 引入新网络依赖或同步层。

## Common Pitfalls

- Tab `BlurView` 与 `tabBarStyle.backgroundColor: transparent` 组合在降级时若未同步改 **border/icon 对比**，会不可读 [ASSUMED: HIG 经验]。  
- `AccessibilityInfo` 订阅未在 unmount 清理 → 泄漏 [ASSUMED: 常规 RN]。  
- 多层 Blur 在旧真机掉帧 — SPEC 已允许减层数 [CONTEXT]。

## Code Examples

- 现有 Tab blur：`RootNavigator.tsx` `tabBarBackground` 使用 `BlurView`。  
- 现有记一笔 blur：`CreateBillScreen.tsx`。

## Open Questions

1. **Reanimated 是否已在 babel 插件链就绪**  
   - 执行期读 `babel.config.js` / Expo 默认；若缺失则 PLAN 含 `[BLOCKING]` 配置任务。

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Xcode / iOS Simulator | THEME/A11Y/LG spot-check | 开发者机器 | — | 文档 BLOCKED + 计划 |
| Android SDK | 不透明降级目检 | — | — | 文档标注即可 |

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | vitest（via `npm run test`）+ TypeScript + ESLint |
| Config file | `package.json` scripts；项目内 vitest 配置以仓库为准 |
| Quick run command | `npm run verify` |
| Full suite command | `npm run verify` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| THEME-01 | 深色 token 编译与 lint | static | `npm run verify` | ✅ 现有 |
| A11Y-01 | 降级路径无类型错误 | static | `npm run verify` | ✅ |
| LG-01 | 组件可编译 | static | `npm run verify` | ✅ |
| THEME/A11Y/LG | 真机/模拟器观感与对比度 | manual | — | `11-VERIFICATION.md` |

### Sampling Rate

- **Per task commit:** `npm run verify`  
- **Per wave merge:** `npm run verify`  
- **Phase gate:** `npm run verify` 绿 + VERIFICATION 表完成  

### Wave 0 Gaps

None — 不要求新建 vitest 用例覆盖 UI 像素；以静态门禁 + 手工验收表为主。

## Security Domain

本阶段仅本地 UI；无新信任边界。

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | — |
| V5 Input Validation | no UI 输入模型变更 | — |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| 无新服务端暴露 | — | N/A |

## Sources

### Primary

- [VERIFIED: codebase] `src/navigation/RootNavigator.tsx`, `src/theme/colors.ts`, `11-MATERIAL-MOTION-SPEC.md`, `11-CONTEXT.md`

### Tertiary

- [ASSUMED] React Native `useColorScheme` / `AccessibilityInfo` 行为与 Apple HIG 深色对比度期望

## Metadata

**Confidence breakdown:** 栈选择 HIGH；动效参数 MEDIUM（需设备手感校准）  
**Research date:** 2026-04-22  

## RESEARCH COMPLETE
