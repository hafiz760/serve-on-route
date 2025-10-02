import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Container, Content, Text, Icon} from '../../../component/Basic';
import {DarkStatusBar} from '../../../component/StatusBar';
import {Button} from '../../../component/Form';
import styles from './styles';
import MapView, {Marker, AnimatedRegion} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';
import Header from '../../../component/Header';
import {locationPermission} from '../../../helper/getCurrentLocation';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
// import { GOOGLE_MAPS_KEY } from "@env"
import {BASE_URL, GOOGLE_MAPS_KEY, URL_V} from '../../../utilities/helper';
import {navigate} from '../../../navigations';
import axios from 'axios';
import { updateUser } from '../../../store/reducers/session';
// const GOOGLE_MAPS_APIKEY = "AIzaSyATpSrcISxeRrwW8iTnB2j_C8UNR7Dv4f8";
const GOOGLE_MAPS_APIKEY = GOOGLE_MAPS_KEY;
// console.log('GOOGLE_MAPS_APIKEY>>>>>>', GOOGLE_MAPS_APIKEY);
// navigator.geolocation = require('react-native-geolocation-service');
navigator.geolocation = require('@react-native-community/geolocation');

Geocoder.init(GOOGLE_MAPS_APIKEY);
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function Home(params) {
  const user = useSelector((state) => state.session.user);
  console.log("user on home",JSON.stringify(user,null,2));
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {socket} = useSelector(state => state.socket);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const pickupRef = useRef(null);
  const droplocationRef = useRef(null);
  const [state, setState] = useState({
    pickupCords: params?.route?.params?.mydata
      ? params.route?.params?.mydata.pickupCords
      : {},
    droplocationCords: params?.route?.params?.mydata
      ? params?.route?.params?.mydata.droplocationCords
      : {},
    isLoading: false,
    coordinate: new AnimatedRegion({
      latitude: 31.5204,
      longitude: 74.3587,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
    heading: 0,
  });
  const [temporaryPickUpCords, setTemporaryPickUpCords] = useState({});

  const {pickupCords, droplocationCords, coordinate} = state;

  const defaultLocation = {
    latitude: 31.522592971963892,
    latitudeDelta: 0.039999248406068943,
    longitude: 74.35437122359872,
    longitudeDelta: 0.05085300654172897,
  };
  useEffect;
  const handleNavigation = () => {
    if (
      Object.values(state.pickupCords).length > 0 &&
      Object.values(state.droplocationCords).length > 0
    ) {
      navigate('CustomerSelectVehicle', {
        to: state.droplocationCords,
        form: state.pickupCords,
      });
    } else {
      alert('Please Fill the Start and Destination Location');
    }
  };

  const handleReverseGeocoding = async (lat, lng) => {
    try {
      const result = await Geocoder.from(lat, lng);
      const address = result?.results[0]?.formatted_address;

      return address;
    } catch (err) {
      throw err;
    }
  };

  const askForLocationPermission = async () => {
    try {
      const resp = await locationPermission();
    } catch (err) {}
  };

  const showClearInputButton = clearInput => {
    return (
      <Icon
        name="ios-close-circle-outline"
        type="Ionicons"
        style={styles.closeIconStyles}
        onPress={clearInput}
      />
    );
  };

  const handleClearPickupInput = () => {
    pickupRef?.current?.setAddressText('');
    droplocationRef?.current?.setAddressText('');
    setState({
      ...state,
      pickupCords: {},
      droplocationCords: {},
    });
  };

  const handleRegionChangeComplete = async () => {
    try {
      if (!temporaryPickUpCords?.latitude) {
        const temporaryPickUpCords = {
          ...defaultLocation,
        };
        const returnedAddress = await handleReverseGeocoding(
          temporaryPickUpCords?.latitude,
          temporaryPickUpCords?.longitude,
        );
        temporaryPickUpCords.locationName = returnedAddress;

        pickupRef.current?.setAddressText(temporaryPickUpCords.locationName);
        pickupRef.current?.blur();
        setState({
          ...state,
          pickupCords: temporaryPickUpCords,
        });
      } else {
        const temporaryPickUpCordsObj = {
          ...temporaryPickUpCords,
        };
        const returnedAddress = await handleReverseGeocoding(
          temporaryPickUpCordsObj?.latitude,
          temporaryPickUpCordsObj?.longitude,
        );
        temporaryPickUpCordsObj.locationName = returnedAddress;

        pickupRef.current?.setAddressText(temporaryPickUpCordsObj.locationName);
        pickupRef.current?.blur();
        setState({
          ...state,
          pickupCords: temporaryPickUpCordsObj,
        });
      }
    } catch (err) {
      alert(
        'Something went wrong while setting location through on region complete!',
      );
    }
  };

  useEffect(() => {
    askForLocationPermission();
    if (
      params?.route?.params?.mydata &&
      params?.route?.params?.mydata.pickupCords &&
      params &&
      params?.route?.params?.mydata.droplocationCords
    ) {
      pickupRef.current?.setAddressText(
        params.route?.params?.mydata.pickupCords?.locationName,
      );
      droplocationRef?.current?.setAddressText(
        params.route?.params?.mydata.droplocationCords?.locationName,
      );
    }
  }, []);

  useEffect(() => {
    handleClearPickupInput();
    if (isFocused) {
    }
  }, [isFocused]);


  return (
    <Container>
      <DarkStatusBar />
      <Header leftType="menu" title={'Serve On Route'} />
      <Content>
        <View style={styles.homeContainer}>
          <View style={styles.formRow}>
            <Icon name="dot-circle-o" type="FontAwesome" />
            <GooglePlacesAutocomplete

              nearbyPlacesAPI="None"
              ref={pickupRef}
              onFail={(error) => console.log(error)}
              placeholder="Pickup location"
              textInputProps={{
                placeholderTextColor: "#59499E",
                returnKeyType: "search",
                // value: pickupCords.locationName || "",
              }}
              styles={{
                textInput: {
                  color: "black",
                },
                listView: {
                  color: "black",
                },
                description: {
                  color: "black",
                },
                predefinedPlacesDescription: {
                  color: "black",
                },

              }}
              currentLocation
              currentLocationLabel="Current location"
              onPress={async (data, details = null) => {
                let coords = {
                  latitude: details?.geometry?.location?.lat,
                  longitude: details?.geometry?.location?.lng,
                  locationName: data?.structured_formatting?.main_text,
                };

                if (!coords?.locationName) {
                  const returnedAddress = await handleReverseGeocoding(
                    coords?.latitude,
                    coords?.longitude
                  );

                  coords.locationName = returnedAddress;
                  pickupRef.current?.setAddressText(coords.locationName);
                  pickupRef.current?.blur();
                }
                setState({
                  ...state,
                  pickupCords: coords,
                });
              }}
              query={{
                key: GOOGLE_MAPS_APIKEY,
                language: "en",
              }}
              minLength={2}
              GooglePlacesDetailsQuery={{ fields: "geometry" }}
              autoFocus={false}
              returnKeyType={"default"}
              fetchDetails={true}
              enablePoweredByContainer={false}
              renderRightButton={() => {
                return pickupRef?.current?.getAddressText() &&
                  state.pickupCords?.latitude
                  ? showClearInputButton(handleClearPickupInput)
                  : null;
              }}
            />
          </View>

          <View style={styles.formRow2}>
            <Icon name="map-marker" type="MaterialCommunityIcons" />
            <GooglePlacesAutocomplete
              nearbyPlacesAPI="None"
              ref={droplocationRef}
              placeholder="Drop location"
              textInputProps={{
                placeholderTextColor: '#59499E',
                returnKeyType: 'search',
                // value: droplocationCords.locationName || "",
              }}
              styles={{
                textInput: {
                  color: 'black',
                },
                listView: {
                  color: 'black',
                },
                description: {
                  color: 'black',
                },
                predefinedPlacesDescription: {
                  color: 'black',
                },
              }}
              currentLocation
              currentLocationLabel="Current location"
              onPress={async (data, details = null) => {
                let coords = {
                  latitude: details?.geometry?.location?.lat,
                  longitude: details?.geometry?.location?.lng,
                  locationName: data?.structured_formatting?.main_text,
                };

                if (!coords?.locationName) {
                  const returnedAddress = await handleReverseGeocoding(
                    coords?.latitude,
                    coords?.longitude,
                  );

                  coords.locationName = returnedAddress;
                  droplocationRef.current?.setAddressText(coords.locationName);
                  droplocationRef.current?.blur();
                }

                setState({
                  ...state,
                  droplocationCords: coords,
                });
                // moveTo(test)
              }}
              query={{
                key: GOOGLE_MAPS_APIKEY,
                language: 'en',
              }}
              minLength={2}
              GooglePlacesDetailsQuery={{fields: 'geometry'}}
              autoFocus={false}
              returnKeyType={'default'}
              fetchDetails={true}
              enablePoweredByContainer={false}
            />
          </View>

          <View style={styles.mMap}>
            <MapView
              ref={mapRef}
              // style={[StyleSheet.absoluteFill, { elevation: -1 }]}
              style={{flex: 1}}
              initialRegion={defaultLocation}
              region={
                Object.values(pickupCords).length > 0
                  ? {
                      latitudeDelta: LATITUDE_DELTA,
                      longitudeDelta: LONGITUDE_DELTA,
                      ...pickupCords,
                    }
                  : null
              }
              onRegionChangeComplete={async (coords, {isGesture}) => {
                if (isGesture && !pickupCords?.latitude) {
                  setTemporaryPickUpCords(coords);
                }
              }}
              scrollEnabled={
                !pickupCords?.latitude && !droplocationCords?.latitude
              }>
              {pickupCords?.latitude && (
                <Marker
                  coordinate={pickupCords}
                  draggable
                  onDragStart={() => {
                    mapRef.current.setNativeProps({scrollEnabled: false});
                  }}
                  onDragEnd={async e => {
                    const newCoordinate = e.nativeEvent.coordinate;
                    const newLocationName = await handleReverseGeocoding(
                      newCoordinate.latitude,
                      newCoordinate.longitude,
                    );

                    setState({
                      ...state,
                      pickupCords: {
                        latitude: newCoordinate.latitude,
                        longitude: newCoordinate.longitude,
                        locationName: newLocationName,
                      },
                    });

                    // Update the autocomplete input with the new address
                    pickupRef.current?.setAddressText(newLocationName);

                    mapRef.current.setNativeProps({scrollEnabled: true});
                  }}>
                  <Image
                    source={require('../../../assets/images/Oval2x.png')}
                    style={{width: 44, height: 44}}
                  />
                </Marker>
              )}
              {droplocationCords?.latitude && (
                <Marker
                  coordinate={droplocationCords}
                  draggable
                  onDragStart={() => {
                    mapRef.current.setNativeProps({scrollEnabled: false});
                  }}
                  onDragEnd={async e => {
                    const newCoordinate = e.nativeEvent.coordinate;
                    const newLocationName = await handleReverseGeocoding(
                      newCoordinate.latitude,
                      newCoordinate.longitude,
                    );

                    setState({
                      ...state,
                      droplocationCords: {
                        latitude: newCoordinate.latitude,
                        longitude: newCoordinate.longitude,
                        locationName: newLocationName,
                      },
                    });

                    // Update the autocomplete input with the new address
                    droplocationRef.current?.setAddressText(newLocationName);

                    mapRef.current.setNativeProps({scrollEnabled: true});
                  }}>
                  <Image
                    source={require('../../../assets/images/greenMarker2x.png')}
                    style={{width: 30, height: 30}}
                  />
                </Marker>
              )}
              {pickupCords?.latitude && droplocationCords?.latitude && (
                <MapViewDirections
                  origin={pickupCords}
                  destination={droplocationCords}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeWidth={6}
                  strokeColor="hotpink"
                  optimizeWaypoints={true}
                  onReady={result => {
                    mapRef.current.fitToCoordinates(result.coordinates);
                  }}
                />
              )}
            </MapView>

            {!state?.pickupCords?.latitude && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  style={styles.marker}
                  source={require('../../../assets/images/pinpoint.png')}
                />
              </View>
            )}
          </View>
        </View>
      </Content>
      <View style={styles.footerBtn}>
        <View style={styles.footerBtnInfo}>
          <Button
            style={styles.selectBtn}
            onPress={() => {
              handleNavigation();
              // navigate('CustomerSelectVehicle', {
              //   to: state.droplocationCords,
              //   form: state.pickupCords,
              // });
            }}>
            <Text style={styles.shareBtnText}>Next</Text>
          </Button>
        </View>
      </View>
    </Container>
  );
}
