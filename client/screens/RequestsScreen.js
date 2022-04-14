import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Divider, Snackbar } from 'react-native-paper';
import { requestApi } from "../api/api";
import PopupDialog from '../components/PopupDialog';
import RequestsCard from '../components/RequestsCard';
import Spinner from '../components/Spinner';
import withCommonScreen from '../hoc/withCommonScreen';
import { _getData } from '../utils/Functions';



const RequestsScreen = (props) => {
  // props
  const {
    navigation,
    route,
    resetRequestDataGlobalState,
    requestDataGlobal,
    isPageLoaded,
    setIsPageLoadedTrue,
    setIsFetchingCondition,
    isFetching,
    snackBarDetails,
    setSnackBar
  } = props;

  // states
  const [currentUser, setCurrentUser] = useState();
  const [requests, setRequests] = useState([]);
  const [popupDialogVisible, setPopupDialogVisible] = useState(false);
  const [requestData, setRequestData] = useState();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      const user = await _getData("User");
      if (user !== null) {
        setCurrentUser(user);
        const data = await getRequests(user.userID);
        setRequests(data);
        setIsPageLoadedTrue();
        setIsFetchingCondition(false);
      }
    });
    return unsubscribe;
  }, [navigation, route]);



  useEffect(() => {
    if (requestData) {
      setPopupDialogVisible(true);
    }
  }, [requestData]);

  useEffect(() => {
    const init = async () => {
      if (requestDataGlobal) {
        switch (requestDataGlobal.actionIdentifier) {
          case "ok":
            console.log("ok - withCommonScreen")
            await handleConfirmRequest(requestDataGlobal.listID);
            setSnackBar({ visible: true, duration: 3000, message: "הבקשה אושרה!", color: "green", timeStamp: new Date().getMilliseconds() })
            break;
          case "cancel":
            console.log("Cancel - withCommonScreen")
            await declineRequest();
            setSnackBar({ visible: true, duration: 3000, message: "הבקשה נדחתה!", color: "green", timeStamp: new Date().getMilliseconds() })
            break;
          default:
            console.log("Default - withCommonScreen")
            const data = await getRequests(requestDataGlobal.userID);
            setRequests(data);
            break;
        }
        resetRequestDataGlobalState();
      }
    };
    init();
  }, [requestDataGlobal]);

  const getRequests = async (userID) => {
    let res = await requestApi.apiRequestsApiRequestsGetRequestsByUserIdIdGet(userID);
    return res.data
  }

  // מרנדר את הבקשות
  const renderListItem = (itemData) => (
    <RequestsCard data={itemData.item} navigation={navigation} handleConfirmRequest={handleConfirmRequest} handleDeclineRequest={handleDeclineRequest} />
  );

  const handleListEmptyComponent = (listID) => {
    return (
      <View
        style={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>אין בקשות</Text>
      </View>
    );
  };

  const handleSeparatorComponent = (listID) => {
    return (
      <Divider />
    );
  };

  const handleConfirmRequest = async (listID) => {
    const userID = requestDataGlobal ? requestDataGlobal.userID : currentUser.userID;
    try {
      await requestApi.apiRequestsApiRequestsConfirmRequestPost({ listID: listID, userID: userID });
      const data = await getRequests(userID);
      setRequests(data);

    } catch (e) {
      console.log(e);
    }
  };

  const handleDeclineRequest = (listID) => {
    setRequestData(listID);
  };

  const handleCancelPopupDialog = () => {
    setRequestData();
    setPopupDialogVisible(false);
  };

  const declineRequest = async () => {
    const userID = requestDataGlobal ? requestDataGlobal.userID : currentUser.userID;
    const listID = requestDataGlobal ? requestDataGlobal.listID : requestData;
    try {
      await requestApi.apiRequestsApiRequestsDeclineRequestPost({ listID: listID, userID: userID });
      const data = await getRequests(userID);
      setRequests(data);
      handleCancelPopupDialog();

    } catch (e) {
      console.log(e);
    }
  };

  const handleRefresh = async () => {
    const userID = requestDataGlobal ? requestDataGlobal.userID : currentUser.userID;
    setIsFetchingCondition(true);
    const data = await getRequests(userID);
    setRequests(data);
    setIsFetchingCondition(false);
  };


  return (
    isPageLoaded ?
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={requests}
          renderItem={(item) => renderListItem(item)}
          keyExtractor={(item) => String(item.listID)}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={handleListEmptyComponent}
          ItemSeparatorComponent={handleSeparatorComponent}
          refreshing={isFetching}
          onRefresh={() => handleRefresh()}
        />
        <PopupDialog
          title={"האם ברצונך לבטל בקשה?"}
          visible={popupDialogVisible}
          cancel={handleCancelPopupDialog}
          confirm={declineRequest}
        />
        {
          snackBarDetails.visible &&
          <Snackbar
            visible={snackBarDetails.visible}
            onDismiss={() => setSnackBar()}
            duration={snackBarDetails.duration}
            style={{ backgroundColor: snackBarDetails.color }}
          >
            {snackBarDetails.message}
          </Snackbar>
        }
      </View>
      :
      <Spinner />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  }
});

export default withCommonScreen(RequestsScreen, 'RequestsScreen');