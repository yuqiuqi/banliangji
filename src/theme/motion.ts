/**
 * iOS 26 / Liquid Glass 动效 token — 对齐 `.planning/IOS26-DESIGN-GUIDE.md` §11.1。
 * 禁止在业务组件中使用自定义弹簧参数；一律从本文件导入。
 */

export const SPRING = {
  /** 主弹簧：按钮、分段指示器、列表行 */
  UI: { damping: 15, stiffness: 220, mass: 1 },
  /** 轻盈弹簧：chip、徽章、小标签（更活泼） */
  THUMB: { damping: 13, stiffness: 260, mass: 0.9 },
  /** 厚重弹簧：sheet 底栏、大浮层（更稳） */
  SHEET: { damping: 20, stiffness: 200, mass: 1.1 },
  /** 极快弹簧：手势跟随/复位（接近 interactiveSpring） */
  GESTURE: { damping: 12, stiffness: 300, mass: 1 },
} as const;

/** Reduce Motion 开启时的降级 spring —— 阻尼极大，几乎线性无弹跳 */
export const REDUCE_SPRING = { damping: 50, stiffness: 400, mass: 1 } as const;

/** 辅助 timing 时长（ms），用于 opacity / scrim 等非物理过渡 */
export const FADE_MS = {
  fast: 120,
  normal: 200,
  slow: 350,
} as const;

export type SpringPreset = keyof typeof SPRING;
