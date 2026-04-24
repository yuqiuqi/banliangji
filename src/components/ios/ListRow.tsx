import React, { useMemo } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { SpringPressable } from "../SpringPressable";
import { useAppTheme } from "../../theme/ThemeContext";
import { listContentInset } from "../../theme/layout";

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  isLast?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ListRow({
  children,
  onPress,
  isLast,
  style,
}: Props): React.ReactElement {
  const { colors } = useAppTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        inner: {
          minHeight: 44,
          paddingHorizontal: listContentInset,
          paddingVertical: 12,
          justifyContent: "center",
        },
        borderBottom: {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.divider,
        },
      }),
    [colors],
  );

  const inner = (
    <View style={[styles.inner, !isLast ? styles.borderBottom : null, style]}>
      {children}
    </View>
  );
  if (onPress !== undefined) {
    return (
      <SpringPressable
        onPress={onPress}
        hapticOn="pressIn"
        hapticIntensity="light"
      >
        {inner}
      </SpringPressable>
    );
  }
  return inner;
}
