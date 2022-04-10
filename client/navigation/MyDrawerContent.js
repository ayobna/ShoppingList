import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerContentScrollView, useDrawerStatus } from '@react-navigation/drawer';
import { Avatar, Title, Drawer } from 'react-native-paper';
import { _getData, _logout, _removeData } from '../utils/Functions';
import { API } from '../api/api';
import GeneralContext from '../utils/GeneralContext';
import Colors from '../utils/Colors';

const MyDrawerContent = (props) => {

    // inputs
    const { navigation } = props;

    // // global states
    const { currentDrawerScreen, setCurrentDrawerScreen } = useContext(GeneralContext);

    // drawer
    const isDrawerOpen = useDrawerStatus() === 'open';

    //varibls
    const [currentUser, setCurrentUser] = useState();



    // // קורה בפתיחת הדראוור
    useEffect(() => {
        const init = async () => {
            if (isDrawerOpen) {
                // setTimeStamp(Date.now())
                const user = await _getData("User");
                if (user !== null) {
                    setCurrentUser(user);
                }
            }
        }
        init()
    }, [isDrawerOpen])


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
                                    theme={{ colors: { primary: "black" } }}
                                    source={{
                                        uri: `${API}/uploads/users/${currentUser.img}`
                                    }} />
                                <View style={styles.userNameWrapper}>
                                    <Title style={styles.title}>{currentUser.firstName} {currentUser.lastName}</Title>
                                </View>
                            </View>
                        </View>
                        <Drawer.Section style={styles.drawerSection}>

                            <Drawer.Item
                                theme={{ colors: { primary: Colors.our_dark_blue } }}
                                active={currentDrawerScreen === "homeStack"}
                                icon="home"
                                label="דף בית"
                                onPress={() => handleSelectedScreen("homeStack")}
                                style={styles.drawerItem}
                            />

                            <Drawer.Item
                                theme={{ colors: { primary: Colors.our_dark_blue } }}
                                active={currentDrawerScreen === "requestsStack"}
                                icon="bell-outline"
                                label="בקשות"
                                onPress={() => handleSelectedScreen("requestsStack")}
                                style={styles.drawerItem}
                            />

                            <Drawer.Item
                                theme={{ colors: { primary: Colors.our_dark_blue } }}
                                active={currentDrawerScreen === "AccountStack"}
                                icon="account"
                                label="חשבון"
                                onPress={() => handleSelectedScreen("AccountStack")}
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
                        onPress={() => _logout(navigation)}
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
        paddingVertical: 3,
        // borderWidth:1,
        // borderColor:"#f1f1f1"
    }
});

export default MyDrawerContent;