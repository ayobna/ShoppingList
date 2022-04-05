import React, { useEffect, useContext, useState } from "react";
import GeneralContext from '../utils/GeneralContext';

const withCommonScreen = (WrappedComponent, screen) => props => {

    const { navigation, route } = props;
    const { setCurrentDrawerScreen, requestDataGlobal, setRequestDataGlobal } = useContext(GeneralContext);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async () => {
            switch (screen) {
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
                case 'AccountScreen':
                    setCurrentDrawerScreen("AccountStack");
                    break;
            }
        });
        return unsubscribe;
    }, [navigation, route]);

    useEffect(() => {
        if (requestDataGlobal) {
            if (screen === 'RegisterScreen' || screen === 'LoginScreen') {
                resetRequestDataGlobalState();
            }
            else if (screen !== "RequestsScreen") {
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
        screen === 'RequestsScreen' ?
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