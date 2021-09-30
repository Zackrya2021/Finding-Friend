import React from "react";
import { View, Text, StatusBar, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "./style";
import { Divider } from "../../../Components";

const Setting = (props) => {
  const userInfo = props.navigation.state.params;
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} animated />
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("EditProfile", userInfo);
        }}
      >
        <View style={styles.listView}>
          <Feather name="edit" size={24} color="black" />
          <Text style={styles.listText}>Edit Profile</Text>
        </View>
      </TouchableOpacity>
      <Divider />
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("ChangeEmail");
        }}
      >
        <View style={styles.listView}>
          <Feather name="mail" size={24} color="black" />
          <Text style={styles.listText}>Change Email</Text>
        </View>
      </TouchableOpacity>
      <Divider />
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("ChangePassword");
        }}
      >
        <View style={styles.listView}>
          <Feather name="key" size={24} color="black" />
          <Text style={styles.listText}>Change Password</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.nameView}>
        <Text style={styles.nameText}>Find Friend v1.0.0</Text>
      </View>
    </View>
  );
};

export default Setting;
