import { StyleSheet } from "react-native";

export default StyleSheet.create({
  main: {
    backgroundColor: "#f9f9f9"
  },
  avatar: {
    backgroundColor: "#00ACBF",
    paddingTop: 30,
    paddingBottom: 15,
    alignItems: "center",
    marginBottom: 20
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 0
  },
  pseudo: {
    fontSize: 22,
    color: "white"
  },
  progressBarPart: {
    paddingHorizontal: 20,
    marginTop: 20
  },
  progressBarLabel: {
    fontSize: 15,
    color: "gray"
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  progressBar: {
    justifyContent: "flex-start",
    flexDirection: "row",
    borderRadius: 12,
    height: 12,
    overflow: "hidden"
  },
  progressBarItem: {
    flexShrink: 0,
    flexGrow: 0
  },
  progressBarValue: {
    fontSize: 10,
    color: "grey",
    marginHorizontal: 5
  },
  gradeStat: {
    alignItems: "center"
  },
  gradeStatValue: {
    color: "#666666"
  }
});
