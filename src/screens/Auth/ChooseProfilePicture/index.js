import React, { useState } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { Avatar } from "react-native-elements";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { storage, auth, rootRef } from "../../../firebase/firebase";
import styles from "./style";

const ChooseProfilePicture = (props) => {
  const [imageUri, setImageUri] = useState(
    "https://icons-for-free.com/iconfiles/png/512/avatar+human+man+profile+icon-1320085876716628234.png"
  );
  const [buttonVisible, setButtonVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const chooseImage = async () => {
    setIsLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
    });
    if (!result.cancelled) {
      await _uploadToStorage(result.uri);
      setButtonVisible(false);
    } else {
      setIsLoading(false);
    }
  };

  const _uploadToStorage = async (imageUrl) => {
    const path = `profiles_picture/${auth.currentUser.uid}`;
    const response = await fetch(imageUrl);
    const file = await response.blob();
    const upload = storage.ref(path).put(file);
    upload.on(
      "state_changed",
      (snapshot) => {},
      (err) => {
        ToastAndroid.show(`${err.message}`, ToastAndroid.LONG);
      },
      async () => {
        const url = await upload.snapshot.ref.getDownloadURL();
        setImageUri(url);
        await _uploadToDB(url);
      }
    );
  };

  const _uploadToDB = async (url) => {
    await rootRef.child(auth.currentUser.uid).update({
      profilePicture: url,
    });
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} animated />
      <Avatar
        onPress={() => chooseImage()}
        size={150}
        source={{ uri: imageUri }}
        rounded
        containerStyle={styles.avatar}
      />
      <Feather
        name="camera"
        size={23}
        color="black"
        style={styles.cameraIcon}
        onPress={() => chooseImage()}
      />
      <TouchableOpacity
        onPress={() => chooseImage()}
        style={styles.chooseProfile}
      >
        <Text style={styles.chooseProfileText}>Choose Profile Picture</Text>
      </TouchableOpacity>
      <View style={styles.bottomContainer}>
        {buttonVisible === true ? (
          <TouchableOpacity
            onPress={async () => {
              await _uploadToStorage(imageUri);
              props.navigation.navigate("MapDetail");
            }}
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        ) : isLoading === true ? (
          <ActivityIndicator color="#0984e3" size="small" />
        ) : (
          <TouchableOpacity
            onPress={() => props.navigation.navigate("MapDetail")}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ChooseProfilePicture;
