import React, { useState, useEffect } from "react";
import { FlatList, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CustomerItem from "./CustomerItem";
import DriverItem from "./DriverItem";
import Placeholder from "./Placeholder";
import { BASE_URL, URL_V } from "../../../../utilities/helper";

/**
 * Shared Notification List Component
 * @param {Object} props
 * @param {function} props.showLoading - Callback to update loading state
 * @param {boolean} props.loading - Loading state
 * @param {string} props.userRole - 'customer' or 'driver'
 */
export default function NotificationList({ showLoading, loading, userRole = 'customer' }) {
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    getNotification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getNotification() {
    try {
      const data = await AsyncStorage.getItem("response");
      const userData = JSON.parse(data);

      const res = await axios.get(
        `${BASE_URL}${URL_V}notifications?user=${userData?._id}&page=1&limit=50&sort=-createdAt`,
        {
          headers: {
            Authorization: `Bearer ${userData.access_token}`,
          },
        }
      );

      setNotification(res?.data?.docs || []);
      showLoading(false);
    } catch (err) {
      if (__DEV__) {
        console.error("Error fetching notifications:", err);
      }
      showLoading(false);
    }
  }

  const renderItem = ({ item }) => {
    const ItemComponent = userRole === 'driver' ? DriverItem : CustomerItem;

    return (
      <ItemComponent
        language="en"
        value={{ item }}
      />
    );
  };

  if (!loading && notification?.length === 0) {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: "#000",
            fontWeight: "bold",
          }}
        >
          No notifications Found
        </Text>
      </View>
    );
  }

  if (loading) {
    return <Placeholder />;
  }

  return (
    <FlatList
      data={notification}
      keyExtractor={(item, index) => item._id || `notification-${index}`}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
    />
  );
}
