import React from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { pressedOpacity } from "../../theme/layout";

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  isLast?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ListRow({ children, onPress, isLast, style }: Props): React.ReactElement {
  const inner = (
    <View style={[styles.inner, !isLast ? styles.borderBottom : null, style]}>{children}</View>
  );
  if (onPress !== undefined) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [pressed ? { opacity: pressedOpacity } : null]}
      >
        {inner}
      </Pressable>
    );
  }
  return inner;
}

const styles = StyleSheet.create({
  inner: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
  },
  borderBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.body,
  },
});
