import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export const _getData = async (key) => {

  try {
    let d = await AsyncStorage.getItem(key)
    if (d !== null) {
      console.log('get Data Key=: ' + key)
      return (JSON.parse(d))
    }
    console.log(key + ' is null')
    return null;
  }
  catch (error) {
    console.log(error)
    return null;
  }
}

export const _storeData = async (Key, obj) => {
  try {
    await AsyncStorage.setItem(Key, JSON.stringify(obj));
    console.log(`${Key} save successes`);
    return true;
  }
  catch (error) {
    console.log(error);
    return null;
  }
}

export const _removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.log("error while remove data from async storage")
  }
};

export const _registerForPushNotificationsAsync = async () => {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
};

export const _diff_minutes = (dt2, dt1) => {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));

}
