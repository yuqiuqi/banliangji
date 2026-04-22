import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { radii } from "../../theme/layout";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function GroupedInset({ children, style }: Props): React.ReactElement {
  return <View style={[styles.wrap, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.body,
  },
});
