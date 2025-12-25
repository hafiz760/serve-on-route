import React, { useState, useRef, useEffect } from 'react';
import { View, Linking } from 'react-native';
import { Container, Content, Text } from '../../../component/Basic';
import { Button } from '../../../component/Form';
import styles from './styles';
import theme from '../../../theme/styles';
import Header from '../../../component/Header';
import { DarkStatusBar } from '../../../component/StatusBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  connectStripeAccount,
  linkStripeAccount,
} from '../../../services/apicalls/driver';
import ProfileTab from './Components/ProfileTab';
import PermissionTab from './Components/PermissionTab';
import { fetchDriverById } from '../../../services/apicalls/driver';
import { COLOR, FAMILY, SIZE } from '../../../theme/typography';
import { Image, TouchableOpacity } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { Icon } from '../../../component/Basic';

export default function ManageProfile() {
  const isFetchingStripe = useRef(false);
  const [urlValue, setUrlValue] = useState();
  const [tabSelected, setTabSelected] = useState('profile');
  const [isEnabled, setIsEnabled] = useState(false);

  // Profile States (Only what's needed for the Header)
  const [profile, setProfile] = useState();
  const [profileHttp, setProfileHttp] = useState('');
  const [accountLinked, setAccountLinked] = useState(false);

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
    if (isEnabled) {
      fetchData();
    }
  }, [isEnabled]);

  const fetchData = async () => {
    if (isFetchingStripe.current) return;
    isFetchingStripe.current = true;
    try {
      const data = await AsyncStorage.getItem('response');
      const parsedData = JSON.parse(data);

      const response = await connectStripeAccount(
        {
          type: 'express',
          country: 'US',
          business_type: 'individual',
        },
        parsedData.access_token,
      );
      await connectAccount(response.data.account, parsedData);
    } catch (error) {
      console.error('Error in fetchData:', error);
    } finally {
      isFetchingStripe.current = false;
    }
  };

  const connectAccount = async (account, parsedData) => {
    try {
      const sanitizedAccount =
        typeof account === 'string' ? account.trim() : account;
      const payload = {
        account: sanitizedAccount,
        refresh_url: 'https://serveonroute.com/reauth',
        return_url: 'https://serveonroute.com/return',
        type: 'account_onboarding',
      };
      console.log('payload', payload);
      const response = await linkStripeAccount(
        payload,
        parsedData?.access_token,
      );

      if (response.success) {
        console.log('URL>>>>>>:', response.data);
        setUrlValue(response.data.url);
        if (isEnabled) {
          Linking.openURL(response.data.url);
        }
      } else {
        console.error('Link Account Failed:', response.message);
      }
    } catch (error) {
      console.error('Error in connectAccount:', error.message);
    }
  };

  return (
    <>
      <Container>
        <DarkStatusBar />
        <Header
          default
          leftType="back"
          title={'Profile'}
          rightContent={
            <TouchableOpacity
              onPress={() => UploadData(setProfile)}
              style={styles.headerAvatarContainer}>
              <Image
                source={
                  profile?.uri
                    ? { uri: profile.uri }
                    : profileHttp
                      ? { uri: profileHttp }
                      : require('../../../assets/images/dummyProfile.jpg')
                }
                style={styles.headerAvatarImage}
              />
              <View style={styles.headerPencilContainer}>
                <Icon
                  name="pencil"
                  type="EvilIcons"
                  style={styles.headerPencilIcon}
                />
              </View>
            </TouchableOpacity>
          }
        />
        <Content>
          <View style={{ flex: 1 }}>
            <View style={styles.profileHeader}>
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
            {tabSelected === 'profile' && (
              <ProfileTab
                profile={profile}
                setProfile={setProfile}
                profileHttp={profileHttp}
                setProfileHttp={setProfileHttp}
                UploadData={UploadData}
                setAccountLinked={setAccountLinked}
              />
            )}
            {tabSelected === 'permission' && (
              <PermissionTab
                isEnabled={isEnabled}
                setIsEnabled={setIsEnabled}
                accountLinked={accountLinked}
              />
            )}
          </View>
        </Content>
      </Container>
    </>
  );
}
