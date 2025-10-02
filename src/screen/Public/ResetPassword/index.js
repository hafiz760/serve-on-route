import React, { useState, useRef } from "react";
import { View, ScrollView, Image } from "react-native";
import { Container, Content, Text, Icon } from "../../../component/Basic";
import { TextInput, Button } from "../../../component/Form";
import { COLOR, FAMILY, SIZE } from "../../../theme/typography";
import styles from "./styles";
import theme from "../../../theme/styles";
import Header from "../../../component/Header";
import { showMessage } from "../../../helper/showAlert";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import { DarkStatusBar } from "../../../component/StatusBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppSpinner from "../../../component/AppSpinner";
import { BASE_URL, URL_V } from "../../../utilities/helper";
import { navigateReset } from "../../../navigations";

export default function ResetPassword() {
  const SubmitSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [eye1, setEye1] = useState(true);
  const [eye2, setEye2] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const phone = await AsyncStorage.getItem("phoneNumber");

      const response = await axios.put(`${BASE_URL}${URL_V}auth/update-password`, {
        phone_number: phone,
        newPassword: values.password,
      });

      if (response.status === 200) {
        console.log("Password changed successfully");
        navigateReset("PublicLogin");
      } else {
        console.log("Failed to change password", response.data);
      }
    } catch (error) {
      console.error("Error during password reset", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <DarkStatusBar />
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
            <Header leftType="back" />
            <View style={styles.signUpForm}>
              <Image
                source={require("../../../assets/images/lock.png")}
                style={[styles.signUpImg, { marginTop: 20 }]}
              />
              <View style={{ marginBottom: -35 }}>
                <Text style={styles.signUpTitle}>CHANGE PASSWORD</Text>
              </View>
              <Formik
                initialValues={{
                  password: "",
                  confirmPassword: "",
                }}
                validationSchema={SubmitSchema}
                onSubmit={onSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                }) => (
                  <View style={{ marginTop: 20 }}>
                    <View>
                      <TextInput
                        placeholder="New Password"
                        secureTextEntry={eye2}
                        placeholderTextColor="rgba(0,0,0,0.7)"
                        style={styles.formInput3}
                        value={values.password}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                      />
                      {touched.password && errors.password && (
                        <Text style={{
                          marginBottom: 5,
                          color: COLOR.Error,
                          fontFamily: FAMILY.REGULAR,
                          fontSize: 12,
                          marginTop: -10,
                        }}>{errors.password}</Text>
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
                        placeholderTextColor="rgba(0,0,0,0.7)"
                        style={[styles.formInput3]}
                        value={values.confirmPassword}
                        onChangeText={handleChange("confirmPassword")}
                        onBlur={handleBlur("confirmPassword")}
                      />
                      {touched.confirmPassword && errors.confirmPassword && (
                        <Text style={{
                          marginBottom: 5,
                          color: COLOR.Error,
                          fontFamily: FAMILY.REGULAR,
                          fontSize: 12,
                          marginTop: -10,
                        }}>{errors.confirmPassword}</Text>
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
                      style={[styles.signUpBtn]}
                      onPress={handleSubmit}
                    >
                      {!loading ? (
                        <Text style={styles.signUpBtnText}>CHANGE PASSWORD</Text>
                      ) : (
                        <AppSpinner />
                      )}
                    </Button>
                  </View>
                )}
              </Formik>
            </View>
          </Content>
        </ScrollView>
      </View>
    </Container>
  );
}
