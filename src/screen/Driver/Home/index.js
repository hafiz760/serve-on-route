import React, {useState, useRef, useEffect} from 'react';
import {View, ScrollView, FlatList, Alert} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {updateNotiId} from '../../../store/reducers/session';
import {Container, Content, Text, Icon} from '../../../component/Basic';
import {Button} from '../../../component/Form';
import styles from './styles';
import axios from 'axios';
import Modal from 'react-native-modalbox';
import Accordion from '../../Driver/MyTrips/Accordion';
import {DarkStatusBar} from '../../../component/StatusBar';
import BiddingCard from './BiddingCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL, URL_V} from '../../../utilities/helper';
import Header from '../../../component/Header';
import moment from 'moment';

export default function Home({route}) {
  console.log('route', route);
  const notiId = useSelector(state => state.session.notiId);
  console.log('notiId', notiId);
  const {socket} = useSelector(state => state.socket);
  const closeModelBaseOnId = id => {
    if (incomingParcelNotifications.length == 1) {
      setMainModel(false);
    }
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
      setMainModel(false);
      socket.emit('bidding', requestPayload);
      Alert.alert('You successfully bid on this parcel');
    } catch (error) {
      Alert.alert('Something went wrong while bidding...!');
    }
  };

  const [mainModel, setMainModel] = useState(false);
  const [incomingParcelNotifications, setIncomingParcelNotifications] =
    useState([]);
  const ModalNotification = useRef();
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
      const incompleteData = res.data.docs.filter(
        item => item.status === 'in_progress',
      );
      setData(incompleteData);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const getParcelById = async parcelId => {
    console.log('getParcelById called', parcelId);
    var data = await AsyncStorage.getItem('response');
    var datas = JSON.parse(data);

    try {
      const responseOne = await axios.get(
        `${BASE_URL}${URL_V}parcel/${parcelId}`,
        {
          headers: {
            Authorization: `Bearer ${datas.access_token}`,
          },
        },
      );

      console.log('RESPONSE ====>', responseOne);
      console.log(incomingParcelNotifications, 'incomingParcelNotifications');
      const exists = incomingParcelNotifications.some(
        item => item.id === responseOne.data.id,
      );
      console.log(exists, 'exists');

      if (!exists) {
        setIncomingParcelNotifications([
          ...incomingParcelNotifications,
          responseOne.data,
        ]);
      } else {
        console.log('Parcel already exists, not adding again');
      }

      if (!mainModel) {
        setMainModel(true);
      }
    } catch (err) {
      Alert.alert('Something went wrong while fetching parcel');
      console.log(err?.response);
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    console.log('use effect call on home11111');
    fetchData();
    if (notiId) {
      const id = notiId.split('Id: ')[1].split(' has')[0];
      console.log(id, 'id');
      getParcelById(id);
      dispatch(updateNotiId(null));
    }
  }, [notiId]);

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

  const MainModel = () => {
    return (
      <Modal
        ref={ModalNotification}
        isOpen={true}
        entry={'top'}
        swipeToClose={false}
        style={{
          borderRadius: 10,
          // alignItems: "center",
          minHeight: '100%',
        }}
        backdropPressToClose={false}>
        {incomingParcelNotifications.map(val => {
          return (
            <BiddingCard
              val={val}
              key={val?._id}
              CloseModelBaseOnId={closeModelBaseOnId}
              handleBid={handleBid}
            />
          );
        })}
      </Modal>
    );
  };
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
      <Modal
        isOpen={mainModel}
        entry={'top'}
        backdropOpacity={0.3}
        swipeToClose={false}>
        <View
          style={{
            flex: 1,
          }}>
          <MainModel />
        </View>

        <Button
          style={[styles.bookingBtn, {backgroundColor: 'grey'}]}
          onPress={() => {
            setMainModel(false);
          }}>
          <Text style={styles.bookingBtnText}>Cancel</Text>
        </Button>
      </Modal>
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
