import React from "react";
import { View, Text } from "react-native";

/**
 * Walls screen
 * 
 * List of walls
 */
export default class WallsScreen extends React.Component {
  static navigationOptions = {
    title: "Walls"
  };
  render() {
    return (
      <View>
        <Text>WallsScreen</Text>
      </View>
    );
  }
}
