export default gql`
query AllRoutesQuery($wallId: ID!, $userId: ID!) {
  allRoutes(orderBy: grade_ASC, filter: {wall: {id: $wallId}}) {
    id
    color
    grade
    successRate
    averageTries
    tries (filter: {user: {id: $userId}}) {
      successLevel
    }
  }
}
`;