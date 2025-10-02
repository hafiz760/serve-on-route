import React, { useState, useRef } from "react";
import { View, ScrollView, Image, Alert } from "react-native";
import { Container, Content, Text, Icon } from "../../../component/Basic";
import { TextInput, Button } from "../../../component/Form";
import { COLOR, FAMILY, SIZE } from "../../../theme/typography";
import PhoneInput from "react-native-phone-number-input";
import styles from "./styles";
import theme from "../../../theme/styles";
import DropDownPicker from "react-native-dropdown-picker";
import Header from "../../../component/Header";
import { showMessage } from "../../../helper/showAlert";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login, updateUser } from "../../../store/reducers/session";
import { initilizeSocket } from "../../../store/reducers/socketReducer";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { DarkStatusBar } from "../../../component/StatusBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFCMToken } from "../../../helper/pushnotification_helper";
import AppSpinner from "../../../component/AppSpinner";
// import {BASE_URL,URL_V} from "@env"
import { BASE_URL, URL_V } from "../../../utilities/helper";
import { navigate, navigateReset } from "../../../navigations";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
var qs = require("qs");
export default function SignUp() {
  const SignupSchema = Yup.object().shape({
    firstName: Yup.string()
      .trim()
      .required("First name is required")
      .matches(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
    lastName: Yup.string()
      .trim()
      .required("Last name is required")
      .matches(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
    gender: Yup.string()
      .required("Please select a gender")
      .oneOf(["male", "female", "other"], "Invalid gender selection"),
    phonenum: Yup.string()
      .required("Please enter your mobile number")
      .matches(
        /^(\+\d{3,3}[- ]?)?\d{9}$/,
        "Please enter a valid mobile number"
      ),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    newPassword: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });
  
  const phoneInput = useRef();
  const [value, setValue] = useState("");
  const onSubmit = () => {
    navigateReset("PublicVerification");
  };
  const [isSelected, setSelection] = useState(false);
  const [tabSelected, setTabSelected] = useState("User");
  const [valid, setValid] = useState(false);
  const [eye1, setEye1] = useState(true);
  const [eye2, setEye2] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  var temp = 0;
  // const [values, setValues] = useState(true);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ]);
  const method = async (response) => {
    // console.log("response in method",response)
    await AsyncStorage.setItem("response", JSON.stringify(response?.data));
    await AsyncStorage.setItem("role", "User");
    navigate("PublicVerification", {from:"signUP"  });
    // navigateReset("PublicHome");
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
      if (data.data.data?.isVerified) {
        dispatch(verfied({}));
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  async function logins(values) {
    var cd = {
      first_name: values.firstName,
      last_name: values.lastName,

      password: values.password,
      phone: values.phonenum,
      country: "pakisatn",
      city: "lahore",
      address: "lahore",
      ID: "string",
      gender: values.gender,
      role: [tabSelected == "User" ? "user" : "rider"],
    };

    console.log("HELLO WORLD", cd);

    try {
      // Convert the object to a JSON string and set it in AsyncStorage
      const jsonValue = JSON.stringify(cd);
      AsyncStorage.setItem('userData', jsonValue);
      console.log('Object stored successfully in AsyncStorage!');
    } catch (error) {
      console.error('Error storing object in AsyncStorage:', error);
    }

    setLoading(true);



    axios
      .post(`${BASE_URL}${URL_V}auth/signup`, qs.stringify(cd))
      .then((response) => {
        // console.log("CURRET LOGI===>1", response);
        if (response.status === 201) {
          // console.log("CURRET LOGI===>", response);

          if (response?.data?.status === 500) {
            return showMessage("error", "Duplicate account exists");
          }

          if (tabSelected === "Driver" && isSelected) {
            temp = 2;
            dispatch(login({}));
            getInformation(response?.data);
            dispatch(initilizeSocket(response.data.access_token));
            method(response);
            // showMessage("success", "Signup Successfully");
            // navigateReset("PublicVerification", { values });
          }

          if (tabSelected === "User" && !isSelected) {
            dispatch(login({}));
            getInformation(response?.data);
            dispatch(initilizeSocket(response.data.access_token));
            temp = 2;
            method(response);
            // showMessage("success", "Signup Successfully");
            // navigateReset("PublicVerification", { values });
          }
          if (temp != 2) {
            showMessage("error", "Something went wrong");
          }
          setLoading(false);
          return response.data;
        } else {
          showMessage("error", "Something went wrong");
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

        // console.log("CURRENT USER YAY!!! ===>", notificationResponse.data);
      })
      .catch((err) => {
        // console.log("error>>>", err.response.data);
        setLoading(false);
        showMessage("error", err?.response?.data.message);
      });

  }

  return (
    <Container style={styles.container}>
      <DarkStatusBar />
      <Header leftType="back" />
      <Image
        source={{
          uri: "https://cdn.pixabay.com/photo/2018/08/01/21/49/peterbilt-3578297_960_720.jpg",
        }}
        resizeMode="cover"
        style={styles.signUpBgImg}
      />
      <View style={styles.signUpBgCover} />
      <View style={styles.signUpBgContainer}>
        <ScrollView>
          <Content contentContainerStyle={theme.layoutDf}>
            <View style={styles.signUpForm}>
              <Image
                source={require("../../../assets/images/logo6.png")}
                style={[styles.signUpImg]}
              />
              <View >
                <Text style={styles.signUpTitle}>Serve On Route</Text>
                <Text style={styles.signUpText}>
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

              <Formik
                initialValues={{
                  firstName: "",
                  lastName: "",
                  phonenum: "",
                  gender: "",
                  password: "",
                  newPassword: "",
                }}
                validationSchema={SignupSchema}
                onSubmit={(values) => {
                  const checkValid = phoneInput.current?.isValidNumber(value);
                  setValid(checkValid ? checkValid : false);

                 
                  setValue(values);
                  console.log(values, valid);
                  logins(values);
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  setFieldTouch,
                  isValid,
                  setFieldValue,
                  handleSubmit,
                }) => (
                  <View style={{ marginTop: 20 }}>
                    <View style={[styles.formRow, { marginTop: -20 }]}>
                      <View style={{ width: "48%" }}>
                        <TextInput
                          placeholder="First Name"
                          placeholderTextColor="rgba(0,0,0,0.7)"
                          style={[styles.formInput]}
                          value={values.firstName}
                          onChangeText={handleChange("firstName")}
                        />
                        {errors.firstName && (
                          <Text
                            style={{
                              marginBottom: 5,
                              color: COLOR.Error,
                              fontFamily: FAMILY.BOLD,
                              fontSize: 12,
                              marginTop: -10,
                            }}
                          >
                            {errors.firstName}
                          </Text>
                        )}
                      </View>
                      <View style={{ width: "48%" }}>
                        <TextInput
                          placeholder="Last Name"
                          placeholderTextColor="rgba(0,0,0,0.7)"
                          style={[styles.formInput]}
                          value={values.lastName}
                          onChangeText={handleChange("lastName")}
                        />

                        {errors.lastName && (
                          <Text
                            style={{
                              marginBottom: 5,
                              color: COLOR.Error,
                              fontSize: 12,
                              fontFamily: FAMILY.REGULAR,
                              marginTop: -10,
                            }}
                          >
                            {errors.lastName}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.formRow}>
                      <View
                        style={{
                          width: "100%",
                        }}
                      >
                        <DropDownPicker
                          open={open}
                          items={items}
                          setOpen={setOpen}
                          value={values.gender}
                          onSelectItem={(e) => setFieldValue("gender", e.value)}
                          // setValue={handleChange("gender")}
                          setItems={setItems}
                          placeholder="Select your gender"
                          style={{ marginBottom:open?hp(13): hp(1) }}
                        />
                        {errors.gender && (
                          <Text
                            style={{
                              fontFamily: FAMILY.REGULAR,
                              color: COLOR.Error,
                              fontSize: 12,
                            }}
                          >
                            {errors.gender}
                          </Text>
                        )}
                      </View>
                    </View>
                    <PhoneInput
                      ref={phoneInput}
                      defaultValue={value}
                      defaultCode="PK"
                      textInputStyle={{ padding: 2 }}
                      containerStyle={{
                        width: "100%",
                        height: hp(8),
                        borderRadius: hp(1),
                        marginBottom: hp(2),
                        marginTop: hp(1),
                      }}
                      textContainerStyle={styles.formInput4}
                      value={values.phonenum}
                      // onChangeText={handleChange("phonenum")}
                      onChangeFormattedText={(text) => {
                        setFieldValue("phonenum", text);
                        // setValue(text);
                      }}
                      // withDarkTheme
                      withShadow
                      autoFocus
                    />
                    {errors.phonenum && (
                      <Text
                        style={{
                          marginBottom: 5,
                          color: COLOR.Error,
                          fontFamily: FAMILY.REGULAR,
                          fontSize: 12,
                          marginTop: -10,
                        }}
                      >
                        {errors.phonenum}
                      </Text>
                    )}
                    <View>
                      <TextInput
                        placeholder="Password"
                        secureTextEntry={eye2}
                        placeholderTextColor="rgba(0,0,0,0.7)"
                        style={[styles.formInput3]}
                        value={values.password}
                        onChangeText={handleChange("password")}
                      />
                      {errors.password && (
                        <Text
                          style={{
                            marginBottom: 5,
                            color: COLOR.Error,
                            fontSize: 12,
                            fontFamily: FAMILY.REGULAR,
                            marginTop: -10,
                          }}
                        >
                          {errors.password}
                        </Text>
                      )}

                      <Icon
                        name={eye2 ? "eye-slash" : "eye"}
                        type="FontAwesome"
                        style={[
                          theme.SIZE_18,
                          theme.PRIMARY,
                          { right: "-88%", bottom: "60%" },
                        ]}
                        onPress={() => {
                          setEye2((val) => !val);
                        }}
                      />
                    </View>

                    <View style={{ marginTop: -18 }}>
                      <TextInput
                        placeholder="Confirm Password"
                        secureTextEntry={eye1}
                        value={values.newPassword}
                        onChangeText={handleChange("newPassword")}
                        placeholderTextColor="rgba(0,0,0,0.7)"
                        style={[styles.formInput3]}
                      />
                      {errors.newPassword && (
                        <Text
                          style={{
                            marginBottom: 5,
                            color: COLOR.Error,
                            fontFamily: FAMILY.REGULAR,
                            fontSize: 12,
                            marginTop: -10,
                          }}
                        >
                          {errors.newPassword}
                        </Text>
                      )}

                      <Icon
                        name={eye1 ? "eye-slash" : "eye"}
                        type="FontAwesome"
                        style={[
                          theme.SIZE_18,
                          theme.PRIMARY,
                          { right: "-88%", bottom: "60%" },
                        ]}
                        onPress={() => {
                          setEye1((val) => !val);
                        }}
                      />
                    </View>

                    <Button
                      style={[styles.signUpBtn, { marginTop: -18 }]}
                      onPress={handleSubmit}
                    >
                      {!loading ? (
                        <Text style={styles.signUpBtnText}>
                    NEXT
                        </Text>
                      ) : (
                        <AppSpinner />
                      )}
                    </Button>
                    {/* <Button onPress={handleSubmit} title="Submit" /> */}
                  </View>
                )}
              </Formik>
              <View style={styles.signUpContent}>

                <Text style={styles.connectText}>
                If you Have already account?
                  <Text
                    onPress={() => {
                      navigateReset("PublicLogin");
                      // alert(firstName)
                    }}
                    style={styles.connectTextLink}
                  >
                  LOGIN
                  </Text>
                </Text>
              </View>
            </View>
          </Content>
        </ScrollView>
      </View>
    </Container>
  );
}
