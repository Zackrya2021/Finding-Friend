import React, { useState, useEffect } from "react";
import {
  View,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Avatar, SearchBar, ListItem } from "react-native-elements";
import { db, auth } from "../../../firebase/firebase";
import styles from "./style";

const ChatList = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState({});
  let ids = data.map((item) => item.userId1);

  const getChat = async () => {
    const currentUser = auth.currentUser.uid;
    setIsLoading(true);
    await db
      .ref(`chat/rooms`)
      .child(`${currentUser}/`)
      .on("value", function (snapshot) {
        if (snapshot.exists()) {
          const getData = snapshot.val();
          const objToArray = [];
          Object.keys(getData).forEach((key) => objToArray.push(getData[key]));
          setData(objToArray);
        }
        setIsLoading(false);
      });
  };
  useEffect(() => {
    getChat();
  }, []);
  const deleteChat = async () => {
    const currentUser = item.userId2;
    const userId = item.userId1;
    let index = data.map((chat) => chat.roomId).indexOf(`${item.roomId}`);
    if (index > -1) {
      data.splice(index, 1);
    }
    await db.ref().child(`chat/messages/${item.roomId}`).remove();
    await db.ref().child(`chat/rooms/${currentUser}/${item.roomId}`).remove();
    await db.ref().child(`chat/rooms/${userId}/${item.roomId}`).remove();
    await getChat();
  };

  const filteredList = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const keyExtractor = (item, index) => index.toString();

  const getTimeAMPMFormat = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return hours + ":" + minutes + " " + ampm;
  };

  const renderItem = ({ item }) => (
    <ListItem
      onLongPress={() => {
        setVisible(true);
        setItem(item);
      }}
      containerStyle={styles.renderItem}
      underlayColor={null}
      onPress={() => {
        navigation.navigate("Room", item);
      }}
    >
      <Avatar rounded size={45} source={{ uri: item.profilePicture }} />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        {item.hasOwnProperty("message") ? (
          <ListItem.Subtitle>{`${item.message.text}`}</ListItem.Subtitle>
        ) : null}
      </ListItem.Content>
      {item.hasOwnProperty("message") ? (
        <ListItem.Subtitle>
          {getTimeAMPMFormat(new Date(item.message.createdAt))}
        </ListItem.Subtitle>
      ) : null}
    </ListItem>
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden={true} animated />
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search"
        lightTheme={true}
        round={true}
        returnKeyType="search"
        searchIcon={{ size: 24 }}
      />
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="red"
          style={styles.activityIndicator}
        />
      ) : (
        <View style={styles.flatList}>
          <FlatList
            keyExtractor={keyExtractor}
            data={filteredList}
            renderItem={renderItem}
          />
        </View>
      )}

      <Modal transparent={true} visible={visible} animationType="slide">
        <TouchableWithoutFeedback
          onPress={() => {
            setVisible(false);
          }}
        >
          <View style={styles.touchView} />
        </TouchableWithoutFeedback>
        <View style={styles.outerContainer}>
          <View style={styles.modalMainView}>
            <View style={styles.topContainer}>
              <View style={styles.titleView}>
                <Ionicons name="md-trash" size={26} color="#2a2a2a" />
                <Text style={styles.titleText}>
                  Delete Chat with "{item.name}" ?
                </Text>
              </View>
              <View style={styles.descriptionView}>
                <Text style={styles.descriptionText}>
                  You will delete the chat for everyone. Once you delete the
                  chat, it can't be undone.
                </Text>
              </View>
              <View style={styles.buttonView}>
                <TouchableOpacity
                  onPress={() => {
                    setVisible(false);
                  }}
                >
                  <Text style={styles.cancelButton}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    await deleteChat();
                    setVisible(false);
                  }}
                >
                  <Text style={styles.deleteButton}>DELETE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.friendListView}>
        <MaterialCommunityIcons
          onPress={() => {
            navigation.navigate("FriendList", ids);
          }}
          style={styles.friendListIcon}
          name="message-plus"
          size={45}
          color="black"
        />
      </View>
    </View>
  );
};

export default ChatList;
