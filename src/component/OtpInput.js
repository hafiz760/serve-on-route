import React, { useRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

const OtpInput = ({ length = 4, onComplete ,iscode }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputs = useRef([]);

  const focusNext = (index) => {
    if (index < length - 1 && inputs.current[index + 1]) {
      inputs.current[index + 1].focus();
    }
  };

  const focusPrev = (index) => {
    if (index > 0 && inputs.current[index - 1]) {
      inputs.current[index - 1].focus();
    }
  };

  const handleChangeText = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text) {
      focusNext(index);
    }

    if (newOtp.every((val) => val !== "") && onComplete) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyPress = ({ nativeEvent: { key } }, index) => {
    if (key === "Backspace" && !otp[index]) {
      focusPrev(index);
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((value, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputs.current[index] = ref)}
          style={[
            styles.input,
            { marginHorizontal: index !== 0 || index !== length - 1 ? 10 : 0,borderColor:iscode?"red":"white" },
          ]}
          keyboardType="numeric"
          maxLength={1}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          value={value}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },
  input: {
    width: 40,             
    height: 40,              
    borderRadius: 5,       
    borderWidth: 1,
    borderColor: "white",   
    textAlign: "center",
    fontSize: 16,
    color:"white",
    backgroundColor: "transparent", 
  },
});

export default OtpInput;
