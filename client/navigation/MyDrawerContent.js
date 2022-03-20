import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { DrawerContentScrollView, useDrawerStatus } from '@react-navigation/drawer';
import { Avatar, Title, Caption, Drawer, Badge, Snackbar, Portal } from 'react-native-paper';
import { _getData } from '../utils/Functions';
import { API } from '../api/api';
import GeneralContext from '../utils/GeneralContext';

const MyDrawerContent = (props) => {

    // inputs
    const { navigation } = props;

    // // global states
    const { currentDrawerScreen, setCurrentDrawerScreen } = useContext(GeneralContext);

    // drawer
    const isDrawerOpen = useDrawerStatus() === 'open';

    //varibls
    const [currentUser, setCurrentUser] = useState();
    // const [timeStamp, setTimeStamp] = useState(Date.now());
    // const [coursesAmount, setCoursesAmount] = useState(0);
    // const [eventsAmount, setEventsAmount] = useState(0);
    // const [requestAmount, setRequestAmount] = useState(0);

    // // snackBar
    // const [showSnackBar, setShowSnackBar] = useState(false);
    // const [snackBarMessage, setSnackBarMessage] = useState("");
    // const [snackBarColor, setSnackBarColor] = useState(Colors.snackbarOnSurfaceColor);


    // // קורה בפתיחת הדראוור
    useEffect(() => {
        const init = async () => {
            if (isDrawerOpen) {
                // setTimeStamp(Date.now())
                const user = await _getData("User");
                if (user !== null) {
                    setCurrentUser(user);
                }
                // getDrawerRelevantEventsAmount(user.ID);
                // getDrawerCoursesAmount(user.ID);
                // getAllOpenRequestsAmount(user.ID);
            }
        }
        init()
    }, [isDrawerOpen])


    // התנתקות
    const logout = async () => {
        try {
            console.log("Sign out")
            // await AsyncStorage.removeItem('user');
            // await AsyncStorage.removeItem('expoNotificationTokenDate');
            
             navigation.navigate("login");
             console.log("first")
        } catch (e) {
            // remove error
        }
    }


    // מטפל בבחירת מסך מהדראוור
    const handleSelectedScreen = (screenName) => {
        setCurrentDrawerScreen(screenName);
        navigation.navigate(screenName);
    };



    return (
        currentUser ?
            <View style={styles.drawerContent}>
                <DrawerContentScrollView {...props}>
                    <View style={styles.drawerContent}>
                        <View style={styles.userInfoSection}>
                            <View style={styles.userInfoWrapper}>
                                <Avatar.Image
                                    size={50}
                                    // theme={{ colors: { primary: Colors.avatarBackground } }}
                                    source={{
                                        uri: `${API}/uploads/users/${currentUser.Img}`
                                    }} />
                                <View style={styles.userNameWrapper}>
                                    <Title style={styles.title}>{currentUser.FirstName} {currentUser.LastName}</Title>
                                </View>
                            </View>
                        </View>
                        <Drawer.Section style={styles.drawerSection}>

                            {/* <Drawer.Item
                                icon="star"
                                label="התחברות"
                                onPress={() => handleSelectedScreen("CoursesBottomTabNavigator")}
                            /> */}

                            <Drawer.Item
                                theme={{ colors: { primary: "black" } }}
                                active={currentDrawerScreen === "homeStack"}
                                icon="home"
                                label="דף בית"
                                onPress={() => handleSelectedScreen("homeStack")}
                                style={styles.drawerItem}
                            />

                            <Drawer.Item
                                theme={{ colors: { primary: "black" } }}
                                active={currentDrawerScreen === "requestsStack"}
                                icon="bell-outline"
                                label="בקשות"
                                onPress={() => handleSelectedScreen("requestsStack")}
                                style={styles.drawerItem}
                            />

                            <Drawer.Item
                                theme={{ colors: { primary: "black" } }}
                                active={currentDrawerScreen === "profileStack"}
                                icon="account"
                                label="חשבון"
                                onPress={() => handleSelectedScreen("profileStack")}
                                style={styles.drawerItem}
                            />

                        </Drawer.Section>
                    </View>
                </DrawerContentScrollView>
                <Drawer.Section style={styles.bottomDrawerSection}>
                    <Drawer.Item
                        theme={{ colors: { text: "#990f02" } }}
                        icon="logout"
                        label="התנתק/י"
                        onPress={logout}
                        style={styles.drawerItem}
                        color="red"
                    />
                </Drawer.Section>

            </View>
            :
            null
    );
};

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoWrapper: {
        flexDirection: "row",
        paddingVertical: 15,
        alignItems: "center"
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    userNameWrapper: {
        marginLeft: 15,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
    },
    caption: {
        fontSize: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 10
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    requestsBadge: {
        margin: 2,
        // backgroundColor: Colors.error,
        alignSelf: "center"
    },
    drawerItem: {
        paddingVertical: 2.5,
        // borderWidth:1,
        // borderColor:"#f1f1f1"
    }
});

export default MyDrawerContent;