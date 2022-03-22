import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableHighlight, StyleSheet } from "react-native";
import { API, listUsersApi, shoppingListApi, requestApi } from "../api/api";
import ParticipantsCard from "../components/ParticipantsCard";
import { FAB, TextInput, IconButton, Button, Avatar } from "react-native-paper";
import { _getData } from "../utils/Functions";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const ParticipantsScreen = (props) => {
  const { navigation, route } = props;
  const [participants, setParticipants] = useState([]);
  const shoppingListID = route.params.shoppingListID;

  const [listCreatorId, setListCreatorId] = useState();
  const [currentUser, setCurrentUser] = useState();



  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      console.log("Participant screen")
      const creatorID = await GetListCreatorByListID();
      const loginUser = await LoadUser();
      const data = await GetParticipantsInTheShoppingList();
      setListCreatorId(creatorID);
      setCurrentUser(loginUser);
      setParticipants(data);

    });
    return unsubscribe;
  }, [navigation, route]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", async () => { });
    return unsubscribe;
  }, [route]);

  const GetParticipantsInTheShoppingList = async () => {
    let res =
      await listUsersApi.apiGetParticipantsInTheShoppingListByListIdIdGet(
        route.params.shoppingListID
      );
    let data = res.data;
    return data;
  };
  const GetListCreatorByListID = async () => {
    let res = await shoppingListApi.apiShoppingListGetListCreatorByListIDIdGet(shoppingListID);
    return res.data.creatorID;
  };

  const LoadUser = async () => {
    let u = await _getData("User");
    return u;
  };



  const handleListEmptyComponent = () => {
    return (
      <View
        style={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>אין משתתפים</Text>
      </View>
    );
  };

  const addUser = async () => {
    console.log("in addUser")
  };
  // delete a praticipant from the list users by the list creator
  const deletePraticipant = async (userId) => {
    await requestApi.apiRequestsApiRequestsDeclineRequestPost({ listID: shoppingListID, userID: userId });
    GetParticipantsInTheShoppingList();
  };

  const renderListItem = (itemData) => (
    <ParticipantsCard data={itemData.item} listCreatorId={listCreatorId} deletePraticipant={deletePraticipant} currentUser={currentUser} />
  );


  console.log("current user: ",currentUser)
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
        onPress={addUser}
      />)}


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
