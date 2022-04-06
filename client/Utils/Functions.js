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
  try {
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
  } catch (error) {
    console.log(error)
  }
};


export const _sendPushNotification = async (notificationInfo) => {
  try {
    if (notificationInfo.To === null) { // במקרה ואין פוש טוקן לא ניתן לשלוח התראת פוש
      return false;
    }
    const message = {
      to: notificationInfo.To, // הטוקן של המשתמש אליו נשלח את ההתראה
      sound: 'default',  // צליל ההתראה
      title: notificationInfo.Title,  // כותרת ההתראה
      body: notificationInfo.Body, // גוף ההודעה בהתראה
      // הנתונים אותם נשלח בהתראה
      data: notificationInfo.Data,
      categoryId: notificationInfo.CategoryIdentifier // קטגוריית ההתראה, מה שמאפשר ליצור התראות עם כפתורים
    };
    // יצירת הבקשה להתראת פוש באמצעות אקספו
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    return true;
  } catch (error) {
    console.log(error)
  }
};

export const _logout = async (navigation) => {
  try {
    const res = await _removeData("User");
    if (res) {
      navigation.replace("LoginScreen");
      console.log("Sign out");
    }
  } catch (error) {
    console.log(error);
  }
}

export const _diff_minutes = (dt2, dt1) => {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));

}

