/**
 * Clay layout tokens — radii, shadows, borders (see DESIGN.md / 02-UI-SPEC.md).
 */
import { Platform, type ViewStyle } from "react-native";
import { colors } from "./colors";

export const radii = {
  card: 12,
  sheet: 16,
  pill: 999,
} as const;

export const shadows = {
  card: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    android: { elevation: 3 },
    default: {},
  }),
} as const;

export const hairlineBorder = {
  borderWidth: 1,
  borderColor: colors.body,
} as const;
