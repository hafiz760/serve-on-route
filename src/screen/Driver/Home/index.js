import React, { useState, useEffect } from "react";
import { View, ScrollView, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { Container, Content, Text } from "../../../component/Basic";
import { Button } from "../../../component/Form";
import styles from "./styles";
import axios from "axios";

import Accordion from "../../Driver/MyTrips/Accordion";
import { DarkStatusBar } from "../../../component/StatusBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, URL_V } from "../../../utilities/helper";
import Header from "../../../component/Header";

export default function Home({ route }) {
  console.log("route", route);
  const notiId = useSelector(state => state.session.notiId);
  console.log("notiId", notiId);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    var data = await AsyncStorage.getItem("response");
    var datas = JSON.parse(data);

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
        setData(incompleteData);
        setLoading(false);
      })
      .catch((err) => {
        console.log(("error", err.response));
        setLoading(false);
      });
  };

  useEffect(() => {
    console.log("use effect call on home11111");
    fetchData();
  }, [notiId]);

  const renderOpen = ({ item: val, index }) => {
    console.log("val.status", val.status);
    if (val.status !== "in_progress") return null;

    return (
      <Accordion
        title={`TRIPS ID : ${index + 1}`}
        text="open"
        key={val._id || index}
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
  };

  return (
    <Container>
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
          />
          <View style={{ width: "90%", alignSelf: 'center', paddingTop: 15 }}>
            {data && data.length > 0 ? (
              <FlatList
                data={data}
                showsHorizontalScrollIndicator={false}
                renderItem={renderOpen}
                keyExtractor={(item, index) => item._id || index.toString()}
                ListEmptyComponent={
                  <View style={styles.noTripsFoundContainer}>
                    <Text style={styles.noTripsFoundText}>No Open Trips Found</Text>
                  </View>
                }
              />
            ) : (
              <View style={styles.noTripsFoundContainer}>
                <Text style={styles.noTripsFoundText}>No Open Trips Found</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </Content>

      <View style={styles.footerBtn} />
    </Container>
  );
}