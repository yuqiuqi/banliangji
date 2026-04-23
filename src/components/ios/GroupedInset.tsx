import React, { useMemo } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useAppTheme } from "../../theme/ThemeContext";
import { listContentInset, radii, shadows } from "../../theme/layout";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function GroupedInset({ children, style }: Props): React.ReactElement {
  const { colors } = useAppTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        outer: {
          marginHorizontal: listContentInset,
          borderRadius: radii.card,
        },
        inner: {
          borderRadius: radii.card,
          backgroundColor: colors.surface,
          overflow: "hidden",
        },
      }),
    [colors],
  );

  return (
    <View style={[styles.outer, shadows.grouped, style]}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}
