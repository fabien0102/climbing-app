import React from "react";
import {
  Content,
  Text,
  Card,
  CardItem,
  Body,
  Button,
  Icon,
  Left,
  Right,
  View,
  ActionSheet
} from "native-base";
import { StyleSheet } from "react-native";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import RouteIcon from "../components/RouteIcon";
import Loading from "../components/Loading";
import { getUserQuery } from "../screens/LoginScreen";
import { round } from "lodash";

const cancelButtonIndex = 6;

/**
 * Route detail screen
 * 
 * Information of the route
 * - Tries history
 * - Global stats of the route
 * - Button to add a try
 */
export class RouteDetailScreen extends React.Component {
  getStarsString = stars => "★".repeat(stars) + "☆".repeat(5 - stars);

  onAddTryPress = () => {
    ActionSheet.show(
      {
        options: [...Array(6)]
          .map((val, i) => this.getStarsString(i))
          .concat("Cancel"),
        cancelButtonIndex,
        title: "Success rate"
      },
      buttonIndex => {
        if (buttonIndex === cancelButtonIndex) return;
        this.props
          .addTryMutation({
            variables: {
              successLevel: buttonIndex,
              userId: this.props.currentUser.user.id,
              routeId: this.props.data.Route.id
            }
          })
          .then(() => this.props.data.refetch());
      }
    );
  };

  renderPart(title, value) {
    return (
      <View>
        <CardItem header style={style.header}>
          <Text>{title}</Text>
        </CardItem>
        <CardItem>
          <Text>{value}</Text>
        </CardItem>
      </View>
    );
  }

  render() {
    if (this.props.data.loading) {
      return <Loading />;
    } else if (this.props.data.error) {
      return <Text>{this.props.data.error.message}</Text>;
    }

    const route = this.props.data.Route;
    const { wallName } = this.props.navigation.state.params;

    return (
      <Content>
        <Card>
          <CardItem>
            <Left>
              <RouteIcon color={route.color} grade={route.grade} />
              <Body>
                <Text>{wallName}</Text>
                <Text note>{`level ${route.grade} - ${route.color}`}</Text>
              </Body>
            </Left>
            <Right>
              <Button transparent onPress={this.onAddTryPress}>
                <Icon name="add" />
                <Text>Add a try</Text>
              </Button>
            </Right>
          </CardItem>
          {this.renderPart("Created at", route.createdAt.split("T")[0])}
          {this.renderPart("Success rate", round(route.successRate * 100, 2) + "%")}
          {this.renderPart("Average tries", route.averageTries)}
          <CardItem header style={style.header}>
            <Text>Tries</Text>
          </CardItem>
          {route.tries.length === 0
            ? <CardItem>
                <Text>No try bro!</Text>
              </CardItem>
            : route.tries.map(t => (
                <CardItem key={t.id}>
                  <Left>
                    <Text>{t.createdAt.split("T")[0]}</Text>
                  </Left>
                  <Right>
                    <Text>- {this.getStarsString(t.successLevel)}</Text>
                  </Right>
                </CardItem>
              ))}
        </Card>

      </Content>
    );
  }
}

const style = StyleSheet.create({
  header: {
    backgroundColor: "#fbfbfb",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ededed"
  }
});

const routeDetailQuery = gql`
query ($id: ID!) {
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

const addTryMutation = gql`
mutation ($routeId: ID, $userId: ID, $successLevel: Int!) {
  createTry(routeId: $routeId, successLevel: $successLevel, userId: $userId) {
    id
  }
}
`;

export default compose(
  graphql(routeDetailQuery, {
    options: ({ navigation: { state: { params: { id } } } }) => ({
      variables: { id }
    })
  }),
  graphql(addTryMutation, { name: "addTryMutation" }),
  graphql(getUserQuery, { name: "currentUser" })
)(RouteDetailScreen);
