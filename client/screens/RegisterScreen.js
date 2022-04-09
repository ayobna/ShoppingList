import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  TextInput,
  IconButton,
  Button,
  Text,
  Avatar,
  Caption
} from "react-native-paper";
import { userApi } from "../api/api";
import withCommonScreen from "../hoc/withCommonScreen";
import * as Crypto from 'expo-crypto';
import Colors from "../utils/Colors";
import Spinner from "../components/Spinner";


const RegisterScreen = (props) => {
  const { navigation, isButtonSpinner, setIsButtonSpinnerFalse, setIsButtonSpinnerTrue } = props;

  const [user, setUser] = useState({
    FirstName: "",
    LastName: "",
    PhoneNumber: "",
    Email: "",
    Password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const [userInputsErrorMessage, setUserInputsErrorMessage] = useState({
    FirstName: "",
    LastName: "",
    PhoneNumber: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
  });
  const [userErrorAlreadyExistsMessage, setUserErrorAlreadyExistsMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);


  const handleRegister = async () => {
    setUserErrorAlreadyExistsMessage("");
    if (checkValidation() !== 6) {
      return;
    }
    setIsButtonSpinnerTrue();
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA512,
      user.Password
    );
    const userCrypto = { ...user, Password: digest }
    const res = await createUser(userCrypto);
    if (res === -1) // user already exists
    {
      setUserErrorAlreadyExistsMessage("המשתמש כבר קיים, נסה מייל אחר!");
      setIsButtonSpinnerFalse();
      return;
    }
    navigation.goBack();
  };

  const checkValidation = () => {
    const emailRgx = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9-]{2,15}(?:\.[a-zA-Z]+){1,2}$/;  // פורמט מייל תקין
    const nameRgx = /^[a-zA-Z\u05D0-\u05EA']+([ |\-][a-zA-Z\u05D0-\u05EA']+){0,2}$/;   // שם פרטי לפחות שני תווים, אותיות בעברים בלבד המופרדות ברווח או מקו
    const phoneNumberRgx = /^[0-9]{10}$/ // בדיוק 10 ספרות
    const passwordRgx = /^(?=.*[A-Z])(?=.*\d)(?=.*[!#$%&*_=@])[A-Za-z0-9!#$%&*_=@]{5,}$/; // סיסמה חייבת להכיל אות גדולה, ספרה וסימן מיוחד. אורך סיסמה לפחות 5 תווים
    let counter = 0;

    if (!emailRgx.test(user.Email)) {
      setUserInputsErrorMessage((prevState) => ({ ...prevState, Email: "המייל אינו תקין!\nדוגמה לפורמט תקין: test@tets.test" }));
    }
    else {
      setUserInputsErrorMessage((prevState) => ({ ...prevState, Email: "" }));
      counter++;
    }
    if (!nameRgx.test(user.FirstName)) {
      setUserInputsErrorMessage((prevState) => ({ ...prevState, FirstName: "שם פרטי אינו תקין!\nלפחות שני תווים, הפרדה בין מילים ברווח או בקו" }));
    }
    else {
      setUserInputsErrorMessage((prevState) => ({ ...prevState, FirstName: "" }));
      counter++;
    }
    if (!nameRgx.test(user.LastName)) {
      setUserInputsErrorMessage((prevState) => ({ ...prevState, LastName: "שם משפחה אינו תקין!\nלפחות שני תווים, הפרדה בין מילים ברווח או בקו" }));
    }
    else {
      setUserInputsErrorMessage((prevState) => ({ ...prevState, LastName: "" }));
      counter++;
    }
    if (!phoneNumberRgx.test(user.PhoneNumber)) {
      setUserInputsErrorMessage((prevState) => ({ ...prevState, PhoneNumber: "מספר פלאפון אינו תקין!\nחובה 10 ספרות" }));
    }
    else {
      setUserInputsErrorMessage((prevState) => ({ ...prevState, PhoneNumber: "" }));
      counter++;
    }
    if (!passwordRgx.test(user.Password)) {
      setUserInputsErrorMessage((prevState) => ({ ...prevState, Password: "סיסמה חייבת להכיל אות גדולה, ספרה וסימן מיוחד. אורך סיסמה לפחות 5 תווים" }));
    }
    else {
      setUserInputsErrorMessage((prevState) => ({ ...prevState, Password: "" }));
      counter++;
    }
    if (user.Password !== confirmPassword) {
      setUserInputsErrorMessage((prevState) => ({ ...prevState, ConfirmPassword: "הסיסמאות אינן זהות" }));
    }
    else {
      setUserInputsErrorMessage((prevState) => ({ ...prevState, ConfirmPassword: "" }));
      counter++;
    }
    return counter;
  };

  const createUser = async (userCrypto) => {
    try {
      let res = await userApi.apiUsersCreateUserPost(userCrypto);
      if (res.status >= 200 && res.status < 300) {
        let data = res.data;
        return data;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const goToLogin = () => {
    navigation.goBack();
  };
  return (

    <View style={{ flex: 1, flexDirection: "column" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.TextInputViews}>
            <View>
              <TextInput
                label="אימייל"
                mode="outlined"
                value={user.Email}
                onChangeText={text => setUser((prevState) => ({
                  ...prevState,
                  Email: text,
                }))}
                keyboardType="email-address"
                selectionColor="#919191"
                activeOutlineColor="#919191"
                dense
                style={{ backgroundColor: "white" }}
                left={<TextInput.Icon color={userInputsErrorMessage.Email !== "" ? "#d0312d" : "#c1c1c1"} name="email-outline" />}
                error={userInputsErrorMessage.Email !== ""}
              />
              {
                userInputsErrorMessage.Email !== "" &&
                <View style={styles.captionErrorWrapper}>
                  <Caption style={styles.captionError}>{userInputsErrorMessage.Email}</Caption>
                </View>
              }
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                label="שם פרטי"
                mode="outlined"
                value={user.FirstName}
                onChangeText={text => setUser((prevState) => ({
                  ...prevState,
                  FirstName: text,
                }))}
                selectionColor="#919191"
                activeOutlineColor="#919191"
                dense
                style={{ backgroundColor: "white" }}
                left={<TextInput.Icon color={userInputsErrorMessage.FirstName !== "" ? "#d0312d" : "#c1c1c1"} name="format-text" />}
                error={userInputsErrorMessage.FirstName !== ""}
              />
              {
                userInputsErrorMessage.FirstName !== "" &&
                <View style={styles.captionErrorWrapper}>
                  <Caption style={styles.captionError}>{userInputsErrorMessage.FirstName}</Caption>
                </View>
              }
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                label="שם משפחה"
                mode="outlined"
                value={user.LastName}
                onChangeText={text => setUser((prevState) => ({
                  ...prevState,
                  LastName: text,
                }))}
                selectionColor="#919191"
                activeOutlineColor="#919191"
                dense
                style={{ backgroundColor: "white" }}
                left={<TextInput.Icon color={userInputsErrorMessage.LastName !== "" ? "#d0312d" : "#c1c1c1"} name="format-text" />}
                error={userInputsErrorMessage.LastName !== ""}
              />
              {
                userInputsErrorMessage.LastName !== "" &&
                <View style={styles.captionErrorWrapper}>
                  <Caption style={styles.captionError}>{userInputsErrorMessage.LastName}</Caption>
                </View>
              }
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                label="פלאפון"
                mode="outlined"
                value={user.PhoneNumber}
                onChangeText={text => setUser((prevState) => ({
                  ...prevState,
                  PhoneNumber: text.replace(/[^0-9]/g, ''),
                }))}
                selectionColor="#919191"
                activeOutlineColor="#919191"
                keyboardType="numeric"
                maxLength={10}
                dense
                style={{ backgroundColor: "white" }}
                left={<TextInput.Icon color={userInputsErrorMessage.PhoneNumber !== "" ? "#d0312d" : "#c1c1c1"} name="cellphone" />}
                error={userInputsErrorMessage.PhoneNumber !== ""}
              />
              {
                userInputsErrorMessage.PhoneNumber !== "" &&
                <View style={styles.captionErrorWrapper}>
                  <Caption style={styles.captionError}>{userInputsErrorMessage.PhoneNumber}</Caption>
                </View>
              }
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                label="סיסמה"
                mode="outlined"
                value={user.Password}
                onChangeText={text => setUser((prevState) => ({
                  ...prevState,
                  Password: text,
                }))}
                secureTextEntry={!isPasswordVisible}
                selectionColor="#919191"
                activeOutlineColor="#919191"
                dense
                style={{ backgroundColor: "white" }}
                left={<TextInput.Icon color={userInputsErrorMessage.Password !== "" ? "#d0312d" : "#c1c1c1"} name="lock-outline" />}
                right={<TextInput.Icon forceTextInputFocus={false} color={Colors.our_dark_blue} name={!isPasswordVisible ? "eye" : "eye-off"} onPress={() => setIsPasswordVisible(!isPasswordVisible)} />}
                error={userInputsErrorMessage.Password !== ""}
              />
              {
                userInputsErrorMessage.Password !== "" &&
                <View style={styles.captionErrorWrapper}>
                  <Caption style={styles.captionError}>{userInputsErrorMessage.Password}</Caption>
                </View>
              }
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                label="אימות סיסמה"
                mode="outlined"
                value={confirmPassword}
                onChangeText={text => setConfirmPassword(text)}
                secureTextEntry={!isConfirmPasswordVisible}
                selectionColor="#919191"
                activeOutlineColor="#919191"
                style={{ backgroundColor: "white" }}
                dense
                left={<TextInput.Icon color={userInputsErrorMessage.ConfirmPassword !== "" ? "#d0312d" : "#c1c1c1"} name="lock-outline" />}
                right={<TextInput.Icon forceTextInputFocus={false} color={Colors.our_dark_blue} name={!isConfirmPasswordVisible ? "eye" : "eye-off"} onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} />}
                error={userInputsErrorMessage.ConfirmPassword !== ""}
              />
              {
                userInputsErrorMessage.ConfirmPassword !== "" &&
                <View style={styles.captionErrorWrapper}>
                  <Caption style={styles.captionError}>{userInputsErrorMessage.ConfirmPassword}</Caption>
                </View>
              }
            </View>
            {
              userErrorAlreadyExistsMessage !== "" &&
              <View style={[styles.captionErrorWrapper, { marginTop: 20 }]}>
                <Caption style={styles.captionError}>{userErrorAlreadyExistsMessage}</Caption>
              </View>
            }
            <View style={styles.btnWrapped}>
              {isButtonSpinner ?
                <View style={styles.btnSpinnerContainer}>
                  <Spinner smallSize="small" color="white" />
                </View>
                :
                <Button
                  mode="contained"
                  // theme={{ colors: { primary: `white` } }}
                  // labelStyle={{ color: "black" }}
                  // contentStyle={{ backgroundColor: "#bfbfbf" }}
                  color={Colors.our_dark_blue}
                  style={{ width: "100%" }}
                  onPress={handleRegister}
                >
                  הרשמה
                </Button>
              }

            </View>
          </View>
          <View style={styles.loginWrapper}>
            <Text>כבר רשום? </Text>
            <TouchableOpacity style={styles.btnLoginWrapper} onPress={goToLogin}>
              <Text style={styles.loginLink}>לחץ כאן להתחברות!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-around"
  },
  TextInputViews: {
    width: "80%",
  },
  TextInputView: {
    width: "100%",
  },
  btnWrapped: {
    marginTop: 25
  },
  inputWrapper: {
    marginTop: 20
  },
  loginWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20
  },
  btnLoginWrapper: {
    marginLeft: 10
  },
  loginLink: {
    color: Colors.our_dark_blue
  },
  captionError: {
    color: "#d0312d"
  },
  captionErrorWrapper: {
    marginLeft: 5
  },
  btnSpinnerContainer: {
    backgroundColor: Colors.our_dark_blue,
    padding: 8,
    borderRadius: 5
  }
});

export default withCommonScreen(RegisterScreen, 'RegisterScreen');
