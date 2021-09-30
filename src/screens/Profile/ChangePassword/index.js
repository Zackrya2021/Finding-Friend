import React, { useState, useRef } from "react";
import { View, StatusBar, ToastAndroid, Text } from "react-native";
import { Input, Button } from "../../../Components";
import styles from "./style";
import { auth, cred } from "../../../firebase/firebase";
import { Formik } from "formik";
import * as yup from "yup";

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const currentPasswordInput = useRef(null);
  const newPasswordInput = useRef(null);
  const confirmNewPasswordInput = useRef(null);

  const changePasswordValidationSchema = yup.object().shape({
    currentPassword: yup
      .string()
      .min(6, ({ min }) => `Password must be at least ${min} characters`)
      .required("Password is required"),
    newPassword: yup
      .string()
      .matches(/\w*[a-z]\w*/, "Password must have a small letter")
      .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
      .matches(/\d/, "Password must have a number")
      .matches(
        /[!@#$%^&*()\-_"=+{}; :,<.>]/,
        "Password must have a special character"
      )
      .min(6, ({ min }) => `Password must be at least ${min} characters`)
      .required("Password is required"),
    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "Passwords do not match")
      .required("Confirm password is required"),
  });

  const reAuthenticate = async (values) => {
    var user = auth.currentUser;
    var credentials = cred.credential(user.email, values.currentPassword);
    return await user.reauthenticateWithCredential(credentials);
  };
  const changePasswordHandler = async (values) => {
    setIsLoading(true);

    await reAuthenticate(values)
      .then(async () => {
        var user = auth.currentUser;
        await user
          .updatePassword(values.newPassword)
          .then(() => {
            setIsLoading(false);
            ToastAndroid.show(
              "Password Updated Successfully",
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
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} animated />
      <Formik
        validationSchema={changePasswordValidationSchema}
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        }}
        onSubmit={changePasswordHandler}
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
              onSubmitEditing={() => newPasswordInput.current.focus()}
            />
            {errors.currentPassword && touched.currentPassword && (
              <Text style={styles.errorStyle}>{errors.currentPassword}</Text>
            )}
            <Input
              name="newPassword"
              label="New Password"
              autoCapitalize="none"
              secureTextEntry={true}
              value={values.newPassword}
              autoCorrect={false}
              onChangeText={handleChange("newPassword")}
              onBlur={handleBlur("newPassword")}
              returnKeyType="next"
              blurOnSubmit={false}
              refs={newPasswordInput}
              onSubmitEditing={() => confirmNewPasswordInput.current.focus()}
            />
            {errors.newPassword && touched.newPassword && (
              <Text style={styles.errorStyle}>{errors.newPassword}</Text>
            )}
            <Input
              name="confirmNewPassword"
              label="Confirm New Password"
              autoCapitalize="none"
              secureTextEntry={true}
              value={values.confirmNewPassword}
              autoCorrect={false}
              onChangeText={handleChange("confirmNewPassword")}
              onBlur={handleBlur("confirmNewPassword")}
              returnKeyType="done"
              refs={confirmNewPasswordInput}
            />
            {errors.confirmNewPassword && touched.confirmNewPassword && (
              <Text style={styles.errorStyle}>{errors.confirmNewPassword}</Text>
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

export default ChangePassword;
