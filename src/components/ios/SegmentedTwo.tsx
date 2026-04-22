import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { colors } from "../../theme/colors";
import { pressedOpacity } from "../../theme/layout";

type Props = {
  leftLabel: string;
  rightLabel: string;
  value: 0 | 1;
  onChange: (v: 0 | 1) => void;
  style?: StyleProp<ViewStyle>;
};

export function SegmentedTwo({
  leftLabel,
  rightLabel,
  value,
  onChange,
  style,
}: Props): React.ReactElement {
  return (
    <View style={[styles.track, style]}>
      <Pressable
        style={({ pressed }) => [
          styles.seg,
          value === 0 ? styles.segOn : null,
          pressed ? { opacity: pressedOpacity } : null,
        ]}
        onPress={() => {
          onChange(0);
        }}
      >
        <Text style={[styles.text, value === 0 ? styles.textOn : null]}>{leftLabel}</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.seg,
          value === 1 ? styles.segOn : null,
          pressed ? { opacity: pressedOpacity } : null,
        ]}
        onPress={() => {
          onChange(1);
        }}
      >
        <Text style={[styles.text, value === 1 ? styles.textOn : null]}>{rightLabel}</Text>
      </Pressable>
    </View>
  );
}

const segOnLift = Platform.select({
  ios: {
    backgroundColor: colors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  android: {
    backgroundColor: colors.surface,
    elevation: 2,
  },
  default: { backgroundColor: colors.surface },
});

const styles = StyleSheet.create({
  /** tertiarySystemFill 轨道 — 贴近 UISegmentedControl */
  track: {
    flexDirection: "row",
    backgroundColor: colors.light,
    borderRadius: 9,
    padding: 2,
  },
  seg: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 7,
  },
  segOn: segOnLift,
  text: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.lightTitle,
  },
  /** 选中段：主字色（label），非仅描蓝 */
  textOn: {
    color: colors.title,
    fontWeight: "600",
  },
});
