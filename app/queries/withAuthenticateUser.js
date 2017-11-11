import { graphql } from "react-apollo";
import authenticateUserMutation from "./authenticateUserMutation.graphql";
// import userQuery from "./userQuery.graphql";

export default graphql(authenticateUserMutation, {
  options: {
    fetchPolicy: "network-only",
    // update: (proxy, { data: { createUser } }) => {
    //   proxy.writeQuery({ query: userQuery, data: { user: createUser } });
    // }
  },
  props: ({ mutate }) => ({
    authenticateUser: (accessToken) =>
      mutate({ variables: { accessToken } })
  })
});
