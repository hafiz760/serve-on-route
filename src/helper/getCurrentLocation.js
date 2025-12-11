import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export const getUserCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position.coords.heading,
        };

        resolve(coords);
      },
      error => {
        reject(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  });
};

export const locationPermission = () =>
  new Promise(async (resolve, reject) => {
    if (Platform.OS === 'ios') {
      try {
        const permissionStatus = await Geolocation.requestAuthorization(
          'whenInUse',
        );
        if (permissionStatus === 'granted') {
          return resolve('granted');
        }
        reject('permission not granted');
      } catch (err) {
        return reject(err);
      }
    }

    return PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ])
      .then(result => {
        const fine = result['android.permission.ACCESS_FINE_LOCATION'];
        const coarse = result['android.permission.ACCESS_COARSE_LOCATION'];

        if (fine === 'granted' || coarse === 'granted') {
          return resolve('granted');
        }

        return reject('Location Permission denied');
      })
      .catch(err => {
        console.log('Ask location permission error');
        return reject(err);
      });
  });
