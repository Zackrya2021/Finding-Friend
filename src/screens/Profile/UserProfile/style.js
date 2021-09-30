import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
  },
  settingView: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginRight: "5%",
  },
  avatarView: { alignSelf: "center" },
  infoView: { flexDirection: "row", justifyContent: "space-between" },
  infoIcon: { marginLeft: 15 },
  infoText: {
    marginRight: 15,
    fontSize: 18,
  },
  buttonStyle: { backgroundColor: "red", marginHorizontal: 30 },
});
export default styles;
