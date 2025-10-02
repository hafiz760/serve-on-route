import {
  StyleSheet,
  View,
  Platform,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { navigate } from "../../../navigation";

import React, {  } from "react";

const ApplicationCard = ({ value, length }) => {
  let img =
    "https://images.pexels.com/photos/709188/pexels-photo-709188.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500}}";
  let username = "Allen John";
  return (
    <View style={[styles.card, styles.borderShowStyles]}>
      <View style={styles.innerCardStyles}>
        <View style={styles.topContainer}>
          <View style={styles.loanTypeContainer}>
            <View style={styles.backgroudIconView}>
              {/* <FontAwesomeIcon
                name="hand-holding-usd"
                size={18}
                color={primary}
              /> */}
              <Image
                source={{ uri: img }}
                resizeMode="cover"
                style={styles.headerImg}
              />
            </View>
            <View
              style={{
                marginLeft: 10,
              }}
            >
              <Text style={styles.loanTypePrimaryText}>Allen Jhon</Text>
              <Text style={styles.loanTypeSecondaryText}>{value}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.loanAmount}>{length} SAR</Text>
          </View>
        </View>
        <View style={styles.middleContainer}>
          <View>
            <Text style={styles.loanTypeSecondaryText}>{"endDate"}</Text>
            <Text
              style={[
                styles.loanTypePrimaryText,
                styles.applyMarginOnMiddleText,
              ]}
            >
              Jan 2024
            </Text>
          </View>
          <View>
            <Text style={styles.loanTypeSecondaryText}> {"period"}</Text>
            <Text
              style={[
                styles.loanTypePrimaryText,
                styles.applyMarginOnMiddleText,
              ]}
            >
              2 hours
            </Text>
          </View>
          <View>
            <Text style={styles.loanTypeSecondaryText}>{"status"}</Text>
            <Text
              style={[
                styles.loanTypePrimaryText,
                styles.applyMarginOnMiddleText,
                { color: "#E08508" },
              ]}
            >
              Pending
            </Text>
          </View>
        </View>
        <Text numberOfLines={1} style={styles.textStyles}>
          Notes: xxxxx . xxxxx . xxxxx . xxxxx . xxxxx. xxxxx
        </Text>
        <TouchableOpacity onPress={() => navigate("showNotification")} style={{backgroundColor:'red',padding:10}}>
          <Text>Temp Button</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  innerCardStyles: {
    padding: 2,
  },
  topContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingBottom: 2,
  },
  loanTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerImg: {
    marginTop: -20,
    width: 62,
    height: 62,
    borderRadius: 36,
  },
  loanTypePrimaryText: {
    fontSize: 20,
    fontWeight: "600",
    color: "black",
  },
  loanTypeSecondaryText: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "600",
    color: "gray",
  },
  loanAmount: {
    color: "black",
    fontWeight: "600",
  },
  backgroudIconView: {
    backgroundColor: "#DDDDDD",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 20,
  },
  middleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "black",
  },
  applyMarginOnMiddleText: {
    marginTop: 10,
  },
  textStyles: {
    paddingTop: 20,
    fontWeight: "600",
    color: "black",
  },
});
export default ApplicationCard;
