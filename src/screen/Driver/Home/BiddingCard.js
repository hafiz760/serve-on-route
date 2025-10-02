import React, { useState } from "react";
import { View, Image, TouchableOpacity, Keyboard } from "react-native";
import { TextInput, Button } from "../../../component/Form";
import { Text, Icon } from "../../../component/Basic";
import theme from "../../../theme/styles";
import { COLOR, FAMILY, SIZE } from "../../../theme/typography";
import styles from "./styles";
const BiddingCard = ({ val, CloseModelBaseOnId, handleBid }) => {
  const [biddingValue, setBiddingValue] = useState(val?.fare);
  const [isBidFormShow, setBidFormShow] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);
// console.log("val",biddingValue);
  const handleLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setContainerHeight(height);
  };

  return (
    <View
      onLayout={handleLayout}
      style={{
        width: "90%",
        paddingBottom: 20,
        margin: 20,
        borderRadius: 10,
        backgroundColor: COLOR.LIGHT,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: "20%", marginTop: 20 }}>
          <Image
            source={require("../../../assets/images/avatar.png")}
            resizeMode="cover"
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              margin: 10,
            }}
          />
        </View>
        <View style={{ paddingTop: 30, width: "70%" }}>
         
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 5,
              fontSize: 20,
            }}
          >
            <Text style={styles.biddingCardText}>
              {val?.customer_id?.first_name} {val?.customer_id?.last_name}
            </Text>
  
            <Text style={styles.biddingCardText}>$ {val?.fare}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 5,
              fontSize: 20,
            }}
          >
           
            <Text style={styles.biddingCardText}>
              City: {val?.customer_id?.city}
            </Text>
          </View>
          <View>
            <View style={{flexDirection:"row"}}>
            <Text style={styles.biddingCardText}>
              
              From location:   </Text>
              <Text style={styles.biddingCardText}>
              {val?.from_location}</Text>
            </View>
            <View style={{flexDirection:"row"}}>
            <Text style={styles.biddingCardText}>
              To location:   </Text>
              <Text style={styles.biddingCardText}>
              {val?.to_location}</Text>
            </View>
            <View style={{flexDirection:"row"}}>
            <Text style={styles.biddingCardText}>
              Receiving Slot:   </Text>
              <Text style={styles.biddingCardText}>
              {val?.receiving_slot}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              // margin: 5,
              fontSize: 20,
            }}
          >
            <Text style={styles.biddingCardText}>Delivery Time: {`${val?.bidding_type}(${JSON.stringify(val?.time).substr(1,10)})`}</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button
          style={[styles.bookingBtn, { width: "25%", backgroundColor: "red" }]}
          onPress={(va) => {
            console.log("Muneeb click on Decline");
            CloseModelBaseOnId(val.id);
            // setOpen(false);
          }}
        >
          <Text style={styles.bookingBtnText}>Decline</Text>
        </Button>
    
        <Button
          style={[styles.bookingBtn, { width: "25%", marginLeft: -10 }]}
          onPress={() => {
            setBidFormShow(!isBidFormShow);
          }}
        >
          <Text style={styles.bookingBtnText}>Make Own Offer</Text>
        </Button>
        <Button
          style={[styles.bookingBtn, { width: "25%", marginLeft: -10 }]}
          onPress={() => {
            handleBid(biddingValue, val);
          }}
        >
          <Text style={styles.bookingBtnText}>Accept</Text>
        </Button>
      </View>
      {isBidFormShow && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingBottom: 10,
          }}
        >
          <TextInput
            placeholder="Enter The Bidding"
            placeholderTextColor="black"
            style={{
              width: 250,
              marginTop: 10,
              borderRadius: 10,
              paddingLeft: 10,
              marginLeft: 20,
              zindex: 1,
              backgroundColor: "white",
              color: "black",
            }}
            onChangeText={(e) => {
              setBiddingValue(e);
            }}
            onSubmitEditing={(e) => {
              handleBid(biddingValue, val);
            }}
          />
          <TouchableOpacity
            onPress={() => {
              handleBid(biddingValue, val);
              Keyboard.dismiss();
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
  );
};

export default BiddingCard;
