/**
 * Clay-inspired palette — aligned with `DESIGN.md` from
 * `npx getdesign@latest add clay` (https://getdesign.md/clay/design-md).
 * Warm cream canvas, oat borders, Lemon gold headers, Matcha income accent.
 */
export const colors = {
  /** Warm Cream — page / screen canvas */
  canvas: "#faf9f7",
  /** Lemon 500 — headers, brand bars (replaces legacy yellow) */
  main: "#fbbd41",
  /** Oat Light — section strips, selected cells, subtle panels */
  light: "#eee9df",
  /** Oat Border — dividers, hairlines */
  body: "#dad4c8",
  /** Clay Black — primary text on light surfaces */
  title: "#000000",
  /** Warm Silver — secondary / muted text */
  lightTitle: "#9f9b93",
  /** Matcha 600 — tab bar active, income emphasis */
  tabbarTint: "#078a52",
  /** Same as canvas — form / modal body */
  createBody: "#faf9f7",
  /** Oat-tinted — calculator keypad area */
  calculatorBg: "#eee9df",
  /** Pure White — cards & list rows on cream */
  white: "#ffffff",
  /** Matcha 600 — positive / income amounts */
  income: "#078a52",
  /** Warm Charcoal — muted labels on Lemon / `main` header bars */
  onMainSecondary: "#55534e",
} as const;
