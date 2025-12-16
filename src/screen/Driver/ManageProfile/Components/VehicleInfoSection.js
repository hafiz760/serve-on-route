import React from 'react';
import {View, Text} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {FAMILY, SIZE} from '../../../../theme/typography';
import LicenseUpload from './LicenseUpload';
import CarPicturesUpload from './CarPicturesUpload';
import TextInputComp from '../../../../component/TextInputComp';

export default function VehicleInfoSection({
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
}) {
  return (
    <>
      <View style={{width: wp(90), alignSelf: 'center'}}>
        <Text
          style={{
            color: '#59499E',
            fontFamily: FAMILY.BOLD,
            fontSize: SIZE.SIZE_18,
            marginTop: hp(2),
            marginBottom: hp(2),
          }}>
          Vehicle information
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
          placeholder="Enter license number"
          value={drivingLiscence}
          onChangeText={e => setDrivingLiscence(e)}
          title="License"
        />

        <LicenseUpload
          frontLicenseImage={frontLicenseImage}
          backLicenseImage={backLicenseImage}
          getPhotoForFrontLicense={getPhotoForFrontLicense}
          getPhotoForBackLicense={getPhotoForBackLicense}
          removeFrontLicenseImage={removeFrontLicenseImage}
          removeBackLicenseImage={removeBackLicenseImage}
        />

        <TextInputComp
          placeholder="Enter car name"
          value={carname}
          onChangeText={e => SetCarName(e, 'name')}
          title="Car Name"
        />

        <TextInputComp
          placeholder="Enter car number"
          value={carnumber}
          onChangeText={e => SetCarNumber(e)}
          title="Car Number"
        />

        <CarPicturesUpload
          getPhotoFromGallery={getPhotoFromGallery}
          imageForShow={imageForShow}
          removeImage={removeImage}
        />
      </View>
    </>
  );
}
