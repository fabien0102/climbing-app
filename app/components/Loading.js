import React from "react";
import { Container } from "native-base";
import AnimatedLogo from "./AnimatedLogo";

export default class Loading extends React.Component {
  render() {
    return (
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          backgroundColor: "#3299BB"
        }}
      >
        <AnimatedLogo autoplay />
      </Container>
    );
  }
}
