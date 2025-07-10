import { Platform, StatusBar, ViewStyle } from "react-native";

const safearea: ViewStyle = {
  paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
};

export default safearea;
