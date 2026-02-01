import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Container, Text, Icon } from '../../../component/Basic';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import AppSpinner from '../../../component/AppSpinner';
import theme from '../../../theme/styles';
import Header from '../../../component/Header';
import { DarkStatusBar } from '../../../component/StatusBar';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, URL_V, GOOGLE_MAPS_KEY } from '../../../utilities/helper';
import Geocoder from 'react-native-geocoding';
import { showMessage } from '../../../helper/showAlert';
import { useIsFocused } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import LocationAutocomplete from '../../../component/LocationAutocomplete';
import { locationPermission } from '../../../helper/getCurrentLocation';
import { Linking } from 'react-native';

const GOOGLE_MAPS_APIKEY = GOOGLE_MAPS_KEY;
Geocoder.init(GOOGLE_MAPS_APIKEY);

const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = 0.04;

const defaultLocation = {
  latitude: 31.5204,
  longitude: 74.3587,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

function MyRoute({ navigation }) {
  const isFocused = useIsFocused();
  const [opens, setOpens] = useState(false);
  const [value, setValue] = useState([]);
  const [items, setItems] = useState([
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednesday', value: 'wednesday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },
    { label: 'Sunday', value: 'sunday' },
  ]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [st, setSt] = useState();
  const [et, setEt] = useState();
  const [openStartTime, setOpenStartTime] = useState(false);
  const [openEndTime, setOpenEndTime] = useState(false);
  const [showOptions, setShowOptions] = useState(true);

  const mapRef = useRef(null);
  const pickupRef = useRef(null);
  const droplocationRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const [pickupCords, setPickupCords] = useState({});
  const [droplocationCords, setDroplocationCords] = useState({});
  const [region, setRegion] = useState(defaultLocation);
  const [isLoading, setIsLoading] = useState(false);
  const [temporaryPickUpCords, setTemporaryPickUpCords] = useState({});
  const [activeField, setActiveField] = useState(null);

  useEffect(() => {
    if (pickupCords?.latitude && droplocationCords?.latitude) {
      // Both locations selected - fit to show both markers
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.fitToCoordinates(
            [
              {
                latitude: Number(pickupCords.latitude),
                longitude: Number(pickupCords.longitude),
              },
              {
                latitude: Number(droplocationCords.latitude),
                longitude: Number(droplocationCords.longitude),
              },
            ],
            {
              edgePadding: { top: 200, right: 50, bottom: 200, left: 50 },
              animated: true,
            }
          );
        }
      }, 100);
    } else if (pickupCords?.latitude) {
      // Only pickup selected - zoom to pickup
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
    } else if (droplocationCords?.latitude) {
      // Only destination selected - zoom to destination
      const newRegion = {
        latitude: Number(droplocationCords.latitude),
        longitude: Number(droplocationCords.longitude),
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
      setRegion(newRegion);
      setTimeout(() => {
        mapRef.current?.animateToRegion(newRegion, 1000);
      }, 100);
    }
  }, [pickupCords?.latitude, pickupCords?.longitude, droplocationCords?.latitude, droplocationCords?.longitude]);

  const askForLocationPermission = React.useCallback(async () => {
    try {
      await locationPermission();
      return true;
    } catch (err) {
      console.error('Permission error:', err);
      return false;
    }
  }, []);

  const handleGetCurrentLocation = React.useCallback(
    async (forInput = false) => {
      setIsLoading(true);

      Geolocation.getCurrentPosition(
        async position => {
          try {
            const { latitude, longitude } = position.coords;

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

            mapRef.current?.animateToRegion(newRegion, 1000);
          } catch (e) {
            console.error('Error handling location result:', e);
          } finally {
            setIsLoading(false);
          }
        },
        error => {
          console.error('Error getting current location:', error);

          if (error.code === 1) {
            Alert.alert(
              'Location Permission Required',
              'Please enable location permission in your device settings to use this feature.',
              [
                { text: 'Cancel', style: 'cancel' },
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
            Alert.alert(
              'Location Services Disabled',
              'Please turn on location services in your device settings.',
              [
                { text: 'Cancel', style: 'cancel' },
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
          } else {
            Alert.alert(
              'Location Error',
              'Unable to fetch your location. Please enable GPS and try again.',
            );
          }

          setIsLoading(false);
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

  const handleRegionChangeComplete = React.useCallback(
    async coords => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

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

          setPickupCords(newPickupCords);
        } catch (err) {
          console.error(err);
        }
      }, 1000);
    },
    [temporaryPickUpCords, handleReverseGeocoding],
  );

  async function submit() {
    if (!pickupCords?.latitude || !droplocationCords?.latitude) {
      Alert.alert('Missing Information', 'Please select both pickup and drop locations');
      return;
    }

    if (value.length === 0) {
      Alert.alert('Missing Information', 'Please select at least one day');
      return;
    }

    setLoading(true);
    try {
      const cd = {
        from: pickupCords.locationName,
        to: droplocationCords.locationName,
        from_cord: `${pickupCords?.latitude}, ${pickupCords?.longitude}`,
        to_cord: `${droplocationCords?.latitude}, ${droplocationCords?.longitude}`,
        schedule: value.map(day => day.toLowerCase()),
        status: true,
        has_diversion: false,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
      };

      const data = await AsyncStorage.getItem('response');
      const datas = JSON.parse(data);

      await axios.post(`${BASE_URL}${URL_V}routes`, cd, {
        headers: {
          Authorization: `Bearer ${datas.access_token}`,
        },
      });

      showMessage('success', 'Route Added Successfully!');
      setLoading(false);
      navigation.pop();
    } catch (err) {
      console.log('ERROR WHILE ADDING ROUTE', err.response?.data);
      showMessage('error', err.response?.data?.message || 'Error adding route');
      setLoading(false);
    }
  }

  const handleClearInputs = () => {
    pickupRef?.current?.setAddressText('');
    droplocationRef?.current?.setAddressText('');
    setPickupCords({});
    setDroplocationCords({});
  };

  const handleReverseGeocoding = async (lat, lng) => {
    try {
      const result = await Geocoder.from(lat, lng);
      return result?.results[0]?.formatted_address || 'Unknown location';
    } catch (err) {
      if (__DEV__) {
        console.error('Reverse geocoding error:', err);
      }
      return 'Unknown location';
    }
  };

  useEffect(() => {
    if (isFocused) {
      handleClearInputs();
      askForLocationPermission();
    }
  }, [isFocused, askForLocationPermission]);

  return (
    <Container style={theme.layoutFx}>
      <DarkStatusBar />
      <Header leftType="back" title="CREATE ROUTE" />

      {/* Date Pickers */}
      <DatePicker
        modal
        mode="time"
        open={openStartTime}
        date={startDate}
        onConfirm={date => {
          setOpenStartTime(false);
          setStartDate(date);
          setSt('done');
        }}
        onCancel={() => setOpenStartTime(false)}
      />
      <DatePicker
        modal
        mode="time"
        open={openEndTime}
        date={endDate}
        onConfirm={date => {
          setOpenEndTime(false);
          setEndDate(date);
          setEt('Done');
        }}
        onCancel={() => setOpenEndTime(false)}
      />

      {/* Full Screen Map */}
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          provider="google"
          region={region}
          onRegionChangeComplete={async (coords, { isGesture }) => {
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
                mapRef.current?.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    top: 200,
                    right: 50,
                    bottom: 200,
                    left: 50,
                  },
                  animated: true,
                });
              }}
              onError={err => {
                if (__DEV__) {
                  console.error('Directions Error:', err);
                }
              }}
            />
          )}
        </MapView>

        {/* Floating Input Card */}
        <View style={styles.routeEntryContainer} pointerEvents="box-none">
          <View style={styles.inputWrapper} pointerEvents="box-none">
            <View style={styles.visualColumn}>
              <View style={styles.dotBlue} />
              <View style={styles.verticalLine} />
              <View style={styles.dotRed} />
            </View>

            <View style={styles.inputColumn} pointerEvents="box-none">
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

              <Text style={styles.inputLabel}>Destination</Text>
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

          {/* Toggle Options Button */}
          <TouchableOpacity
            style={styles.toggleOptionsBtn}
            onPress={() => setShowOptions(!showOptions)}
          >
            <Text style={styles.toggleOptionsText}>
              {showOptions ? 'Hide' : 'Show'} Schedule Options
            </Text>
            <Icon
              name={showOptions ? 'chevron-up' : 'chevron-down'}
              type="MaterialCommunityIcons"
              style={{ fontSize: 20, color: '#59499E' }}
            />
          </TouchableOpacity>

          {/* Collapsible Options */}
          {showOptions && (
            <View style={styles.optionsContainer}>
              <View style={styles.timeRow}>
                <TouchableOpacity
                  style={styles.timeBtn}
                  onPress={() => setOpenStartTime(true)}
                >
                  <Text style={styles.timeBtnText}>
                    {st ? startDate.toTimeString().split('G')[0] : 'START TIME'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.timeBtn}
                  onPress={() => setOpenEndTime(true)}
                >
                  <Text style={styles.timeBtnText}>
                    {et ? endDate.toTimeString().split('G')[0] : 'END TIME'}
                  </Text>
                </TouchableOpacity>
              </View>

              <DropDownPicker
                open={opens}
                value={value}
                items={items}
                setOpen={setOpens}
                setValue={setValue}
                setItems={setItems}
                placeholder="Select your days"
                theme="LIGHT"
                multiple={true}
                mode="BADGE"
                badgeDotColors={[
                  '#e76f51',
                  '#00b4d8',
                  '#e9c46a',
                  '#e76f51',
                  '#8ac926',
                  '#00b4d8',
                  '#e9c46a',
                ]}
                style={{ zIndex: 5 }}
                listItemContainerStyle={{ height: 20 }}
              />
            </View>
          )}
        </View>

        {/* Current Location Button */}
        <TouchableOpacity
          style={styles.currentLocationBtn}
          onPress={() => handleGetCurrentLocation(false)}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#3B82F6" />
          ) : (
            <Icon
              name="my-location"
              type="MaterialIcons"
              style={{ fontSize: 24, color: '#3B82F6' }}
            />
          )}
        </TouchableOpacity>

        {/* Bottom Add Route Button */}
        <TouchableOpacity
          style={styles.addRouteBtn}
          onPress={() => {
            if (!loading) {
              submit();
            }
          }}
        >
          {!loading ? (
            <Text style={styles.addRouteBtnText}>ADD ROUTE</Text>
          ) : (
            <ActivityIndicator size="small" color="#FFF" />
          )}
        </TouchableOpacity>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  routeEntryContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10000,
    zIndex: 10000,
    overflow: 'visible',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    zIndex: 10000,
    elevation: 10000,
  },
  visualColumn: {
    width: 20,
    alignItems: 'center',
    marginRight: 10,
    paddingTop: 35,
  },
  dotBlue: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
  },
  dotRed: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
  },
  verticalLine: {
    width: 1,
    height: 60,
    backgroundColor: '#D1D5DB',
    marginVertical: 4,
  },
  inputColumn: {
    flex: 1,
    overflow: 'visible',
    zIndex: 10000,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  toggleOptionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  toggleOptionsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#59499E',
    marginRight: 5,
  },
  optionsContainer: {
    marginTop: 15,
    zIndex: 10,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  timeBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  timeBtnText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
  },
  addRouteBtn: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 999,
  },
  addRouteBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  currentLocationBtn: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 30,
    width: 50,
    height: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
});

export default MyRoute;
