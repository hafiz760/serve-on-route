import { View, Image, TouchableOpacity, ImageBackground, Alert } from "react-native";
import React, { useState } from "react";
import styles from "./styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ImagePicker from "react-native-image-crop-picker";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "react-native/Libraries/NewAppScreen";
import { DarkStatusBar } from "../../../component/StatusBar";
import { Button } from "../../../component/Form";
import { Container,Text, Icon } from "../../../component/Basic";
import { navigateReset } from "../../../navigations";
import { COLOR } from "../../../theme/typography";
const GovernmentId = () => {

  const route = useRoute();
  const { updateIDCardPicture } = route.params;

  const [images, setImages] = useState();
  const [imageForShow, setImageForShow] = useState([]);
  const [images2, setImages2] = useState();
  const [imageForShow2, setImageForShow2] = useState([]);
  console.log("imageForShow",JSON.stringify(imageForShow,null,2));
  
  const getPhotoFromGallery = () => {
    if (imageForShow.length >= 3) {
      showMessage("error", "You can't uploaded more than three images");
    } else {
      getPhotoFromCamera();
    }

 
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
      // console.log(format);
    });
  };
  const getPhotoFromGallery2 = () => {
    // setBottomModal(true);
    if (imageForShow.length >= 3) {
      showMessage("error", "You can't uploaded more than three images");
    } else {
      getPhotoFromCamera2();
    }

  };
  const getPhotoFromCamera2 = () => {
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
      setImageForShow2((pre) => {
        return [...pre, format];
      });
      setImages2(format);
      // console.log(format);
    });
  };


  const handleSubmit = ()=>{
    if(imageForShow.length==0){
      Alert.alert("Please select back Image Back")
    }else if(imageForShow2.length==0){
      Alert.alert("Please select back Image Front")
    }else{

      updateIDCardPicture(imageForShow[0]?.uri, imageForShow2[0]?.uri)
      AsyncStorage.setItem('front', imageForShow[0]);
      AsyncStorage.setItem('back', imageForShow2[0]);
      navigateReset("DriverManageProfile");
    }
  }


  return (
    <Container>
      <DarkStatusBar />
      <Header leftType="back" title={"Government ID"} />
      <View>
        <View
          style={{ width: wp(90), alignSelf: "center", flexDirection: "row" }}
        >
          <Icon
            name="checkcircle"
            type="AntDesign"
            style={{ paddingRight: 21 }}
          />
          <View>
            <Text style={[styles.fistText,{color:'black'}]}>
              Photocopies and printouts of documents will not be accepted.
            </Text>
          </View>
        </View>
        <View
          style={{ width: wp(90), alignSelf: "center", flexDirection: "row" }}
        >
          <Icon
            name="checkcircle"
            type="AntDesign"
            style={{ paddingRight: 21 }}
          />
          <View>
            <Text style={[styles.secondText,{color:'black'}]}>
              The photo and all details must be clearly visible.
            </Text>
          </View>
        </View>
       
        <View
          style={{
            width: wp(90),
            flexDirection: "row",
            justifyContent: "space-between",
            alignSelf: "center",
          }}
        >
          <View style={{ width: wp(40) }}>
            <View
              style={{
                width: wp(40),
                height: hp(15),
                marginBottom: 10,
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: "black",
                borderRadius: 10,
                marginTop: 20,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  getPhotoFromGallery2();
                }}
              >
                  { imageForShow2[0]?.uri?
                 <ImageBackground
                
                  source={{
                    uri:
                    imageForShow2[0]?.uri }}
                      
                    style={{  width: wp(40),
                      height: hp(15), margin: 5 }}
                      imageStyle={{borderRadius:10}}
                >
                   <TouchableOpacity style={styles.crossView} onPress={()=>setImageForShow2([])}>
                     <Icon name={'x'} type='Feather' style={styles.icon}/>
                  </TouchableOpacity>
                </ImageBackground>: <Icon 
                name="upload"
                type="AntDesign"
                style={{ marginEnd: 20 }}
              />}
               
              </TouchableOpacity>
              
            </View>
            <Text style={{ color: COLOR.DARKVIOLET }}>Front</Text>
          </View>
          
          <View style={{ width: wp(40) }}>
            <View
              style={{
                width: wp(40),
                height: hp(15),
                marginBottom: 10,
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: "black",
                borderRadius: 10,
                paddingHorizontal: 20,
                marginTop: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              
              <TouchableOpacity
                onPress={() => {
                  getPhotoFromGallery();
                }}
              >
                  { imageForShow[0]?.uri?
                 <ImageBackground
                
                  source={{
                    uri:
                    imageForShow[0]?.uri }}
                      
                  style={{  width: wp(40),
                    height: hp(15), margin: 5 }}
                    imageStyle={{borderRadius:10}}
                >
                   <TouchableOpacity style={styles.crossView} onPress={()=>setImageForShow([])}>
                     <Icon name={'x'} type='Feather' style={styles.icon} COLOR={"red" }/>
                  </TouchableOpacity>
                </ImageBackground>: <Icon 
                name="upload"
                type="AntDesign"
                style={{ marginEnd: 20 }}
              />}
               
              </TouchableOpacity>
            </View>
            <Text style={{ color: COLOR.DARKVIOLET }}>Back</Text>
          </View>
        </View>
        <Button
          style={styles.uploadbtn2}
          onPress={handleSubmit}
        >
          <Text style={styles.saveBtnText2}>SAVE</Text>
        </Button>
      </View>
    </Container>
  );
};
export default GovernmentId;
