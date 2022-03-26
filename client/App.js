import React, { useState, useEffect } from 'react';
import { View, Text, I18nManager } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import paperTheme from './utils/PaperTheme';
import MyDrawer from './navigation/MyDrawer';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import GeneralContext from './utils/GeneralContext';
import LoginStack from './navigation/LoginStack';

// עושה שהאפליקציה תהיה מותאמת לכיוון עברית RTL
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

// טוען את הפונטים שאנו רוצים
const fetchFonts = () => {
  return Font.loadAsync({
    'our-font-thin': require('./assets/fonts/MPLUSRounded1c-Thin.ttf'),
    'our-font-light': require('./assets/fonts/MPLUSRounded1c-Light.ttf'),
    'our-font-regular': require('./assets/fonts/MPLUSRounded1c-Regular.ttf'),
    'our-font-medium': require('./assets/fonts/MPLUSRounded1c-Medium.ttf'),
    'our-font-bold': require('./assets/fonts/MPLUSRounded1c-Bold.ttf'),
  });
};

export default function App(props) {
  const [dataLoaded, setDataLoaded] = useState(false); //משתנה שבודק האם הפונטים כבר נטענו

  //  General global states
  const [currentDrawerScreen, setCurrentDrawerScreen] = useState("homeStack");

  // אם הפונטים עוד לא נטענו אז דואג לטעון אותם
  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setDataLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }

  return (
    <GeneralContext.Provider value={{ currentDrawerScreen, setCurrentDrawerScreen }}>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer>
          <LoginStack />
        </NavigationContainer>
      </PaperProvider>
    </GeneralContext.Provider>
  );
}
