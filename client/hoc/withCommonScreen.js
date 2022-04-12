import React, { useEffect, useContext, useState } from "react";
import GeneralContext from '../utils/GeneralContext';

const withCommonScreen = (WrappedComponent, screenName) => props => {

    const { navigation, route } = props;
    const { setCurrentDrawerScreen, requestDataGlobal, setRequestDataGlobal } = useContext(GeneralContext);
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isButtonSpinner, setIsButtonSpinner] = useState(false);
    const [snackBarDetails, setSnackBarDetails] = useState({
        visible: false,
        duration: 3000,
        message: "",
        color: "green",
        timeStamp: new Date().getMilliseconds()
    });

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
        const unsubscribe = navigation.addListener("blur", async () => {
            setIsPageLoaded(false);
            setIsButtonSpinner(false);
            setSnackBar({
                visible: false,
                duration: 3000,
                message: "",
                color: "green",
                timeStamp: new Date().getMilliseconds()
            });

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

    const setIsPageLoadedTrue = () => {
        setIsPageLoaded(true);
    };

    const setIsFetchingCondition = (condition) => {
        setIsFetching(condition);
    };


    const resetRequestDataGlobalState = () => {
        setRequestDataGlobal();
    };


    const setIsButtonSpinnerCondition = (condition) => {
        setIsButtonSpinner(condition);
    };


    const setSnackBar = (data = { visible: false, duration: 3000, message: "", color: "green", timeStamp: new Date().getMilliseconds() }) => {
        setSnackBarDetails(data);
    };



    return (
        <WrappedComponent
            {...props}
            resetRequestDataGlobalState={resetRequestDataGlobalState}
            requestDataGlobal={requestDataGlobal}
            isPageLoaded={isPageLoaded}
            setIsPageLoadedTrue={setIsPageLoadedTrue}
            setIsFetchingCondition={setIsFetchingCondition}
            isFetching={isFetching}
            isButtonSpinner={isButtonSpinner}
            setIsButtonSpinnerCondition={setIsButtonSpinnerCondition}
            snackBarDetails={snackBarDetails}
            setSnackBar={setSnackBar}

        />
    );
};

export default withCommonScreen;