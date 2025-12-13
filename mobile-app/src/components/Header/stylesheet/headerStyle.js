import { StyleSheet } from "react-native";



export const headerStyle = StyleSheet.create({
  Header: {
    width: "100%",
    height: 55,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  HeaderLogo: {
    width: 55,
    height: 55,
  },

  ProfileBtn: {
    width: 55,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0deg, red, green)",
    borderRadius: "50%"
  }

});