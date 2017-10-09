import { graphql } from "react-apollo";
import createUserMutation from "./createUserMutation";
import userQuery from "./userQuery";

  export default graphql(createUserMutation, {
    options: {
      fetchPolicy: "network-only",
    update: (proxy, { data: { createUser } }) => {
      proxy.writeQuery({ query: userQuery, data: createUser });
    }
  },
  props: ({ mutate }) => ({
    createUser: (idToken, pseudo) =>
      mutate({ variables: { idToken, pseudo } })
  })
});
