/**
 * Tesla-inspired tokens — see root `DESIGN.md` (from
 * `npx getdesign@latest add tesla`, https://getdesign.md/tesla/design-md).
 * Light Ash canvas, Carbon chrome, Electric Blue as sole accent, near-zero
 * warm/yellow. Income remains a restrained semantic green for finance clarity.
 */
export const colors = {
  /** Light Ash — screen canvas (Tesla #F4F4F4) */
  canvas: "#F4F4F4",
  /** Carbon — nav/header bars, dark chrome (#171A20) */
  main: "#171A20",
  /** Text & icons on `main` / dark surfaces */
  onMain: "#FFFFFF",
  /** Secondary on dark `main` (Tesla Silver Fog / Pewter range) */
  onMainSecondary: "#A0A0A0",
  /** Light Ash / Cloud — strips, alternates */
  light: "#EEEEEE",
  /** Pale Silver — hairlines, borders */
  body: "#D0D1D2",
  /** Carbon — primary text on light surfaces */
  title: "#171A20",
  /** Pewter / Graphite — secondary text on light */
  lightTitle: "#5C5E62",
  /** Electric Blue — active tab, primary affordances, FAB, progress (Tesla #3E6AE1) */
  tabbarTint: "#3E6AE1",
  /** Alias for CTA / emphasis surfaces */
  accent: "#3E6AE1",
  createBody: "#FFFFFF",
  calculatorBg: "#EEEEEE",
  white: "#FFFFFF",
  /** Income / positive — kept for ledger semantics, subdued vs UI accent */
  income: "#0D6A4A",
} as const;
