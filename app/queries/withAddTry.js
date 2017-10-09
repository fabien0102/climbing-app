import { graphql } from "react-apollo";
import addTryMutation from "./addTryMutation.graphql";
import allRoutesQuery from "./allRoutesQuery.graphql";
import routeDetailQuery from "./routeDetailQuery.graphql";
import { omit, pick } from "lodash";

const updateRouteDetailCache = (proxy, id, createTry) => {
  const query = {
    query: routeDetailQuery,
    variables: { id }
  };
  
  // Get cached data
  let data = proxy.readQuery(query);

  // Mutate with received data
  if (createTry.route.averageTries >= 0) {
    Object.assign(
      data.Route,
      pick(createTry.route, ["successRate", "averageTries"])
    );
  }
  data.Route.tries.unshift(omit(createTry, "route"));

  // Update cache
  proxy.writeQuery(Object.assign({}, query, { data }));
};

const updateAllRoutesCache = (proxy, id, createTry) => {
  const query = {
    query: allRoutesQuery,
    variables: {
      wallId: createTry.route.wall.id,
      userId: createTry.user.id
    }
  };

  // Get cached data
  let data = proxy.readQuery(query);
  
  // Add try to current route (mutation)
  data.allRoutes.forEach(route => {
    if (route.id === id) route.tries.unshift(omit(createTry, "route"));
  });

  // Update cache
  proxy.writeQuery(Object.assign({}, query, { data }));
};

export default graphql(addTryMutation, {
  options: ({ navigation: { state: { params: { id } } } }) => ({
    update: (proxy, { data: { createTry } }) => {
      updateRouteDetailCache(proxy, id, createTry);

      // Update this data to have checkmark on the route
      if (createTry.successLevel === 5) {
        updateAllRoutesCache(proxy, id, createTry);
      }
    }
  }),
  props: ({ mutate }) => ({
    addTry: ({ successLevel, userId, routeId, wallId }) =>
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
              id: routeId,
              averageTries: -1,
              successRate: -1,
              wall: {
                __typename: "Wall",
                id: wallId
              }
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
