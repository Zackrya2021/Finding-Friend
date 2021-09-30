import React, { useState, useEffect } from "react";
import { View, Text, StatusBar } from "react-native";
import styles from "./style";
import { Avatar } from "react-native-elements";
import {
  Feather,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { Divider } from "../../../Components";
import { db, auth } from "../../../firebase/firebase";

const FriendProfile = (props) => {
  const [action, setAction] = useState("");
  const [cUser, setCUser] = useState({});
  const item = props.navigation.state.params;
  const { bio, email, name, profilePicture, userId, token } = item;
  useEffect(() => {
    (async () => {
      const currentUser = await auth.currentUser.uid;
      await db
        .ref(`users/`)
        .child(`${currentUser}/`)
        .once("value", function (snapshot) {
          if (snapshot.exists()) {
            const cUser = snapshot.val();
            setCUser(cUser);
          }
        });
    })();
  }, []);
  const sendRequestHandler = async () => {
    const currentUser = await auth.currentUser.uid;
    await db
      .ref()
      .child(`friend/${currentUser}/requestTo/`)
      .update({ [userId]: "pending" });
    await db
      .ref()
      .child(`friend/${userId}/requestFrom/`)
      .update({ [currentUser]: "pending" })
      .then(
        (async () => {
          const deviceToken = token.data;
          let response = await fetch("https://fcm.googleapis.com/fcm/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `key=AAAAd9eRoz8:APA91bEbuUie6U_7LaUS4BHfz953EG2wr0anHYxdyGyUpWasLjSkL56Gv6v-CBo_3faoSWdWyg9l_p5kzEtBM8LqhblG5C9N3hnAkPRK5woEfI5Jyn6kCEEmy-8mNKsxqNmvKoSdfkp-`,
            },
            body: JSON.stringify({
              to: deviceToken,
              priority: "high",
              notification: {
                experienceId: "@samiwarraich51/findfriend",
                title: `Find Friend - Friend Request`,
                sound: true,
                vibrate: true,
                body: `${cUser.name} send you friend request`,
              },
            }),
          });
        })()
      );
  };
  const cancelRequestHandler = async () => {
    const currentUser = await auth.currentUser.uid;
    await db.ref().child(`friend/${currentUser}/requestTo/${userId}`).remove();
    await db
      .ref()
      .child(`friend/${userId}/requestFrom/${currentUser}`)
      .remove();
  };
  const rejectRequestHandler = async () => {
    const currentUser = await auth.currentUser.uid;
    await db
      .ref()
      .child(`friend/${currentUser}/requestFrom/${userId}`)
      .remove();
    await db.ref().child(`friend/${userId}/requestTo/${currentUser}`).remove();
  };
  const acceptRequestHandler = async () => {
    const currentUser = await auth.currentUser.uid;
    return await db
      .ref()
      .child(`friend/${currentUser}/requestFrom/${userId}`)
      .once("value", async function (snapshot) {
        if (snapshot.exists()) {
          await db
            .ref()
            .child(`friend/${currentUser}/friends/`)
            .update({ [userId]: true });
          await db
            .ref()
            .child(`friend/${userId}/friends/`)
            .update({ [currentUser]: true });
          await db
            .ref()
            .child(`friend/${currentUser}/requestFrom/${userId}`)
            .remove();
          await db
            .ref()
            .child(`friend/${userId}/requestTo/${currentUser}`)
            .remove();
        }
      });
  };
  const removeChat = async (roomId) => {
    await db.ref().child(`chat/messages/${roomId}`).remove();
  };
  const removeRoom = async (userId, roomId) => {
    await db.ref().child(`chat/rooms/${userId}/${roomId}`).remove();
  };

  const removeFriendHandler = async () => {
    const currentUser = await auth.currentUser.uid;
    await db.ref().child(`friend/${currentUser}/friends/${userId}`).remove();
    await db.ref().child(`friend/${userId}/friends/${currentUser}`).remove();
    await removeChat(`${currentUser}_${userId}`);
    await removeChat(`${userId}_${currentUser}`);
    await removeRoom(currentUser, `${currentUser}_${userId}`);
    await removeRoom(currentUser, `${userId}_${currentUser}`);
    await removeRoom(userId, `${currentUser}_${userId}`);
    await removeRoom(userId, `${userId}_${currentUser}`);
  };

  useEffect(() => {
    const cancelRequest = async () => {
      const currentUser = await auth.currentUser.uid;
      await db
        .ref()
        .child(`friend/${currentUser}/requestTo/`)
        .orderByKey()
        .equalTo(userId)
        .on("value", function (snapshot) {
          if (snapshot.exists() && snapshot.hasChild(userId)) {
            setAction("cancel");
          }
        });
    };
    cancelRequest();

    const responseRequest = async () => {
      const currentUser = await auth.currentUser.uid;
      await db
        .ref()
        .child(`friend/${currentUser}/requestFrom/`)
        .orderByKey()
        .equalTo(userId)
        .on("value", function (snapshot) {
          if (snapshot.exists() && snapshot.hasChild(userId)) {
            setAction("response");
          }
        });
    };
    responseRequest();

    const removeFriend = async () => {
      const currentUser = await auth.currentUser.uid;
      await db
        .ref()
        .child(`friend/${currentUser}/friends/`)
        .orderByKey()
        .equalTo(userId)
        .on("value", function (snapshot) {
          if (snapshot.exists() && snapshot.hasChild(userId)) {
            setAction("friend");
          }
        });
    };
    removeFriend();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} animated />
      <View style={styles.requestView}>
        {action === "cancel" ? (
          <Feather
            onPress={() => {
              cancelRequestHandler();
              setAction("send");
            }}
            name="user-x"
            type="feather"
            color="red"
            size={25}
          />
        ) : action === "response" ? (
          <View style={styles.responseContainer}>
            <View style={styles.requestView}>
              <Feather
                onPress={() => {
                  rejectRequestHandler();
                  setAction("send");
                }}
                name="user-x"
                type="feather"
                color="red"
                size={25}
              />
            </View>
            <View style={styles.requestView}>
              <Feather
                onPress={() => {
                  acceptRequestHandler();
                  setAction("friend");
                }}
                name="user-check"
                type="feather"
                color="green"
                size={25}
              />
            </View>
          </View>
        ) : action === "friend" ? (
          <Feather
            onPress={() => {
              removeFriendHandler();
              setAction("send");
            }}
            name="user-minus"
            type="feather"
            color="red"
            size={25}
          />
        ) : (
          <Feather
            onPress={() => {
              sendRequestHandler();
              setAction("cancel");
            }}
            name="user-plus"
            type="feather"
            color="green"
            size={25}
          />
        )}
      </View>
      <View style={styles.avatarView}>
        <Avatar rounded size={150} source={{ uri: profilePicture }} />
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
    </View>
  );
};

export default FriendProfile;
