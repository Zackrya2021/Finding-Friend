import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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
    elevation: 8,
  },
  activityIndicator: { flex: 1, justifyContent: "center", marginTop: 50 },
  flatList: { marginBottom: 130 },
  friendListView: {
    flex: 6,
    flexDirection: "row-reverse",
  },
  friendListIcon: {
    flexDirection: "column",
    alignSelf: "flex-end",
    marginRight: "5%",
    marginBottom: "5%",

    textShadowColor: "#696969",
    shadowOpacity: 1,
    textShadowRadius: 10,
    textShadowOffset: {
      width: 5,
      height: 5,
    },
  },
  touchView: { flex: 1 },
  outerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    marginBottom: "20%",
  },
  modalMainView: {
    zIndex: 1,
    margin: 25,
    backgroundColor: "#c6c6c6",
    borderRadius: 8,
    marginHorizontal: "10%",
  },
  topContainer: {
    height: 130,
  },
  titleView: {
    flexDirection: "row",
    marginLeft: 8,
    marginTop: 5,
    marginRight: 8,
    height: 50,
  },
  titleText: { fontSize: 18, marginLeft: 5, color: "#2a2a2a" },
  descriptionView: { margin: 8, marginTop: 0 },
  descriptionText: { color: "#696969" },
  buttonView: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 13,
    marginTop: 5,
  },
  cancelButton: {
    marginRight: 13,
    fontSize: 16,
    color: "#2a2a2a",
  },
  deleteButton: {
    fontSize: 16,
    color: "red",
  },
});

export default styles;
