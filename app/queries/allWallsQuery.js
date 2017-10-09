export default gql`
query AllWallsQuery {
  allWalls(orderBy: name_ASC) {
    id
    name
  }
}
`;
