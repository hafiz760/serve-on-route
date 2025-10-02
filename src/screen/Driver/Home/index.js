import React, { useState, useRef, useEffect } from "react";
import { View, ScrollView,FlatList } from "react-native";
import { useSelector } from "react-redux";
import { Container, Content, Text,Icon } from "../../../component/Basic";
import { Button } from "../../../component/Form";
import styles from "./styles";
import axios from "axios";
import Modal from "react-native-modalbox";

import Accordion from "../../Driver/MyTrips/Accordion"; 
import { DarkStatusBar } from "../../../component/StatusBar";
import BiddingCard from "./BiddingCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import {BASE_URL,URL_V} from "@env"
import { BASE_URL,URL_V } from "../../../utilities/helper";
import Header from "../../../component/Header";

export default function Home({ route  }) {
  console.log("route",route);
  const notiId = useSelector(state => state.session.notiId);
  console.log("notiId",notiId);
  const  {socket }= useSelector((state) => state.socket);
  const closeModelBaseOnId = (id) => {
    if (incomingParcelNotifications.length == 1) {
      setMainModel(false);
    }
    setIncomingParcelNotifications((previous) => {
      return previous.filter((value) => {
        return value.id != id;
      });
    });
  };

  const handleBid = async (bidValue, selectedParcel) => {
    var data = await AsyncStorage.getItem("response");
    var datas = JSON.parse(data);
    const requestPayload = {
      bid_amount: bidValue,
      parcel: selectedParcel._id,
      bidder: datas._id,
      description: "string",
    };
console.log("requestPayload",requestPayload);
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
      setMainModel(false);
      socket.emit("bidding", requestPayload);
     
      alert("You successfully bid on this parcel");
    } catch (error) {
      // alert("Something went wrong while bidding...!");
    }
  };

  const [mainModel, setMainModel] = useState(false);
  const [incomingParcelNotifications, setIncomingParcelNotifications] =
    useState([]);
  const ModalNotification = useRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // console.log("data status",JSON.stringify(data,null,2));
  const fetchData = async () => {
    var data = await AsyncStorage.getItem("response");
    var datas = JSON.parse(data);

    //  6412f0faf432ae2f820d4f6d

    const res = axios
      .get(
        `${BASE_URL}${URL_V}parcel?page=1&limit=500&populate=customer_id%20rider_id&sort=desc&rider_id=${datas._id}`,
        {
          headers: {
            Authorization: `Bearer ${datas.access_token}`,
          },
        }
      )
      .then((data) => {
        const incompleteData = data.data.docs.filter(item => item.status === "in_progress");

        // console.log("TRIPS>>>", JSON.stringify(incompleteData,null,2));
        setData(incompleteData);
        setLoading(false);
      })
      .catch((err) => {
        // console.log(("error", err.response));
        setLoading(false);
      });
  };
  const getParcelById = async (parcelId) => {
    console.log("getParcelById called");
    var data = await AsyncStorage.getItem("response");
    var datas = JSON.parse(data);
  
    try {
      const responseOne = await axios.get(
        `${BASE_URL}${URL_V}parcel/${parcelId}`,
        {
          headers: {
            Authorization: `Bearer ${datas.access_token}`,
          },
        }
      );
  
      console.log("RESPONSE ====>", responseOne);
  
      // Check if parcel already exists in the list
      const exists = incomingParcelNotifications.some(
        (item) => item.id === responseOne.data.id // or item._id if your API returns _id
      );
  
      if (!exists) {
        setIncomingParcelNotifications([
          ...incomingParcelNotifications,
          responseOne.data,
        ]);
      } else {
        console.log("Parcel already exists, not adding again");
      }
  
      if (!mainModel) {
        setMainModel(true);
      }
  
    } catch (err) {
      alert("Something went wrong while fetching parcel");
      console.log(err?.response);
    }
  };
  // const getParcelById = async (parcelId) => {
  //   console.log("getParcelById called");
  //   var data = await AsyncStorage.getItem("response");
  //   var datas = JSON.parse(data);

  //   try {
  //     const responseOne = await axios.get(
  //       `${BASE_URL}${URL_V}parcel/${parcelId}`,
  //       // `https://api.serveonroute.com/v1/parcel`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${datas.access_token}`,
  //         },
  //       }
  //     );

  //     console.log("RESONSE ====>", responseOne);

  //     setIncomingParcelNotifications([
  //       ...incomingParcelNotifications,
  //       responseOne.data,
  //     ]);
  //     if (!mainModel) {
  //       setMainModel(true);
  //     }
  //   } catch (err) {
  //     alert("Something went wrong whil fetching parcel");
  //     console.log(err.response);
  //   }
  // };

  // useEffect(() => {
  //   console.log("use effect call on home11111")
  //   fetchData()
  //   if (route?.params && route?.params?.data) {
  //     const id = route?.params?.data?.split("Id: ")[1].split(" has")[0];
  //     getParcelById(id);
  //   }
  //   console.log("INCOMDOMG PARCELS===>", incomingParcelNotifications);
  // }, []);
  // useEffect(() => {
  //   console.log("use effect call on home11111");
  //   getParcelById();
  // }, []);
  // console.log("INCOMDOMG PARCELS===>", incomingParcelNotifications);
  useEffect(() => {
    console.log("use effect call on home11111")
    fetchData()
    if (notiId) {
      const id = notiId.split("Id: ")[1].split(" has")[0];
      getParcelById(id);
    }
   
  }, [notiId]);
  
  const MainModel = () => {
    return (
      <Modal
        ref={ModalNotification}
        isOpen={true}
        entry={"top"}
        swipeToClose={false}
        style={{
          borderRadius: 10,
          // alignItems: "center",
          minHeight: "100%",
        }}
        backdropPressToClose={false}
      >
        {incomingParcelNotifications.map((val) => {
          return (
            <BiddingCard
              val={val}
              key={val?._id}
              CloseModelBaseOnId={closeModelBaseOnId}
              handleBid={handleBid}
            />
          );
        })}
      </Modal>
    );
  };
  const renderOpen= ( )=> {
    return (
      <View>
        <View style={styles.accordionLayout}>
          {data &&
          data?.length > 0 &&
          data.filter((d) => d.status === "in_progress")?.length > 0 ? (
            data.map((val, index) => {
              console.log("val.status",val.status);
              if (val.status == "in_progress") {
                return (
                  <Accordion
                    title={`TRIPS ID : ${index + 1}`}
                    text="open"
                    key={index}
                    renderContent={() => (
                      <View style={styles.accordionContent}>
                      <View style={styles.bookingInfo}>
                        <Text style={styles.bookingTitle}>TRIP COST</Text>
                        <Text style={styles.bookingText}>
                          {val?.pay_amount ? `${val?.pay_amount} USDT` : `${val?.fare} USD`}
                        </Text>
                      </View>
                      <View style={styles.bookingInfo}>
                        <Text style={styles.bookingTitle}>TRIP</Text>
                        <Text style={styles.bookingDetail}>{val?.time}</Text>
                      </View>
                      <View style={styles.bookingInfo}>
                        <Text style={styles.bookingTitle}>PICK UP FROM</Text>
                        <Text style={styles.bookingText}>{val?.from_location}</Text>
                      </View>
                      <View style={styles.bookingInfo}>
                        <Text style={styles.bookingTitle}>DROP AT</Text>
                        <Text style={styles.bookingText}>{val?.to_location}</Text>
                      </View>
                      <View style={styles.bookingInfo}>
                        <Text style={styles.bookingTitle}>DRIVER NAME</Text>
                        <Text style={styles.bookingText}>{val?.customer_id?.first_name}</Text>
                      </View>
                      <View style={styles.bookingInfo}>
                        <Text style={styles.bookingTitle}>VEHICLE NUMBER</Text>
                        <Text style={styles.bookingText}>NY 47568</Text>
                      </View>
                      <View style={styles.bookingInfo}>
                        <Text style={styles.bookingTitle}>CALL DRIVER</Text>
                        <Text style={styles.bookingText}>{val?.customer_id?.phone}</Text>
                      </View>
                      <View style={styles.bookingInfo}>
                        <Text style={styles.bookingTitle}>STATUS</Text>
                        <Button>
                          <Text style={styles.openBtnText}>{val?.status}</Text>
                        </Button>
                      </View>
                    </View>
                    
                    )}
                  />
                );
              }
            })
          ) : (
            <View style={styles.noTripsFoundContainer}>
              <Text style={styles.noTripsFoundText}>No Open Trips Found</Text>
            </View>
          )}
        </View>
      </View>
    );
  }
  return (
    <Container>
      <Modal
        isOpen={mainModel}
        entry={"top"}
        backdropOpacity={0.3}
        swipeToClose={false}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <MainModel />
        </View>

        <Button
          style={[styles.bookingBtn, { backgroundColor: "grey" }]}
          onPress={() => {
            setMainModel(false);
          }}
        >
          <Text style={styles.bookingBtnText}>Cancel</Text>
        </Button>
      </Modal>
      <DarkStatusBar />

      <Header leftType="menu" title={"Dashboard"} />

      <Content>
     
        <ScrollView>
          <View
            style={[
              styles.homeContainer,
              {
                alignItems: "center",
                justifyContent: "space-around",
                flexDirection: "row",
              },
            ]}
          ></View>
          <View style={{ width: "90%", alignSelf: "center", paddingTop: 15 }}>
          {/* <Text>ahmad</Text> */}
          <FlatList
        data={data}
        showsHorizontalScrollIndicator={false}
        renderItem={renderOpen}
      />
       
          </View>
        </ScrollView>
      </Content>

      <View style={styles.footerBtn}>
      </View>
    </Container>
  );
}

