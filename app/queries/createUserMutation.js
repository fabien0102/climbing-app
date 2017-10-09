export default gql`
mutation CreateUserMutation($idToken: String!, $pseudo: String!) {
  createUser(authProvider: {auth0: {idToken: $idToken}}, pseudo: $pseudo) {
    id
    pseudo
  }
}
`;
