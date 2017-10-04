import React from "react";
import { DangerZone } from "expo";
import { View } from "react-native";
const { Lottie } = DangerZone;

export default class AnimatedLogo extends React.Component {
  componentDidMount() {
    if (this.props.autoplay) this.animation.play();
  }

  render() {
    const ratio = this.props.large ? 2 : 1;
    return (
      <View>
        <Lottie
          ref={anim => this.animation = anim}
          source={require("./carabiner-animation.json")}
          loop
          style={{
            width: 70 * ratio,
            height: 100 * ratio
          }}
        />
      </View>
    );
  }
}
