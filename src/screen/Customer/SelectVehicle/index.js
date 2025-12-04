import React, {useEffect, useRef, useState, useCallback, useMemo} from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {Container, Content, Text, Icon} from '../../../component/Basic';
import {TextInput, Button} from '../../../component/Form';
import {COLOR} from '../../../theme/typography';
import styles from './styles';
import theme from '../../../theme/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../../component/Header';
import Modal from 'react-native-modalbox';
import DropDownPicker from 'react-native-dropdown-picker';
import {useSelector} from 'react-redux';
import {DarkStatusBar} from '../../../component/StatusBar';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {BASE_URL, URL_V} from '../../../utilities/helper';
import {navigate} from '../../../navigations';
import DropdownPicker from '../../../component/DropdownPicker';
import AppSpinner from '../../../component/AppSpinner';
import {showMessage} from '../../../helper/showAlert';
import axios from 'axios';

const SLOT_TIMES = [
  {label: '00:00 - 04:00', value: '00:00 - 04:00', slot: 1},
  {label: '08:00 - 12:00', value: '08:00 - 12:00', slot: 3},
  {label: '12:00 - 16:00', value: '12:00 - 16:00', slot: 4},
  {label: '16:00 - 20:00', value: '16:00 - 20:00', slot: 5},
  {label: '20:00 - 24:00', value: '20:00 - 24:00', slot: 6},
];

const ITEM_TYPES = [
  {label: 'Solid', value: 'solid'},
  {label: 'Metal', value: 'metal'},
  {label: 'Wood', value: 'wood'},
  {label: 'Fragile', value: 'fragile'},
  {label: 'Other Items', value: 'otherItems'},
];

const WEIGHT_RANGE = [
  {title: '0-5'},
  {title: '5-10'},
  {title: '10-15'},
  {title: '15-20'},
  {title: '20-25'},
  {title: '25-30'},
  {title: '35-40'},
  {title: '40+'},
];

const DIMENSION_RANGE = [
  {title: '0-1'},
  {title: '2-3'},
  {title: '4-5'},
  {title: '6-7'},
  {title: '8-9'},
  {title: '9-10'},
  {title: '11-12'},
  {title: '13+'},
];

