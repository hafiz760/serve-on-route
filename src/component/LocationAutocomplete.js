import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ScrollView,
} from 'react-native';
import {Text} from './Basic';
import axios from 'axios';
import {COLOR, FAMILY, SIZE} from '../theme/typography';

/**
 * Custom Location Autocomplete Component
 * Provides a stable input with dropdown suggestions below the input
 */
const LocationAutocomplete = ({
  placeholder,
  onLocationSelect,
  apiKey,
  predefinedPlaces = [],
  value,
}) => {
  const [searchText, setSearchText] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (value) {
      setSearchText(value);
    }
  }, [value]);

  const fetchSuggestions = async text => {
    if (text.length < 2) {
      setSuggestions(predefinedPlaces);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input: text,
            key: apiKey,
            language: 'en',
          },
        },
      );

      if (response.data.predictions) {
        const results = response.data.predictions.map(prediction => ({
          description: prediction.description,
          place_id: prediction.place_id,
        }));
        setSuggestions([...predefinedPlaces, ...results]);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Autocomplete error:', error);
      }
      setSuggestions(predefinedPlaces);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = text => {
    setSearchText(text);
    if (text.length >= 2 || text.length === 0) {
      fetchSuggestions(text);
      setShowDropdown(true);
    }
  };

  const handleSelectLocation = async item => {
    setSearchText(item.description);
    setShowDropdown(false);
    Keyboard.dismiss();

    if (item.isPredefined) {
      onLocationSelect(item);
      return;
    }

    // Fetch place details to get coordinates
    try {
      const detailsResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id: item.place_id,
            key: apiKey,
            fields: 'geometry',
          },
        },
      );

      if (detailsResponse.data.result?.geometry?.location) {
        const {lat, lng} = detailsResponse.data.result.geometry.location;
        onLocationSelect({
          description: item.description,
          latitude: lat,
          longitude: lng,
        });
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Place details error:', error);
      }
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectLocation(item)}>
      <Text style={styles.suggestionText}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={searchText}
        onChangeText={handleTextChange}
        onFocus={() => {
          if (searchText.length >= 2 || predefinedPlaces.length > 0) {
            fetchSuggestions(searchText);
            setShowDropdown(true);
          }
        }}
        onBlur={() => {
          setTimeout(() => setShowDropdown(false), 200);
        }}
      />
      {showDropdown && suggestions.length > 0 && (
        <View style={styles.dropdownContainer}>
          <ScrollView
            style={styles.suggestionList}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}>
            {suggestions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => handleSelectLocation(item)}>
                <Text style={styles.suggestionText}>{item.description}</Text>
              </TouchableOpacity>
            ))}
            {loading && <Text style={styles.loadingText}>Loading...</Text>}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    elevation: 1000, // For Android
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    height: 45,
    color: '#000',
    fontSize: 14,
    paddingHorizontal: 15,
    fontFamily: FAMILY.REGULAR,
    zIndex: 1, // Ensure input is below dropdown
  },
  dropdownContainer: {
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 10,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Increased elevation for Android
    zIndex: 2000, // Very high z-index
  },
  suggestionList: {
    maxHeight: 200,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: 'white',
  },
  suggestionText: {
    fontSize: SIZE.SIZE_14,
    color: '#000',
    fontFamily: FAMILY.REGULAR,
  },
  loadingText: {
    padding: 15,
    textAlign: 'center',
    color: '#9CA3AF',
    fontFamily: FAMILY.REGULAR,
  },
});

export default LocationAutocomplete;