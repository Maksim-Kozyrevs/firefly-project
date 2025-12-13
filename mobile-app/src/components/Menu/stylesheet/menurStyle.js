import { StyleSheet } from "react-native";
import { withDecay } from "react-native-reanimated";



export const MenuStyle = StyleSheet.create({
  Menu: {
    width: "calc(100% - 15px)",
    height: 60,
    position: "absolute",
    bottom: 20,
    overflow: "hidden",
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "rgba(30, 30, 30, 0.5)",
  },

  navBtn: {
    width: 50,
    aspectRatio: "1/1",
    borderRadius: "50%",
    backgroundColor: "red"
  }
});