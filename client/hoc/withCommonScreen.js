import React, { useEffect, useContext, useState } from "react";
import GeneralContext from '../utils/GeneralContext';

const withCommonScreen = (WrappedComponent, screenName) => props => {

    const { navigation, route } = props;
    const { setCurrentDrawerScreen, requestDataGlobal, setRequestDataGlobal } = useContext(GeneralContext);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async () => {
            switch (screenName) {
                case 'CreateListScreen':
                case 'ListScreen':
                case 'ParticipantsScreen':
                case 'ChatScreen':
                case 'HomeScreen':
                    setCurrentDrawerScreen("homeStack");
                    break;
                case 'RequestsScreen':
                    setCurrentDrawerScreen("requestsStack");
                    break;
                case 'AccountEditScreen':
                case 'AccountPasswordEditScreen':
                case 'AccountScreen':
                    setCurrentDrawerScreen("AccountStack");
                    break;
                default:
                    setCurrentDrawerScreen("homeStack");
                    break;
            }
        });
        return unsubscribe;
    }, [navigation, route]);

    useEffect(() => {
        if (requestDataGlobal) {
            if (screenName === 'RegisterScreen' || screenName === 'LoginScreen') {
                resetRequestDataGlobalState();
            }
            else if (screenName !== "RequestsScreen") {
                navigation.navigate(requestDataGlobal.navigate, {
                    screen: requestDataGlobal.screen
                });
            }
        }
    }, [requestDataGlobal]);

    const resetRequestDataGlobalState = () => {
        setRequestDataGlobal();
    };


    return (
        screenName === 'RequestsScreen' ?
            <WrappedComponent
                {...props}
                resetRequestDataGlobalState={resetRequestDataGlobalState}
                requestDataGlobal={requestDataGlobal}
            />
            :
            <WrappedComponent
                {...props}
            />
    );
};

export default withCommonScreen;