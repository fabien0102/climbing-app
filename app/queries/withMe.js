import { graphql } from "react-apollo";
import userQuery from "./userQuery.graphql";

export default graphql(userQuery, {
  props: ({ data: { user, refetch } }) => ({
    me: { ...user, refetch }
  })
});
