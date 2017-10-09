import { graphql } from "react-apollo";
import addTryMutation from "./addTryMutation";
import allRoutesQuery from "./allRoutesQuery";
import routeDetailQuery from "./routeDetailQuery";
import { omit, pick } from "lodash";

const updateRouteDetailCache = (proxy, createTry) => {
  const query = {
    query: routeDetailQuery,
    variables: { id: createTry.route.id }
  };

  try {
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
  } catch (err) {
    // Cache is probably not set yet, just ignore this
  }
};

const updateAllRoutesCache = (proxy, createTry) => {
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
    if (route.id === createTry.route.id)
      route.tries.unshift(omit(createTry, "route"));
  });

  // Update cache
  proxy.writeQuery(Object.assign({}, query, { data }));
};

export default graphql(addTryMutation, {
  options: () => ({
    update: (proxy, { data: { createTry } }) => {
      updateRouteDetailCache(proxy, createTry);

      // Update this data to have checkmark on the route
      if (createTry.successLevel === 5) {
        updateAllRoutesCache(proxy, createTry);
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
