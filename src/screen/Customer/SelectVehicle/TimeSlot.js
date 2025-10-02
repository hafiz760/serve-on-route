import React, { useState } from 'react';
import { View, Text, Picker, Platform, StyleSheet } from 'react-native';

const TimeSelection = () => {
  const [selectedHour, setSelectedHour] = useState('09');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedPeriod, setSelectedPeriod] = useState('AM');

  const handleHourChange = (hour) => {
    setSelectedHour(hour);
  };

  const handleMinuteChange = (minute) => {
    setSelectedMinute(minute);
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Time:</Text>

      <View style={styles.timePickerContainer}>
        <Picker
          selectedValue={selectedHour}
          onValueChange={(itemValue) => handleHourChange(itemValue)}
          style={styles.picker}
        >
          {[...Array(12).keys()].map((hour) => (
            <Picker.Item key={hour} label={`${hour + 1}`} value={hour < 9 ? `0${hour + 1}` : `${hour + 1}`} />
          ))}
        </Picker>

        <Text style={styles.separator}>:</Text>

        <Picker
          selectedValue={selectedMinute}
          onValueChange={(itemValue) => handleMinuteChange(itemValue)}
          style={styles.picker}
        >
          {['00', '15', '30', '45'].map((minute) => (
            <Picker.Item key={minute} label={minute} value={minute} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedPeriod}
          onValueChange={(itemValue) => handlePeriodChange(itemValue)}
          style={styles.periodPicker}
        >
          <Picker.Item label="AM" value="AM" />
          <Picker.Item label="PM" value="PM" />
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    height: 50,
    width: 80,
  },
  separator: {
    fontSize: 18,
    marginHorizontal: 5,
  },
  periodPicker: {
    height: 50,
    width: 80,
  },
});

export default TimeSelection;
