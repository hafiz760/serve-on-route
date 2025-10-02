import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
  } else {
    console.log("Not Authorization status:", authStatus);
  }
}

export async function getFCMToken() {
  let fcmtoken = await AsyncStorage.getItem("fcmtoken");

  console.log("ALREADY FCM", fcmtoken);

  if (!fcmtoken) {
    try {
      const fcmtoken = await messaging().getToken();

      if (fcmtoken) {
        // console.log("new token", fcmtoken);
        await AsyncStorage.setItem("fcmtoken", fcmtoken);
        return fcmtoken;
      } else {
      }
    } catch (err) {
      console.log("ERROR IN GETTING FCM TOKEN", err);
    }
  } else {
    return fcmtoken;
  }
}
