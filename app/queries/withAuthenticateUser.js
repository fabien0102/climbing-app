import { graphql } from "react-apollo";
import authenticateUserMutation from "./authenticateUserMutation.graphql";

export default graphql(authenticateUserMutation, {
  options: {
    fetchPolicy: "network-only"
  },
  props: ({ mutate }) => ({
    authenticateUser: (accessToken) =>
      mutate({ variables: { accessToken } })
  })
});
