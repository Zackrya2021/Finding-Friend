import React, { useState, useRef } from "react";
import { View, StatusBar, ToastAndroid, Text } from "react-native";
import styles from "./style";
import { Input, Button } from "../../../Components";
import { auth, cred, db } from "../../../firebase/firebase";
import { Formik } from "formik";
import * as yup from "yup";

const ChangeEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const currentPasswordInput = useRef(null);
  const newEmailInput = useRef(null);

  const changeEmailValidationSchema = yup.object().shape({
    currentPassword: yup
      .string()
      .min(6, ({ min }) => `Password must be at least ${min} characters`)
      .required("Password is required"),
    newEmail: yup
      .string()
      .email("Please enter valid email")
      .required("Email Address is Required"),
  });

  const reAuthenticate = (values) => {
    var user = auth.currentUser;
    var credentials = cred.credential(user.email, values.currentPassword);
    return user.reauthenticateWithCredential(credentials);
  };

  const changeEmailHandler = async (values) => {
    setIsLoading(true);
    reAuthenticate(values)
      .then(async () => {
        var user = auth.currentUser;
        await user
          .updateEmail(values.newEmail)
          .then(async () => {
            var userId = auth.currentUser.uid;
            var rootRef = db.ref().child("users/" + userId);
            var updateEmail = { email: values.newEmail };
            await rootRef
              .update(updateEmail)
              .then(() => {
                setIsLoading(false);
                ToastAndroid.show(
                  "Email Updated Successfully",
                  ToastAndroid.LONG
                );
              })
              .catch((error) => {
                setIsLoading(false);
                ToastAndroid.show(`${error.message}`, ToastAndroid.LONG);
              });
          })
          .catch((error) => {
            setIsLoading(false);
            ToastAndroid.show(`${error.message}`, ToastAndroid.LONG);
          });
      })
      .catch((error) => {
        setIsLoading(false);
        ToastAndroid.show(`${error.message}`, ToastAndroid.LONG);
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} animated />
      <Formik
        validationSchema={changeEmailValidationSchema}
        initialValues={{
          currentPassword: "",
          newEmail: "",
        }}
        onSubmit={changeEmailHandler}
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
            <Input
              name="currentPassword"
              label="Current Password"
              autoCorrect={false}
              secureTextEntry={true}
              value={values.currentPassword}
              onChangeText={handleChange("currentPassword")}
              onBlur={handleBlur("currentPassword")}
              returnKeyType="next"
              blurOnSubmit={false}
              refs={currentPasswordInput}
              onSubmitEditing={() => newEmailInput.current.focus()}
            />
            {errors.currentPassword && touched.currentPassword && (
              <Text style={styles.errorStyle}>{errors.currentPassword}</Text>
            )}
            <Input
              name="newEmail"
              label="New Email"
              autoCapitalize="none"
              value={values.newEmail}
              autoCorrect={false}
              onChangeText={handleChange("newEmail")}
              onBlur={handleBlur("newEmail")}
              returnKeyType="done"
              refs={newEmailInput}
            />
            {errors.newEmail && touched.newEmail && (
              <Text style={styles.errorStyle}>{errors.newEmail}</Text>
            )}
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

export default ChangeEmail;
