import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { useAppTheme } from "../theme/ThemeContext";

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const CATEGORY_ID_ICON: Record<number, IconName> = {
  1: "silverware-fork-knife",
  2: "candy",
  3: "shopping",
  4: "car",
  5: "dumbbell",
  6: "car-estate",
  7: "hospital-box",
  8: "paw",
  9: "book-open-variant",
  10: "school",
  11: "gift-outline",
  12: "briefcase-outline",
  13: "hammer-wrench",
  14: "heart-outline",
  15: "ticket-confirmation",
  16: "truck-fast",
  17: "account-group",
  18: "face-woman-outline",
  19: "food-apple",
  20: "bag-suitcase",
  21: "movie-open",
  22: "cash-multiple",
  23: "carrot",
  24: "account-heart",
  25: "home-city",
  26: "baby-face-outline",
  27: "phone",
  28: "tshirt-crew",
  29: "basket-outline",
  30: "smoking-off",
  31: "account-multiple",
  32: "laptop",
  33: "sofa",
  34: "cash",
  35: "briefcase-clock",
  36: "chart-line",
  37: "gift",
  38: "briefcase-clock",
  39: "help-circle-outline",
};

export function CategoryIcon({
  categoryId,
  size = 28,
  color: colorProp,
}: {
  categoryId: number;
  size?: number;
  color?: string;
}): React.ReactElement {
  const { colors } = useAppTheme();
  const color = colorProp ?? colors.title;
  const name = CATEGORY_ID_ICON[categoryId] ?? "label-outline";
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}
