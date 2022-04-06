import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableHighlight,
  StyleSheet,
  Alert,
} from "react-native";
import { API, listUsersApi, shoppingListApi, requestApi } from "../api/api";
import ParticipantsCard from "../components/ParticipantsCard";
import SearchUserCard from "../components/SearchUserCard";
import {
  FAB,
  TextInput,
  IconButton,
  Button,
  Avatar,
  Searchbar,
} from "react-native-paper";
import { _getData, _sendPushNotification } from "../utils/Functions";
import PopupDialog from "../components/PopupDialog";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import withCommonScreen from "../hoc/withCommonScreen";

const ParticipantsScreen = (props) => {
  const { navigation, route } = props;
  const { shoppingListID, shoppingListTitle } = route.params;
  const [participants, setParticipants] = useState([]);
  const [popupDialogVisible, setPopupDialogVisible] = useState(false);
  const [listCreatorId, setListCreatorId] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [searchListUser, setSearchListUser] = useState();
  const [searchEmail, setSearchEmail] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      console.log("Participant screen");
      const creatorID = await GetListCreatorByListID();
      const loginUser = await LoadUser();
      const data = await GetParticipantsInTheShoppingList();

      setListCreatorId(creatorID);
      setCurrentUser(loginUser);
      setParticipants(data);

      console.log(route.params.shoppingListID);
    });
    return unsubscribe;
  }, [navigation, route]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", async () => {
      setSearchEmail("");
    });

    return unsubscribe;
  }, [route]);

  //get all the participants in the list
  const GetParticipantsInTheShoppingList = async () => {
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
  const GetListCreatorByListID = async () => {
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
  const LoadUser = async () => {
    let u = await _getData("User");
    return u;
  };

  // get all the users, except the list creator, for sending a join requests
  const GetUsersToAddToListUsers = async () => {
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
    setPopupDialogVisible(false);
  };

  const searchPress = async () => {
    let searchUsers = [];
    if (searchEmail !== "") {
      searchUsers = await GetUsersToAddToListUsers();
    }
    setSearchResult(searchUsers);
    console.log("in searchPress");
  };

  const showResult = () => {
    if (searchResult[0].isApproved === 1) {
      return <Text>המשתמש כבר חבר ברשימה</Text>;
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

  // delete a participant from the list users by the list creator
  const deleteParticipant = async (userId) => {
    console.log("deleteParticipant");
    try {
      console.log("deleteParticipant");
      let res = await shoppingListApi.apiShoppingListExitShoppingListPost(
        shoppingListID,
        userId
      );
      console.log("deleteParticipant", res.data);
      const data = await GetParticipantsInTheShoppingList();
      setParticipants(data);
    } catch (e) {
      console.log(e);
    }
  };

  //send data to card component
  const renderListItem = (itemData) => (
    <ParticipantsCard
      data={itemData.item}
      listCreatorId={listCreatorId}
      deleteParticipant={deleteParticipant}
      currentUser={currentUser}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={participants}
        renderItem={(item) => renderListItem(item)}
        keyExtractor={(item) => String(item.userID)}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={handleListEmptyComponent}
      />
      {currentUser && listCreatorId && currentUser.userID === listCreatorId && (
        <FAB
          style={styles.fab}
          color="white"
          icon="plus"
          onPress={showPopupDialog}
        />
      )}
      <View>
        <PopupDialog
          title={"חפוש משתמש"}
          visible={popupDialogVisible}
          cancel={cancelPopupDialog}
          buttonCancelTitle="סגור חיפוש"
        >
          <Searchbar
            placeholder="חיפוש"
            onChangeText={(txt) => setSearchEmail(txt)}
            value={searchEmail}
            theme={{ colors: { primary: "black" }, roundness: 0 }}
            iconColor="black"
            onIconPress={searchPress}
          />

          {searchResult.length === 0 ? (
            <View style={styles.noResultWrapper}>
              <Text>אין תוצאות</Text>
            </View>
          ) : (
            <View>{showResult()}</View>
          )}
        </PopupDialog>
      </View>
    </View>
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
