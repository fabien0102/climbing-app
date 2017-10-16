import React from "react";
import {
  View,
  Text,
  Button,
  Icon,
  Left,
  Header,
  Container,
  Content,
  H3,
  Thumbnail
} from "native-base";
import { Col, Grid, Row } from "react-native-easy-grid";
import { NavigationActions } from "react-navigation";
import { compose } from "react-apollo";
import { endOfWeek, startOfWeek } from "date-fns";
import { round, sumBy } from "lodash";
import withMe from "../queries/withMe";
import withRoutesStats from "../queries/withRoutesStats";
import Loading from "../components/Loading";
import RouteIcon, { flashhGrades } from "../components/RouteIcon";
import styles from "./HomeScreen.style";

/**
 * Home screen
 * 
 * Some stats: 
 *  - routes dones / total routes
 *  - routes tries but not finished
 *  - max grade reach
 */
export class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  onPrevWeekPress = () => {};

  renderGradesStats(perGrade) {
    return (
      <Grid>
        {perGrade.map((data, i) => (
          <Col key={i} style={styles.gradeStat}>
            <RouteIcon grade={data.grade} />
            <Text style={styles.gradeStatValue}>
              {round(data.finished / data.total * 100, 0)}%
            </Text>
          </Col>
        ))}
      </Grid>
    );
  }

  renderProgressBar(key, perGrade) {
    const total = sumBy(perGrade, "total");

    return (
      <View key={`progress-bar-${key}`} style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          {perGrade.map((data, i) => {
            if (!data[key]) return null;
            return (
              <View
                key={i}
                style={[
                  {
                    flexBasis: `${data[key] / total * 100}%`,
                    backgroundColor: flashhGrades[+data.grade[0]]
                  },
                  styles.progressBarItem
                ]}
              />
            );
          })}
        </View>
        <Text style={styles.progressBarValue}>
          {sumBy(perGrade, key)}
        </Text>
      </View>
    );
  }

  renderProgressBarStats(perGrade) {
    return (
      <Grid style={styles.progressBarPart}>
        <Row>
          <H3 style={styles.progressBarLabel}>Flashed routes</H3>
        </Row>
        <Row>
          {this.renderProgressBar("flashed", perGrade)}
        </Row>
        <Row>
          <H3 style={styles.progressBarLabel}>After works routes</H3>
        </Row>
        <Row>
          {this.renderProgressBar("afterWork", perGrade)}
        </Row>
        <Row>
          <H3 style={styles.progressBarLabel}>Work in progress routes</H3>
        </Row>
        <Row>
          {this.renderProgressBar("notFinished", perGrade)}
        </Row>
      </Grid>
    );
  }

  render() {
    if (this.props.routesStats.loading) return <Loading />;
    if (this.props.routesStats.error)
      return <Text>Error: {this.props.routesStats.error.message}</Text>;

    const { perGrade } = this.props.routesStats;

    return (
      <Container style={styles.main}>
        <Content>
          <Grid>
            <Row>
              <Grid style={styles.avatar}>
                <Row style={styles.backButton}>
                  <Button
                    transparent
                    onPress={() => {
                      this.props.navigation.dispatch(
                        // Back action
                        NavigationActions.back({ key: null })
                      );
                    }}
                  >
                    <Icon name="arrow-back" style={{ color: "white" }} />
                  </Button>
                </Row>
                <Row>
                  <Thumbnail large source={{ uri: this.props.me.picture }} />
                </Row>
                <Row>
                  <Text style={styles.pseudo}>{this.props.me.pseudo}</Text>
                </Row>

              </Grid>

            </Row>
            <Row>{this.renderGradesStats(perGrade)}</Row>
            <Row>
              {this.renderProgressBarStats(perGrade)}
            </Row>
          </Grid>
        </Content>
      </Container>
    );
  }
}

export default compose(withMe, withRoutesStats)(HomeScreen);
