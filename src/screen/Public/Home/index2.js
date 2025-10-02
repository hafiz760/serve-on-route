import React, { useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Container, Content, Text } from "../../../component/Basic";
import { DarkStatusBar } from "../../../component/StatusBar";
import { Button } from "../../../component/Form";
import styles from "./styles";

import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Header from "../../../component/Header";
// import {GOOGLE_MAPS_KEY} from "@env"
import { BASE_URL,URL_V, GOOGLE_MAPS_KEY } from "../../../utilities/helper";
// const GOOGLE_MAPS_APIKEY = "AIzaSyATpSrcISxeRrwW8iTnB2j_C8UNR7Dv4f8";
const GOOGLE_MAPS_APIKEY = GOOGLE_MAPS_KEY;

const HomeComponent = () => {
  const mapRef = useRef(null);
  const [state, setState] = useState({
    pickupCords: {
      latitude: 31.5204,
      longitude: 74.3587,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    droplocationCords: {
      latitude: 31.4504,
      longitude: 73.135,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  });

  const { pickupCords, droplocationCords } = state;

  return (
    <Container>
      <DarkStatusBar />
      <Header leftType="menu" title={"TRUCKIE"} />
      <Content>
        <View style={styles.homeContainer}>
          <View style={styles.formRow}>
            <GooglePlacesAutocomplete
              placeholder="Search"
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                console.log(data, details);
              }}
              query={{
                key: GOOGLE_MAPS_APIKEY,
                language: "en",
              }}
            />
          </View>
          <View style={styles.formRow}>
            <GooglePlacesAutocomplete
              placeholder="Search"
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                console.log(data, details);
              }}
              query={{
                key: GOOGLE_MAPS_APIKEY,
                language: "en",
              }}
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
};

export default HomeComponent;
