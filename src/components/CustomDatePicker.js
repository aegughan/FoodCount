import React, {useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Button, StyleSheet, Text, View} from 'react-native';
export const CustomDatePicker = ({name, value, handleChange}) => {
  const [showPicker, setShowPicker] = useState(false);
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    handleChange(name, currentDate);
    setShowPicker(false);
  };

  const onButtonPress = () => {
    setShowPicker(true);
  };

  // TODO: Instead of Button Icon shoul be replaced
  return (
    <View style={styles.DateContainer}>
      <View style={styles.DateInput}>
        <Text style={{...styles.defaultColor}}>
          {`${value?.getDate()}/${
            (value?.getMonth() || 0) + 1
          }/${value?.getFullYear()}`}
        </Text>
      </View>
      <View style={styles.DateButton}>
        <Button onPress={onButtonPress} title="Select Date" />
      </View>
      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  DateContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 5,
  },
  DateInput: {
    width: '60%',
  },
  DateButton: {
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultColor: {
    color: 'black',
    fontSize: 18,
    borderWidth: 0.5,
    padding: 10,
  },
});
