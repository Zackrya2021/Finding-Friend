import React from "react";
import { View } from "react-native";
import { Input as InputField } from "react-native-elements";

const Input = ({
  label,
  autoCorrect,
  autoCapitalize,
  value,
  onChangeText,
  secureTextEntry,
  returnKeyType,
  refs,
  onSubmitEditing,
  defaultValue,
  name,
  onBlur,
  ...rest
}) => (
  <View style={{ marginHorizontal: 10 }}>
    <InputField
      label={label}
      autoCorrect={autoCorrect}
      autoCapitalize={autoCapitalize}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      returnKeyType={returnKeyType}
      ref={refs}
      onSubmitEditing={onSubmitEditing}
      defaultValue={defaultValue}
      name={name}
      onBlur={onBlur}
      {...rest}
    />
  </View>
);

export default Input;
