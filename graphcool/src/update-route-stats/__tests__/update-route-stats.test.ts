import { getStats } from "../update-route-stats";
import "jest";
import data from "./data";

describe("update-route-stats", () => {
  describe("getStats", () => {
    it("should return current stats of the route", () => {
      const expected = {
        averageTries: 1,
        successRate: 1
      };
      expect(getStats(data.data.Try.node.route.tries)).toEqual(expected);
    });
  });
});
