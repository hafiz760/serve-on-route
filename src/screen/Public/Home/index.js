import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { Container, Content, Text, Icon } from '../../../component/Basic';
import { DarkStatusBar } from '../../../component/StatusBar';
import { Button } from '../../../component/Form';
import styles from './styles';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';
import Header from '../../../component/Header';
import { locationPermission } from '../../../helper/getCurrentLocation';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { BASE_URL, GOOGLE_MAPS_KEY, URL_V } from '../../../utilities/helper';
import { navigate } from '../../../navigations';

const GOOGLE_MAPS_APIKEY = GOOGLE_MAPS_KEY;
navigator.geolocation = require('@react-native-community/geolocation');

Geocoder.init(GOOGLE_MAPS_APIKEY);
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const defaultLocation = {
  latitude: 31.522592971963892,
  latitudeDelta: 0.039999248406068943,
  longitude: 74.35437122359872,
  longitudeDelta: 0.05085300654172897,
};

export default function Home(params) {
  const user = useSelector(state => state.session.user);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const { socket } = useSelector(state => state.socket);

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const pickupRef = useRef(null);
  const droplocationRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const watchIdRef = useRef(null);

  const [pickupCords, setPickupCords] = useState(
    params?.route?.params?.mydata?.pickupCords || {},
  );
  const [droplocationCords, setDroplocationCords] = useState(
    params?.route?.params?.mydata?.droplocationCords || {},
  );
  const [temporaryPickUpCords, setTemporaryPickUpCords] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Memoized reverse geocoding with error handling
  const handleReverseGeocoding = useCallback(async (lat, lng) => {
    try {
      const result = await Geocoder.from(lat, lng);
      return result?.results[0]?.formatted_address || 'Unknown location';
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      return 'Unknown location';
    }
  }, []);

  // Ask for location permission once
  const askForLocationPermission = useCallback(async () => {
    try {
      const resp = await locationPermission();
      setPermissionGranted(true);
      return true;
    } catch (err) {
      console.error('Permission error:', err);
      setPermissionGranted(false);
      return false;
    }
  }, []);

  // Debounced region change handler
  const handleRegionChangeComplete = useCallback(
    async coords => {
      // Clear previous timeout
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce for 1 second
      debounceTimerRef.current = setTimeout(async () => {
        try {
          const coordsToUse = temporaryPickUpCords?.latitude
            ? temporaryPickUpCords
            : defaultLocation;

          const returnedAddress = await handleReverseGeocoding(
            coordsToUse.latitude,
            coordsToUse.longitude,
          );

          const newPickupCords = {
            ...coordsToUse,
            locationName: returnedAddress,
          };

          pickupRef.current?.setAddressText(newPickupCords.locationName);
          pickupRef.current?.blur();
          setPickupCords(newPickupCords);
        } catch (err) {
          Alert.alert('Error', 'Failed to set location');
          console.error(err);
        }
      }, 1000); // 1 second debounce
    },
    [temporaryPickUpCords, handleReverseGeocoding],
  );

  // Clear input handler
  const handleClearPickupInput = useCallback(() => {
    pickupRef?.current?.setAddressText('');
    droplocationRef?.current?.setAddressText('');
    setPickupCords({});
    setDroplocationCords({});
    setTemporaryPickUpCords({});
  }, []);

  // Show clear button
  const showClearInputButton = useCallback(
    clearInput => (
      <Icon
        name="ios-close-circle-outline"
        type="Ionicons"
        style={styles.closeIconStyles}
        onPress={clearInput}
      />
    ),
    [],
  );

  // Navigation handler
  const handleNavigation = useCallback(() => {
    if (
      Object.values(pickupCords).length > 0 &&
      Object.values(droplocationCords).length > 0
    ) {
      navigate('CustomerSelectVehicle', {
        to: droplocationCords,
        form: pickupCords,
      });
    } else {
      Alert.alert(
        'Missing Information',
        'Please fill start and destination location',
      );
    }
  }, [pickupCords, droplocationCords]);

  // Get current location handler
  const handleGetCurrentLocation = useCallback(() => {
    setIsLoading(true);
    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;

        const address = await handleReverseGeocoding(latitude, longitude);

        const newPickupCords = {
          latitude,
          longitude,
          locationName: address,
        };

        setPickupCords(newPickupCords);
        pickupRef.current?.setAddressText(address);

        mapRef.current?.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
          1000,
        );
        setIsLoading(false);
      },
      error => {
        console.error('Error getting current location:', error);
        Alert.alert(
          'Location Error',
          'Unable to fetch your location. Please enable GPS.',
        );
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }, [handleReverseGeocoding]);

  // Marker drag end handler for pickup
  const handlePickupMarkerDragEnd = useCallback(
    async e => {
      const newCoordinate = e.nativeEvent.coordinate;
      const newLocationName = await handleReverseGeocoding(
        newCoordinate.latitude,
        newCoordinate.longitude,
      );

      const newPickupCords = {
        latitude: newCoordinate.latitude,
        longitude: newCoordinate.longitude,
        locationName: newLocationName,
      };

      setPickupCords(newPickupCords);
      pickupRef.current?.setAddressText(newLocationName);
      mapRef.current?.setNativeProps({ scrollEnabled: true });
    },
    [handleReverseGeocoding],
  );

  // Marker drag end handler for droplocation
  const handleDropMarkerDragEnd = useCallback(
    async e => {
      const newCoordinate = e.nativeEvent.coordinate;
      const newLocationName = await handleReverseGeocoding(
        newCoordinate.latitude,
        newCoordinate.longitude,
      );

      const newDropCords = {
        latitude: newCoordinate.latitude,
        longitude: newCoordinate.longitude,
        locationName: newLocationName,
      };

      setDroplocationCords(newDropCords);
      droplocationRef.current?.setAddressText(newLocationName);
      mapRef.current?.setNativeProps({ scrollEnabled: true });
    },
    [handleReverseGeocoding],
  );

  // Initialize on mount
  useEffect(() => {
    askForLocationPermission();

    // Set initial addresses if coming from navigation params
    if (params?.route?.params?.mydata) {
      const { pickupCords: pickup, droplocationCords: drop } =
        params.route.params.mydata;

      if (pickup?.locationName) {
        pickupRef.current?.setAddressText(pickup.locationName);
      }
      if (drop?.locationName) {
        droplocationRef.current?.setAddressText(drop.locationName);
      }
    }

    // ref values ko local vars me copy karo
    const debounceTimer = debounceTimerRef.current;
    const watchId = watchIdRef.current;

    // Cleanup on unmount
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      if (watchId) {
        Geolocation.clearWatch(watchId);
      }
    };
    // sirf static dependencies: askForLocationPermission, params
  }, [askForLocationPermission, params]);


  // Clear inputs when screen loses focus
  useEffect(() => {
    if (!isFocused) {
      handleClearPickupInput();
    }
  }, [isFocused, handleClearPickupInput]);

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
              onFail={error =>
                console.error('Pickup autocomplete error:', error)
              }
              placeholder="Pickup location"
              textInputProps={{
                placeholderTextColor: '#59499E',
                returnKeyType: 'search',
              }}
              styles={{
                textInput: { color: 'black' },
                listView: { color: 'black' },
                description: { color: 'black' },
                predefinedPlacesDescription: { color: 'black' },
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
                  pickupRef.current?.setAddressText(coords.locationName);
                  pickupRef.current?.blur();
                }

                setPickupCords(coords);
                mapRef.current?.animateToRegion(
                  {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                  },
                  1000,
                );
              }}
              query={{
                key: GOOGLE_MAPS_APIKEY,
                language: 'en',
              }}
              minLength={2}
              GooglePlacesDetailsQuery={{ fields: 'geometry' }}
              autoFocus={false}
              returnKeyType={'default'}
              fetchDetails={true}
              enablePoweredByContainer={false}
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
              }}
              styles={{
                textInput: { color: 'black' },
                listView: { color: 'black' },
                description: { color: 'black' },
                predefinedPlacesDescription: { color: 'black' },
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

                setDroplocationCords(coords);
              }}
              query={{
                key: GOOGLE_MAPS_APIKEY,
                language: 'en',
              }}
              minLength={2}
              GooglePlacesDetailsQuery={{ fields: 'geometry' }}
              autoFocus={false}
              returnKeyType={'default'}
              fetchDetails={true}
              enablePoweredByContainer={false}
            />
          </View>

          <View style={styles.mMap}>
            <MapView
              ref={mapRef}
              style={{ flex: 1 }}
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
              onRegionChangeComplete={async (coords, { isGesture }) => {
                if (isGesture && !pickupCords?.latitude) {
                  setTemporaryPickUpCords(coords);
                  handleRegionChangeComplete(coords);
                }
              }}
              scrollEnabled={
                !pickupCords?.latitude && !droplocationCords?.latitude
              }>
              {pickupCords?.latitude && (
                <Marker
                  coordinate={pickupCords}
                  draggable
                  tracksViewChanges={false}
                  onDragStart={() => {
                    mapRef.current?.setNativeProps({ scrollEnabled: false });
                  }}
                  onDragEnd={handlePickupMarkerDragEnd}>
                  <Image
                    source={require('../../../assets/images/Oval2x.png')}
                    style={{ width: 44, height: 44 }}
                    resizeMode="contain"
                  />
                </Marker>
              )}
              {droplocationCords?.latitude && (
                <Marker
                  coordinate={droplocationCords}
                  draggable
                  tracksViewChanges={false}
                  onDragStart={() => {
                    mapRef.current?.setNativeProps({ scrollEnabled: false });
                  }}
                  onDragEnd={handleDropMarkerDragEnd}>
                  <Image
                    source={require('../../../assets/images/greenMarker2x.png')}
                    style={{ width: 30, height: 30 }}
                    resizeMode="contain"
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
                    mapRef.current?.fitToCoordinates(result.coordinates, {
                      edgePadding: {
                        top: 50,
                        right: 50,
                        bottom: 50,
                        left: 50,
                      },
                      animated: true,
                    });
                  }}
                />
              )}
            </MapView>

            {/* Current Location Button */}
            <TouchableOpacity
              style={
                styles.currentLocationButton || {
                  position: 'absolute',
                  bottom: 20,
                  right: 20,
                  backgroundColor: 'white',
                  borderRadius: 25,
                  padding: 12,
                  elevation: 5,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  alignItems: 'center',
                  justifyContent: 'center',
                }
              }
              onPress={handleGetCurrentLocation}
              disabled={isLoading}>
              <Text style={{ fontSize: 22 }}>{isLoading ? '⏳' : '📍'}</Text>
            </TouchableOpacity>

            {/* Center Marker when no pickup selected */}
            {!pickupCords?.latitude && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  pointerEvents: 'none',
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
          <Button style={styles.selectBtn} onPress={handleNavigation}>
            <Text style={styles.shareBtnText}>Next</Text>
          </Button>
        </View>
      </View>
    </Container>
  );
}
