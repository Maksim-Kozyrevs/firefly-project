import { performAndroidHapticsAsync } from "expo-haptics";
import { StyleSheet } from "react-native";



export const commonStyle = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 100,
    backgroundColor: "#151515",
  },

  MainBgGradient: {
    width: "100%",
    position: "absolute",
    top: 0,
    right: 0,
  }
});