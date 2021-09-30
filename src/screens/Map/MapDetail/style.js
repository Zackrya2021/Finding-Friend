import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
  },
  mapStyle: {
    height: "100%",
    width: "100%",
  },
  markerImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderColor: "#6495ed",
    borderWidth: 2,
  },
  markerStyle: { flex: 1 },
  markerBottomStyle: {
    marginTop: 10,
    height: 8,
    width: 8,
    backgroundColor: "#6495ed",
    borderRadius: 20,
    alignSelf: "center",
  },
  indicatorStyle: { flex: 1, justifyContent: "center", marginTop: 50 },
  directionIconView: {
    position: "absolute",
    right: 11,
    bottom: 105,
  },
});

export default styles;
