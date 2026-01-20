import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {updateNotiId} from '../../../store/reducers/session';
import {Container, Content, Text, Icon} from '../../../component/Basic';
import {Button} from '../../../component/Form';
import styles from './styles';
import axios from 'axios';

import Accordion from '../../Driver/MyTrips/Accordion';
import {DarkStatusBar} from '../../../component/StatusBar';
import BiddingCard from './BiddingCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL, URL_V} from '../../../utilities/helper';
import Header from '../../../component/Header';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';

export default function Home({route}) {
  console.log('route', route);
  const {socket} = useSelector(state => state.socket);

  const closeModelBaseOnId = id => {
    setIncomingParcelNotifications(previous => {
      return previous.filter(value => {
        return value.id != id;
      });
    });
  };

  const handleBid = async (bidValue, selectedParcel) => {
    var data = await AsyncStorage.getItem('response');
    var datas = JSON.parse(data);
    const requestPayload = {
      bid_amount: bidValue,
      parcel: selectedParcel._id,
      bidder: datas._id,
      description: 'string',
    };
    console.log('requestPayload', requestPayload);
    try {
      socket.emit('bidding', requestPayload);
      Alert.alert('You successfully bid on this parcel');
    } catch (error) {
      Alert.alert('Something went wrong while bidding...!');
    }
  };

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const userData = await AsyncStorage.getItem('response');
      const userJsonData = JSON.parse(userData);

      const res = await axios.get(
        `${BASE_URL}${URL_V}parcel?page=1&limit=500&populate=customer_id%20rider_id&sort=desc&rider_id=${userJsonData._id}`,
        {
          headers: {
            Authorization: `Bearer ${userJsonData.access_token}`,
          },
        },
      );
      console.log(res, 'res');
      const incompleteData = res.data.docs
        .filter(item => item.status === 'in_progress')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setData(incompleteData);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('refreshHome', () => {
      console.log('Driver Home: refreshHome event received');
      fetchData();
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
  }, []);

  function cleanLocation(loc) {
    if (!loc) return '';
    try {
      const parsed = JSON.parse(loc);
      return String(parsed);
    } catch {
      return String(loc);
    }
  }

  function truncate(str, len = 22) {
    if (!str) return '';
    return str.length > len ? `${str.substr(0, len)}...` : str;
  }

  const renderOpen = ({item: val, index}) => {
    if (val.status == 'in_progress') {
      const cost = val?.pay_amount
        ? `${val?.pay_amount} USD`
        : `${val?.fare} USD`;
      console.log(val, 'val');
      const pickupLoc = truncate(cleanLocation(val?.from_location));
      const dropLoc = truncate(cleanLocation(val?.to_location));
      const shortId = val?._id || '';
      const tripTime = val?.time
        ? moment(val.time).format('YYYY-MM-DD HH:mm')
        : '';

      const title = (
        <View style={styles.accordionTitle}>
          <View style={styles.accordionTitleRow}>
            <Text style={styles.accordionTitleText}>{`#${shortId}`}</Text>
            <Text style={styles.accordionTitleText}>{`${cost}`}</Text>
          </View>
          <Text style={styles.accordionTitleText}>{`📍 ${pickupLoc}`}</Text>
          <Text style={styles.accordionTitleText}>{`🏁 ${dropLoc}`}</Text>
          <Text style={styles.accordionTitleText}>{`⏰ ${tripTime}`}</Text>
        </View>
      );

      return (
        <Accordion
          title={title}
          trip={val}
          key={index}
          renderContent={() => (
            <View style={styles.accordionContent}>
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>TRIP COST</Text>
                <Text style={styles.bookingText}>
                  {val?.pay_amount
                    ? `${val?.pay_amount} USD`
                    : `${val?.fare} USD`}
                </Text>
              </View>
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>TRIP</Text>
                <Text style={styles.bookingDetail}>
                  {val?.time
                    ? moment(val.time).format(' YYYY-MM-DD HH:mm')
                    : ''}
                </Text>
              </View>
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>PICK UP FROM</Text>
                <Text style={styles.bookingText}>
                  {`${val?.from_location}`}
                </Text>
              </View>
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>DROP AT</Text>
                <Text style={styles.bookingText}>{`${val?.to_location}`}</Text>
              </View>
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>CUSTOMER NAME</Text>
                <Text style={styles.bookingText}>
                  {`${val?.customer_id?.first_name}`}
                </Text>
              </View>
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>VEHICLE NUMBER</Text>
                <Text style={styles.bookingText}>NY 47568</Text>
              </View>
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>CALL CUSTOMER</Text>
                <Text style={styles.bookingText}>
                  {`${val?.customer_id?.phone}`}
                </Text>
              </View>
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>STATUS</Text>
                <Button>
                  <Text style={styles.openBtnText}>{`${val?.status}`}</Text>
                </Button>
              </View>
            </View>
          )}
        />
      );
    }
    return null;
  };

  return (
    <Container>
      <DarkStatusBar />

      <Header leftType="menu" title={'Dashboard'} />

      <Content>
        <ScrollView>
          <View
            style={[
              styles.homeContainer,
              {
                alignItems: 'center',
                justifyContent: 'space-around',
                flexDirection: 'row',
              },
            ]}
          />
          <View style={{width: '90%', alignSelf: 'center', paddingTop: 15}}>
            <FlatList
              data={data}
              showsHorizontalScrollIndicator={false}
              renderItem={renderOpen}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </ScrollView>
      </Content>

      <View style={styles.footerBtn} />
    </Container>
  );
}
