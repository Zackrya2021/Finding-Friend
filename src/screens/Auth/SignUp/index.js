import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ToastAndroid,
} from "react-native";
import { registerWithEmail, auth, rootRef } from "../../../firebase/firebase";
import { KeyboardAvoiding, Button, Input } from "../../../Components/index";
import styles from "./style";
import { Formik } from "formik";
import * as yup from "yup";

const SignUp = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const fullNameInput = useRef(null);
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const confirmPasswordInput = useRef(null);

  const signupValidationSchema = yup.object().shape({
    fullName: yup
      .string()
      .matches(/(\w.+\s).+/, "Enter at least 2 names")
      .required("Full name is required"),
    email: yup
      .string()
      .email("Please enter valid email")
      .required("Email Address is Required"),
    password: yup
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
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords do not match")
      .required("Confirm password is required"),
  });

  const signupHandler = async (values) => {
    setIsLoading(true);

    const response = await registerWithEmail(
      values.email,
      values.password
    ).catch((error) => {
      setIsLoading(false);
      ToastAndroid.show(`${error.message}`, ToastAndroid.LONG);
    });
    if (response.user.uid) {
      const user = {
        userId: response.user.uid,
        name: values.fullName,
        email: values.email,
        profilePicture: "",
        bio: "",
      };
      await rootRef
        .child(auth.currentUser.uid)
        .set(user)
        .catch((error) => {
          setIsLoading(false);
          ToastAndroid.show(`${error.message}`, ToastAndroid.LONG);
        })
        .then((res) => {
          setIsLoading(false);
          props.navigation.navigate("ChooseProfilePicture");
        });
    }
  };
  return (
    <View style={styles.Container}>
      <StatusBar hidden={true} animated />
      <KeyboardAvoiding>
        <Text style={styles.headerText}>Sign Up to Find Friend</Text>
        <View style={styles.inputContainer}>
          <Formik
            validationSchema={signupValidationSchema}
            initialValues={{
              fullName: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            onSubmit={signupHandler}
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
                  name="fullName"
                  label="Full Name"
                  autoCorrect={false}
                  value={values.fullName}
                  onChangeText={handleChange("fullName")}
                  onBlur={handleBlur("fullName")}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  refs={fullNameInput}
                  onSubmitEditing={() => emailInput.current.focus()}
                />
                {errors.fullName && touched.fullName && (
                  <Text style={styles.errorStyle}>{errors.fullName}</Text>
                )}
                <Input
                  name="email"
                  label="Email"
                  autoCapitalize="none"
                  value={values.email}
                  autoCorrect={false}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  refs={emailInput}
                  onSubmitEditing={() => passwordInput.current.focus()}
                />
                {errors.email && touched.email && (
                  <Text style={styles.errorStyle}>{errors.email}</Text>
                )}
                <Input
                  name="password"
                  label="Password"
                  autoCorrect={false}
                  secureTextEntry={true}
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  refs={passwordInput}
                  onSubmitEditing={() => confirmPasswordInput.current.focus()}
                />
                {errors.password && touched.password && (
                  <Text style={styles.errorStyle}>{errors.password}</Text>
                )}
                <Input
                  name="confirmPassword"
                  label="Confirm Password"
                  autoCorrect={false}
                  secureTextEntry={true}
                  value={values.confirmPassword}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  returnKeyType="done"
                  refs={confirmPasswordInput}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <Text style={styles.errorStyle}>
                    {errors.confirmPassword}
                  </Text>
                )}
                <Button
                  title="Sign Up"
                  onPress={handleSubmit}
                  disabled={!isValid}
                  loading={isLoading}
                  icon={{
                    name: "person-add",
                    type: "material",
                    size: 20,
                    color: "white",
                  }}
                  iconRight
                  style={styles.buttonStyle}
                />
              </>
            )}
          </Formik>
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.accountText}>Already have an Account? </Text>
          <TouchableOpacity onPress={() => props.navigation.navigate("LogIn")}>
            <Text style={styles.loginText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoiding>
    </View>
  );
};

export default SignUp;
