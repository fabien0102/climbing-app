import { graphql } from "react-apollo";
import allTriesQuery from "./allTriesQuery.graphql";

// TODO
export const getSuccessRates = tries => {
  return [
    { label: "yellow", grade: 3, rate: 1 },
    { label: "green",  grade: 5, rate: 0.8 },
    { label: "blue",   grade: 6, rate: 0.7 },
    { label: "red",    grade: 7, rate: 0 }
  ];
};

export const getFlashCount = tries => {
  return 10;
}

export const getAfterWorkCount = tries => {
  return 20;
}

export const getNotFinishedCount = tries => {
  return 0;
}

export default graphql(allTriesQuery, {
  props: ({ data: { refetch, allTries, loading, error } }) => ({
    triesStats: {
      refetch,
      loading,
      error,
      successRates: getSuccessRates(allTries),
      flashCount: getFlashCount(allTries),
      afterWorkCount: getAfterWorkCount(allTries),
      notFinishedCount: getNotFinishedCount(allTries)
    }
  })
});
