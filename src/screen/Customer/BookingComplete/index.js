/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Container, Content, Text, Icon } from '../../../component/Basic';
import { TextInput, Button } from '../../../component/Form';
import Modal from 'react-native-modalbox';
import styles from './styles';
import theme from '../../../theme/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../../component/Header';
import { showMessage } from '../../../helper/showAlert';
import { DarkStatusBar } from '../../../component/StatusBar';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import { BASE_URL, URL_V } from '../../../utilities/helper';
import { navigateReset } from '../../../navigations';
import AppSpinner from '../../../component/AppSpinner';
import { COLOR } from '../../../theme/typography';
import { Alert } from 'react-native';

export default function BookingComplete(props) {
  const val = props.route.params.data;
  const [isOpen, setIsOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [images, setImages] = useState(null); // single file object
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState('');

  console.log(val, 'driverValues');

  const getPhotoFromGallery = async () => {
    try {
      const res = await DocumentPicker.pick({
        allowMultiSelection: false,
        type: [DocumentPicker.types.allFiles],
      });
      // DocumentPicker ek object deta hai jisme uri, name, type, size hote hain. [web:57][web:63]
      setImages(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // user cancelled, ignore
      } else {
        throw err;
      }
    }
  };

  const postComplain = async () => {
    try {
      if (!description.trim()) {
        showMessage('error', 'Please enter description');
        return;
      }

      const userData = await AsyncStorage.getItem('response');
      const userJsonData = JSON.parse(userData);
      console.log(val?.rider_id?._id, 'riderId')

      const formData = new FormData();
      if (images) {
        formData.append('files', {
          uri: images.uri,
          name: images.name || `file-${Date.now()}`,
          type: images.type || 'application/octet-stream',
        });
      }
      formData.append('complain_against', val?.rider_id?._id);
      formData.append('parcel', val?._id);
      formData.append('description', description);
      console.log('FormData', formData);

      const res = await axios.post(
        `${BASE_URL}${URL_V}complaints`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userJsonData.access_token}`,
          },
        },
      );

      showMessage('success', 'Complain Created Successfully!');
      console.log('RESULT', res.data);
      setIsOpen(false);
      setImages(null);
      setDescription('');
    } catch (err) {
      showMessage('error', 'Error in Posted Complain');
      console.log('ERROR', err?.response?.data || err);
    }
  };



  const confirmCancelTrip = () => {
    Alert.alert(
      'Cancel Trip',
      'Are you sure you want to cancel this trip?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => cancelTrip(), // yahan actual API call
        },
      ],
      { cancelable: true },
    );
  };

  const cancelTrip = async () => {
    try {
      setIsLoading(true);
      const data = await AsyncStorage.getItem('response');
      const datas = JSON.parse(data);

      const resp = await axios.post(
        `${BASE_URL}${URL_V}parcel/cancel`,
        { parcel: val?._id },
        {
          headers: {
            Authorization: `Bearer ${datas.access_token}`,
          },
        },
      );

      showMessage('success', resp.data);
      navigateReset('CustomerMyTrips');
    } catch (err) {
      console.log('Cancel Trip Error:', err?.response?.data || err);
      showMessage('error', 'Something went wrong while cancelling the trip');
    } finally {
      setIsLoading(false);
    }
  };



  const hasRider = !!val?.rider_id?._id;

  return (
    <Container>
      <DarkStatusBar />
      <Header leftType="back" title="BOOKING" />
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingHeaderText}>CHECKOUT YOUR BOOKING</Text>
      </View>
      <Content contentContainerStyle={theme.layoutDf}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.bookingContainer}>
              <View style={styles.bookingContent}>
                <View style={styles.bookingDetail}>
                  <Text style={styles.bookingIdText}>
                    BOOKING ID : {(val?._id || '').substr(0, 15)}
                  </Text>
                  <Button>
                    <Text style={styles.completeBtn}>{val?.status}</Text>
                  </Button>
                </View>
                <View style={styles.bookingItem}>
                  <Text style={styles.bookingTitle}>PAID</Text>
                  <Text style={styles.bookingText}>
                    {val?.pay_amount
                      ? `${val?.pay_amount} USD`
                      : `${val?.fare} USD`}
                  </Text>
                </View>
                <View style={styles.bookingItem}>
                  <Text style={styles.bookingTitle}>PICKUP TIME</Text>
                  <Text style={styles.bookingText}>
                    {val?.time
                      ? `${new Date(val.time).getFullYear()}-${(
                        new Date(val.time).getMonth() + 1
                      )
                        .toString()
                        .padStart(2, '0')}-${new Date(val.time)
                          .getDate()
                          .toString()
                          .padStart(2, '0')} ${new Date(val.time)
                            .getHours()
                            .toString()
                            .padStart(2, '0')}:${new Date(val.time)
                              .getMinutes()
                              .toString()
                              .padStart(2, '0')}`
                      : ''}
                  </Text>
                </View>
              </View>
              <View style={styles.documentInfo}>
                <Text style={styles.documentText}>PACKAGES</Text>
                <Text style={styles.checkoutText}>
                  Checkout your package informations
                </Text>
                <View style={styles.bookingItem}>
                  <Text style={styles.bookingTitle}>DIMENSION</Text>
                  <Text style={styles.bookingTitle}>QUANTITY</Text>
                </View>
                <View style={styles.bookingItem}>
                  <Text style={styles.bookingTextDark}>Width</Text>
                  <Text style={styles.bookingTextDark}>{val?.width}</Text>
                </View>
                <View style={styles.bookingItem}>
                  <Text style={styles.bookingTextDark}>Height</Text>
                  <Text style={styles.bookingTextDark}>{val?.height}</Text>
                </View>
                <View style={styles.bookingItem}>
                  <Text style={styles.bookingTextDark}>Length</Text>
                  <Text style={styles.bookingTextDark}>{`${val?.length}`}</Text>
                </View>
                <View style={styles.bookingItem}>
                  <Text style={styles.bookingTextDark}>Weight</Text>
                  <Text style={styles.bookingTextDark}>{`${val?.weight}`}</Text>
                </View>
              </View>
              {hasRider && (
                <View style={styles.driverDetail}>
                  <View style={styles.driverInfo}>
                    <View>
                      <Text style={styles.driverText}>DRIVER</Text>
                      <Text style={styles.driverTextInfo}>
                        {'Driver informations'}
                      </Text>
                    </View>
                    <Button onPress={() => { }}>
                      <Image
                        source={{
                          uri:
                            val?.rider_id?.avatar ||
                            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=60',
                        }}
                        style={styles.driverImg}
                      />
                    </Button>
                  </View>
                  <View>
                    <View style={styles.bookingItem}>
                      <Text style={styles.bookingTitle}>NAME</Text>
                      <Text style={styles.bookingTextDark}>
                        {`${val?.rider_id?.first_name}`}
                      </Text>
                    </View>
                    <View style={styles.bookingItem}>
                      <Text style={styles.bookingTitle}>VEHICAL NO</Text>
                      <Text style={styles.bookingTextDark}>
                        {`${val?.rider_id?.vehicle_no}`}
                      </Text>
                    </View>
                    <View style={styles.bookingItem}>
                      <Text style={styles.bookingTitle}>RATING</Text>
                      <View style={styles.ratingInfo}>
                        {[1, 2, 3, 4, 5].map((item, index) => (
                          <Icon
                            key={index}
                            name="star"
                            type="FontAwesome"
                            style={
                              index < 4
                                ? styles.ratingIconSelected
                                : styles.ratingIcon
                            }
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Content>
      <Modal
        position="center"
        isOpen={isOpen}
        onClosed={() => setIsOpen(false)}
        isDisabled={isDisabled}
        backdrop={true}
        backdropOpacity={0.5}
        style={[
          styles.modalRating,
          {
            borderRadius: 16,
            paddingHorizontal: 20,
            paddingVertical: 20,
            justifyContent: 'flex-start',
          },
        ]}>
        <View style={[styles.modalRatingContainer, { flex: 0 }]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: COLOR.DARKVIOLET,
              }}>
              Submit Complain
            </Text>
            <Button
              style={[styles.closeSortDesc, { paddingHorizontal: 0 }]}
              onPress={() => setIsOpen(false)}>
              <Icon
                name="close"
                type="MaterialIcons"
                style={[theme.SIZE_20, theme.DARKVIOLET]}
              />
            </Button>
          </View>

          <View style={[styles.formRow, { marginTop: 10 }]}>
            <Text style={styles.formText}>DESCRIPTION</Text>
            <TextInput
              placeholder="Please write your comments"
              placeholderTextColor="#999"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
              style={[
                styles.formInput,
                {
                  backgroundColor: '#F3F3F3',
                  borderRadius: 10,
                  paddingTop: 10,
                },
              ]}
            />
          </View>

          {/* File preview */}
          <View style={{ marginTop: 15 }}>
            <Text style={styles.formText}>ATTACHMENT</Text>
            <View
              style={{
                marginTop: 8,
                minHeight: 40,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#ddd',
                paddingHorizontal: 10,
                paddingVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {images ? (
                <>
                  <Icon
                    name="file"
                    type="FontAwesome"
                    style={{ fontSize: 18, marginRight: 8, color: COLOR.DARKVIOLET }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      numberOfLines={1}
                      style={{ fontSize: 14, color: '#333' }}>
                      {images.name || 'Selected file'}
                    </Text>
                    {images.size != null && (
                      <Text style={{ fontSize: 12, color: '#777' }}>
                        {(images.size / (1024 * 1024)).toFixed(2)} MB
                      </Text>
                    )}
                  </View>
                </>
              ) : (
                <Text style={{ fontSize: 14, color: '#999' }}>
                  No file attached
                </Text>
              )}
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 25,
            }}>
            <View style={{ width: '47%', height: 48 }}>
              <Button style={styles.mailBtn} onPress={getPhotoFromGallery}>
                <Text style={styles.tripText}>ATTACH FILE HERE</Text>
              </Button>
            </View>
            <View style={{ width: '47%', height: 48 }}>
              <Button style={styles.mailBtn} onPress={postComplain}>
                <Text style={styles.tripText}>SEND</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.mailBtnInfo}>
        {val?.status !== 'completed' && (
          <Button
            style={[
              styles.mailBtn,
              { backgroundColor: val?.status === 'cancelled' ? '#ccc' : 'red' },
            ]}
            disabled={val?.status === 'cancelled'}
            onPress={() => {
              if (val?.status === 'cancelled') return;
              confirmCancelTrip();
            }}
          >
            {isLoading ? (
              <AppSpinner color={COLOR.LIGHT} size="large" />
            ) : (
              <Text style={styles.tripText}>CANCEL</Text>
            )}
          </Button>
        )}

        <Button
          style={[
            styles.mailInvoiceBtn,
            !hasRider && { backgroundColor: '#ccc' }, // optional disabled style
          ]}
          disabled={!hasRider}
          onPress={() => {
            if (!hasRider) return;
            setIsOpen(true);
          }}>
          <Text style={styles.tripText}>COMPLAIN</Text>
        </Button>
      </View>
    </Container>
  );
}
