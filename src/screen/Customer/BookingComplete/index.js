/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Container, Content, Text, Icon} from '../../../component/Basic';
import {TextInput, Button} from '../../../component/Form';
import Modal from 'react-native-modalbox';
import styles from './styles';
import theme from '../../../theme/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../../component/Header';
import {showMessage} from '../../../helper/showAlert';
import {DarkStatusBar} from '../../../component/StatusBar';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import {BASE_URL, URL_V} from '../../../utilities/helper';
import {navigateReset} from '../../../navigations';
import AppSpinner from '../../../component/AppSpinner';
import {COLOR} from '../../../theme/typography';
import {Alert} from 'react-native';
import ConfirmationModal from '../../../component/ConfirmationModal';

export default function BookingComplete(props) {
  const val = props.route.params.data;
  const [isOpen, setIsOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [images, setImages] = useState(null); // single file object
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

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
      console.log(val?.rider_id?._id, 'riderId');

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

      const res = await axios.post(`${BASE_URL}${URL_V}complaints`, formData, {
        headers: {
          Authorization: `Bearer ${userJsonData.access_token}`,
        },
      });

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

  const handleConfirmDelete = async () => {
    setIsModalVisible(false);
    cancelTrip();
  };

  const cancelTrip = async () => {
    try {
      setIsLoading(true);
      const data = await AsyncStorage.getItem('response');
      const datas = JSON.parse(data);

      const resp = await axios.post(
        `${BASE_URL}${URL_V}parcel/cancel`,
        {parcel: val?._id},
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
          style={{flex: 1}}>
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
                    <Button onPress={() => {}}>
                      <Image
                        source={
                          val?.rider_id?.avatar
                            ? {uri: val?.rider_id?.avatar}
                            : require('../../../assets/images/dummyProfile.jpg')
                        }
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
                    {/* <View style={styles.bookingItem}>
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
                    </View> */}
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
        style={styles.modalRating}>
        <View style={styles.modalRatingContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderContent}>
                <View style={styles.modalIconContainer}>
                  <Icon
                    name="report-problem"
                    type="MaterialIcons"
                    style={styles.modalHeaderIcon}
                  />
                </View>
                <View style={styles.modalHeaderTextContainer}>
                  <Text style={styles.modalTitle}>File a Complaint</Text>
                  <Text style={styles.modalSubtitle}>Help us improve our service</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsOpen(false)}>
                <Icon
                  name="close"
                  type="MaterialIcons"
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Description Section */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Description *</Text>
              <TextInput
                placeholder="Please describe your complaint in detail..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={7}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
                style={styles.formTextArea}
              />
              {images?.name && (
                <View style={styles.attachmentPreview}>
                  <Icon
                    name="attachment"
                    type="MaterialIcons"
                    style={styles.attachmentIcon}
                  />
                  <Text style={styles.attachmentText} numberOfLines={1}>
                    {images.name}
                  </Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.attachButton}
                onPress={getPhotoFromGallery}>
                <Icon
                  name="attach-file"
                  type="MaterialIcons"
                  style={styles.buttonIcon}
                />
                <Text style={styles.attachButtonText}>Attach File</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.sendButton}
                onPress={postComplain}>
                <Text style={styles.sendButtonText}>Submit</Text>
                <Icon
                  name="send"
                  type="MaterialIcons"
                  style={styles.sendButtonIcon}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <View style={styles.mailBtnInfo}>
        {val?.status !== 'completed' && (
          <Button
            style={[
              styles.mailBtn,
              {backgroundColor: val?.status === 'cancelled' ? '#ccc' : 'red'},
            ]}
            disabled={val?.status === 'cancelled'}
            onPress={() => {
              if (val?.status === 'cancelled') return;
              setIsModalVisible(true);
            }}>
            <Text style={styles.tripText}>CANCEL</Text>
          </Button>
        )}

        <Button
          style={[
            styles.mailInvoiceBtn,
            !hasRider && {backgroundColor: '#ccc'}, // optional disabled style
          ]}
          disabled={!hasRider}
          onPress={() => {
            if (!hasRider) return;
            setIsOpen(true);
          }}>
          <Text style={styles.tripText}>COMPLAIN</Text>
        </Button>
      </View>
      <ConfirmationModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={cancelTrip}
        isLoading={isLoading}
        message="Are you sure you want to Cancel the Trip?"
      />
    </Container>
  );
}
