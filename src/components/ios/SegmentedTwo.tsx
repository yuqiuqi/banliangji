import React from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { pressedOpacity, radii } from "../../theme/layout";

const ON_BG = "rgba(0, 122, 255, 0.12)";

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

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.body,
  },
  seg: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  segOn: {
    backgroundColor: ON_BG,
  },
  text: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.lightTitle,
  },
  textOn: {
    color: colors.accent,
    fontWeight: "600",
  },
});
