import React, { useState, useEffect } from "react";
import { View } from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";
import {
  GiftedChat,
  Bubble,
  Time,
  Send,
  InputToolbar,
} from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons";
import { auth, db, dbTime } from "../../../firebase/firebase";
import styles from "./style";

const Room = (props) => {
  const [cUser, setCUser] = useState({});
  const [messages, setMessages] = useState([]);
  const prop = props.navigation.state.params;
  const _item = props.navigation.state.params;
  const { item, roomId } = prop;
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

  const send = (messages) => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        createdAt: dbTime,
      };
      db.ref(`chat/messages`)
        .child(`${roomId}`)
        .push(message)
        .then(
          (async () => {
            const deviceToken = _item.token || item.token.data;
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
                  title: `Find Friend - Message`,
                  sound: true,
                  vibrate: true,
                  body: `${cUser.name}: ${text}`,
                },
              }),
            });
          })()
        );
      db.ref(
        `chat/rooms/${(cUser && cUser.userId) || (_item && _item.userId2)}`
      )
        .child(`${roomId}`)
        .update({ message });
      db.ref(`chat/rooms/${(item && item.userId) || (_item && _item.userId1)}`)
        .child(`${roomId}`)
        .update({ message });
    }
  };
  const parse = (snapshot) => {
    const { createdAt, text, user } = snapshot.val();
    const { key: id } = snapshot;
    const { key: _id } = snapshot;
    const message = {
      id,
      _id,
      createdAt,
      text,
      user,
    };
    return message;
  };
  const refOn = (callback) => {
    db.ref(`chat/messages`)
      .child(`${roomId}`)
      .limitToLast(20)
      .on("child_added", (snapshot) => callback(parse(snapshot)));
  };
  useEffect(() => {
    refOn((message) => setMessages((messages) => [message, ...messages]));
    return () => {
      db.ref(`chat/messages`).child(`${roomId}`).off();
    };
  }, []);

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={styles.renderSend}>
          <Ionicons name="ios-send" size={35} color="#FFFC00" />
        </View>
      </Send>
    );
  };
  const renderInputToolbar = (props) => {
    return <InputToolbar {...props} containerStyle={styles.inputContainer} />;
  };
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#FFFC00",
          },
          left: {
            backgroundColor: "#808080",
          },
        }}
        usernameStyle={styles.bubbleUserName}
        textStyle={{
          right: {
            color: "black",
          },
          left: {
            color: "black",
          },
        }}
      />
    );
  };

  const renderTime = (props) => {
    return (
      <Time
        {...props}
        timeTextStyle={{
          right: {
            color: "black",
          },
          left: {
            color: "black",
          },
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={send}
        user={{
          _id: cUser.userId,
          name: cUser.name,
          avatar: cUser.profilePicture,
        }}
        isAnimated
        showUserAvatar
        renderUsernameOnMessage
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        renderBubble={renderBubble}
        renderTime={renderTime}
        maxComposerHeight={50}
        textInputProps={{
          style: styles.textInput,
        }}
        listViewProps={{
          style: styles.listView,
        }}
      />
      <KeyboardSpacer topSpacing={-240} />
    </View>
  );
};
export default Room;
