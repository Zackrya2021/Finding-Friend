import React from "react";
import { View } from "react-native";
import { Button as Btn } from "react-native-elements";

const Button = ({
  title,
  onPress,
  style,
  loading,
  loadingProps,
  disabled,
  icon,
  iconRight,
  type,
}) => {
  return (
    <View style={{ marginHorizontal: 80 }}>
      <Btn
        title={title}
        onPress={onPress}
        buttonStyle={style}
        loading={loading}
        loadingProps={loadingProps}
        disabled={disabled}
        icon={icon}
        iconRight={iconRight}
        type={type}
      />
    </View>
  );
};

export default Button;
