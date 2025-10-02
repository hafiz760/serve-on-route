import React, { useEffect, useState } from "react";
import { FlatList, View, Text, Button } from "react-native";

import Item from "./Item";
import Placeholder from "./Placeholder";
// import data from '../data/notifications'
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "../../../../helper/showAlert";
import { useSelector } from "react-redux";
// import {BASE_URL,URL_V} from "@env"
import { BASE_URL,URL_V } from "../../../../utilities/helper";
export default function Notification({ showLoading, loading }) {
  const [data, setdata] = useState([]);
  const { user } = useSelector((state) => state.session);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    var data = await AsyncStorage.getItem("response");
    var datas = JSON.parse(data);
    console.log(datas);

    const res = axios
      .get(`${BASE_URL}${URL_V}payment?user=${datas._id}`, {
        headers: {
          Authorization: `Bearer ${datas.access_token}`,
        },
      })
      .then((data) => {
        console.log("res>>>",JSON.stringify( data.data,null,2));
        setdata(data.data);
        showLoading(false);
      })
      .catch((err) => {
        console.log(("error", err));
        showLoading(false);
      });
  };

  const renderTemplate = () => {
    return <Placeholder />;
  };

  const renderItem = (val,index) => {
    return (
      <Item
        value={val.item}
        deletePaymentRecordById={deletePaymentRecordById}
      />
    );
  };

  const deletePaymentRecordById = async (paymentId) => {
    try {
      const res = await axios.delete(
        `${BASE_URL}${URL_V}payment/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      );

      if (res.status === 200) {
        showMessage("success", "Payment method removed successfully");
        const filteredPayments = data.filter((d) => d._id !== paymentId);
        setdata(filteredPayments);
      }
      console.log("MY RESPONSE", res.status);
    } catch (err) {
      showMessage("error", "Something went wrong!");
    }
  };

  if (!loading && data?.length === 0) {
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
          No Payment Methods Found
        </Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={data}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
      />            
    </>
  );
}
