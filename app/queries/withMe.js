import { graphql } from "react-apollo";
import userQuery from "./userQuery.graphql";

export default graphql(userQuery, {
  options: {
    fetchPolicy: "network-only"
  },
  props: ({ data: { user, refetch } }) => ({
    me: { ...user, refetch }
  })
});
