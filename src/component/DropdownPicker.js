import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {HP, platformOrientedCode, WP} from '../../Shared/responsive';
import {family} from '../../Shared/family';
import {size} from '../../Shared/sizes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLOR } from '../theme/typography';

export const DropdownPicker = ({
  data,
  title,
  onSelect,
  errorMessage,
  defaultButtonText = 'Choose an option',
  defaultValue,
  customButtonStyle
}) => {
  return (
    <View style={styles.pickerContainer}>
      {title && <Text style={styles.labelTxtStyle}>{title}</Text>}
      <SelectDropdown
        data={data}
        onSelect={onSelect}
        dropdownStyle={styles.dropdownStyle}
        renderButton={(selectedItem, isOpened) => {
          const displayText = selectedItem
            ? selectedItem.title
            : defaultValue
            ? defaultValue
            : defaultButtonText;
          const isDefault = !selectedItem && !defaultValue;

          return (
            <View style={[styles.dropdownButtonStyle,customButtonStyle]}>
              {selectedItem && (
                <Icon name={selectedItem.icon} style={styles.dropdownButtonIconStyle} />
              )}
              <Text
                style={[
                  styles.dropdownButtonTxtStyle,
                  isDefault ? styles.defaultButtonTextStyle : styles.selectedButtonTextStyle,
                ]}
              >
                {displayText}
              </Text>
              <Icon
                name={isOpened ? 'chevron-up' : 'chevron-down'}
                style={styles.dropdownButtonArrowStyle}
                size={22}
              />
            </View>
          );
        }}
        renderItem={(item, index, isSelected) => (
          <View
            style={{
              ...styles.dropdownItemStyle,
              ...(isSelected && {backgroundColor:"white"}),
            }}
          >
            <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
          </View>
        )}
      />
      {errorMessage ? (
        <Text style={styles.errorTxtStyle}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    marginVertical: 5, // Adjust as needed
  },
  labelTxtStyle: {
    color:COLOR.PRIMARY,
    fontSize: 14,
    paddingBottom:10,
    // fontFamily: family.SFProText_Light,
  },
  dropdownStyle: {
    marginTop:4, // Ensure no gap between button and dropdown
    padding: 0,
    borderRadius: 10,
    borderWidth: 1,
    // borderColor: "red",
    // backgroundColor: "red",
    zIndex: 1000, // Ensure it overlays other components
  },
  dropdownButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 55,
    // width:90,
    backgroundColor: "white",
    borderRadius: 10,
    // borderWidth: 1,
    borderColor:"grey",
    paddingHorizontal: 10,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    textAlign: 'left',
    color: "black",
    fontSize: 15,
    // fontFamily: family.SFProText_Light,
  },
  defaultButtonTextStyle: {
    color:COLOR.PRIMARY,
    paddingLeft: 10,
  },
  selectedButtonTextStyle: {
    color: COLOR.PRIMARY,
  },
  dropdownButtonIconStyle: {
    marginRight: 10,
  },
  dropdownButtonArrowStyle: {
    marginLeft: 10,
    color: COLOR.PRIMARY,
  },
  dropdownItemStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 0.7,
    borderColor: "grey",
  },
  dropdownItemIconStyle: {
    marginRight: 10,
  },
  dropdownItemTxtStyle: {
    color: "black",
    fontSize: 15,
  },
  errorTxtStyle: {
    color: "black",
    fontSize: 14,
    // fontFamily: family.SFProText_Light,
  },
});

export default DropdownPicker;
