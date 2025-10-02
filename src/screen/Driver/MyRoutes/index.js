import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Image,
  SafeAreaView,
  Dimensions,
  Platform,
  StyleSheet,
} from "react-native";
import { Container, Content, Text, Icon } from "../../../component/Basic";
import { TextInput, Button, ToggleSwitch } from "../../../component/Form";
import MapView, { Marker, AnimatedRegion } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import AppSpinner from "../../../component/AppSpinner";
import styles from "./styles";
import theme from "../../../theme/styles";
import Header from "../../../component/Header";
import { DarkStatusBar } from "../../../component/StatusBar";
import { connect } from "react-redux";
import DatePicker from "react-native-date-picker";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {locationPermission} from '../../../helper/getCurrentLocation';
// import { GOOGLE_MAPS_KEY } from "@env"
import { BASE_URL, URL_V, GOOGLE_MAPS_KEY } from "../../../utilities/helper";
import Geocoder from 'react-native-geocoding';
import { showMessage } from "../../../helper/showAlert";
import { useIsFocused } from "@react-navigation/native";
// const GOOGLE_MAPS_APIKEY = "AIzaSyATpSrcISxeRrwW8iTnB2j_C8UNR7Dv4f8";
const GOOGLE_MAPS_APIKEY = GOOGLE_MAPS_KEY;
navigator.geolocation = require('@react-native-community/geolocation');
Geocoder.init(GOOGLE_MAPS_APIKEY);
const screen = Dimensions.get("window");
const ASPECT_RATIO = screen.width / screen.height;
// const LATITUDE_DELTA = 0.0922;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

