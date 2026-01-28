import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {Container, Content, Text, Icon} from '../../../component/Basic';
import {DarkStatusBar} from '../../../component/StatusBar';
import styles from './styles';
import MapView, {Marker, AnimatedRegion, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import LocationAutocomplete from '../../../component/LocationAutocomplete';
import Geocoder from 'react-native-geocoding';
import {locationPermission} from '../../../helper/getCurrentLocation';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {GOOGLE_MAPS_KEY} from '../../../utilities/helper';
import {navigate, openDrawer} from '../../../navigations';

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
  const {socket} = useSelector(state => state.socket);

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
  const [region, setRegion] = useState({
    ...defaultLocation,
    ...params?.route?.params?.mydata?.pickupCords,
  });
  const [mapRefreshKey, setMapRefreshKey] = useState(0);
  const [temporaryPickUpCords, setTemporaryPickUpCords] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [tripDetails, setTripDetails] = useState({distance: 0, duration: 0});
  const [activeField, setActiveField] = useState(null); // NEW: Track active field
  
  useEffect(() => {
    if (pickupCords?.latitude || droplocationCords?.latitude) {
      setMapRefreshKey(prev => prev + 1);
      if (pickupCords?.latitude) {
        const newRegion = {
          latitude: Number(pickupCords.latitude),
          longitude: Number(pickupCords.longitude),
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        setRegion(newRegion);
        setTimeout(() => {
          mapRef.current?.animateToRegion(newRegion, 1000);
        }, 100);
      }
    }
  }, [pickupCords?.latitude, pickupCords?.longitude, droplocationCords?.latitude, droplocationCords?.longitude]);

  useEffect(() => {
    if (__DEV__) {
      console.log('DEBUG: API KEY:', GOOGLE_MAPS_APIKEY ? 'Present' : 'MISSING');
      console.log('DEBUG: Pickup:', pickupCords);
      console.log('DEBUG: Drop:', droplocationCords);
    }
  }, [pickupCords, droplocationCords]);

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
  const handleGetCurrentLocation = useCallback(
    async (forInput = false) => {
      setIsLoading(true);

      Geolocation.getCurrentPosition(
        async position => {
          try {
            const {latitude, longitude} = position.coords;

            const address = await handleReverseGeocoding(latitude, longitude);

            const newPickupCords = {
              latitude,
              longitude,
              locationName: address,
            };

            setPickupCords(newPickupCords);
            
            const newRegion = {
              latitude,
              longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            };
            setRegion(newRegion);
            
            // Add a small delay to ensure the autocomplete component has finished 
            // its internal state updates before we manually set the text
            setTimeout(() => {
              pickupRef.current?.setAddressText(address);
            }, 100);

            mapRef.current?.animateToRegion(newRegion, 1000);
          } catch (e) {
            console.error('Error handling location result:', e);
          } finally {
            setIsLoading(false);
          }
        },
        error => {
          console.error('Error getting current location:', error);

          // Different messages per error code
          if (error.code === 1) {
            // PERMISSION_DENIED
            Alert.alert(
              'Location Permission Required',
              'Please enable location permission in your device settings to use this feature.',
              [
                {text: 'Cancel', style: 'cancel'},
                {
                  text: 'Open Settings',
                  onPress: () => {
                    if (Platform.OS === 'ios') {
                      Linking.openURL('app-settings:');
                    } else {
                      Linking.sendIntent(
                        'android.settings.LOCATION_SOURCE_SETTINGS',
                      );
                    }
                  },
                },
              ],
            );
          } else if (error.code === 2) {
            // POSITION_UNAVAILABLE - Location services might be off
            Alert.alert(
              'Location Services Disabled',
              'Please turn on location services in your device settings.',
              [
                {text: 'Cancel', style: 'cancel'},
                {
                  text: 'Open Settings',
                  onPress: () => {
                    if (Platform.OS === 'ios') {
                      Linking.openURL('app-settings:');
                    } else {
                      Linking.sendIntent(
                        'android.settings.LOCATION_SOURCE_SETTINGS',
                      );
                    }
                  },
                },
              ],
            );
          } else if (error.code === 3) {
            // TIMEOUT
            Alert.alert(
              'Location Timeout',
              'Getting your location took too long. Please try again.',
            );
          } else {
            Alert.alert(
              'Location Error',
              'Unable to fetch your location. Please enable GPS and try again.',
            );
          }

          setIsLoading(false);
          if (forInput) {
            pickupRef.current?.setAddressText('');
          }
        },
        {
          enableHighAccuracy: false,
          timeout: 30000,
          maximumAge: 60000,
        },
      );
    },
    [handleReverseGeocoding],
  );

  // Marker drag end handler for pickup
  const handlePickupMarkerDragEnd = useCallback(
    async e => {
      const newCoordinate = e.nativeEvent.coordinate;
      const newLocationName = await handleReverseGeocoding(
        newCoordinate.latitude,
        newCoordinate.longitude,
      );

      const newPickupCords = {
        latitude: parseFloat(newCoordinate.latitude),
        longitude: parseFloat(newCoordinate.longitude),
        locationName: newLocationName,
      };

      setPickupCords(newPickupCords);
      pickupRef.current?.setAddressText(newLocationName);
      mapRef.current?.setNativeProps({scrollEnabled: true});
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
        latitude: parseFloat(newCoordinate.latitude),
        longitude: parseFloat(newCoordinate.longitude),
        locationName: newLocationName,
      };

      setDroplocationCords(newDropCords);
      droplocationRef.current?.setAddressText(newLocationName);
      mapRef.current?.setNativeProps({scrollEnabled: true});
    },
    [handleReverseGeocoding],
  );

  useEffect(() => {
    askForLocationPermission();

    if (params?.route?.params?.mydata) {
      const {pickupCords: pickup, droplocationCords: drop} =
        params.route.params.mydata;

      if (pickup?.locationName) {
        pickupRef.current?.setAddressText(pickup.locationName);
      }
      if (drop?.locationName) {
        droplocationRef.current?.setAddressText(drop.locationName);
      }
    }

    const debounceTimer = debounceTimerRef.current;
    const watchId = watchIdRef.current;

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      if (watchId) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, [askForLocationPermission, params]);

  useEffect(() => {
    if (!isFocused) {
      handleClearPickupInput();
    }
  }, [isFocused, handleClearPickupInput]);

  const hasLocations = !!(pickupCords?.latitude && droplocationCords?.latitude);

  return (
    <Container>
      <DarkStatusBar />
      <View style={{flex: 1}}>
        <View style={styles.homeContainer}>
          {/* Map View - Full Screen */}
          <View style={styles.mMap}>
            <MapView
              ref={mapRef}
              key={`map-${mapRefreshKey}`}
              style={styles.mMap}
              provider={PROVIDER_GOOGLE}
              region={region}
              onRegionChangeComplete={async (coords, {isGesture}) => {
                setRegion(coords);
                if (isGesture && !pickupCords?.latitude) {
                  setTemporaryPickUpCords(coords);
                  handleRegionChangeComplete(coords);
                }
              }}
            >
              {pickupCords?.latitude ? (
                <Marker
                  key="pickup-marker"
                  coordinate={{
                    latitude: Number(pickupCords.latitude),
                    longitude: Number(pickupCords.longitude),
                  }}
                  title="Pickup"
                  pinColor="blue"
                  zIndex={999}
                />
              ) : null}
              
              {droplocationCords?.latitude ? (
                <Marker
                  key="drop-marker"
                  coordinate={{
                    latitude: Number(droplocationCords.latitude),
                    longitude: Number(droplocationCords.longitude),
                  }}
                  title="Destination"
                  pinColor="red"
                  zIndex={999}
                />
              ) : null}
              
              {pickupCords?.latitude && droplocationCords?.latitude && (
                <MapViewDirections
                  key="route-directions"
                  origin={{
                    latitude: Number(pickupCords.latitude),
                    longitude: Number(pickupCords.longitude),
                  }}
                  destination={{
                    latitude: Number(droplocationCords.latitude),
                    longitude: Number(droplocationCords.longitude),
                  }}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeWidth={6}
                  strokeColor="#2563EB"
                  optimizeWaypoints={true}
                  onReady={result => {
                    console.log('DEBUG: Route success:', result.distance, 'km');
                    setTripDetails({
                      distance: result.distance,
                      duration: result.duration,
                    });
                    mapRef.current?.fitToCoordinates(result.coordinates, {
                      edgePadding: {
                        top: 150,
                        right: 50,
                        bottom: 150,
                        left: 50,
                      },
                      animated: true,
                    });
                  }}
                  onError={err => console.error('DEBUG: Directions Error:', err)}
                />
              )}
            </MapView>

            {/* Top Floating Route Entry Container */}
            <View style={styles.routeEntryContainer}>
              <View style={styles.routeHeader}>
                <TouchableOpacity onPress={() => openDrawer()}>
                  <Icon name="menu" type="MaterialIcons" style={{fontSize: 24, color: '#333'}} />
                </TouchableOpacity>
                <Text style={styles.routeTitle}>Plan your trip</Text>
              </View>

              <View style={styles.inputWrapper}>
                <View style={styles.visualColumn}>
                  <View style={styles.dotBlue} />
                  <View style={styles.verticalLine} />
                  <View style={styles.dotRed} />
                </View>

                <View style={styles.inputColumn}>
                  <Text style={styles.inputLabel}>Pickup Location</Text>
                  <LocationAutocomplete
                    placeholder="My Current Location"
                    value={pickupCords?.locationName || ''}
                    apiKey={GOOGLE_MAPS_APIKEY}
                    predefinedPlaces={[
                      {
                        description: 'Current location',
                        isPredefined: true,
                      },
                    ]}
                    isActive={activeField === 'pickup'}
                    onFocus={() => setActiveField('pickup')}
                    onBlur={() => setActiveField(null)}
                    onLocationSelect={(location) => {
                      if (location.isPredefined) {
                        handleGetCurrentLocation(true);
                      } else {
                        const coords = {
                          latitude: location.latitude,
                          longitude: location.longitude,
                          locationName: location.description,
                        };
                        setPickupCords(coords);
                      }
                    }}
                  />

                  <Text style={styles.inputLabel}>Where to?</Text>
                  <LocationAutocomplete
                    placeholder="Enter destination"
                    value={droplocationCords?.locationName || ''}
                    apiKey={GOOGLE_MAPS_APIKEY}
                    isActive={activeField === 'destination'}
                    onFocus={() => setActiveField('destination')}
                    onBlur={() => setActiveField(null)}
                    onLocationSelect={(location) => {
                      const coords = {
                        latitude: location.latitude,
                        longitude: location.longitude,
                        locationName: location.description,
                      };
                      setDroplocationCords(coords);
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Current Location Button */}
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 120,
                right: 20,
                backgroundColor: 'white',
                borderRadius: 30,
                width: 50,
                height: 50,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                shadowRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
              }}
              onPress={handleGetCurrentLocation}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#3B82F6" />
              ) : (
                <Icon
                  name="my-location"
                  type="MaterialIcons"
                  style={{fontSize: 24, color: '#3B82F6'}}
                />
              )}
            </TouchableOpacity>

            <View style={styles.estimateSheet}>
              <TouchableOpacity
                style={[styles.nextBtn, {opacity: hasLocations ? 1 : 0.6}]}
                onPress={() => {
                  if (hasLocations) {
                    handleNavigation();
                  }
                }}
                disabled={!hasLocations}>
                <Text style={styles.nextBtnText}>Next</Text>
                <Icon name="arrow-forward" type="MaterialIcons" style={{fontSize: 24, color: '#FFF'}} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Container>
  );
}