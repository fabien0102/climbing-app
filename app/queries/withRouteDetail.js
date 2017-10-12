import { graphql } from "react-apollo";
import routeDetailQuery from "./routeDetailQuery.graphql";

export default graphql(routeDetailQuery, {
  options: ({ navigation: { state: { params: { id } } }, me }) => ({
    variables: { id, userId: me.id }
  }),
  props: ({ data: { route, refetch, error, loading } }) => ({
    route: { ...route, refetch, error, loading }
  })
});
