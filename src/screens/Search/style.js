import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  activityIndicator: { flex: 1, justifyContent: "center", marginTop: 50 },
  flatListView: { flex: 1 },
  listView: { flexDirection: "row", margin: 1 },
  listText: {
    marginLeft: 5,
    fontSize: 18,
    fontWeight: "900",
  },
  listIcon: { marginLeft: 5 },
  usersFlatListView: { flex: 16 },
  renderItem: {
    flex: 1,
    borderRadius: 10,
    borderColor: "#DCDCDC",
    borderWidth: 2,
    marginBottom: 3,
    marginHorizontal: 2,
    paddingVertical: 12,
    backgroundColor: "#EBEDEF",
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  renderRequest: {
    flexDirection: "column",
    borderRadius: 10,
    marginHorizontal: 2.5,
    marginVertical: 3,
    borderColor: "#DCDCDC",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 8,
    backgroundColor: "#EBEDEF",
  },
});

export default styles;
