import React, { useState, useEffect } from "react";
import { View, StatusBar, Image, ToastAndroid } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../../firebase/firebase";
import styles from "./style";
import { customMap } from "./CustomMap";
import {
  Accuracy,
  requestPermissionsAsync,
  watchPositionAsync,
} from "expo-location";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

const MapDetail = () => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [cUser, setCUser] = useState({});
  const [margin, setMargin] = useState(1);
  const [data, setData] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [destination, setDestination] = useState({});
  const [location, setLocation] = useState({
    coords: {
      accuracy: 14.574999809265137,
      altitude: 172,
      altitudeAccuracy: null,
      heading: 68.80760955810547,
      latitude: 32.5436813,
      longitude: 74.0944478,
      speed: 0.013772985897958279,
    },
    mocked: false,
    timestamp: 1607370872230,
  });

  useEffect(() => {
    const registerForPushNotifications = async () => {
      const currentUser = auth.currentUser.uid;
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        return;
      }
      try {
        let token = await Notifications.getDevicePushTokenAsync();
        db.ref("users/").child(`${currentUser}/`).update({ token });
      } catch (error) {
        console.log(error);
      }
    };
    registerForPushNotifications();
  }, []);

  useEffect(() => {
    const startWatching = async () => {
      try {
        let { status } = await requestPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
        }
        await watchPositionAsync(
          {
            accuracy: Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (subscriber) => {
            setLocation(subscriber);
          }
        );
      } catch (error) {
        setErrorMsg(error);
        ToastAndroid.show(`${errorMsg}`, ToastAndroid.LONG);
      }
    };
    startWatching();
    return () => {
      startWatching();
    };
  }, []);
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
  useEffect(() => {
    (async () => {
      const currentUser = await auth.currentUser.uid;
      await db.ref(`users/`).child(`${currentUser}/`).update({ location });
    })();
  }, [location]);
  useEffect(() => {
    (async () => {
      const currentUser = await auth.currentUser.uid;
      await db
        .ref()
        .child(`friend/${currentUser}/friends/`)
        .on("value", async function (snapshot) {
          let keys = [].concat(currentUser);
          await snapshot.forEach(function (childSnapshot) {
            const friendKey = childSnapshot.key;
            keys.push(friendKey);
          });
          setFriendList(keys);
        });
    })();
  }, []);
  useEffect(() => {
    const list = [];
    const getUserData = async (item, index) => {
      await db
        .ref()
        .child(`users/`)
        .orderByKey()
        .equalTo(item)
        .on("value", async function (snapshot) {
          if (snapshot.exists() && snapshot.hasChild(item)) {
            const getData = snapshot.val();
            if (Object.keys(getData).length) {
              Object.keys(getData).forEach(
                async (value) => await list.push(getData[value])
              );
            }
          }
        });
    };
    setData(list);
    friendList.forEach((item, index) => {
      return getUserData(item, index);
    });
  }, [location]);

  return (
    <View
      style={{
        ...styles.container,
        marginBottom: margin,
      }}
    >
      <StatusBar hidden={true} animated />
      <MapView
        provider={PROVIDER_GOOGLE}
        customMapStyle={customMap}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={styles.mapStyle}
        zoomControlEnabled
        showsCompass
        showsMyLocationButton
        showsUserLocation
        onMapReady={() => setMargin(0)}
      >
        {data.map((item, index) => (
          <Marker
            onPress={() => {
              setDestination(item);
            }}
            key={index}
            coordinate={{
              latitude: item.location.coords.latitude,
              longitude: item.location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            anchor={{ x: 0.5, y: 0.92 }}
            title={`${item.name}`}
          >
            <View style={styles.markerStyle}>
              <View>
                <Image
                  source={{ uri: item.profilePicture }}
                  style={styles.markerImage}
                />
              </View>
              <View style={styles.markerBottomStyle} />
            </View>
          </Marker>
        ))}
        {Object.keys(destination).length === 0 &&
        destination.constructor === Object ? null : (
          <MapViewDirections
            apikey="AIzaSyDvWvCYsAdNfOQCVr5H0a_MZIROGIqAoOE"
            origin={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            destination={{
              latitude: destination.location.coords.latitude,
              longitude: destination.location.coords.longitude,
            }}
            strokeWidth={4}
            strokeColor="red"
            optimizeWaypoints={true}
            mode="DRIVING"
            resetOnChange={false}
          />
        )}
      </MapView>
      <View style={styles.directionIconView}>
        <Ionicons
          name="ios-navigate"
          color="#1EA362"
          size={45}
          onPress={async () => {
            const deviceToken = destination.token.data;
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
                  title: `Find Friend - Travelling`,
                  sound: true,
                  vibrate: true,
                  body: `${cUser.name} is travelling towards you`,
                },
              }),
            });
          }}
        />
      </View>
    </View>
  );
};

export default MapDetail;
