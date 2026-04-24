import React, { useMemo } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { SpringPressable } from "../SpringPressable";
import { useAppTheme } from "../../theme/ThemeContext";
import type { AppPalette } from "../../theme/palette";
import { radii } from "../../theme/layout";

type Props = {
  leftLabel: string;
  rightLabel: string;
  value: 0 | 1;
  onChange: (v: 0 | 1) => void;
  style?: StyleProp<ViewStyle>;
};

function buildSegStyles(colors: AppPalette) {
  const segOnShadow =
    Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: { elevation: 2 },
      default: {},
    }) ?? {};

  return StyleSheet.create({
    track: {
      flexDirection: "row",
      backgroundColor: colors.segmentedTrack,
      borderRadius: radii.pill,
      padding: 3,
    },
    seg: {
      flex: 1,
      paddingVertical: 9,
      alignItems: "center",
      borderRadius: radii.pill,
    },
    segOn: {
      backgroundColor: colors.surface,
      ...segOnShadow,
    },
    text: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.lightTitle,
    },
    textOn: {
      color: colors.title,
      fontWeight: "600",
    },
  });
}

export function SegmentedTwo({
  leftLabel,
  rightLabel,
  value,
  onChange,
  style,
}: Props): React.ReactElement {
  const { colors } = useAppTheme();
  const styles = useMemo(() => buildSegStyles(colors), [colors]);

  return (
    <View style={[styles.track, style]}>
      <SpringPressable
        style={[styles.seg, value === 0 ? styles.segOn : null]}
        hapticOn="pressIn"
        hapticIntensity="select"
        scaleTo={0.98}
        opacityTo={0.96}
        onPress={() => {
          onChange(0);
        }}
      >
        <Text style={[styles.text, value === 0 ? styles.textOn : null]}>
          {leftLabel}
        </Text>
      </SpringPressable>
      <SpringPressable
        style={[styles.seg, value === 1 ? styles.segOn : null]}
        hapticOn="pressIn"
        hapticIntensity="select"
        scaleTo={0.98}
        opacityTo={0.96}
        onPress={() => {
          onChange(1);
        }}
      >
        <Text style={[styles.text, value === 1 ? styles.textOn : null]}>
          {rightLabel}
        </Text>
      </SpringPressable>
    </View>
  );
}
