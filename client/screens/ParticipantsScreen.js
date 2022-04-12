import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import {  listUsersApi, shoppingListApi} from "../api/api";
import ParticipantsCard from "../components/ParticipantsCard";
import SearchUserCard from "../components/SearchUserCard";
import {
  FAB,
  Searchbar,
} from "react-native-paper";
import { _getData, _sendPushNotification } from "../utils/Functions";
import PopupDialog from "../components/PopupDialog";
import withCommonScreen from "../hoc/withCommonScreen";
import Spinner from "../components/Spinner";

const ParticipantsScreen = (props) => {
  const { navigation, route, isPageLoaded, setIsPageLoadedTrue, setIsFetchingCondition, isFetching } = props;
  const { shoppingListID, shoppingListTitle } = route.params;
  const [participants, setParticipants] = useState([]);
  const [popupDialogVisible, setPopupDialogVisible] = useState(false);
  const [popupDialogRemoveParticipantVisible, setPopupDialogRemoveParticipantVisible] = useState(false);
  const [deleteParticipantData, setDeleteParticipantData] = useState();
  const [listCreatorId, setListCreatorId] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [searchListUser, setSearchListUser] = useState();
  const [searchEmail, setSearchEmail] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      console.log("Participant screen");
      const creatorID = await getListCreatorByListID();
      const loginUser = await loadUser();
      const data = await getParticipantsInTheShoppingList();

      setListCreatorId(creatorID);
      setCurrentUser(loginUser);
      setParticipants(data);
      setIsPageLoadedTrue();
      setIsFetchingCondition(false);
      console.log(route.params.shoppingListID);
    });
    return unsubscribe;
  }, [navigation, route]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", async () => {
      setSearchEmail("");
    });

    return unsubscribe;
  }, [navigation, route]);

  useEffect(() => {
    if (deleteParticipantData) {
      setPopupDialogRemoveParticipantVisible(true);
    }
  }, [deleteParticipantData]);

  //get all the participants in the list
  const getParticipantsInTheShoppingList = async () => {
    try {
      let res =
        await listUsersApi.apiGetParticipantsInTheShoppingListByListIdIdGet(
          route.params.shoppingListID
        );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  //get the list creator
  const getListCreatorByListID = async () => {
    try {
      let res =
        await shoppingListApi.apiShoppingListGetListCreatorByListIDIdGet(
          shoppingListID
        );
      return res.data.creatorID;
    } catch (error) {
      console.log(error);
    }
  };

  //get to login user
  const loadUser = async () => {
    let u = await _getData("User");
    return u;
  };

  // get all the users, except the list creator, for sending a join requests
  const getUsersToAddToListUsers = async () => {
    try {
      let res = await listUsersApi.apiGetUserByEmailToAddToListUsersGet(
        searchEmail,
        shoppingListID
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  //if there are no participants
  const handleListEmptyComponent = () => {
    return (
      <View
        style={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>אין משתתפים</Text>
      </View>
    );
  };

  //show and hide popup dialog
  const showPopupDialog = () => {
    setPopupDialogVisible(true);
  };

  const cancelPopupDialog = () => {
    setSearchEmail("");
    setSearchResult([]);
    setDeleteParticipantData();
    setPopupDialogVisible(false);
    setPopupDialogRemoveParticipantVisible(false);
  };

  const searchPress = async () => {
    let searchUsers = [];
    if (searchEmail !== "") {
      searchUsers = await getUsersToAddToListUsers();
    }
    setSearchResult(searchUsers);
    console.log("in searchPress");
  };

  const showResult = () => {
    if (searchResult[0].isApproved === 1) {
      return <View style={styles.noResultWrapper}><Text>המשתמש כבר חבר ברשימה</Text></View>;
    } else {
      return (
        <SearchUserCard
          data={searchResult[0]}
          confirm={confirmSendAddRequest}
        />
      );
    }
  };

  // send a request for the user to join, if the user exists and not a member
  const confirmSendAddRequest = async () => {
    let tempSearchResult = [...searchResult];
    let item = { ...tempSearchResult[0], isApproved: 0 };
    tempSearchResult[0] = item;
    setSearchResult(tempSearchResult);
    try {
      const notificationInfo = {
        To: tempSearchResult[0].notificationToken,
        Title: "הזמנה חדשה לרשימה",
        Body: `הוזמנתה ע"י ${currentUser.firstName} ${currentUser.lastName} לרשימה "${shoppingListTitle}"`,
        CategoryIdentifier: "request",
        Data: {
          listID: shoppingListID,
          navigate: "myDrawer",
          screen: "requestsStack",
          userID: searchResult[0].userID,
        },
      };
      console.log("notificationInfo before send:", notificationInfo);

      await listUsersApi.apiShoppingListAddUserForTheListPost({
        listID: shoppingListID,
        userID: searchResult[0].userID,
      });
      await _sendPushNotification(notificationInfo);
    } catch (e) {
      console.log(e);
    }
  };

  const handlePopUpDialogDeleteParticipant = (participantToDelete) => {
    setDeleteParticipantData(participantToDelete);
  };
  const handleDeleteParticipant = async () => {
    await deleteParticipant();
    const data = await getParticipantsInTheShoppingList();
    setParticipants(data);
    cancelPopupDialog();
  };

  // delete a participant from the list users by the list creator
  const deleteParticipant = async (userId) => {
    try {
      await shoppingListApi.apiShoppingListExitShoppingListPost(
        shoppingListID,
        deleteParticipantData.userID
      );
    } catch (e) {
      console.log(e);
    }
  };

  //send data to card component
  const renderListItem = (itemData) => (
    <ParticipantsCard
      data={itemData.item}
      listCreatorId={listCreatorId}
      deleteParticipant={handlePopUpDialogDeleteParticipant}
      currentUser={currentUser}
    />
  );

  const handleRefresh = async () => {
    setIsFetchingCondition(true);
    const data = await getParticipantsInTheShoppingList();
    setParticipants(data);
    setIsFetchingCondition(false);
  };

  return (
    isPageLoaded ?
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={participants}
          renderItem={(item) => renderListItem(item)}
          keyExtractor={(item) => String(item.userID)}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={handleListEmptyComponent}
          refreshing={isFetching}
          onRefresh={() => handleRefresh()}
        />
        {currentUser && listCreatorId && currentUser.userID === listCreatorId && (
          <FAB
            style={styles.fab}
            color="white"
            icon="plus"
            onPress={showPopupDialog}
          />
        )}
        <PopupDialog
          title={"חפוש משתמש"}
          visible={popupDialogVisible}
          cancel={cancelPopupDialog}
          buttonCancelTitle="סגור חיפוש"
        >
          {
            popupDialogVisible &&
            <Searchbar
              placeholder="חיפוש"
              onChangeText={(txt) => setSearchEmail(txt)}
              value={searchEmail}
              theme={{ colors: { primary: "black" }, roundness: 0 }}
              iconColor="black"
              onIconPress={searchPress}
            />
          }

          {searchResult.length === 0 ? (
            <View style={styles.noResultWrapper}>
              <Text>אין תוצאות</Text>
            </View>
          ) : (
            <View>{showResult()}</View>
          )}
        </PopupDialog>
        {deleteParticipantData &&
          <PopupDialog
            title={"מחיקת משתמש מהרשימה"}
            visible={popupDialogRemoveParticipantVisible}
            cancel={cancelPopupDialog}
            confirm={handleDeleteParticipant}
          >
            <Text>{`האם את/ה בטוח/ה שברצונך להוציא את ${deleteParticipantData.firstName + ' ' + deleteParticipantData.lastName} מהרשימה?`}</Text>
          </PopupDialog>
        }
      </View>
      :
      <Spinner />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 10,
  },
  fab: {
    backgroundColor: "black",
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  noResultWrapper: {
    alignItems: "center",
    marginTop: 15,
  },
});
export default withCommonScreen(ParticipantsScreen, "ParticipantsScreen");
