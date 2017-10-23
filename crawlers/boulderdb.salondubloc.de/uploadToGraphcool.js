const _ = require("lodash");
const { GraphQLClient } = require("graphql-request");
const { promisify } = require("util");
const parallelLimit = promisify(require("async").parallelLimit);

module.exports = async (routes, endpoint, token) => {
  const walls = _(routes).map(a => a.name).uniq().value();

  // Set graphQL client
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const client = new GraphQLClient(endpoint, { headers });

  // Retrieve Flashh gym (create if not exists)
  const { allGyms } = await client.request(
    `
  {
    allGyms(filter: {name: "Flashh"}) {
      id
    }
  }`
  );

  let gymId;
  if (allGyms.length > 0) {
    gymId = allGyms[0].id;
  } else {
    const { flashh } = await client.request(
      `
    mutation {
      flashh: createGym(city: "Hamburg", country: "Germany", name: "Flashh") {
        id
      }
    }
    `
    );
    gymId = flashh.id;
  }

  const createWallQuery = `
    mutation ($name: String!) {
      wall: createWall(name: $name, gymId: "${gymId}") {
        id
        name
      }
    }
    `;

  const createRouteQuery = `
    mutation ($color: String!, $grade: String!, $wallId: ID, $openedAt: DateTime!) {
      route: createRoute(color: $color, grade: $grade, wallId: $wallId, openedAt: $openedAt) {
        id
      }
    }
    `;

  const createWall = name => async () => {
    const result = await client.request(createWallQuery, { name });
    return result.wall;
  };

  const createRoute = route => async () => {
    const result = await client.request(createRouteQuery, route);
    return result.route;
  };

  const wallsCreated = await parallelLimit(walls.map(createWall), 10);
  const toDate = input => {
    const [day, month, year] = input.split(".");
    return new Date(+year, month - 1, +day);
  };
  const routesCreated = await parallelLimit(
    routes
      .map(({ grade, name, color, openedAt }) => ({
        grade: grade.toString(),
        color,
        wallId: wallsCreated.find(w => w.name === name).id,
        openedAt: toDate(openedAt)
      }))
      .map(createRoute),
    10
  );

  return { wallsCreated, routesCreated };
};
