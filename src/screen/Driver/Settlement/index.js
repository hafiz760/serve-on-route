import React from "react";
import { View, ScrollView } from "react-native";
import { Container, Content, Text } from "../../../component/Basic";
import styles from "./styles";
import theme from "../../../theme/styles";

import Header from "../../../component/Header";
import Accordion from "./Accordion";
import { DarkStatusBar } from "../../../component/StatusBar";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function TransactionHistory() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    getTransactionHistory();
  }, []);
  const getTransactionHistory = async () => {
    var data = await AsyncStorage.getItem("response");
    var datas = JSON.parse(data);
    console.log("???",data);

    const ress = axios
      .get(
        ` https://api.serveonroute.com/v1/users/user-by-id/${datas._id}`,

        {
          headers: {
            Authorization: `Bearer ${datas.access_token}`,
          },
        }
      )
      .then((response) => {
        console.log(">>>>>.",response.data.data.customerId);
        const res = axios
          .get(
            ` https://api.serveonroute.com/v1/payment/get-stripe-user-transactions?user=${response?.data?.data?.customerId}`,

            {
              headers: {
                Authorization: `Bearer ${datas.access_token}`,
              },
            }
          )
          .then((data) => {
            console.log("history", data.data.data);
            setData(data.data.data);
          })
          .catch((err) => {
            console.log("error>>", err);
          });
      })
      .catch((err) => {
        console.log("error>>1", err);
      });
  };
  return (
    <Container>
      <DarkStatusBar />
      <Header leftType="back" />
      <View style={styles.settlementHeader}>
        <Text style={styles.settlementHeaderTitle}>
          TRANSACTION HISTORY
        </Text>
        <Text style={styles.settlementHeaderText}>
        TRANSACTION HISTORY
        </Text>
      </View>
      <Content contentContainerStyle={theme.layoutDf}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.settlementContainer}>
            {data.map((val, index) => {
              return (
                <View style={styles.accordionLayout}>
                  <Accordion
                    title={"TRANSACTION ID #" + (index + 1)}
                    text="open"
                    style={{ backgroundColor: "rgba(92,186,71,1)" }}
                    renderContent={() => (
                      <View style={styles.accordionContent}>
                        <View style={[styles.bookingItem, styles.bookingItem2]}>
                          <Text style={styles.bookingText}>
                          Transation Amount
                          </Text>
                          <Text style={styles.bookingCost}>
                            {(`${val.amount}`)}
                          </Text>
                        </View>
                        <View style={[styles.bookingItem, styles.bookingItem2]}>
                          <Text style={styles.bookingText}>Fee</Text>
                          <Text style={styles.bookingCost}>
                            {(`${val.fee} CAD`)}
                          </Text>
                        </View>
                        <View style={[styles.bookingItem, styles.bookingItem2]}>
                          <Text style={styles.bookingText}>
                            Net Amount
                          </Text>
                          <Text style={styles.bookingCost}>
                            {(`${val.net} CAD`)}
                          </Text>
                        </View>
                        <View style={styles.bookingItem}>
                          <Text style={styles.bookingText}>Status</Text>
                          <Text style={styles.bookingCost}>
                            {(`${val.status}`)}
                          </Text>
                        </View>
                      </View>
                    )}
                  />
                </View>
              );
            })}
          </View>
        </ScrollView>
      </Content>
    </Container>
  );
}
