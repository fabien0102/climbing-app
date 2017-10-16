import { graphql } from "react-apollo";
import routesStatsQuery from "./routesStatsQuery.graphql";
import _ from "lodash";
import { startOfWeek, endOfWeek } from "date-fns";

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
  options: ({ me: { id } }) => {
    const today = new Date();
    const startDate = startOfWeek(today).toISOString();
    const endDate = endOfWeek(today).toISOString();
    return {
      variables: { userId: id, startDate, endDate, null: null }
    };
  },
  props: ({ data: { refetch, routes, loading, error } }) => {
    const stats = getStats(routes);

    return {
      routesStats: {
        refetch,
        loading,
        error,
        perGrade: stats,
        total: _.sumBy(stats, "total"),
        flash: _.sumBy(stats, "flashed"),
        afterWork: _.sumBy(stats, "afterWork"),
        notFinished: _.sumBy(stats, "notFinished")
      }
    };
  }
});
