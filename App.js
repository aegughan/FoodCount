/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import FoodList from './src/SampleData/FoodList';
import UserList from './src/SampleData/UserList';
import Data from './src/SampleData/Data';
import {CustomDatePicker} from './src/components/CustomDatePicker';
import DropdownComponent from './src/components/DropdownComponent';
import {TableComponent} from './src/components/TableComponent';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [foodList, setFoodList] = useState(FoodList);
  const [userList, setUserList] = useState(UserList);
  const [foodData, setFoodData] = useState({});
  const [formData, setFormData] = useState({foodDate: new Date()});

  useEffect(() => {
    const setInitialData = async () => {
      try {
        await AsyncStorage.setItem('FoodList', JSON.stringify(FoodList));
      } catch (e) {
        console.log('Erro occured: AsyncStorage FoodList', e);
      }
      try {
        await AsyncStorage.setItem('UserList', JSON.stringify(UserList));
      } catch (e) {
        console.log('Erro occured: AsyncStorage UserList', e);
      }
      try {
        const value = await AsyncStorage.getItem('FoodData');
        if (value) {
          setFoodData(JSON.parse(value));
        }
      } catch (e) {
        console.log('Erro occured: AsyncStorage Data', e);
      }
    };
    setInitialData();
  }, []);

  const updateFoodData = async updatedData => {
    try {
      await AsyncStorage.setItem('FoodData', JSON.stringify(updatedData));
      setFoodData(updatedData);
    } catch (e) {
      console.log('Erro occured: AsyncStorage UserList', e);
    }
  };

  const onChangeHandler = async (name, value) => {
    if (name === 'SelectedFood') {
      setFormData({
        ...formData,
        [name]: value,
        foodAmount: getFoodAmount(value)?.toString(),
      });
    } else if (name === 'foodAmount') {
      setFormData({
        ...formData,
        [name]: value,
      });
      const foodListData = foodList.map(obj => {
        if (obj.Name === formData.SelectedFood) {
          return {
            Name: formData.SelectedFood,
            Price: value,
          };
        }
        return obj;
      });
      setFoodList(foodListData);
      try {
        await AsyncStorage.setItem('FoodList', JSON.stringify(foodListData));
      } catch (e) {
        console.log('Erro occured: AsyncStorage FoodList', e);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const getFoodAmount = foodName => {
    return foodList.find(obj => {
      return obj.Name === foodName;
    }).Price;
  };

  const AddFood = () => {
    const currentDate = `${formData?.foodDate?.getDate()}/${
      (formData?.foodDate?.getMonth() || 0) + 1
    }/${formData?.foodDate?.getFullYear()}`;
    let userData = {};
    let foodCount = 0;
    if (foodData[currentDate] && foodData[currentDate][formData.SelectedUser]) {
      userData = foodData[currentDate][formData.SelectedUser];
    }
    if (
      foodData[currentDate] &&
      foodData[currentDate][formData.SelectedUser] &&
      foodData[currentDate][formData.SelectedUser][formData?.SelectedFood]
    ) {
      foodCount =
        foodData[currentDate][formData.SelectedUser][formData?.SelectedFood]
          .Count;
    }
    const updatedData = {
      ...(foodData || {}),
      [currentDate]: {
        ...(foodData[currentDate] || {}),
        [formData.SelectedUser]: {
          ...userData,
          [formData.SelectedFood]: {
            Count: foodCount + 1,
            Amount: (foodCount + 1) * Number(formData.foodAmount),
          },
        },
      },
    };
    updateFoodData(updatedData);
  };

  const AddUser = async () => {
    if (formData?.addUserName) {
      const isUserAlreadyAdded = userList.some(obj => {
        return (
          obj?.Name?.toLowerCase() === formData?.addUserName?.toLowerCase()
        );
      });
      if (!isUserAlreadyAdded) {
        const userListData = userList;
        userListData.push({Name: formData?.addUserName});
        setUserList(userListData);
        try {
          await AsyncStorage.setItem('UserList', JSON.stringify(userListData));
          Alert.alert('', 'User added successfully', [
            {
              text: 'Ok',
              onPress: () => {
                console.log('User added successfully');
              },
            },
          ]);
        } catch (e) {
          console.log('Erro occured: AsyncStorage UserList', e);
        }
      } else {
        Alert.alert('', 'User already added', [
          {
            text: 'Ok',
            onPress: () => {
              console.log('User added');
            },
          },
        ]);
      }
    }
  };

  const AddFoodName = async () => {
    if (formData?.addFoodName) {
      const isFoodAlreadyAdded = foodList.some(obj => {
        return (
          obj?.Name?.toLowerCase() === formData?.addFoodName?.toLowerCase()
        );
      });
      if (!isFoodAlreadyAdded) {
        const foodListData = foodList;
        foodListData.push({Name: formData?.addFoodName, Price: 30});
        setFoodList(foodListData);
        try {
          await AsyncStorage.setItem('FoodList', JSON.stringify(foodListData));
          Alert.alert('', 'Food added successfully', [
            {
              text: 'Ok',
              onPress: () => {
                console.log('Food added successfully');
              },
            },
          ]);
        } catch (e) {
          console.log('Erro occured: AsyncStorage FoodList', e);
        }
      } else {
        Alert.alert('', 'Food already added', [
          {
            text: 'Ok',
            onPress: () => {
              console.log('Food added');
            },
          },
        ]);
      }
    }
  };

  const RemoveFood = (userName, foodName) => {
    const currentDate = `${formData?.foodDate?.getDate()}/${
      (formData?.foodDate?.getMonth() || 0) + 1
    }/${formData?.foodDate?.getFullYear()}`;
    let userData = {};
    let foodCount = 0;
    let foodAmount = 0;
    if (userName) {
      if (foodData[currentDate] && foodData[currentDate][userName]) {
        userData = foodData[currentDate][userName];
      }
      if (
        foodData[currentDate] &&
        foodData[currentDate][userName] &&
        foodData[currentDate][userName][foodName]
      ) {
        foodCount =
          foodData[currentDate][userName][foodName]
            .Count;
      }
      if (
        foodData[currentDate] &&
        foodData[currentDate][userName] &&
        foodData[currentDate][userName][foodName]
      ) {
        foodAmount =
          foodCount > 0
            ? (foodCount - 1) * getFoodAmount(foodName)
            : 0;
      }
      const updatedData = {
        ...(foodData || {}),
        [currentDate]: {
          ...(foodData[currentDate] || {}),
          [userName]: {
            ...userData,
            [foodName]: {
              Count: foodCount >= 0 ? foodCount - 1 : 0,
              Amount: foodAmount,
            },
          },
        },
      };
      updateFoodData(updatedData);
    } else {
      if (foodData[currentDate] && foodData[currentDate][formData.SelectedUser]) {
        userData = foodData[currentDate][formData.SelectedUser];
      }
      if (
        foodData[currentDate] &&
        foodData[currentDate][formData.SelectedUser] &&
        foodData[currentDate][formData.SelectedUser][formData?.SelectedFood]
      ) {
        foodCount =
          foodData[currentDate][formData.SelectedUser][formData?.SelectedFood]
            .Count;
      }
      if (
        foodData[currentDate] &&
        foodData[currentDate][formData.SelectedUser] &&
        foodData[currentDate][formData.SelectedUser][formData?.SelectedFood]
      ) {
        foodAmount =
          foodCount > 0
            ? (foodCount - 1) * getFoodAmount(formData?.SelectedFood)
            : 0;
      }
      const updatedData = {
        ...(foodData || {}),
        [currentDate]: {
          ...(foodData[currentDate] || {}),
          [formData.SelectedUser]: {
            ...userData,
            [formData.SelectedFood]: {
              Count: foodCount >= 0 ? foodCount - 1 : 0,
              Amount: foodAmount,
            },
          },
        },
      };
      updateFoodData(updatedData);
    }
  };

  const ClearStorage = () => {
    Alert.alert('', 'Are you sure?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
      },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('FoodData');
            setFoodData({});
          } catch (e) {
            console.log('Erro occured: AsyncStorage FoodData', e);
          }
        },
      },
    ]);
  };

  const ClearDateStorage = () => {
    const currentDate = `${formData?.foodDate?.getDate()}/${
      (formData?.foodDate?.getMonth() || 0) + 1
    }/${formData?.foodDate?.getFullYear()}`;
    Alert.alert('', `Are you sure to delete the data on ${currentDate}?`, [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
      },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            const updatedFoodData = foodData;
            if (updatedFoodData[currentDate]) {
              delete updatedFoodData[currentDate];
            }
            updateFoodData(updatedFoodData);
          } catch (e) {
            console.log('Erro occured: AsyncStorage FoodData', e);
          }
        },
      },
    ]);
  };

  const foodTableHeader = ['Name', 'Food', 'Count', 'Amount', ''];
  const overallTableHeader = ['Food', 'Count', 'Amount'];
  const amountPaidHeader = ['Name', 'Amount'];
  const foodTableData = [];
  const overallFoodCount = {};
  let overallAmountToBePaid = [];

  const currentDate = `${formData?.foodDate?.getDate()}/${
    (formData?.foodDate?.getMonth() || 0) + 1
  }/${formData?.foodDate?.getFullYear()}`;

  if (foodData[currentDate]) {
    Object.entries(foodData[currentDate]).forEach(key => {
      Object.entries(key[1]).forEach(([foodName, foodVal]) => {
        if (foodVal.Count > 0) {
          if (!overallFoodCount[foodName]) {
            overallFoodCount[foodName] = {};
            overallFoodCount[foodName].Count = 0;
            overallFoodCount[foodName].Amount = 0;
          }
          const keyList = [];
          keyList.push(key[0]);
          keyList.push(foodName);
          keyList.push(foodVal.Count);
          keyList.push(foodVal.Amount);
          keyList.push(<Button
            onPress={() => {RemoveFood(key[0],foodName)}}
            title="Remove"
          />);
          foodTableData.push(keyList);
          overallFoodCount[foodName].Count += foodVal.Count;
          overallFoodCount[foodName].Amount += foodVal.Amount;
        }
      });
    });
  }
  const perPersonAmountVal = {};
  if (foodData) {
    Object.entries(foodData).forEach(foodObj => {
      Object.entries(foodObj[1]).forEach(([personName, val]) => {
        Object.entries(val).forEach((obj) => {
          if (!perPersonAmountVal[personName]){ perPersonAmountVal[personName] = 0;}
          perPersonAmountVal[personName] += obj[1].Amount;
        });
      });
    });
  }
  overallAmountToBePaid = Object.entries(perPersonAmountVal);

  const overallTableData = [];
  let totalAmount = 0;
  Object.entries(overallFoodCount).forEach(([foodName, foodObj]) => {
    overallTableData.push([foodName, foodObj.Count, foodObj.Amount]);
    totalAmount += foodObj.Amount;
  });

  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            ...styles.sectionDescription,
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text style={{...styles.defaultColor, ...styles.headerStyle}}>
            Food Count
          </Text>
          <CustomDatePicker
            name="foodDate"
            value={formData?.foodDate || new Date()}
            handleChange={onChangeHandler}
          />
          <DropdownComponent
            Label="Select User"
            dataList={userList}
            ValueField="Name"
            LabelField="Name"
            name="SelectedUser"
            onChangeHandler={onChangeHandler}
          />
          <DropdownComponent
            Label="Select Food"
            dataList={foodList}
            ValueField="Name"
            LabelField="Name"
            name="SelectedFood"
            onChangeHandler={onChangeHandler}
          />
          <View>
            <Text style={styles.Label}>Food Amount</Text>
            <TextInput
              style={styles.input}
              value={formData.foodAmount}
              onChangeText={text => onChangeHandler('foodAmount', text)}
            />
          </View>
          <View style={styles.buttons}>
            <View style={styles.buttonStyle}>
              <Button onPress={AddFood} title="Add" />
            </View>
            <View style={styles.buttonStyle}>
              <Button onPress={RemoveFood} title="Remove" />
            </View>
            <View style={styles.buttonStyle}>
              <Button onPress={ClearStorage} title="Clear Storage" />
            </View>
            <View style={styles.buttonStyle}>
              <Button onPress={ClearDateStorage} title="Clear Date Storage" />
            </View>
          </View>
          {/* <Text>{JSON.stringify(foodData)}</Text> */}
        </View>
        <View>
          <Text style={styles.subHeading}>Each Person List</Text>
          <TableComponent
            tableHeader={foodTableHeader}
            tableData={foodTableData}
          />
        </View>
        <View>
          <Text style={styles.subHeading}>Overall List</Text>
          <TableComponent
            tableHeader={overallTableHeader}
            tableData={overallTableData}
          />
        </View>
        <View>
          <Text style={{...styles.subHeading, ...styles.totalAmount}}>
            Total Amount: {totalAmount}
          </Text>
        </View>
        <View>
          <Text style={styles.subHeading}>Amount to be paid</Text>
          <TableComponent
            tableHeader={amountPaidHeader}
            tableData={overallAmountToBePaid}
          />
        </View>
        <View>
          <Text style={styles.Label}>Add User</Text>
          <TextInput
            style={styles.input}
            value={formData.addUserName}
            onChangeText={text => onChangeHandler('addUserName', text)}
          />
          <View style={styles.buttonStyle}>
            <Button onPress={AddUser} title="Add User" />
          </View>
        </View>
        <View>
          <Text style={styles.Label}>Add Food</Text>
          <TextInput
            style={styles.input}
            value={formData.addFoodName}
            onChangeText={text => onChangeHandler('addFoodName', text)}
          />
          <View style={styles.buttonStyle}>
            <Button onPress={AddFoodName} title="Add Food" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  defaultColor: {
    color: 'black',
  },
  Label: {
    color: 'black',
    padding: 16,
    paddingBottom: 2,
    paddingTop: 0,
  },
  headerStyle: {
    fontSize: 20,
    textAlign: 'center',
    padding: 10,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  input: {
    height: 40,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 5,
    borderWidth: 0.5,
    padding: 10,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    padding: 16,
    flexWrap: 'wrap',
  },
  buttonStyle: {
    width: '40%',
    margin: 10,
  },
  subHeading: {
    fontWeight: 'bold',
    padding: 5,
    fontSize: 14,
    color: 'black',
  },
  totalAmount: {
    marginBottom: 50,
    fontSize: 22,
  },
});

export default App;
