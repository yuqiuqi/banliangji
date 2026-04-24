/**
 * 统计月份选择：年切换 + 12 宫格月分块（替代系统滚轮），置于毛玻璃卡片内。
 */
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "../../theme/ThemeContext";
import { radii } from "../../theme/layout";
import { iosType } from "../../theme/typography";
import { haptic } from "../../utils/haptics";
import { SpringPressable } from "../SpringPressable";
import { GlassEffectContainer } from "./GlassEffectContainer";
import { VibrantText } from "./VibrantText";

const MONTHS_ZH = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
];

export type MonthYearPickerSheetProps = {
  anchorMonth: Date;
  onCommit: (next: Date) => void;
};

export function MonthYearPickerSheet({
  anchorMonth,
  onCommit,
}: MonthYearPickerSheetProps): React.ReactElement {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [year, setYear] = useState(anchorMonth.getFullYear());
  const [month, setMonth] = useState(anchorMonth.getMonth());

  useEffect(() => {
    setYear(anchorMonth.getFullYear());
    setMonth(anchorMonth.getMonth());
  }, [anchorMonth]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          marginHorizontal: 12,
          marginBottom: Math.max(12, insets.bottom),
        },
        head: {
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: 6,
        },
        title: { ...iosType.largeTitle, color: colors.title },
        subtitle: { ...iosType.footnote, color: colors.lightTitle, marginTop: 4 },
        yearRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          paddingVertical: 10,
        },
        yearText: { fontSize: 22, fontWeight: "600", color: colors.title, minWidth: 96, textAlign: "center" },
        iconBtn: {
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255,255,255,0.14)",
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: "rgba(255,255,255,0.22)",
        },
        grid: {
          flexDirection: "row",
          flexWrap: "wrap",
          paddingHorizontal: 12,
          paddingBottom: 8,
          gap: 8,
          justifyContent: "center",
        },
        cell: {
          width: "22%",
          maxWidth: 76,
          aspectRatio: 1.15,
          borderRadius: radii.chip,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: "rgba(255,255,255,0.2)",
          backgroundColor: "rgba(255,255,255,0.08)",
        },
        cellOn: {
          backgroundColor: colors.accentSelection,
          borderColor: colors.accent,
        },
        cellLabel: { fontSize: 15, fontWeight: "500", color: colors.title },
        cellLabelOn: { color: colors.accent, fontWeight: "700" },
        toolbar: {
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingHorizontal: 16,
          paddingTop: 4,
          paddingBottom: 12,
        },
        done: { color: colors.accent, fontSize: 17, fontWeight: "700" },
      }),
    [colors, insets.bottom],
  );

  return (
    <GlassEffectContainer intensity={72} borderRadius={22} style={styles.card}>
      <View style={styles.head}>
        <VibrantText style={styles.title}>选择统计月份</VibrantText>
        <Text style={styles.subtitle}>与列表、上方汇总联动的账单月份</Text>
      </View>
      <View style={styles.yearRow}>
        <SpringPressable
          style={styles.iconBtn}
          hapticOn="pressIn"
          hapticIntensity="light"
          scaleTo={0.94}
          onPress={() => {
            setYear((y) => y - 1);
            void haptic.select();
          }}
        >
          <MaterialCommunityIcons name="chevron-left" size={26} color={colors.title} />
        </SpringPressable>
        <Text style={styles.yearText}>{year}年</Text>
        <SpringPressable
          style={styles.iconBtn}
          hapticOn="pressIn"
          hapticIntensity="light"
          scaleTo={0.94}
          onPress={() => {
            setYear((y) => y + 1);
            void haptic.select();
          }}
        >
          <MaterialCommunityIcons name="chevron-right" size={26} color={colors.title} />
        </SpringPressable>
      </View>
      <View style={styles.grid}>
        {MONTHS_ZH.map((label, idx) => {
          const on = month === idx;
          return (
            <SpringPressable
              key={label}
              style={[styles.cell, on ? styles.cellOn : null]}
              hapticOn="pressIn"
              hapticIntensity="select"
              scaleTo={0.96}
              opacityTo={0.92}
              onPress={() => {
                setMonth(idx);
                void haptic.select();
              }}
            >
              <Text style={[styles.cellLabel, on ? styles.cellLabelOn : null]}>{label}</Text>
            </SpringPressable>
          );
        })}
      </View>
      <View style={styles.toolbar}>
        <SpringPressable
          onPress={() => {
            void haptic.success();
            onCommit(new Date(year, month, 1));
          }}
          hapticOn={false}
        >
          <VibrantText style={styles.done}>完成</VibrantText>
        </SpringPressable>
      </View>
    </GlassEffectContainer>
  );
}
