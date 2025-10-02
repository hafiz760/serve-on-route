import React, { useState, useRef, useEffect } from "react";
import { View, Dimensions } from "react-native";
import { Container, Content, Text } from "../../../component/Basic";
import { Button } from "../../../component/Form";

import Header from "../../../component/Header";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { navigate } from "../../../navigation";
import styles from "./styles";
import MapView from "react-native-maps";
import { DarkStatusBar } from "../../../component/StatusBar";
import MapViewDirections from "react-native-maps-directions";
// import {GOOGLE_MAPS_KEY} from "@env"
import { BASE_URL,URL_V, GOOGLE_MAPS_KEY } from "../../../utilities/helper";
import {
  getUserCurrentPosition,
  locationPermission,
} from "../../../helper/getCurrentLocation";

export default function Home() {
  const [region, setRegion] = useState();

  const coordinates = [
    {
      latitude: 37.3317876,
      longitude: -122.0054812,
    },
    {
      latitude: 37.771707,
      longitude: -122.4053769,
    },
  ];

  const mapRef = useRef();

  const handleRegionChangeComplete = (region) => {
    // console.log('Current Region:', region);
  };

  const [start, setStart] = useState();
  const [end, setEnd] = useState();

  const [form, setForm] = useState();
  const [to, setTo] = useState();

  // const GOOGLE_MAPS_APIKEY = "AIzaSyABbE8m9cfg-OspSdVkr58Lo5SplQ_XFLA";
  const GOOGLE_MAPS_APIKEY = GOOGLE_MAPS_KEY;
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;

  const LATITUDE_DELTA = 0.07922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const edgePaddingValue = 70;

  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue + 70,
    left: edgePaddingValue,
  };
  const traceRoute = () => {
    if (start && end) {
      mapRef.current?.fitToCoordinates([start, end], { edgePadding });
    }
  };

  const onClick = () => {
    navigate("CustomerSelectVehicle", { to, form });
    if (start && end) {
    } else {
      alert("Please Fill the Start and Destination Location");
    }
  };

  const moveTo = async () => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getCurrentLocation();
    }, 4000);

    return () => clearInterval(interval);
  });

  const getCurrentLocation = async () => {
    const isLocationOn = await locationPermission();
    if (isLocationOn) {
      const res = await getUserCurrentPosition();
      console.log("GET LIVE LOCATION AFTER 5 SEC");
      setStart(res);
      console.log("CURRENT POSITION=====>", res);
    }
  };

  const homePlace = {
    description: "Current Location",
    geometry: { location: { lat: region?.latitude, lng: region?.longitude } },
  };
  const workPlace = {
    description: "Work",
    geometry: { location: { lat: region?.latitude, lng: region?.longitude } },
  };

  return (
    <Container>
      <DarkStatusBar />
      <Header leftType="menu" title={"TRUCKIE"} />
      <Content>
        <View style={styles.homeContainer}>
          <View style={styles.formRow}>
            <GooglePlacesAutocomplete
              placeholder="Pickup"
              currentLocation={true}
              predefinedPlaces={[homePlace]}
              currentLocationLabel="Current location"
              onPress={(data, details = null) => {
                // console.log("data", "details");
                console.log(
                  "LOcation",
                  details,
                  // data?.structured_formatting.main_text
                  data
                );
                var test = {
                  latitude: details?.geometry?.location?.lat,
                  longitude: details?.geometry?.location?.lng,
                };
                mapRef.current.initialRegion = {
                  latitude: details?.geometry?.location?.lat,
                  longitude: details?.geometry?.location?.lng,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                };
                console.log("Test", test);
                setStart(test);
                setForm({
                  coordinates: test,
                  locationName: data?.structured_formatting?.main_text,
                });
                // moveTo(test);
              }}
              query={{
                key: "AIzaSyATpSrcISxeRrwW8iTnB2j_C8UNR7Dv4f8",
                language: "en",
              }}
              minLength={2}
              GooglePlacesDetailsQuery={{ fields: "geometry" }}
              autoFocus={false}
              returnKeyType={"default"}
              fetchDetails={true}
              enablePoweredByContainer={false}
            />
          </View>
          <View style={styles.formRow}>
            <GooglePlacesAutocomplete
              placeholder="Drop"
              currentLocation={true}
              predefinedPlaces={[homePlace]}
              onPress={(data, details = null) => {
                console.log(data, details);
                console.log(
                  "LOcation",
                  JSON.stringify(details?.geometry?.location)
                );
                var test = {
                  latitude: details?.geometry?.location?.lat,
                  longitude: details?.geometry?.location?.lng,
                };
                setTo({
                  coordinates: test,
                  locationName: data?.structured_formatting?.main_text,
                });
                setEnd(test);
                traceRoute();
              }}
              query={{
                key: "AIzaSyATpSrcISxeRrwW8iTnB2j_C8UNR7Dv4f8",
                language: "en",
              }}
              minLength={2}
              GooglePlacesDetailsQuery={{ fields: "geometry" }}
              autoFocus={false}
              returnKeyType={"default"}
              fetchDetails={true}
              enablePoweredByContainer={false}
              currentLocationLabel="Current location"
            />
          </View>
          <View style={styles.mMap}>
            <MapView
              ref={mapRef}
              style={StyleSheet.absoluteFill}
              initialRegion={pickupCords}
            >
              <Marker
                coordinate={pickupCords}
                image={require("../../../../assets/images/Oval2x.png")}
              />
              <Marker
                coordinate={droplocationCords}
                image={require("../../../../assets/images/greenMarker2x.png")}
              />
              <MapViewDirections
                origin={pickupCords}
                destination={droplocationCords}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={6}
                strokeColor="purple"
                optimizeWaypoints={true}
                onReady={(result) => {
                  mapRef.current.fitToCoordinates(result.coordinates);
                }}
              />
            </MapView>
          </View>
        </View>
      </Content>
      <View style={styles.footerBtn}>
        <View style={styles.footerBtnInfo}>
          <Button
            style={styles.selectBtn}
            onPress={() => {
              onClick();

              // traceRoute();
            }}
          >
            <Text style={styles.shareBtnText}>hELLO</Text>
          </Button>
        </View>
      </View>
    </Container>
  );
}
