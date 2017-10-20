import React from "react";
import { Svg } from "expo";
import { View } from "react-native";

// Flashh grade flag colors
export const flashhGrades = [
  "white",
  "white",
  "white",
  "white",
  "yellow",
  "green",
  "blue",
  "red",
  "black"
];

/**
 * Generate a beautiful color icon with the flag and grip color
 */
export default ({ color, grade, size }) => {
  if (["volume", "rock"].includes(color)) color = "grey";
  const sizeRatio = size === "small" ? 1.5 : 1;
  const height = 63 / sizeRatio;
  const width = 51 / sizeRatio;
  const viewBox = color ? "0 0 147.01 173.6" : "0 58 108.4 116";
  return (
    <Svg height={height} width={width} viewBox={viewBox}>
      <Svg.Path
        d="M97.45 116.26l-7.58-53.4-42.46 33.26L5 129.39l50 20.14 50 20.14zm-39 3.9l14-11.32 2.24 17.85z"
        fill={flashhGrades[grade]}
        stroke={
          ["white", "yellow"].includes(flashhGrades[grade]) ? "black" : "white"
        }
        stroke-width="5"
      />
      {color
        ? <Svg.G>
            <Svg.Path
              d="M93.83 2C83.12 7.28 60.72 17.46 37 22.44a18.85 18.85 0 0 0-14.83 15.2 73.59 73.59 0 0 0-.63 22 18.75 18.75 0 0 0 17.63 16.1c13.75.75 36.46 4.79 55.22 21.62A18.76 18.76 0 0 0 115.3 100 80.8 80.8 0 0 0 143 77.64a18.75 18.75 0 0 0 .78-22.17 58.63 58.63 0 0 1-10.34-28.69A18.81 18.81 0 0 0 128 14.95a70.6 70.6 0 0 0-17.56-13A18.72 18.72 0 0 0 93.83 2z"
              fill={color}
              stroke={color === "white" ? "black" : "white"}
              stroke-width="5"
            />
            <Svg.Path
              d="M114.92 76c27.66-10.76 1.88-42.23 13.09-61a70.61 70.61 0 0 0-17.56-13 18.72 18.72 0 0 0-16.62 0C83.12 7.28 60.72 17.46 37 22.44a19.37 19.37 0 0 0-5 1.83s22.82-4.69 37.56 20.47S87.25 86.73 114.92 76z"
              fill="#f8f8f8"
              opacity=".3"
            />
            <Svg.Circle fill="#E6E7E8" cx="107.14" cy="52.52" r="11.74" />
            <Svg.Circle fill="#414042" cx="107.14" cy="52.52" r="7.78" />
            <Svg.Path
              d="M143 77.64a19.23 19.23 0 0 0 4-10.84c-8 7.85-22 20.68-32.07 25.21C100 98.72 88.28 80 58.78 71.24 44.54 67 33.9 68 26.7 70.11a18.9 18.9 0 0 0 12.47 5.63c13.75.75 36.46 4.79 55.22 21.62A18.76 18.76 0 0 0 115.3 100 80.8 80.8 0 0 0 143 77.64z"
              opacity=".1"
            />
          </Svg.G>
        : null}
    </Svg>
  );
};
