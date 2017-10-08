import { graphql } from "react-apollo";
import routeDetailQuery from "./routeDetailQuery.graphql";

export default graphql(routeDetailQuery, {
  options: ({ navigation: { state: { params: { id } } } }) => ({
    variables: { id }
  })
});
