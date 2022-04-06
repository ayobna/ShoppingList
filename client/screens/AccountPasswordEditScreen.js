import react, { useEffect, useState, useCallback } from "react";
import { API, userApi } from "../api/api";
import * as ImagePicker from "expo-image-picker";
import { _getData, _storeData } from "../utils/Functions";
import {
    View,
    StyleSheet,
    ScrollView
} from "react-native";
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const AccountPasswordEditScreen = (props) => {
    const { navigation, route } = props;

    const [currentUser, setCurrentUser] = useState();

    const [isPageLoaded, setIsPageLoaded] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async () => {
            const user = await loadUser();
            setCurrentUser(user);
            setIsPageLoaded(true);
        });
        return unsubscribe;
    }, [navigation, route]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("blur", () => {
            setIsPageLoaded(false);
        });
        return unsubscribe;
    }, [navigation, route]);

    const loadUser = async () => {
        let u = await _getData("User");
        return u;
    };

    const save = async () => {
        try {
            let isHaveBase64Img = false;
            let userToUpdate = user;
            if (imageBase64 !== null) {
                isHaveBase64Img = true;
                userToUpdate.img = imageBase64;
            }
            //console.log(imageBase64)
            let res = await userApi.apiUserUpdateUserPost(
                isHaveBase64Img,
                userToUpdate
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

    return (
        isPageLoaded ?
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
                    <View style={styles.mainWrapper}>
                        <View style={styles.inputsContainer}>
                            {/* <View style={{ width: "100%", paddingLeft: 10 }}>
                                <Caption>פרטים אישיים</Caption>
                            </View>
                            <Divider style={{ width: "100%" }} /> */}
                            <View style={styles.inputsWrapper}>
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
                                    {
                                        userInputsErrorMessage.Password !== "" &&
                                        <View style={styles.captionErrorWrapper}>
                                            <Caption style={styles.captionError}>{userInputsErrorMessage.Password}</Caption>
                                        </View>
                                    }
                                </View>

                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        label="אישור סיסמה"
                                        mode="outlined"
                                        value={confirmPassword}
                                        onChangeText={text => setConfirmPassword(text)}
                                        secureTextEntry={!isConfirmPasswordVisible}
                                        selectionColor="#919191"
                                        activeOutlineColor="#919191"
                                        dense
                                        style={{ backgroundColor: "white" }}
                                        left={<TextInput.Icon color={userInputsErrorMessage.ConfirmPassword !== "" ? "#d0312d" : "#c1c1c1"} name="lock-outline" />}
                                        right={<TextInput.Icon forceTextInputFocus={false} color="#919191" name={!isConfirmPasswordVisible ? "eye" : "eye-off"} onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} />}
                                        error={userInputsErrorMessage.ConfirmPassword !== ""}
                                    />
                                    {
                                        userInputsErrorMessage.ConfirmPassword !== "" &&
                                        <View style={styles.captionErrorWrapper}>
                                            <Caption style={styles.captionError}>{userInputsErrorMessage.ConfirmPassword}</Caption>
                                        </View>
                                    }
                                </View>
                            </View>
                            <View>
                            </View>
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
            :
            <Spinner />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    scrollViewContentContainer: {
        flexGrow: 1
    },
    mainWrapper: {
        flex: 1,
        justifyContent: "space-around"
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
        alignItems: "center"
    },
    galleryButtonWrapper: {
        position: "absolute",
        top: 75,
        left: 170,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center"
    },
    removeImageButtonWrapper: {
        position: "absolute",
        top: 137,
        left: 125,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center"
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
        marginTop: 15
    },
    inputsWrapper: {
        width: "80%",
        marginVertical: 20
    },
    bottomBtnsContainer: {
        alignItems: "center",
        marginVertical: 30
    },
    bottomBtnsWrapper: {
        width: "80%",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    bottomBtnWrapper: {
        width: "49%"
    }
});

export default withCommonScreen(AccountPasswordEditScreen, 'AccountPasswordEditScreen');

