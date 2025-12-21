import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {Container, Content, Icon} from '../../../component/Basic';
import {TextInput, Button, ToggleSwitch} from '../../../component/Form';
import styles from './styles';
import theme from '../../../theme/styles';
import axios from 'axios';
import Header from '../../../component/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker from 'react-native-document-picker';

import {DarkStatusBar} from '../../../component/StatusBar';
import {showMessage} from '../../../helper/showAlert';
import {useDispatch} from 'react-redux';
import {BASE_URL, URL_V} from '../../../utilities/helper';
import {navigate} from '../../../navigations';
import {
  getUserCurrentPosition,
  locationPermission,
} from '../../../helper/getCurrentLocation';
import AppSpinner from '../../../component/AppSpinner';
import {COLOR} from '../../../theme/typography';

export default function ManageProfile() {
  const dispatch = useDispatch();
  const [information, setInformation] = useState({});
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [values, setValues] = useState();
  const [valuesHttp, setValuesHttp] = useState();
  const [tabSelected, setTabSelected] = useState('profile');
  const [genderType, setGenderType] = useState('Male');
  const [openModel, setOpenModel] = useState(false);
  const [items, setItems] = useState([
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
  ]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getProfileData();
    console.log('Test');
  }, []);

  // const handleToggle = async () => {
  //   if (!isEnabled) {
  //     try {
  //       setLoading(true);

  //       const permission = await locationPermission();

  //       if (permission === 'granted') {
  //         const coords = await getUserCurrentPosition();
  //         setLocation(coords);
  //         setIsEnabled(true);
  //       }
  //     } catch (error) {
  //       console.log('LOCATION ERROR:', error);
  //       setIsEnabled(false);
  //     } finally {
  //       setLoading(false);
  //     }
  //   } else {
  //     setIsEnabled(false);
  //     setLocation(null);
  //   }
  // };

  const postData = async () => {
    if (!firstName?.trim()) {
      showMessage('error', 'First name is required');
      return;
    }
    if (!lastName?.trim()) {
      showMessage('error', 'Last name is required');
      return;
    }
    if (!genderType) {
      showMessage('error', 'Please select gender');
      return;
    }

    try {
      const data = await AsyncStorage.getItem('response');
      const datas = JSON.parse(data);

      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('avatar_file', values);
      formData.append('gender', genderType);
      formData.append('cover_image', values);

      const requestOptions = {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${datas.access_token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      };
      const res = await fetch(
        `${BASE_URL}${URL_V}users/update-user`,
        requestOptions,
      );
      const result = await res.json();
      getProfileData();
      showMessage('success', 'Profile updated successfully');
    } catch (err) {
      console.log('ERROR', err);
      showMessage('error', 'Error while updating profile');
    }
  };

  const getProfileData = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem('response');
      const datas = JSON.parse(data);

      const res = await axios.get(
        `${BASE_URL}${URL_V}users/user-by-id/${datas._id || datas.userId}`,
        {
          headers: {
            Authorization: `Bearer ${datas.access_token}`,
          },
        },
      );

      setInformation(res.data.data);
      setFirstName(res.data.data.first_name);
      setLastName(res.data.data.last_name);
      setGenderType(res.data.data.gender);
      setValuesHttp(res.data.data.avatar);
    } catch (err) {
      console.log('Error:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  // async function onDisplayNotification() {
  //   console.log("name", name);
  //   const channelId = await notifee.createChannel({
  //     id: "important",
  //     name: "Important Notifications",
  //     importance: AndroidImportance.HIGH,
  //   });

  //   notifee.displayNotification({
  //     title: "Suzuki Wagon R",
  //     body: "Muzafar \n 4.8(613)",
  //     data: {
  //       chatId: "123",
  //     },
  //     android: {
  //       largeIcon: require("../../../../assets/images/avatar.png"),
  //       importance: AndroidImportance.HIGH,
  //       channelId,
  //       actions: [
  //         {
  //           title: "Accept",
  //           icon: "https://my-cdn.com/icons/open-chat.png",
  //           pressAction: {
  //             id: "Accept",
  //             launchActivity: "default",
  //           },
  //         },
  //         {
  //           title: "Delete",
  //           icon: "https://my-cdn.com/icons/open-chat.png",
  //           pressAction: {
  //             id: "Delete",
  //             launchActivity: "default",
  //           },
  //         },
  //       ],
  //     },
  //   });

  const UploadData = async setPath => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setPath(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };

  function renderProfile() {
    return (
      <View style={styles.profileContainer}>
        {loading ? (
          <View style={styles.loaderContainerStyles}>
            <AppSpinner size="large" color={COLOR.PRIMARY} />
          </View>
        ) : (
          <View style={styles.profileContent}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{flex: 1}}>
              <ScrollView>
                <View style={styles.profileImgInfo}>
                  <View style={styles.profileBgImg}>
                    <Image
                      source={
                        values?.uri
                          ? {uri: values.uri}
                          : valuesHttp
                          ? {uri: valuesHttp}
                          : require('../../../assets/images/dummyProfile.jpg')
                      }
                      style={styles.profileImg}
                    />
                    <Button
                      style={styles.iconDetail}
                      onPress={() => {
                        UploadData(setValues);
                      }}>
                      <Icon
                        name="pencil"
                        type="EvilIcons"
                        style={[theme.SIZE_24, theme.GREYDARK]}
                      />
                    </Button>
                  </View>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formText}>FIRST NAME</Text>
                  <TextInput
                    placeholder="First Name"
                    placeholderTextColor="rgba(42,33,77,1)"
                    value={firstName}
                    onChangeText={e => {
                      setFirstName(e);
                    }}
                    style={styles.formInput}
                  />
                </View>

                <View style={styles.formRow}>
                  <Text style={styles.formText}>LAST NAME</Text>
                  <TextInput
                    placeholder="Last Name"
                    placeholderTextColor="rgba(42,33,77,1)"
                    value={lastName}
                    onChangeText={e => {
                      setLastName(e);
                    }}
                    style={styles.formInput}
                  />
                </View>

                <View style={styles.formRow}>
                  <Text style={styles.formText}>GENDER</Text>

                  <DropDownPicker
                    open={openModel}
                    items={items}
                    setOpen={setOpenModel}
                    value={genderType}
                    onSelectItem={e => setGenderType(e.value)}
                    setItems={setItems}
                    style={styles.dropDown}
                  />
                </View>

                <View style={styles.formRow}>
                  <Text style={styles.formText}>MOBILE NUMBER</Text>
                  <TextInput
                    placeholder="Enter The Phone Number"
                    value={information?.phone}
                    placeholderTextColor="rgba(42,33,77,1)"
                    keyboardType="numeric"
                    editable={false}
                    style={styles.formInput}
                  />
                </View>
                <Button style={styles.saveBtn} onPress={postData}>
                  <Text style={styles.saveBtnText}>SAVE</Text>
                </Button>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        )}
      </View>
    );
  }
  function renderPermission() {
    return (
      <View style={styles.profileContainer}>
        <View style={styles.profileContent}>
          <View style={styles.profileInputDetail}>
            <Text style={styles.permissionText}>LOCATION</Text>
            <View style={styles.switchInfo}>
              <Text style={styles.switchText}>Access your location</Text>
              <ToggleSwitch />
            </View>
          </View>
          <View style={styles.profileInputDetail}>
            <Text style={styles.permissionText}>MESSAGE</Text>
            <View style={styles.switchInfo}>
              <Text style={styles.switchText}>Access your message</Text>
              <ToggleSwitch />
            </View>
          </View>
          <View style={styles.profileInputDetail}>
            <Text style={styles.permissionText}>MEDIA & STORAGE</Text>
            <View style={styles.switchInfo}>
              <Text style={styles.switchText}>Access your Media & Storage</Text>
              <ToggleSwitch />
            </View>
          </View>
          <Button
            style={styles.saveBtn}
            onPress={() => {
              navigate('CustomerSelectVehicle');
            }}>
            <Text style={styles.saveBtnText}>SAVE</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <Container>
      <DarkStatusBar />
      <Header default leftType="back" title={'PROFILE'} />
      <Content contentContainerStyle={theme.layout}>
        <View>
          <View style={styles.profileHeader}>
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
          <ScrollView showsVerticalScrollIndicator={false}>
            {tabSelected === 'profile'
              ? renderProfile()
              : tabSelected === 'permission'
              ? renderPermission()
              : null}
          </ScrollView>
        </View>
      </Content>
    </Container>
  );
}
