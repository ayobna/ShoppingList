import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,

} from "react-native";
import { User } from "../User";
import { _storeData , _getData} from "../utils/Functions";
import {
  Button,
  TextInput,
  HelperText,
  Avatar,
} from "react-native-paper";

// tal was here

const LoginScreen = (props) => {
  const { navigation } = props;
  const [ErrorMsg, setErrorMsg] = useState("");
  const [hidePass, setHidePass] = useState(true);
  const [eye, seteye] = useState("eye");
  const CheckLogin = async () => {

    _storeData('User', User);
    navigation.navigate('דף בית')
  };












  return (
    <View style={styles.container}>
      <Image style={styles.bgImage} source={null} />
      <View style={styles.shadwVies}>
        <Text style={styles.title}>קניות בלייב</Text>
      </View>

      <Image style={styles.inputIcon} source={{ uri: null }} />

      <View  style={{ width: "70%" }}>
        <View style={{ width: "100%" }}>
          <TextInput
            theme={{ colors: { primary: `black` } }}
            label="מייל"
            keyboardType="email-address"
            mode="outlined"
            dense={true}
            selectionColor="green"
            //  onChangeText={(text) => setEmail(text)}
            left={
              <TextInput.Icon name="van-passenger" size={20} onPress={null} />
            }
          />
        </View>
      </View>

      <View  style={{ width: "70%" }}>
        <View style={{ width: "100%" }}>
          <TextInput
            theme={{ colors: { primary: `black` } }}
            label="סיסמא"
            mode="outlined"
            //   password={true}
            secureTextEntry={hidePass}
            dense={true}
            selectionColor="green"
            // onChangeText={(text) => setPassword(text)}
            left={
              <TextInput.Icon name="van-passenger" size={20} onPress={null} />
            }
            right={
              <TextInput.Icon name={eye} size={20} onPress={() => btnEye()} />
            }
          />
        </View>
      </View>

      <TouchableOpacity style={styles.btnForgotPassword} onPress={() => null}>
        <Text style={styles.btnText}>שכחת סיסמא?</Text>
      </TouchableOpacity>

      <Text style={styles.errorMsg}>{ErrorMsg} </Text>

      <Button
        //mode="outlined"
        icon="van-passenger"
        theme={{ colors: { primary: `white` } }}
        labelStyle={{ color: "black" }}
        contentStyle={{ backgroundColor: "#bfbfbf" }}
        style={{ width: "70%" }}
        onPress={() => CheckLogin()}
      >
        התחברות
      </Button>
      <View style={styles.checkboxContainer}>
        {/* <CheckBox
        value={isSelected}
        tintColors={{ true: 'white' }}
        onValueChange={setSelection}
        style={styles.checkbox}
      /> */}
        <Text style={styles.label}>זכור אותי</Text>
      </View>

      <TouchableOpacity style={styles.buttonContainer} onPress={() => null}>
        <Text style={styles.btnText}>הרשמה</Text>
      </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
   
  },
 
});

export default LoginScreen;
