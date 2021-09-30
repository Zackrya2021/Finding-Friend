import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { auth } from "../../firebase/firebase";
import styles from "./style";

const Loading = (props) => {
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        props.navigation.navigate("MapDetail");
      } else {
        props.navigation.navigate("LogIn");
      }
    });
  }, []);
  return (
    <View style={styles.indicatorContainer}>
      <ActivityIndicator size="large" color="red" />
    </View>
  );
};

export default Loading;
