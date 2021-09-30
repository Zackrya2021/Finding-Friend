import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
  },
  requestView: { flexDirection: "row-reverse", marginLeft: "4%" },
  responseContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  responseView: { marginLeft: 1 },
  avatarView: { alignSelf: "center" },
  infoView: { flexDirection: "row", justifyContent: "space-between" },
  infoIcon: { marginLeft: 15 },
  infoText: { marginRight: 15, fontSize: 18 },
});
export default styles;
