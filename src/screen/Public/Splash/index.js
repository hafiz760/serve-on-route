import React, { useEffect } from "react";
import { Image, StatusBar, Text, View } from "react-native";
import styles from "./styles";

import { Container } from "../../../component/Basic";

import { useSelector } from "react-redux";
import { navigateReset } from "../../../navigations";

function Splash() {
  const { user } = useSelector((state) => state.session);

  useEffect(() => {
    setTimeout(() => {
      if (user) {
        navigateReset("PublicHome");
      } else {
        navigateReset("PublicIntro");
      }
    }, 2500);
  }, []);
 
  return (
    <Container>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.splash}>
        <View style={styles.splashContent}>
          <View style={styles.splashTop}>
            <Image
              source={require("../../../assets/images/logo6.png")}
              style={styles.splashImg}
              resizeMode="contain"
            />
            <Text style={styles.splashTitle}>Serve On Route</Text>
          </View>
        </View>
      </View>
    </Container>
  );
}

export default Splash;
