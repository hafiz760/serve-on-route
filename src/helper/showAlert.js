import Toast from "react-native-toast-message";

export const showMessage = (type, primaryText, secondaryText = "") => {
  Toast.show({
    type,
    text1: primaryText,
    text2: secondaryText,
  });
};
