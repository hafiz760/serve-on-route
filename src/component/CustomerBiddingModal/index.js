import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import Modal from 'react-native-modalbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Text, Icon} from '../Basic';
import {COLOR, FAMILY, SIZE} from '../../theme/typography';
import {BASE_URL, URL_V} from '../../utilities/helper';

const CustomerBiddingModal = () => {
  const {socket} = useSelector(state => state.socket);
  const {user} = useSelector(state => state.session);

  console.log(' ');
  console.log('========================================');
  console.log('CustomerBiddingModal: Component Render');
  console.log('CustomerBiddingModal: socket available?', !!socket);
  console.log('CustomerBiddingModal: user available?', !!user);
  console.log('CustomerBiddingModal: user name:', user?.first_name);
  console.log('CustomerBiddingModal: user role:', user?.role);
  console.log('========================================');

  const [mainModel, setMainModel] = useState(false);
  const [bids, setBids] = useState([]);
  const ModalNotification = useRef();

  const handleRejection = bid => {
    const filteredBids = bids.filter(b => b._id !== bid._id);

    if (filteredBids.length === 0) {
      setMainModel(false);
      if (ModalNotification.current) {
        ModalNotification.current.close();
      }
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
      if (ModalNotification.current) {
        ModalNotification.current.close();
      }
      setBids([]);
      alert('You have chosen ur driver. He is on his way!');
    } catch (err) {
      console.log('Accept Ride Error', err);
    }
  };

  useEffect(() => {
    console.log('CustomerBiddingModal: useEffect triggered');
    console.log('CustomerBiddingModal: socket:', socket ? 'connected' : 'null');
    console.log('CustomerBiddingModal: user:', user ? user.first_name : 'null');
    console.log('CustomerBiddingModal: user role:', user?.role);

    if (!socket || !user) {
      console.log(
        'CustomerBiddingModal: No socket or user, skipping listener setup',
      );
      return;
    }

    const isRider = user?.role?.includes('rider');
    if (isRider) {
      console.log(
        'CustomerBiddingModal: User is a rider/driver, skipping (this modal is for customers only)',
      );
      return;
    }
    console.log(
      'CustomerBiddingModal: ✅ User is a customer, proceeding with listener setup',
    );

    const handleBidding = incomingBid => {
      console.log('CustomerBiddingModal: ✅ Received bidding event!');
      console.log(
        'CustomerBiddingModal: incomingBid:',
        JSON.stringify(incomingBid, null, 2),
      );

      const incomingBidId = incomingBid.bidder._id;

      setBids(prevBids => {
        const newBids = [...prevBids];
        if (prevBids?.length > 0) {
          const isBidFound = newBids?.find(
            bid => bid?.bidder?._id === incomingBidId,
          );
          if (isBidFound) {
            const filteredBids = newBids?.filter(
              bid => bid?.bidder?._id !== incomingBidId,
            );
            const sortedBids = filteredBids.sort((a, b) => {
              const bidA = parseInt(a.bid_amount, 10);
              const bidB = parseInt(b.bid_amount, 10);
              return bidB - bidA;
            });
            return [incomingBid, ...sortedBids];
          } else {
            newBids.push(incomingBid);
            const sortedBids = newBids.sort((a, b) => {
              const bidA = parseInt(a.bid_amount, 10);
              const bidB = parseInt(b.bid_amount, 10);
              return bidB - bidA;
            });
            return sortedBids;
          }
        } else {
          return [incomingBid];
        }
      });

      // Force modal to open automatically using ref and a tiny delay
      setTimeout(() => {
        setMainModel(true);
        if (ModalNotification.current) {
          ModalNotification.current.open();
        }
      }, 100);
    };

    console.log('CustomerBiddingModal: Setting up bidding listener');
    socket.on('bidding', handleBidding);

    return () => {
      console.log('CustomerBiddingModal: Cleaning up bidding listener');
      socket.off('bidding', handleBidding);
    };
  }, [socket, user]);

  const BidCard = ({value}) => {
    return (
      <View style={styles.cardModal}>
        <View style={styles.cardContainer}>
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  value?.bidder?.avatar
                    ? {uri: value?.bidder?.avatar}
                    : require('../../assets/images/driver.jpeg')
                }
                resizeMode="cover"
                style={styles.avatar}
              />
            </View>

            <View style={styles.bidderInfo}>
              <Text style={styles.bidderName}>
                {value?.bidder?.first_name} {value?.bidder?.last_name}
              </Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" type="FontAwesome" style={styles.starIcon} />
                <Text style={styles.ratingText}>
                  Rating: {value?.bidder?.rating || '0'}
                </Text>
              </View>
            </View>

            <View style={styles.amountContainer}>
              <Text style={styles.amountText}>${value?.bid_amount}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={() => {
                handleRejection(value);
              }}>
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => {
                acceptRide(value);
              }}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  console.log(
    'CustomerBiddingModal: Rendering - mainModel:',
    mainModel,
    'bids count:',
    bids.length,
  );
  console.log(
    'CustomerBiddingModal: Modal should be open?',
    mainModel && bids.length > 0,
  );

  return (
    <Modal
      ref={ModalNotification}
      isOpen={mainModel && bids.length > 0}
      entry={'top'}
      swipeToClose={false}
      backdropPressToClose={false}
      style={styles.mainModal}
      backdropOpacity={0.5}>
      <View style={styles.container}>
        {bids.map(val => {
          return (
            <View style={styles.bidCardWrapper} key={val?.bidder?._id}>
              <BidCard value={val} />
            </View>
          );
        })}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainModal: {
    height: 'auto',
    maxHeight: '70%',
    width: '90%',
    backgroundColor: 'transparent',
    marginTop: 20,
  },
  container: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  bidCardWrapper: {
    width: '100%',
    marginBottom: 10,
  },
  cardModal: {
    width: '100%',
    backgroundColor: 'white',
  },
  cardContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: COLOR.PRIMARY,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  bidderInfo: {
    flex: 1,
    marginLeft: 16,
  },
  bidderName: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_16,
    color: COLOR.DARK,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: 14,
    color: '#FFB800',
    marginRight: 4,
  },
  ratingText: {
    fontFamily: FAMILY.REGULAR,
    fontSize: SIZE.SIZE_12,
    color: COLOR.GREYVIOLET,
  },
  amountContainer: {
    backgroundColor: COLOR.GREEN,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  amountText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_18,
    color: 'white',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FF4444',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineButtonText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_14,
    color: '#FF4444',
  },
  acceptButton: {
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
  },
  acceptButtonText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_14,
    color: 'white',
  },
});

export default CustomerBiddingModal;
