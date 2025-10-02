import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { COLOR, FAMILY, SIZE } from "@theme/typography";
import { Container, Content, Text, Icon } from "@component/Basic";
import { TextInput, Button, ToggleSwitch, Checkbox } from "@component/Form";
import DatePicker from "react-native-date-picker";

import styles from "./styles";
import theme from "@theme/styles";

import Header from "@component/Header";
import Support from "@component/Support";

import { navigate, navigateReset } from "@navigation";
import { __ } from "@utility/translation";
import PhoneInput from "react-native-phone-number-input";
import { DarkStatusBar } from "@component/StatusBar";
import { useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Hyperlink from "react-native-hyperlink";
import DocumentPicker from "react-native-document-picker";
import { showMessage } from "../../../helper/showAlert";
import AppSpinner from "../../../component/AppSpinner";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import TextInputComp from "../../../component/TextInputComp";
import DropDownComp from "../../../component/DropDownComp";
import { gender } from "../../../constant/DropdownData";
import ImagePicker from "react-native-image-crop-picker";
import DropDownPicker from "react-native-dropdown-picker";
import { BASE_URL, URL_V } from "../../../utilities/helper";
const imagedata = [
  { id: 1, image: require("@asset/images/car1.png") },
  { id: 2, image: require("@asset/images/car2.png") },
  { id: 3, image: require("@asset/images/car3.png") },
];
export default function ManageProfile({ navigation, route }) {
  const param = route.params
  console.log("param", param)
  const [urlValue, setUrlValue] = useState();
  const [tabSelected, setTabSelected] = useState("profile");
  const [isEnabled, setIsEnabled] = useState(false);
  const [idCardCheck, setIdCardCheck] = useState();
  const [profile, setProfile] = useState();
  const [profile1, setProfile1] = useState();

  const [profileHttp, setProfileHttp] = useState("");
  const [imageForShow, setImageForShow] = useState([]);
  // console.log("imageForShow",imageForShow);
  const [licenseProofCheck, setLicenseProofCheck] = useState();
  const [license, setLicense] = useState("");
  const [date, setDate] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [displayDate, setDisplayDate] = useState("");
  const [isDateExist, setIsDateExist] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [loading, setLoading] = useState(true);
  const phoneInput = useRef();
  const [openModel, setOpenModel] = useState(false);
  const [items, setItems] = useState([
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ]);
  const [itemsType, setItemsType] = useState("Male");
  const [PaymentTabSelected, setPaymentTabSelected] = useState("card");
  const [profileImage, setProfileImage] = useState()

  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [vehicalNumber, setVehicalNumber] = useState()
  const [idCardNumber, setIdCardNumber] = useState()
  const [licenseNumber, setLicenseNumber] = useState()
  const [carName, setCarName] = useState()
  const [carNumber, setCarNumber] = useState()



  const [phoneNumber, setPhoneNumber] = useState()
  const [gender, setGender] = useState()
  const [dob, setDob] = useState()
  const [idCardPicture, setIdCardPicture] = useState([])
  const [licensePicture, setLicensePicture] = useState([])
  const [carPicture, setCarPicture] = useState()



  const UploadData = async (setPath) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setPath(res[0]);
      console.log(res[0],"imageeeeee");
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [isEnabled]);

  useEffect(() => {
    getData();
  }, [phoneNumber]);


  const removeImage = (idToRemove, index) => {
    const updatedImageData = imageForShow.filter(item => item !== idToRemove);
    // const updatedImageData = imageForShow.filter(index => console.log(">>>",index));
    console.log("0000", updatedImageData);
    setImageForShow(updatedImageData);
  };


  const getData = async () => {
    var data = await AsyncStorage.getItem("response");
    var datas = JSON.parse(data);
    // console.log(datas);

    const res = axios
      .get(
        `  ${BASE_URL}/v1/users/user-by-id/${datas._id}`,

        {
          headers: {
            Authorization: `Bearer ${datas.access_token}`,
          },
        }
      )
      .then((data) => {
        console.log("res account no>>>>>>", JSON.stringify(data.data, null, 2));
        setProfileImage(data.data.data.cover_image)
        setName(data.data.data.name);
        setPhoneNumber(data.data.data.phone);
        setGender(data.data.data.gender);
        setDob(data.data.data.phone);
        setIdCardNumber(data.data.data.ID);
        setIdCardPicture(data.data.data.ID_file);


        setLicenseNumber(data.data.data.license_id);
        setLicensePicture(data.data.data.driving_license);
        setCarName(data.data.data.car_name);
        setCarNumber(data.data.data.vehicle_number);
        setCarPicture(data.data.data.car_picture);
      })
      .catch((err) => {
        console.log("Get data account error");
        console.log("error", err);
        setLoading(false);
      });
  };


  const fetchData = async () => {
    var data = await AsyncStorage.getItem("response");
    var datas = JSON.parse(data);
    console.log("datas");
    const res = axios
      .post(
        `${BASE_URL}/v1/users/connect-account`,
        {
          type: "express",
          country: "US",
          business_type: "individual",
        },
        {
          headers: {
            Authorization: `Bearer ${datas.access_token}`,
          },
        }
      )
      .then((data) => {
        console.log("res account no", data.data.account);
        ConnectingAccount(data.data.account, datas);
      })
      .catch((err) => {
        console.log(("error", err));
      });
  };

  const ConnectingAccount = async (values, datas) => {
    console.log("datas.access", datas);
    const res = axios
      .post(
        `${BASE_URL}/v1/users/link-account-`,
        {
          account: values,
          refresh_url: "https://example.com/reauth",
          return_url: "https://example.com/return",
          type: "account_onboarding",
        },
        {
          headers: {
            Authorization: `Bearer ${datas?.access_token}`,
          },
        }
      )
      .then((data) => {
        console.log("urlll", data.data);
        setUrlValue(data?.data?.url);
      })
      .catch((err) => {
        console.log(("error", err));
      });
  };


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
      console.log(format);
    });
  };


  async function onSubmit() {
    await Support.showSuccess({
      title: __("Success!"),
      message: __("Transaction success"),
      onHide: () => {
        navigateReset("");
      },
      hideDelay: 2500,
    });
  }

  const submit = async () => {

    console.log(
      name,
      licenseNumber,
      phoneNumber,
      "this is picture",
      profile1,
      idCardNumber
    );

    var data = await AsyncStorage.getItem("response");
    var datas = JSON.parse(data);
    const formData = new FormData();
    
    formData.append("first_name", name);
    formData.append("cover_image_file", profile1);
    formData.append("national_ID_file", idCardCheck);
    formData.append("ID", idCardNumber);
    formData.append("phone", phoneNumber);
    formData.append("vehicle_no", vehicalNumber);
    formData.append("car_name", carName);
    formData.append("vehicle_no", carNumber);

    formData.append("driving_license", licenseNumber);
    formData.append("driving_license_file", licenseProofCheck);
    formData.append("driving_license_expiry", displayDate);
    formData.append("email", email);

    console.log("FormData", formData);

    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${datas.access_token}`,
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    };
    try {
      const res = await fetch(
        `${BASE_URL}${URL_V}users/update-user`,
        requestOptions
      );
      const result = await res.json();
      showMessage("success", "Profile Updated Successfully");
      console.log("RESULT", result);
    } catch (err) {
      console.log("ERROR", err);
    }
  };

  function renderCard() {
    return (
      <View>
        <View style={styles.paymentForm}>
          <View style={styles.formRow}>
            <Text style={styles.formText}>{__("NAME ON CARD")}</Text>
            <TextInput
              placeholder="Carol cartex"
              placeholderTextColor="#000"
              style={styles.formInput}
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formText}>{__("CARD NUMBER")}</Text>
            <TextInput
              placeholder="0000 3434 7867 9523"
              keyboardType="numeric"
              placeholderTextColor="#000"
              style={styles.formInput}
            />
          </View>
          <View style={styles.cardInfo}>
            <View style={styles.formRow2}>
              <Text style={styles.formText}>{__("EXPIRY DATE")}</Text>
              <TextInput
                placeholder="19 / 2019"
                placeholderTextColor="#000"
                keyboardType="numeric"
                style={styles.formInput}
              />
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formText}>{__("CVV")}</Text>
              <TextInput
                placeholder="657"
                placeholderTextColor="#000"
                keyboardType="numeric"
                style={styles.formInput}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  function renderPayPal() {
    return (
      <View style={styles.payPalInfo}>
        <Button>
          <Image
            style={styles.cardImg}
            source={require("@asset/images/downloadicon.png")}
          />
        </Button>
      </View>
    );
  }


  function renderProfile() {
    return loading ? (
      <View style={styles.loaderContainerStyles}>
        <AppSpinner size="large" color={COLOR.PRIMARY} />
      </View>
    ) : (
      <SafeAreaView style={{ width: "100%", height: "79%" }}>
        <ScrollView showsVerticalScrollIndicator={true}>
          <View style={styles.profileContainer}>
            <View style={styles.profileContent}>
              <View style={styles.profileImgItem}>
                <View style={styles.profileImgDetail}>
                  <View style={styles.avatarImg}>
                    <Image
                      source={{
                        uri:
                          profile?.uri ||
                          profileHttp ||
                          "https://images.pexels.com/photos/736716/pexels-photo-736716.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
                      }}
                      style={styles.profileImg}
                    />
                  </View>
                  <Button
                    style={styles.editBtn}
                    onPress={() => {
                      UploadData(setProfile);
                    }}
                  >
                    <Icon
                      name="pencil"
                      type="SimpleLineIcons"
                      style={[theme.SIZE_16, theme.DARK]}
                    />
                  </Button>
                </View>
              </View>
              <View style={styles.profileform}>
                <View style={styles.formRow}>
                  {/* <Text style={styles.formText}>{__("NAME")}</Text> */}
                  <TextInput
                    placeholder="Enter Your Name"
                    // placeholderTextColor="#000"
                    style={styles.formInput}
                    value={name}
                    onChangeText={(e) => {
                      setName(e);
                    }}
                  />
                </View>
                <View style={styles.formRow}>
                  {/* <Text style={styles.formText}>{__("EMAIL ADDRESS")}</Text> */}
                  <TextInput
                    placeholder="Enter Your Email"
                    // placeholderTextColor="#000"
                    style={styles.formInput}
                    value={email}
                    onChangeText={(e) => {
                      setEmail(e);
                    }}
                  />
                </View>
                <View style={styles.formRow}>
                  {/* <Text style={styles.formText}>{__("Vehical Number")}</Text> */}
                  <TextInput
                    placeholder="Enter Your Vehical Number"
                    // placeholderTextColor="#000"
                    style={styles.formInput}
                    value={vehicalNumber}
                    onChangeText={(e) => {
                      setVehicalNumber(e);
                    }}
                  />
                </View>
                <View style={styles.formRow}>
                  {/* <Text style={styles.formText}>{__("MOBILE NUMBER")}</Text> */}
                  <TextInput
                    placeholder="Enter Your Mobile Number"
                    keyboardType="numeric"
                    // placeholderTextColor="#000"
                    style={styles.formInput}
                    value={phoneNumber}
                    onChangeText={(e) => {
                      setPhoneNumber(e);
                    }}
                  />
                </View>

                <View style={[styles.profileBtnInfo, styles.profileBtnInfoTwo]}>
                  <View style={styles.formRow2}>
                    <Text style={styles.formText}>LICENSE EXPIRY DATE:</Text>
                    <DatePicker
                      modal
                      open={open}
                      date={date}
                      onConfirm={(date) => {
                        setOpen(false);
                        setDate(date);
                        setDisplayDate(date.toISOString());
                      }}
                      onCancel={() => {
                        setOpen(false);
                      }}
                    />
                    <Text>
                      {displayDate ? displayDate.substr(0, 10) : "NO DATE"}
                    </Text>
                  </View>
                  {(!displayDate || !isDateExist) && (
                    <Button
                      style={styles.uploadBtn}
                      onPress={() => {
                        setOpen(true);
                      }}
                    >
                      <Text style={styles.uploadBtnText}>SELECT DATE</Text>
                    </Button>
                  )}
                </View>

                {/* <View style={styles.profileBtnInfo}>
                  <View style={styles.formRow2}>
                     <Text style={styles.formText}>{__("DRIVING LICENSE")}</Text> 
                    <TextInput
                      placeholder="Enter Your Driving License"
                      placeholderTextColor="#000"
                      style={styles.formInput}
                      value={licenseNumber}
                      onChangeText={setDrivingLiscence}
                    />
                  </View>
                  <Button style={styles.uploadBtn}>
                    <Text style={styles.uploadBtnText}>{__("VIEW")}</Text>
                  </Button>
                </View> */}
                <View style={[styles.profileBtnInfo, styles.profileBtnInfoTwo]}>
                  <View style={styles.formRow2}>
                    <Text style={styles.formText}>
                      {__("NATIONAL ID CARD")}
                    </Text>
                    <TextInput
                      placeholder="Enter Vehicle Number"
                      keyboardType="numeric"
                      // placeholderTextColor="#000"
                      style={styles.formInput}
                      value={phoneNumber}
                      onChangeText={(e) => {
                        setIdCardNumber(e);
                      }}
                    />

                    <Image
                      source={{
                        uri:
                          idCardCheck?.uri ||
                          idCardNumber ||
                          "https://images.pexels.com/photos/736716/pexels-photo-736716.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
                      }}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                      }}
                    />
                  </View>

                  <Button
                    style={styles.uploadBtn}
                    onPress={() => {
                      // UploadData(setIdCardCheck);
                      navigate("DriverGovernmentId");
                    }}
                  >
                    {idCardNumber ? (
                      <Text style={styles.uploadBtnText}>{__("UPDATE")}</Text>
                    ) : (
                      <Text style={styles.uploadBtnText}>{__("UPLOAD")}</Text>
                    )}
                  </Button>
                  
                </View>
                <View style={[styles.profileBtnInfo, styles.profileBtnInfoTwo]}>
                  <View style={styles.formRow2}>
                    <Text style={styles.formText}>UPLOAD DRIVER LICENSE</Text>

                    <Image
                      source={{
                        uri:
                          licenseProofCheck?.uri ||
                          license ||
                          "https://images.pexels.com/photos/736716/pexels-photo-736716.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
                      }}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                      }}
                    />
                  </View>

                  <Button
                    style={styles.uploadBtn}
                    onPress={() => {
                      // UploadData(setLicenseProofCheck);
                      navigate("DriverDrivingLicense");
                    }}
                  >
                    {license ? (
                      <Text style={styles.uploadBtnText}>{__("UPDATE")}</Text>
                    ) : (
                      <Text style={styles.uploadBtnText}>{__("UPLOAD")}</Text>
                    )}
                  </Button>
                </View>
              </View>
              <Text style={styles.permissionLabel}>
                {__("Click on Link to change Permissions")}{" "}
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("DriverPermissions");
                  }}
                >
                  <Text style={{ color: COLOR.BLUE }}>{__("Permission")}</Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        </ScrollView>

        <Button
          style={[
            styles.saveBtn,
            { marginLeft: 20, marginRight: 20, marginTop: 5 },
          ]}
          onPress={submit}
        >
          <Text style={styles.saveBtnText}>{__("SAVE")}</Text>
        </Button>
      </SafeAreaView>
    );
  }

  // console.log("uRLVALUE", urlValue);
  function renderPermission() {
    return (
      <View style={styles.profileContainer}>
        <View style={styles.profileContent}>
          <View style={[styles.profileInputDetail, { paddingBottom: -100 }]}>
            {/* <Text style={styles.permissionHeader}>{__("PAYMENT PROCESS")}</Text> */}
            <View style={styles.switchInfo}>
              <Text style={styles.switchText}>
                {__("Connect your stripe account")}
              </Text>
              <ToggleSwitch
                setValue={setIsEnabled}
                value={isEnabled}
              ></ToggleSwitch>
            </View>
          </View>
          {/* <View style={styles.profileInputDetail}>
            <Text style={styles.permissionText}>{__("LOCATION")}</Text>
            <View style={styles.switchInfo}>
              <Text style={styles.switchText}>
                {__("Access your location")}
              </Text>
              <ToggleSwitch />
            </View>
          </View>
          <View style={styles.profileInputDetail}>
            <Text style={styles.permissionText}>{__("MESSAGE")}</Text>
            <View style={styles.switchInfo}>
              <Text style={styles.switchText}>{__("Access your message")}</Text>
              <ToggleSwitch />
            </View>
          </View>
          <View style={styles.profileInputDetail}>
            <Text style={styles.permissionText}>{__("MEDIA & STORAGE")}</Text>
            <View style={styles.switchInfo}>
              <Text style={styles.switchText}>
                {__("Access your Media & Storage")}
              </Text>
              <ToggleSwitch />
            </View>
          </View>

          <Button
            style={styles.saveBtn}
            onPress={() => {
              navigate("CustomerSelectVehicle");
            }}
          >
            <Text style={styles.saveBtnText}>{__("SAVE")}</Text>
          </Button> */}

          <View style={styles.profileInputDetail}>
            <Text style={[styles.permissionText]}>
              {__(
                "Here is the Payment method button you can click the connect account button and can enable the payment integration with the help of stripe.\n Once you click the button in  bottom a ref link is generated you can click the link that send control to stripe you have to full filled your information then your account us acctivated and then you can make payment and recivied the payment from user"
              )}
            </Text>
          </View>

          {urlValue && isEnabled && (
            <Hyperlink
              linkStyle={{
                marginHorizontal: 20,
                color: COLOR.BLUE,
                fontSize: 20,
              }}
              linkText={urlValue ? " Here" : url}
              linkDefault={true}
            >
              <Text style={styles.permissionLabel}>
                Click Here to Continue
                {urlValue}
              </Text>
            </Hyperlink>
          )}
        </View>
      </View>
    );
  }
  function renderInsurance() {
    return (
      <Container>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.tabInfo}>
            <Button
              style={
                PaymentTabSelected === "card"
                  ? styles.tabActive1
                  : styles.tabInactive
              }
              onPress={() => setPaymentTabSelected("card")}
            >
              <Image
                source={require("@asset/images/payment-card.png")}
                style={
                  PaymentTabSelected === "card"
                    ? styles.tabImgActive
                    : styles.tabImgInactive
                }
                resizeMode="contain"
              />
            </Button>
            <Button
              style={
                PaymentTabSelected === "paypal"
                  ? styles.tabActive1
                  : styles.tabInactive
              }
              onPress={() => setPaymentTabSelected("paypal")}
            >
              <Image
                source={require("@asset/images/download.png")}
                style={
                  PaymentTabSelected === "paypal"
                    ? styles.tabImgActive
                    : styles.tabImgInactive
                }
                resizeMode="contain"
              />
            </Button>
          </View>
          <View style={styles.paymentContainer}>
            {PaymentTabSelected === "card"
              ? renderCard()
              : PaymentTabSelected === "paypal"
                ? renderPayPal()
                : null}
          </View>
        </ScrollView>
        <Button style={styles.payBtn} onPress={onSubmit}>
          <Text style={styles.payBtnText}>{__("MAKE A PAYMENT")}</Text>
        </Button>
      </Container>
    );
  }

  const handleChange = (e, name) => {
    setInputs((prev) => {
      return { ...prev, [name]: e };
    });
  };

  const getPhotoFromGallery = () => {
    // setBottomModal(true);
    if (imageForShow.length >= 3) {
      showMessage("error", "You can't uploaded more than three images");
    } else {
      getPhotoFromCamera();
    }

    // setImages({ "fileCopyUri": null, "name": "e3a0266f-a831-4a63-a18f-52e1c2ffaf92.jpg", "height": 400,"width": 300,"size": 71776, "type": "image/jpeg", "uri": "file:///storage/emulated/0/Android/data/com.wditechy.truckie/files/Pictures/e3a0266f-a831-4a63-a18f-52e1c2ffaf92.jpg"})
    // UploadData()
  };


  return (
    <Container>
      <DarkStatusBar />
      <Header default leftType="back" title={"Profile"} />
      <View style={{ alignSelf: "center", alignItems: "center", marginVertical: 20 }}>
        <View style={styles.avatarImg}>
          <Image
            source={{
              uri:
                profile?.uri ||
                profileHttp ||
                profileImage,
            }}
            style={styles.profileImg}
          />
          <Button
                style={styles.iconDetail}
                onPress={() => {
                  UploadData(setProfile1);
                }}
              >
                <Icon
                  name="pencil"
                  type="EvilIcons"
                  style={[theme.SIZE_24, theme.GREYDARK]}
                />
              </Button>
        </View>
        <Text style={{
          color: "#102e4a",
          fontFamily: FAMILY.BOLD,
          fontSize: SIZE.SIZE_18,
        }}>{name}</Text>
      </View>
      <ScrollView>
        <View style={{ width: wp(90), alignSelf: "center" }}>
          <Text
            style={{
              color: "#102e4a",
              fontFamily: FAMILY.BOLD,
              fontSize: SIZE.SIZE_18,
              marginBottom: hp(2),
            }}
          >
            Personal information
          </Text>
        </View>
        <View
          style={{
            padding: 15,
            borderRadius: 15,
            backgroundColor: "#fff",
            width: wp(90),
            alignSelf: "center",
          }}
        >
          <View style>
            <TextInputComp
              placeholder="Enter your name"
              value={name}
              onChangeText={(text) => setName(text)}
              title="Name"
            />
          </View>
          <View>
            <Text
              style={{
                fontWeight: "400",
                fontSize: 14,
                color: "#102e4a",
              }}
            >
              Phone Number
            </Text>
            {console.log(phoneNumber, "i am phone input")}
            <PhoneInput
              ref={phoneInput}
              defaultValue={phoneNumber}
              value={phoneNumber}
              disabled
              defaultCode="PK"
              textInputStyle={{ padding: 2, color: "#000" }}
              containerStyle={{
                width: "100%",
                borderRadius: 10,
                marginBottom: 15,
                backgroundColor: '#E6E6E6',
                color: "#000"
              }}
              textContainerStyle={{ backgroundColor: '#E6E6E6', color: 'red' }}
              withShadow
              autoFocus
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              width: wp(84),
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: 14,
                  color: "#102e4a",
                }}
              >
                {" "}
                Gender
              </Text>
              <View
                style={{
                  width: wp(41),
                }}
              >
                <DropDownPicker
                  open={openModel}
                  items={items}
                  setOpen={setOpenModel}
                  value={itemsType}
                  onSelectItem={(e) => setItemsType(e.value)}
                  setItems={setItems}
                  style={{
                    paddingVertical: 19,
                    // marginTop: 10,
                    marginBottom: 5,
                    borderWidth: 0,
                    color: COLOR.PRIMARY,
                    fontSize: SIZE.SIZE_14,
                    fontFamily: FAMILY.REGULAR,
                    backgroundColor: "#E6E6E6",
                  }}
                />
              </View>
            </View>
            <View style={[styles.profileBtnInfo, styles.profileBtnInfoTwo]}>
              <View style={styles.formRow2}>
                <Text
                  style={{
                    fontWeight: "400",
                    fontSize: 14,
                    color: "#102e4a",
                  }}
                >
                  DOB
                </Text>
                <View style={{}}>
                  <DatePicker
                    mode="date"
                    modal
                    open={open}
                    date={date}
                    onConfirm={(date) => {
                      setOpen(false);
                      setDate(date);
                      setDisplayDate(date.toISOString());
                    }}
                    onCancel={() => {
                      setOpen(false);
                    }}

                  />
                </View>
                <View
                  style={{
                    height: hp(7),
                    borderRadius: 10,
                    justifyContent: "space-between",
                    // marginTop: hp(1),
                    backgroundColor: "#E6E6E6",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: wp(2),
                  }}
                >
                  <Text>
                    {displayDate ? displayDate.substr(0, 10) : "NO DATE"}
                  </Text>
                  <TouchableOpacity onPress={() => setOpen(true)}>
                    <Image
                      source={require("@asset/images/blackdrop.png")}
                      style={{ backgroundColor: "#E6E6E6" }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style>
            <TextInputComp
              placeholder="Enter id card number"
              value={idCardNumber}
              onChangeText={(e) => setIdCardNumber(e)}
              title="ID card"
            />
          </View>
          <View>
            <Text
              style={{
                fontWeight: "400",
                fontSize: 14,
                color: "#102e4a",
              }}
            >
              ID Pictures
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                height: hp(7),
                backgroundColor: "#E6E6E6",
                alignItems: "center",
                borderRadius: 10,
                paddingHorizontal: wp(5),
              }}
              onPress={() => navigate("DriverGovernmentId")}
            >

              <Text style={{ color: '#102e4a99' }}>upload id card picture</Text>
              <Image
                source={require("@asset/images/farword.png")}
                style={{}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        
        <View style={{ width: wp(90), alignSelf: "center" }}>
          <Text
            style={{
              color: "#102e4a",
              fontFamily: FAMILY.BOLD,
              fontSize: SIZE.SIZE_18,
              marginTop: hp(2),
              marginBottom: hp(2),
            }}
          >
            Vehicle information
          </Text>
        </View>
        <View
          style={{
            padding: 15,
            borderRadius: 15,
            backgroundColor: "#fff",
            width: wp(90),
            alignSelf: "center",
            // marginBottom:hp(5)
          }}
        >
          <View style>
            <TextInputComp
              placeholder="Enter license number"
              value={licenseNumber}
              onChangeText={(e) => setLicenseNumber(e)}
              title="License"
            />
          </View>
          <View>
            <Text
              style={{
                fontWeight: "400",
                fontSize: 14,
                color: "#102e4a",
              }}
            >
              License Pictures
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                height: hp(7),
                backgroundColor: "#E6E6E6",
                alignItems: "center",
                borderRadius: 10,
                paddingHorizontal: wp(5),
              }}
              onPress={() => navigate("DriverDrivingLicense")}
            >

              <Text style={{ color: '#102e4a99' }}>upload id card picture</Text>
              <Image
                source={require("@asset/images/farword.png")}
                style={{}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View style>
            <TextInputComp
              placeholder="Enter car name"
              value={carName}
              onChangeText={(e) => setCarName(e, "name")}
              title="Car Name"
            />
          </View>
          <View style>
            <TextInputComp
              placeholder="Enter car number"
              value={carNumber}
              onChangeText={(e) => setCarNumber(e)}
              title="Car Number"
            />
          </View>
          <View>
            <Text
              style={{
                fontWeight: "400",
                fontSize: 14,
                color: "#102e4a",
              }}
            >
              Car Pictures
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                height: hp(7),
                backgroundColor: "#E6E6E6",
                alignItems: "center",
                borderRadius: 10,
                paddingHorizontal: wp(5),
              }}
              onPress={() => {
                getPhotoFromGallery();
              }}
            >

              <Text style={{ color: '#102e4a99' }}>Upload car Pictures</Text>
              <Image
                source={require("@asset/images/upload.png")}
                style={{}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View
            style={{ flexDirection: "row", }}
          >
            {imageForShow.map((item, index) => (

              <View>
                <ImageBackground
                  key={item.id}
                  source={{
                    uri:
                      item?.uri ||
                      "https://cdn.pixabay.com/photo/2016/01/10/22/07/beauty-1132617__340.jpg",
                    i: "file:///storage/emulated/0/Android/data/com.wditechy.truckie/files/Pictures/fb3506d2-0efc-49f7-9dfc-dc6f5897d544.jpg",
                  }}
                  style={{ width: 100, height: 100, margin: 5 }}
                  imageStyle={{ borderRadius: 10 }}
                >
                  <TouchableOpacity style={styles.crossView} onPress={() => removeImage(item, index)}>
                    <Icon name={'x'} type='Feather' style={styles.icon} COLOR={"red"} />
                  </TouchableOpacity>
                </ImageBackground>
              </View>
            ))}
          </View>
        </View>
        <Button
          style={[styles.uploadbtn2, { marginBottom: hp(6), bottom: 0 }]}
          onPress={submit}
        >
          <Text style={styles.saveBtnText2}>{__("SAVE")}</Text>
        </Button>
      </ScrollView>
    </Container>
  );
}
