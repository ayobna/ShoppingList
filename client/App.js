import React, { useState, useEffect, useRef } from 'react';
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
import * as Notifications from 'expo-notifications';


// עושה שהאפליקציה תהיה מותאמת לכיוון עברית RTL
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);


// מאפשר קבלת פוש נוטיפיקיישן
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

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

const App = (props) => {
  const responseListener = useRef(); //  מחזיק מידע לגבי פוש נוטיפיקיישן
  const [dataLoaded, setDataLoaded] = useState(false); //משתנה שבודק האם הפונטים כבר נטענו
  //  General global states
  const [currentDrawerScreen, setCurrentDrawerScreen] = useState("homeStack");
  const [requestDataGlobal, setRequestDataGlobal] = useState();

  useEffect(() => {

    // יצירת קטגוריות לפוש נוטיפיקיישןת מה שמאפשר שימוש בכפתורים בתוך ההתראה
    Notifications.setNotificationCategoryAsync("request", [{ identifier: "ok", buttonTitle: "אשר בקשה" }, { identifier: "cancel", buttonTitle: "דחה בקשה" }]);

    // מאזין לקבלת התראות
    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(async response => {

      if (response.notification.request.content.categoryIdentifier === "request") { // במידה ואנחנו הגענו בפוש של הזמנה לרשימה
        let data = { ...response.notification.request.content.data, timeStamp: new Date().getTime() };

        switch (response.actionIdentifier) {

          case "ok": // אם המשתמש לחץ אשר
            console.log("Ok")
            data = { ...data, actionIdentifier: "ok" };
            setRequestDataGlobal(data);
            Notifications.dismissNotificationAsync(response.notification.request.identifier); // מעלים את ההתראה
            break;
          case "cancel": // אם המשתמש לחץ בטל
            console.log("Cancel")
            data = { ...data, actionIdentifier: "cancel" };
            setRequestDataGlobal(data);
            Notifications.dismissNotificationAsync(response.notification.request.identifier); // מעלים את ההתראה
            break;
          default:  // אם המשתמש לחץ על ההתראה עצמה ולא על אחד הכפתורים
            console.log("default")
            data = { ...data, actionIdentifier: "default" };
            setRequestDataGlobal(data);
            break;
        }
      }
    });

  }, []);


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
    <GeneralContext.Provider value={{ currentDrawerScreen, setCurrentDrawerScreen, requestDataGlobal, setRequestDataGlobal }}>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer>
          <LoginStack />
        </NavigationContainer>
      </PaperProvider>
    </GeneralContext.Provider>
  );
}

export default App;
