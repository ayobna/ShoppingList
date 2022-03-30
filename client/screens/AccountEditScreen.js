import react, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Avatar, Button, TextInput } from "react-native-paper";
import { API, userApi } from "../api/api";
import * as ImagePicker from "expo-image-picker";
import { _getData, _storeData } from "../utils/Functions";

const AccountEditScreen = (props) => {
  const { navigation, route } = props;

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    img: "",
  });
  const [imageBase64, setImageBase64] = useState(null);

  const [image, setImage] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      const user = await LoadUser();

      setUser(user);
      setImage(`${API}/uploads/users/${user.img}`);
    });
    return unsubscribe;
  }, [navigation, route]);

  const LoadUser = async () => {
    let u = await _getData("User");
    return u;
  };

  const Save = async () => {
    try {
      let isHaveBase64Img=false
      let userToUpdate=user
      if(imageBase64!==null){
        isHaveBase64Img=true
        userToUpdate.img=imageBase64
      }
      //console.log(imageBase64)
      let res = await userApi.apiUserUpdateUserPost( isHaveBase64Img,userToUpdate,);
      console.log(res.data);
      const resOfDataStore = await _storeData("User", res.data);
      setUser(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync(); // בקשת הרשאה לגלריה

    if (permissionResult.granted === false) {
      Alert.alert("יש צורך בהרשאת גלריה");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
      setImageBase64(result.base64);
    }
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("יש צורך בהרשאת למצלצה");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ base64: true });

    if (!result.cancelled) {
      setImage(result.uri);
      setImageBase64(result.base64);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.Image}>
        <Avatar.Image
          size={150}
          source={{
            uri: image,
          }}
        />
        <View style={styles.ViewButtons}>
          <View style={styles.btnImg}>
            <Button
              mode="outlined"
              theme={{ colors: { primary: `white` } }}
              labelStyle={{ color: "black" }}
              contentStyle={{ backgroundColor: "#bfbfbf" }}
              onPress={pickImage}
            >
              פחר תמונה
            </Button>
          </View>
          <View style={styles.btnImg}>
            <Button
              mode="outlined"
              theme={{ colors: { primary: `white` } }}
              labelStyle={{ color: "black" }}
              contentStyle={{ backgroundColor: "#bfbfbf" }}
              onPress={openCamera}
            >
              צלם תמונה
            </Button>
          </View>
        </View>
      </View>
      <View style={styles.ViewTextInput}>
        <TextInput
          label="שם"
          mode="outlined"
          value={user.firstName}
          onChangeText={(text) =>
            setUser((prevState) => ({
              ...prevState,
              firstName: text,
            }))
          }
          selectionColor="#919191"
          activeOutlineColor="#919191"
          dense
          style={{ backgroundColor: "white" }}
          //  left={<TextInput.Icon color={userInputsErrorMessage.Email !== "" ? "#d0312d" : "#c1c1c1"} name="email-outline" />}
          //  error={userInputsErrorMessage.Email !== ""}
        />
      </View>
      <View style={styles.ViewTextInput}>
        <TextInput
          label="שם משפחה"
          mode="outlined"
          value={user.lastName}
          onChangeText={(text) =>
            setUser((prevState) => ({
              ...prevState,
              lastName: text,
            }))
          }
          selectionColor="#919191"
          activeOutlineColor="#919191"
          dense
          style={{ backgroundColor: "white" }}
          //  left={<TextInput.Icon color={userInputsErrorMessage.Email !== "" ? "#d0312d" : "#c1c1c1"} name="email-outline" />}
          //  error={userInputsErrorMessage.Email !== ""}
        />
      </View>
      <View style={styles.ViewTextInput}>
        <TextInput
          label="אימייל"
          mode="outlined"
          value={user.email}
          onChangeText={(text) =>
            setUser((prevState) => ({
              ...prevState,
              email: text,
            }))
          }
          keyboardType="email-address"
          selectionColor="#919191"
          activeOutlineColor="#919191"
          dense
          style={{ backgroundColor: "white" }}
          //  left={<TextInput.Icon color={userInputsErrorMessage.Email !== "" ? "#d0312d" : "#c1c1c1"} name="email-outline" />}
          //  error={userInputsErrorMessage.Email !== ""}
        />
      </View>
      <View style={styles.ViewTextInput}>
        <TextInput
          label="נייד"
          mode="outlined"
          keyboardType="numeric"
          value={user.phoneNumber}
          onChangeText={(text) =>
            setUser((prevState) => ({
              ...prevState,
              phoneNumber: text,
            }))
          }
          selectionColor="#919191"
          activeOutlineColor="#919191"
          dense
          style={{ backgroundColor: "white" }}
          //  left={<TextInput.Icon color={userInputsErrorMessage.Email !== "" ? "#d0312d" : "#c1c1c1"} name="email-outline" />}
          //  error={userInputsErrorMessage.Email !== ""}
        />
      </View>

      <View style={styles.ViewButton}>
        <Button
          mode="outlined"
          theme={{ colors: { primary: `white` } }}
          labelStyle={{ color: "black" }}
          contentStyle={{ backgroundColor: "#bfbfbf" }}
          onPress={Save}
        >
          שמור
        </Button>
      </View>
    </View>
  );
};

export default AccountEditScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  Image: {
    marginTop: "10%",
    alignItems: "center",
  },
  ViewText: {
    //   marginLeft: "25%",
    //  marginRight: "25%",
  },
  Text: {
    marginTop: "12%",
    fontSize: 24,
  },
  ViewButton: {
    marginTop: "8%",
    width: "50%",
    marginLeft: "25%",

    //alignItems:'center',
    justifyContent: "center",
  },
  ViewButtons: {
    marginTop: "5%",
    flexDirection: "row",
  },
  btnImg: {
    width: "30%",
    flexDirection: "row",
  },
  ViewTextInput: {
    marginTop: "5%",
    width: "70%",
    marginLeft: "15%",
  },
});
