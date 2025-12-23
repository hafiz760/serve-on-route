/**
 * @format
 */

import { AppRegistry, LogBox } from "react-native";

import { name as appName } from "./app.json";
import messaging from "@react-native-firebase/messaging";
import App from "./src/base";

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
});

LogBox.ignoreAllLogs(true);

AppRegistry.registerComponent(appName, () => App);