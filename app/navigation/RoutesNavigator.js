import React from "react";
import { StackNavigator } from "react-navigation";

import WallsScreen from "../screens/WallsScreen";
import RoutesScreen from "../screens/RoutesScreen";
import RouteDetailScreen from "../screens/RouteDetailScreen";

const RoutesStack = StackNavigator({
  Walls: {
    screen: WallsScreen
  },
  Routes: {
    screen: RoutesScreen,
    navigationOptions: ({ navigation: { state: { params } } }) => ({
      title: `${params.name}`
    })
  },
  RouteDetail: {
    screen: RouteDetailScreen,
    navigationOptions: ({ navigation: { state: { params } } }) => ({
      title: `Route detail`
    })
  }
});

export default class RoutesNavigator extends React.Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return <RoutesStack />;
  }
}
