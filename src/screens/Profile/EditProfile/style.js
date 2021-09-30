import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
  },
  imageView: { alignSelf: "center", marginTop: 15 },
  cameraIcon: {
    position: "absolute",
    top: 120,
    left: 90,
    backgroundColor: "#C0C0C0",
    borderRadius: 18,
    height: 35,
    width: 35,
    paddingLeft: 6,
    paddingTop: 5,
  },
  buttonStyle: { backgroundColor: "red", marginHorizontal: 30 },
  errorStyle: {
    fontSize: 10,
    color: "red",
    marginLeft: 18,
    marginTop: -18,
    marginBottom: 5,
  },
});
export default styles;
