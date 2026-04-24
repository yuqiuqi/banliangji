import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { SpringPressable } from "../SpringPressable";
import { useAppTheme } from "../../theme/ThemeContext";
import type { AppPalette } from "../../theme/palette";
import { fabIconSize, fabSize, shadows } from "../../theme/layout";
import { GlassShimmer } from "./GlassShimmer";

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
      overflow: "hidden",
      ...shadows.fab,
    },
  });
}

export function Fab({
  onPress,
  accessibilityLabel,
  icon = "plus",
  style,
}: Props): React.ReactElement {
  const { colors } = useAppTheme();
  const styles = useMemo(() => buildFabStyles(colors), [colors]);
  const [shimmer, setShimmer] = useState(false);
  const shimmerResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onPressIn = useCallback((): void => {
    if (shimmerResetRef.current != null) {
      clearTimeout(shimmerResetRef.current);
    }
    setShimmer(true);
    shimmerResetRef.current = setTimeout(() => {
      setShimmer(false);
      shimmerResetRef.current = null;
    }, 500);
  }, []);

  return (
    <SpringPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onPressIn={onPressIn}
      hapticOn="pressIn"
      hapticIntensity="medium"
      scaleTo={0.94}
      style={style}
    >
      <View style={styles.disc}>
        <GlassShimmer active={shimmer} width={fabSize} height={fabSize} />
        <MaterialCommunityIcons name={icon} size={fabIconSize} color={colors.onAccent} />
      </View>
    </SpringPressable>
  );
}
