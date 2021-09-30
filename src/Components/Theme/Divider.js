import React from "react";
import { View } from "react-native";
import { Divider as Divide } from "react-native-elements";

const Divider = () => {
  return (
    <View>
      <Divide style={{ backgroundColor: "grey", height: 1, margin: 15 }} />
    </View>
  );
};

export default Divider;
