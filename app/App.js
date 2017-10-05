import React from "react";
import { Root } from "native-base";
import {
  AsyncStorage,
  Platform,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import { AppLoading, Asset, Font } from "expo";
import { Ionicons } from "@expo/vector-icons";
import { set } from "lodash";
import Servers from "./constants/Servers";
import ApolloClient, { createNetworkInterface } from "apollo-client";
import { ApolloProvider } from "react-apollo";

import RootNavigation from "./navigation/RootNavigation";

const networkInterface = createNetworkInterface({
  uri: Servers.graphql.uri
});

networkInterface.use([
  {
    applyMiddleware(req, next) {
      AsyncStorage.getItem("token").then(
        encodedToken => {
          set(req.options, "headers.authorization", `Bearer ${encodedToken}`);
          next();
        },
        failure => {
          console.error("ERROR: no token", failure);
          next();
        }
      );
    }
  }
]);

const client = new ApolloClient({
  networkInterface,
  dataIdFromObject: o => o.id
});

export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <ApolloProvider client={client}>
          <Root>
            <View style={styles.container}>
              {Platform.OS === "ios" && <StatusBar barStyle="default" />}
              {Platform.OS === "android" &&
                <View style={styles.statusBarUnderlay} />}
              <RootNavigation />
            </View>
          </Root>
        </ApolloProvider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Font.loadAsync([
        // This is the font that we are using for our tab bar
        Ionicons.font
      ])
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: "rgba(0,0,0,0.2)"
  }
});
