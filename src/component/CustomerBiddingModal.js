import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, ScrollView, DeviceEventEmitter } from 'react-native';
import { Text, Icon } from './Basic';
import { Button } from './Form';
import { COLOR, FAMILY, SIZE } from '../theme/typography';
import Modal from 'react-native-modalbox';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, URL_V } from '../utilities/helper';

const CustomerBiddingModal = () => {
  const [bids, setBids] = useState([]);
  const [mainModel, setMainModel] = useState(false);
  const { socket } = useSelector(state => state.socket);
  const { user } = useSelector(state => state.session);

  console.log('🔵 CustomerBiddingModal - Component Rendered');
  console.log('🔵 Socket State:', socket ? 'Connected' : 'Not Connected');
  console.log('🔵 User Role:', user?.role);
  console.log('🔵 Current Bids Count:', bids.length);
  console.log('🔵 Modal Open State:', mainModel);

  const isCustomer = () => {
    if (!user) return false;
    if (Array.isArray(user.role)) {
      return user.role.includes('user');
    }
    return user.role === 'user';
  };

  console.log('is customer', isCustomer());

  useEffect(() => {
    console.log('🟢 useEffect - Running');

    // Check socket
    if (!socket) {
      console.log('🔴 Socket not available');
    }

    if (socket && !socket.connected) {
      console.log('🔴 Socket not connected');
    }

    // ✅ Check user role
    const checkIsCustomer = () => {
      if (!user) return false;
      if (Array.isArray(user.role)) {
        return user.role.includes('user');
      }
      return user.role === 'user';
    };

    if (!checkIsCustomer()) {
      console.log('🔴 User is not a customer/user. Role:', user?.role);
      return;
    }

    console.log('✅ User is a customer (role: user) - Ready to listen');

    const handleBidding = incomingBid => {
      console.log('🎯 NEW BID RECEIVED!');
      console.log(
        '📦 Incoming Bid Data:',
        JSON.stringify(incomingBid, null, 2),
      );

      const incomingBidId = incomingBid.bidder._id;
      console.log('🆔 Bidder ID:', incomingBidId);

      setBids(prevBids => {
        console.log('📊 Previous Bids Count:', prevBids.length);

        const newBids = [...prevBids];
        if (prevBids?.length > 0) {
          const isBidFound = newBids?.find(
            bid => bid?.bidder?._id === incomingBidId,
          );

          if (isBidFound) {
            console.log('🔄 Updating existing bid from driver:', incomingBidId);
            const filteredBids = newBids?.filter(
              bid => bid?.bidder?._id !== incomingBidId,
            );
            const sortedBids = filteredBids.sort((a, b) => {
              const bidA = parseInt(a.bid_amount, 10);
              const bidB = parseInt(b.bid_amount, 10);
              return bidB - bidA;
            });
            console.log('✅ Updated Bids Count:', sortedBids.length + 1);
            return [incomingBid, ...sortedBids];
          } else {
            console.log('➕ Adding new bid from driver:', incomingBidId);
            newBids.push(incomingBid);
            const sortedBids = newBids.sort((a, b) => {
              const bidA = parseInt(a.bid_amount, 10);
              const bidB = parseInt(b.bid_amount, 10);
              return bidB - bidA;
            });
            console.log('✅ Total Bids Count:', sortedBids.length);
            return sortedBids;
          }
        } else {
          console.log('✨ First bid received!');
          return [incomingBid];
        }
      });

      setMainModel(prevState => {
        if (!prevState) {
          console.log('🚀 Opening Bidding Modal');
          return true;
        } else {
          console.log('ℹ️ Modal already open');
          return prevState;
        }
      });
    };

    if (socket) {
      console.log(`👂 Attaching socket listener for "bidding" event on socket ${socket.id}`);
      socket.on('bidding', handleBidding);
    }

    // LISTENER FOR FCM FALLBACK
    const subscription = DeviceEventEmitter.addListener('refreshBids', (body) => {
      console.log('🔔 refreshBids event received via DeviceEventEmitter');
      console.log('📝 Body:', body);

      try {
        // Attempt to parse the body string to extract Bidder ID and Parcel info
        // Body format: "Rider with Id: <ID> has been bid on your parcel <JSON>"

        const riderIdMatch = body.match(/Rider with Id: ([a-f0-9]+)/i);
        const riderId = riderIdMatch ? riderIdMatch[1] : null;

        if (riderId) {
          console.log('✅ Extracted Rider ID:', riderId);

          // Try to find bid amount (fare, amount, bid_amount) from body.
          // The backend notification might dump the parcel object (which has the original fare), so we must be careful.
          // We prioritize 'bid_amount' or 'amount' over 'fare'.
          let bidAmount = '0';
          const bidAmountMatch = body.match(/(?:bid_amount|amount)['"]?:\s*['"]?(\d+)['"]?/);

          if (bidAmountMatch) {
            bidAmount = bidAmountMatch[1];
          } else {
            const fareMatch = body.match(/fare['"]?:\s*['"]?(\d+)['"]?/);
            bidAmount = fareMatch ? fareMatch[1] : '0';
            if (bidAmount !== '0') {
              console.log('⚠️ Warning: Using "fare" as bid amount. This might be the original parcel price, not the new bid.');
            }
          }

          // Construct a fake/minimal bid object
          const fakeBid = {
            bidder: {
              _id: riderId,
              first_name: 'Driver',
              last_name: ' (New Bid)',
              rating: 'New',
              avatar: null
            },
            bid_amount: bidAmount,
            parcel: {
              _id: 'unknown'
            },
            _id: 'temp_' + Date.now()
          };

          // Extract Parcel ID if possible
          const parcelIdMatch = body.match(/_id:\s*new ObjectId\("([a-f0-9]+)"\)/) || body.match(/_id['"]?:\s*['"]?([a-f0-9]{24})['"]?/);
          if (parcelIdMatch) {
            fakeBid.parcel._id = parcelIdMatch[1];
          }

          console.log('🔨 Constructed Fallback Bid:', fakeBid);
          handleBidding(fakeBid);
        } else {
          console.log('❌ Could not parse Rider ID from notification body');
        }

      } catch (e) {
        console.log('❌ Error parsing notification body:', e);
      }
    });

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up socket listener');
      if (socket) socket.off('bidding', handleBidding);
      subscription.remove();
    };
  }, [socket, user]); // ✅ Only socket and user in dependencies

  const handleRejection = bid => {
    console.log('❌ Declining bid from driver:', bid.bidder._id);
    console.log('💰 Declined bid amount:', bid.bid_amount);

    const filteredBids = bids.filter(b => b._id !== bid._id);
    console.log('📊 Remaining bids:', filteredBids.length);

    if (filteredBids.length === 0) {
      console.log('🔒 No more bids - Closing modal');
      setMainModel(false);
    }
    setBids(filteredBids);
  };

  const acceptRide = async value => {
    console.log(
      '✅ Accepting bid from driver:',
      value.bidder.first_name,
      value.bidder.last_name,
    );
    console.log('💰 Accepted bid amount:', value.bid_amount);
    console.log('📦 Parcel ID:', value.parcel._id);

    try {
      var data = await AsyncStorage.getItem('response');
      var datas = JSON.parse(data);
      console.log('🔑 Auth token retrieved');

      const formData = new FormData();
      formData.append('rider_id', value.bidder._id);
      formData.append('status', 'in_progress');
      formData.append('pay_amount', value?.bid_amount);

      console.log('📤 Sending PATCH request to accept bid...');

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

      console.log('✅ Bid accepted successfully!');
      console.log('📥 Response:', resp.data);

      setMainModel(false);
      setBids([]);
      console.log('🔒 Modal closed and bids cleared');

      alert('You have chosen ur driver. He is on his way!');
    } catch (err) {
      console.error('❌ Error accepting ride:', err);
      console.error('📄 Error details:', err.response?.data);
    }
  };

  // ✅ Single Bid Card Component (NOT a Modal)
  const BidCard = ({ value, index }) => {
    console.log('🎨 Rendering bid card for:', value);

    return (
      <View
        style={{
          width: '90%',
          borderRadius: 16,
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
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

        <View style={{ padding: 20 }}>
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
                    ? { uri: value?.bidder?.avatar }
                    : require('../assets/images/driver.jpeg')
                }
                resizeMode="cover"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </View>

            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text
                style={{
                  fontFamily: FAMILY.BOLD,
                  fontSize: SIZE.SIZE_16,
                  color: COLOR.DARK,
                  marginBottom: 4,
                }}>
                {value?.bidder?.first_name} {value?.bidder?.last_name}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="star"
                  type="FontAwesome"
                  style={{ fontSize: 14, color: '#FFB800', marginRight: 4 }}
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
                shadowOffset: { width: 0, height: 4 },
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

  if (!isCustomer()) {
    console.log('⛔ Not rendering modal - User role check failed');
    console.log('⛔ User role value:', user?.role);
    return null;
  }

  console.log('🎬 Rendering CustomerBiddingModal Container');
  console.log('📋 Total bids to display:', bids.length);

  return (
    <Modal
      isOpen={mainModel}
      entry={'top'}
      backdropOpacity={0.5}
      swipeToClose={false}
      position="center"
      style={{
        height: bids.length === 1 ? 'auto' : '85%', // ✅ Dynamic height based on bid count
        width: '100%',
        backgroundColor: 'transparent',
        justifyContent: 'flex-start',
        paddingTop: 20,
      }}>
      <View
        style={{
          backgroundColor: 'white',
          marginHorizontal: 20,
          marginBottom: 10,
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 12,
          alignItems: 'center',
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
        contentContainerStyle={{ paddingBottom: 20 }}>
        {bids.map((val, index) => {
          console.log('🔄 Rendering bid card in loop:', val?.bidder?._id);
          return <BidCard key={val?.bidder?._id} value={val} index={index} />;
        })}
      </ScrollView>
      <TouchableOpacity
        style={{
          backgroundColor: '#FF4444',
          marginTop: 10,
          marginBottom: 20,
          paddingVertical: 16,
          borderRadius: 12,
          marginHorizontal: 20,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={() => {
          console.log('🚫 Cancel button pressed - Closing modal');
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
