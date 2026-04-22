import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { iosSemantic } from "./src/theme/colors";

const MAX_APP_WIDTH = 720;

export default function App(): React.ReactElement {
  return (
    <>
      <View style={{ flex: 1, alignItems: "center", backgroundColor: iosSemantic.groupedBackground }}>
        <View style={{ flex: 1, width: "100%", maxWidth: MAX_APP_WIDTH }}>
          <RootNavigator />
        </View>
      </View>
      <StatusBar style="dark" />
    </>
  );
}
