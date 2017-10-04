import Expo from "expo";

export default {
  graphql: {
    uri: "https://api.graph.cool/simple/v1/cj7bvwftj21oz0103sv2hrsmg",
    ws: "wss://subscriptions.graph.cool/v1/cj7bvwftj21oz0103sv2hrsmg"
  },
  auth0: {
    domain: "https://climbstat.eu.auth0.com",
    clientId: "EzuV19lFl-VRtKpV3AQGq45wyAhUsQ_Q"
  },
  expo: {
    redirectUri: Expo.Constants.manifest.xde
      ? "exp://se-x64.fabien0102.app.exp.direct/+/redirect"
      : `${Expo.Constants.linkingUri}/redirect`
  }
};
