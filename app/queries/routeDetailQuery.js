export default gql`
query RouteDetailQuery($id: ID!) {
  Route(id: $id) {
    id
    createdAt
    color
    grade
    successRate
    averageTries
    tries(orderBy: createdAt_DESC) {
      id
      successLevel
      createdAt
      user {
        id
      }
    }
  }
}
`;