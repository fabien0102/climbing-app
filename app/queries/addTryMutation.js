export default gql`
mutation AddTryMutation($routeId: ID, $userId: ID, $successLevel: Int!) {
  createTry(routeId: $routeId, successLevel: $successLevel, userId: $userId) {
    id
    successLevel
    createdAt
    user {
      id
    }
    route {
      id
      successRate
      averageTries
      wall {
        id
      }
    }
  }
}
`;