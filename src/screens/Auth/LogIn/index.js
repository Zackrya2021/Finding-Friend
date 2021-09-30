import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ToastAndroid,
} from "react-native";
import { loginWithEmail } from "../../../firebase/firebase";
import { Button, KeyboardAvoiding, Input } from "../../../Components";
import styles from "./style";
import { Formik } from "formik";
import * as yup from "yup";

const LogIn = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const emailInput = useRef(null);
  const passwordInput = useRef(null);

  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter valid email")
      .required("Email Address is Required"),
    password: yup
      .string()
      .min(6, ({ min }) => `Password must be at least ${min} characters`)
      .required("Password is required"),
  });

  const loginHandler = (values) => {
    setIsLoading(true);
    loginWithEmail(values.email, values.password)
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        ToastAndroid.show(`${error.message}`, ToastAndroid.LONG);
      });
  };

  return (
    <View style={styles.Container}>
      <StatusBar hidden={true} animated />
      <KeyboardAvoiding>
        <Text style={styles.headerText}>Log In to Find Friend</Text>
        <View style={styles.inputContainer}>
          <Formik
            validationSchema={loginValidationSchema}
            initialValues={{ email: "", password: "" }}
            onSubmit={loginHandler}
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
                  name="email"
                  label="Email"
                  autoCapitalize="none"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  returnKeyType="next"
                  refs={emailInput}
                  blurOnSubmit={false}
                  onSubmitEditing={() => passwordInput.current.focus()}
                />
                {errors.email && touched.email && (
                  <Text style={styles.errorStyle}>{errors.email}</Text>
                )}
                <Input
                  label="Password"
                  name="password"
                  autoCorrect={false}
                  secureTextEntry={true}
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  returnKeyType="done"
                  refs={passwordInput}
                />
                {errors.password && touched.password && (
                  <Text style={styles.errorStyle}>{errors.password}</Text>
                )}
                <Button
                  title="Log In"
                  onPress={handleSubmit}
                  disabled={!isValid}
                  loading={isLoading}
                  icon={{
                    name: "log-in",
                    type: "feather",
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
          <TouchableOpacity
            onPress={() => props.navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgetPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.signupContainer}>
          <Text style={styles.accountText}>Don't have an Account? </Text>
          <TouchableOpacity onPress={() => props.navigation.navigate("SignUp")}>
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoiding>
    </View>
  );
};

export default LogIn;
