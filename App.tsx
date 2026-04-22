import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { ThemeProvider, useAppTheme } from "./src/theme/ThemeContext";

const MAX_APP_WIDTH = 720;

function AppShell(): React.ReactElement {
  const { colors, colorScheme } = useAppTheme();
  return (
    <>
      <View style={{ flex: 1, alignItems: "center", backgroundColor: colors.canvas }}>
        <View style={{ flex: 1, width: "100%", maxWidth: MAX_APP_WIDTH }}>
          <RootNavigator />
        </View>
      </View>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </>
  );
}

export default function App(): React.ReactElement {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
