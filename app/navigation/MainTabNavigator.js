import React from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TabNavigator, TabBarBottom } from "react-navigation";

import Colors from "../constants/Colors";

import HomeScreen from "../screens/HomeScreen";
import RoutesNavigator from "./RoutesNavigator";

export default TabNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Routes: {
      screen: RoutesNavigator
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case "Home":
            iconName = Platform.OS === "ios"
              ? `ios-home-circle${focused ? "" : "-outline"}`
              : "md-home-circle";
            break;
          case "Routes":
            iconName = Platform.OS === "ios"
              ? `ios-map${focused ? "" : "-outline"}`
              : "md-map";
            break;
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        );
      }
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: "bottom",
    animationEnabled: false,
    swipeEnabled: false
  }
);
