import AsyncStorage from '@react-native-async-storage/async-storage';

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
