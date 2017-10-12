import { graphql } from "react-apollo";
import routesStatsQuery from "./routesStatsQuery.graphql";
import _ from "lodash";

// TODO
export const getStats = routes => {
  return _(routes)
    .groupBy("grade")
    .map((r, grade) => ({
      grade,
      total: r.length,
      finished: r.filter(i => _.map(i.tries, "successLevel").includes(5))
        .length,
      flashed: r.filter(i => _.map(i.tries, "successLevel")[0] === 5).length,
      afterWork: r.filter(
        i =>
          _.map(i.tries, "successLevel").includes(5) &&
          _.map(i.tries, "successLevel")[0] !== 5
      ).length,
      notFinished: r.filter(
        i => !_.map(i.tries, "successLevel").includes(5) && i.tries.length > 0
      ).length
    }))
    .value();
};

export default graphql(routesStatsQuery, {
  props: ({ data: { refetch, routes, loading, error } }) => {
    const stats = getStats(routes);

    return {
      routesStats: {
        refetch,
        loading,
        error,
        total,
        perGrade: stats,
        flashCount: _.sumBy(stats, "flashed"),
        afterWorkCount: _.sumBy(stats, "afterWork"),
        notFinishedCount: _.sumBy(stats, "notFinished")
      }
    };
  }
});
