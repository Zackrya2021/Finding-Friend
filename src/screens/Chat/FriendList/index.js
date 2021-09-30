import React, { useState, useEffect } from "react";
import { View, StatusBar, FlatList, ActivityIndicator } from "react-native";
import { SearchBar, Avatar, ListItem } from "react-native-elements";
import { db, auth } from "../../../firebase/firebase";
import styles from "./style";

const FriendList = (props) => {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [cUser, setCUser] = useState({});
  const ids = props.navigation.state.params;
  useEffect(() => {
    setIsLoading(true);
    const currentUser = auth.currentUser.uid;
    db.ref()
      .child(`friend/${currentUser}/friends/`)
      .once("value", async function (snapshot) {
        let userList = [];
        await snapshot.forEach(function (childSnapshot) {
          const friendKey = childSnapshot.key;
          db.ref()
            .child(`users/`)
            .orderByKey()
            .equalTo(friendKey)
            .once("value", function (snapshot) {
              if (snapshot.exists() && snapshot.hasChild(friendKey)) {
                const getData = snapshot.val();
                if (Object.values(getData).length) {
                  userList.push(...Object.values(getData));
                }
              }
            });
        });
        setData(userList);
        setIsLoading(false);
      });
  }, []);
  useEffect(() => {
    const currentUser = auth.currentUser.uid;
    db.ref(`users/`)
      .child(`${currentUser}/`)
      .once("value", function (snapshot) {
        if (snapshot.exists()) {
          const cUser = snapshot.val();
          setCUser(cUser);
        }
      });
  }, []);

  const createRoomHandler = async (item) => {
    const currentUser = auth.currentUser.uid;
    const roomId = `${currentUser}_${item.userId}`;
    await db
      .ref(`chat/rooms/`)
      .child(`${currentUser}/`)
      .update({
        [roomId]: {
          name: item.name,
          profilePicture: item.profilePicture,
          roomId: `${currentUser}_${item.userId}`,
          userId1: item.userId,
          userId2: cUser.userId,
          token: item.token.data,
        },
      });
    await db
      .ref(`chat/rooms/`)
      .child(`${item.userId}/`)
      .update({
        [roomId]: {
          name: cUser.name,
          profilePicture: cUser.profilePicture,
          roomId: `${currentUser}_${item.userId}`,
          userId1: cUser.userId,
          userId2: item.userId,
          token: cUser.token.data,
        },
      });
    props.navigation.navigate("Room", { item, roomId });
  };
  const filtered = data.filter((item) => ids.indexOf(item.userId) == -1);
  const filteredList = filtered.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  const keyExtractor = (item, index) => index.toString();
  const renderItem = ({ item }) => (
    <ListItem
      containerStyle={styles.renderItem}
      underlayColor={null}
      onPress={() => {
        createRoomHandler(item);
      }}
    >
      <Avatar rounded size={45} source={{ uri: item.profilePicture }} />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
  return (
    <View>
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
    </View>
  );
};

export default FriendList;
