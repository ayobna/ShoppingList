import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  Pressable,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  TextInput,
  IconButton,
  Button,
  Text,
  Avatar,
} from "react-native-paper";
import { userApi } from "../api/api";
const RegisterScreen = (props) => {
  const { navigation, route } = props;

  const [user, setUser] = useState({
    FirstName: "",
    LastName: "",
    PhoneNumber: "",
    Email: "",
    Password: "",
  });

  const [userInputsErrorMessage, setInputsUserErrorMessage] = useState({
    FirstName: "",
    LastName: "",
    PhoneNumber: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);


  const phoneValidator = /^((\+|00)?972\-?|0)(([23489]|[57]\d)\-?\d{7})$/;
  const emailValidator =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const passwordValidator = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;


  useEffect(() => { }, []);

  const Register = async () => {
    // ValidateUser();
    // if (
    //   !validateUser.FirstName &&
    //   !validateUser.PhoneNumber &&
    //   !validateUser.Password &&
    //   !validateUser.LastName &&
    //   !validateUser.Email &&
    //   !validateUser.confirmPassword
    // ) {
    //   try {
    //     console.log(user)
    //     let res = await userApi.apiUsersCreateUserPost(user);
    //     let data = res.data;
    //     console.log("new use with id:", data);
    //     navigation.navigate("LoginScreen");
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }
  };
  const ValidateUser = () => {
    SetValidateUser((prevState) => ({
      ...prevState,
      FirstName: validateFirstName(),
      LastName: validateLastName(),
      PhoneNumber: validatePhone(),
      Email: validatorEmail(),
      Password: validatePassword(),
      confirmPassword: validateConfirmPassword(),
    }));
  };

  const validatorEmail = () => {
    return !emailValidator.test(user.Email);
  };

  const validatePassword = () => {
    return !passwordValidator.test(user.Password);
  };
  const validateConfirmPassword = () => {
    if (confirmPassword === user.Password && confirmPassword !== "") {
      return false;
    } else return true;
  };

  const validateFirstName = () => {
    return user.FirstName === "";
  };

  const validateLastName = () => {
    return user.LastName === "";
  };
  const validatePhone = () => {
    return !phoneValidator.test(user.PhoneNumber);
  };
  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
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

          </View>

          <View>
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

          </View>

          <View>
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

          </View>

          <View>
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
              right={<TextInput.Icon forceTextInputFocus={false} color="#919191" name={!isPasswordVisible ? "eye" : "eye-off"} onPress={() => setIsPasswordVisible(!isPasswordVisible)} />}
              error={userInputsErrorMessage.Password !== ""}
            />

          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              label="אישור סיסמה"
              mode="outlined"
              value={user.ConfirmPassword}
              onChangeText={text => setUser((prevState) => ({
                ...prevState,
                ConfirmPassword: text,
              }))}
              secureTextEntry={!isConfirmPasswordVisible}
              selectionColor="#919191"
              activeOutlineColor="#919191"
              dense
              style={{ backgroundColor: "white" }}
              left={<TextInput.Icon color={userInputsErrorMessage.ConfirmPassword !== "" ? "#d0312d" : "#c1c1c1"} name="lock-outline" />}
              right={<TextInput.Icon forceTextInputFocus={false} color="#919191" name={!isConfirmPasswordVisible ? "eye" : "eye-off"} onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} />}
              error={userInputsErrorMessage.ConfirmPassword !== ""}
            />

          </View>

          <Button
            mode="outlined"
            icon="van-passenger"
            theme={{ colors: { primary: `white` } }}
            labelStyle={{ color: "black" }}
            contentStyle={{ backgroundColor: "#bfbfbf" }}
            style={{ width: "100%" }}
            //
            onPress={Register}
          >
            הרשמה
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center"
  },
  TextInputViews: {
    width: "80%",
  },
  TextInputView: {
    width: "100%",
  },
});

export default RegisterScreen;
