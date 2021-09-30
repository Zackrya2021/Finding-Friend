import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Avatar, SearchBar, ListItem } from "react-native-elements";
import { db, auth } from "../../firebase/firebase";
import { Feather } from "@expo/vector-icons";
import styles from "./style";

const Search = (props) => {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [request, setRequest] = useState([]);
  useEffect(() => {
    if (!Object.keys(data).length) {
      setIsLoading(true);
      db.ref()
        .child("users/")
        .on("value", function (snapshot) {
          const getData = snapshot.val();
          const objToArray = [];
          Object.keys(getData).forEach((key) => objToArray.push(getData[key]));
          const filtered = objToArray.filter(
            (item) => item.userId !== auth.currentUser.uid
          );
          setData(filtered);
          setIsLoading(false);
        });
    }
  }, [data]);

  useEffect(() => {
    setIsLoading(true);
    const currentUser = auth.currentUser.uid;
    db.ref()
      .child(`friend/${currentUser}/requestFrom/`)
      .on("value", async function (snapshot) {
        let requestList = [];
        await snapshot.forEach(function (childSnapshot) {
          const requestKey = childSnapshot.key;
          db.ref()
            .child(`users/`)
            .orderByKey()
            .equalTo(requestKey)
            .once("value", function (snapshot) {
              if (snapshot.exists() && snapshot.hasChild(requestKey)) {
                const getData = snapshot.val();
                if (Object.values(getData).length) {
                  requestList.push(...Object.values(getData));
                }
              }
            });
        });
        setRequest(requestList);
        setIsLoading(false);
      });
  }, []);

  const filteredList = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRequestList = request.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  const keyExtractor = (item, index) => index.toString();
  const renderItem = ({ item }) => (
    <ListItem
      containerStyle={styles.renderItem}
      underlayColor={null}
      onPress={() => {
        props.navigation.navigate("FriendProfile", item);
      }}
    >
      <Avatar rounded size={45} source={{ uri: item.profilePicture }} />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );

  const renderRequest = ({ item }) => (
    <ListItem
      containerStyle={styles.renderRequest}
      underlayColor={null}
      onPress={() => {
        props.navigation.navigate("FriendProfile", item);
      }}
    >
      <Avatar rounded size={50} source={{ uri: item.profilePicture }} />
      <ListItem.Title>{item.name}</ListItem.Title>
    </ListItem>
  );

  return (
    <View style={styles.mainContainer}>
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
        <View style={styles.flatListView}>
          {request.length === 0 ? null : (
            <View>
              <View style={styles.listView}>
                <Text style={styles.listText}>Friend Request</Text>
                <Feather
                  name="user-plus"
                  size={20}
                  color="black"
                  style={styles.listIcon}
                />
              </View>
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={keyExtractor}
                data={filteredRequestList}
                renderItem={renderRequest}
              />
            </View>
          )}
          <View style={styles.usersFlatListView}>
            <View style={styles.listView}>
              <Text style={styles.listText}>Users</Text>
              <Feather
                name="users"
                size={20}
                color="black"
                style={styles.listIcon}
              />
            </View>
            <FlatList
              keyExtractor={keyExtractor}
              data={filteredList}
              renderItem={renderItem}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Search;
