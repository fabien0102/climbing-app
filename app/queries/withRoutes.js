import { graphql } from "react-apollo";
import allRoutesQuery from "./allRoutesQuery.graphql";

export default graphql(allRoutesQuery, {
  options: ({ navigation: { state: { params: { id } } }, me }) => ({
    variables: { wallId: id, userId: me.id }
  })
});