function SelectVehicle({route}) {
  const isFocused = useIsFocused();
  const {socket} = useSelector(state => state.socket);
  const modalNotificationRef = useRef();
  const [imageForShow, setImageForShow] = useState([]);
  const [date, setDate] = useState('');
  const [formatedDate, setFormatedDate] = useState('');
  const [fare, setFare] = useState('');
  const [width, setWidth] = useState({title: '0-1'});
  const [height, setHeight] = useState({title: '0-1'});
  const [length, setLength] = useState({title: '0-1'});
  const [weightRange, setWeightRange] = useState({title: '0-5'});
  const [itemsType, setItemsType] = useState('solid');
  const [slotTimings, setSlotTimings] = useState('00:00 - 04:00');
  const [selectSlot, setSelectSlot] = useState(1);
  const [mainModel, setMainModel] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [openTimeModel, setOpenTimeModel] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [imagePickerModal, setImagePickerModal] = useState(false);
  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fromLocation = route?.params?.form;
  const toLocation = route?.params?.to;

  const handleRejection = useCallback(
    bid => {
      const filteredBids = bids.filter(b => b._id !== bid._id);
      setBids(filteredBids);
      if (filteredBids.length === 0) {
        setMainModel(false);
      }
    },
    [bids],
  );
  const acceptRide = useCallback(async value => {
    try {
      const data = await AsyncStorage.getItem('response');
      const parsedData = JSON.parse(data);

      const formData = new FormData();
      formData.append('rider_id', value.bidder._id);
      formData.append('status', 'in_progress');
      formData.append('pay_amount', value?.bid_amount);

      await axios.patch(
        `${BASE_URL}${URL_V}parcel/${value.parcel._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${parsedData.access_token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      setMainModel(false);
      setBids([]);
      Alert.alert('Success', 'You have chosen your driver. He is on his way!');
      navigate('CustomerMyTrips');
    } catch (err) {
      console.error('Accept ride error:', err);
      Alert.alert('Error', 'Failed to accept ride. Please try again.');
    }
  }, []);

  const getPhotoFromCamera = useCallback(() => {
    if (imageForShow.length >= 3) {
      showMessage('error', "You can't upload more than three images");
      return;
    }

    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      compressImageQuality: 0.8,
    })
      .then(image => {
        const format = {
          name: image.path.split('/').pop(),
          height: image?.height,
          width: image?.width,
          size: image?.size,
          type: image.mime,
          uri: image?.path,
        };
        setImageForShow(prev => [...prev, format]);
        setImagePickerModal(false);
      })
      .catch(err => {
        if (err.message !== 'User cancelled image selection') {
          console.error('Camera error:', err);
        }
        setImagePickerModal(false);
      });
  }, [imageForShow.length]);

  const getPhotoFromGallery = useCallback(() => {
    const remainingSlots = 3 - imageForShow.length;

    if (remainingSlots === 0) {
      showMessage('error', "You can't upload more than three images");
      return;
    }

    ImagePicker.openPicker({
      multiple: true,
      maxFiles: remainingSlots,
      mediaType: 'photo',
      compressImageQuality: 0.8,
    })
      .then(images => {
        // Handle multiple images
        const formattedImages = images.map(image => ({
          name: image.path.split('/').pop(),
          height: image?.height,
          width: image?.width,
          size: image?.size,
          type: image.mime,
          uri: image?.path,
        }));

        setImageForShow(prev => [...prev, ...formattedImages].slice(0, 3));
        setImagePickerModal(false);
      })
      .catch(err => {
        if (err.message !== 'User cancelled image selection') {
          console.error('Gallery error:', err);
        }
        setImagePickerModal(false);
      });
  }, [imageForShow.length]);

  const handleImageUpload = useCallback(() => {
    if (imageForShow.length >= 3) {
      showMessage('error', "You can't upload more than three images");
      return;
    }
    setImagePickerModal(true);
  }, [imageForShow.length]);

  // Delete image handler
  const deleteShowImage = useCallback(value => {
    setImageForShow(previous =>
      previous.filter(val => val?.uri !== value?.uri),
    );
    showMessage('success', 'Image deleted successfully');
  }, []);

  // Date picker handlers
  const showDatePicker = useCallback(() => {
    setDatePickerVisibility(true);
  }, []);

  const hideDatePicker = useCallback(() => {
    setDatePickerVisibility(false);
  }, []);

  const handleConfirm = useCallback(
    date => {
      const formattedDate1 = moment(date).format('DD-MM-YYYY');
      const formattedDate2 = moment(date).format('YYYY-MM-DD HH:mm:ss');
      setDate(formattedDate1);
      setFormatedDate(formattedDate2);
      hideDatePicker();
    },
    [hideDatePicker],
  );

  const handleSlotSelect = useCallback(value => {
    setSlotTimings(value);
    const slotMap = {
      '00:00 - 04:00': 1,
      '08:00 - 12:00': 3,
      '12:00 - 16:00': 4,
      '16:00 - 20:00': 5,
      '20:00 - 24:00': 6,
    };
    setSelectSlot(slotMap[value] || 1);
  }, []);

  const validateForm = useCallback(() => {
    if (!fromLocation?.locationName) {
      showMessage('error', 'Please select pickup location');
      return false;
    }

    if (!toLocation?.locationName) {
      showMessage('error', 'Please select drop location');
      return false;
    }

    if (!fromLocation?.latitude || !fromLocation?.longitude) {
      showMessage('error', 'Invalid pickup location coordinates');
      return false;
    }

    if (!toLocation?.latitude || !toLocation?.longitude) {
      showMessage('error', 'Invalid drop location coordinates');
      return false;
    }

    if (!date || !formatedDate) {
      showMessage('error', 'Please select a date');
      return false;
    }
    if (!slotTimings) {
      showMessage('error', 'Please select a time slot');
      return false;
    }

    if (!fare || fare.trim() === '') {
      showMessage('error', 'Please enter your fare amount');
      return false;
    }

    if (isNaN(fare) || parseFloat(fare) <= 0) {
      showMessage('error', 'Please enter a valid fare amount');
      return false;
    }

    if (!weightRange?.title) {
      showMessage('error', 'Please select weight range');
      return false;
    }
    if (!length?.title) {
      showMessage('error', 'Please select parcel length');
      return false;
    }

    if (!width?.title) {
      showMessage('error', 'Please select parcel width');
      return false;
    }

    if (!height?.title) {
      showMessage('error', 'Please select parcel height');
      return false;
    }

    if (!itemsType) {
      showMessage('error', 'Please select material type');
      return false;
    }
    if (imageForShow.length === 0) {
      showMessage('error', 'Please upload at least one parcel photo');
      return false;
    }

    return true;
  }, [
    fromLocation,
    toLocation,
    date,
    formatedDate,
    slotTimings,
    fare,
    weightRange,
    length,
    width,
    height,
    itemsType,
    imageForShow,
  ]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const data = await AsyncStorage.getItem('response');
      const parsedData = JSON.parse(data);

      const formData = new FormData();
      imageForShow.forEach((img, index) => {
        if (img?.uri) {
          formData.append('files', img);
        }
      });

      formData.append(
        'from_location',
        JSON.stringify(fromLocation.locationName),
      );
      formData.append('to_location', JSON.stringify(toLocation.locationName));
      formData.append(
        'from_location_cor',
        `${fromLocation.latitude},${fromLocation.longitude}`,
      );
      formData.append(
        'to_location_cor',
        `${toLocation.latitude},${toLocation.longitude}`,
      );
      formData.append('height', height.title);
      formData.append('fare', fare);
      formData.append('width', width.title);
      formData.append('time', formatedDate);
      formData.append('length', length.title);
      formData.append('weight', weightRange.title);
      formData.append('parcel_type', itemsType);
      formData.append('receiving_slot', slotTimings);
      formData.append('biddingEndTime', '2026-12-12');
      formData.append('bidding_type', 'time');

      const res = await fetch(`${BASE_URL}${URL_V}parcel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${parsedData.access_token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await res.json();

      if (result.statusCode === 400) {
        showMessage('error', result.message);
      } else {
        showMessage(
          'success',
          'Parcel created successfully! Waiting for drivers to bid.',
        );
        navigate('CustomerMyTrips');
      }
    } catch (err) {
      console.error('Fetch data error:', err);
      showMessage(
        'error',
        err?.response?.data?.message || 'Something went wrong',
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    validateForm,
    fromLocation,
    toLocation,
    height,
    width,
    length,
    fare,
    formatedDate,
    itemsType,
    slotTimings,
    imageForShow,
    weightRange,
  ]);

  useEffect(() => {
    if (!socket) return;

    const handleBidding = incomingBid => {
      const incomingBidId = incomingBid.bidder._id;

      setBids(prevBids => {
        if (prevBids.length === 0) {
          return [incomingBid];
        }

        const existingBidIndex = prevBids.findIndex(
          bid => bid?.bidder?._id === incomingBidId,
        );

        let newBids;
        if (existingBidIndex !== -1) {
          newBids = [...prevBids];
          newBids[existingBidIndex] = incomingBid;
        } else {
          newBids = [...prevBids, incomingBid];
        }

        return newBids.sort((a, b) => {
          const bidA = parseInt(a.bid_amount, 10);
          const bidB = parseInt(b.bid_amount, 10);
          return bidB - bidA;
        });
      });

      if (!mainModel) {
        setMainModel(true);
      }
    };

    socket.on('bidding', handleBidding);

    // Cleanup socket listener
    return () => {
      socket.off('bidding', handleBidding);
    };
  }, [socket, mainModel]);

  useEffect(() => {
    if (!isFocused) {
      setBids([]);
      setMainModel(false);
    }
  }, [isFocused]);

  const BidModal = useMemo(
    () =>
      ({value}) =>
        (
          <Modal
            ref={modalNotificationRef}
            isOpen={true}
            entry={'top'}
            swipeToClose={false}
            style={{
              height: 180,
              width: 380,
              borderRadius: 10,
              alignItems: 'center',
            }}
            backdropPressToClose={false}>
            <View style={{margin: 10, borderRadius: 10}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{width: '20%', marginTop: 20}}>
                  <Image
                    source={
                      value?.bidder?.avatar
                        ? {uri: value?.bidder?.avatar}
                        : require('../../../assets/images/driver.jpeg')
                    }
                    resizeMode="cover"
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      margin: 10,
                    }}
                  />
                </View>
                <View style={{paddingTop: 20, width: '70%'}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      margin: 5,
                    }}>
                    <Text style={styles.biddingCardText}>
                      {value?.bidder?.first_name} {value?.bidder?.last_name}
                    </Text>
                    <Text style={styles.biddingCardText}>
                      Fare: ${value?.bid_amount}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      margin: 5,
                    }}>
                    <Text style={styles.biddingCardText}>
                      Rating: {value?.bidder?.rating}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Button
                  style={[styles.bookingDeclineBtn, {width: '40%'}]}
                  onPress={() => handleRejection(value)}>
                  <Text style={styles.bookingBtnText}>Decline</Text>
                </Button>
                <Button
                  style={[styles.bookingBtn, {width: '40%'}]}
                  onPress={() => acceptRide(value)}>
                  <Text style={styles.bookingBtnText}>Accept</Text>
                </Button>
              </View>
            </View>
          </Modal>
        ),
    [handleRejection, acceptRide],
  );

  return (
    <Container style={theme.layoutFx}>
      <Modal
        isOpen={mainModel}
        entry={'top'}
        backdropOpacity={0.3}
        swipeToClose={false}>
        {bids.map(val => (
          <View style={{height: '28%'}} key={val?.bidder?._id}>
            <BidModal value={val} />
          </View>
        ))}
        <Button
          style={[styles.bookingBtn, {backgroundColor: 'grey', marginTop: 40}]}
          onPress={() => setMainModel(false)}>
          <Text style={styles.bookingBtnText}>Cancel</Text>
        </Button>
      </Modal>

      <Modal
        isOpen={imagePickerModal}
        entry={'bottom'}
        position="bottom"
        backdropOpacity={0.3}
        swipeToClose={true}
        onClosed={() => setImagePickerModal(false)}
        style={{
          height: 250,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingHorizontal: 20,
          paddingTop: 20,
        }}>
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 20,
              textAlign: 'center',
              color: COLOR.DARKVIOLET,
            }}>
            Upload Photo
          </Text>

          <Button
            style={[styles.bookingBtn, {marginBottom: 10}]}
            onPress={getPhotoFromCamera}>
            <Text style={styles.bookingBtnText}>OPEN CAMERA</Text>
          </Button>

          <Button
            style={[styles.bookingBtn, {marginBottom: 10}]}
            onPress={getPhotoFromGallery}>
            <Text style={styles.bookingBtnText}>CHOOSE FROM GALLERY</Text>
          </Button>

          <Button
            style={[styles.bookingBtn, {backgroundColor: '#grey'}]}
            onPress={() => setImagePickerModal(false)}>
            <Text style={styles.bookingBtnText}>CANCEL</Text>
          </Button>
        </View>
      </Modal>

      <DarkStatusBar />
      <Header leftType="back" title={'Book Your Parcel'} />

      <Content contentContainerStyle={theme.layoutDf}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.selectVehicleContainer}>
              <View style={styles.selectVehicleContent}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Booking Details</Text>
                </View>
                <Text style={styles.inputHeading}>Date</Text>
                <View style={styles.accOrderInfo}>
                  <TouchableOpacity
                    onPress={showDatePicker}
                    activeOpacity={0.7}>
                    <View style={styles.selectDateMain}>
                      <Text style={styles.selectDateText}>
                        {date === '' ? 'Select Date' : date}
                      </Text>
                      <View style={{marginEnd: 20}}>
                        <Icon
                          name="calendar-month"
                          type="MaterialCommunityIcons"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    minimumDate={new Date()}
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                  />
                </View>

                <Text style={styles.inputHeading2}>
                  Please choose a time slot when a driver can pick up the
                  parcel.
                </Text>
                <View style={{height: 80, zIndex: 3}}>
                  <DropDownPicker
                    open={openTimeModel}
                    items={SLOT_TIMES}
                    setOpen={setOpenTimeModel}
                    value={slotTimings}
                    onSelectItem={e => handleSlotSelect(e.value)}
                    setItems={() => {}}
                    style={{
                      paddingVertical: 19,
                      marginTop: 10,
                      borderWidth: 0,
                    }}
                    labelStyle={{
                      color: COLOR.DARKVIOLET,
                      fontSize: 16,
                    }}
                    ArrowDownIconComponent={() => (
                      <FontAwesome
                        name="angle-down"
                        size={22}
                        color={COLOR.DARKVIOLET}
                      />
                    )}
                  />
                </View>

                <Text style={styles.timeTex2t}>Offer Your Fare</Text>
                <View style={styles.formRow}>
                  <TextInput
                    placeholder="Enter Your Fare"
                    value={fare}
                    placeholderTextColor="rgba(89, 73, 158, 0.5)"
                    onChangeText={setFare}
                    keyboardType="numeric"
                    style={styles.formInput}
                  />
                </View>

                <DropdownPicker
                  data={WEIGHT_RANGE}
                  onSelect={selectedItem => setWeightRange(selectedItem)}
                  title={'Weight Range(kg)'}
                  defaultButtonText={weightRange.title}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 15,
                  }}>
                  <DropdownPicker
                    data={DIMENSION_RANGE}
                    onSelect={selectedItem => setLength(selectedItem)}
                    title={'Length(ft)'}
                    defaultButtonText={length.title}
                    customButtonStyle={{width: 100}}
                  />
                  <DropdownPicker
                    data={DIMENSION_RANGE}
                    onSelect={selectedItem => setHeight(selectedItem)}
                    title={'Height(ft)'}
                    defaultButtonText={height.title}
                    customButtonStyle={{width: 100}}
                  />
                  <DropdownPicker
                    data={DIMENSION_RANGE}
                    onSelect={selectedItem => setWidth(selectedItem)}
                    title={'Width(ft)'}
                    defaultButtonText={width.title}
                    customButtonStyle={{width: 100}}
                  />
                </View>

                <Text style={styles.timeTex2t}>Material Type</Text>
                <View style={{height: 80, zIndex: 2}}>
                  <DropDownPicker
                    open={openModel}
                    items={ITEM_TYPES}
                    setOpen={setOpenModel}
                    value={itemsType}
                    onSelectItem={e => setItemsType(e.value)}
                    setItems={() => {}}
                    style={{
                      paddingVertical: 19,
                      marginTop: 10,
                      borderWidth: 0,
                    }}
                    labelStyle={{
                      color: COLOR.DARKVIOLET,
                      fontSize: 16,
                    }}
                    ArrowDownIconComponent={() => (
                      <FontAwesome
                        name="angle-down"
                        size={22}
                        color={COLOR.DARKVIOLET}
                      />
                    )}
                  />
                </View>

                <Text style={styles.timeTex2t}>Upload Parcel Photo</Text>
                <View style={styles.accordion}>
                  <Button style={styles.uploadBtn} onPress={handleImageUpload}>
                    <Text style={styles.uploadBtnText}>UPLOAD THE PHOTOS</Text>
                    <Icon
                      name="upload"
                      type="AntDesign"
                      style={{marginEnd: 20}}
                    />
                  </Button>
                </View>

                {imageForShow.length > 0 && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      flexWrap: 'wrap',
                      marginTop: 10,
                    }}>
                    {imageForShow.map((val, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => deleteShowImage(val)}
                        style={{marginRight: 10, marginBottom: 10}}>
                        <Image
                          source={{uri: val?.uri}}
                          style={{
                            width: 75,
                            height: 75,
                            borderRadius: 10,
                          }}
                          resizeMode="cover"
                        />
                        <View
                          style={{
                            position: 'absolute',
                            top: -5,
                            right: -5,
                            backgroundColor: 'red',
                            borderRadius: 10,
                            padding: 2,
                          }}>
                          <Icon
                            name="close"
                            type="AntDesign"
                            style={{fontSize: 14, color: 'white'}}
                          />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Content>
      <Button
        style={styles.bookingBtn}
        onPress={handleSubmit}
        disabled={isLoading}>
        {isLoading ? (
          <View style={{paddingVertical: 5}}>
            <AppSpinner color={COLOR.PRIMARY} size="large" />
          </View>
        ) : (
          <Text style={styles.bookingBtnText}>BOOK NOW</Text>
        )}
      </Button>
    </Container>
  );
}

export default SelectVehicle;
