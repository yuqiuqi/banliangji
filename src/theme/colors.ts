/**
 * Bright Tesla-inspired tokens — light chrome (white headers), airy canvas,
 * saturated blue accent. See root `DESIGN.md` + `08-UI-SPEC.md` for product notes.
 */
export const colors = {
  /** Near-white screen canvas */
  canvas: "#FAFAFA",
  /** Nav / in-screen header bands — bright chrome (no dark top bar) */
  main: "#FFFFFF",
  /** Text & icons on `main` (light) surfaces */
  onMain: "#171A20",
  /** Secondary on light `main` */
  onMainSecondary: "#6B7280",
  /** Strips, alternates */
  light: "#F0F1F3",
  /** Hairlines, borders */
  body: "#E5E7EB",
  /** Primary text on cards / list */
  title: "#171A20",
  /** Secondary on light */
  lightTitle: "#5C5E62",
  /** Brighter blue — tab active, CTA, progress */
  tabbarTint: "#2563EB",
  /** Alias for CTA / emphasis */
  accent: "#2563EB",
  createBody: "#FFFFFF",
  calculatorBg: "#F3F4F6",
  white: "#FFFFFF",
  /** Text on `accent` buttons (e.g. calculator =) */
  onAccent: "#FFFFFF",
  /** Income — slightly brighter green for light UI */
  income: "#059669",
} as const;
