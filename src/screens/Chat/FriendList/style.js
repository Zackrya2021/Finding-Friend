import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    marginTop: 50,
  },
  flatList: { marginBottom: 130 },
  renderItem: {
    flex: 1,
    borderRadius: 10,
    borderColor: "#DCDCDC",
    borderWidth: 2,
    marginBottom: 3,
    marginHorizontal: 2,
    paddingVertical: 10,
    backgroundColor: "#EBEDEF",
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 8,
  },
});

export default styles;
