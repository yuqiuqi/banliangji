import Constants from "expo-constants";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlassSwitch, GroupedInset } from "../components/ios";
import { SpringPressable } from "../components/SpringPressable";
import { useUiPrefs } from "../context/UiPrefsContext";
import type { AppPalette } from "../theme/palette";
import { useAppTheme } from "../theme/ThemeContext";
import { iosType } from "../theme/typography";

function buildMineStyles(colors: AppPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.canvas },
    headerBanner: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 12,
      backgroundColor: colors.canvas,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
    },
    title: { ...iosType.largeTitle, color: colors.title },
    list: { paddingVertical: 12 },
    insetBlock: {
      marginBottom: 10,
    },
    cardInner: {
      padding: 16,
    },
    cardTitle: { fontSize: 17, fontWeight: "600", color: colors.title, marginBottom: 6 },
    sub: { marginTop: 8, fontSize: 14, color: colors.lightTitle, lineHeight: 20 },
    chevron: { fontSize: 14, color: colors.accent, marginTop: 4 },
    prefRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },
    prefTextCol: { flex: 1, paddingRight: 8 },
  });
}

export function MineScreen(): React.ReactElement {
  const { colors } = useAppTheme();
  const { chartMotionEnabled, setChartMotionEnabled } = useUiPrefs();
  const styles = useMemo(() => buildMineStyles(colors), [colors]);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.headerBanner}>
        <Text style={styles.title}>我的</Text>
      </View>
      <View style={styles.list}>
        <GroupedInset style={styles.insetBlock}>
          <SpringPressable
            style={styles.cardInner}
            accessibilityRole="button"
            accessibilityLabel="关于本应用"
            hapticOn="pressIn"
            hapticIntensity="light"
            onPress={() => {
              setAboutOpen((o) => !o);
            }}
          >
            <Text style={styles.cardTitle}>关于</Text>
            {aboutOpen ? (
              <View>
                <Text style={styles.sub}>半两记</Text>
                <Text style={styles.sub}>React Native · Expo · 离线本地记账</Text>
                <Text style={styles.sub}>Expo SDK {Constants.expoConfig?.sdkVersion ?? "54"}</Text>
                <Text style={styles.sub}>本应用不收集账号；记账数据仅保存在本机 SQLite 数据库中。</Text>
              </View>
            ) : (
              <Text style={styles.chevron}>点按展开</Text>
            )}
          </SpringPressable>
        </GroupedInset>

        <GroupedInset style={styles.insetBlock}>
          <SpringPressable
            style={styles.cardInner}
            accessibilityRole="button"
            accessibilityLabel="数据与存储说明"
            hapticOn="pressIn"
            hapticIntensity="light"
            onPress={() => {
              setDataOpen((o) => !o);
            }}
          >
            <Text style={styles.cardTitle}>数据与存储</Text>
            {dataOpen ? (
              <Text style={styles.sub}>
                账单与预算数据存于本机 SQLite 数据库（main.db）；仅本地存储，无云端多设备同步。卸载应用前请知悉数据将随应用数据一并清除（系统级备份不在此承诺）。
              </Text>
            ) : (
              <Text style={styles.chevron}>点按了解本机存储</Text>
            )}
          </SpringPressable>
        </GroupedInset>

        <GroupedInset style={styles.insetBlock}>
          <View style={[styles.cardInner, styles.prefRow]}>
            <View style={styles.prefTextCol}>
              <Text style={styles.cardTitle}>图表持机透视</Text>
              <Text style={styles.sub}>
                开启后，图表页柱形随设备倾斜轻微变化透视（本地传感器，不上传）。可在「减少动态效果」系统设置下自动关闭动效。
              </Text>
            </View>
            <GlassSwitch
              value={chartMotionEnabled}
              onValueChange={setChartMotionEnabled}
              accessibilityLabel="图表持机透视"
            />
          </View>
        </GroupedInset>

        <GroupedInset style={styles.insetBlock}>
          <SpringPressable
            style={styles.cardInner}
            accessibilityRole="button"
            accessibilityLabel="设置"
            hapticOn="pressIn"
            hapticIntensity="light"
            onPress={() => {
              // 占位，后续可接主题/语言等
            }}
          >
            <Text style={styles.cardTitle}>设置</Text>
            <Text style={styles.sub}>更多偏好与选项将在后续版本提供。</Text>
          </SpringPressable>
        </GroupedInset>
      </View>
    </SafeAreaView>
  );
}
