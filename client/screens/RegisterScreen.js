import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  Pressable,
} from "react-native";
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

  const [user, SetUser] = useState({
    FirstName: "",
    LastName: "",
    PhoneNumber: "",
    Email: "",
    Password: "",
  });

  const [validateUser, SetValidateUser] = useState({
    FirstName: false,
    LastName: false,
    PhoneNumber: false,
    Email: false,
    Password: false,
    confirmPassword: false,
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const phoneValidator = /^((\+|00)?972\-?|0)(([23489]|[57]\d)\-?\d{7})$/;
  const emailValidator =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const passwordValidator = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

  useEffect(() => {}, []);

  const Register = async () => {
    ValidateUser();
    if (
      !validateUser.FirstName &&
      !validateUser.PhoneNumber &&
      !validateUser.Password &&
      !validateUser.LastName &&
      !validateUser.Email &&
      !validateUser.confirmPassword
    ) {
      try {
        console.log(user)
        let res = await userApi.apiUsersCreateUserPost(user);
        let data = res.data;
        console.log("new use with id:", data);          
        navigation.navigate("LoginScreen");
      } catch (e) {
        console.log(e);
      }
    }
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
    <View style={styles.container}>
      <View style={styles.TextInputViews}>
        <View style={styles.TextInputView}>
          <TextInput
            theme={{ colors: { primary: `green` } }}
            label="שם פרטי"
            mode="outlined"
            dense={true}
            selectionColor="black"
            onChangeText={(text) =>
              SetUser((prevState) => ({
                ...prevState,
                FirstName: text,
              }))
            }
            error={validateUser.FirstName}
            //    left={<TextInput.Icon name="van-passenger" color={validateUser.FirstName ? "red" : "green"} size={20} onPress={null} />}
          />
        </View>

        <View style={styles.TextInputView}>
          <TextInput
            theme={{ colors: { primary: `green` } }}
            label="שם משפחה"
            mode="outlined"
            dense={true}
            selectionColor="black"
            onChangeText={(text) =>
              SetUser((prevState) => ({
                ...prevState,
                LastName: text,
              }))
            }
            error={validateUser.LastName}
            //  left={<TextInput.Icon name="van-passenger" color={validateUser.LastName ? "red" : "green"} size={20} onPress={null} />}
          />
        </View>
        <View style={styles.TextInputView}>
          <TextInput
            theme={{ colors: { primary: `green` } }}
            label="מייל"
            mode="outlined"
            dense={true}
            selectionColor="black"
            onChangeText={(text) =>
              SetUser((prevState) => ({
                ...prevState,
                Email: text,
              }))
            }
            error={validateUser.Email}
            //  left={<TextInput.Icon name="van-passenger" color={validateUser.Email ? "red" : "green"} size={20} onPress={null} />}
          />
        </View>
        <View style={styles.TextInputView}>
          <TextInput
            theme={{ colors: { primary: `green` } }}
            keyboardType="numeric"
            label="מספר טלפון"
            mode="outlined"
            dense={true}
            selectionColor="black"
            onChangeText={(text) =>
              SetUser((prevState) => ({
                ...prevState,
                PhoneNumber: text,
              }))
            }
            error={validateUser.PhoneNumber}
            //   left={<TextInput.Icon name="van-passenger" color={validateUser.PhoneNumber ? "red" : "green"} size={20} onPress={null} />}
          />
        </View>
        <View style={styles.TextInputView}>
          <TextInput
            theme={{ colors: { primary: `green` } }}
            label="סיסמה"
            mode="outlined"
            secureTextEntry={true}
            dense={true}
            selectionColor="black"
            onChangeText={(text) =>
              SetUser((prevState) => ({
                ...prevState,
                Password: text,
              }))
            }
            error={validateUser.Password}
            // left={<TextInput.Icon name="van-passenger" color={validateUser.Password ? "red" : "green"} size={20} onPress={null} />}
          />
        </View>
        <View style={styles.TextInputView}>
          <TextInput
            theme={{ colors: { primary: `green` } }}
            label="אימות סיסמה"
            mode="outlined"
            dense={true}
            secureTextEntry={true}
            selectionColor="black"
            onChangeText={(text) => setConfirmPassword(text)}
            error={validateUser.confirmPassword}
            //  left={<TextInput.Icon name="van-passenger" color={validateUser.confirmPassword() ? "red" : "green"} size={20} onPress={null} />}
          />
        </View>
        <Button
          mode="outlined"
          icon="van-passenger"
          theme={{ colors: { primary: `white` } }}
          labelStyle={{ color: "black" }}
          contentStyle={{ backgroundColor: "#bfbfbf" }}
          style={{ width: "70%" }}
          //
          onPress={Register}
        >
          הרשמה
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems:'center',
    backgroundColor: "white",
  },
  TextInputViews: {
    top: "15%",
    width: "100%",

    alignItems: "center",
    height: "70%",
    justifyContent: "space-between",
  },
  TextInputView: {
    width: "70%",
  },
});

export default RegisterScreen;
