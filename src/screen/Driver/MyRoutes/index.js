import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Container, Text, Icon} from '../../../component/Basic';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import AppSpinner from '../../../component/AppSpinner';
import theme from '../../../theme/styles';
import Header from '../../../component/Header';
import {DarkStatusBar} from '../../../component/StatusBar';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL, URL_V, GOOGLE_MAPS_KEY} from '../../../utilities/helper';
import Geocoder from 'react-native-geocoding';
import {showMessage} from '../../../helper/showAlert';
import {useIsFocused} from '@react-navigation/native';

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

function MyRoute({navigation}) {
  const isFocused = useIsFocused();
  const [opens, setOpens] = useState(false);
  const [value, setValue] = useState([]);
  const [items, setItems] = useState([
    {label: 'Monday', value: 'monday'},
    {label: 'Tuesday', value: 'tuesday'},
    {label: 'Wednesday', value: 'wednesday'},
    {label: 'Thursday', value: 'thursday'},
    {label: 'Friday', value: 'friday'},
    {label: 'Saturday', value: 'saturday'},
    {label: 'Sunday', value: 'sunday'},
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

  const [pickupCords, setPickupCords] = useState({});
  const [droplocationCords, setDroplocationCords] = useState({});
  const [region, setRegion] = useState(defaultLocation);

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
              edgePadding: {top: 200, right: 50, bottom: 200, left: 50},
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
    }
  }, [isFocused]);

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
      <View style={{flex: 1}}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          provider="google"
          region={region}
          onRegionChangeComplete={setRegion}
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
              <GooglePlacesAutocomplete
                ref={pickupRef}
                onFail={error => console.error('Pickup error:', error)}
                placeholder="Enter pickup location"
                keyboardShouldPersistTaps="handled"
                listViewDisplayed={false}
                textInputProps={{
                  placeholderTextColor: '#9CA3AF',
                  returnKeyType: 'search',
                }}
                styles={{
                  container: {
                    flex: 0,
                    marginBottom: 10,
                    zIndex: 10001,
                    elevation: 10001,
                  },
                  textInput: {
                    backgroundColor: '#F3F4F6',
                    borderRadius: 10,
                    height: 45,
                    color: '#000',
                    fontSize: 14,
                    paddingHorizontal: 15,
                    zIndex: 10001,
                  },
                  listView: {
                    position: 'absolute',
                    top: 47,
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    elevation: 10002,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 4},
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    zIndex: 10002,
                    maxHeight: 300,
                  },
                  description: {
                    color: '#000',
                  },
                  row: {
                    backgroundColor: 'white',
                    paddingVertical: 12,
                    paddingHorizontal: 15,
                  },
                }}
                query={{key: GOOGLE_MAPS_APIKEY, language: 'en'}}
                onPress={async (data, details = null) => {
                  let coords = {
                    latitude: details?.geometry?.location?.lat,
                    longitude: details?.geometry?.location?.lng,
                    locationName: data?.structured_formatting?.main_text || data.description,
                  };

                  if (!coords?.latitude) {
                    try {
                      const json = await Geocoder.from(data.description);
                      coords.latitude = json.results[0].geometry.location.lat;
                      coords.longitude = json.results[0].geometry.location.lng;
                    } catch (e) {
                      if (__DEV__) {
                        console.error('Geocoding failed', e);
                      }
                    }
                  }

                  if (coords?.latitude) {
                    setPickupCords(coords);
                  }
                }}
                fetchDetails={true}
                enablePoweredByContainer={false}
              />

              <Text style={styles.inputLabel}>Destination</Text>
              <GooglePlacesAutocomplete
                ref={droplocationRef}
                onFail={error => console.error('Drop error:', error)}
                placeholder="Enter destination"
                keyboardShouldPersistTaps="handled"
                listViewDisplayed={false}
                textInputProps={{
                  placeholderTextColor: '#9CA3AF',
                  returnKeyType: 'search',
                }}
                styles={{
                  container: {
                    flex: 0,
                    zIndex: 9000,
                    elevation: 9000,
                  },
                  textInput: {
                    backgroundColor: '#F3F4F6',
                    borderRadius: 10,
                    height: 45,
                    color: '#000',
                    fontSize: 14,
                    paddingHorizontal: 15,
                    zIndex: 9000,
                  },
                  listView: {
                    position: 'absolute',
                    top: 47,
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    elevation: 9001,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 4},
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    zIndex: 9001,
                    maxHeight: 300,
                  },
                  description: {
                    color: '#000',
                  },
                  row: {
                    backgroundColor: 'white',
                    paddingVertical: 12,
                    paddingHorizontal: 15,
                  },
                }}
                query={{key: GOOGLE_MAPS_APIKEY, language: 'en'}}
                onPress={async (data, details = null) => {
                  let coords = {
                    latitude: details?.geometry?.location?.lat,
                    longitude: details?.geometry?.location?.lng,
                    locationName: data?.structured_formatting?.main_text || data.description,
                  };

                  if (!coords?.latitude) {
                    try {
                      const json = await Geocoder.from(data.description);
                      coords.latitude = json.results[0].geometry.location.lat;
                      coords.longitude = json.results[0].geometry.location.lng;
                    } catch (e) {
                      if (__DEV__) {
                        console.error('Geocoding failed', e);
                      }
                    }
                  }

                  if (coords?.latitude) {
                    setDroplocationCords(coords);
                  }
                }}
                fetchDetails={true}
                enablePoweredByContainer={false}
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
              style={{fontSize: 20, color: '#59499E'}}
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
                style={{zIndex: 5}}
                listItemContainerStyle={{height: 20}}
              />
            </View>
          )}
        </View>

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
    shadowOffset: {width: 0, height: 4},
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
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 999,
  },
  addRouteBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MyRoute;
