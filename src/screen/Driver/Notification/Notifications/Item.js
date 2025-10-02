import React, { useState } from "react";
import { View ,TextInput,TouchableOpacity} from "react-native";
import { Text, Icon } from "../../../../component/Basic";
import { Button } from "../../../../component/Form";
import styles from "../styles";
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
  const  {socket }= useSelector((state) => state.socket);
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
    const regex = /Parcel with Id: ([a-f0-9]+) /i;
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

    //  6412f0faf432ae2f820d4f6d

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
        // setLoading(false);
      })
      .catch((err) => {
        // console.log(("error", err.response));
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
      // const responseOne = await axios.post(
      //   "https://api.serveonroute.com/v1/bid",
      //   requestPayload,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${datas.access_token}`,
      //     },
      //   }
      // );

      // console.log("SUCCESSFULL RESPONSE ==>", responseOne.data);
      alert("You successfully bid on this parcel");
      socket.emit("bidding", requestPayload);
      toggleModal()
    } catch (error) {
      toggleModal()
      console.log("error",error);
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
        <Modal isVisible={isModalVisible}>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                padding: 20,
                width: wp("80"),
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text style={styles.biddingCardText}>
                    {data?.customer_id?.first_name}{" "}
                    {data?.customer_id?.last_name}
                  </Text>
                </View>
                <View>
                  {/* <Text >Fare</Text> */}
                  <Text style={styles.biddingCardText}>${data?.fare}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", marginVertical: hp("2") }}>
                <View>
                  <Text>{data?.from_location}</Text>
                </View>
                <Text style={styles.biddingCardText}>TO</Text>
                <View>
                  <Text>{data?.to_location}</Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  style={[
                    styles.bookingBtn,
                    { width: "25%", backgroundColor: "red" },
                  ]}
                  onPress={toggleModal}
                >
                  <Text style={styles.bookingBtnText}>Close</Text>
                </Button>

                {data?.status=="pending"?
              <Button
              style={[styles.bookingBtn, { width: "25%", marginLeft: -10 }]}
              onPress={() => {
                setBidFormShow(!isBidFormShow);
              }}
            >
              <Text style={styles.bookingBtnText}>
                Make Own Offer
              </Text>
            </Button>
            :null  
              }
              </View>
              {isBidFormShow && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingBottom: 10,
            with:wp("80")
          }}
        >
          <TextInput
            placeholder="Enter The Bidding"
            placeholderTextColor="black"
            style={{
              width: wp("55"),
              marginTop: 10,
              borderRadius: 10,
              paddingLeft: 10,
              marginLeft: 20,
              zindex: 1,
              backgroundColor: "lightgrey",
              color: "black",
            }}
            onChangeText={(e) => {
              setBiddingValue(e);
            }}
            onSubmitEditing={(e) => {
              handleBid();
            }}
          />
          <TouchableOpacity
            onPress={() => {
              handleBid();
              // Keyboard.dismiss();
            }}
          >
            <Icon
              name="send"
              type="FontAwesome"
              style={[styles.btnIcon, theme.SIZE_25]}
            />
          </TouchableOpacity>
        </View>
      )}
            </View>
          </View>
         
        </Modal>
      </View>
    </>
  );
}
