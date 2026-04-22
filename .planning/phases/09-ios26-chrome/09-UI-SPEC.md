# Phase 9 — UI Design Contract（iOS 26 Chrome）

**Phase:** 09-ios26-chrome  
**Status:** Planning / execution contract  
**Companion:** `09-BREAKTHROUGH-SPEC.md`（全屏矩阵）

## 1. Color tokens（Light）

| Token / 语义 | 用途 | 十六进制或 rgba |
|--------------|------|------------------|
| groupedBackground | 屏大底 | `#F2F2F7` |
| secondaryGrouped | 卡片/列表容器底 | `#FFFFFF` |
| label | 主文 | `#000000` |
| secondaryLabel | 次文 | `rgba(60,60,67,0.6)` |
| separator | 分割线 | `#C6C6C8` |
| systemBlue | 强调、主按钮、链接 | `#007AFF` |
| systemGreen | 收入金额 | `#34C759` |
| systemRed | 支出金额强调 | `#FF3B30` |
| tabBarInactive | Tab 未选中 | `#8E8E93` |

实现：集中在 `colors.ts` 或 `colors.ts` + `iosSemantic.ts` 导出别名；**禁止**业务文件写死 `#4A8B6A` 等 Tesla 绿。

## 2. 材质（Liquid Glass）

- **Tab 栏：** iOS `BlurView` + `tint="light"`；Android 实心 `#F9F9F9` + 顶部分隔线 `rgba(60,60,67,0.29)` hairline。
- **导航栏（可选增强）：** Home 栈非模态屏可评估 `headerBackground` + `BlurView`；模态屏可用实色 `F6F6F6` 保持可读。
- **FAB / 浮动：** 圆形，填充 `systemBlue`，图标白。

## 3. 类型与密度

- 导航标题：`fontWeight: "600"`，`fontSize: 17`（标准导航）。
- 列表主行：`fontSize: 16`~`17`；次行 `13`~`14`，次色。
- 分段控件高度目标 **≥ 32pt**；行高 **≥ 44pt** 触控目标。

## 4. 组件合同（必须可复用）

| 原语 | 责任 |
|------|------|
| Grouped 容器 | 水平 inset（默认 16）、白底、圆角 10、可选 hairline 边框 |
| ListRow | 左右 padding、底部分隔线、按压 opacity |
| SegmentedTwo | 两态选中蓝/灰底与字重 |
| PrimaryButton | 蓝底白字、圆角 pill 或 12 |

## 5. 模态与反馈

- 记一笔 / 日历：`presentation: "modal"` 保持；关闭用系统 **返回/下滑** 行为与现导航一致。
- 删除：`Alert.alert` destructive 按钮。
- 日期：`display="spinner"`（iOS）+ 底部工具条「完成」用 `systemBlue`。

## 6. 验收对照

每一屏以 `09-BREAKTHROUGH-SPEC.md` §3 行为准；截图入 `09-VERIFICATION.md`。
