import React from "react";
import { View, Text } from "react-native";

/**
 * Login screen
 */
export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <View>
        <Text>LoginScreen</Text>
      </View>
    );
  }
}
