import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useAppTheme } from "../../theme/ThemeContext";
import type { AppPalette } from "../../theme/palette";
import {
  fabIconSize,
  fabSize,
  pressScale,
  pressedOpacity,
  shadows,
} from "../../theme/layout";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

type Props = {
  onPress: () => void;
  accessibilityLabel: string;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
};

function buildFabStyles(colors: AppPalette) {
  return StyleSheet.create({
    disc: {
      width: fabSize,
      height: fabSize,
      borderRadius: fabSize / 2,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "rgba(255, 255, 255, 0.38)",
      ...shadows.fab,
    },
  });
}

export function Fab({ onPress, accessibilityLabel, icon = "plus", style }: Props): React.ReactElement {
  const { colors } = useAppTheme();
  const styles = useMemo(() => buildFabStyles(colors), [colors]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        style,
        pressed ? { opacity: pressedOpacity, transform: [{ scale: pressScale }] } : null,
      ]}
    >
      <View style={styles.disc}>
        <MaterialCommunityIcons name={icon} size={fabIconSize} color={colors.onAccent} />
      </View>
    </Pressable>
  );
}
