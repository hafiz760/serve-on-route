import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import {COLOR} from '../../../../theme/typography';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import styles from '../styles';
import IDCardUpload from './IDCardUpload';
import SelfieUpload from './SelfieUpload';
import TextInputComp from '../../../../component/TextInputComp';

export default function PersonalInfoSection({
  name,
  setName,
  lastName,
  setLastName,
  phoneNumber,
  setPhoneNumber,
  itemsType,
  setItemsType,
  items,
  setItems,
  openModel,
  setOpenModel,
  date,
  setDate,
  open,
  setOpen,
  displayDate,
  setDisplayDate,
  nationalCard,
  setNationalCard,
  frontIdImage,
  backIdImage,
  getPhotoForFront,
  getPhotoForBack,
  removeFrontIdImage,
  removeBackIdImage,
  getPhotoFromGallery1,
  imageForShowSelfi,
  removeImage1,
}) {
  return (
    <>
      <View style={{width: wp(90), alignSelf: 'center'}}>
        <Text
          style={{
            color: '#59499E',
            fontFamily: 'bold',
            fontSize: 18,
            marginTop: hp(2),
            marginBottom: hp(2),
          }}>
          Personal informations
        </Text>
      </View>

      <View
        style={{
          padding: 15,
          borderRadius: 15,
          backgroundColor: '#fff',
          width: wp(90),
          alignSelf: 'center',
        }}>
        <TextInputComp
          placeholder="Enter first name"
          value={name}
          onChangeText={text => setName(text)}
          title="First Name"
        />
        <TextInputComp
          placeholder="Enter last name"
          value={lastName}
          onChangeText={text => setLastName(text)}
          title="Last Name"
        />

        <TextInputComp
          editable={false}
          placeholder="Enter your name"
          value={phoneNumber}
          onChangeText={text => setPhoneNumber(text)}
          title="Phone Number"
        />

        <View
          style={{
            flexDirection: 'row',
            width: wp(84),
            justifyContent: 'space-between',
          }}>
          <View>
            <Text style={{fontWeight: '400', fontSize: 14, color: '#59499E'}}>
              Gender
            </Text>
            <View style={{width: wp(41)}}>
              <DropDownPicker
                open={openModel}
                items={items}
                setOpen={setOpenModel}
                value={itemsType}
                onSelectItem={e => setItemsType(e.value)}
                setItems={setItems}
                style={{
                  paddingVertical: 19,
                  marginBottom: 5,
                  borderWidth: 0,
                  color: COLOR.PRIMARY,
                  backgroundColor: '#E6E6E6',
                }}
              />
            </View>
          </View>
          <View style={[styles.profileBtnInfo, styles.profileBtnInfoTwo]}>
            <View style={styles.formRow2}>
              <Text style={{fontWeight: '400', fontSize: 14, color: '#59499E'}}>
                DOB
              </Text>
              <DatePicker
                mode="date"
                modal
                open={open}
                date={date}
                onConfirm={date => {
                  setOpen(false);
                  setDate(date);
                  setDisplayDate(date.toISOString());
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
              <TouchableOpacity
                onPress={() => setOpen(true)}
                style={{
                  height: hp(7),
                  borderRadius: 10,
                  justifyContent: 'space-between',
                  backgroundColor: '#E6E6E6',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: wp(2),
                }}>
                <Text>
                  {displayDate ? displayDate.substr(0, 10) : 'NO DATE'}
                </Text>
                <Image
                  source={require('../../../../assets/images/blackdrop.png')}
                  style={{backgroundColor: '#E6E6E6'}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TextInputComp
          placeholder="Enter id card number"
          value={nationalCard}
          onChangeText={e => setNationalCard(e)}
          title="ID card"
        />

        <IDCardUpload
          frontIdImage={frontIdImage}
          backIdImage={backIdImage}
          getPhotoForFront={getPhotoForFront}
          getPhotoForBack={getPhotoForBack}
          removeFrontIdImage={removeFrontIdImage}
          removeBackIdImage={removeBackIdImage}
        />

        <SelfieUpload
          getPhotoFromGallery1={getPhotoFromGallery1}
          imageForShowSelfi={imageForShowSelfi}
          removeImage1={removeImage1}
        />
      </View>
    </>
  );
}
