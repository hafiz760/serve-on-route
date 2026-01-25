/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Container, Content, Text, Icon } from '../../../component/Basic';
import { Button } from '../../../component/Form';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Accordion from './Accordion';
import { COLOR, SIZE, FAMILY } from '../../../theme/typography';
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
  const [refreshing, setRefreshing] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const { socket } = useSelector(state => state.socket);

  // Determine which field to filter by based on user role
  const isCustomer = userRole === 'customer';
  const filterField = isCustomer ? 'customer_id' : 'rider_id';
  const otherUserField = isCustomer ? 'rider_id' : 'customer_id';
  const otherUserLabel = isCustomer ? 'DRIVER NAME' : 'CUSTOMER NAME';

  const fetchData = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);

      const userData = await AsyncStorage.getItem('response');
      const userJsonData = JSON.parse(userData);

      const res = await axios.get(
        `${BASE_URL}${URL_V}parcel?page=1&limit=100&populate=customer_id%20rider_id&sort=-createdAt&${filterField}=${userJsonData._id}`,
        {
          headers: {
            Authorization: `Bearer ${userJsonData.access_token}`,
          },
        }
      );

      setData(res.data.docs);
    } catch (error) {
      if (__DEV__) {
        console.error('Error fetching trips:', error);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(true);
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
    const displayTrips = trips;

    if (!displayTrips || displayTrips.length === 0) {
      return (
        <View style={styles.noTripsFoundContainer}>
          <Icon
            name="inbox"
            type="Feather"
            style={{ fontSize: 48, color: COLOR.GREYVIOLET, marginBottom: 10 }}
          />
          <Text style={styles.noTripsFoundText}>No Trips Found</Text>
        </View>
      );
    }

    return displayTrips.map((val, index) => {
      const cost = val?.pay_amount ? `${val?.pay_amount} USD` : `${val?.fare} USD`;
      const pickupLoc = truncate(cleanLocation(val?.from_location), 25);
      const dropLoc = truncate(cleanLocation(val?.to_location), 25);
      const shortId = (val?._id || '').substr(0, 6);
      const tripTime = val?.time ? moment(val.time).format('YYYY-MM-DD HH:mm') : '';
      const statusText = val?.status?.replace('_', ' ').toUpperCase() || 'PENDING';

      // Get status color
      const getStatusColor = () => {
        if (val?.status === 'completed') return COLOR.GREEN;
        if (val?.status === 'in_progress') return COLOR.BLUE;
        return COLOR.ORANGE || '#FF9800';
      };

      const title = isCustomer
        ? `#${shortId} • ${statusText} • ${cost}`
        : `TRIPS ID : ${index + 1}`;

      return (
        <View key={val._id || index} style={{ marginBottom: 8 }}>
          <Accordion
            title={title}
            trip={val}
            renderContent={() => (
              <>
            <View style={styles.accordionContent}>
              {/* Details Card */}
              <View style={{ paddingHorizontal: 15, paddingTop: 12 }}>
                {/* Location and Time Section - Always Show */}
                <View style={{ marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <View style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: COLOR.GREEN,
                      marginRight: 8
                    }} />
                    <Text style={{
                      fontFamily: FAMILY.REGULAR,
                      fontSize: SIZE.SIZE_11,
                      color: COLOR.GREYVIOLET,
                      flex: 1
                    }}>
                      {pickupLoc}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <View style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: COLOR.PRIMARY,
                      marginRight: 8
                    }} />
                    <Text style={{
                      fontFamily: FAMILY.REGULAR,
                      fontSize: SIZE.SIZE_11,
                      color: COLOR.GREYVIOLET,
                      flex: 1
                    }}>
                      {dropLoc}
                    </Text>
                  </View>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingTop: 8,
                    paddingBottom: 8,
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderTopColor: COLOR.SMOKELIGHT,
                    borderBottomColor: COLOR.SMOKELIGHT
                  }}>
                    <Icon
                      name="clock"
                      type="Feather"
                      style={{ fontSize: 12, color: COLOR.GREYVIOLET, marginRight: 5 }}
                    />
                    <Text style={{
                      fontFamily: FAMILY.REGULAR,
                      fontSize: SIZE.SIZE_11,
                      color: COLOR.GREYVIOLET
                    }}>
                      {tripTime}
                    </Text>
                  </View>
                </View>

                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingTitle}>TRIP COST</Text>
                  <Text style={[styles.bookingText, { fontFamily: FAMILY.BOLD, color: COLOR.PRIMARY, fontSize: SIZE.SIZE_14 }]}>
                    {cost}
                  </Text>
                </View>

                {val?.[otherUserField]?.first_name && (
                  <View style={styles.bookingInfo}>
                    <Text style={styles.bookingTitle}>{otherUserLabel}</Text>
                    <Text style={[styles.bookingText, { fontFamily: FAMILY.BOLD }]}>
                      {val[otherUserField]?.first_name}
                    </Text>
                  </View>
                )}

                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingTitle}>OTP</Text>
                  <View style={{
                    backgroundColor: COLOR.PRIMARY,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 6
                  }}>
                    <Text style={{
                      fontFamily: FAMILY.BOLD,
                      fontSize: SIZE.SIZE_14,
                      color: COLOR.LIGHT,
                      letterSpacing: 2
                    }}>
                      {val?.receiving_otp}
                    </Text>
                  </View>
                </View>

                <View style={[styles.bookingInfo, { borderBottomWidth: 0, paddingBottom: 8 }]}>
                  <Text style={styles.bookingTitle}>STATUS</Text>
                  <View style={{
                    backgroundColor: getStatusColor(),
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                    borderRadius: 15
                  }}>
                    <Text style={{
                      fontFamily: FAMILY.BOLD,
                      fontSize: SIZE.SIZE_10,
                      color: COLOR.LIGHT
                    }}>
                      {statusText}
                    </Text>
                  </View>
                </View>
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
                    name="file-text"
                    type="Feather"
                    style={{ fontSize: 14, color: COLOR.GREYDARK }}
                  />
                  <Text style={styles.detailBtnText}>Details</Text>
                </Button>

                {val?.status !== 'completed' && (
                  <>
                    <Button
                      style={[styles.detailBtn, { backgroundColor: COLOR.BLUE }]}
                      onPress={() => {
                        setSelectedParcel(val);
                      }}>
                      <Icon
                        name="message-circle"
                        type="Feather"
                        style={{ fontSize: 14, color: COLOR.LIGHT }}
                      />
                      <Text style={[styles.detailBtnText, { color: COLOR.LIGHT }]}>
                        Chat
                      </Text>
                    </Button>

                    <Button
                      style={[styles.detailBtn, { backgroundColor: COLOR.GREEN }]}
                      onPress={() => handleNavigation(val)}>
                      <Icon
                        name="navigation"
                        type="Feather"
                        style={{ fontSize: 14, color: COLOR.LIGHT }}
                      />
                      <Text style={[styles.detailBtnText, { color: COLOR.LIGHT }]}>
                        {isCustomer ? 'Track' : 'Start'}
                      </Text>
                    </Button>
                  </>
                )}
              </View>
            </View>
              </>
            )}
          />
        </View>
      );
    });
  };

  if (loading) {
    return (
      <Container style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLOR.PRIMARY }}>
        <DarkStatusBar />
        <AppSpinner color={COLOR.BLUE} size="large" />
        <Text style={{ color: COLOR.LIGHT, marginTop: 10, fontSize: SIZE.SIZE_14 }}>
          Loading trips...
        </Text>
      </Container>
    );
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={COLOR.PRIMARY}
                colors={[COLOR.PRIMARY]}
              />
            }
          >
            <View style={styles.accordionLayout}>
              {renderTrips(filteredTrips)}
            </View>
          </ScrollView>
        </View>
      </Content>

      <ChatsModal
        selectedParcel={selectedParcel}
        setSelectedParcel={setSelectedParcel}
      />
    </Container>
  );
}
