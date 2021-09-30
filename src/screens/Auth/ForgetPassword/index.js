import React, { useState } from "react";
import { Text, View, StatusBar, ToastAndroid } from "react-native";
import { passwordReset } from "../../../firebase/firebase";
import { Button, KeyboardAvoiding, Input } from "../../../Components";
import styles from "./style";
import { Formik } from "formik";
import * as yup from "yup";

const ForgetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const forgetPasswordValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter valid email")
      .required("Email Address is Required"),
  });

  const passwordResetHandler = (values) => {
    setIsLoading(true);
    passwordReset(values.email)
      .then(() => {
        setIsLoading(false);
        ToastAndroid.show(
          "Check Your Email to Reset Password",
          ToastAndroid.LONG
        );
      })
      .catch((error) => {
        setIsLoading(false);
        ToastAndroid.show(`${error.message}`, ToastAndroid.LONG);
      });
  };
  return (
    <KeyboardAvoiding>
      <View style={styles.container}>
        <StatusBar hidden={true} animated />
        <Text style={styles.headerText}>Forget Password</Text>
        <Formik
          validationSchema={forgetPasswordValidationSchema}
          initialValues={{ email: "" }}
          onSubmit={passwordResetHandler}
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
              />
              {errors.email && touched.email && (
                <Text style={styles.errorStyle}>{errors.email}</Text>
              )}
              <Button
                title="Forget Password"
                onPress={handleSubmit}
                disabled={!isValid}
                loading={isLoading}
                icon={{
                  name: "lock-reset",
                  type: "material-community",
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
    </KeyboardAvoiding>
  );
};

export default ForgetPassword;
