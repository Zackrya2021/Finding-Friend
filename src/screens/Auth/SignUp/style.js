import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  Container: { marginTop: 50 },
  headerText: {
    fontSize: 25,
    alignSelf: "center",
    fontWeight: "bold",
    marginTop: 10,
  },
  inputContainer: { marginTop: 30 },
  bottomContainer: { alignSelf: "center", marginTop: 20, flexDirection: "row" },
  accountText: { fontSize: 18 },
  loginText: { fontSize: 18, color: "blue" },
  buttonStyle: { backgroundColor: "red", marginHorizontal: 30 },
  errorStyle: {
    fontSize: 10,
    color: "red",
    marginLeft: 18,
    marginTop: -18,
    marginBottom: 10,
  },
});

export default styles;
