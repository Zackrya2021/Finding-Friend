import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
  },
  listView: { flexDirection: "row", marginLeft: 15 },
  listText: { marginLeft: 12, fontSize: 18 },
  nameView: {
    flex: 1,
    flexDirection: "column-reverse",
    alignItems: "center",
    marginBottom: "3%",
  },
  nameText: { color: "#696969" },
});
export default styles;
