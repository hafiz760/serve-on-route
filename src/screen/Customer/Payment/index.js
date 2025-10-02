import React, { useState } from "react";
import { View, ScrollView, Image } from "react-native";
import { Container, Content, Text, Icon } from "../../../component/Basic";
import { TextInput, Button } from "../../../component/Form";
// import notifee, { AndroidImportance, EventType } from "@notifee/react-native";
import styles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CreditCardInput } from "react-native-credit-card-input";
import Header from "../../../component/Header";
import Support from "../../../component/Support";
import axios from "axios";
import { showMessage } from "../../../helper/showAlert";
import { DarkStatusBar } from "../../../component/StatusBar";
// import {BASE_URL,URL_V} from "@env"
import { BASE_URL,URL_V } from "../../../utilities/helper";
import { navigateReset } from "../../../navigations";
export default function Payment({ navigation }) {
  const [CardInput, setCardInput] = useState({});

  const postData = async () => {
    var data = await AsyncStorage.getItem("response");
    var datas = JSON.parse(data);
    console.log(CardInput.values.expiry.split("/"));

    const res = axios
      .post(
        `${BASE_URL}${URL_V}payment`,
        {
          card_number: CardInput.values.number,
          card_exp_month: CardInput.values.expiry.split("/")[0],
          card_exp_year: CardInput.values.expiry.split("/")[1],
          card_cvc: CardInput.values.cvc,
        },
        {
          headers: {
            Authorization: `Bearer ${datas.access_token}`,
          },
        }
      )
      .then((data) => {
        console.log("Card res", data);
        showMessage("success", "Payment Method is Added Succefully");
        navigation.pop();

        // makePaymentByUser(data.data.payment_method);
      })
      .catch((err) => {
        showMessage("error", "Error in added payment method");
        console.log("CURRENT ERROR===>", err.response.data);
      });
  };

  const makePaymentByUser = async (method) => {
    console.log("Method in paymentByUser ", method);
    var data = await AsyncStorage.getItem("response");
    var datas = JSON.parse(data);
    // console.log(datas);

    axios
      .post(
        `${BASE_URL}${URL_V}payment/transfer`,
        {
          paymentMethod: method,
          currency: "cad",
          amount: "250",
          rider_account: "acct_1MwmIbPu2iasesq5",
        },
        {
          headers: {
            Authorization: `Bearer ${datas.access_token}`,
          },
        }
      )
      .then((data) => {
        console.log("result to make payment", data.data);
      })
      .catch((err) => {
        console.log("error546", err.response);
      });
  };
  async function onSubmit() {
    if (CardInput.valid == false || typeof CardInput.valid == "undefined") {
        showMessage("error", "Invalid Credit Card");
      return false;
    } 
    else {
      await Support.showSuccess({
        title: "Success!",
        message:"Payment Method is Added Succefully",
        onHide: () => {
          console.log(CardInput);
          // makePaymentByUser();
          // postData();
          onDisplayNotification();
          navigateReset("PublicHome");
        },
        hideDelay: 2500,
      });
      postData();
    }
  }

  async function onDisplayNotification() {
    const channelId = await notifee.createChannel({
      id: "important",
      name: "Important Notifications",
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: "Your New Order Is Ready ",
      body: "You can see you order requirment going to in my Trip",
      android: {
        channelId,
        // largeIcon: require('../../../../assets/images/fb.png'),
        importance: AndroidImportance.HIGH,
        // ongoing: true,
      },
    });
  }

  return (
    <Container>
      <DarkStatusBar />
      <Header leftType="back" />
      <View style={styles.paymentHeader}>
        <Text style={styles.paymentHeaderTitle}>PAYMENT</Text>
        <Text style={styles.paymentHeaderText}>
      CHOOSE YOUR PAYMENT
        </Text>
      </View>
      <Container>
        <View style={styles.payPalInfo}>
          <CreditCardInput
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            validColor="#fff"
            placeholderColor="#ccc"
            onChange={(data) => {
              setCardInput(data);
            }}
          />
        </View>
      </Container>
      <Button
        style={styles.payBtn}
        onPress={() => {
          onSubmit();
        }}
      >
        <Text style={styles.payBtnText}>SAVE CARD</Text>
      </Button>
    </Container>
  );
}
