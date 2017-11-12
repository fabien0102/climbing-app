import React from "react";
import { AuthSession } from "expo";
import { Container, Button, Text, H1 } from "native-base";
import qs from "qs";
import jwtDecode from "jwt-decode";
import { AsyncStorage, Alert } from "react-native";
import { graphql, compose, withApollo } from "react-apollo";
import Servers from "../constants/Servers";
import Logo from "../components/AnimatedLogo";
import styles from "./LoginScreen.style";
import { has } from "lodash";
import withAuthenticateUser from "../queries/withAuthenticateUser";
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

  componentWillUpdate(nextProps) {
    const isLogged = has(nextProps, "me.id");
    const isOnScreen = nextProps.navigation.state.routeName === "Login";
    if (isLogged && isOnScreen) nextProps.navigation.navigate("Main");
  }

  handleParams = async res => {
    if (res.error || !res.access_token) {
      Alert.alert(
        "Error",
        res.error_description || "something went wrong while logging in"
      );
      return;
    }

    try {
      const {
        data: { authenticateUser: { token } }
      } = await this.props.authenticateUser(res.access_token);
      await AsyncStorage.setItem("token", `Bearer ${token}`);
      await this.props.me.refetch();
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  onLoginPress = async () => {
    const redirectUrl = AuthSession.getRedirectUrl();
    const result = await AuthSession.startAsync({
      authUrl: `${Servers.auth0.domain}/authorize?${qs.stringify({
        client_id: Servers.auth0.clientId,
        audience: Servers.auth0.audience,
        response_type: "token",
        scope: "openid email profile",
        nonce: await this.getNonce(),
        redirect_uri: redirectUrl
      })}`
    });

    if (result.type === "success") return this.handleParams(result.params);
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

export default withApollo(compose(withAuthenticateUser, withMe)(LoginScreen));
