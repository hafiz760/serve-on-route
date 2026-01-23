/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Container, Content, Text, Icon } from '../../../component/Basic';
import { Button } from '../../../component/Form';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Accordion from './Accordion';
import { COLOR } from '../../../theme/typography';
import moment from 'moment';
import styles from './styles';
import theme from '../../../theme/styles';
import Header from '../../../component/Header';
import { DarkStatusBar } from '../../../component/StatusBar';
import { useSelector } from 'react-redux';
import ChatsModal from './ChatsModal';
import AppSpinner from '../../../component/AppSpinner';
import { BASE_URL, URL_V } from '../../../utilities/helper';
import { navigate } from '../../../navigations';

/**
 * Shared MyTrips component for both Customer and Driver
 * @param {Object} props
 * @param {string} props.userRole - 'customer' or 'driver'
 */
export default function MyTrips({ userRole = 'customer' }) {
  const [tabSelected, setTabSelected] = useState('all');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const { socket } = useSelector(state => state.socket);

  // Determine which field to filter by based on user role
  const isCustomer = userRole === 'customer';
  const filterField = isCustomer ? 'customer_id' : 'rider_id';
  const otherUserField = isCustomer ? 'rider_id' : 'customer_id';
  const otherUserLabel = isCustomer ? 'DRIVER NAME' : 'CUSTOMER NAME';

  const fetchData = async () => {
    try {
      const userData = await AsyncStorage.getItem('response');
      const userJsonData = JSON.parse(userData);

      const res = await axios.get(
        `${BASE_URL}${URL_V}parcel?page=1&limit=500&populate=customer_id%20rider_id&sort=desc&${filterField}=${userJsonData._id}`,
        {
          headers: {
            Authorization: `Bearer ${userJsonData.access_token}`,
          },
        }
      );

      setData(res.data.docs);
      setLoading(false);
    } catch (error) {
      if (__DEV__) {
        console.error('Error fetching trips:', error);
      }
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNavigation = val => {
    const fromCor = val.from_location_cor ? val.from_location_cor.replace(/['"']+/g, '').trim() : '';
    const toCor = val.to_location_cor ? val.to_location_cor.replace(/['"']+/g, '').trim() : '';

    if (!fromCor || !toCor || !fromCor.includes(',') || !toCor.includes(',')) {
      alert('Location data is not available');
      return;
    }

    const [from_location_latitude, from_location_longitude] = fromCor.split(',');
    const [to_location_latitude, to_location_longitude] = toCor.split(',');

    const from_location = {
      latitude: +from_location_latitude.trim(),
      longitude: +from_location_longitude.trim(),
    };

    const to_location = {
      latitude: +to_location_latitude.trim(),
      longitude: +to_location_longitude.trim(),
    };

    const customObject = {
      ...val,
      from_location,
      to_location,
    };

    navigate('CustomerDriverTracking', {
      data: customObject,
    });
  };

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

  const filterByStatus = (status) => {
    if (status === 'all') return data;
    if (status === 'open') return data.filter(d => d.status === 'in_progress');
    if (status === 'completed') return data.filter(d => d.status === 'completed');
    return data;
  };

  const renderTrips = (trips) => {
    const displayTrips = isCustomer ? [...trips].reverse() : trips;

    if (!displayTrips || displayTrips.length === 0) {
      return (
        <View style={styles.noTripsFoundContainer}>
          <Text style={styles.noTripsFoundText}>No Trips Found</Text>
        </View>
      );
    }

    return displayTrips.map((val, index) => {
      const cost = val?.pay_amount ? `${val?.pay_amount} USD` : `${val?.fare} USD`;
      const pickupLoc = truncate(cleanLocation(val?.from_location));
      const dropLoc = truncate(cleanLocation(val?.to_location));
      const shortId = (val?._id || '').substr(0, 8);
      const tripTime = val?.time ? moment(val.time).format('YYYY-MM-DD HH:mm') : '';

      const title = isCustomer
        ? `#${shortId} • ${val?.status?.toUpperCase()} • ${cost}
📍 ${pickupLoc}
🏁 ${dropLoc}
⏰ ${tripTime}`
        : `TRIPS ID : ${index + 1}`;

      return (
        <Accordion
          title={title}
          trip={val}
          key={val._id || index}
          renderContent={() => (
            <View style={styles.accordionContent}>
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>TRIP COST</Text>
                <Text style={styles.bookingText}>{cost}</Text>
              </View>

              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>TRIP TIME</Text>
                <Text style={styles.bookingDetail}>{tripTime}</Text>
              </View>

              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>PICK UP FROM</Text>
                <Text style={styles.bookingText}>
                  {truncate(cleanLocation(val?.from_location), 30)}
                </Text>
              </View>

              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>DROP AT</Text>
                <Text style={styles.bookingText}>
                  {truncate(cleanLocation(val?.to_location), 30)}
                </Text>
              </View>

              {val?.[otherUserField]?.first_name && (
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingTitle}>{otherUserLabel}</Text>
                  <Text style={styles.bookingText}>
                    {val[otherUserField]?.first_name}
                  </Text>
                </View>
              )}

              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>OTP</Text>
                <Text style={styles.bookingText}>{val?.receiving_otp}</Text>
              </View>

              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>STATUS</Text>
                <Button>
                  <Text style={styles.openBtnText}>{val?.status}</Text>
                </Button>
              </View>

              <View style={styles.btnInfo}>
                <Button
                  style={styles.detailBtn}
                  onPress={() => {
                    const screen = isCustomer
                      ? 'CustomerBookingComplete'
                      : 'DriverBookingComplete';
                    navigate(screen, { data: val });
                  }}>
                  <Icon
                    name="search"
                    type="Feather"
                    style={[theme.SIZE_14, theme.GREYDARK]}
                  />
                  <Text style={styles.detailBtnText}>DETAILS</Text>
                </Button>

                {val?.status !== 'completed' && (
                  <>
                    <Button
                      style={[styles.detailBtn, { backgroundColor: COLOR.BLUE }]}
                      onPress={() => {
                        setSelectedParcel(val);
                      }}>
                      <Icon
                        name="chat"
                        type="MaterialIcons"
                        style={[theme.SIZE_14, theme.LIGHT]}
                      />
                      <Text style={[styles.detailBtnText, { color: COLOR.LIGHT }]}>
                        CHAT
                      </Text>
                    </Button>

                    <Button
                      style={[styles.detailBtn, { backgroundColor: COLOR.GREEN }]}
                      onPress={() => handleNavigation(val)}>
                      <Text style={[styles.detailBtnText, { color: 'white' }]}>
                        {isCustomer ? 'Tracking' : 'Start Ride'}
                      </Text>
                    </Button>
                  </>
                )}
              </View>
            </View>
          )}
        />
      );
    });
  };

  if (loading) {
    return <AppSpinner />;
  }

  const filteredTrips = filterByStatus(tabSelected);

  return (
    <Container>
      <DarkStatusBar />
      <Header
        leftType="back"
        title="MY TRIPS"
        onPressLeft={() => navigate('PublicHome')}
      />
      <View style={styles.myTripHeader}>
        <Text style={styles.myTripHeaderText}>LIST OF TRIPS</Text>
        <View style={styles.myTripTabItems}>
          <Button
            style={tabSelected === 'all' ? styles.tabActive : styles.tabInactive}
            onPress={() => setTabSelected('all')}>
            <Text
              style={
                tabSelected === 'all'
                  ? styles.tabActiveText
                  : styles.tabInactiveText
              }>
              ALL
            </Text>
          </Button>
          <Button
            style={tabSelected === 'open' ? styles.tabActive : styles.tabInactive}
            onPress={() => setTabSelected('open')}>
            <Text
              style={
                tabSelected === 'open'
                  ? styles.tabActiveText
                  : styles.tabInactiveText
              }>
              OPEN
            </Text>
          </Button>
          <Button
            style={
              tabSelected === 'completed'
                ? styles.tabActive
                : styles.tabInactive
            }
            onPress={() => setTabSelected('completed')}>
            <Text
              style={
                tabSelected === 'completed'
                  ? styles.tabActiveText
                  : styles.tabInactiveText
              }>
              COMPLETED
            </Text>
          </Button>
        </View>
      </View>
      <Content contentContainerStyle={theme.layoutDf}>
        <View style={styles.myTripContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.accordionLayout}>
              {renderTrips(filteredTrips)}
            </View>
          </ScrollView>
        </View>
      </Content>

      {selectedParcel && (
        <ChatsModal
          parcel={selectedParcel}
          onClose={() => setSelectedParcel(null)}
          userRole={userRole}
        />
      )}
    </Container>
  );
}
