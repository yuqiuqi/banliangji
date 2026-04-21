import Constants from "expo-constants";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { hairlineBorder, radii, shadows } from "../theme/layout";

export function MineScreen(): React.ReactElement {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>我的</Text>
      </View>
      <Pressable
        style={({ pressed }) => [styles.card, pressed ? { opacity: 0.96 } : null]}
        accessibilityRole="button"
        accessibilityLabel="关于本应用"
        onPress={() => {}}
      >
        <Text style={styles.row}>SwiftCost RN</Text>
        <Text style={styles.sub}>复刻自 GitHub IANIx/SwiftCost</Text>
        <Text style={styles.sub}>Expo SDK {Constants.expoConfig?.sdkVersion ?? "54"}</Text>
        <Text style={styles.sub}>本地 SQLite 记账 · TypeScript 强类型</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  header: {
    padding: 16,
    backgroundColor: colors.main,
  },
  title: { fontSize: 20, fontWeight: "600", color: colors.title },
  card: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: radii.card,
    ...hairlineBorder,
    ...shadows.card,
  },
  row: { fontSize: 17, fontWeight: "600", color: colors.title },
  sub: { marginTop: 8, fontSize: 14, color: colors.lightTitle },
});
