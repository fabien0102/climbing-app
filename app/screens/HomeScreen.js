import React from "react";
import { View, Text } from "react-native";

/**
 * Home screen
 * 
 * Some stats: 
 *  - routes dones / total routes
 *  - routes tries but not finished
 *  - max grade reach
 */
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Home"
  };

  render() {
    return (
      <View>
        <Text>HomeScreen</Text>
      </View>
    );
  }
}
