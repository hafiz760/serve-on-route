import React, { useEffect } from "react";
import { View, ScrollView, Image } from "react-native";
import { Container, Content, Text, Icon } from "../../../component/Basic";
import { Button } from "../../../component/Form";
import { useSelector, useDispatch } from "react-redux";
import styles from "./styles";
import theme from "../../../theme/styles";
import messaging from "@react-native-firebase/messaging";
import { DarkStatusBar } from "../../../component/StatusBar";
import { showMessage } from "../../../helper/showAlert";
import { navigate } from "../../../navigations";


export default function Intro({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.session);
  console.log("USER===> on intr0", user);
  useEffect(() => {
    // * HERE GET FCM TOKEN FUNC WAS INVOKING
    // getFCMToken();

    if (user) {
      messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log("onNotificationOpenedApp",JSON.stringify(remoteMessage,null,2));
        if (
          remoteMessage &&
          user &&
          user?.roles?.includes("rider") &&
          remoteMessage?.data.notificationType === "parcel_notify"
        ) {
          console.log(
            "Notification caused app to open from background state:",
            remoteMessage.notification
          );
          navigate("DrawerNav", {
            screen: "PublicHome",
            params: {
              data: remoteMessage.notification.body,
            },
          });
        }

        if (
          remoteMessage &&
          user &&
          user?.roles?.includes("user") &&
          remoteMessage?.data.notificationType === "parcel_reboot"
        ) {
          console.log(
            "Notification caused app to open from background state:",
            remoteMessage.notification
          );
          navigate("DrawerNav", {
            screen: "PublicHome",
          });
        }
      });
      // Check whether an initial notification is available
      messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
          if (
            remoteMessage &&
            user &&
            user?.roles?.includes("rider") &&
            remoteMessage?.data.notificationType === "parcel_notify"
          ) {
            console.log(
              "Notification caused app to open from quit state:",
              remoteMessage.notification
            );
            navigate("DrawerNav", {
              screen: "PublicHome",
              params: {
                data: remoteMessage.notification.body,
              },
            });
          }
        });
      messaging().onMessage(async (remoteMessage) => {
        console.log("FOREGOURND===>",JSON.stringify(remoteMessage,null,2));
        if (
          remoteMessage &&
          user &&
          user?.roles?.includes("rider") &&
          remoteMessage?.data.notificationType === "parcel_notify"
        ) {
          navigate("DrawerNav", {
            screen: "PublicHome",
            params: {
              data: remoteMessage.notification.body,
            },
          });
          console.log("notification on foreground state....>>>", JSON.stringify(remoteMessage,null,2));
        }

        if (
          remoteMessage &&
          user &&
          user?.roles?.includes("user") &&
          remoteMessage?.data.notificationType === "parcel_reboot"
        ) {
          console.log(
            "notification on foreground state.... USER",
            remoteMessage
          );
          showMessage("success", remoteMessage.notification.body);
        }
      });

      console.log("APP INITIALZED");
    }

    // dispatch(logout());
  }, [user]);

  return (
    <Container>
      <DarkStatusBar />
      <Image
        source={{
          uri: "https://images.pexels.com/photos/2994136/pexels-photo-2994136.jpeg?auto=compress&cs=tinysrgb&w=1600",
        }}
        resizeMode="cover"
        style={styles.introBgImg}
      />
      <View style={styles.introBgCover} />
      <View style={styles.introContainer}>
        <Content contentContainerStyle={theme.layoutDf}>
          <View style={styles.introContent}>
            <Image
              source={require("../../../assets/images/logo6.png")}
              style={styles.introImg}
              resizeMode="contain"

            />
            <View>
              <Text style={styles.introTitle}>Serve On Route</Text>
              <Text style={styles.introText}>
                Find a easy way to transfer your parcels
              </Text>
            </View>
          </View>
          <Button
            style={styles.startBtn}
            onPress={() => {
              navigate("PublicLogin");
              // navigate("DriverNotification");
            }}
          >
            <Text style={styles.startBtnText}>START</Text>
          </Button>
        </Content>
      </View>
    </Container>
  );
}
