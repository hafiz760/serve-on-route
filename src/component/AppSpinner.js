import React from "react";
import { ActivityIndicator } from "react-native";

const AppSpinner = ({ color = "white", size = "small" }) => {
  return <ActivityIndicator size={size} color={color} />;
};

export default AppSpinner;
