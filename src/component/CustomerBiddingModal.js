import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  DeviceEventEmitter,
} from 'react-native';
import {Text, Icon} from './Basic';
import {Button} from './Form';
import {COLOR, FAMILY, SIZE} from '../theme/typography';
import Modal from 'react-native-modalbox';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL, URL_V} from '../utilities/helper';

const BidCard = ({value, index, handleRejection, acceptRide}) => {
  console.log('🎨 Rendering bid card for:', value?.bidder?._id);

  return (
    <View
      style={{
        width: '90%',
        borderRadius: 16,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
        marginBottom: 15,
        alignSelf: 'center',
        borderWidth: index === 0 ? 3 : 0, // ✅ Highlight best bid
        borderColor: index === 0 ? COLOR.GREEN : 'transparent',
      }}>
      {/* ✅ Best Bid Badge */}
      {index === 0 && (
        <View
          style={{
            position: 'absolute',
            top: -10,
            right: 20,
            backgroundColor: COLOR.GREEN,
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 12,
            zIndex: 10,
          }}></View>
      )}

      <View style={{padding: 20}}>
        {/* Header Section */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              overflow: 'hidden',
              borderWidth: 3,
              borderColor: COLOR.PRIMARY,
            }}>
            <Image
              source={
                value?.bidder?.avatar
                  ? {uri: value?.bidder?.avatar}
                  : require('../assets/images/driver.jpeg')
              }
              resizeMode="cover"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </View>

          <View style={{flex: 1, marginLeft: 16}}>
            <Text
              style={{
                fontFamily: FAMILY.BOLD,
                fontSize: SIZE.SIZE_16,
                color: COLOR.DARK,
                marginBottom: 4,
              }}>
              {value?.bidder?.first_name} {value?.bidder?.last_name}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                name="star"
                type="FontAwesome"
                style={{fontSize: 14, color: '#FFB800', marginRight: 4}}
              />
              <Text
                style={{
                  fontFamily: FAMILY.REGULAR,
                  fontSize: SIZE.SIZE_12,
                  color: COLOR.GREYVIOLET,
                }}>
                Rating: {value?.bidder?.rating || '0'}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: COLOR.GREEN,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
            }}>
            <Text
              style={{
                fontFamily: FAMILY.BOLD,
                fontSize: SIZE.SIZE_18,
                color: 'white',
              }}>
              ${value?.bid_amount}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: '#E8E8E8',
            marginBottom: 16,
          }}
        />

        {/* Action Buttons */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 12,
          }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#FFF',
              borderWidth: 2,
              borderColor: '#FF4444',
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              console.log('👆 Decline button pressed');
              handleRejection(value);
            }}>
            <Text
              style={{
                fontFamily: FAMILY.BOLD,
                fontSize: SIZE.SIZE_14,
                color: '#FF4444',
              }}>
              Decline
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: COLOR.GREEN,
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: COLOR.GREEN,
              shadowOffset: {width: 0, height: 4},
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 4,
            }}
            onPress={() => {
              console.log('👆 Accept button pressed');
              acceptRide(value);
            }}>
            <Text
              style={{
                fontFamily: FAMILY.BOLD,
                fontSize: SIZE.SIZE_14,
                color: 'white',
              }}>
              Accept
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const CustomerBiddingModal = () => {
  const [bids, setBids] = useState([]);
  const [mainModel, setMainModel] = useState(false);
  const {socket} = useSelector(state => state.socket);
  const {user} = useSelector(state => state.session);

  const isCustomer = () => {
    if (!user) return false;
    if (Array.isArray(user.role)) {
      return user.role.includes('user');
    }
    return user.role === 'user';
  };

  useEffect(() => {
    if (!socket || !isCustomer()) {
      return;
    }

    const handleBidding = incomingBid => {
      console.log('🎯 NEW BID RECEIVED CUSTOMER!');
      const incomingBidId = incomingBid.bidder._id;

      setBids(prevBids => {
        const newBids = [...prevBids];
        const isBidFoundIndex = newBids?.findIndex(
          bid => bid?.bidder?._id === incomingBidId,
        );

        if (isBidFoundIndex !== -1) {
          newBids[isBidFoundIndex] = incomingBid;
        } else {
          newBids.push(incomingBid);
        }

        return newBids.sort((a, b) => {
          const bidA = parseInt(a.bid_amount, 10);
          const bidB = parseInt(b.bid_amount, 10);
          return bidB - bidA;
        });
      });

      setMainModel(true);
    };

    socket.on('bidding', handleBidding);

    // Also listen to refreshBids events if they come from notifications
    const refreshListener = DeviceEventEmitter.addListener(
      'refreshBids',
      data => {
        console.log('🎯 REFRESH BIDS RECEIVED!');
        // Usually data would be the bid or we might need to fetch.
        // If the backend sends full bid in notification body, we can handle it.
        // But for now, we rely on socket for real-time.
      },
    );

    return () => {
      socket.off('bidding', handleBidding);
      refreshListener.remove();
    };
  }, [socket, user]);

  const handleRejection = bid => {
    const filteredBids = bids.filter(b => b._id !== bid._id);
    if (filteredBids.length === 0) {
      setMainModel(false);
    }
    setBids(filteredBids);
  };

  const acceptRide = async value => {
    try {
      var data = await AsyncStorage.getItem('response');
      var datas = JSON.parse(data);

      const formData = new FormData();
      formData.append('rider_id', value.bidder._id);
      formData.append('status', 'in_progress');
      formData.append('pay_amount', value?.bid_amount);

      const resp = await axios.patch(
        `${BASE_URL}${URL_V}parcel/${value.parcel._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${datas.access_token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      setMainModel(false);
      setBids([]);
      alert('You have chosen ur driver. He is on his way!');
    } catch (err) {
      console.error('❌ Error accepting ride:', err);
    }
  };

  const shouldShow = isCustomer() && mainModel && bids.length > 0;

  return (
    <Modal
      isOpen={shouldShow}
      entry={'top'}
      backdropOpacity={0.5}
      swipeToClose={false}
      position="center"
      style={{
        height: 'auto',
        maxHeight: '85%',
        width: '90%',
        backgroundColor: 'transparent',
        justifyContent: 'flex-start',
        paddingTop: 20,
      }}>
      <View
        style={{
          backgroundColor: 'white',
          marginBottom: 10,
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 12,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
        <Text
          style={{
            fontFamily: FAMILY.BOLD,
            fontSize: SIZE.SIZE_16,
            color: COLOR.DARK,
          }}>
          {bids.length} {bids.length === 1 ? 'Driver' : 'Drivers'} Bidding
        </Text>
        <Text
          style={{
            fontFamily: FAMILY.REGULAR,
            fontSize: SIZE.SIZE_12,
            color: COLOR.GREYVIOLET,
            marginTop: 4,
          }}>
          Choose the best offer for your trip
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}>
        {bids.map((val, index) => {
          return (
            <BidCard
              key={val?.bidder?._id}
              value={val}
              index={index}
              handleRejection={handleRejection}
              acceptRide={acceptRide}
            />
          );
        })}
      </ScrollView>
      <TouchableOpacity
        style={{
          backgroundColor: '#FF4444',
          marginTop: 10,
          marginBottom: 20,
          paddingVertical: 16,
          borderRadius: 12,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={() => {
          setMainModel(false);
        }}>
        <Text
          style={{
            color: 'white',
            fontFamily: FAMILY.BOLD,
            fontSize: SIZE.SIZE_16,
          }}>
          Cancel All Bids
        </Text>
      </TouchableOpacity>
    </Modal>
  );
};

export default CustomerBiddingModal;
