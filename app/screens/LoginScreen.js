import React from "react";
import { Container, Button, Text, H1 } from "native-base";
import qs from "qs";
import jwtDecode from "jwt-decode";
import { Linking, AsyncStorage, Alert } from "react-native";
import { graphql, compose, withApollo } from "react-apollo";
import gql from "graphql-tag";
import Servers from "../constants/Servers";
import Logo from "../components/AnimatedLogo";
import styles from "./LoginScreen.style";
import { has } from "lodash";
import withCreateUser from "../queries/withCreateUser";
import withMe from "../queries/withMe";

/**
 * Login screen
 */
export class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  render() {
    const isLogged = has(this.props, "me.id");

    return (
      <Container style={styles.container}>
        <Container style={styles.logo}>
          <Logo large />
          <H1 style={styles.logoTitle}>Climbing stats</H1>
        </Container>
        {isLogged
          ? <Container style={styles.logoutContainer}>
              <Button block danger rounded large onPress={this.onLogoutPress}>
                <Text>Logout</Text>
              </Button>
              <Button
                block
                primary
                rounded
                large
                onPress={this.onBackToHomePress}
              >
                <Text>Go back to home</Text>
              </Button>
            </Container>
          : <Button block primary rounded large onPress={this.onLoginPress}>
              <Text>Login</Text>
            </Button>}
      </Container>
    );
  }

  componentDidMount() {
    Linking.addEventListener("url", this.onAuth0Redirect);
  }

  componentWillUpdate(nextProps) {
    const isLogged = has(nextProps, "me.id");
    const isOnScreen = nextProps.navigation.state.routeName === "Login";
    if (isLogged && isOnScreen) nextProps.navigation.navigate("Main");
  }

  onAuth0Redirect = async event => {
    if (!event.url.includes("+/redirect")) return;

    Expo.WebBrowser.dismissBrowser();
    const [, queryString] = event.url.split("#");
    const res = qs.parse(queryString);

    if (res.id_token) {
      try {
        const { nickname } = jwtDecode(res.id_token);
        await AsyncStorage.setItem("token", res.id_token);

        // refetch user
        const user = await this.props.me.refetch();
        console.log(user);

        // user already exists
        if (user.data.user) return;

        // else -> createUsers
        const newUser = await this.props.createUser(res.id_token, nickname);
      } catch (err) {
        Alert("Error", err);
      }
    } else if (res.error) {
      Alert("Error", res.error);
    } else {
      Alert("Error", "Something wrong appends");
    }
  };

  onLoginPress = async () => {
    const redirectUrl = `${Servers.auth0.domain}/authorize?${qs.stringify({
      client_id: Servers.auth0.clientId,
      response_type: "id_token",
      scope: "openid profile",
      nonce: await this.getNonce(),
      redirect_uri: Servers.expo.redirectUri,
      state: Servers.expo.redirectUri
    })}`;

    Expo.WebBrowser.openBrowserAsync(redirectUrl);
  };

  onLogoutPress = async () => {
    await AsyncStorage.clear();
    await this.props.client.resetStore();
  };

  onBackToHomePress = () => {
    this.props.navigation.navigate("Main");
  };

  /**
   * Generate a cryptographically random nonce.
   * @param {Number} length
   */
  generateRandomString = length => {
    const charset =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~";
    return [...Array(length)]
      .map(() => charset.charAt(Math.floor(Math.random() * charset.length)))
      .join("");
  };

  /**
   * Get nonce.
   * 
   * Generate if not exists else just return the stocked value.
   */
  getNonce = async () => {
    let nonce = await AsyncStorage.getItem("nonce");
    if (!nonce) {
      nonce = this.generateRandomString(16);
      await AsyncStorage.setItem("nonce", nonce);
    }
    return nonce;
  };
}

export default withApollo(compose(withCreateUser, withMe)(LoginScreen));
