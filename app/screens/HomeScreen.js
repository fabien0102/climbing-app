import React from "react";
import { View, Text } from "react-native";
import { getUserQuery } from "./LoginScreen";
import { graphql } from "react-apollo";

/**
 * Home screen
 * 
 * Some stats: 
 *  - routes dones / total routes
 *  - routes tries but not finished
 *  - max grade reach
 */
export class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Home"
  };

  render() {
    console.log(this.props);
    return (
      <View>
        <Text>HomeScreen</Text>
        <Text>Welcome {this.props.me.user.pseudo}</Text>
      </View>
    );
  }
}

export default graphql(getUserQuery, { name: "me" })(HomeScreen);
