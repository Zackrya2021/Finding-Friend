import React, { useState, useRef } from "react";
import {
  View,
  StatusBar,
  TouchableOpacity,
  ToastAndroid,
  Text,
} from "react-native";
import styles from "./style";
import { Avatar } from "react-native-elements";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Button, Input } from "../../../Components";
import { auth, db, storage } from "../../../firebase/firebase";
import { Formik } from "formik";
import * as yup from "yup";

const EditProfile = (props) => {
  const userInfo = props.navigation.state.params;
  const { bio, name, profilePicture } = userInfo;
  const [_profilePicture, setProfilePicture] = useState(profilePicture);
  const [isLoading, setIsLoading] = useState(false);
  const fullNameInput = useRef(null);
  const bioInput = useRef(null);

  const editProfileValidationSchema = yup.object().shape({
    fullName: yup
      .string()
      .matches(/(\w.+\s).+/, "Enter at least 2 names")
      .required("Full name is required"),
  });

  const chooseImage = async () => {
    setIsLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
    });
    if (!result.cancelled) {
      await _uploadToStorage(result.uri);
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
        setProfilePicture(url);
        setIsLoading(false);
      }
    );
  };

  const editProfileHandler = async (values) => {
    setIsLoading(true);
    var userId = auth.currentUser.uid;
    var rootRef = db.ref().child("users/" + userId);
    var editInfo = {
      name: values.fullName,
      bio: values._bio,
      profilePicture: _profilePicture,
    };
    await rootRef
      .update(editInfo)
      .then(() => {
        setIsLoading(false);
        ToastAndroid.show("Profile Updated Successfully", ToastAndroid.LONG);
      })
      .catch((error) => {
        setIsLoading(false);
        ToastAndroid.show(`${error.message}`, ToastAndroid.LONG);
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} animated />
      <View style={styles.imageView}>
        <TouchableOpacity
          onPress={() => {
            chooseImage();
          }}
        >
          <Avatar rounded size={150} source={{ uri: _profilePicture }} />
          <Feather
            name="camera"
            size={23}
            color="black"
            style={styles.cameraIcon}
          />
        </TouchableOpacity>
      </View>

      <Formik
        validationSchema={editProfileValidationSchema}
        initialValues={{
          fullName: name,
          _bio: bio,
        }}
        onSubmit={editProfileHandler}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isValid,
          touched,
        }) => (
          <>
            <View>
              <Input
                name="fullName"
                label="Full Name"
                autoCorrect={false}
                value={values.fullName}
                onChangeText={handleChange("fullName")}
                onBlur={handleBlur("fullName")}
                returnKeyType="next"
                blurOnSubmit={false}
                refs={fullNameInput}
                onSubmitEditing={() => bioInput.current.focus()}
              />
              {errors.fullName && touched.fullName && (
                <Text style={styles.errorStyle}>{errors.fullName}</Text>
              )}
              <Input
                name="_bio"
                label="Bio"
                value={values._bio}
                onChangeText={handleChange("_bio")}
                onBlur={handleBlur("_bio")}
                returnKeyType="done"
                refs={bioInput}
              />
              {errors._bio && touched._bio && (
                <Text style={styles.errorStyle}>{errors._bio}</Text>
              )}
            </View>
            <Button
              title="Update"
              style={styles.buttonStyle}
              loading={isLoading}
              onPress={handleSubmit}
              disabled={!isValid}
              icon={{
                name: "refresh",
                type: "simple-line-icon",
                size: 20,
                color: "white",
              }}
              iconRight
            />
          </>
        )}
      </Formik>
    </View>
  );
};

export default EditProfile;
