# Phase 11 — Pattern Map

**Phase:** 11-chrome-depth  
**Date:** 2026-04-22  

## Files Likely Modified

| Role | Path | Closest analog |
|------|------|----------------|
| 导航 + Tab 材质 | `src/navigation/RootNavigator.tsx` | 当前 `BlurView` tabBarBackground |
| 记一笔 | `src/screens/CreateBillScreen.tsx` | 现有 Dock `BlurView` |
| 语义色 | `src/theme/colors.ts` | 现有 light token；新增 dark / getter |
| iOS 原语 | `src/components/ios/*.tsx` | `GroupedInset`, `Fab`, `ListRow` 等静态 `colors` 导入 |
| 业务屏 | `src/screens/*.tsx` | `import { colors } from "../theme/colors"` 多处 |

## Established Patterns to Preserve

- Phase 9：`expo-blur` on iOS Tab；Android 实色 Tab 底。  
- `PlatformPressable` + `pressedOpacity` for Tab buttons。

## Integration

- 新 **ThemeContext** 应包裹在 `SafeAreaProvider` / `NavigationContainer` 外层或内层（与 `BillsRefreshProvider` 不冲突）以便全树 `useTheme()`。

## PATTERN MAPPING COMPLETE
