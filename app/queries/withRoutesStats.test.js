import { getStats } from "./withRoutesStats";
import _ from "lodash";

const { data: { routes } } = require("./__tests__/routesStatsData.json");

describe("withRoutesStats", () => {
  describe("getStats", () => {
    it("should return correct value", () => {
      expect(getStats(routes)).toMatchSnapshot();
    });

    it("should return the total", () => {
      const stats = getStats(routes);
      const total = _.sumBy(stats, "total");
      expect(total).toBe(259);
    });
  });
});
