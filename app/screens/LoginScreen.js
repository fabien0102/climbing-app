import React from "react";
import { Container, Button, Text, H1 } from "native-base";
import qs from "qs";
import jwtDecode from "jwt-decode";
import { Linking, AsyncStorage } from "react-native";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import Servers from "../constants/Servers";
import Logo from "../components/AnimatedLogo";
import styles from "./LoginScreen.style";
import { has } from "lodash";

/**
 * Login screen
 */
export class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <Container style={styles.container}>
        <Container style={styles.logo}>
          <Logo large />
          <H1 style={styles.logoTitle}>Climbing stats</H1>
        </Container>
        <Button block primary rounded large onPress={this.onLoginPress}>
          <Text>Login</Text>
        </Button>
      </Container>
    );
  }

  componentDidMount() {
    Linking.addEventListener("url", this.onAuth0Redirect);
  }

  componentWillUpdate(nextProps) {
    const isLogged = has(nextProps, "currentUser.user.id");
    if (isLogged) nextProps.navigation.navigate("Main");
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
        const user = await this.props.currentUser.refetch();

        // user already exists
        if (user.data.user) return this.props.navigation.navigate("Main");

        // else -> createUsers
        const newUser = await this.props.createUser({
          variables: {
            idToken: res.id_token,
            pseudo: nickname
          }
        });
        await this.props.currentUser.refetch();
      } catch (err) {
        console.error(err); // TODO show error in the screen
      }
    } else if (res.error) {
      console.error(res); // TODO show error in the screen
    } else {
      console.log("Something wrong appends"); // TODO show error in the screen
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

export const createUserMutation = gql`
mutation createUser($idToken: String!, $pseudo: String!) {
  createUser(authProvider: {auth0: {idToken: $idToken}}, pseudo: $pseudo) {
    id
    auth0UserId
  }
}
`;

export const getUserQuery = gql`
query currentUser {
  user {
    id
    pseudo
  }
}
`;

export default compose(
  graphql(createUserMutation, { name: "createUser" }),
  graphql(getUserQuery, { name: "currentUser" })
)(LoginScreen);
