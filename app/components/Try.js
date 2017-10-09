import React from "react";
import { Animated } from "react-native";
import { CardItem, Left, Right, Text } from "native-base";
import { getStarsString } from "../utils";
import RouteDetailScreen from "../screens/RouteDetailScreen";

export default class extends React.Component {
  state = {
    opacity: new Animated.Value(0)
  };

  isClientValue() {
    return this.props.try.id < 0;
  }

  updateOpacity() {
    Animated.timing(this.state.opacity, {
      toValue: this.isClientValue() ? 0.2 : 1,
      duration: 1000
    }).start();
  }

  componentDidMount() {
    this.updateOpacity();
  }

  componentDidUpdate() {
    this.updateOpacity();
  }

  render() {
    const { opacity } = this.state;
    return (
      <Animated.View style={{ opacity }}>
        <CardItem>
          <Left>
            <Text>{this.props.try.createdAt.split("T")[0]}</Text>
          </Left>
          <Right>
            <Text style={{ color: "orange" }}>
              {getStarsString(this.props.try.successLevel)}
            </Text>
          </Right>
        </CardItem>
      </Animated.View>
    );
  }
}
