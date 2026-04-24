# Phase 20: iOS 26 UI 精致化 - Context

**Gathered:** 2026-04-24
**Status:** Executed
**Source:** 用户真机反馈 6 条具体问题

## Phase Boundary

响应用户在 Phase 19 合并后的真机验收反馈，对 UI 细节做精致化修正，让项目**从能用升级到好看、顺手**。

**6 条修正：**
1. Header「+」/「filter」按钮按压连带感（Phase 19 未根治，本相位用 fixed-size outer wrapper 方案）
2. 弹出窗口（date picker 容器）半透明毛玻璃化，考虑字体颜色可读性
3. Date picker 样式老旧 —— `display="spinner"` → `display="inline"`（iOS 14+ 日历网格）
4. Switch / SegmentedTwo 切换做成滑动 Spring Thumb + 立体（白色浮岛 + 阴影）+ 暗示毛玻璃
5. Chart 柱图 + 分类进度条加立体渐变 + 高光 hairline（陀螺仪 P2 推迟 Phase 21）
6. 日期选择组件（BillQuery range）同 3，统一 inline 潮流外观

## Implementation Decisions

### D-P20-01 按压连带感根治方案
`HeaderIconButton` 外层加固定 size `View`（headerFabSize × headerFabSize），内层 `SpringPressable` 只负责视觉 transform。这样按压动画**不可能**溢出到兄弟按钮的 layout 位置。scale 也收敛到 0.97（比 0.94 更克制）。

### D-P20-02 Date picker 玻璃化方案
- overlay scrim 用 `colors.modalScrim`（v1.2 语义色）
- card 外层改 `GlassEffectContainer`，`intensity=70`，`borderRadius=20`（对齐 iOS 26 Sheet 圆角）
- 「完成」按钮用 `VibrantText`（自带 title color + textShadow 兜底）
- 三屏（HomeScreen / BillQueryScreen / CreateBillScreen）统一处理

### D-P20-03 Date picker display mode
`display="spinner"` → `display="inline"`；顺带加 `accentColor={colors.accent}` + `themeVariant` 跟随主题。

### D-P20-04 SegmentedTwo Spring Thumb
- 独立 `Animated.View` 作为 thumb 层，absolute 定位、透过 `translateX` 滑动
- `SPRING.THUMB` 驱动（13 damping / 260 stiffness / 0.9 mass，更活泼）
- `thumb` 层有立体阴影（shadowOffset y:2, opacity:0.12）+ 顶部高光 hairline border
- `haptic.select` 每次切换触发
- Reduce Motion 降级为短 timing

### D-P20-05 Chart 柱图立体
- 每根柱外层 `View` 做圆角 + shadow（`shadowColor: expense`，制造"红色发光"感）
- 内填 `LinearGradient` 从 `colors.expense` 到 `rgba(255,59,48,0.55)`（上深下浅）
- 顶部 1px 高光 hairline（白 0.55 opacity），模拟 iOS 26 specular
- 分类占比条同样处理（水平方向 gradient + highlight）

### D-P20-06 推迟项
- **陀螺仪高光** `useGyroHighlight` + `expo-sensors` → Phase 21（需要新依赖 + 电量评估）
- **3D 视角柱图** → Phase 22+（Skia 重写代价高，v1.2 §3.6 Tier 3 探索项）

## Canonical References

- `.planning/IOS26-DESIGN-GUIDE.md` v1.2
  - §3.6/§3.10/§3.12 玻璃
  - §3.8 Vibrancy
  - §11.2 Spring Thumb（分段指示器滑动）
  - §11.3 按压弹簧
  - §11.9 Reduce Motion
  - §13 Haptics
- `src/components/ios/*` — Phase 17/18 资产

---

*Phase: 20-ui-polish*
*Context: 2026-04-24 响应真机反馈*
