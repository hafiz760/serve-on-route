import React, { useState } from "react";
import { FlatList, View, Text } from "react-native";

import Item from "./Item";
import Placeholder from "./Placeholder";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
// import {BASE_URL,URL_V} from "@env"
import { BASE_URL, URL_V } from "../../../../utilities/helper";
export default function Notification({ showLoading, loading }) {
  const [notification, setNotification] = useState([]);
  useEffect(() => {
    getNotification();
  }, []);

  async function getNotification() {
    var data = await AsyncStorage.getItem("response");
    var datas = JSON.parse(data);
    const res = axios
      .get(
        
        // `${BASE_URL}notifications?user=${datas?._id}&page=1&limit=50&sort=-createdAt`,
        `${BASE_URL}${URL_V}notifications?user=${datas?._id}&page=1&limit=50&sort=-createdAt`,

        {
          headers: {
            Authorization: `Bearer ${datas.access_token}`,
          },
        }
      )
      .then((data) => {
        setNotification(data?.data?.docs);
        showLoading(false);
      })
      .catch((err) => {
        console.log(("error", err));
        showLoading(false);
      });
  }

  const renderTemplate = () => {
    return <Placeholder />;
  };

  const renderItem = (val) => {
    return (
      <Item
        language={"this.props.language"}
        // item={item}
        value={val}
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

  return (
    <>
      <FlatList
        data={notification}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
      />
    </>
  );
}
