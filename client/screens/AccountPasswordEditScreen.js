import React, { useEffect, useState } from "react";
import { userApi } from "../api/api";
import { _getData, _storeData } from "../utils/Functions";
import { View, StyleSheet, ScrollView } from "react-native";
import { TextInput, Button, Caption, } from "react-native-paper";
import withCommonScreen from "../hoc/withCommonScreen";
import Spinner from "../components/Spinner";
import * as Crypto from 'expo-crypto';
import Colors from "../utils/Colors";

const AccountPasswordEditScreen = (props) => {
    const { navigation, route, isPageLoaded, setIsPageLoadedTrue, isButtonSpinner, setIsButtonSpinnerFalse, setIsButtonSpinnerTrue } = props;

    const [currentUser, setCurrentUser] = useState();
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [oldPasswordErrorMessage, setOldPasswordErrorMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("");
    const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async () => {
            const user = await loadUser();
            setCurrentUser(user);
            setIsPageLoadedTrue();
        });
        return unsubscribe;
    }, [navigation, route]);



    const loadUser = async () => {
        let u = await _getData("User");
        return u;
    };

    const handleSave = async () => {
        console.log("Old password:", oldPassword)
        console.log("New password:", password)

        if (checkValidation() !== 3) {
            return;
        }
        setIsButtonSpinnerTrue();
        const result = await save();
        console.log(result);
        if (result === -1) {
            setOldPasswordErrorMessage("הסיסמה הישנה שגויה!");
            setIsButtonSpinnerFalse();
            return;
        }
        navigation.goBack();
    };

    const save = async () => {

        const NewPassword = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA512,
            password
        );
        const OldPassword = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA512,
            oldPassword
        );
        try {
            const userData = { Email: currentUser.email, Password: NewPassword };
            let res = await userApi.apiUsersUpdatePasswordInProfilePost(
                OldPassword,
                userData
            );
            return res.data;
        } catch (e) {
            console.log(e);
        }
    };

    const checkValidation = () => {
        const passwordRgx =
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!#$%&*_=@])[A-Za-z0-9!#$%&*_=@]{5,}$/; // סיסמה חייבת להכיל אות גדולה, ספרה וסימן מיוחד. אורך סיסמה לפחות 5 תווים
        let counter = 0;

        if (!passwordRgx.test(oldPassword)) {
            setOldPasswordErrorMessage("סיסמה חייבת להכיל אות גדולה, ספרה וסימן מיוחד. אורך סיסמה לפחות 5 תווים");
        }
        else {
            setOldPasswordErrorMessage("");
            counter++;
        }
        if (!passwordRgx.test(password)) {
            setPasswordErrorMessage("סיסמה חייבת להכיל אות גדולה, ספרה וסימן מיוחד. אורך סיסמה לפחות 5 תווים");
        }
        else {
            setPasswordErrorMessage("");
            counter++;
        }
        if (password !== confirmPassword) {
            setConfirmPasswordErrorMessage("הסיסמאות אינן זהות");
        }
        else {
            setConfirmPasswordErrorMessage("");
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
                                <TextInput
                                    label="סיסמה ישנה"
                                    mode="outlined"
                                    value={oldPassword}
                                    onChangeText={text => setOldPassword(text)}
                                    secureTextEntry={!isOldPasswordVisible}
                                    selectionColor="#919191"
                                    activeOutlineColor="#919191"
                                    dense
                                    style={{ backgroundColor: "white" }}
                                    left={<TextInput.Icon color={oldPasswordErrorMessage !== "" ? "#d0312d" : "#c1c1c1"} name="lock-outline" />}
                                    right={<TextInput.Icon forceTextInputFocus={false} color={Colors.our_dark_blue} name={!isOldPasswordVisible ? "eye" : "eye-off"} onPress={() => setIsOldPasswordVisible(!isOldPasswordVisible)} />}
                                    error={oldPasswordErrorMessage !== ""}
                                />
                                {
                                    oldPasswordErrorMessage !== "" &&
                                    <View style={styles.captionErrorWrapper}>
                                        <Caption style={styles.captionError}>{oldPasswordErrorMessage}</Caption>
                                    </View>
                                }
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        label="סיסמה חדשה"
                                        mode="outlined"
                                        value={password}
                                        onChangeText={text => setPassword(text)}
                                        secureTextEntry={!isPasswordVisible}
                                        selectionColor="#919191"
                                        activeOutlineColor="#919191"
                                        dense
                                        style={{ backgroundColor: "white" }}
                                        left={<TextInput.Icon color={passwordErrorMessage !== "" ? "#d0312d" : "#c1c1c1"} name="lock-outline" />}
                                        right={<TextInput.Icon forceTextInputFocus={false} color={Colors.our_dark_blue} name={!isPasswordVisible ? "eye" : "eye-off"} onPress={() => setIsPasswordVisible(!isPasswordVisible)} />}
                                        error={passwordErrorMessage !== ""}
                                    />
                                    {
                                        passwordErrorMessage !== "" &&
                                        <View style={styles.captionErrorWrapper}>
                                            <Caption style={styles.captionError}>{passwordErrorMessage}</Caption>
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
                                        dense
                                        style={{ backgroundColor: "white" }}
                                        left={<TextInput.Icon color={confirmPasswordErrorMessage !== "" ? "#d0312d" : "#c1c1c1"} name="lock-outline" />}
                                        right={<TextInput.Icon forceTextInputFocus={false} color={Colors.our_dark_blue} name={!isConfirmPasswordVisible ? "eye" : "eye-off"} onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} />}
                                        error={confirmPasswordErrorMessage !== ""}
                                    />
                                    {
                                        confirmPasswordErrorMessage !== "" &&
                                        <View style={styles.captionErrorWrapper}>
                                            <Caption style={styles.captionError}>{confirmPasswordErrorMessage}</Caption>
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
                                        mode="contained"
                                        // theme={{ colors: { primary: `white` } }}
                                        color="#bfbfbf"
                                        onPress={() => navigation.goBack()}
                                    >
                                        ביטול
                                    </Button>
                                </View>
                                <View style={styles.bottomBtnWrapper}>

                                    {
                                        isButtonSpinner ?
                                            <View style={styles.btnSpinnerContainer}>
                                                <Spinner smallSize="small" color="white" />
                                            </View>
                                            :
                                            <Button
                                                mode="contained"
                                                color={Colors.our_dark_blue}
                                                onPress={handleSave}
                                            >
                                                שמור
                                            </Button>
                                    }
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
        justifyContent: "center"
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
    },
    btnSpinnerContainer: {
        backgroundColor: Colors.our_dark_blue,
        padding: 8,
        borderRadius: 5
    }
});

export default withCommonScreen(AccountPasswordEditScreen, 'AccountPasswordEditScreen');

