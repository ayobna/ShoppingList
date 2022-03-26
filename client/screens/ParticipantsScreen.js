import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableHighlight, StyleSheet, Alert } from "react-native";
import { API, listUsersApi, shoppingListApi, requestApi } from "../api/api";
import ParticipantsCard from "../components/ParticipantsCard";
import SearchUserCard from "../components/SearchUserCard";
import { FAB, TextInput, IconButton, Button, Avatar, Searchbar } from "react-native-paper";
import { _getData } from "../utils/Functions";
import PopupDialog from "../components/PopupDialog";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const ParticipantsScreen = (props) => {
  const { navigation, route } = props;
  const [participants, setParticipants] = useState([]);
  const shoppingListID = route.params.shoppingListID;
  const [popupDialogVisible, setPopupDialogVisible] = useState(false);
  const [listCreatorId, setListCreatorId] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [searchListUser, setSearchListUser] = useState();
  const [searchEmail, setSearchEmail] = useState();
  const [isSearch, setIsSearch] = useState(false);

  const [searchResult, setSearchResult] = useState([]);



  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      console.log("Participant screen")
      const creatorID = await GetListCreatorByListID();
      const loginUser = await LoadUser();
      const data = await GetParticipantsInTheShoppingList();
     
      setListCreatorId(creatorID);
      setCurrentUser(loginUser);
      setParticipants(data);
   
      console.log(route.params.shoppingListID)

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
    let res = await listUsersApi.apiGetParticipantsInTheShoppingListByListIdIdGet(route.params.shoppingListID);
    let data = res.data;
    return data;
  };

  //get the list creator
  const GetListCreatorByListID = async () => {
    let res = await shoppingListApi.apiShoppingListGetListCreatorByListIDIdGet(shoppingListID);
    return res.data.creatorID;
  };

  //get to login user
  const LoadUser = async () => {
    let u = await _getData("User");
    return u;
  };

  // get all the users, except the list creator, for sending a join requests
  const GetUsersToAddToListUsers = async () => {
    console.log("in GetUsersToAddToListUsers" + searchEmail)
    let res = await listUsersApi.apiGetUserByEmailToAddToListUsersEmailGet(searchEmail);
    let data = res.data;
    console.log("out GetUsersToAddToListUsers")
    return data;
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
    setPopupDialogVisible(false);
  };

  const searchPress = async () => {
    console.log("in searchPress")
    const searchUsers = await GetUsersToAddToListUsers();
    setSearchResult(searchUsers);
    console.log("searchPress out  " + searchUsers[0].firstName )
  }

  const showResolt = () => {
    let participantsIndex = participants.findIndex((email) => email.email === searchEmail);
    console.log("showResolt"+ searchResult[0].firstName)
    if (participantsIndex === -1) {
        return (
          <View>
            <SearchUserCard data={searchResult[0]} />
          </View>
        );
    }
    else {
      return (
        <View>
          <Text>המשתמש כבר חבר ברשימה</Text>
        </View>
      );
    }
  }

  // send a request for the user to join, if the user exists and not a member
  const confirmSendAddRequest = async () => {
    console.log("in confirmSendAddRequest")
    try {
      await listUsersApi.apiShoppingListAddUserForTheListPost({ listID: shoppingListID, userID: searchResult[0].userID });
      console.log("sendRequestToJoin")
      Alert.alert("הבקשה נשלחה")
    } catch (e) {
      console.log(e);
    }
  };



  // delete a participant from the list users by the list creator
  const deletePraticipant = async (userId) => {
    await requestApi.apiRequestsApiRequestsDeclineRequestPost({ listID: shoppingListID, userID: userId });
    GetParticipantsInTheShoppingList();
  };

  //send data to card component
  const renderListItem = (itemData) => (
    <ParticipantsCard data={itemData.item} listCreatorId={listCreatorId} deletePraticipant={deletePraticipant} currentUser={currentUser} />
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
      {currentUser && listCreatorId && currentUser.userID === listCreatorId && (<FAB
        style={styles.fab}
        color="white"
        icon="plus"
        onPress={showPopupDialog}
      />)}
      <View style={{ maxHeight: '60%' }}>
        <PopupDialog
          title={"חפוש משתמש"}
          visible={popupDialogVisible}
          cancel={cancelPopupDialog}
          confirm={confirmSendAddRequest}
        >
          <Searchbar
            placeholder="חיפוש"
            onChangeText={(txt) => setSearchEmail(txt)}
            value={searchEmail}
            theme={{ colors: { primary: "black" }, roundness: 0 }}
            iconColor="black"
            onIconPress={searchPress}
          />
          {
            searchResult.length === 0 ? 
            <View><Text>אין תוצאות</Text></View>
            :
            <View>{showResolt()}</View>
          }

          {/* {isSearch ? <Text>{showResolt()}</Text>:<Text>חיפוש לפי מייל</Text>}
         */}
          {/* <FlatList
        showsVerticalScrollIndicator={true}
        data={participants}
        renderItem={(item) => renderListItem(item)}
        keyExtractor={(item) => String(item.userID)}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={handleListEmptyComponent}
      />     */}
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
  }
});
export default ParticipantsScreen;
