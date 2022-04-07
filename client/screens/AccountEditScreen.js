import react, { useEffect, useState, useCallback } from "react";
import { API, userApi } from "../api/api";
import * as ImagePicker from "expo-image-picker";
import { _getData, _storeData } from "../utils/Functions";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  TextInput,
  IconButton,
  Button,
  Text,
  Avatar,
  Caption,
  Divider,
} from "react-native-paper";
import withCommonScreen from "../hoc/withCommonScreen";
import Spinner from "../components/Spinner";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
const AccountEditScreen = (props) => {
  const { navigation, route, isPageLoaded, setIsPageLoadedTrue } = props;

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    img: "",
  });
  const [userInputsErrorMessage, setUserInputsErrorMessage] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });
  const [imageBase64, setImageBase64] = useState(null);
  const [image, setImage] = useState(null);
  const [defaultImg, setDefaultImg] = useState(null)
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      const user = await loadUser();

      setUser(user);
      setImage(`${API}/uploads/users/${user.img}`);
      setIsPageLoadedTrue();
    });
    return unsubscribe;
  }, [navigation, route]);


  const loadUser = async () => {
    let u = await _getData("User");
    return u;
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

  const updateToDefaultImg = async () => {
    setImage(`${API}/uploads/users/user_default/user_default.png`);
    setDefaultImg('user_default/user_default.png')
  };

  const save = async () => {
    try {
      let isHaveBase64Img = false;
      let userToUpdate = user;
      let defaultImgToUpdate = defaultImg
      if (imageBase64 !== null) {
        isHaveBase64Img = true;
        userToUpdate.img = imageBase64;
        defaultImgToUpdate = undefined
      }
      //console.log(imageBase64)
      let res = await userApi.apiUserUpdateUserPost(
        isHaveBase64Img, defaultImgToUpdate, userToUpdate
      );
      console.log(res.data);
      const resOfDataStore = await _storeData("User", res.data);
      setUser(res.data);
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  const handleSave = async () => {
    if (checkValidation() !== 4) {
      return;
    }
    save();
  };

  const checkValidation = () => {
    const emailRgx = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9-]{2,15}(?:\.[a-zA-Z]+){1,2}$/; // פורמט מייל תקין
    const nameRgx =
      /^[a-zA-Z\u05D0-\u05EA']+([ |\-][a-zA-Z\u05D0-\u05EA']+){0,2}$/; // שם פרטי לפחות שני תווים, אותיות בעברים בלבד המופרדות ברווח או מקו
    const phoneNumberRgx = /^[0-9]{10}$/; // בדיוק 10 ספרות
    const passwordRgx =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!#$%&*_=@])[A-Za-z0-9!#$%&*_=@]{5,}$/; // סיסמה חייבת להכיל אות גדולה, ספרה וסימן מיוחד. אורך סיסמה לפחות 5 תווים
    let counter = 0;

    if (!emailRgx.test(user.email)) {
      setUserInputsErrorMessage((prevState) => ({
        ...prevState,
        email: "המייל אינו תקין!\nדוגמה לפורמט תקין: test@tets.test",
      }));
    } else {
      setUserInputsErrorMessage((prevState) => ({ ...prevState, email: "" }));
      counter++;
    }
    if (!nameRgx.test(user.firstName)) {
      setUserInputsErrorMessage((prevState) => ({
        ...prevState,
        firstName:
          "שם פרטי אינו תקין!\nלפחות שני תווים, הפרדה בין מילים ברווח או בקו",
      }));
    } else {
      setUserInputsErrorMessage((prevState) => ({
        ...prevState,
        firstName: "",
      }));
      counter++;
    }
    if (!nameRgx.test(user.lastName)) {
      setUserInputsErrorMessage((prevState) => ({
        ...prevState,
        lastName:
          "שם משפחה אינו תקין!\nלפחות שני תווים, הפרדה בין מילים ברווח או בקו",
      }));
    } else {
      setUserInputsErrorMessage((prevState) => ({
        ...prevState,
        lastName: "",
      }));
      counter++;
    }
    if (!phoneNumberRgx.test(user.phoneNumber)) {
      setUserInputsErrorMessage((prevState) => ({
        ...prevState,
        phoneNumber: "מספר פלאפון אינו תקין!\nחובה 10 ספרות",
      }));
    } else {
      setUserInputsErrorMessage((prevState) => ({
        ...prevState,
        phoneNumber: "",
      }));
      counter++;
    }

    return counter;
  };

  return isPageLoaded ? (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={styles.mainWrapper}>
          <View style={styles.Image}>
            <Avatar.Image
              size={140}
              source={{
                uri: image,
              }}
            />

            <View style={styles.cameraButtonWrapper}>
              <IconButton
                icon="camera"
                style={{ backgroundColor: "#c1c1c1" }}
                color="black"
                size={20}
                onPress={openCamera}
              />
            </View>

            <View style={styles.galleryButtonWrapper}>
              <IconButton
                icon="image"
                style={{ backgroundColor: "#c1c1c1" }}
                color="black"
                size={20}
                onPress={pickImage}
              />
            </View>

            <View style={styles.removeImageButtonWrapper}>
              <IconButton
                icon="close"
                style={{ backgroundColor: "#c1c1c1" }}
                color="black"
                size={20}
                onPress={updateToDefaultImg}
              />
            </View>
          </View>

          <View style={styles.inputsContainer}>
            <View style={{ width: "100%", paddingLeft: 10 }}>
              <Caption>פרטים אישיים</Caption>
            </View>
            <Divider style={{ width: "100%" }} />
            <View style={styles.inputsWrapper}>
              <TextInput
                label="אימייל"
                mode="outlined"
                disabled
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
                left={
                  <TextInput.Icon
                    color={
                      userInputsErrorMessage.email !== ""
                        ? "#d0312d"
                        : "#c1c1c1"
                    }
                    name="email-outline"
                  />
                }
                error={userInputsErrorMessage.email !== ""}
              />
              {userInputsErrorMessage.email !== "" && (
                <View style={styles.captionErrorWrapper}>
                  <Caption style={styles.captionError}>
                    {userInputsErrorMessage.email}
                  </Caption>
                </View>
              )}

              <View style={styles.inputWrapper}>
                <TextInput
                  label="שם פרטי"
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
                  left={
                    <TextInput.Icon
                      color={
                        userInputsErrorMessage.firstName !== ""
                          ? "#d0312d"
                          : "#c1c1c1"
                      }
                      name="format-text"
                    />
                  }
                  error={userInputsErrorMessage.firstName !== ""}
                />
                {userInputsErrorMessage.firstName !== "" && (
                  <View style={styles.captionErrorWrapper}>
                    <Caption style={styles.captionError}>
                      {userInputsErrorMessage.firstName}
                    </Caption>
                  </View>
                )}
              </View>

              <View style={styles.inputWrapper}>
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
                  left={
                    <TextInput.Icon
                      color={
                        userInputsErrorMessage.lastName !== ""
                          ? "#d0312d"
                          : "#c1c1c1"
                      }
                      name="format-text"
                    />
                  }
                  error={userInputsErrorMessage.lastName !== ""}
                />
                {userInputsErrorMessage.lastName !== "" && (
                  <View style={styles.captionErrorWrapper}>
                    <Caption style={styles.captionError}>
                      {userInputsErrorMessage.lastName}
                    </Caption>
                  </View>
                )}
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  label="פלאפון"
                  mode="outlined"
                  value={user.phoneNumber}
                  onChangeText={(text) =>
                    setUser((prevState) => ({
                      ...prevState,
                      phoneNumber: text.replace(/[^0-9]/g, ""),
                    }))
                  }
                  selectionColor="#919191"
                  activeOutlineColor="#919191"
                  keyboardType="numeric"
                  maxLength={10}
                  dense
                  style={{ backgroundColor: "white" }}
                  left={
                    <TextInput.Icon
                      color={
                        userInputsErrorMessage.phoneNumber !== ""
                          ? "#d0312d"
                          : "#c1c1c1"
                      }
                      name="cellphone"
                    />
                  }
                  error={userInputsErrorMessage.phoneNumber !== ""}
                />
                {userInputsErrorMessage.phoneNumber !== "" && (
                  <View style={styles.captionErrorWrapper}>
                    <Caption style={styles.captionError}>
                      {userInputsErrorMessage.phoneNumber}
                    </Caption>
                  </View>
                )}
              </View>
            </View>
            <View></View>
          </View>

          <View style={styles.bottomBtnsContainer}>
            <View style={styles.bottomBtnsWrapper}>
              <View style={styles.bottomBtnWrapper}>
                <Button
                  mode="outlined"
                  theme={{ colors: { primary: `white` } }}
                  labelStyle={{ color: "black" }}
                  contentStyle={{ backgroundColor: "#bfbfbf" }}
                  onPress={() => navigation.goBack()}
                >
                  ביטול
                </Button>
              </View>
              <View style={styles.bottomBtnWrapper}>
                <Button
                  mode="outlined"
                  theme={{ colors: { primary: `white` } }}
                  labelStyle={{ color: "black" }}
                  contentStyle={{ backgroundColor: "#bfbfbf" }}
                  onPress={handleSave}
                >
                  שמור
                </Button>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  ) : (
    <Spinner />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollViewContentContainer: {
    flexGrow: 1,
  },
  mainWrapper: {
    flex: 1,
    justifyContent: "space-around",
  },
  Image: {
    marginVertical: "5%",
    alignItems: "center",
  },
  cameraButtonWrapper: {
    position: "absolute",
    top: 0,
    left: 185,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  galleryButtonWrapper: {
    position: "absolute",
    top: 75,
    left: 170,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageButtonWrapper: {
    position: "absolute",
    top: 137,
    left: 125,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  inputWrapper: {
    marginTop: 20,
  },
  captionError: {
    color: "#d0312d",
  },
  captionErrorWrapper: {
    marginLeft: 5,
  },
  inputsContainer: {
    alignItems: "center",
    marginTop: 15,
  },
  inputsWrapper: {
    width: "80%",
    marginVertical: 20,
  },
  bottomBtnsContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  bottomBtnsWrapper: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomBtnWrapper: {
    width: "49%",
  },
});

export default withCommonScreen(AccountEditScreen, "AccountEditScreen");
