import React, {useRef, useState} from 'react';
import {View, ScrollView, Image, TouchableOpacity} from 'react-native';
import {Container, Content, Text, Icon} from '../../../component/Basic';
import {TextInput, Button, ToggleSwitch} from '../../../component/Form';
import {COLOR, FAMILY, SIZE} from '../../../theme/typography';
import styles from './styles';
import theme from '../../../theme/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../../component/Header';
import Modal from 'react-native-modalbox';
import DropDownPicker from 'react-native-dropdown-picker';
import DocumentPicker from 'react-native-document-picker';
import {useSelector} from 'react-redux';
import CountDown from 'react-native-countdown-component';
import {DarkStatusBar} from '../../../component/StatusBar';
import {connect} from 'react-redux';
import {showMessage} from '../../../helper/showAlert';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {BASE_URL, URL_V} from '../../../utilities/helper';
import DropdownPicker from '../../../component/DropdownPicker';
import AppSpinner from '../../../component/AppSpinner';

function SelectVehicle(params) {
  const from_location_cor = `${params.route.params.form.latitude}, ${params.route.params.form.longitude}`;

  const to_location_cor = `${params.route.params.to.latitude}, ${params.route.params.to.longitude}`;

  const isFocused = useIsFocused();
  const [imageForShow, setImageForShow] = useState([]);
  const [date, setDate] = useState('');
  const [formatedDate, setFormatedDate] = useState('');

  const [images, setImages] = useState();
  const [fare, setfare] = useState();
  const [isloading, setISLoading] = useState(false);
  const [width, setWidth] = useState({title: '0-1'});
  const [height, setHeight] = useState({title: '0-1'});
  const [length, setLength] = useState({title: '0-1'});
  const [weight, setWeight] = useState('');
  const [openModel, setOpenModel] = useState(false);
  const [openTimeModel, setOpenTimeModel] = useState(false);

  const [timerModel, setTimerModel] = useState(false);
  const [focus, setFocus] = useState(false);
  const [bottomModal, setBottomModal] = useState(false);
  const [selectSlot, setSelectSlot] = useState('');
  const [until, setUntil] = useState(0);
  const [slotTimings, setSlotTimings] = useState(
    {label: '00:00 - 04:00', value: '00:00 - 04:00', slot: 1} || '',
  );
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [items, setItems] = useState([
    {label: 'Solid', value: 'solid'},
    {label: 'Metal', value: 'metal'},
    {label: 'Wood', value: 'wood'},
    {label: 'Fragile', value: 'fragile'},
    {label: 'Other Items', value: 'otherItems'},
  ]);
  const jobOptions = [
    {title: 'CIB'},
    {title: 'Detective'},
    {title: 'Forensic'},
    {title: 'Patrol'},
  ];
  const [times, setTimes] = useState([
    {label: '00:00 - 04:00', value: '00:00 - 04:00', slot: 1},
    {label: '04:00 - 08:00', value: '04:00 - 08:00', slot: 2},
    {label: '08:00 - 12:00', value: '08:00 - 12:00', slot: 3},
    {label: '12:00 - 16:00', value: '12:00 - 16:00', slot: 4},
    {label: '16:00 - 20:00', value: '16:00 - 20:00', slot: 5},
    {label: '20:00 - 24:00', value: '20:00 - 24:00', slot: 6},
  ]);
  const [ageModels, setAgeModels] = useState(false);
  const [weightRange, setWeightRange] = useState({title: '0-5'});
  const weightRangeValue = [
    {title: '0-5'},
    {title: '5-10'},
    {title: '10-15'},
    {title: '15-20'},
    {title: '20-25'},
    {title: '25-30'},
    {title: '35-40'},
    {title: '40+'},
  ];
  const WidthRangeValue = [
    {title: '0-1'},
    {title: '2-3'},
    {title: '4-5'},
    {title: '6-7'},
    {title: '8-9'},
    {title: '9-10'},
    {title: '11-12'},
    {title: '13+'},
  ];

  const [pracelTimeType, setPracelTimeType] = useState('time');
  const [itemsType, setItemsType] = useState('solid');
  const [time, setTime] = useState('Select Time');
  const {socket} = useSelector(state => state.socket);
  console.log(socket, 'socket');

  const ModalNotification = useRef();
  const getPhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      var format = {
        fileCopyUri: null,
        name: image.path.split('/')[image.path.split('/').length - 1],
        height: image?.height,
        width: image?.width,
        size: image?.size,
        type: image.mime,
        uri: image?.path,
      };
      setImageForShow(pre => {
        return [...pre, format];
      });
      setImages(format);
    });
  };
  const UploadData = async () => {
    try {
      const res = await DocumentPicker.pick({
        allowMultiSelection: true,
        type: [DocumentPicker.types.allFiles],
      });
      setImages(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };

  const getPhotoFromGallery = () => {
    if (imageForShow.length >= 3) {
      showMessage("You can't uploaded more than three images");
    } else {
      getPhotoFromCamera();
    }
  };

  const fetchData = async () => {
    if (!date) {
      return showMessage('error', 'Please select a date');
    }
    if (!slotTimings) {
      return showMessage('error', 'Please select a time slot');
    }
    if (!fare || isNaN(fare) || parseFloat(fare) <= 0) {
      return showMessage('error', 'Please enter a valid fare amount');
    }
    if (!length.title || !height.title || !width.title) {
      return showMessage('error', 'Please select all parcel dimensions');
    }
    if (!itemsType) {
      return showMessage('error', 'Please select a material type');
    }
    if (imageForShow.length === 0) {
      return showMessage('error', 'Please upload at least one parcel photo');
    }
    console.log('fetchData');
    setISLoading(true);
    var data = await AsyncStorage.getItem('response');
    console.log(data);
    var datas = JSON.parse(data);

    const formData = new FormData();

    imageForShow[0]?.uri && formData.append('files', imageForShow[0]);
    imageForShow[1]?.uri && formData.append('files', imageForShow[1]);
    imageForShow[2]?.uri && formData.append('files', imageForShow[2]);
    formData.append(
      'from_location',
      JSON.stringify(params.route.params.form.locationName),
    );
    formData.append(
      'to_location',
      JSON.stringify(params.route.params.to.locationName),
    );
    formData.append(
      'from_location_cor',
      `${params.route.params.form.latitude},${params.route.params.form.longitude}`,
    );
    formData.append(
      'to_location_cor',
      `${params.route.params.to.latitude},${params.route.params.to.longitude}`,
    );
    formData.append('height', height.title);
    formData.append('fare', fare);
    formData.append('width', width.title);
    formData.append('time', formatedDate);
    // formData.append("time", "2023-10-25T18:37:33.582Z");
    formData.append('length', length.title);
    formData.append('weight', width.title);
    formData.append('parcel_type', itemsType);
    formData.append('receiving_slot', slotTimings);
    formData.append('biddingEndTime', '2026-12-12');
    formData.append('bidding_type', pracelTimeType);

    console.log('FormData', JSON.stringify(formData, null, 2));
    // return
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${datas.access_token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    };
    try {
      const res = await fetch(`${BASE_URL}${URL_V}parcel`, requestOptions);
      console.log('fetchData ~ result======>', JSON.stringify(res, null, 2));
      const result = await res.json();
      // console.log("result>>>>>", result);
      if (result.statusCode === 400) {
        showMessage('error', result.message);
      } else {
        setFocus(true);
        showMessage(
          'success',
          'Parcel Created Successfully!. Wait for drivers to bid',
        );
        params.navigation.navigate('CustomerMyTrips');
        // setUntil(10)
        // setTimerModel(true)
      }
    } catch (err) {
      showMessage('error', 'Something went wrong');
    } finally {
      setISLoading(false);
    }
  };

  const deleteShowImage = value => {
    setImageForShow(previous => previous.filter(val => val?.uri != value?.uri));
    showMessage('success', 'Image Delete Successfully');
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    // Format the date as "DD-MM-YYYY"
    const formattedDate1 = moment(date).format('DD-MM-YYYY');
    // Set the first formatted date in state
    setDate(formattedDate1);

    // Format the date as "YYYY-MM-DD HH:mm:ss"
    const formattedDate2 = moment(date).format('YYYY-MM-DD HH:mm:ss');
    // Set the second formatted date in state

    setFormatedDate(formattedDate2);

    // Hide the date picker or perform other actions as needed
    hideDatePicker();
  };

  return (
    <Container style={theme.layoutFx}>
      <DarkStatusBar />
      <Header leftType="back" title={'Book Your Parcel'} />
      <Content contentContainerStyle={theme.layoutDf}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.selectVehicleContainer, {height: '80%'}]}>
            <View style={styles.selectVehicleContent}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Booking Details</Text>
              </View>
              <Text style={styles.inputHeading}>Date</Text>
              <View style={styles.accOrderInfo}>
                <Button
                  onPress={() => {
                    showDatePicker(true);
                  }}>
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
                </Button>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
              </View>
              <Text style={styles.inputHeading2}>
                Please choose a time slot, When a driving host can come to pick
                up the parcel.
              </Text>
              <View
                style={{
                  zIndex: 2000,
                  elevation: 2000,
                  marginBottom: openTimeModel ? 200 : 10,
                }}>
                <DropDownPicker
                  placeholder="Select Time Slot"
                  open={openTimeModel}
                  items={times}
                  setOpen={setOpenTimeModel}
                  value={slotTimings}
                  onSelectItem={e => {
                    setSlotTimings(e.value);
                    setSelectSlot(e.slot);
                  }}
                  setItems={setTimes}
                  listMode="FLATLIST"
                  dropDownContainerStyle={{
                    maxHeight: 400,
                    borderWidth: 1,
                  }}
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
                  onChangeText={text => {
                    setfare(text);
                  }}
                  keyboardType="numeric"
                  style={[styles.formInput, {flex: 1}]}
                />
              </View>

              <View>
                {/* <Text style={styles.timeTex2t}>Weight Range</Text> */}
                <View
                  style={
                    {
                      // height: 80,
                    }
                  }>
                  <DropdownPicker
                    data={weightRangeValue}
                    onSelect={(selectedItem, index) => {
                      setWeight(selectedItem);
                    }}
                    title={'Weight Range(kg)'}
                    // touched={touched.job}
                    // errorMessage={errors.job}
                    isPickerOpen={ageModels}
                    defaultButtonText={weightRange.title}
                    value={weightRange}
                    //   onFocus={() => setOpenBrandPicker(true)}
                    //   onBlur={() => setOpenBrandPicker(false)}
                  />
                  {/* <DropDownPicker
                  open={openWeightModel}
                  items={weightRange}
                  setOpen={setOpenWeightModel}
                  value={selectedWeight}
                  onSelectItem={(e) => {
                    setSelectedWeight(e.value); 
                  
                  }}
                  setItems={setItems}
                  style={{
                    // flex: 1,
                    paddingVertical: 19,
                    marginTop: 10,
                    marginBottom: 0,
                    borderWidth: 0,
                    color: COLOR.PRIMARY,
                    fontSize: SIZE.SIZE_14,
                    fontFamily: FAMILY.REGULAR,

                  }}
                  labelStyle={{
                    color:COLOR.DARKVIOLET, // Custom text color
                    fontSize: 16,
                  }}
                  dropDownContainerStyle={{
                    borderColor: "#4A90E2",
                    backgroundColor: "#FFFFFF",
                    zIndex: 999,
                    elevation: 999,
                    // Ensures dropdown stays above
                  }}
        
          
                  // ✅ Custom dropdown icon
                  ArrowDownIconComponent={() => (
                    <FontAwesome name="angle-down" size={22} color={COLOR.DARKVIOLET} />
                  )}
          
                /> */}
                </View>
                {/* <View style={[styles.formRow]}>
                  <View style={{ marginRight: 10 }}>
                    <Icon
                      name="box"
                      type="Feather"
                    />
                  </View>
                  <TextInput
                    type="number"
                    placeholder="Weight"
                    placeholderTextColor="rgba(89, 73, 158, 0.5)"
                    style={styles.formInput}
                    value={weight}
                    onChangeText={(text) => {
                      setWeight(text);
                    }}
                    keyboardType="numeric"
                    maxValue={100}
                  />
                </View> */}
              </View>
              {/* <Text style={styles.timeText2}>Dimension</Text> */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                {/* <View>
                  <View>
                    <View style={[styles.formRow2, { width: wp("25") }]}>
                      <TextInput
                        placeholder="Length"
                        placeholderTextColor="rgba(89, 73, 158, 0.5)"
                        keyboardType="numeric"
                        value={length}
                        onChangeText={(text) => {
                          setLength(text);
                        }}
                        style={[styles.formInput,]}
                      />
                    </View>
                  </View>
                </View> */}

                <DropdownPicker
                  data={WidthRangeValue}
                  onSelect={(selectedItem, index) => {
                    setLength(selectedItem);
                  }}
                  title={'Length(ft)'}
                  // touched={touched.job}
                  // errorMessage={errors.job}
                  isPickerOpen={ageModels}
                  defaultButtonText={length.title}
                  customButtonStyle={{width: 100}}
                  //   onFocus={() => setOpenBrandPicker(true)}
                  //   onBlur={() => setOpenBrandPicker(false)}
                />
                {/* <View>
                  <View style={[styles.formRow2, { width: wp("25") }]}>
                    <TextInput
                      type="number"
                      placeholder="Width"

                      placeholderTextColor="rgba(89, 73, 158, 0.5)"
                      style={styles.formInput}
                      value={width}
                      onChangeText={(text) => {
                        setWidth(text);
                      }}
                      keyboardType="numeric"
                      maxValue={100}
                    />
                  </View>
                </View> */}
                <DropdownPicker
                  data={WidthRangeValue}
                  onSelect={(selectedItem, index) => {
                    setHeight(selectedItem);
                  }}
                  title={'Height(ft)'}
                  // touched={touched.job}
                  // errorMessage={errors.job}
                  isPickerOpen={ageModels}
                  defaultButtonText={height.title}
                  customButtonStyle={{width: 100}}
                  //   onFocus={() => setOpenBrandPicker(true)}
                  //   onBlur={() => setOpenBrandPicker(false)}
                />
                {/* <View>
                  <View>
                    <View style={[styles.formRow2, { width: wp("25") }]}>
                      <TextInput
                        placeholder="Height"
                        placeholderTextColor="rgba(89, 73, 158, 0.5)"
                        keyboardType="numeric"
                        value={height}
                        onChangeText={(text) => {
                          setHeight(text);
                        }}
                        style={[styles.formInput,]}
                      />
                    </View>
                  </View>
                </View> */}
                <DropdownPicker
                  data={WidthRangeValue}
                  onSelect={(selectedItem, index) => {
                    setWidth(selectedItem);
                  }}
                  title={'Width(ft)'}
                  // touched={touched.job}
                  // errorMessage={errors.job}
                  isPickerOpen={ageModels}
                  defaultButtonText={width.title}
                  //   onFocus={() => setOpenBrandPicker(true)}
                  //   onBlur={() => setOpenBrandPicker(false)}
                  customButtonStyle={{width: 100}}
                />
              </View>

              <Text style={styles.timeTex2t}>Material Type</Text>
              <View
                style={{
                  height: 80,
                }}>
                <DropDownPicker
                  open={openModel}
                  items={items}
                  setOpen={setOpenModel}
                  value={itemsType}
                  onSelectItem={e => setItemsType(e.value)}
                  setItems={setItems}
                  style={{
                    paddingVertical: 19,
                    marginTop: 10,
                    marginBottom: 5,
                    borderWidth: 0,
                    color: COLOR.PRIMARY,
                    fontSize: SIZE.SIZE_14,
                    fontFamily: FAMILY.REGULAR,
                  }}
                  labelStyle={{
                    color: COLOR.DARKVIOLET, // Custom text color
                    fontSize: 16,
                  }}
                  // ✅ Custom dropdown icon
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
                <Button
                  style={styles.uploadBtn}
                  onPress={() => {
                    getPhotoFromGallery();
                  }}>
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
                    justifyContent: 'space-between',
                    maxWidth: '70%',
                  }}>
                  {imageForShow.map(val => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          deleteShowImage(val);
                        }}>
                        <Image
                          source={{
                            uri:
                              val?.uri ||
                              'https://cdn.pixabay.com/photo/2016/01/10/22/07/beauty-1132617__340.jpg',
                            i: 'file:///storage/emulated/0/Android/data/com.wditechy.truckie/files/Pictures/fb3506d2-0efc-49f7-9dfc-dc6f5897d544.jpg',
                          }}
                          style={{
                            width: 75,
                            height: 75,
                            borderRadius: 35,
                            marginBottom: hp(1),
                          }}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </Content>
      <Button
        style={styles.bookingBtn}
        onPress={() => {
          fetchData();
        }}>
        {isloading ? (
          <View style={{paddingVertical: 5}}>
            <AppSpinner color={COLOR.PRIMARY} size="large" />
          </View>
        ) : (
          <Text style={styles.bookingBtnText}>BOOK NOW</Text>
        )}
      </Button>

      <Modal
        isOpen={bottomModal}
        entry={'bottom'}
        backdropOpacity={0.3}
        swipeToClose={false}
        position="bottom"
        style={{
          height: 200,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}>
        <Button
          style={[styles.bookingBtn, {backgroundColor: 'purple'}]}
          onPress={() => {
            getPhotoFromCamera();
            setBottomModal(false);
          }}>
          <Text style={styles.bookingBtnText}>OPEN CAMERA</Text>
        </Button>
        <Button
          style={styles.bookingBtn}
          onPress={() => {
            UploadData();
            setBottomModal(false);
          }}>
          <Text style={styles.bookingBtnText}>SELECT FROM FILES</Text>
        </Button>
        <Button
          style={[styles.bookingBtn, {backgroundColor: 'red'}]}
          onPress={() => {
            setBottomModal(false);
          }}>
          <Text style={styles.bookingBtnText}>CANCLE</Text>
        </Button>
      </Modal>
      <Modal
        isOpen={timerModel}
        entry={'bottom'}
        backdropOpacity={0.3}
        swipeToClose={false}
        position="bottom"
        style={{
          height: 200,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}>
        <View style={{alignSelf: 'center'}}>
          <Text
            style={{
              marginTop: hp(2),
              fontFamily: FAMILY.BOLD,
              fontSize: SIZE.SIZE_18,
              color: '#000',
            }}>
            Wating for bid
          </Text>
        </View>
        <CountDown
          until={until}
          size={30}
          onFinish={() => setTimerModel(false)}
          digitStyle={{backgroundColor: '#FFF'}}
          digitTxtStyle={{color: '#1CC625'}}
          timeToShow={['M', 'S']}
          timeLabels={{m: 'MM', s: 'SS'}}
        />
      </Modal>
    </Container>
  );
}
export default connect(({session}) => ({session}))(SelectVehicle);
