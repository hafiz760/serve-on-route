import React, { useState } from "react";
import { View, ScrollView, Image } from "react-native";
import { Container, Content, Text, Icon } from "../../../component/Basic";
import { TextInput, Button } from "../../../component/Form";
import Modal from "react-native-modalbox";
import styles from "./styles";
import theme from "../../../theme/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../component/Header";
import ImagePicker from "react-native-image-crop-picker";
import { showMessage } from "../../../helper/showAlert";
import { DarkStatusBar } from "../../../component/StatusBar";
import DocumentPicker from "react-native-document-picker";
import { useSelector } from "react-redux";
import axios from "axios";
// import {BASE_URL,URL_V} from "@env"
import { BASE_URL,URL_V } from "../../../utilities/helper";
export default function BookingComplete(props) {
  const val = props.route.params.data;
    const [isOpen, setIsOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [images, setImages] = useState([]);
  const { user } = useSelector((state) => state.session);

  const [description, setDescription] = useState("");

  const getPhotoFromGallery = async () => {
    try {
      const res = await DocumentPicker.pick({
        allowMultiSelection: true,
        type: [DocumentPicker.types.allFiles],
      });
      setImages(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const postComplain = async () => {
    var data = await AsyncStorage.getItem("response");
    var datas = JSON.parse(data);

    const formData = new FormData();
    formData.append("files", images);

    formData.append("complain_against", val?.rider_id?._id);
    formData.append("parcel", val?._id);
    formData.append("description", description);

    console.log("FormData", formData);

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${datas.access_token}`,
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    };
    try {
      const res = await fetch(
        `${BASE_URL}${URL_V}complaints`,
        requestOptions
      );
      const result = await res.json();
      showMessage("success", "Complain Created Successfully!");
      // alert();
      console.log("RESULT", result);
    } catch (err) {
      showMessage("error", "Error in Posted Complain");
      console.log("ERROR", err);
    }
  };

  const cancelTrip = async () => {
    try {
      const resp = await axios.post(
        `${BASE_URL}${URL_V}parcel/cancel`, 
        {
          parcel: val?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      );

      showMessage("success", resp.data);
    } catch (err) {
      console.log(err);
      showMessage("error", "Something went wrong while cancelling the trip");
    }
  };

  return (
    <Container>
      <DarkStatusBar />
      <Header leftType="back" />
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingHeaderTitle}>BOOKING</Text>
        <Text style={styles.bookingHeaderText}>
          CHECKOUT YOUR BOOKING00000
        </Text>
      </View>
      <Content contentContainerStyle={theme.layoutDf}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.bookingContainer}>
            <View style={styles.bookingContent}>
              <View style={styles.bookingDetail}>
                <Text style={styles.bookingIdText}>
                BOOKING ID : ${(val?._id).substr(0, 15)}
                </Text>
                <Button>
                  <Text style={styles.completeBtn}>{val?.status}</Text>
                </Button>
              </View>
              <View style={styles.bookingItem}>
                <Text style={styles.bookingTitle}>PAID</Text>
                <Text style={styles.bookingText}>
                  {
                      val?.pay_amount
                        ?(`${val?.pay_amount} USD`)
                        :(`${val?.fare} USD`)
                  
                  }
                </Text>
              </View>
              <View style={styles.bookingItem}>
                <Text style={styles.bookingTitle}>PICKUP TIME</Text>
                <Text style={styles.bookingText}>
                {val?.time ? 
      `${new Date(val.time).getFullYear()}-${(new Date(val.time).getMonth() + 1).toString().padStart(2, '0')}-${new Date(val.time).getDate().toString().padStart(2, '0')} ${new Date(val.time).getHours().toString().padStart(2, '0')}:${new Date(val.time).getMinutes().toString().padStart(2, '0')}` 
      : ""}
                </Text>
              </View>
             
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentText}>PACKAGES</Text>
              <Text style={styles.checkoutText}>
                Checkout your package informations
              </Text>
              <View style={styles.bookingItem}>
                <Text style={styles.bookingTitle}>DIMENSION</Text>
                <Text style={styles.bookingTitle}>QUANTITY</Text>
              </View>
              <View style={styles.bookingItem}>
                <Text style={styles.bookingTextDark}>Width</Text>
                <Text style={styles.bookingTextDark}>
                  (`${val?.width}`)
                </Text>
              </View>
              <View style={styles.bookingItem}>
                <Text style={styles.bookingTextDark}>Height</Text>
                <Text style={styles.bookingTextDark}>
                  `${val?.height}`
                </Text>
              </View>
              <View style={styles.bookingItem}>
                <Text style={styles.bookingTextDark}>Length</Text>
                <Text style={styles.bookingTextDark}>
                  {(`${val?.length}`)}
                </Text>
              </View>
              <View style={styles.bookingItem}>
                <Text style={styles.bookingTextDark}>Weight</Text>
                <Text style={styles.bookingTextDark}>
                  {(`${val?.weight}`)}
                </Text>
              </View>
            </View>
            <View style={styles.driverDetail}>
              <View style={styles.driverInfo}>
                <View>
                  <Text style={styles.driverText}>DRIVER</Text>
                  <Text style={styles.driverTextInfo}>
                    {("Driver informations")}
                  </Text>
                </View>
                <Button
                  onPress={() => {
                    // navigate("CustomerManageProfile");
                  }}
                >
                  <Image
                    source={{
                      uri:
                        val?.rider_id?.avatar ||
                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                    }}
                    style={styles.driverImg}
                  />
                </Button>
              </View>
              <View>
                <View style={styles.bookingItem}>
                  <Text style={styles.bookingTitle}>NAME</Text>
                  <Text style={styles.bookingTextDark}>
                    {(`${val?.rider_id?.first_name}`)}
                  </Text>
                </View>
                <View style={styles.bookingItem}>
                  <Text style={styles.bookingTitle}>VEHICAL NO</Text>
                  <Text style={styles.bookingTextDark}>
                    {(`${val?.rider_id?.vehicle_no}`)}
                  </Text>
                </View>
                <View style={styles.bookingItem}>
                  <Text style={styles.bookingTitle}>RATING</Text>
                  <View style={styles.ratingInfo}>
                    <Icon
                      name="star"
                      type="FontAwesome"
                      style={styles.ratingIconSelected}
                    />
                    <Icon
                      name="star"
                      type="FontAwesome"
                      style={styles.ratingIconSelected}
                    />
                    <Icon
                      name="star"
                      type="FontAwesome"
                      style={styles.ratingIconSelected}
                    />
                    <Icon
                      name="star"
                      type="FontAwesome"
                      style={styles.ratingIconSelected}
                    />
                    <Icon
                      name="star"
                      type="FontAwesome"
                      style={styles.ratingIcon}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </Content>
      <Modal
        position={"center"}
        isOpen={isOpen}
        onClosed={() => setIsOpen(false)}
        isDisabled={isDisabled}
        style={styles.modalRating}
      >
        <View style={styles.modalRatingContainer}>
          <Button style={styles.closeSortDesc}>
            <Icon
              name="close"
              type="MaterialIcons"
              style={[theme.SIZE_20, theme.DARKVIOLET]}
            />
          </Button>

          <View style={styles.formRow}>
            <Text style={styles.formText}>DESCRIPTION</Text>
            <TextInput
              placeholder="Please write your comments"
              placeholderTextColor="#ccc"
              multiline
              numberOfLines={7}
              textAlignVertical={"top"}
              value={description}
              onChangeText={(e) => {
                setDescription(e);
              }}
              // onChangeText={(v) => this.onChangeText("comment", v)}
              style={[styles.formInput, { backgroundColor: "#ededed" }]}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 60,
            }}
          >
            <View style={{ width: "47%", height: 50 }}>
              <Button
                style={styles.mailBtn}
                onPress={() => {
                  getPhotoFromGallery();
                }}
              >
                <Text style={styles.tripText}>ATTACH FILE HERE</Text>
              </Button>
            </View>
            <View style={{ width: "47%", height: 50 }}>
              <Button
                style={styles.mailBtn}
                onPress={() => {
                  postComplain();
                  setIsOpen(false);
                }}
              >
                <Text style={styles.tripText}>SEND</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.mailBtnInfo}>
  {val?.status !== 'completed' && ( 
    <Button
      style={[styles.mailBtn, { backgroundColor: "red" }]}
      onPress={() => {
        // navigate("CustomerWriteUs");
        cancelTrip();
      }}
    >
      <Text style={styles.tripText}>CANCEL</Text>
    </Button>
  )}
  
  <Button
    style={styles.mailInvoiceBtn}
    onPress={() => {
      setIsOpen(true);
    }}
  >
    <Text style={styles.tripText}>COMPLAIN</Text>
  </Button>
</View>

    </Container>
  );
}
