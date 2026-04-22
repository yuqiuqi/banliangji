/**
 * 明亮活力主题：不用纯黑/炭黑字，用偏天青/蓝的深色；高饱和天青作唯一主强调色。
 * 以 `08-UI-SPEC.md` 为产品说明，DESIGN 文档中 Tesla 黑字为参考、运行时以此文件为准。
 */
export const colors = {
  /** 带一点冷色气的浅底，比灰白更「活」 */
  canvas: "#F0F9FF",
  /** 顶栏 / 标题带 */
  main: "#FFFFFF",
  /**
   * 主字色（**非黑色**）— 天青-900 墨水，用于标题、导航字、行主文
   */
  onMain: "#0C4A6E",
  /** 次字 — 可感知色相，仍易读 */
  onMainSecondary: "#0369A1",
  /** 浅条、交替底 */
  light: "#E0F2FE",
  /** 边框/分割线 — 带一点青 */
  body: "#BAE6FD",
  /** 与 onMain 同系，列表主色 */
  title: "#0C4A6E",
  /** 说明、次行 — 不灰不黑，偏天青 */
  lightTitle: "#0284C7",
  /** 高饱和天青：Tab 激活、主按钮、强提示 */
  tabbarTint: "#0EA5E9",
  accent: "#0EA5E9",
  createBody: "#FFFFFF",
  calculatorBg: "#E0F2FE",
  white: "#FFFFFF",
  onAccent: "#FFFFFF",
  /** 收入：鲜绿、与主青区分 */
  income: "#10B981",
} as const;
