import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import {Icon} from '../../../../component/Basic';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import styles from '../styles';

export default function CarPicturesUpload({
  getPhotoFromGallery,
  imageForShow,
  removeImage,
}) {
  return (
    <>
      <View>
        <Text style={{fontWeight: '400', fontSize: 14, color: '#59499E'}}>
          Car Pictures
        </Text>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: hp(7),
            backgroundColor: '#E6E6E6',
            alignItems: 'center',
            borderRadius: 10,
            paddingHorizontal: wp(5),
          }}
          onPress={() => {
            getPhotoFromGallery();
          }}>
          <Text style={{color: '#59499E99'}}>Upload car Pictures</Text>
          <Image
            source={require('../../../../assets/images/upload.png')}
            style={{}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={{flexDirection: 'row'}}>
        {imageForShow.map((item, index) => (
          <View key={index}>
            <ImageBackground
              source={{
                uri:
                  item?.uri ||
                  'https://cdn.pixabay.com/photo/2016/01/10/22/07/beauty-1132617__340.jpg',
              }}
              style={{width: 100, height: 100, margin: 5}}
              imageStyle={{borderRadius: 10}}>
              <TouchableOpacity
                style={styles.crossView}
                onPress={() => removeImage(item, index)}>
                <Icon
                  name={'x'}
                  type="Feather"
                  style={styles.icon}
                  COLOR={'red'}
                />
              </TouchableOpacity>
            </ImageBackground>
          </View>
        ))}
      </View>
    </>
  );
}
