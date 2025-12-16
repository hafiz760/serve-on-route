import React, {useState, useRef, useEffect} from 'react';
import {View, ScrollView, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import {Container, Content, Text, Icon} from '../../../component/Basic';
import {Button} from '../../../component/Form';
import styles from './styles';

import Modal from 'react-native-modalbox';

import Accordion from '../../Driver/MyTrips/Accordion';
import {DarkStatusBar} from '../../../component/StatusBar';
import BiddingCard from './BiddingCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getParcelsByRider,
  getParcelById as getParcelByIdService,
} from '../../../services/apicalls/driver';
import {BASE_URL, URL_V} from '../../../utilities/helper';
import Header from '../../../component/Header';

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
      // const response = await axios.post(
      //   "https://api.serveonroute.com/v1/bid",
      //   requestPayload,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${datas.access_token}`,
      //     },
      //   }
      // );

      // console.log("SUCCESSFULL RESPONSE ==>", response.data);
      setMainModel(false);
      socket.emit('bidding', requestPayload);

      alert('You successfully bid on this parcel');
    } catch (error) {
      // alert("Something went wrong while bidding...!");
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
      var data = await AsyncStorage.getItem('response');
      var datas = JSON.parse(data);
      console.log('Fetching parcels for rider_id:', datas._id);

      const res = await getParcelsByRider(datas._id, datas.access_token);
      console.log('getParcelsByRider response:', res);

      if (res?.success) {
        const incompleteData = res.data.docs.filter(
          item => item.status === 'in_progress',
        );
        setData(incompleteData);
      } else {
        console.log('Failed to fetch parcels:', res.message);
      }
    } catch (err) {
      console.log('error fetching data', err);
    } finally {
      setLoading(false);
    }
  };
  const getParcelById = async parcelId => {
    console.log('getParcelById called');
    var data = await AsyncStorage.getItem('response');
    var datas = JSON.parse(data);

    try {
      const response = await getParcelByIdService(parcelId, datas.access_token);

      console.log('RESPONSE ====>', response);

      if (response.success) {
        const exists = incomingParcelNotifications.some(
          item => item.id === response.data.id,
        );

        if (!exists) {
          setIncomingParcelNotifications([
            ...incomingParcelNotifications,
            response.data,
          ]);
        } else {
          console.log('Parcel already exists, not adding again');
        }

        if (!mainModel) {
          setMainModel(true);
        }
      } else {
        console.log('Failed to fetch parcel by ID:', response.message);
      }
    } catch (err) {
      alert('Something went wrong while fetching parcel');
      console.log(err);
    }
  };
  useEffect(() => {
    console.log('use effect call on home11111');
    fetchData();
    if (notiId) {
      const id = notiId.split('Id: ')[1].split(' has')[0];
      getParcelById(id);
    }
  }, [notiId]);

  const MainModel = () => {
    return (
      <Modal
        ref={ModalNotification}
        isOpen={true}
        entry={'top'}
        swipeToClose={false}
        style={{
          borderRadius: 10,
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
  const renderOpen = () => {
    return (
      <View>
        <View style={styles.accordionLayout}>
          {data &&
          data?.length > 0 &&
          data.filter(d => d.status === 'in_progress')?.length > 0 ? (
            data.map((val, index) => {
              console.log('val.status', val.status);
              if (val.status == 'in_progress') {
                return (
                  <Accordion
                    title={`TRIPS ID : ${index + 1}`}
                    text="open"
                    key={index}
                    renderContent={() => (
                      <View style={styles.accordionContent}>
                        <View style={styles.bookingInfo}>
                          <Text style={styles.bookingTitle}>TRIP COST</Text>
                          <Text style={styles.bookingText}>
                            {val?.pay_amount
                              ? `${val?.pay_amount} USDT`
                              : `${val?.fare} USD`}
                          </Text>
                        </View>
                        <View style={styles.bookingInfo}>
                          <Text style={styles.bookingTitle}>TRIP</Text>
                          <Text style={styles.bookingDetail}>{val?.time}</Text>
                        </View>
                        <View style={styles.bookingInfo}>
                          <Text style={styles.bookingTitle}>PICK UP FROM</Text>
                          <Text style={styles.bookingText}>
                            {val?.from_location}
                          </Text>
                        </View>
                        <View style={styles.bookingInfo}>
                          <Text style={styles.bookingTitle}>DROP AT</Text>
                          <Text style={styles.bookingText}>
                            {val?.to_location}
                          </Text>
                        </View>
                        <View style={styles.bookingInfo}>
                          <Text style={styles.bookingTitle}>DRIVER NAME</Text>
                          <Text style={styles.bookingText}>
                            {val?.customer_id?.first_name}
                          </Text>
                        </View>
                        <View style={styles.bookingInfo}>
                          <Text style={styles.bookingTitle}>
                            VEHICLE NUMBER
                          </Text>
                          <Text style={styles.bookingText}>NY 47568</Text>
                        </View>
                        <View style={styles.bookingInfo}>
                          <Text style={styles.bookingTitle}>CALL DRIVER</Text>
                          <Text style={styles.bookingText}>
                            {val?.customer_id?.phone}
                          </Text>
                        </View>
                        <View style={styles.bookingInfo}>
                          <Text style={styles.bookingTitle}>STATUS</Text>
                          <Button>
                            <Text style={styles.openBtnText}>
                              {val?.status}
                            </Text>
                          </Button>
                        </View>
                      </View>
                    )}
                  />
                );
              }
            })
          ) : (
            <View style={styles.noTripsFoundContainer}>
              <Icon
                name="clipboard-list"
                type="FontAwesome5"
                style={styles.noTripsFoundIcon}
              />
              <Text style={styles.noTripsFoundText}>No Open Trips Found</Text>
              <Text style={styles.noTripsFoundSubText}>
                You currently have no ongoing trips. New trips will appear here
                when you accept a bid.
              </Text>
            </View>
          )}
        </View>
      </View>
    );
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
            {renderOpen()}
          </View>
        </ScrollView>
      </Content>

      <View style={styles.footerBtn} />
    </Container>
  );
}
