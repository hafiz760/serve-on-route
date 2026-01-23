/**
 * @format
 */

import { AppRegistry, LogBox } from "react-native";

import { name as appName } from "./app.json";
import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from "./src/base";

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
  
  try {
    // Get user data from AsyncStorage
    const userData = await AsyncStorage.getItem('response');
    if (userData) {
      const user = JSON.parse(userData);
      
      // Check if this is an OTP notification
      const isOTPNotification = remoteMessage.notification?.body?.toLowerCase().includes('otp') || 
                                remoteMessage.notification?.body?.toLowerCase().includes('verification');
      
      // Check if user is a rider
      const isRider = user?.role?.includes("rider");
      
      if (isOTPNotification && isRider) {
        console.log("🚫 OTP notification detected for rider - cancelling notification");
        
        // Cancel all displayed notifications immediately
        // This will remove the notification from the system tray
        const displayedNotifications = await notifee.getDisplayedNotifications();
        console.log("Displayed notifications count:", displayedNotifications.length);
        
        // Cancel all notifications (FCM notifications don't have IDs we can track easily)
        // So we cancel all recent notifications
        await notifee.cancelAllNotifications();
        
        console.log("✅ OTP notification cancelled successfully");
        return; // Don't process further
      }
    }
  } catch (error) {
    console.log("Error in background message handler:", error);
  }
});

LogBox.ignoreAllLogs(true);

AppRegistry.registerComponent(appName, () => App);