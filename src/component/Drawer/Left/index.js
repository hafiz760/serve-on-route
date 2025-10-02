import React, {useEffect, useState} from 'react';
import {Image, TouchableOpacity, ScrollView, Text, View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from './styles';
import * as MENU from './Menu';
import {closeDrawer, navigate, navigateReset} from '../../../navigations';
import theme from '../../../theme/styles';
import {removeSocketConnection} from '../../../store/reducers/socketReducer';
import {logout} from '../../../store/reducers/session';

const BASE_URL = 'https://api.serveonroute.com'; // Replace with your actual BASE_URL
const URL_V = '/v1/';

function MenuLeft() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  console.log('user>>>', JSON.stringify(user, null, 2));
  const {socket} = useSelector(state => state.socket);
  const session = useSelector(state => state.session);
  const [tokenAccess, setToken] = useState('');
  console.log('tokenAccess', tokenAccess);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    const getToken = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const storedFirstName = await AsyncStorage.getItem('userName');
      const storedLastName = await AsyncStorage.getItem('lastName');

      setToken(accessToken);
      setFirstName(storedFirstName || '');
      setLastName(storedLastName || '');
    };

    getToken();
  }, []);

  const handleLogout = () => {
    // const accessToken = await AsyncStorage.getItem("accessToken");
    // var data = await AsyncStorage.getItem("response");
    // var datas = JSON.parse(data);
    // try {
    //   await axios.delete(`${BASE_URL}${URL_V}auth/logout`, {
    //     headers: {
    //       Authorization: `Bearer ${datas.access_token}`,
    //     },
    //   });
    dispatch(logout());
    AsyncStorage.clear();
    navigateReset('PublicLogin');
    // socket?.disconnect();
    // dispatch(removeSocketConnection());
    // } catch (error) {
    //   console.error("Logout error:", error.response?.data || error.message);
    // }
  };

  const renderMenuList = menus => {
    return menus.map(menu => (
      <TouchableOpacity
        key={menu.name}
        style={styles.item}
        underlayColor="transparent"
        onPress={async () => {
          closeDrawer();
          if (menu.route === 'PublicIntro') {
            await handleLogout();
          } else if (menu.route === 'UserLogout') {
            await handleLogout();
          } else {
            navigate(menu.route, menu.params || {});
          }
        }}>
        <View style={styles.col}>
          <Image
            source={menu?.image}
            style={{height: 20, width: 30}}
            resizeMode="contain"
          />
        </View>
        <View style={theme.row}>
          <Text style={styles.itemText}>{menu.name}</Text>
        </View>
      </TouchableOpacity>
    ));
  };

  const img =
    'https://mettlesoletest.s3.us-west-2.amazonaws.com/1706219450911-download%20%281%29.jpg';

  return (
    <View style={styles.drawer}>
      <View style={styles.headerBg}>
        <View style={styles.header}>
          <Image
         
         source={
          user.avatar && !user.avatar.includes('\t')
            ? { uri: user.avatar }
            : require("../../../assets/images/dummyProfile.jpg")
        }
            resizeMode="cover"
            style={styles.headerImg}
          />
          <View>
            <View style={theme.row}>
              <Text style={styles.headerName}>
                {user?.first_name}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.navMenu}>
          <ScrollView>
            {session.bool
              ? session.isVerified
                ? renderMenuList(MENU.Data3)
                : renderMenuList(MENU.Data4)
              : renderMenuList(MENU.Data2)}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

export default MenuLeft;
