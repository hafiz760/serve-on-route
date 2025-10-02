import React from "react";
import { Image, View } from "react-native";
import { Text, Icon } from "../../../../component/Basic";
import { Button } from "../../../../component/Form";

import styles from "../styles";

import theme from "../../../../theme/styles";


export default function Item({ value,index, deletePaymentRecordById }) {
  return (
    <>
    
      <View style={styles.notificationContent}>
        {/* <View style={styles.notificationInfo}>
          <Text style={styles.notificationTitle}>{__("Card Number")}</Text>
          <Text style={styles.notificationText}>{value.cvc}</Text>
        </View> */}
        <View style={styles.notificationDetail}>
          <View
            style={styles.cardImg1}
          >
            <Image
              source={require("../../../../assets/images/cardNum.png")}
            />
          </View>
          <Text style={styles.bookingText}>
            {value.card_number.slice(0, 3) +
              "********" +
              value.card_number.slice(11, 15)}
          </Text>

          <View style={styles.deleteBtn}>
            <Button
              style={styles.deleteBtn}
            onPress={() => deletePaymentRecordById(value._id)}
            >
              <Icon
              name="delete"
              type="AntDesign"
              style={[theme.SIZE_20, theme.SMOKEVIOLET]}
            />
              <Image
                // style={styles.cardImg}
                source={require("../../../../assets/images/Verified.png")}
              />
            </Button>
          </View>
        </View>
      </View>
    </>
  );
}
