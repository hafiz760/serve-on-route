import React from 'react';
import {
  View,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Text, Icon} from '../../../component/Basic';
import {Button} from '../../../component/Form';
import DatePicker from 'react-native-date-picker';
import TextInputComp from '../../../component/TextInputComp';
import DropDownPicker from 'react-native-dropdown-picker';
import {COLOR, FAMILY, SIZE} from '../../../theme/typography';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import styles from './styles';

export default function ProfileTab({
  profile,
  profileHttp,
  name,
  setName,
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
  drivingLiscence,
  setDrivingLiscence,
  frontLicenseImage,
  backLicenseImage,
  getPhotoForFrontLicense,
  getPhotoForBackLicense,
  removeFrontLicenseImage,
  removeBackLicenseImage,
  carname,
  SetCarName,
  carnumber,
  SetCarNumber,
  getPhotoFromGallery,
  imageForShow,
  removeImage,
  submit,
  UploadData,
  setProfile,
}) {
  return (
    <SafeAreaView style={{width: '100%', height: '79%'}}>
      <View style={{alignSelf: 'center', alignItems: 'center'}}>
        <View style={styles.avatarImg}>
          <Image
            source={{
              uri:
                profile?.uri ||
                profileHttp ||
                'https://images.pexels.com/photos/736716/pexels-photo-736716.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
            }}
            style={styles.profileImg}
          />
          <Button
            style={styles.iconDetail}
            onPress={() => {
              UploadData(setProfile);
            }}>
            <Icon name="pencil" type="EvilIcons" style={[{fontSize: 24, color: '#666'}]} />
          </Button>
        </View>
        <Text style={{color: '#59499E', fontFamily: FAMILY.BOLD, fontSize: SIZE.SIZE_18}}>
          {name}
        </Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <ScrollView>
          <PersonalInfoSection
            name={name}
            setName={setName}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            itemsType={itemsType}
            setItemsType={setItemsType}
            items={items}
            setItems={setItems}
            openModel={openModel}
            setOpenModel={setOpenModel}
            date={date}
            setDate={setDate}
            open={open}
            setOpen={setOpen}
            displayDate={displayDate}
            setDisplayDate={setDisplayDate}
            nationalCard={nationalCard}
            setNationalCard={setNationalCard}
            frontIdImage={frontIdImage}
            backIdImage={backIdImage}
            getPhotoForFront={getPhotoForFront}
            getPhotoForBack={getPhotoForBack}
            removeFrontIdImage={removeFrontIdImage}
            removeBackIdImage={removeBackIdImage}
            getPhotoFromGallery1={getPhotoFromGallery1}
            imageForShowSelfi={imageForShowSelfi}
            removeImage1={removeImage1}
          />

          <VehicleInfoSection
            drivingLiscence={drivingLiscence}
            setDrivingLiscence={setDrivingLiscence}
            frontLicenseImage={frontLicenseImage}
            backLicenseImage={backLicenseImage}
            getPhotoForFrontLicense={getPhotoForFrontLicense}
            getPhotoForBackLicense={getPhotoForBackLicense}
            removeFrontLicenseImage={removeFrontLicenseImage}
            removeBackLicenseImage={removeBackLicenseImage}
            carname={carname}
            SetCarName={SetCarName}
            carnumber={carnumber}
            SetCarNumber={SetCarNumber}
            getPhotoFromGallery={getPhotoFromGallery}
            imageForShow={imageForShow}
            removeImage={removeImage}
          />

          <Button style={[styles.uploadbtn2, {marginBottom: hp(6), bottom: 0}]} onPress={submit}>
            <Text style={styles.saveBtnText2}>SAVE</Text>
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
