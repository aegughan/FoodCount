import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
// import AntDesign from 'react-native-vector-icons/AntDesign';

const DropdownComponent = ({
  Label,
  dataList,
  ValueField,
  LabelField,
  onChangeHandler,
  name,
}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && {color: 'blue'}]}>{Label}</Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={dataList}
        search
        maxHeight={300}
        labelField={LabelField}
        valueField={ValueField}
        placeholder={!isFocus ? `${Label}` : '...'}
        searchPlaceholder="Search..."
        renderItem={item => {
          return (
            <View>
              <Text style={{...styles.dropdownItemStyle}}>
                {item[LabelField]}
              </Text>
            </View>
          );
        }}
        // searchQuery={(keyword, labelValue) => {
        //   console.log('keyword, labelValue', keyword, labelValue);
        //   return labelValue.includes(keyword);
        // }}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item[ValueField]);
          onChangeHandler(name, item[ValueField]);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 40,
    borderColor: 'black',
    borderWidth: 0.5,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 20,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  dropdownItemStyle: {
    padding: 10,
    fontSize: 16,
  },
});
