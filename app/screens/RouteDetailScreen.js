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
  Spinner,
  ActionSheet
} from "native-base";
import { StyleSheet, RefreshControl } from "react-native";
import { graphql, compose } from "react-apollo";
import { getStarsString } from "../utils";
import RouteIcon from "../components/RouteIcon";
import Loading from "../components/Loading";
import Try from "../components/Try";
import { round, omit } from "lodash";
import withMe from "../queries/withMe";
import withRouteDetail from "../queries/withRouteDetail";
import withAddTry from "../queries/withAddTry";

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
  state = {
    refreshing: false
  };

  onAddTryPress = () => {
    ActionSheet.show(
      {
        options: [...Array(6)]
          .map((val, i) => getStarsString(i))
          .concat("Cancel"),
        cancelButtonIndex,
        title: "Success rate"
      },
      buttonIndex => {
        if (buttonIndex === cancelButtonIndex) return;
        this.props.addTry({
          successLevel: buttonIndex,
          userId: this.props.me.id,
          routeId: this.props.data.Route.id,
          wallId: this.props.navigation.state.params.wallId
        });
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
      <Content
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
      >
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
          {this.renderPart(
            "Success rate",
            round(route.successRate * 100, 2) + "%"
          )}
          {this.renderPart("Average tries", route.averageTries)}
          <CardItem header style={style.header}>
            <Text>Tries</Text>
          </CardItem>
          {route.tries.length === 0
            ? <CardItem>
                <Text>No try bro!</Text>
              </CardItem>
            : route.tries.map((t, i, arr) => (
                <Try key={arr.length - i} try={t} />
              ))}
        </Card>

      </Content>
    );
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.props.data.refetch();
    this.setState({ refreshing: false });
  };
}

const style = StyleSheet.create({
  header: {
    backgroundColor: "#fbfbfb",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ededed"
  }
});

export default compose(withMe, withRouteDetail, withAddTry)(RouteDetailScreen);
