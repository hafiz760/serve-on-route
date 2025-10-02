import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import DatePicker from "react-native-date-picker";
import styles from "./styles";
import { useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DocumentPicker from "react-native-document-picker";
import { showMessage } from "../../../helper/showAlert";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import TextInputComp from "../../../component/TextInputComp";
import ImagePicker from "react-native-image-crop-picker";
import DropDownPicker from "react-native-dropdown-picker";
import { BASE_URL, URL_V } from "../../../utilities/helper";
import { DarkStatusBar } from "../../../component/StatusBar";
import { COLOR, FAMILY, SIZE } from "../../../theme/typography";
import Header from "../../../component/Header";
import { navigate } from "../../../navigations";
import { Container,Text, Icon } from "../../../component/Basic";
import { Button } from "../../../component/Form";

export default function ManageProfile({ navigation, route }) {
  const param = route.params
  console.log("param", param)
  const [urlValue, setUrlValue] = useState();
  const [isEnabled, setIsEnabled] = useState(false);
  const [idCardCheck, setIdCardCheck] = useState();
  const [profile, setProfile] = useState();

  const [profileHttp, setProfileHttp] = useState("");
  const [imageForShow, setImageForShow] = useState([]);
  // console.log("imageForShow",imageForShow);
  const [licenseProofCheck, setLicenseProofCheck] = useState();
  const [date, setDate] = useState(new Date());
  const [displayDate, setDisplayDate] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const phoneInput = useRef();
  const [openModel, setOpenModel] = useState(false);
  const [items, setItems] = useState([
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ]);
  const [profile1, setProfile1] = useState();
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [phoneNumber, setPhoneNumber] = useState()
  const [gender, setGender] = useState();
  const [dob, setDob] = useState()
  const [idCardNumber, setIdCardNumber] = useState()
  const [idCardPicture, setIdCardPicture] = useState()
  const [idCardPicture1, setIdCardPicture1] = useState()
  const [licenseNumber, setLicenseNumber] = useState()
  const [licensePicture, setLicensePicture] = useState([])
  const [carName, setCarName] = useState()
  const [carNumber, setCarNumber] = useState()
  const [carPicture, setCarPicture] = useState()

  const updateIDCardPicture = (back, front) => {
    const newIdCardPictures = [front,back];
    setIdCardPicture(front);
    setIdCardPicture1(back)
    console.log("Updated ID card pictures:", newIdCardPictures);
  };

  const UploadData = async (setPath) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setPath(res[0]);
      console.log(res[0], "imageeeeee");
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
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
        setProfile1(data.data.data.cover_image)
        setName(data.data.data.name);
        setEmail(data.data.data.email);
        setPhoneNumber(data.data.data.phone);
        setGender(data.data.data.gender);
        setDob(data.data.data.phone);
        setIdCardNumber(data.data.data.ID);
        // setIdCardPicture(data.data.data.ID_file);
        setLicenseNumber(data.data.data.license_id);
        setLicensePicture(data.data.data.driving_license);
        setCarName(data.data.data.car_name);
        setCarNumber(data.data.data.vehicle_no);
        setCarPicture(data.data.data.car_picture);
      })
      .catch((err) => {
        console.log("Get data account error");
        console.log("error", err);
        setLoading(false);
      });
  };

  const fetchData = async () => {

    const front = await AsyncStorage.getItem("front");
    const back = await AsyncStorage.getItem("back");

    console.log("ID Carddddddddd", front, back);

    setIdCardPicture(front);
    setIdCardPicture1(back);

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
  const submit = async () => {

    console.log(
      name,
      licenseNumber,
      phoneNumber,
      "this is picture",
      profile1,
      "this is id card picturess",
      idCardPicture,
      idCardPicture1,
      idCardNumber
    );

    var data = await AsyncStorage.getItem("response");
    var datas = JSON.parse(data);
    const formData = new FormData();

    formData.append("cover_image_file", profile1);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("gender", gender);
    formData.append("age", dob);
    formData.append("ID", idCardNumber);
    formData.append("license_id", licenseNumber);
    formData.append("driving_license_file", licenseProofCheck);
    formData.append("car_name", carName);
    formData.append("vehicle_no", carNumber);
    formData.append("car_picture", imageForShow);
    formData.append("national_ID_file", [idCardPicture,idCardPicture1]);



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
  const getPhotoFromGallery = () => {
    // setBottomModal(true);
    if (imageForShow.length >= 3) {
      showMessage("error", "You can't uploaded more than three images");
    } else {
      getPhotoFromCamera();
    }
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
                profile1,
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
              // style={[theme.SIZE_24, theme.GREYDARK]}
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
          <View style>
            <TextInputComp
              placeholder="Enter your name"
              value={email}
              onChangeText={(text) => setEmail(text)}
              title="Email"
            />
          </View>
          {/* <View>
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
            <View style={{ width: '100%', borderRadius: 10, marginBottom: 15, backgroundColor: '#E6E6E6', paddingHorizontal: 10 }}>
              <PhoneInput
                ref={phoneInput}
                defaultValue={phoneNumber}
                value={phoneNumber}
                disabled
                defaultCode="PK"
                textInputStyle={{ padding: 2, color: 'black' }}
                containerStyle={{ width: '100%', borderRadius: 10, backgroundColor: 'transparent' }}
                textContainerStyle={{ backgroundColor: 'transparent' }}

              />
            </View>

          </View> */}
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
                  value={gender}
                  onSelectItem={(e) => setGender(e.value)}
                  // setItems={setItems}
                  style={{
                    paddingVertical: 17,
                    borderRadius: 10,
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
                      setDob(date);
                      setDisplayDate(date.toISOString());
                    }}
                    onCancel={() => {
                      setOpen(false);
                    }}
                  />
                </View>
                <View
                  style={{
                    height: hp(7.2),
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
                      source={require("../../../assets/images/blackdrop.png")}
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
              onPress={() => navigate("DriverGovernmentId", {updateIDCardPicture})}
            >

              <Text style={{ color: '#102e4a99' }}>upload id card picture</Text>
              <Image
                source={require("../../../assets/images/farword.png")}
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
                source={require("../../../assets/images/farword.png")}
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
              onChangeText={(value) => setCarNumber(value)}
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
                source={require("../../../assets/images/upload.png")}
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
          <Text style={styles.saveBtnText2}>SAVE</Text>
        </Button>
      </ScrollView>
    </Container>
  );
}
