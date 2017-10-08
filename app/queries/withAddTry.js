import { graphql } from "react-apollo";
import addTryMutation from "./addTryMutation.graphql";
import routeDetailQuery from "./routeDetailQuery.graphql";
import { omit } from "lodash";

const updateRouteDetailQuery = (proxy, id, createTry) => {
  // Get cached data
  let routeDetailData = proxy.readQuery({
    query: routeDetailQuery,
    variables: { id }
  });
  // Mutate with received data
  if (createTry.route.averageTries >= 0) {
    Object.assign(routeDetailData.Route, createTry.route);
  }
  routeDetailData.Route.tries.unshift(omit(createTry, "route"));
  // Update cache
  proxy.writeQuery({
    query: routeDetailQuery,
    variables: { id },
    data: routeDetailData
  });
};

export default graphql(addTryMutation, {
  options: ({ navigation: { state: { params: { id } } } }) => ({
    update: (proxy, { data: { createTry } }) => {
      updateRouteDetailQuery(proxy, id, createTry);

      // TODO update route if success level is 5
    }
  }),
  props: ({ mutate }) => ({
    addTry: ({ successLevel, userId, routeId }) =>
      mutate({
        variables: { successLevel, userId, routeId },
        optimisticResponse: {
          __typename: "Mutation",
          createTry: {
            __typename: "Try",
            createdAt: new Date().toISOString(),
            id: -1,
            route: {
              __typename: "Route",
              averageTries: -1,
              successRate: -1
            },
            successLevel,
            user: {
              __typename: "User",
              id: userId
            }
          }
        }
      })
  })
});
