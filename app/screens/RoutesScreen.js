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
import RouteIcon from "../components/RouteIcon";
import styles from "./RoutesScreen.style";
import { map } from "lodash";
import { compose } from "react-apollo";
import withMe from "../queries/withMe";
import withRoutes from "../queries/withRoutes";
import withAddTry from "../queries/withAddTry";

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
              {map(route.tries, "successLevel").includes(5)
                ? <Icon
                    name="checkmark"
                    style={{
                      left: 30,
                      top: 10,
                      position: "absolute",
                      backgroundColor: "transparent",
                      fontSize: 30,
                      color: "green"
                    }}
                  />
                : null}
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
            onPress={() => {
              this.props.addTry({
                successLevel: 5,
                userId: this.props.me.id,
                routeId: rowData.id,
                wallId: this.props.navigation.state.params.id
              });
              Toast.show({
                text: `You have flash ${rowData.color} route!`,
                position: "bottom",
                duration: 1500,
                type: "success"
              });
            }}
          >
            <Icon active name="flash" />
          </Button>
        )}
        disableLeftSwipe
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
      wallId: this.props.navigation.state.params.id,
      wallName: this.props.navigation.state.params.name
    });
}

export default compose(withMe, withRoutes, withAddTry)(RoutesScreen);
