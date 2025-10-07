import React, {useState, useRef} from 'react';
import {
  View,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Linking,
} from 'react-native';
import {COLOR, FAMILY, SIZE} from '../../../theme/typography';
import {Container, Content, Text, Icon} from '../../../component/Basic';
import {
  TextInput,
  Button,
  ToggleSwitch,
} from '../../../component/Form';
import DatePicker from 'react-native-date-picker';

import styles from './styles';
import theme from '../../../theme/styles';

import Header from '../../../component/Header';
import Support from '../../../component/Support';
import {DarkStatusBar} from '../../../component/StatusBar';
import {useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker from 'react-native-document-picker';
import {showMessage} from '../../../helper/showAlert';
import AppSpinner from '../../../component/AppSpinner';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import TextInputComp from '../../../component/TextInputComp';
import ImagePicker from 'react-native-image-crop-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import {useDispatch} from 'react-redux';
import {navigate, navigateReset} from '../../../navigations';
import {updateUser} from '../../../store/reducers/session';
const imagedata = [
  {id: 1, image: require('../../../assets/images/car1.png')},
  {id: 2, image: require('../../../assets/images/car2.png')},
  {id: 3, image: require('../../../assets/images/car3.png')},
];
export default function ManageProfile({navigation, route}) {
  const param = route.params;
  console.log('param', param);
  const [selected, setSelected] = useState('');
  const [value, setValue] = useState();
  const [urlValue, setUrlValue] = useState();
  console.log('urlValue', urlValue);
  const [tabSelected, setTabSelected] = useState('profile');
  const [isEnabled, setIsEnabled] = useState(false);
  console.log('isEnabled', isEnabled);
  const [idCardCheck, setIdCardCheck] = useState();
  const [profile, setProfile] = useState();
 
  const [profileHttp, setProfileHttp] = useState('');
  // console.log('whatprofile',profileHttp)
  console.log('profileHttp', profileHttp);
  const [name, setName] = useState('');
  // const [second, setSecond] = useState("");

  const [email, setEmail] = useState('');
  const [vehicalNumber, setVehicalNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [drivingLiscence, setDrivingLiscence] = useState('');
  const [carname, SetCarName] = useState();
  const [carnumber, SetCarNumber] = useState();
  const [nationalCard, setNationalCard] = useState();
  const [images, setImages] = useState();
  const [imageForShow, setImageForShow] = useState([]);
  const [imagesSelfi, setImagesSelfi] = useState();
  const [imageForShowSelfi, setImageForShowSelfi] = useState([]);
  // console.log("imageForShow",imageForShow);
  const [licenseProofCheck, setLicenseProofCheck] = useState();
  const [license, setLicense] = useState('');
  const [date, setDate] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [displayDate, setDisplayDate] = useState('');
  const [isDateExist, setIsDateExist] = useState(false);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState();
  const [open2, setOpen2] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inputs, setInputs] = useState(true);
  const phoneInput = useRef();
  const [openModel, setOpenModel] = useState(false);
  const [items, setItems] = useState([
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
  ]);
  const [itemsType, setItemsType] = useState('Male');
  const [itemsType2, setItemsType2] = useState('00/00/0000');
  // acct_1MwmIbPu2iasesq5
  const [PaymentTabSelected, setPaymentTabSelected] = useState('card');
  const [frontIdImage, setFrontIdImage] = useState(null);
const [backIdImage, setBackIdImage] = useState(null);
const [frontLicenseImage, setFrontLicenseImage] = useState(null);
console.log("frontLicenseImage",frontLicenseImage);
const [backLicenseImage, setBackLicenseImage] = useState(null);
  const dispatch = useDispatch();
  // const UploadData = async (setPath) => {
  //   try {
  //     const res = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.allFiles],
  //     });
  //     setPath(res[0]);
  //     console.log(res[0]);
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       // User cancelled the picker, exit any dialogs or menus and move on
  //     } else {
  //       throw err;
  //     }
  //   }
  // };
const removeFrontIdImage = () => setFrontIdImage(null);
const removeBackIdImage = () => setBackIdImage(null);
const getPhotoForFront = () => {
  ImagePicker.openCamera({
    width: 300,
    height: 400,
    cropping: true,
  }).then(async image => {
    const format = {
      name: image.path.split('/').pop(),
      height: image.height,
      width: image.width,
      size: 400,
      type: image.mime,
      uri: image.path,
    };
    setFrontIdImage(format);

    // const uploadedPath = await uploadSingleImage(format, 'national_ID_file');
    // console.log("uploadedPath",uploadedPath);
    // setUploadedFrontIdPath(uploadedPath); // <-- Save this for final submit
  }).catch(e => console.log(e));
};
const getPhotoForBack = () => {
  ImagePicker.openCamera({
    width: 300,
    height: 400,
    cropping: true,
  }).then(async image => {
    const format = {
      name: image.path.split('/').pop(),
      height: image.height,
      width: image.width,
      size: 400,
      type: image.mime,
      uri: image.path,
    };
    setBackIdImage(format);

    // const uploadedPath = await uploadSingleImage(format, 'national_ID_file');
    // setUploadedBackIdPath(uploadedPath);
  }).catch(e => console.log(e));
};

const removeFrontLicenseImage = () => setFrontLicenseImage(null);
const removeBackLicenseImage = () => setBackLicenseImage(null);
const getPhotoForFrontLicense = () => {
  ImagePicker.openCamera({
    width: 300,
    height: 400,
    cropping: true,
  }).then(async image => {
    const format = {
      name: image.path.split('/').pop(),
      height: image.height,
      width: image.width,
      size: 400,
      type: image.mime,
      uri: image.path,
    };
    setFrontLicenseImage(format);

    // const uploadedPath = await uploadSingleImage(format, 'driving_license_file');
    // setUploadedFrontLicensePath(uploadedPath);
  }).catch(e => console.log(e));
};
const getPhotoForBackLicense = () => {
  ImagePicker.openCamera({
    width: 300,
    height: 400,
    cropping: true,
  }).then(async image => {
    const format = {
      name: image.path.split('/').pop(),
      height: image.height,
      width: image.width,
      size: 400,
      type: image.mime,
      uri: image.path,
    };
    setBackLicenseImage(format);

    // const uploadedPath = await uploadSingleImage(format, 'driving_license_file');
    // console.log("uploadedPath",uploadedPath);
    // setUploadedBackLicensePath(uploadedPath);

  }).catch(e => console.log(e));
};

const UploadData = async setPath => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('res data', res[0]);
      setPath(res[0]);

      // console.log(res[0]);
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
  }, []);
  const removeImage = (idToRemove, index) => {
    const updatedImageData = imageForShow.filter(item => item !== idToRemove);
    // const updatedImageData = imageForShow.filter(index => console.log(">>>",index));
    console.log('0000', updatedImageData);
    setImageForShow(updatedImageData);
  };
  const removeImage1 = (idToRemove, index) => {
    const updatedImageData = imageForShowSelfi.filter(
      item => item !== idToRemove,
    );
    // const updatedImageData = imageForShow.filter(index => console.log(">>>",index));
    setImageForShowSelfi(updatedImageData);
  };

  const sanitizeValue = (val) => {
  if (!val || typeof val !== 'string') return '';
  const cleaned = val.trim().toLowerCase();
  const invalids = ['string', 'undefined', 'null', 'n/a', 'na', 'none'];
  return invalids.includes(cleaned) ? '' : val;
};

