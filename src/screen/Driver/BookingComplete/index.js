import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Container, Content, Text, Icon } from '../../../component/Basic';
import { TextInput, Button } from '../../../component/Form';
import Modal from 'react-native-modalbox';
import styles from './styles';
import theme from '../../../theme/styles';
import Header from '../../../component/Header';
import { DarkStatusBar } from '../../../component/StatusBar';
import axios from 'axios';
import { showMessage } from '../../../helper/showAlert';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker from 'react-native-document-picker';
import moment from 'moment';
// import {BASE_URL,URL_V} from "@env"
import { BASE_URL, URL_V } from '../../../utilities/helper';

export default function BookingComplete(props) {
  // console.log("Value", props.route.params.data);
  const val = props.route.params.data;
  console.log(val)
  // console.log("🚀:", val.createdAt);
  const [isOpen, setIsOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [images, setImages] = useState([]);
  const { user } = useSelector(state => state.session);
  const [description, setDescription] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [parcelStatus, setParcelStatus] = useState(val?.status);

  const timeStrings = val.createdAt;
  const momentObject = moment(timeStrings);
  const totalMillisecondss = momentObject.valueOf();
  const totalHourss = totalMillisecondss / (1000 * 60 * 60);
  const getPhotoFromGallery = async () => {
    try {
      const res = await DocumentPicker.pick({
        allowMultiSelection: true,
        type: [DocumentPicker.types.allFiles],
      });
      // console.log("Image frm galaery", res);
      setImages(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const postComplain = async () => {
    var data = await AsyncStorage.getItem('response');
    var datas = JSON.parse(data);

    const formData = new FormData();
    formData.append('files', images);
    formData.append('complain_against', val?.customer_id?._id);
    formData.append('parcel', val?._id);
    formData.append('description', description);

    // console.log("FormData", formData);

    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${datas.access_token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    };
    try {
      const res = await fetch(
        `${BASE_URL}${URL_V}complaints`,
        requestOptions
      );
      const result = await res.json();
      showMessage('success', 'Complain Created Successfully!');
      // alert();
      // console.log("RESULT", result);
    } catch (err) {
      showMessage('error', 'Error in Posted Complain');
      // console.log("ERROR", err?.resonpse);
    }
  };

  const cancelTrip = async () => {
    try {
      const resp = await axios.post(
        `${BASE_URL}${URL_V}parcel/cancel`,
        {
          parcel: val?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        },
      );

      showMessage('success', resp.data);
    } catch (err) {
      showMessage('error', 'Something went wrong while cancelling the trip');
    }
  };

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
                    BOOKING ID : {(val?._id).substr(0, 15)}
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
                    {val?.time.substr(0, 10)}
                  </Text>
                </View>
              </View>
              <View style={styles.documentInfo}>
                <Text style={styles.documentText}>PACKAGES</Text>
                <Text style={styles.checkoutText}>
                  Checkout your package information
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
                  <Text style={styles.bookingTextDark}>{val?.length}</Text>
                </View>
                <View style={styles.bookingItem}>
                  <Text style={styles.bookingTextDark}>Weight</Text>
                  <Text style={styles.bookingTextDark}>{val?.weight}</Text>
                </View>
                <View
                  style={[
                    styles.bookingItem,
                    { flexDirection: 'column', alignItems: 'flex-start' },
                  ]}>
                  <Text style={styles.bookingTitle}>Parcel Images</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {val?.images && val.images.length > 0 ? (
                      val.images.map((img, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            setSelectedImage(img);
                            setIsPreviewOpen(true);
                          }}>
                          <Image source={{ uri: img }} style={styles.parcelImg} />
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text style={[styles.bookingTextDark, { marginTop: 10 }]}>
                        No parcel image
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              <View style={styles.driverDetail}>
                <View style={styles.driverInfo}>
                  <View>
                    <Text style={styles.driverText}>CUSTOMER</Text>
                    <Text style={styles.driverTextInfo}>
                      Customer information
                    </Text>
                  </View>
                  <Button>
                    <Image
                      source={
                        val?.customer_id?.avatar
                          ? { uri: val?.customer_id?.avatar }
                          : require('../../../assets/images/dummyProfile.jpg')
                      }
                      style={styles.customerImg}
                    />
                  </Button>
                </View>
                <View>
                  <View style={styles.bookingItem}>
                    <Text style={styles.bookingTitle}>NAME</Text>
                    <Text style={styles.bookingTextDark}>
                      {val?.customer_id?.first_name +
                        val?.customer_id?.last_name}
                    </Text>
                  </View>
                  <View style={styles.bookingItem}>
                    <Text style={styles.bookingTitle}>Parcel ID</Text>
                    <Text style={styles.bookingTextDark}>
                      {(val?._id).substr(0, 15)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Content>

      <Modal
        position={'center'}
        isOpen={isOpen}
        onClosed={() => setIsOpen(false)}
        isDisabled={isDisabled}
        style={styles.modalRating}>
        <View style={styles.modalRatingContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}>
            
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
                textAlignVertical={'top'}
                onChangeText={e => {
                  setDescription(e);
                }}
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
                onPress={() => {
                  getPhotoFromGallery();
                }}>
                <Icon
                  name="attach-file"
                  type="MaterialIcons"
                  style={styles.buttonIcon}
                />
                <Text style={styles.attachButtonText}>Attach File</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => {
                  postComplain();
                  setIsOpen(false);
                }}>
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
      
      <View style={[styles.mailBtnInfo]}>
        <TouchableOpacity
          style={[
            styles.mailBtn,
            { backgroundColor: 'red' },
            parcelStatus !== 'in_progress' && { opacity: 0.5 }
          ]}
          disabled={parcelStatus !== 'in_progress'}
          onPress={() => {
            if (parcelStatus === 'in_progress') {
              cancelTrip();
            }
          }}>
          <Text style={styles.tripText}>CANCEL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            totalHourss <= '72' || parcelStatus === 'completed'
              ? styles.mailInvoiceBtn
              : styles.mailInvoiceBtnn,
          ]}
          onPress={() => {
            setIsOpen(true);
          }}
          disabled={totalHourss <= '72' || parcelStatus === 'completed' ? false : true}>
          <Text style={styles.tripText}>COMPLAIN</Text>
        </TouchableOpacity>
      </View>
      <Modal
        position={'center'}
        isOpen={isPreviewOpen}
        onClosed={() => setIsPreviewOpen(false)}
        style={styles.modalPreview}>
        <View style={styles.modalPreviewContainer}>
          <TouchableOpacity
            style={styles.closePreview}
            onPress={() => setIsPreviewOpen(false)}>
            <Icon
              name="close"
              type="MaterialIcons"
              style={[theme.SIZE_30, theme.LIGHT]}
            />
          </TouchableOpacity>
          <Image
            source={{ uri: selectedImage }}
            style={styles.bigImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </Container>
  );
}
