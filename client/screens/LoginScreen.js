import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import { User } from "../User";
import { _storeData, _getData } from "../utils/Functions";
import { Button, TextInput, HelperText, Avatar, Caption } from "react-native-paper";
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API, loginApi } from "../api/api";


// WebBrowser.maybeCompleteAuthSession();
const LoginScreen = (props) => {
  // props
  const { navigation } = props;

  // states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loginUserDetails, setLoginUserDetails] = useState();
  const [loginErrorMessage, setLoginErrorMessage] = useState("");


  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", async () => {
      clearLoginStates();
    });
    return unsubscribe;
  }, [navigation]);

  const clearLoginStates = () => {
    setEmail("");
    setPassword("");
    setIsPasswordVisible(false);
    setLoginErrorMessage("");
  };

  const Register = () => {


    navigation.navigate('RegisterScreen')

  };



  const handleLogin = async () => {
    if (email === "" || password === "") {
      setLoginErrorMessage("כל השדות חייבים להיות מלאים!");
      return;
    }
    const userDetails = await checkLoginDetails();
    if (!userDetails || userDetails === null) {
      setLoginErrorMessage("היוזר לא קיים / הפרטים שגויים!");
      return;
    }
    setLoginErrorMessage("");
    // notification
    const notificationToken = "";
    userDetails.notificationToken = notificationToken;
    const updateTokenRes = await updateUserNotificationToken(userDetails.userID, notificationToken);
    if (!updateTokenRes) {
      console.log("something wrong with the token update")
      return;
    }
    console.log( 'login screen userDetails',userDetails)

    const resOfDataStore = await _storeData("User", userDetails);
    // צריך פה לשמור תאריך התחברות אחרון
    if (resOfDataStore) {
      navigation.replace("myDrawer");
    }

  };

  const checkLoginDetails = async () => {
    try {
      const userDetails = { Email: email, Password: password };
      let res = await loginApi.apiLoginCheckLoginDetailsPost(userDetails);
      return res.data;
    } catch (error) {
      console.log(error)
    }
  };

  const updateUserNotificationToken = async (userID, notificationToken) => {
    try {
      const userDetails = { UserID: userID, NotificationToken: notificationToken };
      let res = await loginApi.apiLoginUpdateUserNotificationTokenPost(userDetails);
      return res.data;
    } catch (error) {
      console.log(error);
    }

  };
  // const discovery = useAutoDiscovery('https://login.microsoftonline.com/0ff03880-4d75-4d76-889a-26760370fcd3/v2.0');
  // const [request, response, promptAsync] = useAuthRequest(
  //   {
  //     clientId: '6d6f2820-78ec-4918-a473-56f6b691fb56',
  //     scopes: ['openid', 'profile', 'email', 'offline_access'],
  //     redirectUri: makeRedirectUri({
  //       scheme: 'client'
  //       }),
  //   },
  //   discovery
  // );

  //
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.smallWrapper}>
            {/* <Image style={styles.bgImage} source={null} /> */}
            <View>
              <Text style={styles.title}>קניות בלייב</Text>
            </View>

            <View>
              <TextInput
                label="אימייל"
                mode="outlined"
                value={email}
                onChangeText={text => setEmail(text)}
                selectionColor="#919191"
                activeOutlineColor="#919191"
                dense
                style={{ backgroundColor: "white" }}
                left={<TextInput.Icon color={loginErrorMessage !== "" ? "#d0312d" : "#c1c1c1"} name="email-outline" />}
                error={loginErrorMessage !== ""}
              />

            </View>

            <View>
              <TextInput
                label="סיסמה"
                mode="outlined"
                value={password}
                secureTextEntry={!isPasswordVisible}
                onChangeText={text => setPassword(text)}
                selectionColor="#919191"
                activeOutlineColor="#919191"
                dense
                style={{ backgroundColor: "white" }}
                left={<TextInput.Icon color={loginErrorMessage !== "" ? "#d0312d" : "#c1c1c1"} name="lock-outline" />}
                right={<TextInput.Icon forceTextInputFocus={false} color="#919191" name={!isPasswordVisible ? "eye" : "eye-off"} onPress={() => setIsPasswordVisible(!isPasswordVisible)} />}
                error={loginErrorMessage !== ""}
              />

            </View>


            <TouchableOpacity style={styles.btnForgotPassword} onPress={() => null}>
              <Text style={styles.btnText}>שכחת סיסמא?</Text>
            </TouchableOpacity>

            {
              loginErrorMessage.length > 0 &&
              <View>
                <Caption style={{ color: "#d0312d" }}>{loginErrorMessage}</Caption>
              </View>
            }
            <Button
              //mode="outlined"
              theme={{ colors: { primary: `white` } }}
              labelStyle={{ color: "black" }}
              contentStyle={{ backgroundColor: "#bfbfbf" }}
              style={{ width: "100%" }}
              onPress={handleLogin}
            >
              התחברות
            </Button>


            <TouchableOpacity style={styles.buttonContainer} onPress={Register}>
              <Text style={styles.btnText}>הרשמה</Text>
            </TouchableOpacity>
            {/* <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync();
        }}
    /> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  smallWrapper: {
    width: "80%"
  }

});

export default LoginScreen;
