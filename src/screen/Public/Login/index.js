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
import { getFCMToken } from "../../../helper/pushnotification_helper";
import { showMessage } from "../../../helper/showAlert";
import { logIn } from "../../../services/apicalls/auth";
// import { BASE_URL, URL_V } from "@env";
import { BASE_URL, URL_V } from "../../../utilities/helper";
import { navigate, navigateReset } from "../../../navigations";
var qs = require("qs");
export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [isSelected, setSelection] = useState(false);
  const [value, setValue] = useState("");
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(true);
  const [tabSelected, setTabSelected] = useState("User");
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
    try {
      const data = await axios.get(
        `${BASE_URL}${URL_V}users/user-by-id/${datas?._id}`,
        {
          headers: {
            Authorization: `Bearer ${datas.access_token}`,
          },
        }
      );
      dispatch(updateUser(data.data.data));
      await AsyncStorage.setItem("userName", data.data.data.first_name);
      await AsyncStorage.setItem("avtar", data.data.data.avatar);
      await AsyncStorage.setItem("lastName", data.data.data.last_name);
      if (data.data.data?.isVerified) {
        dispatch(verfied({}));
      }
    } catch (e) {
      console.log("error", e);
    }
  };
  async function logins() {
    console.log("login called");
    var cd = {
      identifier: value,
      password,
    };
    console.log("from data", cd);
    setLoading(true);
    console.log(
      "after log in true",
      // `${BASE_URL}auth/login`
      `${BASE_URL}${URL_V}auth/login`
    );
    try {
      console.log("try");
      axios
        .post(`${BASE_URL}${URL_V}auth/login`, qs.stringify(cd))
        .then((response) => {
          console.log("CURRET LOGIN===>", response.data.status);
          if (response.data.status === 200) {
            if (
              tabSelected === "Driver" &&
              response?.data.roles[0] != "user" &&
              isSelected
            ) {
              temp = 2;
              dispatch(updateToken(response.data.access_token));
              getInformation(response?.data);
              dispatch(login({}));
              dispatch(updateUser(response.data));
              dispatch(initilizeSocket(response.data.access_token));
              method(response);
              // showMessage("success", "Login Succefully");
            }
            if (
              tabSelected === "User" &&
              response?.data.roles[0] == "user" &&
              !isSelected
            ) {
              // consol  dispatch(login({}));e.log("ye vlog vchala");
              
              dispatch(updateToken(response.data.access_token));
              getInformation(response?.data);
              dispatch(initilizeSocket(response.data.access_token));
              dispatch(updateToken(response.data.access_token));
              dispatch(updateUser(response.data));
              temp = 2;
              method(response);
              // showMessage("success", "Login Succefully");
            }
            if (temp != 2) {
              showMessage("error", "You cant be logins");
            }
            setLoading(false);
            return response.data;
          } else if (response.data.status === 403) {
            showMessage("error", response?.data?.message);
          } else {
            showMessage("error", "You cant be login.");
          }
        })
        .then(async (userDetails) => {
          const firebaseToken = await getFCMToken();
          const notificationResponse = await axios.post(
            `${BASE_URL}${URL_V}notifications/accept`,
            {
              notification_token: firebaseToken,
              device_type: "mobile_device",
            },
            {
              headers: {
                authorization: `Bearer ${userDetails.access_token}`,
              },
            }
          );
        })
        .catch((err) => {
          console.log("error>>>", err.message);

          if (err?.response?.status === 401) {
            showMessage("error", err.response.data.message);
            console.log("error", err.message);
            setLoading(false);
          } else if (err?.response?.status === 403) {
            showMessage("error", "User already signin another devices");
          }else if (err?.response?.status === 404) {
            showMessage("error", err.response?.data?.message);
          }
          setLoading(false);
        });
    } catch (error) {
      console.log(">>>>>>>", JSON.stringify(error.message));
    }
  }
  const onSubmit = () => {
    const checkValid = phoneInput.current?.isValidNumber(value);

    if (checkValid) {
      // navigate("PublicVerification", {
      //   values: value,
      //   screen: true,
      //   role: isSelected,
      // });
      console.log(password, value);
      logins();
    } else {
      showMessage("error", "Invalid Phone Number");
    }
  };
  return (
    <Container style={styles.container}>
      <DarkStatusBar />
      <Header leftType="back" />
      <Image
        source={{
          uri: "https://cdn.pixabay.com/photo/2018/08/01/21/49/peterbilt-3578297_960_720.jpg",
        }}
        resizeMode="cover"
        style={[styles.signUpBgImg]}
      />

      <View style={styles.signUpBgCover} />

      <View style={styles.signUpBgContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Content contentContainerStyle={theme.layoutDf}>
            <View style={styles.signUpForm}>
              <Image
                source={require("../../../assets/images/logo6.png")}
                style={[styles.loginUpImg]}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.loginTitle}>Serve On Route</Text>
                <Text style={styles.loginText}>
                  Find a easy way to transfer your parcels
                </Text>
              </View>
              <View style={styles.tabInfo}>
                <Button
                  style={
                    tabSelected === "User"
                      ? styles.tabActive
                      : styles.tabInactive
                  }
                  onPress={() => {
                    setTabSelected("User");
                    setSelection(false);
                  }}
                >
                  <Text
                    style={
                      tabSelected === "User"
                        ? styles.tabTextActive
                        : styles.tabTextInactive
                    }
                  >
                    User
                  </Text>
                </Button>

                <Button
                  style={
                    tabSelected === "Driver"
                      ? styles.tabActive
                      : styles.tabInactive
                  }
                  onPress={() => {
                    setTabSelected("Driver");

                    setSelection(true);
                  }}
                >
                  <Text
                    style={
                      tabSelected === "Driver"
                        ? styles.tabTextActive
                        : styles.tabTextInactive
                    }
                  >
                Driver
                  </Text>
                </Button>
              </View>

              <View>
                <PhoneInput
                  ref={phoneInput}
                  defaultValue={value}
                  defaultCode="PK"
                  textInputStyle={{ padding: 2 }}
                  containerStyle={{
                    width: "100%",
                    // height: 60,
                    borderRadius: 10,
                    marginBottom: 15,
                  }}
                  textContainerStyle={styles.formInput4}
                  onChangeFormattedText={(text) => {
                    setValue(text);
                  }}
                  withShadow
                  autoFocus
                />

                <View>
                  <TextInput
                    placeholder="Password"
                    secureTextEntry={valid}
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="rgba(0,0,0,0.7)"
                    style={[styles.formInput3, {}]}
                  />

                  <Icon
                    name={valid ? "eye-slash" : "eye"}
                    type="FontAwesome"
                    style={[
                      theme.SIZE_18,
                      theme.PRIMARY,
                      { right: "-88%", bottom: "50%" },
                    ]}
                    onPress={() => {
                      setValid((val) => !val);
                    }}
                  />
                </View>

                <View style={{ marginBottom: 15, alignItems: "center" }}>
                  <Text
                    onPress={() => {
                      navigate("PublicForgotPassword");
                      // navigate("PublicVerification")
                    }}
                    style={styles.forgotText}
                  >
                  Forgot Password
                  </Text>
                </View>

                <Button
                  style={styles.loginUpBtn}
                  onPress={() => {
                    if (!loading) {
                      onSubmit();
                    }
                  }}
                >
                  {!loading ? (
                    <Text style={styles.loginBtnText}>LOGIN</Text>
                  ) : (
                    <AppSpinner />
                  )}
                </Button>
              </View>
              <View style={styles.signUpContent}>
                <View>
                  <Text style={styles.connectText}>
                  if you don’t have an account?
                    <Text
                      onPress={() => {
                        navigate("PublicSignUp");
                      }}
                      style={styles.connectTextLink}
                    >
                    SIGNUP
                    </Text>
                  </Text>
                </View>
                <Text style={styles.termText}>
              By Sign in I Agree to
                </Text>
                <Text style={styles.term2Text}>
                  Terms of Use & Privacy Policy
                </Text>
              </View>
            </View>
          </Content>
        </ScrollView>
      </View>
    </Container>
  );
}