const getData = async () => {
  try {
    const data = await AsyncStorage.getItem('response');
    const datas = JSON.parse(data);

    const res = await axios.get(
      `https://api.serveonroute.com/v1/users/user-by-id/${datas._id}`,
      {
        headers: {
          Authorization: `Bearer ${datas.access_token}`,
        },
      }
    );

    const userData = res.data.data;
    console.log('res account no>>>>>>', JSON.stringify(userData, null, 2));
    dispatch(updateUser(userData));
    setName(sanitizeValue(userData.first_name));
    SetCarNumber(userData?.vehicle_no || '');
    setDrivingLiscence(userData.license_id || '');
    setProfile(sanitizeValue(userData.cover_image));
    setVehicalNumber(sanitizeValue(userData.vehicle_no));
    setFrontIdImage(userData?.driving_license?.[0] || null);
    setBackIdImage(userData?.driving_license?.[1] || null);
    setFrontLicenseImage(userData?.ID_file?.[0] || null);
    setBackLicenseImage(userData?.ID_file?.[1] || null);
    SetCarName(sanitizeValue(userData.car_name));
    setLicense(userData?.driving_license?.[0] || null);
    setDisplayDate(sanitizeValue(userData.driving_license_expiry));

    if (userData?.driving_license_expiry && sanitizeValue(userData.driving_license_expiry)) {
      setIsDateExist(true);
    }

    setPhoneNumber(sanitizeValue(userData.phone));
    setProfileHttp(sanitizeValue(userData.avatar));
    setEmail(sanitizeValue(userData.email));
    setNationalCard(sanitizeValue(userData.ID));

    setLoading(false);
  } catch (err) {
    console.log('Get data account error', err);
    setLoading(false);
  }
};

  const fetchData = async () => {
    try {
      const data = await AsyncStorage.getItem('response');
      const parsedData = JSON.parse(data);
      console.log('Parsed Data:', parsedData);

      const response = await axios.post(
        `https://api.serveonroute.com/v1/users/connect-account`,
        {
          type: 'express',
          country: 'US',
          business_type: 'individual',
        },
        {
          headers: {
            Authorization: `Bearer ${parsedData.access_token}`,
          },
        },
      );

      console.log('Account Number:', response.data.account);
      await connectAccount(response.data.account, parsedData);
    } catch (error) {
      console.error('Error in fetchData:', error);
    }
  };

  const connectAccount = async (account, parsedData) => {
    try {
      console.log('Access Token:', parsedData.access_token);
      console.log('account:', account);

      const response = await axios.post(
        `https://api.serveonroute.com/v1/users/link-account`, // Fixed URL
        {
          account: account,
          refresh_url: 'https://example.com/reauth',
          return_url: 'https://example.com/return',
          type: 'account_onboarding',
        },
        {
          headers: {
            Authorization: `Bearer ${parsedData?.access_token}`,
          },
        },
      );

      console.log('URL>>>>>>:', response);
      setUrlValue(response.data.url);
      if (isEnabled) {
        setTimeout(() => {
          Linking.openURL(response.data.url);
        }, 10);
      }
      // Ensure this is defined with useState
    } catch (error) {
      console.error('Error in connectAccount:', error.message);
    }
  };

  const getPhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      var format = {
        fileCopyUri: null,
        name: image.path.split('/')[image.path.split('/').length - 1],
        height: image?.height,
        width: image?.width,
        size: 400,
        type: image.mime,
        uri: image?.path,
      };
      setImageForShow(pre => {
        return [...pre, format];
      });
      setImages(format);
      console.log(format);
    });
  };
  const getPhotoFromCamera1 = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      var format = {
        fileCopyUri: null,
        name: image.path.split('/')[image.path.split('/').length - 1],
        height: image?.height,
        width: image?.width,
        size: 400,
        type: image.mime,
        uri: image?.path,
      };
      setImageForShowSelfi(pre => {
        return [...pre, format];
      });
      setImagesSelfi(format);
      console.log(format);
    });
  };

  const uploadSingleImage = async (image, field) => {
    try {
      const data = await AsyncStorage.getItem('response');
      const datas = JSON.parse(data);
  
      const formData = new FormData();
      formData.append(field, {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.name || 'upload.jpg',
      });
  
      const res = await fetch('https://api.serveonroute.com/v1/users/upload-image', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${datas.access_token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      const result = await res.json();
      if (res.ok) {
        console.log(`${field} uploaded`, result);
        return result.path; // server response path or file URL
      } else {
        console.error(`Error uploading ${field}:`, result.message);
        return null;
      }
    } catch (error) {
      console.error(`Upload failed for ${field}:`, error);
      return null;
    }
  };

  async function onSubmit() {
    await Support.showSuccess({
      title: 'Success!',
      message: 'Transaction success',
      onHide: () => {
        navigateReset('');
      },
      hideDelay: 2500,
    });
  }

  const submit = async () => {
    setLoading(true);
    console.log(
      name,
      email,
      drivingLiscence,
      phoneNumber,
      profile,
      nationalCard,
      frontIdImage,
      backIdImage,
      frontLicenseImage,
      backLicenseImage,
    );
    try {
       const sanitize = (v) =>
      v && typeof v === 'string'
        ? v.trim()
        : v || ''; // handle null/undefined

    const requiredFields = {
      name: sanitize(name),
      phoneNumber: sanitize(phoneNumber),
      gender: sanitize(itemsType),
      nationalCard: sanitize(nationalCard),
      carNumber: sanitize(carnumber),
      carName: sanitize(carname),
      drivingLiscence: sanitize(drivingLiscence),
      displayDate: sanitize(displayDate),
    };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        showMessage(
          'error',
          `Please fill in ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`
        );
        setLoading(false);
        return; // stop execution
      }
    }
    if (!frontIdImage || !backIdImage) {
      showMessage('error', 'Please upload both front and back ID card images');
      setLoading(false);
      return;
    }

    if (!frontLicenseImage || !backLicenseImage) {
      showMessage(
        'error',
        'Please upload both front and back driving license images'
      );
      setLoading(false);
      return;
    }
    if (!profile) {
      showMessage('error', 'Please upload your profile image');
      setLoading(false);
      return;
    }
      const data = await AsyncStorage.getItem('response');
      const datas = JSON.parse(data);
      const formData = new FormData();
      formData.append('first_name', name);
      // formData.append('last_name', lastName); // if you have
      formData.append('email', email);
      formData.append('phone', phoneNumber);
      formData.append('vehicle_no', carnumber);
      formData.append('car_name', carname);
      formData.append('gender', itemsType);
      formData.append('license_id', drivingLiscence);
      formData.append('driving_license_expiry', displayDate);
      formData.append('ID', nationalCard); 
        if (profile?.uri) {
        formData.append('avatar_file', {
          uri: profile.uri,
          type: profile.type || 'image/jpeg',
          name: profile.name || 'avatar.jpg',
        });
        formData.append('cover_image_file', {
          uri: profile.uri,
          type: profile.type || 'image/jpeg',
          name: profile.name || 'cover.jpg',
        });
      }
  
      // national_ID_file (array of front & back)
      if (frontIdImage) {
        formData.append('national_ID_file', {
          uri: frontIdImage.uri || frontIdImage,
          type: frontIdImage.type || 'image/jpeg',
          name: frontIdImage.name || 'front_id.jpg',
        });
      }
      if (backIdImage) {
        formData.append('national_ID_file', {
          uri: backIdImage.uri || backIdImage,
          type: backIdImage.type || 'image/jpeg',
          name: backIdImage.name || 'back_id.jpg',
        });
      }
  
      // driving_license_file (array of front & back)
      if (frontLicenseImage) {
        formData.append('driving_license_file', {
          uri: frontLicenseImage.uri || frontLicenseImage,
          type: frontLicenseImage.type || 'image/jpeg',
          name: frontLicenseImage.name || 'front_license.jpg',
        });
      }
      if (backLicenseImage) {
        formData.append('driving_license_file', {
          uri: backLicenseImage.uri || backLicenseImage,
          type: backLicenseImage.type || 'image/jpeg',
          name: backLicenseImage.name || 'back_license.jpg',
        });
      }
  
      // car_picture_file (if you have)
      // if (imageForShow?.length > 0) {
      //   imageForShow.forEach((img, index) => {
      //     formData.append('car_picture_file', {
      //       uri: img.uri,
      //       type: img.type || 'image/jpeg',
      //       name: img.name || `car_${index}.jpg`,
      //     });
      //   });
      // }
  
      console.log('FormData:', formData);
  
      const requestOptions = {
        // method: 'PUT',
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${datas.access_token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      };
  
      const res = await fetch(
        'https://api.serveonroute.com/v1/users/update-user',
        requestOptions,
      );
      // console.log('update res', res);
      // const result = await res.json();
      // console.log('update result', result);
      const resText = await res; // Get raw text response first
      console.log('update raw response', JSON.stringify(resText,null,2));
      
      let result;
      try {
        result = JSON.parse(resText); // Try parsing it safely
        console.log('update result', result);
      } catch (err) {
        console.log('❌ Failed to parse JSON:', err);
      }
      
      if (res.status === 200) {
        getData();
        showMessage('success', 'Profile Updated Successfully');
        AsyncStorage.setItem('userName', name);
        AsyncStorage.setItem('coverImage', JSON.stringify(profile));
      } else {
        showMessage('error', result?.message || 'Update failed');
      }
  
    } catch (err) {
      console.log('ERROR', err);
      showMessage('error', 'Something went wrong');
    }finally{
      setLoading(false);
    }
  };
  

  function renderCard() {
    return (
      <View>
        <View style={styles.paymentForm}>
          <View style={styles.formRow}>
            <Text style={styles.formText}>NAME ON CARD</Text>
            <TextInput
              placeholder="Carol cartex"
              placeholderTextColor="#000"
              style={styles.formInput}
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formText}>CARD NUMBER</Text>
            <TextInput
              placeholder="0000 3434 7867 9523"
              keyboardType="numeric"
              placeholderTextColor="#000"
              style={styles.formInput}
            />
          </View>
          <View style={styles.cardInfo}>
            <View style={styles.formRow2}>
              <Text style={styles.formText}>EXPIRY DATE</Text>
              <TextInput
                placeholder="19 / 2019"
                placeholderTextColor="#000"
                keyboardType="numeric"
                style={styles.formInput}
              />
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formText}>CVV</Text>
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
            source={require('../../../assets/images/downloadicon.png')}
          />
        </Button>
      </View>
    );
  }
  function onValueChange() {
    setSelected('');
  }

  function renderProfile() {
    return loading ? (
      <View style={styles.loaderContainerStyles}>
        <AppSpinner size="large" color={COLOR.PRIMARY} />
      </View>
    ) : (
      <SafeAreaView style={{width: '100%', height: '79%'}}>
        <View style={{alignSelf: 'center', alignItems: 'center'}}>
          <View style={styles.avatarImg}>
            <Image
              source={{
                uri:
                  profile?.uri ||
                  profileHttp ||
                  'https://images.pexels.com/photos/736716/pexels-photo-736716.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
              }}
              style={styles.profileImg}
            />
            <Button
              style={styles.iconDetail}
              onPress={() => {
                UploadData(setProfile);
              }}>
              <Icon
                name="pencil"
                type="EvilIcons"
                style={[theme.SIZE_24, theme.GREYDARK]}
              />
            </Button>
          </View>
          <Text
            style={{
              color: '#59499E',
              fontFamily: FAMILY.BOLD,
              fontSize: SIZE.SIZE_18,
            }}>
            {name}
          </Text>
        </View>
        <ScrollView>
          <View style={{width: wp(90), alignSelf: 'center'}}>
            <Text
              style={{
                color: '#59499E',
                fontFamily: FAMILY.BOLD,
                fontSize: SIZE.SIZE_18,
                marginTop: hp(2),
                marginBottom: hp(2),
              }}>
              Personal informations
            </Text>
          </View>
          <View
            style={{
              padding: 15,
              borderRadius: 15,
              backgroundColor: '#fff',
              width: wp(90),
              alignSelf: 'center',
            }}>
            <View style>
              <TextInputComp
                placeholder="Enter your name"
                value={name}
                onChangeText={text => setName(text)}
                title="Name"
              />
            </View>
            <View style>
              <TextInputComp
                editable={false}
                placeholder="Enter your name"
                value={phoneNumber}
                onChangeText={text => setPhoneNumber(text)}
                title="Phone Number"
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: wp(84),
                justifyContent: 'space-between',
              }}>
              <View>
                <Text
                  style={{
                    fontWeight: '400',
                    fontSize: 14,
                    color: '#59499E',
                  }}>
                  Gander
                </Text>
                <View
                  style={{
                    width: wp(41),
                  }}>
                  <DropDownPicker
                    open={openModel}
                    items={items}
                    setOpen={setOpenModel}
                    value={itemsType}
                    onSelectItem={e => setItemsType(e.value)}
                    setItems={setItems}
                    style={{
                      paddingVertical: 19,
                      // marginTop: 10,
                      marginBottom: 5,
                      borderWidth: 0,
                      color: COLOR.PRIMARY,
                      fontSize: SIZE.SIZE_14,
                      fontFamily: FAMILY.REGULAR,
                      backgroundColor: '#E6E6E6',
                    }}
                  />
                </View>
              </View>
              <View style={[styles.profileBtnInfo, styles.profileBtnInfoTwo]}>
                <View style={styles.formRow2}>
                  <Text
                    style={{
                      fontWeight: '400',
                      fontSize: 14,
                      color: '#59499E',
                    }}>
                    DOB
                  </Text>
                  <View style={{}}>
                    <DatePicker
                      mode="date"
                      modal
                      open={open}
                      date={date}
                      onConfirm={date => {
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
                      justifyContent: 'space-between',
                      // marginTop: hp(1),
                      backgroundColor: '#E6E6E6',
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: wp(2),
                    }}>
                    <Text>
                      {displayDate ? displayDate.substr(0, 10) : 'NO DATE'}
                    </Text>
                    <TouchableOpacity onPress={() => setOpen(true)}>
                      <Image
                        source={require('../../../assets/images/blackdrop.png')}
                        style={{backgroundColor: '#E6E6E6'}}
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
                value={nationalCard}
                onChangeText={e => setNationalCard(e)}
                title="ID card"
              />
            </View>
            {/* <View>
              <Text
                style={{
                  fontWeight: '400',
                  fontSize: 14,
                  color: '#59499E',
                }}>
                ID Pictures
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  height: hp(7),
                  backgroundColor: '#E6E6E6',
                  alignItems: 'center',
                  borderRadius: 10,
                  paddingHorizontal: wp(5),
                }}
                // onPress={() => navigate('DriverGovernmentId')}
                >
                <Text style={{color: '#59499E99'}}>upload id card picture</Text>
                <Image
                  source={require('../../../assets/images/farword.png')}
                  style={{}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View> */}
            <View style={{marginVertical: hp(2)}}>
  <Text style={{
    fontWeight: '400',
    fontSize: 14,
    color: '#59499E',
    marginBottom: 7,
  }}>
    ID Card Pictures
  </Text>

  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
    {/* Front */}
    <TouchableOpacity
  style={{
    borderWidth: 1,
    borderColor: '#A3A3A3',
    borderStyle: 'dashed',
    borderRadius: 10,
    width: wp(40),
    height: hp(12),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // so image corners stay rounded
  }}
  onPress={getPhotoForFront}>
  {frontIdImage ? (
    <>
      <Image
        source={{uri: frontIdImage.uri || frontIdImage}}
        style={{width: '100%', height: '100%'}}
        resizeMode="cover"
      />
      <TouchableOpacity
        onPress={removeFrontIdImage}
        style={{
          position: 'absolute',
          top: 5,
          right: 5,
          backgroundColor: '#fff',
          borderRadius: 12,
          width: 24,
          height: 24,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon name="x" type="Feather" style={{fontSize: 16, color: 'red'}} />
      </TouchableOpacity>
    </>
  ) : (
    <>
      <Icon name="camera" type="Feather" style={{fontSize: 20, color: '#59499E'}} />
      <Text style={{color: '#59499E99', marginTop: 5}}>Front</Text>
    </>
  )}
</TouchableOpacity>


    {/* Back */}
    <TouchableOpacity
  style={{
    borderWidth: 1,
    borderColor: '#A3A3A3',
    borderStyle: 'dashed',
    borderRadius: 10,
    width: wp(40),
    height: hp(12),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  }}
  onPress={getPhotoForBack}>
  {backIdImage ? (
    <>
      <Image
        source={{uri: backIdImage.uri || backIdImage}}
        style={{width: '100%', height: '100%'}}
        resizeMode="cover"
      />
      <TouchableOpacity
        onPress={removeBackIdImage}
        style={{
          position: 'absolute',
          top: 5,
          right: 5,
          backgroundColor: '#fff',
          borderRadius: 12,
          width: 24,
          height: 24,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon
                        name={'x'}
                        type="Feather"
                        style={styles.icon}
                        COLOR={'red'}
                      />
      </TouchableOpacity>
    </>
  ) : (
    <>
      <Icon name="camera" type="Feather" style={{fontSize: 20, color: '#59499E'}} />
      <Text style={{color: '#59499E99', marginTop: 5}}>Back</Text>
    </>
  )}
</TouchableOpacity>
  </View>
</View>


            <View>
              <Text
                style={{
                  fontWeight: '400',
                  fontSize: 14,
                  color: '#59499E',
                  marginTop: 7,
                }}>
                Take a Selfi
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  height: hp(7),
                  backgroundColor: '#E6E6E6',
                  alignItems: 'center',
                  borderRadius: 10,
                  paddingHorizontal: wp(5),
                }}
                onPress={() => {
                  getPhotoFromGallery1();
                }}>
                <Text style={{color: '#59499E99'}}>
                  Upload for verification
                </Text>
                <Image
                  source={require('../../../assets/images/upload.png')}
                  style={{}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row'}}>
              {imageForShowSelfi.map((item, index) => (
                <View>
                  <ImageBackground
                    key={item.id}
                    source={{
                      uri:
                        item?.uri ||
                        'https://cdn.pixabay.com/photo/2016/01/10/22/07/beauty-1132617__340.jpg',
                      i: 'file:///storage/emulated/0/Android/data/com.wditechy.truckie/files/Pictures/fb3506d2-0efc-49f7-9dfc-dc6f5897d544.jpg',
                    }}
                    style={{width: 100, height: 100, margin: 5}}
                    imageStyle={{borderRadius: 10}}>
                    <TouchableOpacity
                      style={styles.crossView}
                      onPress={() => removeImage1(item, index)}>
                      <Icon
                        name={'x'}
                        type="Feather"
                        style={styles.icon}
                        COLOR={'red'}
                      />
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
              ))}
            </View>
          </View>
          <View style={{width: wp(90), alignSelf: 'center'}}>
            <Text
              style={{
                color: '#59499E',
                fontFamily: FAMILY.BOLD,
                fontSize: SIZE.SIZE_18,
                marginTop: hp(2),
                marginBottom: hp(2),
              }}>
              Vehicle information
            </Text>
          </View>
          <View
            style={{
              padding: 15,
              borderRadius: 15,
              backgroundColor: '#fff',
              width: wp(90),
              alignSelf: 'center',
              // marginBottom:hp(5)
            }}>
            <View style>
              <TextInputComp
                placeholder="Enter license number"
                value={drivingLiscence}
                onChangeText={e => setDrivingLiscence(e)}
                title="License"
              />
            </View>
            {/* <View>
              <Text
                style={{
                  fontWeight: '400',
                  fontSize: 14,
                  color: '#59499E',
                }}>
                License Pictures
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  height: hp(7),
                  backgroundColor: '#E6E6E6',
                  alignItems: 'center',
                  borderRadius: 10,
                  paddingHorizontal: wp(5),
                }}
                onPress={() => navigate('DriverDrivingLicense')}>
                <Text style={{color: '#59499E99'}}>upload id card picture</Text>
                <Image
                  source={require('../../../assets/images/farword.png')}
                  style={{}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View> */}
            <View style={{marginVertical: hp(2)}}>
  <Text style={{
    fontWeight: '400',
    fontSize: 14,
    color: '#59499E',
    marginBottom: 7,
  }}>
    License Pictures
  </Text>

  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
    {/* Front license */}
    <TouchableOpacity
      style={{
        borderWidth: 1,
        borderColor: '#A3A3A3',
        borderStyle: 'dashed',
        borderRadius: 10,
        width: wp(40),
        height: hp(12),
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
      onPress={getPhotoForFrontLicense}>
      {frontLicenseImage ? (
        <>
          <Image
            source={{uri: frontLicenseImage.uri || frontLicenseImage}}
            style={{width: '100%', height: '100%'}}
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={removeFrontLicenseImage}
            style={{
              position: 'absolute',
              top: 5,
              right: 5,
              backgroundColor: '#fff',
              borderRadius: 12,
              width: 24,
              height: 24,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name="x" type="Feather" style={{fontSize: 16, color: 'red'}} />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Icon name="camera" type="Feather" style={{fontSize: 20, color: '#59499E'}} />
          <Text style={{color: '#59499E99', marginTop: 5}}>Front</Text>
        </>
      )}
    </TouchableOpacity>

    {/* Back license */}
    <TouchableOpacity
      style={{
        borderWidth: 1,
        borderColor: '#A3A3A3',
        borderStyle: 'dashed',
        borderRadius: 10,
        width: wp(40),
        height: hp(12),
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
      onPress={getPhotoForBackLicense}>
      {backLicenseImage ? (
        <>
          <Image
            source={{uri: backLicenseImage.uri || backLicenseImage}}
            style={{width: '100%', height: '100%'}}
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={removeBackLicenseImage}
            style={{
              position: 'absolute',
              top: 5,
              right: 5,
              backgroundColor: '#fff',
              borderRadius: 12,
              width: 24,
              height: 24,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name="x" type="Feather" style={{fontSize: 16, color: 'red'}} />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Icon name="camera" type="Feather" style={{fontSize: 20, color: '#59499E'}} />
          <Text style={{color: '#59499E99', marginTop: 5}}>Back</Text>
        </>
      )}
    </TouchableOpacity>
  </View>
</View>

            <View style>
              <TextInputComp
                placeholder="Enter car name"
                value={carname}
                onChangeText={e => SetCarName(e, 'name')}
                title="Car Name"
              />
            </View>
            <View style>
              <TextInputComp
                placeholder="Enter car number"
                value={carnumber}
                onChangeText={e => SetCarNumber(e)}
                title="Car Number"
              />
            </View>
            <View>
              <Text
                style={{
                  fontWeight: '400',
                  fontSize: 14,
                  color: '#59499E',
                }}>
                Car Pictures
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  height: hp(7),
                  backgroundColor: '#E6E6E6',
                  alignItems: 'center',
                  borderRadius: 10,
                  paddingHorizontal: wp(5),
                }}
                onPress={() => {
                  getPhotoFromGallery();
                }}>
                <Text style={{color: '#59499E99'}}>Upload car Pictures</Text>
                <Image
                  source={require('../../../assets/images/upload.png')}
                  style={{}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row'}}>
              {imageForShow.map((item, index) => (
                <View>
                  <ImageBackground
                    key={item.id}
                    source={{
                      uri:
                        item?.uri ||
                        'https://cdn.pixabay.com/photo/2016/01/10/22/07/beauty-1132617__340.jpg',
                      i: 'file:///storage/emulated/0/Android/data/com.wditechy.truckie/files/Pictures/fb3506d2-0efc-49f7-9dfc-dc6f5897d544.jpg',
                    }}
                    style={{width: 100, height: 100, margin: 5}}
                    imageStyle={{borderRadius: 10}}>
                    <TouchableOpacity
                      style={styles.crossView}
                      onPress={() => removeImage(item, index)}>
                      <Icon
                        name={'x'}
                        type="Feather"
                        style={styles.icon}
                        COLOR={'red'}
                      />
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
              ))}
            </View>
          </View>
          <Button
            style={[styles.uploadbtn2, {marginBottom: hp(6), bottom: 0}]}
            onPress={submit}>
            <Text style={styles.saveBtnText2}>SAVE</Text>
          </Button>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // console.log("uRLVALUE", urlValue);
  function renderPermission() {
    return (
      <View style={styles.profileContainer}>
        <View style={styles.profileContent}>
          <View style={[styles.profileInputDetail, {paddingBottom: -100}]}>
            {/* <Text style={styles.permissionHeader}>{__("PAYMENT PROCESS")}</Text> */}
            <View style={styles.switchInfo}>
              <Text style={styles.switchText}>Connect your stripe account</Text>
              <ToggleSwitch
                setValue={setIsEnabled}
                value={isEnabled}></ToggleSwitch>
            </View>
          </View>

          <View style={styles.profileInputDetail}>
            <Text style={[styles.permissionText]}>
              Here is the Payment method button you can click the connect
              account button and can enable the payment integration with the
              help of stripe.\n Once you click the button in bottom a ref link
              is generated you can click the link that send control to stripe
              you have to full filled your information then your account us
              acctivated and then you can make payment and recivied the payment
              from user
            </Text>
          </View>

          {/* {urlValue && isEnabled && (
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
          )} */}
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
                PaymentTabSelected === 'card'
                  ? styles.tabActive1
                  : styles.tabInactive
              }
              onPress={() => setPaymentTabSelected('card')}>
              <Image
                source={require('../../../assets/images/payment-card.png')}
                style={
                  PaymentTabSelected === 'card'
                    ? styles.tabImgActive
                    : styles.tabImgInactive
                }
                resizeMode="contain"
              />
            </Button>
            <Button
              style={
                PaymentTabSelected === 'paypal'
                  ? styles.tabActive1
                  : styles.tabInactive
              }
              onPress={() => setPaymentTabSelected('paypal')}>
              <Image
                source={require('../../../assets/images//download.png')}
                style={
                  PaymentTabSelected === 'paypal'
                    ? styles.tabImgActive
                    : styles.tabImgInactive
                }
                resizeMode="contain"
              />
            </Button>
          </View>
          <View style={styles.paymentContainer}>
            {PaymentTabSelected === 'card'
              ? renderCard()
              : PaymentTabSelected === 'paypal'
              ? renderPayPal()
              : null}
          </View>
        </ScrollView>
        <Button style={styles.payBtn} onPress={onSubmit}>
          <Text style={styles.payBtnText}>MAKE A PAYMENT</Text>
        </Button>
      </Container>
    );
  }

  const handleChange = (e, name) => {
    setInputs(prev => {
      return {...prev, [name]: e};
    });
  };
  const getPhotoFromGallery = () => {
    // setBottomModal(true);
    if (imageForShow.length >= 3) {
      showMessage('error', "You can't uploaded more than three images");
    } else {
      getPhotoFromCamera();
    }
  };
  const getPhotoFromGallery1 = () => {
    // setBottomModal(true);
    if (imageForShowSelfi.length >= 1) {
      showMessage('error', "You can't uploaded more than one images");
    } else {
      getPhotoFromCamera1();
    }
  };
  return (
    <>
      <Container>
        <DarkStatusBar />
        <Header default leftType="back" title={''} />
        <Content contentContainerStyle={theme.layoutDf}>
          <View>
            <View style={styles.profileHeader}>
              <Text style={styles.profileHeaderTitle}>PROFILE</Text>
              <Text style={styles.profileHeaderText}>MANAGE YOUR PROFILE</Text>
              <View style={styles.tabInfo}>
                <Button
                  style={
                    tabSelected === 'profile'
                      ? styles.tabActive
                      : styles.tabInactive
                  }
                  onPress={() => setTabSelected('profile')}>
                  <Text
                    style={
                      tabSelected === 'profile'
                        ? styles.tabTextActive
                        : styles.tabTextInactive
                    }>
                    PROFILE
                  </Text>
                </Button>
                <Button
                  style={
                    tabSelected === 'permission'
                      ? styles.tabActive
                      : styles.tabInactive
                  }
                  onPress={() => setTabSelected('permission')}>
                  <Text
                    style={
                      tabSelected === 'permission'
                        ? styles.tabTextActive
                        : styles.tabTextInactive
                    }>
                    PERMISSION
                  </Text>
                </Button>
                {/* <Button
                  style={
                    tabSelected === 'insurance'
                      ? styles.tabActive
                      : styles.tabInactive
                  }
                  onPress={() => setTabSelected('insurance')}>
                  <Text
                    style={
                      tabSelected === 'insurance'
                        ? styles.tabTextActive
                        : styles.tabTextInactive
                    }>
                    PAYMENT
                  </Text>
                </Button> */}
              </View>
            </View>
            {tabSelected === 'profile' && renderProfile()}
            {tabSelected === 'permission' && renderPermission()}
            {tabSelected === 'insurance' && renderInsurance()}
          </View>
        </Content>
      </Container>
      {/* <Container>
    <View style={{ alignSelf: "center", alignItems: "center" }}>
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
          <Button
                style={styles.iconDetail}
                onPress={() => {
                  UploadData(setProfile);
                }}
              >
                <Icon
                  name="pencil"
                  type="EvilIcons"
                  style={[theme.SIZE_24, theme.GREYDARK]}
                />
              </Button>
        </View>
        <Text
          style={{
            color: "#59499E",
            fontFamily: FAMILY.BOLD,
            fontSize: SIZE.SIZE_18,
          }}
        >
          {name}
        </Text>
      </View>
      <ScrollView>
        <View style={{ width: wp(90), alignSelf: "center" }}>
          <Text
            style={{
              color: "#59499E",
              fontFamily: FAMILY.BOLD,
              fontSize: SIZE.SIZE_18,
              marginTop: hp(2),
              marginBottom: hp(2),
            }}
          >
            Personal informations
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
            editable={false}
              placeholder="Enter your name"
              value={phoneNumber}
              onChangeText={(text)=>setPhoneNumber(text)}
              title="Phone Number"
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
                  color: "#59499E",
                }}
              >
               
                Gander
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
                    color: "#59499E",
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
              value={nationalCard}
              onChangeText={(e) => setNationalCard(e)}
              title="ID card"
            />
          </View>
          <View>
            <Text
              style={{
                fontWeight: "400",
                fontSize: 14,
                color: "#59499E",
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
              <Text style={{ color: "#59499E99" }}>upload id card picture</Text>
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
              color: "#59499E",
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
              value={drivingLiscence}
              onChangeText={(e) => setDrivingLiscence(e)}
              title="License"
            />
          </View>
          <View>
            <Text
              style={{
                fontWeight: "400",
                fontSize: 14,
                color: "#59499E",
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
              <Text style={{ color: "#59499E99" }}>upload id card picture</Text>
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
              value={carname}
              onChangeText={(e) => SetCarName(e, "name")}
              title="Car Name"
            />
          </View>
          <View style>
            <TextInputComp
              placeholder="Enter car number"
              value={carnumber}
              onChangeText={(e) => SetCarNumber(e)}
              title="Car Number"
            />
          </View>
          <View>
            <Text
              style={{
                fontWeight: "400",
                fontSize: 14,
                color: "#59499E",
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
              <Text style={{ color: "#59499E99" }}>Upload car Pictures</Text>
              <Image
                source={require("../../../assets/images/upload.png")}
                style={{}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
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
                  <TouchableOpacity
                    style={styles.crossView}
                    onPress={() => removeImage(item, index)}
                  >
                    <Icon
                      name={"x"}
                      type="Feather"
                      style={styles.icon}
                      COLOR={"red"}
                    />
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
    </Container> */}
    </>
  );
}
