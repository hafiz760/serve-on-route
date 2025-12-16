import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Text, Icon} from '../../../../component/Basic';
import {COLOR, FAMILY, SIZE} from '../../../../theme/typography';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import styles from '../styles';
import PersonalInfoSection from './PersonalInfoSection';
import VehicleInfoSection from './VehicleInfoSection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fetchDriverById,
  updateDriverProfile,
} from '../../../../services/apicalls/driver';
import {showMessage} from '../../../../helper/showAlert';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import AppSpinner from '../../../../component/AppSpinner';
import {Button} from '../../../../component/Form';

export default function ProfileTab() {
  const [profile, setProfile] = useState();
  const [profileHttp, setProfileHttp] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [vehicalNumber, setVehicalNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [drivingLiscence, setDrivingLiscence] = useState('');
  const [carname, SetCarName] = useState();
  const [carnumber, SetCarNumber] = useState();
  const [nationalCard, setNationalCard] = useState();
  const [images, setImages] = useState();
  const [imageForShow, setImageForShow] = useState([]);
  const [imagesSelfi, setImagesSelfi] = useState();
  const [imageForShowSelfi, setImageForShowSelfi] = useState([]);
  const [license, setLicense] = useState('');
  const [date, setDate] = useState(new Date());
  const [displayDate, setDisplayDate] = useState('');
  const [isDateExist, setIsDateExist] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openModel, setOpenModel] = useState(false);
  const [items, setItems] = useState([
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
  ]);
  const [itemsType, setItemsType] = useState('Male');
  const [frontIdImage, setFrontIdImage] = useState(null);
  const [backIdImage, setBackIdImage] = useState(null);
  const [frontLicenseImage, setFrontLicenseImage] = useState(null);
  const [backLicenseImage, setBackLicenseImage] = useState(null);

  const removeFrontIdImage = () => setFrontIdImage(null);
  const removeBackIdImage = () => setBackIdImage(null);
  const removeFrontLicenseImage = () => setFrontLicenseImage(null);
  const removeBackLicenseImage = () => setBackLicenseImage(null);

  const getPhotoForFront = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(async image => {
        const format = {
          name: image.path.split('/').pop(),
          height: image.height,
          width: image.width,
          size: 400,
          type: image.mime,
          uri: image.path,
        };
        setFrontIdImage(format);
      })
      .catch(e => console.log(e));
  };
  const getPhotoForBack = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(async image => {
        const format = {
          name: image.path.split('/').pop(),
          height: image.height,
          width: image.width,
          size: 400,
          type: image.mime,
          uri: image.path,
        };
        setBackIdImage(format);
      })
      .catch(e => console.log(e));
  };

  const getPhotoForFrontLicense = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(async image => {
        const format = {
          name: image.path.split('/').pop(),
          height: image.height,
          width: image.width,
          size: 400,
          type: image.mime,
          uri: image.path,
        };
        setFrontLicenseImage(format);
      })
      .catch(e => console.log(e));
  };
  const getPhotoForBackLicense = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(async image => {
        const format = {
          name: image.path.split('/').pop(),
          height: image.height,
          width: image.width,
          size: 400,
          type: image.mime,
          uri: image.path,
        };
        setBackLicenseImage(format);
      })
      .catch(e => console.log(e));
  };

  const UploadData = async setPath => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('res data', res[0]);
      setPath(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };

  const removeImage = (idToRemove, index) => {
    const updatedImageData = imageForShow.filter(item => item !== idToRemove);
    console.log('0000', updatedImageData);
    setImageForShow(updatedImageData);
  };
  const removeImage1 = (idToRemove, index) => {
    const updatedImageData = imageForShowSelfi.filter(
      item => item !== idToRemove,
    );
    setImageForShowSelfi(updatedImageData);
  };

  const sanitizeValue = val => {
    if (!val || typeof val !== 'string') return '';
    const cleaned = val.trim().toLowerCase();
    const invalids = ['string', 'undefined', 'null', 'n/a', 'na', 'none'];
    return invalids.includes(cleaned) ? '' : val;
  };

  const getData = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem('response');
      const datas = JSON.parse(data);

      const res = await fetchDriverById(datas._id, datas.access_token);

      console.log(res, 'res GetData');

      if (res.success) {
        const userData = res.data;

        setName(sanitizeValue(userData.first_name));
        setLastName(sanitizeValue(userData.last_name));
        SetCarNumber(userData?.vehicle_no || '');
        setDrivingLiscence(userData.license_id || '');
        setProfile(sanitizeValue(userData.cover_image));
        setVehicalNumber(sanitizeValue(userData.vehicle_no));
        setFrontIdImage(userData?.driving_license?.[0] || null);
        setBackIdImage(userData?.driving_license?.[1] || null);
        setFrontLicenseImage(userData?.ID_file?.[0] || null);
        setBackLicenseImage(userData?.ID_file?.[1] || null);
        SetCarName(sanitizeValue(userData.car_name));
        setLicense(userData?.driving_license?.[0] || null);
        setDisplayDate(sanitizeValue(userData.driving_license_expiry));

        if (userData?.car_picture) {
          setImageForShow([
            {
              uri: userData.car_picture,
              type: 'image/jpeg',
              name: 'car_image.jpg',
            },
          ]);
        }

        if (
          userData?.driving_license_expiry &&
          sanitizeValue(userData.driving_license_expiry)
        ) {
          setIsDateExist(true);
        }

        setPhoneNumber(sanitizeValue(userData.phone));
        setProfileHttp(sanitizeValue(userData.avatar));
        setEmail(sanitizeValue(userData.email));
        setNationalCard(sanitizeValue(userData.ID));
      } else {
        console.log('Failed to fetch driver data:', res.message);
      }
    } catch (err) {
      console.log('Get data account error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
        size: 400,
        type: image.mime,
        uri: image?.path,
      };
      setImageForShow(pre => {
        return [...pre, format];
      });
      setImages(format);
      console.log(format);
    });
  };
  const getPhotoFromCamera1 = () => {
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
        size: 400,
        type: image.mime,
        uri: image?.path,
      };
      setImageForShowSelfi(pre => {
        return [...pre, format];
      });
      setImagesSelfi(format);
      console.log(format);
    });
  };

  const getPhotoFromGallery = () => {
    if (imageForShow.length >= 3) {
      showMessage('error', "You can't uploaded more than three images");
    } else {
      getPhotoFromCamera();
    }
  };
  const getPhotoFromGallery1 = () => {
    if (imageForShowSelfi.length >= 1) {
      showMessage('error', "You can't uploaded more than one images");
    } else {
      getPhotoFromCamera1();
    }
  };

  const submit = async () => {
    setLoading(true);
    console.log(
      name,
      email,
      drivingLiscence,
      phoneNumber,
      profile,
      nationalCard,
      frontIdImage,
      backIdImage,
      frontLicenseImage,
      backLicenseImage,
    );
    try {
      const sanitize = v => (v && typeof v === 'string' ? v.trim() : v || '');

      const requiredFields = {
        firstName: sanitize(name),
        lastName: sanitize(lastName),
        phoneNumber: sanitize(phoneNumber),
        gender: sanitize(itemsType),
        nationalCard: sanitize(nationalCard),
        carNumber: sanitize(carnumber),
        carName: sanitize(carname),
        drivingLiscence: sanitize(drivingLiscence),
        displayDate: sanitize(displayDate),
      };
      for (const [key, value] of Object.entries(requiredFields)) {
        if (!value) {
          showMessage(
            'error',
            `Please fill in ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          );
          setLoading(false);
          return;
        }
      }
      if (!frontIdImage || !backIdImage) {
        showMessage(
          'error',
          'Please upload both front and back ID card images',
        );
        setLoading(false);
        return;
      }

      if (!frontLicenseImage || !backLicenseImage) {
        showMessage(
          'error',
          'Please upload both front and back driving license images',
        );
        setLoading(false);
        return;
      }
      if (!profile) {
        showMessage('error', 'Please upload your profile image');
        setLoading(false);
        return;
      }
      const data = await AsyncStorage.getItem('response');
      const datas = JSON.parse(data);
      const formData = new FormData();
      formData.append('first_name', name);
      formData.append('last_name', lastName);
      formData.append('email', email);
      formData.append('phone', phoneNumber);
      formData.append('vehicle_no', carnumber);
      formData.append('car_name', carname);
      formData.append('gender', itemsType);
      formData.append('license_id', drivingLiscence);
      formData.append('driving_license_expiry', displayDate);
      formData.append('ID', nationalCard);
      if (profile?.uri) {
        formData.append('avatar_file', {
          uri: profile.uri,
          type: profile.type || 'image/jpeg',
          name: profile.name || 'avatar.jpg',
        });
        formData.append('cover_image_file', {
          uri: profile.uri,
          type: profile.type || 'image/jpeg',
          name: profile.name || 'cover.jpg',
        });
      }

      if (frontIdImage) {
        formData.append('national_ID_file', {
          uri: frontIdImage.uri || frontIdImage,
          type: frontIdImage.type || 'image/jpeg',
          name: frontIdImage.name || 'front_id.jpg',
        });
      }
      if (backIdImage) {
        formData.append('national_ID_file', {
          uri: backIdImage.uri || backIdImage,
          type: backIdImage.type || 'image/jpeg',
          name: backIdImage.name || 'back_id.jpg',
        });
      }

      if (frontLicenseImage) {
        formData.append('driving_license_file', {
          uri: frontLicenseImage.uri || frontLicenseImage,
          type: frontLicenseImage.type || 'image/jpeg',
          name: frontLicenseImage.name || 'front_license.jpg',
        });
      }
      if (backLicenseImage) {
        formData.append('driving_license_file', {
          uri: backLicenseImage.uri || backLicenseImage,
          type: backLicenseImage.type || 'image/jpeg',
          name: backLicenseImage.name || 'back_license.jpg',
        });
      }

      if (imageForShow?.length > 0) {
        imageForShow.forEach((img, index) => {
          formData.append('car_picture_file', {
            uri: img.uri,
            type: img.type || 'image/jpeg',
            name: img.name || `car_${index}.jpg`,
          });
        });
      }

      console.log('FormData:', formData);

      const result = await updateDriverProfile(formData, datas.access_token);
      console.log('update result', result);

      if (result.success) {
        getData();
        showMessage('success', 'Profile Updated Successfully');
        AsyncStorage.setItem('userName', name);
        AsyncStorage.setItem('coverImage', JSON.stringify(profile));
      } else {
        showMessage('error', result?.message || 'Update failed');
      }
    } catch (err) {
      console.log('ERROR', err);
      showMessage('error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <View style={styles.loaderContainerStyles}>
      <AppSpinner size="large" color={COLOR.PRIMARY} />
    </View>
  ) : (
    <SafeAreaView style={{width: '100%', height: '79%'}}>
      <View style={{alignSelf: 'center', alignItems: 'center'}}>
        <View style={styles.avatarImg}>
          <Image
            source={
              profile?.uri || profileHttp
                ? {uri: profile?.uri || profileHttp}
                : require('../../../../assets/images/dummyProfile.jpg')
            }
            style={styles.profileImg}
          />
          <Button
            style={styles.iconDetail}
            onPress={() => {
              UploadData(setProfile);
            }}>
            <Icon
              name="pencil"
              type="EvilIcons"
              style={[{fontSize: 24, color: '#666'}]}
            />
          </Button>
        </View>
        <Text
          style={{
            color: '#59499E',
            fontFamily: FAMILY.BOLD,
            fontSize: SIZE.SIZE_18,
          }}>
          {name}
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView>
          <PersonalInfoSection
            name={name}
            setName={setName}
            lastName={lastName}
            setLastName={setLastName}
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

          <Button
            style={[styles.uploadbtn2, {marginBottom: hp(6), bottom: 0}]}
            onPress={submit}>
            <Text style={styles.saveBtnText2}>SAVE</Text>
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
