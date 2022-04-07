import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Image, ScrollView } from "react-native";
import { _storeData, _getData, _registerForPushNotificationsAsync, _diff_minutes } from "../utils/Functions";
import { Button, TextInput, HelperText, Avatar, Caption, Text } from "react-native-paper";
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API, loginApi } from "../api/api";
import Spinner from "../components/Spinner";
import PopupDialog from "../components/PopupDialog";
import moment from "moment";
import withCommonScreen from "../hoc/withCommonScreen";

const Time_For_Code = 10;
// WebBrowser.maybeCompleteAuthSession();


const LoginScreen = (props) => {
  // props
  const { navigation, isPageLoaded, setIsPageLoadedTrue } = props;

  // states
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("test1234");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loginUserDetails, setLoginUserDetails] = useState();
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  // states - reset password
  const [isInsertEmailDialogVisible, setIsInsertEmailDialogVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailErrorMessage, setResetEmailErrorMessage] = useState("");

  const [isInsertCodeDialogVisible, setIsInsertCodeDialogVisible] = useState(false);
  const [code, setCode] = useState();
  const [inputCode, setInputCode] = useState("");
  const [codeErrorMessage, setCodeErrorMessage] = useState("");

  const [isInsertPasswordDialogVisible, setIsInsertPasswordDialogVisible] = useState(false);
  const [resetPassword, setResetPassword] = useState("");
  const [resetPasswordConfirm, setResetPasswordConfirm] = useState("");
  const [resetPasswordErrorMessage, setResetPasswordErrorMessage] = useState("");
  const [isResetPasswordVisible, setIsResetPasswordVisible] = useState(false);
  const [isResetPasswordConfirmVisible, setIsResetPasswordConfirmVisible] = useState(false);

  const [createResetCodeTime, setCreateResetCodeTime] = useState();




  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      const currentUser = await _getData("User");
      if (currentUser === null) {
        setIsPageLoadedTrue();
      }
      else {
        navigation.replace("myDrawer");
      }
    });
    return unsubscribe;
  }, [navigation]);


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
    setIsInsertEmailDialogVisible(false);
  };

  useEffect(() => {
    if (code) {
      setIsInsertEmailDialogVisible(false);
      setIsInsertCodeDialogVisible(true);
    }
  }, [code]);

  const goToRegister = () => {
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
    const notificationToken = await _registerForPushNotificationsAsync();
    userDetails.notificationToken = notificationToken;
    const updateTokenRes = await updateUserNotificationToken(userDetails.userID, notificationToken);
    if (!updateTokenRes) {
      console.log("something wrong with the token update")
      return;
    }
    console.log('login screen userDetails', userDetails)

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

  const confirmInsertEmailDialog = async () => {
    if (resetEmail.length === 0) {
      setResetEmailErrorMessage("שדה האימייל חייב להכיל לפחות אות אחת!");
      return;
    }
    await handleSetCode();
  };

  const resetPasswordCheckEmailAndSendCode = async () => {
    try {
      const userDetails = { Email: resetEmail };
      let res = await loginApi.apiLoginResetPasswordCheckEmailAndSendCodePost(userDetails);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };


  const confirmInsertCodeDialog = () => {
    if (inputCode.length === 0) {
      setCodeErrorMessage("השדה של הקוד חייב להכיל לפחות מספר אחד!");
      return;
    }
    console.log(_diff_minutes(new Date(), createResetCodeTime));
    if (_diff_minutes(new Date(), createResetCodeTime) >= Time_For_Code) {
      setCodeErrorMessage("תוקף הקוד עבר אנא שלח קוד חדש!");
      return;
    }
    if (parseInt(inputCode) !== code) {
      setCodeErrorMessage("הקוד שגוי אנא בדוק/י את הקוד במייל שוב!");
      return;
    }
    console.log(Date.now)
    setIsInsertCodeDialogVisible(false);
    setIsInsertPasswordDialogVisible(true);
  };

  const resendDialog = async () => {
    await handleSetCode();
  };

  const handleSetCode = async () => {
    const code = await resetPasswordCheckEmailAndSendCode();
    console.log("code", code)
    if (code) {
      setCreateResetCodeTime(new Date())
      setCode(code);
    }
  };

  const confirmResetPassword = async () => {
    const passwordRgx = /^(?=.*[A-Z])(?=.*\d)(?=.*[!#$%&*_=@])[A-Za-z0-9!#$%&*_=@]{5,}$/; // סיסמה חייבת להכיל אות גדולה, ספרה וסימן מיוחד. אורך סיסמה לפחות 5 תווים
    if (!passwordRgx.test(resetPassword)) {
      setResetPasswordErrorMessage("הסיסמה לא תקינה, חייבת להכיל אות גדולה, סימן מיוחד, וספרה!")
      return;
    }
    if (resetPassword !== resetPasswordConfirm) {
      setResetPasswordErrorMessage("הסימה לא זהה בשתי השדות!")
      return;
    }
    await updatePassword();
    cancelDialog();
  };

  const updatePassword = async () => {
    try {
      const userDetails = { Email: resetEmail, Password: resetPassword };
      let res = await loginApi.apiLoginUpdatePasswordPost(userDetails);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const cancelDialog = () => {
    setResetEmail("");
    setResetEmailErrorMessage("");
    setIsInsertEmailDialogVisible(false);
    setCode();
    setInputCode("");
    setCodeErrorMessage("");
    setIsInsertCodeDialogVisible(false);
    setResetPassword("");
    setResetPasswordConfirm("");
    setResetPasswordErrorMessage("");
    setIsResetPasswordVisible(false);
    setIsResetPasswordConfirmVisible(false);
    setIsInsertPasswordDialogVisible(false);
    setCreateResetCodeTime();
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
    isPageLoaded ?
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.wrapper}>
            <View style={styles.logoWrapper}>
              <Image style={styles.logo} source={require('../assets/our_logo.png')} />
            </View>
            <View style={styles.smallWrapper}>

              <View>
                <TextInput
                  label="אימייל"
                  mode="outlined"
                  value={email}
                  onChangeText={text => setEmail(text)}
                  selectionColor="#919191"
                  activeOutlineColor="#919191"
                  keyboardType="email-address"
                  dense
                  style={{ backgroundColor: "white" }}
                  left={<TextInput.Icon color={loginErrorMessage !== "" ? "#d0312d" : "#c1c1c1"} name="email-outline" />}
                  error={loginErrorMessage !== ""}
                />

              </View>

              <View style={styles.inputWrapper}>
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

              {
                loginErrorMessage.length > 0 &&
                <View style={styles.errorWrapper}>
                  <Caption style={{ color: "#d0312d" }}>{loginErrorMessage}</Caption>
                </View>
              }

              <View style={loginErrorMessage.length > 0 ? styles.forgotPasswordWrapperInError : styles.forgotPasswordWrapperRegular}>
                <Text style={styles.btnText}>שכחת סיסמה?</Text>
                <TouchableOpacity style={styles.btnRegisterWrapper} onPress={() => setIsInsertEmailDialogVisible(true)}>
                  <Text style={styles.registerLink}>לחץ כאן לאיפוס!</Text>
                </TouchableOpacity>
              </View>


              <View style={styles.btnWrapped}>
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
              </View>


            </View>

            <View style={styles.registerWrapper}>
              <Text>עדיין לא נרשמת? </Text>
              <TouchableOpacity style={styles.btnRegisterWrapper} onPress={goToRegister}>
                <Text style={styles.registerLink}>לחץ כאן להרשמה!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        {
          isInsertEmailDialogVisible &&
          <PopupDialog
            title={"איפוס סיסמה - הכנסת אימייל"}
            visible={isInsertEmailDialogVisible}
            cancel={cancelDialog}
            confirm={confirmInsertEmailDialog}
          >
            <TextInput
              label="אימייל"
              mode="outlined"
              value={resetEmail}
              onChangeText={text => setResetEmail(text)}
              selectionColor="#919191"
              activeOutlineColor="#919191"
              dense
              style={{ backgroundColor: "white" }}
              left={<TextInput.Icon color={resetEmailErrorMessage !== "" ? "#d0312d" : "#c1c1c1"} name="email-outline" />}
              error={resetEmailErrorMessage !== ""}
            />
            {
              resetEmailErrorMessage.length > 0 &&
              <View style={styles.captionInDialogWrapper}>
                <Caption style={styles.captionInDialog}>{resetEmailErrorMessage}</Caption>
              </View>
            }
          </PopupDialog>
        }

        {
          isInsertCodeDialogVisible &&
          <PopupDialog
            title={"איפוס סיסמה - הכנסת קוד"}
            visible={isInsertCodeDialogVisible}
            cancel={cancelDialog}
            confirm={confirmInsertCodeDialog}
            resend={resendDialog}
          >
            <View>
              <Caption>קוד נשלח אלייך למייל - בדוק/י את המייל</Caption>
            </View>
            <TextInput
              label="קוד"
              mode="outlined"
              value={inputCode}
              onChangeText={text => setInputCode(text.replace(/[^0-9]/g, ''))}
              selectionColor="#919191"
              activeOutlineColor="#919191"
              keyboardType="numeric"
              dense
              style={{ backgroundColor: "white" }}
              left={<TextInput.Icon color={codeErrorMessage !== "" ? "#d0312d" : "#c1c1c1"} name="email-outline" />}
              error={codeErrorMessage !== ""}
            />
            {
              codeErrorMessage.length > 0 &&
              <View style={styles.captionInDialogWrapper}>
                <Caption style={styles.captionInDialog}>{codeErrorMessage}</Caption>
              </View>
            }
          </PopupDialog>
        }
        {
          isInsertPasswordDialogVisible &&
          <PopupDialog
            title={"איפוס סיסמה - הכנסת סיסמה"}
            visible={isInsertPasswordDialogVisible}
            cancel={cancelDialog}
            confirm={confirmResetPassword}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                label="סיסמה חדשה"
                mode="outlined"
                value={resetPassword}
                secureTextEntry={!isResetPasswordVisible}
                onChangeText={text => setResetPassword(text)}
                selectionColor="#919191"
                activeOutlineColor="#919191"
                dense
                style={{ backgroundColor: "white" }}
                left={<TextInput.Icon color={resetPasswordErrorMessage !== "" ? "#d0312d" : "#c1c1c1"} name="lock-outline" />}
                right={<TextInput.Icon forceTextInputFocus={false} color="#919191" name={!isResetPasswordVisible ? "eye" : "eye-off"} onPress={() => setIsResetPasswordVisible(!isResetPasswordVisible)} />}
                error={resetPasswordErrorMessage !== ""}
              />

            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                label="אשר סיסמה"
                mode="outlined"
                value={resetPasswordConfirm}
                secureTextEntry={!isResetPasswordConfirmVisible}
                onChangeText={text => setResetPasswordConfirm(text)}
                selectionColor="#919191"
                activeOutlineColor="#919191"
                dense
                style={{ backgroundColor: "white" }}
                left={<TextInput.Icon color={resetPasswordErrorMessage !== "" ? "#d0312d" : "#c1c1c1"} name="lock-outline" />}
                right={<TextInput.Icon forceTextInputFocus={false} color="#919191" name={!isResetPasswordConfirmVisible ? "eye" : "eye-off"} onPress={() => setIsResetPasswordConfirmVisible(!isResetPasswordConfirmVisible)} />}
                error={resetPasswordErrorMessage !== ""}
              />

            </View>
            {
              resetPasswordErrorMessage.length > 0 &&
              <View style={styles.captionInDialogWrapper}>
                <Caption style={styles.captionInDialog}>{resetPasswordErrorMessage}</Caption>
              </View>
            }
          </PopupDialog>
        }

      </SafeAreaView >
      :
      <Spinner />
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white"
  },
  wrapper: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center"
  },
  smallWrapper: {
    width: "80%"
  },
  logoWrapper: {
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    width: 350,
    height: 144
  },
  inputWrapper: {
    marginTop: 20
  },
  forgotPasswordWrapperRegular: {
    flexDirection: "row",
    marginTop: 20
  },
  forgotPasswordWrapperInError: {
    flexDirection: "row",
    marginTop: 10
  },
  errorWrapper: {
    marginTop: 20
  },
  btnWrapped: {
    marginTop: 20
  },
  registerWrapper: {
    flexDirection: "row",
    justifyContent: "center",
  },
  btnRegisterWrapper: {
    marginLeft: 10
  },
  registerLink: {
    color: "#0502a0"
  },
  captionInDialogWrapper: {
    marginTop: 10,
    marginLeft: 5
  },
  captionInDialog: {
    color: "#d0312d"
  }

});

export default withCommonScreen(LoginScreen, 'LoginScreen');
