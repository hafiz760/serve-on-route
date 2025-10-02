import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// import {GOOGLE_MAPS_KEY} from "@env"
import { BASE_URL,URL_V, GOOGLE_MAPS_KEY } from "../../../utilities/helper";
// const GOOGLE_MAPS_APIKEY = "AIzaSyATpSrcISxeRrwW8iTnB2j_C8UNR7Dv4f8";
const GOOGLE_MAPS_APIKEY = GOOGLE_MAPS_KEY;
console.log("GOOGLE_MAPS_APIKEY",GOOGLE_MAPS_APIKEY);

const GoogleAutoCompleteComponent = ({ placeholder, handlePress }) => {
  return (
    <GooglePlacesAutocomplete
      placeholder={placeholder}
      //   currentLocation={true}
      currentLocationLabel="Current location"
      onPress={(data, details = null) => {
        handlePress(data, details);
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
    />
  );
};

export default GoogleAutoCompleteComponent;
