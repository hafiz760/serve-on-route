import React, { useEffect, useRef, useState } from "react";
import { View, ScrollView, Image, TouchableOpacity } from "react-native";
import { Container, Content, Text, Icon } from "../../../component/Basic";
import { TextInput, Button, ToggleSwitch } from "../../../component/Form";
import { COLOR, FAMILY, SIZE } from "../../../theme/typography";
import axios from "axios";
import styles from "./styles";
import theme from "../../../theme/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../component/Header";
import Modal from "react-native-modalbox";
import DropDownPicker from "react-native-dropdown-picker";
import DocumentPicker from "react-native-document-picker";
import { useSelector } from "react-redux";
import CountDown from "react-native-countdown-component";
import { DarkStatusBar } from "../../../component/StatusBar";
import { connect } from "react-redux";
import DatePicker from "react-native-date-picker";
import { showMessage } from "../../../helper/showAlert";
import ImagePicker from "react-native-image-crop-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Toast from "react-native-toast-message";
import TimerModal from "../../../component/TimerModal";
// import { BASE_URL, URL_V } from "@env";
import { BASE_URL, URL_V } from "../../../utilities/helper";
import { navigate } from "../../../navigations";
import DropdownPicker from "../../../component/DropdownPicker";
import AppSpinner from "../../../component/AppSpinner";

