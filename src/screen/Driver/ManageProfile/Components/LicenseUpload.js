import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {Icon} from '../../../../component/Basic';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function LicenseUpload({
  frontLicenseImage,
  backLicenseImage,
  getPhotoForFrontLicense,
  getPhotoForBackLicense,
  removeFrontLicenseImage,
  removeBackLicenseImage,
}) {
  return (
    <View style={{marginVertical: hp(2)}}>
      <Text
        style={{
          fontWeight: '400',
          fontSize: 14,
          color: '#59499E',
          marginBottom: 7,
        }}>
        License Pictures
      </Text>

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        {/* Front license */}
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: '#A3A3A3',
            borderStyle: 'dashed',
            borderRadius: 10,
            width: wp(40),
            height: hp(12),
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
          onPress={getPhotoForFrontLicense}>
          {frontLicenseImage ? (
            <>
              <Image
                source={{uri: frontLicenseImage.uri || frontLicenseImage}}
                style={{width: '100%', height: '100%'}}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={removeFrontLicenseImage}
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  width: 24,
                  height: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name="x"
                  type="Feather"
                  style={{fontSize: 16, color: 'red'}}
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Icon
                name="camera"
                type="Feather"
                style={{fontSize: 20, color: '#59499E'}}
              />
              <Text style={{color: '#59499E99', marginTop: 5}}>Front</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Back license */}
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: '#A3A3A3',
            borderStyle: 'dashed',
            borderRadius: 10,
            width: wp(40),
            height: hp(12),
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
          onPress={getPhotoForBackLicense}>
          {backLicenseImage ? (
            <>
              <Image
                source={{uri: backLicenseImage.uri || backLicenseImage}}
                style={{width: '100%', height: '100%'}}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={removeBackLicenseImage}
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  width: 24,
                  height: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name="x"
                  type="Feather"
                  style={{fontSize: 16, color: 'red'}}
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Icon
                name="camera"
                type="Feather"
                style={{fontSize: 20, color: '#59499E'}}
              />
              <Text style={{color: '#59499E99', marginTop: 5}}>Back</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
