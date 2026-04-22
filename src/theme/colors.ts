/**
 * iOS / iPadOS 26 设计语言取向 — 默认导出为 **浅色**（向后兼容）。
 * 运行时主题请使用 `useAppTheme()`（Phase 11）。
 */
import type { AppPalette } from "./palette";
import { darkPalette, lightPalette } from "./palette";

/** @deprecated 业务组件请用 `useAppTheme().colors` */
export const colors: AppPalette = lightPalette;

export { darkPalette, lightPalette, type AppPalette };

export function getIosSemantic(c: AppPalette) {
  return {
    groupedBackground: c.canvas,
    secondaryGrouped: c.surface,
    label: c.title,
    secondaryLabel: c.lightTitle,
    separator: c.divider,
    systemBlue: c.accent,
    systemGreen: c.income,
    systemRed: c.expense,
  } as const;
}

/** @deprecated 请使用 `getIosSemantic(useAppTheme().colors)` */
export const iosSemantic = getIosSemantic(lightPalette);
