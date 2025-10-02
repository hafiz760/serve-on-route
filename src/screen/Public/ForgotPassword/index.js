import React, { useState, useRef } from "react";
import { View, Image, ScrollView } from "react-native";
import { Container, Content, Text, Icon } from "../../../component/Basic";
import { TextInput, Button } from "../../../component/Form";
import styles from "./styles";
import AppSpinner from "../../../component/AppSpinner";
import theme from "../../../theme/styles";

import Header from "../../../component/Header";
import { DarkStatusBar } from "../../../component/StatusBar";
import PhoneInput from "react-native-phone-number-input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  login,
  updateUser,
  verfied,
  updateToken,
} from "../../../store/reducers/session";
import { initilizeSocket } from "../../../store/reducers/socketReducer";
import { showMessage } from "../../../helper/showAlert";
// import { BASE_URL, URL_V } from "@env";
import { BASE_URL, URL_V } from "../../../utilities/helper";
import { navigate, navigateReset } from "../../../navigations";

var qs = require("qs");
export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [isSelected, setSelection] = useState(false);
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  var temp = 0;
  const phoneInput = useRef();

  const method = async (response) => {
    navigateReset("PublicHome");
    await AsyncStorage.setItem("response", JSON.stringify(response?.data));
    await AsyncStorage.setItem("accessToken", response?.data.access_token);
    await AsyncStorage.setItem("role", "User");
  };

  const getInformation = async (datas) => {
    // console.log("getInformation called");
    try {
      const data = await axios.get(
        `${BASE_URL}${URL_V}users/user-by-id/${datas?._id}`,
        {
          headers: {
            Authorization: `Bearer ${datas.access_token}`,
          },
        }
      );
      // console.log("data usewr login",JSON.stringify(data.data.data.first_name,null,2));
      await AsyncStorage.setItem("userName", data.data.data.first_name);
      await AsyncStorage.setItem("lastName", data.data.data.last_name);
      if (data.data.data?.isVerified) {
        dispatch(verfied({}));
      }
      // console.log("dataSS",data.data.data?.isVerified)
    } catch (e) {
      console.log("error", e);
    }
  };
  async function Confirmation() {
    console.log("Confirmation called");


    var cd = {
      identifier: value,
    };
    // console.log("from data",cd);
    setLoading(true);
    axios
      .post(`${BASE_URL}${URL_V}auth/login`, qs.stringify(cd))
  }

  const onSubmit = (value) => {
    const checkValid = phoneInput.current?.isValidNumber(value);

    if (checkValid) {


      var cd = {
        phone_number: value,
      };
      AsyncStorage.setItem("phoneNumber", cd.phone_number);
      // console.log("from data",cd);
      setLoading(true);
      axios
        .post(`${BASE_URL}${URL_V}auth/send-otp`, qs.stringify(cd))
        .then(()=>{
          if(statusCode==200 || statusCode==500)
          console.log("API Hitted")
          setLoading(false);
          navigate("PublicVerification"
          , {
            values: value,
            screen: true,
            // role: isSelected,
          });
        })
        .catch((err)=>{
          setLoading(false);
          console.log(err.message);
          navigate("PublicVerification"
          , {
            values: value,
            screen: true,
            // role: isSelected,
          });
        })
        
       
      // console.log(value);
      // Confirmation();
    } else {
      showMessage("error", "Invalid Phone Number");
    }
  };

  return (
    <Container style={styles.container}>
      <DarkStatusBar />
     
     
      <Image
        source={{
          uri: "https://cdn.pixabay.com/photo/2018/08/01/21/49/peterbilt-3578297_960_720.jpg",
        }}
        resizeMode="cover"
        style={[styles.ForgotBgImg]}
      />
      
      <View style={styles.forgotBgCover} />
    
      <View style={styles.forgotBgContainer}>
        <Content contentContainerStyle={theme.layoutDf}>
        <Header leftType="back" />
          <View style={styles.forgotUpForm}>
         
            <Image
              source={require("../../../assets/images/lock.png")}
              style={[styles.ForgotImg, { marginTop: 20 }]}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.forgotTitle}>Forgot Password</Text>
              <Text style={styles.forgotText}>
            Enter your phone number to reset your password
              </Text>
            </View>


            <ScrollView>
              <View>
                <PhoneInput
                  ref={phoneInput}
                  // value={value}
                  defaultValue={value}
                  defaultCode="PK"
                  textInputStyle={{ padding: 2 }}
                  containerStyle={{
                    width: "100%",
                    height: 60,
                    borderRadius: 10,
                  }}
                  textContainerStyle={styles.formInput4}
                  onChangeFormattedText={(text) => {
                    setValue(text);
                  }}
                  withShadow
                  autoFocus
                />

                <Button
                  style={styles.forgotBtn}
                  onPress={() => {
                    if (!loading) {
                      onSubmit(value);
                    }
                  }}
                >
                  {!loading ? (
                    <Text style={styles.forgotBtnText}>CONFIRM</Text>
                  ) : (
                    <AppSpinner />
                  )}
                </Button>
              </View>

            </ScrollView>
          </View>
        </Content>
      </View>
    </Container>
  );
}
