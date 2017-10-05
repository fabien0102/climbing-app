import React from "react";
import { ListView, RefreshControl } from "react-native";
import AnimatedLogo from "../components/Loading";
import {
  List,
  ListItem,
  Text,
  Left,
  Right,
  Body,
  Button,
  Icon,
  Container,
  Toast
} from "native-base";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import RouteIcon from "../components/RouteIcon";
import styles from "./RoutesScreen.style";

/**
 * Routes screen
 * 
 * Routes list of selected wall
 */
export class RoutesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  render() {
    if (this.props.data.loading) {
      return <AnimatedLogo />;
    } else if (this.props.data.error) {
      return <Text>{this.props.data.error.message}</Text>;
    }
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.id !== r2.id
    });
    const data = ds.cloneWithRows(this.props.data.allRoutes);

    return (
      <List
        style={styles.list}
        refreshControl={
          <RefreshControl
            tintColor="#FF9900"
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
        dataSource={data}
        renderRow={route => (
          <ListItem onPress={() => this.onRoutePress(route)}>
            <Left style={styles.leftIcon}>
              <RouteIcon color={route.color} grade={route.grade} size="small" />
            </Left>
            <Body>
              <Text>{route.color} - level {route.grade}</Text>
            </Body>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
        )}
        leftOpenValue={75}
        renderLeftHiddenRow={(rowData, secId, rowId, rows) => (
          <Button
            full
            style={styles.flashButton}
            onPress={() =>
              Toast.show({
                text: `You have flash ${rowData.color} route!`,
                position: "bottom",
                duration: 1500,
                type: "success"
              })}
          >
            <Icon active name="flash" />
          </Button>
        )}
        renderRightHiddenRow={() => null}
      />
    );
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.props.data.refetch();
    this.setState({ refreshing: false });
  };

  onRoutePress = route =>
    this.props.navigation.navigate("RouteDetail", {
      ...route,
      wallName: this.props.navigation.state.params.name
    });
}

export const routesQuery = gql`
query ($wallId: ID!) {
  allRoutes(orderBy: grade_ASC, filter: {wall: {id: $wallId}}) {
    id
    color
    grade
    successRate
    averageTries
  }
}
`;

export default graphql(routesQuery, {
  options: ({ navigation: { state: { params: { id } } } }) => ({
    variables: { wallId: id }
  })
})(RoutesScreen);