function MyRoute({ navigation,params }) {
  const isFocused = useIsFocused();
  const [opens, setOpens] = useState(false);
  const [value, setValue] = useState([]);
  const [items, setItems] = useState([
    { label: "Monday", value: "monday" },

    { label: "Tuesday", value: "tuesday" },
    { label: "Wednesday", value: "wednesday" },

    { label: "Thusrday", value: "thursday" },
    { label: "Friday", value: "friday" },

    { label: "Saturday", value: "saturday" },
    { label: "Sunday", value: "sunday" },
  ]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [divert, setDivert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [st, setSt] = useState();
  const [et, setEt] = useState();
  const [openStartTime, setOpenStartTime] = useState(false);
  const [openEndTime, setOpenEndTime] = useState(false);

  const mapRef = useRef(null);
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
  // const [state, setState] = useState({
  //   pickupCords: {
  //     latitude: 31.5204,
  //     longitude: 74.3587,
  //   },
  //   droplocationCords: {
  //     latitude: 31.4504,
  //     longitude: 73.135,
  //   },
  //   isLoading: false,
  //   coordinate: new AnimatedRegion({
  //     latitude: 31.5204,
  //     longitude: 74.3587,
  //     latitudeDelta: LATITUDE_DELTA,
  //     longitudeDelta: LONGITUDE_DELTA,
  //   }),
  //   heading: 0,
  // });

  const { pickupCords, droplocationCords, coordinate, heading } = state;
  console.log("pickupCords",pickupCords);
  console.log("droplocationCords",droplocationCords);

  async function submit() {
    setLoading(true);
    try {
      var cd = {
        from: pickupCords.locationName,
        to: droplocationCords.locationName,
        from_cord: `${pickupCords?.latitude}, ${pickupCords?.longitude}`,
        to_cord: `${droplocationCords?.latitude}, ${droplocationCords?.longitude}`,
        schedule: value.map(day => day.toLowerCase()),
        status: true,
        has_diversion: divert,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
      };

      console.log("this is data before send", cd);

      var data = await AsyncStorage.getItem("response");
      var datas = JSON.parse(data);

      const res = await axios.post(`${BASE_URL}${URL_V}routes`, cd, {
        headers: {
          Authorization: `Bearer ${datas.access_token}`,
        },
      });
      console.log("res route added", res.data);
     
      showMessage("success", "Added Successfully!");
      setLoading(false);
      navigation.pop();
    } catch (err) {
      console.log("ERROR WHILE ADDING ROUTE", err.response.data);
      // setLoading(false);
      showMessage("error", err.response.data);
      // showMessage("success", "Added Successfully!");
      setLoading(false);
      // navigation.pop();
    }
  }
  const handleClearPickupInput = () => {
    pickupRef?.current?.setAddressText('');
    droplocationRef?.current?.setAddressText('');
    setState({
      ...state,
      pickupCords: {},
      droplocationCords: {},
    });
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
  useEffect(() => {
    handleClearPickupInput();
    if (isFocused) {
    }
  }, [isFocused]);
  const showClearInputButton = clearInput => {
    return (
      <Icon
        name="close-circle-outline"
        type="Ionicons"
        style={styles.closeIconStyles}
        onPress={clearInput}
      />
    );
  };

  useEffect(() => {
    console.log(value, "valuee")
  }, [value])

  return (
    <Container style={theme.layoutFx}>
      <DarkStatusBar />
      <Header leftType="back" title={"CREATE ROUTE"} />
      <View>
        <DatePicker
          modal
          mode="time"
          open={openStartTime}
          date={startDate}
          onConfirm={(date) => {
            setOpenStartTime(false);
            console.log("Date", date.toTimeString());

            setStartDate(date);
            setSt("done");
          }}
          // timeZoneOffsetInMinutes
          onCancel={() => {
            setOpenStartTime(false);
          }}
        />
        <DatePicker
          modal
          mode="time"
          open={openEndTime}
          date={endDate}
          onConfirm={(date) => {
            setOpenEndTime(false);
            console.log("Date", date.toTimeString());
            setEndDate(date);
            setEt("Done");
          }}
          onCancel={() => {
            setOpenEndTime(false);
          }}
        />
      </View>
      <Content contentContainerStyle={theme.layoutDf}>
        <View style={styles.selectVehicleContainer}>
          <View style={styles.selectVehicleContent}>
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
              renderRightButton={() => {
                return pickupRef?.current?.getAddressText() &&
                  state.pickupCords?.latitude
                  ? showClearInputButton(handleClearPickupInput)
                  : null;
              }}
            />
          </View>

         

            <View style={styles.formRow11}>
              <Button
                style={styles.formRow2}
                onPress={() => setOpenStartTime(true)}
              >
                <Text style={[styles.formInput, { color: "black" }]}>
                  {
                    st
                      ? `${startDate.toTimeString().split("G")[0]}`
                      : "START TIME"
                  }
                </Text>
              </Button>
              <Button
                style={styles.formRow2}
                onPress={() => setOpenEndTime(true)}
              >
                <Text style={[styles.formInput, { color: "black" }]}>
                  {
                    et ? `${endDate.toTimeString().split("G")[0]}` : "END TIME"
                  }
                </Text>
              </Button>
            </View>

            <DropDownPicker
              open={opens}
              value={value}
              items={items}
              setOpen={setOpens}
              setValue={setValue}
              setItems={setItems}
              placeholder="Select your days"
              onChangeItem={(item) => {
                const selectedItems = [...value];
                const index = selectedItems.indexOf(item.value);

                if (index !== -1) {
                  selectedItems.splice(index, 1);
                } else {
                  selectedItems.push(item.value);
                }

                setValue(selectedItems);
              }}
              theme="LIGHT"
              multiple={true}
              mode="BADGE"
              badgeDotColors={[
                "#e76f51",
                "#00b4d8",
                "#e9c46a",
                "#e76f51",
                "#8ac926",
                "#00b4d8",
                "#e9c46a",
              ]}
              style={{ zIndex: 5 }}
              listItemContainerStyle={{ height: 20 }}
            />

          </View>
        </View>
      </Content>

      <View
        style={{
          flex: 1,
          zIndex: -2,
        
        }}
      >
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={
            Object.values(pickupCords).length > 0
              ? {
                ...pickupCords,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }
              : null
          }
        >
          {Object.values(state.pickupCords).length > 0 && (
            <Marker
              coordinate={pickupCords}
              image={require("../../../assets/images/Oval2x.png")}
            />
          )}
          {Object.values(state.droplocationCords).length > 0 && (
            <Marker
              coordinate={droplocationCords}
              image={require("../../../assets/images/greenMarker2x.png")}
            />
          )}
          {Object.values(state.pickupCords).length > 0 &&
            Object.values(state.droplocationCords).length > 0 && (
              <MapViewDirections
                origin={pickupCords}
                destination={droplocationCords}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={6}
                strokeColor="hotpink"
                optimizeWaypoints={true}
                onReady={(result) => {
                  mapRef.current.fitToCoordinates(result.coordinates);
                }}
              />
            )}
        </MapView>
      </View>
      <Button
        style={styles.bookingBtn}
        onPress={() => {
          if (!loading) {
            submit();
          }
        }}
      >
        {!loading ? (
          <Text style={styles.bookingBtnText}>ADD ROUTE</Text>
        ) : (
          <View style={styles.bookingBtnText}>
            <AppSpinner />
          </View>
        )}
      </Button>

    </Container>
  );
}

export default connect(({ session }) => ({ session }))(MyRoute);