import * as _ from "lodash";
import * as moment from "moment";
import { fromEvent, FunctionEvent } from "graphcool-lib";

export const getStats = tries => {
  const triesBeforeSuccessByUser = _(tries).groupBy("user.id").map(i => {
    const successfulTries = i
      .sort((a, b) => (moment(a).isBefore(b) ? 1 : -1))
      .find(j => j.successLevel === 5);

    const firstSuccess = _.get(successfulTries, "createdAt", null);

    return firstSuccess
      ? i.filter(a => moment(a.createdAt).isBefore(firstSuccess)).length + 1
      : 0;
  });

  const successUsers = triesBeforeSuccessByUser.filter(a => a > 0);
  const averageTries = successUsers.sum() / successUsers.size();
  const successRate = _.round(
    successUsers.size() / triesBeforeSuccessByUser.size(),
    2
  );

  return { averageTries, successRate };
};

export default async (event: FunctionEvent<any>) => {
  try {

    const lib = fromEvent(event);
    const client = lib.api("simple/v1");
    const { tries, id } = event.data.Try.node.route;
    const stats = getStats(tries);

    console.log(
      `
    routeID: ${id}
      - successRate: ${stats.successRate}
      - averageSuccess: ${stats.averageTries}
    `
    );

    const data = await client.request(
      `
      mutation($id: ID!, $successRate: Float!, $averageTries: Float!){
        updateRoute(id: $id, successRate: $successRate, averageTries: $averageTries) {
          id
        }
      }
    `,
      { id, ...stats }
    );

    return { data }
  } catch (err) {
    console.log(err);
    return { error: "An unexpected error occured during update route stats" }
  }
};
