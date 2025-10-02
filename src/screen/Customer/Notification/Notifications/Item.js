import React from "react";
import { View } from "react-native";
import { Text, Icon } from "../../../../component/Basic";
import styles from "../styles";
import theme from "../../../../theme/styles";
import moment from "moment";

export default function Item({ value }) {
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

    return stringss;
  };

  return (
    <>
      <View style={styles.notificationContent}>
        <View style={{ flex: 1, flexDirection: 'row', }}>
          <View style={{
            alignItems: 'center',
            justifyContent: "center",
          }}>
            <View style={{
              alignItems: 'center',
              justifyContent: "center",
              backgroundColor: '#D9D9D9',
              borderRadius: 50,
              height: 40,
              width: 40,
              marginEnd: 10,
            }}>
              <Icon
                name="truck-outline"
                type="MaterialCommunityIcons"
              />
            </View>
          </View>

          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', }}>
            <View style={{ flex: 5, justifyContent: "space-between" }}>

              <View style={styles.notificationInfo}>
                <View >
                  {console.log("date", value?.item)}
                  <Text style={styles.notificationTitle}>
                    {value?.item?.title}
                  </Text>
                </View>
              </View>
              <View style={styles.notificationDetail}>
                {value?.item?.type == "bid_created" ? <Text  style={[styles.bookingText]} numberOfLines={1}>{value?.item?.title}</Text> :
                  <>
                    <Text style={[styles.bookingText]} numberOfLines={1}>{value?.item?.body}</Text>
                  </>
                }
              </View>

            </View>

            <View style={{ alignSelf: 'flex-end', alignItems: 'flex-end', direction: 'rtl' }}>
              <Text style={styles.notificationText}>
                {moment(value?.item?.createdAt)
                  .startOf('seconds')
                  .fromNow()}
                {/* {TimeCalculate()} */}
              </Text>
              <Icon
                name="checkmark-done"
                type="Ionicons"
                style={[theme.SIZE_18, { color: 'blue' }]}
              />
            </View>
          </View>
        </View>
      </View>
    </>
  );
}
