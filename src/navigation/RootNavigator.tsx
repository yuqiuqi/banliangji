import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  createBottomTabNavigator,
  type BottomTabBarButtonProps,
} from "@react-navigation/bottom-tabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PlatformPressable } from "@react-navigation/elements";
import { BlurView } from "expo-blur";
import React from "react";
import { Platform, StyleSheet, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BillsRefreshProvider } from "../context/BillsRefreshContext";
import { AssetScreen } from "../screens/AssetScreen";
import { BillDetailScreen } from "../screens/BillDetailScreen";
import { BillQueryScreen } from "../screens/BillQueryScreen";
import { BudgetScreen } from "../screens/BudgetScreen";
import { CalendarScreen } from "../screens/CalendarScreen";
import { ChartScreen } from "../screens/ChartScreen";
import { CreateBillScreen } from "../screens/CreateBillScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { MineScreen } from "../screens/MineScreen";
import { colors } from "../theme/colors";
import { pressedOpacity } from "../theme/layout";
import type { HomeStackParamList, RootTabParamList } from "./types";

/** Tab bar press feedback — `PlatformPressable` is built on RN `Pressable`; uses theme `pressedOpacity`. */
function IOSChromeTabBarButton(props: BottomTabBarButtonProps): React.ReactElement {
  return <PlatformPressable {...props} pressOpacity={pressedOpacity} />;
}

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.canvas,
    primary: colors.accent,
    card: colors.surface,
    border: colors.body,
    text: colors.title,
  },
};

function HomeStackNavigator(): React.ReactElement {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.main },
        headerTintColor: colors.onMain,
        headerTitleStyle: { color: colors.onMain },
        contentStyle: { backgroundColor: colors.canvas },
      }}
    >
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          title: "明细",
          headerShadowVisible: true,
        }}
      />
      <HomeStack.Screen
        name="BillQuery"
        component={BillQueryScreen}
        options={{ title: "账单", headerShadowVisible: true }}
      />
      <HomeStack.Screen
        name="BillDetail"
        component={BillDetailScreen}
        options={{ title: "账单详情", headerShadowVisible: true }}
      />
      <HomeStack.Group
        screenOptions={{
          presentation: "modal",
          headerStyle: { backgroundColor: colors.main },
          headerTintColor: colors.onMain,
          headerTitleStyle: { color: colors.onMain },
        }}
      >
        <HomeStack.Screen name="CreateBill" component={CreateBillScreen} options={{ title: "记一笔" }} />
        <HomeStack.Screen name="Calendar" component={CalendarScreen} options={{ title: "日历" }} />
      </HomeStack.Group>
    </HomeStack.Navigator>
  );
}

function Tabs(): React.ReactElement {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarBackground:
          Platform.OS === "ios"
            ? () => <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
            : undefined,
        tabBarStyle: {
          backgroundColor: Platform.OS === "ios" ? "transparent" : "#F9F9F9",
          borderTopColor: "rgba(60, 60, 67, 0.29)",
          borderTopWidth: StyleSheet.hairlineWidth,
          paddingTop: 4,
        },
        tabBarLabel: ({ focused, color, children }) => (
          <Text
            style={{
              color,
              fontSize: 11,
              fontWeight: focused ? "700" : "500",
              letterSpacing: focused ? 0.2 : 0,
            }}
          >
            {children}
          </Text>
        ),
        tabBarIconStyle: { marginBottom: 0 },
        tabBarButton: (props) => <IOSChromeTabBarButton {...props} />,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: "明细",
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons name="receipt" color={color} size={focused ? size + 4 : size} />
          ),
        }}
      />
      <Tab.Screen
        name="ChartTab"
        component={ChartScreen}
        options={{
          title: "图表",
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons name="chart-arc" color={color} size={focused ? size + 4 : size} />
          ),
        }}
      />
      <Tab.Screen
        name="BudgetTab"
        component={BudgetScreen}
        options={{
          title: "预算",
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons name="chart-pie" color={color} size={focused ? size + 4 : size} />
          ),
        }}
      />
      <Tab.Screen
        name="AssetTab"
        component={AssetScreen}
        options={{
          title: "资产",
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons name="wallet" color={color} size={focused ? size + 4 : size} />
          ),
        }}
      />
      <Tab.Screen
        name="MineTab"
        component={MineScreen}
        options={{
          title: "我的",
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons name="account-circle" color={color} size={focused ? size + 4 : size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator(): React.ReactElement {
  return (
    <SafeAreaProvider>
      <BillsRefreshProvider>
        <NavigationContainer theme={navTheme}>
          <Tabs />
        </NavigationContainer>
      </BillsRefreshProvider>
    </SafeAreaProvider>
  );
}
