import React, { useState, useEffect } from "react";
import {
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  ToastAndroid,
} from "react-native";
import styles from "./style";
import { Avatar } from "react-native-elements";
import {
  Feather,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { Button, Divider } from "../../../Components";
import { logout, rootRef, auth } from "../../../firebase/firebase";

const UserProfile = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const logOutHandler = () => {
    setIsLoading(true);
    logout().catch((error) => {
      setIsLoading(false);
      ToastAndroid.show(`${error.message}`, ToastAndroid.LONG);
    });
  };

  useEffect(() => {
    if (!Object.keys(userInfo).length) {
      const userId = auth.currentUser.uid;
      const userRef = rootRef.child(userId);
      userRef.on("value", function (snapshot) {
        setUserInfo(snapshot.val());
      });
    }
  }, [userInfo]);

  const { bio, email, name, profilePicture } = userInfo;

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} animated />
      <View style={styles.settingView}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("Setting", {
              bio: bio,
              name: name,
              profilePicture: profilePicture,
            });
          }}
        >
          <Feather name="settings" size={28} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.avatarView}>
        <Avatar rounded size={150} source={{ uri: profilePicture }}></Avatar>
      </View>
      <Divider />
      <View style={styles.infoView}>
        <Feather name="user" size={24} color="black" style={styles.infoIcon} />
        <Text style={styles.infoText}>{name}</Text>
      </View>
      <Divider />
      <View style={styles.infoView}>
        <MaterialCommunityIcons
          name="email-outline"
          size={24}
          color="black"
          style={styles.infoIcon}
        />
        <Text style={styles.infoText}>{email}</Text>
      </View>
      <Divider />
      <View style={styles.infoView}>
        <SimpleLineIcons
          name="info"
          size={22}
          color="black"
          style={styles.infoIcon}
        />
        <Text style={styles.infoText}>{bio}</Text>
      </View>
      <Divider />
      <Button
        title="Log Out"
        onPress={logOutHandler}
        loading={isLoading}
        icon={{
          name: "log-out",
          type: "feather",
          size: 20,
          color: "white",
        }}
        iconRight
        style={styles.buttonStyle}
      />
    </View>
  );
};

export default UserProfile;
