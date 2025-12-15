import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {COLOR} from '../../../theme/typography';
import {Container, Content, Text, Icon} from '../../../component/Basic';
import {Button, ToggleSwitch} from '../../../component/Form';
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
import {navigateReset} from '../../../navigations';
import {
  updateDriverProfile,
  fetchDriverById,
} from '../../../services/apicalls/driver';
export default function ManageProfile({navigation, route}) {
  const param = route.params;
  console.log('param', param);
  const [urlValue, setUrlValue] = useState();
  console.log('urlValue', urlValue);
  const [tabSelected, setTabSelected] = useState('profile');
  const [isEnabled, setIsEnabled] = useState(false);
  console.log('isEnabled', isEnabled);
  const [profile, setProfile] = useState();
  const [profileHttp, setProfileHttp] = useState('');
  const [name, setName] = useState('');
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
  const [license, setLicense] = useState('');
  const [date, setDate] = useState(new Date());
  const [displayDate, setDisplayDate] = useState('');
  const [isDateExist, setIsDateExist] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openModel, setOpenModel] = useState(false);
  const [items, setItems] = useState([
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
  ]);
  const [itemsType, setItemsType] = useState('Male');
  const [frontIdImage, setFrontIdImage] = useState(null);
  const [backIdImage, setBackIdImage] = useState(null);
  const [frontLicenseImage, setFrontLicenseImage] = useState(null);
  console.log('frontLicenseImage', frontLicenseImage);
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
    })
      .then(async image => {
        const format = {
          name: image.path.split('/').pop(),
          height: image.height,
          width: image.width,
          size: 400,
          type: image.mime,
          uri: image.path,
        };
        setFrontIdImage(format);
      })
      .catch(e => console.log(e));
  };
  const getPhotoForBack = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(async image => {
        const format = {
          name: image.path.split('/').pop(),
          height: image.height,
          width: image.width,
          size: 400,
          type: image.mime,
          uri: image.path,
        };
        setBackIdImage(format);
      })
      .catch(e => console.log(e));
  };

  const removeFrontLicenseImage = () => setFrontLicenseImage(null);
  const removeBackLicenseImage = () => setBackLicenseImage(null);
  const getPhotoForFrontLicense = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(async image => {
        const format = {
          name: image.path.split('/').pop(),
          height: image.height,
          width: image.width,
          size: 400,
          type: image.mime,
          uri: image.path,
        };
        setFrontLicenseImage(format);
      })
      .catch(e => console.log(e));
  };
  const getPhotoForBackLicense = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(async image => {
        const format = {
          name: image.path.split('/').pop(),
          height: image.height,
          width: image.width,
          size: 400,
          type: image.mime,
          uri: image.path,
        };
        setBackLicenseImage(format);
      })
      .catch(e => console.log(e));
  };

  const UploadData = async setPath => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('res data', res[0]);
      setPath(res[0]);
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
  }, []);
  const removeImage = (idToRemove, index) => {
    const updatedImageData = imageForShow.filter(item => item !== idToRemove);
    console.log('0000', updatedImageData);
    setImageForShow(updatedImageData);
  };
  const removeImage1 = (idToRemove, index) => {
    const updatedImageData = imageForShowSelfi.filter(
      item => item !== idToRemove,
    );
    setImageForShowSelfi(updatedImageData);
  };

  const sanitizeValue = val => {
    if (!val || typeof val !== 'string') return '';
    const cleaned = val.trim().toLowerCase();
    const invalids = ['string', 'undefined', 'null', 'n/a', 'na', 'none'];
    return invalids.includes(cleaned) ? '' : val;
  };

  const getData = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem('response');
      const datas = JSON.parse(data);

      const res = await fetchDriverById(datas._id, datas.access_token);

      if (res.success) {
        const userData = res.data;

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

        if (
          userData?.driving_license_expiry &&
          sanitizeValue(userData.driving_license_expiry)
        ) {
          setIsDateExist(true);
        }

        setPhoneNumber(sanitizeValue(userData.phone));
        setProfileHttp(sanitizeValue(userData.avatar));
        setEmail(sanitizeValue(userData.email));
        setNationalCard(sanitizeValue(userData.ID));
      } else {
        console.log('Failed to fetch driver data:', res.message);
      }
    } catch (err) {
      console.log('Get data account error', err);
    } finally {
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
      console.log('account:', account);

      const response = await axios.post(
        `https://api.serveonroute.com/v1/users/link-account`,
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

      const res = await fetch(
        'https://api.serveonroute.com/v1/users/upload-image',
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${datas.access_token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      );

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
      const sanitize = v => (v && typeof v === 'string' ? v.trim() : v || '');

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
            `Please fill in ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          );
          setLoading(false);
          return;
        }
      }
      if (!frontIdImage || !backIdImage) {
        showMessage(
          'error',
          'Please upload both front and back ID card images',
        );
        setLoading(false);
        return;
      }

      if (!frontLicenseImage || !backLicenseImage) {
        showMessage(
          'error',
          'Please upload both front and back driving license images',
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

      const result = await updateDriverProfile(formData, datas.access_token);
      console.log('update result', result);

      if (result.success) {
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
    } finally {
      setLoading(false);
    }
  };

  function renderProfile() {
    return loading ? (
      <View style={styles.loaderContainerStyles}>
        <AppSpinner size="large" color={COLOR.PRIMARY} />
      </View>
    ) : (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
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
          <Text style={styles.nameText}>{name}</Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flexOne}>
          <ScrollView>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Personal informations</Text>
            </View>
            <View style={styles.whiteBox}>
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
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.label}>Gander</Text>
                  <View style={styles.halfWidth}>
                    <DropDownPicker
                      open={openModel}
                      items={items}
                      setOpen={setOpenModel}
                      value={itemsType}
                      onSelectItem={e => setItemsType(e.value)}
                      setItems={setItems}
                      style={styles.dropdown}
                    />
                  </View>
                </View>
                <View style={[styles.profileBtnInfo, styles.profileBtnInfoTwo]}>
                  <View style={styles.formRow2}>
                    <Text style={styles.label}>DOB</Text>
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
                    <View style={styles.dateBox}>
                      <Text>
                        {displayDate ? displayDate.substr(0, 10) : 'NO DATE'}
                      </Text>
                      <TouchableOpacity onPress={() => setOpen(true)}>
                        <Image
                          source={require('../../../assets/images/blackdrop.png')}
                          style={styles.borderE6}
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

              <View style={styles.marginVerticalHp2}>
                <Text style={styles.labelWithMargin}>ID Card Pictures</Text>

                <View style={styles.idCardPictureContainer}>
                  {/* Front */}
                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={getPhotoForFront}>
                    {frontIdImage ? (
                      <>
                        <Image
                          source={{uri: frontIdImage.uri || frontIdImage}}
                          style={styles.fullImage}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          onPress={removeFrontIdImage}
                          style={styles.closeIconContainer}>
                          <Icon
                            name="x"
                            type="Feather"
                            style={{fontSize: 16, color: 'red'}}
                          />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <Icon
                          name="camera"
                          type="Feather"
                          style={styles.cameraIcon}
                        />
                        <Text style={styles.cameraText}>Front</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={getPhotoForBack}>
                    {backIdImage ? (
                      <>
                        <Image
                          source={{uri: backIdImage.uri || backIdImage}}
                          style={styles.fullImage}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          onPress={removeBackIdImage}
                          style={styles.closeIconContainer}>
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
                        <Icon
                          name="camera"
                          type="Feather"
                          style={styles.cameraIcon}
                        />
                        <Text style={styles.cameraText}>Back</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                <Text style={styles.labelWithMarginTop}>Take a Selfie</Text>
                <TouchableOpacity
                  style={styles.uploadBar}
                  onPress={() => {
                    getPhotoFromGallery1();
                  }}>
                  <Text style={styles.uploadBarText}>
                    Upload for verification
                  </Text>
                  <Image
                    source={require('../../../assets/images/upload.png')}
                    style={{}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
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
                      style={styles.imageThumbnail}
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
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Vehicle information</Text>
            </View>
            <View style={styles.whiteBox}>
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
              <View style={styles.marginVerticalHp2}>
                <Text style={styles.labelWithMargin}>License Pictures</Text>

                <View style={styles.idCardPictureContainer}>
                  {/* Front license */}
                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={getPhotoForFrontLicense}>
                    {frontLicenseImage ? (
                      <>
                        <Image
                          source={{
                            uri: frontLicenseImage.uri || frontLicenseImage,
                          }}
                          style={styles.fullImage}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          onPress={removeFrontLicenseImage}
                          style={styles.closeIconContainer}>
                          <Icon
                            name="x"
                            type="Feather"
                            style={{fontSize: 16, color: 'red'}}
                          />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <Icon
                          name="camera"
                          type="Feather"
                          style={styles.cameraIcon}
                        />
                        <Text style={styles.cameraText}>Front</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  {/* Back license */}
                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={getPhotoForBackLicense}>
                    {backLicenseImage ? (
                      <>
                        <Image
                          source={{
                            uri: backLicenseImage.uri || backLicenseImage,
                          }}
                          style={styles.fullImage}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          onPress={removeBackLicenseImage}
                          style={styles.closeIconContainer}>
                          <Icon
                            name="x"
                            type="Feather"
                            style={{fontSize: 16, color: 'red'}}
                          />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <Icon
                          name="camera"
                          type="Feather"
                          style={styles.cameraIcon}
                        />
                        <Text style={styles.cameraText}>Back</Text>
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
                <Text style={styles.label}>Car Pictures</Text>
                <TouchableOpacity
                  style={styles.uploadBar}
                  onPress={() => {
                    getPhotoFromGallery();
                  }}>
                  <Text style={styles.uploadBarText}>Upload car Pictures</Text>
                  <Image
                    source={require('../../../assets/images/upload.png')}
                    style={{}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
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
                      style={styles.imageThumbnail}
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
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  function renderPermission() {
    return (
      <View style={styles.profileContainer}>
        <View style={styles.profileContent}>
          <View style={[styles.profileInputDetail, {paddingBottom: -100}]}>
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

  const getPhotoFromGallery = () => {
    if (imageForShow.length >= 3) {
      showMessage('error', "You can't uploaded more than three images");
    } else {
      getPhotoFromCamera();
    }
  };
  const getPhotoFromGallery1 = () => {
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
              </View>
            </View>
            {tabSelected === 'profile' && renderProfile()}
            {tabSelected === 'permission' && renderPermission()}
          </View>
        </Content>
      </Container>
    </>
  );
}
