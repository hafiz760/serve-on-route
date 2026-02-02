import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { Text, Icon } from "../../../../component/Basic";
import { Button } from "../../../../component/Form";
import styles from "../styles";
import { COLOR, FAMILY, SIZE } from "../../../../theme/typography";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Modal from "react-native-modal";
import { useSelector } from "react-redux";
import theme from "../../../../theme/styles";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// import {BASE_URL,URL_V} from "@env"
import { BASE_URL, URL_V } from "../../../../utilities/helper";

export default function Item({ value }) {
  const { socket } = useSelector((state) => state.socket);
  const [isModalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState();
  const [parcelId, setParcelId] = useState("");
  const [bidValue, setBidValue] = useState("");
  const [isBidFormShow, setBidFormShow] = useState(false);
  const [biddingValue, setBiddingValue] = useState("");
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const TimeCalculate = () => {
    const date1 = new Date(value?.item?.createdAt);
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    const IosFormattedString = new Date(formattedDate);
    const seconds = Math.round((IosFormattedString - date1) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    let stringss = "";
    if (seconds < 60) {
      stringss = seconds + "sec";
    } else if (minutes < 60) {
      stringss = minutes + "min";
    } else if (hours < 24) {
      stringss = hours + "h";
    } else {
      stringss = days + "d";
    }

    // console.log("Dates",stringss)
    return stringss;
  };
  async function getId(body) {
    const text = body;
    const match = text.match(regex);
    if (match) {
      const id = match[1];
      console.log("ID:", id);
      toggleModal();
      fetchData(id);
      setParcelId(id)
    } else {
      console.log("No ID found in the text.");
    }
  }

  const fetchData = async (id) => {
    var data = await AsyncStorage.getItem("response");
    var datas = JSON.parse(data);
    const res = await axios
      .get(`${BASE_URL}${URL_V}parcel/${id}`, {
        headers: {
          Authorization: `Bearer ${datas.access_token}`,
        },
      })
      .then((data) => {
        setData(data.data);
        setBidValue(data.data.fare)
        setBiddingValue(data.data.fare)
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const handleBid = async () => {
    var data = await AsyncStorage.getItem("response");
    var datas = JSON.parse(data);
    const requestPayload = {
      bid_amount: biddingValue,
      parcel: parcelId,
      bidder: datas._id,
      description: "string",
    };
    try {
      alert("You successfully bid on this parcel");
      socket.emit("bidding", requestPayload);
      toggleModal()
    } catch (error) {
      toggleModal()
      console.log("error", error);
      alert("Something went wrong while bidding...!");
    }
  };
  return (
    <>
      <View style={styles.notificationContent}>
        <View style={styles.notificationInfo}>
          <View>
            <Text style={styles.notificationTitle}>

              {value?.item?.title}
            </Text>
            <View style={{ flexDirection: "row", width: 200 }}>

            </View>
          </View>
          <Text style={styles.notificationText}>
            {moment(value?.item?.createdAt).startOf("seconds").fromNow()}
            {/* {TimeCalculate()} */}
          </Text>
        </View>
        <View style={styles.notificationDetail}>
          {value?.item?.type == "parcel_notify" ? (
            <Text style={styles.bookingText}>{value?.item?.body}</Text>
          ) : (
            <>
              <Text style={styles.bookingText}>{value?.item?.title}</Text>
              <View></View>
            </>
          )}
          <Button
            style={styles.deleteBtn}
            onPress={() => getId(value?.item?.body)}
          >
            <Text>Details</Text>

          </Button>
        </View>
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={toggleModal}
          onBackButtonPress={toggleModal}
          animationIn="zoomIn"
          animationOut="zoomOut"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 20,
                padding: 24,
                width: wp("85"),
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              {/* Header */}
              <View style={{ flexDirection: 'row', justifyContent: 'start', alignItems: 'center', marginBottom: 20 }}>
                <View>
                  <Text style={{ fontFamily: FAMILY.BOLD, fontSize: SIZE.SIZE_18, color: COLOR.DARK }}>
                    {data?.customer_id?.first_name} {data?.customer_id?.last_name}
                  </Text>
                  <Text style={{ fontFamily: FAMILY.REGULAR, fontSize: SIZE.SIZE_12, color: COLOR.SMOKEVIOLET }}>
                    Customer
                  </Text>
                </View>
                <View style={{ backgroundColor: COLOR.SMOKEBLUE, paddingVertical: 8, borderRadius: 12 }}>
                  <Text style={{ fontFamily: FAMILY.BOLD, fontSize: SIZE.SIZE_18, color: COLOR.PRIMARY }}>
                    ${data?.fare}
                  </Text>
                </View>
              </View>

              {/* Route Info */}
              <View style={{ marginBottom: 25 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15 }}>
                  <View style={{ alignItems: 'center', marginRight: 12, marginTop: 4 }}>
                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: COLOR.BLUE }} />
                    <View style={{ width: 1, height: 30, backgroundColor: '#E5E7EB', marginVertical: 4 }} />
                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#EF4444' }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ marginBottom: 15 }}>
                      <Text style={{ fontSize: 10, color: '#9CA3AF', fontWeight: '800', marginBottom: 2 }}>PICKUP</Text>
                      <Text style={{ fontSize: 13, color: '#374151' }} numberOfLines={2}>{data?.from_location}</Text>
                    </View>
                    <View>
                      <Text style={{ fontSize: 10, color: '#9CA3AF', fontWeight: '800', marginBottom: 2 }}>DESTINATION</Text>
                      <Text style={{ fontSize: 13, color: '#374151' }} numberOfLines={2}>{data?.to_location}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Input for Bidding */}
              {isBidFormShow && (
                <View style={{ marginBottom: 20, backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', borderWeight: 1, borderColor: '#F3F4F6' }}>
                  <Icon name="dollar-sign" type="Feather" style={{ fontSize: 18, color: COLOR.PRIMARY, marginRight: 8 }} />
                  <TextInput
                    placeholder="Enter your offer"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    style={{
                      flex: 1,
                      fontSize: 15,
                      color: '#111827',
                      paddingVertical: 8,
                    }}
                    value={biddingValue}
                    onChangeText={setBiddingValue}
                  />
                  <TouchableOpacity
                    onPress={handleBid}
                    style={{ backgroundColor: COLOR.PRIMARY, width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Icon name="send" type="Feather" style={{ fontSize: 18, color: '#FFF' }} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Actions */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  onPress={toggleModal}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: '#6B7280', fontWeight: 'bold' }}>Close</Text>
                </TouchableOpacity>

                {data?.status === "pending" && !isBidFormShow && (
                  <TouchableOpacity
                    onPress={() => setBidFormShow(true)}
                    style={{
                      flex: 2,
                      backgroundColor: COLOR.PRIMARY,
                      paddingVertical: 14,
                      borderRadius: 12,
                      alignItems: 'center'
                    }}
                  >
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Make Own Offer</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </>
  );
}
