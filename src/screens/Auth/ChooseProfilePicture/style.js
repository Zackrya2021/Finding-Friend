import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 25,
  },
  avatar: { marginTop: 60 },
  chooseProfile: { marginTop: 20 },
  chooseProfileText: { fontSize: 20 },
  bottomContainer: { flex: 1, marginBottom: 35, justifyContent: "flex-end" },
  skipText: { fontSize: 18, color: "#0984e3" },
  continueText: { fontSize: 18, color: "#0984e3" },
  cameraIcon: {
    position: "absolute",
    top: 175,
    left: 205,
    backgroundColor: "#C0C0C0",
    borderRadius: 18,
    height: 35,
    width: 35,
    paddingLeft: 6,
    paddingTop: 5,
  },
});

export default styles;
