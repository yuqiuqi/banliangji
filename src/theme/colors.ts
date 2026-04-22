/**
 * iOS / iPadOS 26 设计语言取向（社区 UI Kit / Apple Design Resources）：
 * 分组背景、标签与分隔线、系统强调色；与 Figma 稿 1:1 需在 MCP 可用时拉取 token 再对齐。
 */
export const colors = {
  /** systemGroupedBackground */
  canvas: "#F2F2F7",
  /** secondarySystemGroupedBackground — 卡片、列表容器 */
  surface: "#FFFFFF",
  /** 导航栏 / 工具条区域（略偏系统灰，便于与纯白 cell 区分） */
  main: "#F6F6F6",
  /** label */
  onMain: "#000000",
  /** secondaryLabel */
  onMainSecondary: "rgba(60, 60, 67, 0.6)",
  /** 区头底、选中浅底等 tertiarySystemFill */
  light: "#E5E5EA",
  /** separator */
  body: "#C6C6C8",
  title: "#000000",
  lightTitle: "rgba(60, 60, 67, 0.6)",
  /** Tab / 可交互强调 — systemBlue */
  tabbarTint: "#007AFF",
  accent: "#007AFF",
  tabBarActive: "#007AFF",
  tabBarInactive: "#8E8E93",
  createBody: "#F2F2F7",
  calculatorBg: "#E5E5EA",
  calculatorKeyBg: "#FFFFFF",
  calculatorKeyBorder: "#C6C6C8",
  white: "#FFFFFF",
  onAccent: "#FFFFFF",
  /** systemGreen — 收入 */
  income: "#34C759",
  /** systemRed — 支出金额强调 */
  expense: "#FF3B30",
} as const;

/** Apple 语义名 → 现有 token（对齐 09-UI-SPEC / HIG） */
export const iosSemantic = {
  groupedBackground: colors.canvas,
  secondaryGrouped: colors.surface,
  label: colors.title,
  secondaryLabel: colors.lightTitle,
  separator: colors.body,
  systemBlue: colors.accent,
  systemGreen: colors.income,
  systemRed: colors.expense,
} as const;