function SelectVehicle(params) {
  // console.log(params.route.params);
  // console.log("CURRENT PARAMS ===>", params.route.params);

  const from_location_cor = `${params.route.params.form.latitude}, ${params.route.params.form.longitude}`;

  const to_location_cor = `${params.route.params.to.latitude}, ${params.route.params.to.longitude}`;


  const isFocused = useIsFocused();
  const [bids, setBids] = useState([]);
  const [imageForShow, setImageForShow] = useState([]);
  const [date, setDate] = useState("");
  const [date2, setDate2] = useState("");
  const [formatedDate, setFormatedDate] = useState("");

  const [images, setImages] = useState();
  const [fare, setfare] = useState();
  const [isloading, setISLoading] = useState(false);
  const [width, setWidth] = useState({title: "0-1"});
  const [height, setHeight] = useState({title: "0-1"});
  const [length, setLength] = useState({title: "0-1"});
  const [weight, setWeight] = useState("");
  const [mainModel, setMainModel] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [openTimeModel, setOpenTimeModel] = useState(false);

  const [timerModel, setTimerModel] = useState(false);
  const [focus, setFocus] = useState(false);
  const [bottomModal, setBottomModal] = useState(false);
  const [dateOneTimeSelect, setDateOneTimeSelect] = useState(false);
  const [selectSlot, setSelectSlot] = useState("");
  const [until, setUntil] = useState(0);
  const [slotTimings, setSlotTimings] = useState({ label: "00:00 - 04:00", value: "00:00 - 04:00", slot : 1} || "");
  const [slotTimings2, setSlotTimings2] = useState("Please select time");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [items, setItems] = useState([
    { label: "Solid", value: "solid" },
    { label: "Metal", value: "metal" },
    { label: "Wood", value: "wood" },
    { label: "Fragile", value: "fragile" },
    { label: "Other Items", value: "otherItems" },
  ]);
  const jobOptions = [
    { title: "CIB" },
    { title: "Detective" },
    { title: "Forensic" },
    { title: "Patrol" }
  ];
  const [times, setTimes] = useState([
    { label: "00:00 - 04:00", value: "00:00 - 04:00", slot : 1},
    // { label: "04:00 - 08:00", value: "04:00 - 08:00", slot : 2},
    { label: "08:00 - 12:00", value: "08:00 - 12:00", slot : 3},
    { label: "12:00 - 16:00", value: "12:00 - 16:00", slot : 4},
    { label: "16:00 - 20:00", value: "16:00 - 20:00", slot : 5},
    { label: "20:00 - 24:00", value: "20:00 - 24:00", slot : 6},

  ])
  const [ageModels, setAgeModels] = useState(false);
  const [openWeightModel, setOpenWeightModel] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState("0-5");
  // const [weightRange, setWeightRange] = useState([
  //   { label: "0-5", value: "0-5" },
  //   { label: "5-10", value: "5-10" },
  //   { label: "10-15", value: "10-15" },
  //   { label: "15-20", value: "15-20" },
  //   { label: "20-25", value: "20-25" },
  //   { label: "25-30", value: "25-30" },
  //   { label: "35-40", value: "35-40" },
  //   { label: "40+", value: "40+" },
  // ]);
  const [weightRange, setWeightRange] = useState({title: "0-5"});
  const weightRangeValue=[
    { title: "0-5", },
    { title: "5-10", },
    { title: "10-15",},
    { title: "15-20", },
    { title: "20-25",  },
    { title: "25-30",  },
    { title: "35-40",  },
    { title: "40+", },

  ]
  const WidthRangeValue=[
    { title: "0-1", },
    { title: "2-3", },
    { title: "4-5",},
    { title: "6-7", },
    { title: "8-9",  },
    { title: "9-10",  },
    { title: "11-12",  },
    { title: "13+", },

  ]


  const [pracelTimeType, setPracelTimeType] = useState("time");
  const [itemsType, setItemsType] = useState("solid");
  const [time, setTime]= useState("Select Time");
  const { socket } = useSelector((state) => state.socket);

  const handleRejection = (bid) => {
    const filteredBids = bids.filter((b) => b._id !== bid._id);

    if (filteredBids.length === 0) {
      setMainModel(false);
    }

    setBids(filteredBids);
  };

  const ModalNotification = useRef();
  const getPhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      var format = {
        fileCopyUri: null,
        name: image.path.split("/")[image.path.split("/").length - 1],
        height: image?.height,
        width: image?.width,
        size: image?.size,
        type: image.mime,
        uri: image?.path,
      };
      setImageForShow((pre) => {
        return [...pre, format];
      });
      setImages(format);
    });
  };
  const UploadData = async () => {
    try {
      const res = await DocumentPicker.pick({
        allowMultiSelection: true,
        type: [DocumentPicker.types.allFiles],
      });
      // console.log("Image frm galaery", res);
      setImages(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  useEffect(() => {
    // if (!isFocused) {
    socket.on("bidding", (incomingBid) => {
      const incomingBidId = incomingBid.bidder._id;
      setBids((prevBids) => {
        const newBids = [...prevBids];
        if (prevBids?.length > 0) {
          const isBidFound = newBids?.find(
            (bid) => bid?.bidder?._id === incomingBidId
          );
          if (isBidFound) {
            const filteredBids = newBids?.filter(
              (bid) => bid?.bidder?._id !== incomingBidId
            );
            const sortedBids = filteredBids.sort((a, b) => {
              const bidA = parseInt(a.bid_amount, 10);
              const bidB = parseInt(b.bid_amount, 10);
              return bidB - bidA;
            });
            return [incomingBid, ...sortedBids];
          } else {
            newBids.push(incomingBid);
            const sortedBids = newBids.sort((a, b) => {
              const bidA = parseInt(a.bid_amount, 10);
              const bidB = parseInt(b.bid_amount, 10);
              return bidB - bidA;
            });

            return sortedBids;
          }
        } else {
          return [incomingBid];
        }
      });
      if (!mainModel) {
        setMainModel(true);
        setTimerModel(false);
        setUntil(0);
      }
    });
    // }
  }, []);

  const MainModel = ({ value }) => {
    const acceptRide = async (value) => {
      try {
        var data = await AsyncStorage.getItem("response");
        var datas = JSON.parse(data);

        const formData = new FormData();
        formData.append("rider_id", value.bidder._id);
        formData.append("status", "in_progress");
        formData.append("pay_amount", value?.bid_amount);

        const requestOptions = {
          headers: {
            Authorization: `Bearer ${datas.access_token}`,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        };
        const resp = await axios.patch(
          `${BASE_URL}${URL_V}parcel/${value.parcel._id}`,
          requestOptions.body,
          {
            headers: {
              Authorization: `Bearer ${datas.access_token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setMainModel(false);
        setBids([]);
        alert("You have chosen ur driver. He is on his way!");
      } catch (err) {
      }
    };
    const cancelRide = async (value) => {
      try {
        var data = await AsyncStorage.getItem("response");
        var datas = JSON.parse(data);

        const formData = new FormData();
        formData.append("rider_id", value.bidder._id);

        const requestOptions = {
          headers: {
            Authorization: `Bearer ${datas.access_token}`,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        };
        const resp = await axios.patch(
          `${BASE_URL}${URL_V}parcel/${value.parcel._id}`,
          requestOptions.body,
          {
            headers: {
              Authorization: `Bearer ${datas.access_token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

      } catch (err) {
      }
    };

    return (
      <Modal
        ref={ModalNotification}
        isOpen={true}
        entry={"top"}
        swipeToClose={false}
        style={{
          height: 180,
          width: 380,
          borderRadius: 10,
          alignItems: "center",
          // marginTop:5,
          // backgroundColor:"green"
        }}
        swipeArea={300}
        backdropPressToClose={false}
      >
        <View style={{ margin: 10, borderRadius: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: "20%", marginTop: 20 }}>
              <Image
                source={
                  value?.bidder?.avatar
                    ? {
                      uri: value?.bidder?.avatar,
                    }
                    : require("../../../assets/images/driver.jpeg")
                }
                resizeMode="cover"
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  margin: 10,
                }}
              />
            </View>
            <View style={{ paddingTop: 20, width: "70%" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  margin: 5,
                  fontSize: 20,
                }}
              >
                <Text style={styles.biddingCardText}>
                  {value?.bidder?.first_name} {value?.bidder?.last_name}
                </Text>
                <Text style={styles.biddingCardText}>
                  Fare: ${value?.bid_amount}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  margin: 5,
                  fontSize: 20,
                }}
              >
                {/* <Text style={styles.biddingCardText}>
                  Ph: {value?.bidder?.phone}
                </Text> */}
                {/* <Text style={styles.biddingCardText}>25</Text> */}
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
                  Rating: {value?.bidder?.rating}
                </Text>
                {/* <Text style={styles.biddingCardText}>#FFF</Text> */}
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
              style={[styles.bookingDeclineBtn, { width: "40%" }]}
              onPress={() => {
                // navigate("CustomerPayment");
                handleRejection(value);
              }}
            >
              <Text style={styles.bookingBtnText}>Decline</Text>
            </Button>
            <Button
              style={[styles.bookingBtn, { width: "40%" }]}
              onPress={() => {
                acceptRide(value);
                // navigate("CustomerPayment");
              }}
            >
              <Text style={styles.bookingBtnText}>Accept</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  };
  const getPhotoFromGallery = () => {
    // setBottomModal(true);
    if (imageForShow.length >= 3) {
      showMessage("You can't uploaded more than three images");
    } else {
      getPhotoFromCamera();
    }

  
  };

 

  const fetchData = async () => {
    setISLoading(true)
    var data = await AsyncStorage.getItem("response");
    var datas = JSON.parse(data);

    const formData = new FormData();

    imageForShow[0]?.uri && formData.append("files", imageForShow[0]);
    imageForShow[1]?.uri && formData.append("files", imageForShow[1]);
    imageForShow[2]?.uri && formData.append("files", imageForShow[2]);
    formData.append(
      "from_location",
      JSON.stringify(params.route.params.form.locationName)
    );
    formData.append(
      "to_location",
      JSON.stringify(params.route.params.to.locationName)
    );
    formData.append(
      "from_location_cor",
      `${params.route.params.form.latitude},${params.route.params.form.longitude}`
    );
    formData.append(
      "to_location_cor",
      `${params.route.params.to.latitude},${params.route.params.to.longitude}`
    );
    formData.append("height", height.title);
    formData.append("fare", fare);
    formData.append("width", width.title);
    formData.append("time", formatedDate);
    // formData.append("time", "2023-10-25T18:37:33.582Z");
    formData.append("length",length.title);
    formData.append("weight", width.title);
    formData.append("parcel_type", itemsType);
    formData.append("receiving_slot", slotTimings);
    formData.append("biddingEndTime", "2026-12-12");
    formData.append("bidding_type", pracelTimeType);

    // console.log("FormData", JSON.stringify(formData, null, 2));
    // return
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${datas.access_token}`,
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    };
    try {
      const res = await fetch(`${BASE_URL}${URL_V}parcel`, requestOptions);
      // console.log("fetchData ~ result======>", JSON.stringify(res,null,2))
      const result = await res.json();
      // console.log("result>>>>>", result);
      if (result.statusCode === 400) {
        // showMessage("error", result.message);
      } else {
        setFocus(true);
        showMessage("success","Parcel Created Successfully!. Wait for drivers to bid");
        // setUntil(10)
        // setTimerModel(true)
      }

      // console.log("RESULT ===>111", result);
    } catch (err) {
      showMessage("error","Something went wrong");
    }
    finally{
      setISLoading(false)
    }
  };

  // const deleteShowImage = (value) => {
  //   // console.log("press")
  //   setImageForShow((previous) =>
  //     previous.filter((val) => val?.uri != value?.uri)
  //   );
  //   showMessage("success", "Image Delete Successfully");
  // };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    // Format the date as "DD-MM-YYYY"
    const formattedDate1 = moment(date).format("DD-MM-YYYY");
    // Set the first formatted date in state
    setDate(formattedDate1);

    // Format the date as "YYYY-MM-DD HH:mm:ss"
    const formattedDate2 = moment(date).format("YYYY-MM-DD HH:mm:ss");
    // Set the second formatted date in state

    setFormatedDate(formattedDate2);

    // Hide the date picker or perform other actions as needed
    hideDatePicker();
  };


  return (
    <Container style={theme.layoutFx}>
      <Modal
        isOpen={mainModel}
        entry={"top"}
        backdropOpacity={0.3}
        swipeToClose={false}
      >
        {bids.map((val) => {
          return (
            <View style={{ height: "28%" }} key={val?.bidder?._id}>
              <MainModel value={val} />
            </View>
          );
        })}
        <Button
          style={[
            styles.bookingBtn,
            { backgroundColor: "grey", marginTop: 40 },
          ]}
          onPress={() => {
            navigate("CustomerPayment");
            setMainModel(false);
          }}
        >
          <Text style={styles.bookingBtnText}>Cancel</Text>
        </Button>
      </Modal>
      <DarkStatusBar />
      <Header leftType="back" title={"Book Your Parcel"} />
      <Content contentContainerStyle={theme.layoutDf}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.selectVehicleContainer, { height: "80%" }]}>
            <View style={styles.selectVehicleContent}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Booking Details</Text>
              </View>
              <Text style={styles.inputHeading}>Date</Text>
              <View style={styles.accOrderInfo}>
                <Button
                  onPress={() => {
                    showDatePicker(true);
                  }}
                >
                  <View style={styles.selectDateMain}>
                    <Text style={styles.selectDateText}>
                      {date === "" ? "Select Date" : date}
                    </Text>
                    <View style={{ marginEnd: 20, }}>
                      <Icon
                        name="calendar-month"
                        type="MaterialCommunityIcons"
                      />
                    </View>
                  </View>
                </Button>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
              </View>
              <Text style={styles.inputHeading2}>
                Please choose a time slot, When a driving host can come to pick
                up the parcel.
              </Text>
              {/* <TimeSelection /> */}
              {/* <View style={styles.slotContaainer}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectSlot(1), setSlotTimings("00:00 - 04:00");
                  }}
                  style={[selectSlot === 1 ? styles.slotBtnB : styles.slotBtn]}
                >
                  <Text style={styles.timeText}>00:00 - 04:00</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSelectSlot(2), setSlotTimings("04:00 - 08:00");
                  }}
                  style={[selectSlot === 2 ? styles.slotBtnB : styles.slotBtn]}
                >
                  <Text style={styles.timeText}>04:00 - 08:00</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.slotContaainer}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectSlot(3), setSlotTimings("08:00 - 12:00");
                  }}
                  style={[selectSlot === 3 ? styles.slotBtnB : styles.slotBtn]}
                >
                  <Text style={styles.timeText}>08:00 - 12:00</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSelectSlot(4), setSlotTimings("12:00 - 16:00");
                  }}
                  style={[selectSlot === 4 ? styles.slotBtnB : styles.slotBtn]}
                >
                  <Text style={styles.timeText}>12:00 - 16:00</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.slotContaainer}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectSlot(5), setSlotTimings("16:00 - 20:00");
                  }}
                  style={[selectSlot === 5 ? styles.slotBtnB : styles.slotBtn]}
                >
                  <Text style={styles.timeText}>16:00 - 20:00</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSelectSlot(6), setSlotTimings("20:00 - 24:00");
                  }}
                  style={[selectSlot === 6 ? styles.slotBtnB : styles.slotBtn]}
                >
                  <Text style={styles.timeText}>20:00 - 24:00</Text>
                </TouchableOpacity>
              </View> */}



              <View style={{
                height: 80,
              }}>
                <DropDownPicker
                  open={openTimeModel}
                  items={times}
                  setOpen={setOpenTimeModel}
                  value={slotTimings}
                  onSelectItem={(e) => {
                    setSlotTimings(e.value); 
                    if(e.value == "00:00 - 04:00"){
                    setSelectSlot(1);
                    }else if(e.value == "04:00 - 08:00"){
                    setSelectSlot(2);
                    }else if(e.value == "08:00 - 12:00"){
                    setSelectSlot(3);
                    }else if(e.value == "12:00 - 16:00"){
                    setSelectSlot(4);
                    }else if(e.value == "16:00 - 20:00"){
                    setSelectSlot(5);
                    }else if(e.value == "20:00 - 24:00"){
                    setSelectSlot(6);
                    }  
                  }}
                  setItems={setItems}
                  style={{
                    // flex: 1,
                    paddingVertical: 19,
                    marginTop: 10,
                    marginBottom: 0,
                    borderWidth: 0,
                    color: COLOR.PRIMARY,
                    fontSize: SIZE.SIZE_14,
                    fontFamily: FAMILY.REGULAR,

                  }}
                  labelStyle={{
                    color:COLOR.DARKVIOLET, // Custom text color
                    fontSize: 16,
                  }}
          
                  // ✅ Custom dropdown icon
                  ArrowDownIconComponent={() => (
                    <FontAwesome name="angle-down" size={22} color={COLOR.DARKVIOLET} />
                  )}
          
                />
              </View>




              <Text style={styles.timeTex2t}>Offer Your Fare</Text>
              <View style={styles.formRow}>
                <TextInput
                  placeholder="Enter Your Fare"
                  value={fare}
                  placeholderTextColor="rgba(89, 73, 158, 0.5)"
                  onChangeText={(text) => {
                    setfare(text);
                  }}
                  keyboardType="numeric"
                  style={styles.formInput}
                />
              </View>

              <View>
                {/* <Text style={styles.timeTex2t}>Weight Range</Text> */}
                <View style={{
                // height: 80,
              }}>
                  <DropdownPicker
                data={weightRangeValue}
                onSelect={(selectedItem, index) => {
                  setWeight(selectedItem );
               

                }}
                title={'Weight Range(kg)'}
                // touched={touched.job}
                // errorMessage={errors.job}
                isPickerOpen={ageModels}
                defaultButtonText={weightRange.title}
              //   onFocus={() => setOpenBrandPicker(true)}
              //   onBlur={() => setOpenBrandPicker(false)}
              />
                {/* <DropDownPicker
                  open={openWeightModel}
                  items={weightRange}
                  setOpen={setOpenWeightModel}
                  value={selectedWeight}
                  onSelectItem={(e) => {
                    setSelectedWeight(e.value); 
                  
                  }}
                  setItems={setItems}
                  style={{
                    // flex: 1,
                    paddingVertical: 19,
                    marginTop: 10,
                    marginBottom: 0,
                    borderWidth: 0,
                    color: COLOR.PRIMARY,
                    fontSize: SIZE.SIZE_14,
                    fontFamily: FAMILY.REGULAR,

                  }}
                  labelStyle={{
                    color:COLOR.DARKVIOLET, // Custom text color
                    fontSize: 16,
                  }}
                  dropDownContainerStyle={{
                    borderColor: "#4A90E2",
                    backgroundColor: "#FFFFFF",
                    zIndex: 999,
                    elevation: 999,
                    // Ensures dropdown stays above
                  }}
        
          
                  // ✅ Custom dropdown icon
                  ArrowDownIconComponent={() => (
                    <FontAwesome name="angle-down" size={22} color={COLOR.DARKVIOLET} />
                  )}
          
                /> */}
              </View>
                {/* <View style={[styles.formRow]}>
                  <View style={{ marginRight: 10 }}>
                    <Icon
                      name="box"
                      type="Feather"
                    />
                  </View>
                  <TextInput
                    type="number"
                    placeholder="Weight"
                    placeholderTextColor="rgba(89, 73, 158, 0.5)"
                    style={styles.formInput}
                    value={weight}
                    onChangeText={(text) => {
                      setWeight(text);
                    }}
                    keyboardType="numeric"
                    maxValue={100}
                  />
                </View> */}
              </View>
              {/* <Text style={styles.timeText2}>Dimension</Text> */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {/* <View>
                  <View>
                    <View style={[styles.formRow2, { width: wp("25") }]}>
                      <TextInput
                        placeholder="Length"
                        placeholderTextColor="rgba(89, 73, 158, 0.5)"
                        keyboardType="numeric"
                        value={length}
                        onChangeText={(text) => {
                          setLength(text);
                        }}
                        style={[styles.formInput,]}
                      />
                    </View>
                  </View>
                </View> */}
                
                      <DropdownPicker
                data={WidthRangeValue}
                onSelect={(selectedItem, index) => {
                  setLength( selectedItem );
               

                }}
                title={'Length(ft)'}
                // touched={touched.job}
                // errorMessage={errors.job}
                isPickerOpen={ageModels}
                defaultButtonText={length.title}
                customButtonStyle={{width:100}}
              //   onFocus={() => setOpenBrandPicker(true)}
              //   onBlur={() => setOpenBrandPicker(false)}
              />
                {/* <View>
                  <View style={[styles.formRow2, { width: wp("25") }]}>
                    <TextInput
                      type="number"
                      placeholder="Width"

                      placeholderTextColor="rgba(89, 73, 158, 0.5)"
                      style={styles.formInput}
                      value={width}
                      onChangeText={(text) => {
                        setWidth(text);
                      }}
                      keyboardType="numeric"
                      maxValue={100}
                    />
                  </View>
                </View> */}
                       <DropdownPicker
                data={WidthRangeValue}
                onSelect={(selectedItem, index) => {
                  setHeight( selectedItem);
               

                }}
                title={'Height(ft)'}
                // touched={touched.job}
                // errorMessage={errors.job}
                isPickerOpen={ageModels}
                defaultButtonText={height.title}
                customButtonStyle={{width:100}}
              //   onFocus={() => setOpenBrandPicker(true)}
              //   onBlur={() => setOpenBrandPicker(false)}
              />
                {/* <View>
                  <View>
                    <View style={[styles.formRow2, { width: wp("25") }]}>
                      <TextInput
                        placeholder="Height"
                        placeholderTextColor="rgba(89, 73, 158, 0.5)"
                        keyboardType="numeric"
                        value={height}
                        onChangeText={(text) => {
                          setHeight(text);
                        }}
                        style={[styles.formInput,]}
                      />
                    </View>
                  </View>
                </View> */}
                       <DropdownPicker
                data={WidthRangeValue}
                onSelect={(selectedItem, index) => {
                  setWidth( selectedItem );
               

                }}
                title={'Width(ft)'}
                // touched={touched.job}
                // errorMessage={errors.job}
                isPickerOpen={ageModels}
                defaultButtonText={width.title}
              //   onFocus={() => setOpenBrandPicker(true)}
              //   onBlur={() => setOpenBrandPicker(false)}
              customButtonStyle={{width:100}}
              />
              </View>

              
              <Text style={styles.timeTex2t}>Material Type</Text>
              <View style={{
                height: 80,
              }}>
                <DropDownPicker
                  open={openModel}
                  items={items}
                  setOpen={setOpenModel}
                  value={itemsType}
                  onSelectItem={(e) => setItemsType(e.value)}
                  setItems={setItems}
                  style={{
                    paddingVertical: 19,
                    marginTop: 10,
                    marginBottom: 5,
                    borderWidth: 0,
                    color: COLOR.PRIMARY,
                    fontSize: SIZE.SIZE_14,
                    fontFamily: FAMILY.REGULAR,

                  }}
                  labelStyle={{
                    color:COLOR.DARKVIOLET, // Custom text color
                    fontSize: 16,
                  }}
          
                  // ✅ Custom dropdown icon
                  ArrowDownIconComponent={() => (
                    <FontAwesome name="angle-down" size={22} color={COLOR.DARKVIOLET} />
                  )}
                />
              </View>

              <Text style={styles.timeTex2t}>Upload Parcel Photo</Text>
              <View style={styles.accordion}>
                <Button
                  style={styles.uploadBtn}
                  onPress={() => {
                    getPhotoFromGallery();
                  }}
                >
                  <Text style={styles.uploadBtnText}>
                    UPLOAD THE PHOTOS
                  </Text>
                  <Icon
                    name="upload"
                    type="AntDesign"
                    style={{ marginEnd: 20, }}
                  />
                </Button>
              </View>
              {imageForShow.length > 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    maxWidth: "70%",
                  }}
                >
                  {imageForShow.map((val) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          deleteShowImage(val);
                        }}
                      >
                        <Image
                          source={{
                            uri:
                              val?.uri ||
                              "https://cdn.pixabay.com/photo/2016/01/10/22/07/beauty-1132617__340.jpg",
                            i: "file:///storage/emulated/0/Android/data/com.wditechy.truckie/files/Pictures/fb3506d2-0efc-49f7-9dfc-dc6f5897d544.jpg",
                          }}
                          style={{
                            width: 75,
                            height: 75,
                            borderRadius: 35,
                            marginBottom: hp(1),
                          }}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </Content>
      <Button
        style={styles.bookingBtn}
        onPress={() => {
          imageForShow.length == 0
            ? showMessage("error", "Please select atleast one image")
            : fetchData();
        }}
      >{
        isloading?
      
       <View style={{paddingVertical:5}}>
         <AppSpinner color={COLOR.PRIMARY} size="large" />
       </View>:
        <Text style={styles.bookingBtnText}>BOOK NOW</Text>}
      </Button>

      <Modal
        isOpen={bottomModal}
        entry={"bottom"}
        backdropOpacity={0.3}
        swipeToClose={false}
        position="bottom"
        style={{
          height: 200,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
      >
        <Button
          style={[styles.bookingBtn, { backgroundColor: "purple" }]}
          onPress={() => {
            getPhotoFromCamera();
            setBottomModal(false);
          }}
        >
          <Text style={styles.bookingBtnText}>OPEN CAMERA</Text>
        </Button>
        <Button
          style={styles.bookingBtn}
          onPress={() => {
            UploadData();
            setBottomModal(false);
          }}
        >
          <Text style={styles.bookingBtnText}>SELECT FROM FILES</Text>
        </Button>
        <Button
          style={[styles.bookingBtn, { backgroundColor: "red" }]}
          onPress={() => {
            setBottomModal(false);
          }}
        >
          <Text style={styles.bookingBtnText}>CANCLE</Text>
        </Button>
      </Modal>
      <Modal
        isOpen={timerModel}
        entry={"bottom"}
        backdropOpacity={0.3}
        swipeToClose={false}
        position="bottom"
        style={{
          height: 200,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
      >
        <View style={{ alignSelf: "center" }}>
          <Text
            style={{
              marginTop: hp(2),
              fontFamily: FAMILY.BOLD,
              fontSize: SIZE.SIZE_18,
              color: "#000",
            }}
          >
            Wating for bid
          </Text>
        </View>
        <CountDown
          until={until}
          size={30}
          onFinish={() => setTimerModel(false)}
          digitStyle={{ backgroundColor: "#FFF" }}
          digitTxtStyle={{ color: "#1CC625" }}
          timeToShow={["M", "S"]}
          timeLabels={{ m: "MM", s: "SS" }}
        />
      </Modal>
    </Container>
  );
}
export default connect(({ session }) => ({ session }))(SelectVehicle);
