import React from "react";
import { View, KeyboardAvoidingView, ScrollView } from "react-native";

const KeyboardAvoiding = ({ children }) => {
  return (
    <KeyboardAvoidingView
      style={{ flexDirection: "column", justifyContent: "center" }}
      enabled
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoiding;
