import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  TextInput,
  Button,
  Linking,
  Platform
} from "react-native";
import MapView, { Marker, AnimatedRegion } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useSelector } from "react-redux";
import {
  getUserCurrentPosition,
  locationPermission,
} from "../../helper/getCurrentLocation";
import { COLOR, FAMILY, SIZE } from "../../theme/typography";
import AppSpinner from "../../component/AppSpinner";
import { showMessage } from "../../helper/showAlert";
import axios from "axios";
import RatingModal from '../../component/RatingModal';
// import {GOOGLE_MAPS_KEY} from "@env"
import { BASE_URL, URL_V, GOOGLE_MAPS_KEY } from "../../utilities/helper";
// const GOOGLE_MAPS_APIKEY = "AIzaSyABbE8m9cfg-OspSdVkr58Lo5SplQ_XFLA";
const GOOGLE_MAPS_APIKEY = GOOGLE_MAPS_KEY;
const screen = Dimensions.get("window");
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const TrackingScreen = ({ route }) => {
  const [isTrackingStart, setIsTrackingStart] = useState(false);
  const [code, setCode] = useState("");
  const [text, onChangeText] = React.useState('Enter Code');
  const [isRatingModalVisible, setRatingModalVisible] = useState(false);
  const [number, onChangeNumber] = React.useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTripStatus, setCurrentTripStatus] = useState(
    route?.params?.data?.status
  );
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [tripStatusLoading, setTripStatusLoading] = useState(false);
  const { user } = useSelector((state) => state.session);
  // console.log("user",user?._id);
  const { socket } = useSelector((state) => state.socket);

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [state, setState] = useState({
    pickupCords: route?.params?.data?.from_location_cor
      ? {
        latitude: parseFloat(route.params.data.from_location_cor.split(',')[0]),
        longitude: parseFloat(route.params.data.from_location_cor.split(',')[1])
      }
      : {},
    droplocationCords: route?.params?.data?.to_location_cor
      ? {
        latitude: parseFloat(route.params.data.to_location_cor.split(',')[0]),
        longitude: parseFloat(route.params.data.to_location_cor.split(',')[1])
      }
      : {},
    isLoading: false,
    coordinate: new AnimatedRegion({
      latitude: route?.params?.data?.from_location_cor
        ? parseFloat(route.params.data.from_location_cor.split(',')[0])
        : "",
      longitude: route?.params?.data?.from_location_cor
        ? parseFloat(route.params.data.from_location_cor.split(',')[1])
        : "",
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
    heading: 0,
  });

  const { pickupCords, droplocationCords, coordinate, heading } = state;
  // Debug logs
  console.log("pickupCords:", state.pickupCords);
  console.log("droplocationCords:", state.droplocationCords);
  console.log("currentTripStatus:", currentTripStatus);
  console.log("user:", user);
  console.log("user roles:", user?.roles);

  const animate = useCallback((latitude, longitude) => {
    const newCoordinate = { latitude, longitude };
    if (Platform.OS === "android") {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
      }
    } else {
      coordinate.timing(newCoordinate).start();
    }
  }, [coordinate]);

  const showRatingModal = () => {
    setRatingModalVisible(true);
  };

  const hideRatingModal = () => {
    setRatingModalVisible(false);
  };


  const getCurrentLocation = useCallback(async (status) => {
    const isLocationOn = await locationPermission();
    if (isLocationOn) {
      const res = await getUserCurrentPosition();
      animate(res.latitude, res.longitude);

      if (status === "started") {
        setState({
          ...state,
          pickupCords: res,
          coordinate: {
            ...res,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
          droplocationCords: route?.params?.data?.from_location
            ? route?.params?.data?.from_location
            : {},
          heading: res.heading,
        });
      } else if (status === "pickup") {
        setState({
          ...state,
          pickupCords: res,
          coordinate: {
            ...res,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
          droplocationCords: route?.params?.data?.to_location
            ? route?.params?.data?.to_location
            : {},
          heading: res.heading,
        });
      }

      socket.emit("tracking", {
        to: route?.params?.data.customer_id?._id,
        location: `${res.latitude}, ${res.longitude}`,
        parcel: route?.params?.data._id,
        riderId: route?.params?.data.rider_id?._id,
        status,
        heading: res.heading,
      });
    }
  }, [animate, route?.params?.data, socket, state]);

  const handleTripStatus = async (status) => {
    if (status === "done") {
      setModalVisible(true);
      return;
    }
    setTripStatusLoading(true);
    try {
      const resp = await axios.patch(
        `${BASE_URL}${URL_V}parcel/${route?.params?.data?._id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      console.log("API PATCH response:", resp.data); // Debug
      if (resp.status === 200) {
        setCurrentTripStatus(resp.data.parcel?.status || resp.data.status);
        showMessage("success", `You marked the parcel as ${resp.data.parcel?.status || resp.data.status}`);
        setTripStatusLoading(false);
      }
    } catch (err) {
      console.log("PATCH ERROR:", err?.response?.data || err.message || err);
      showMessage("error", "Something went wrong while changing trip status");
      setTripStatusLoading(false);
    }
  };
  const handleDoneTripStatus = async () => {
    // console.log("route?.params?.data?._id",route?.params?.data?._id);
    setTripStatusLoading(true);
    try {
      const resp = await axios.post(
        `${BASE_URL}${URL_V}parcel/verifyOTP/${route?.params?.data?._id}`,
        {
          status: "done",
          otp: number
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      // console.log("resp",JSON.stringify(resp.data,null,2));
      if (resp.data.success == true) {
        // console.log("API STATUS ===>dd", resp.data.parcel.status);
        // console.log("API STATUS ===>dd2", JSON.stringify(resp.data,null,2));
        setCurrentTripStatus("done");
        showMessage("success", `You marked the parcel as ${resp.data.parcel.status}`);
        setTripStatusLoading(false);
        setRatingModalVisible(true);
        setModalVisible(false); // Modal close after success
      }
    } catch (err) {
      // console.log("ERROR===>dd", JSON.stringify(err.response,null,2));
      showMessage("error", "OTP not match please enter right otp");
      setTripStatusLoading(false);
      // setRatingModalVisible(true)
    }

  };


  useEffect(() => {
    if (
      ((user && Array.isArray(user.roles) && user.roles.includes("driver")) ||
        (user && Array.isArray(user.roles) && user.roles.includes("rider"))) &&
      currentTripStatus !== "in_progress" &&
      currentTripStatus !== "done"
    ) {
      getCurrentLocation(currentTripStatus);
    }

    if (
      ((user && Array.isArray(user.roles) && user.roles.includes("driver")) ||
        (user && Array.isArray(user.roles) && user.roles.includes("rider"))) &&
      currentTripStatus !== "in_progress" &&
      currentTripStatus !== "done"
    ) {
      const interval = setInterval(() => {
        getCurrentLocation(currentTripStatus);
      }, 6000);

      return () => clearInterval(interval);
    }

    if (user && Array.isArray(user.roles) && user.roles.includes("user") && socket) {
      socket.on("tracking", (incomingData) => {
        if (
          !isTrackingStart &&
          route?.params?.data?._id.toString() ===
          incomingData.data.parcel.toString()
        ) {
          setIsTrackingStart(true);
        }
        console.log("INCOMING DRIVER POS===>", incomingData);

        if (
          route?.params?.data?._id.toString() !==
          incomingData.data.parcel.toString()
        ) {
          return;
        }

        const [latitude, longitude] = incomingData.data.location.split(",");
        console.log(
          `CURRENT LATITUDE => ${latitude.trim()}, CURRENT LONGITUDE => ${longitude.trim()}`
        );

        const latitudePoints = +latitude;
        const longitudePoints = +longitude;
        const headingPoints = +incomingData.data.heading;

        animate(latitudePoints, longitudePoints);
        if (incomingData?.data?.status === "started") {
          setState({
            ...state,
            pickupCords: {
              latitude: latitudePoints,
              longitude: longitudePoints,
            },
            coordinate: {
              latitude: latitudePoints,
              longitude: longitudePoints,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            },
            droplocationCords: route?.params?.data?.from_location
              ? route?.params?.data?.from_location
              : {},
            heading: headingPoints,
          });
        } else if (incomingData?.data?.status === "pickup") {
          // console.log("IN PICKUP===>", incomingData?.data?.status);
          setState({
            ...state,
            pickupCords: {
              latitude: latitudePoints,
              longitude: longitudePoints,
            },
            coordinate: {
              latitude: latitudePoints,
              longitude: longitudePoints,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            },
            droplocationCords: route?.params?.data?.to_location
              ? route?.params?.data?.to_location
              : {},
            heading: headingPoints,
          });
        }
      });
    }
  }, [animate, getCurrentLocation, isTrackingStart, route?.params?.data?._id, route?.params?.data?.from_location, route?.params?.data?.to_location, socket, state, user, currentTripStatus]);

  return (
    <View>
      <View style={styles.mapStyles}>
        {!isTrackingStart && user && Array.isArray(user.roles) && user.roles.includes("user") && (
          <View style={styles.outerContainer}>
            <View style={styles.innerContainer}>
              <Text style={styles.textStyles}>
                You are looking at your parcel location. When ur rider will
                start the ride. You can see here his/her realtime location on
                the map.
              </Text>
            </View>
          </View>
        )}
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
          {/* Hardcoded markers and route for debug */}
          <Marker
            coordinate={{
              latitude: 31.5611865,
              longitude: 74.4071271
            }}
          />
          <Marker
            coordinate={{
              latitude: 31.4772238,
              longitude: 74.278166
            }}
          />
          <MapViewDirections
            origin={{ latitude: 31.5611865, longitude: 74.4071271 }}
            destination={{ latitude: 31.4772238, longitude: 74.278166 }}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={6}
            strokeColor="hotpink"
            onError={e => console.log('MapViewDirections error:', e)}
          />
          {/* ...existing dynamic marker/route code... */}
          {Object.values(state.pickupCords).length > 0 && (
            <Marker.Animated ref={markerRef} coordinate={coordinate}>
              <Image
                source={require("../../assets/images/bike.jpeg")}
                style={{
                  width: 40,
                  height: 40,
                  transform: [{ rotate: `${heading}deg` }],
                }}
                resizeMode="contain"
              />
            </Marker.Animated>
          )}
          {Object.values(state.droplocationCords).length > 0 && (
            <Marker
              coordinate={droplocationCords}
              image={require("../../assets/images/greenMarker2x.png")}
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
                onError={e => console.log('MapViewDirections error:', e)}
                onReady={(result) => {
                  mapRef.current.fitToCoordinates(result.coordinates);
                }}
              />
            )}
        </MapView>
        {/* <TouchableOpacity
        onPress={()=>{
          Linking.openURL(`https://www.google.com/maps/dir/?api=1&origin=34.1030032,-118.41046840000001&destination=34.059808,-118.368152`)
        }}
        style={styles.livemapView}>
               <Text style={{color:"#fff"}}> Live Map</Text>
              </TouchableOpacity> */}
        {/* Button render condition relaxed for debug */}
        {(currentTripStatus === "in_progress" || currentTripStatus === "started" || currentTripStatus === "pickup") && (
          <View style={styles.outerContainerForDriver}>
            <TouchableOpacity
              onPress={() => {
                if (!tripStatusLoading && currentTripStatus !== "done") {
                  const identifyStatus =
                    currentTripStatus === "in_progress"
                      ? "started"
                      : currentTripStatus === "started"
                        ? "pickup"
                        : currentTripStatus === "pickup"
                          ? "done"
                          : null;

                  handleTripStatus(identifyStatus);
                }
              }}
            >
              <View style={styles.innerContainerForDriver}>
                <View style={{ backgroundColor: COLOR.PRIMARY }}>
                  {tripStatusLoading ? (
                    <View style={styles.shareBtnText}>
                      <AppSpinner />
                    </View>
                  ) : (
                    <Text style={styles.shareBtnText}>
                      {currentTripStatus === "in_progress"
                        ? "START TRIP"
                        : currentTripStatus === "started"
                          ? "PICK UP"
                          : currentTripStatus === "pickup"
                            ? "DONE"
                            : "TRIP COMPLETED!"}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View>
        {/* <Button title="Show Rating Modal" onPress={showRatingModal} /> */}
        <RatingModal isVisible={isRatingModalVisible} onClose={hideRatingModal} userID={route?.params?.data?.customer_id?._id} riderID={user?._id} />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.enterCodeText}>Enter Code</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeNumber}
              value={number}
              placeholder="00000"
              keyboardType="numeric"
            />
            <Pressable onPress={() => handleDoneTripStatus()}>
              <Text style={styles.shareBtnText2}>
                Done
              </Text>
            </Pressable>

          </View>
        </View>
      </Modal>


    </View>
  );
};

const styles = StyleSheet.create({
  mapStyles: {
    width: "100%",
    height: "100%",
    borderColor: COLOR.LIGHT,
    borderWidth: 1,
  },
  outerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 2,
    width: "100%",
    padding: 20,
  },
  innerContainer: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: COLOR.PRIMARY,
    overflow: "hidden",
  },
  textStyles: {
    color: COLOR.LIGHT,
    lineHeight: 20,
    fontWeight: "bold",
  },
  outerContainerForDriver: {
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: 2,
    width: "100%",
    padding: 20,
  },
  livemapView: {
    backgroundColor: COLOR.BLUE,
    margin: 10,
    width: 70,
    alignItems: "center",
    justifyContent: 'center'
  },
  textStylesForDriver: {
    color: COLOR.LIGHT,
    lineHeight: 20,
    fontWeight: "bold",
  },

  shareBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLOR.BLUE,
    borderRadius: 3,
    paddingVertical: 15,
    marginLeft: 5,
  },
  shareBtnText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    paddingVertical: 15,
    color: COLOR.LIGHT,
    textAlign: "center",

  },
  enterCodeText: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_20,
    paddingVertical: 10,
    color: COLOR.PRIMARY,
    textAlign: "center",
  },
  shareBtnText2: {
    fontFamily: FAMILY.BOLD,
    fontSize: SIZE.SIZE_12,
    paddingVertical: 12,
    paddingHorizontal: 40,
    color: COLOR.LIGHT,
    textAlign: "center",
    backgroundColor: COLOR.PRIMARY,
    borderRadius: 5,

  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    // 
    borderWidth: 0.5,
    borderColor: COLOR.PRIMARY,
    padding: 10,
    paddingHorizontal: 30,
    borderRadius: 5
  },


});

export default TrackingScreen;
