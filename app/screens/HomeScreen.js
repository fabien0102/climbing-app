import React from "react";
import { View, Text } from "react-native";
import { graphql } from "react-apollo";
import withMe from "../queries/withMe";

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
    return (
      <View>
        <Text>HomeScreen</Text>
        <Text>Welcome {this.props.me.pseudo}</Text>
      </View>
    );
  }
}

export default withMe(HomeScreen);
