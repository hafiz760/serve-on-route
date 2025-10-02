import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
export default function TextInputComp(props) {
  return (
    <View style={[styles.parentCont, props.parentCont]}>
      <Text style={[styles.titleStyle, props.titleStyle]}>{props.title}</Text>
      <TextInput
      editable={props.editable}
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholderTextColor="#59499E99"
        style={[styles.textInputStyle, props.textInputStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  parentCont: {
    marginBottom: 10,
  },
  titleStyle: {
    fontWeight: "400",
    fontSize: 14,
    color: "#59499E",
  },
  textInputStyle: {
    backgroundColor: "#E6E6E6",
    borderRadius: 5,
    paddingHorizontal: 15,
    height:hp(7),
    color:"#000"
  },
});
