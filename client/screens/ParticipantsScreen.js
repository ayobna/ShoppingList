import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableHighlight,
  StyleSheet,
} from "react-native";
import { API, listUsersApi, shoppingListApi } from "../api/api";
import ParticipantsCard from "../components/ParticipantsCard";
import { TextInput, IconButton, Button, Avatar } from "react-native-paper";
import { _getData } from "../utils/Functions";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const ParticipantsScreen = (props) => {
  const { navigation, route } = props;
  const [participants, setParticipants] = useState([]);
  const shoppingListID = route.params.shoppingListID;

  const [listCreatorId, setListCreatorId] = useState();
  const [currentUser, setCurrentUser] = useState();


  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      GetParticipantsInTheShoppingList();
      GetListCreatorByListID();
      LoadDUser();
    });
    return unsubscribe;
  }, [route]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", async () => {});
    return unsubscribe;
  }, [route]);

  const GetParticipantsInTheShoppingList = async () => {
    let res =
      await listUsersApi.apiGetParticipantsInTheShoppingListByListIdIdGet(
        route.params.shoppingListID
      );
    let data = res.data;
    setParticipants(data);
  };
  const GetListCreatorByListID = async () => {
    let res = await shoppingListApi.apiShoppingListGetListCreatorByListIDIdGet(
      shoppingListID
    );
    console.log("res.data.creatorID", res.data.creatorID);
    setListCreatorId(res.data.creatorID);
    // console.log(res.data);
  };

  const LoadDUser = async () => {
    let u = await _getData("User");
    if (u != null) {
      setCurrentUser(u);
    }
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

  const renderListItem = (itemData) => (
    <ParticipantsCard data={itemData.item} listCreatorId={listCreatorId} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 10,
  },
});
export default ParticipantsScreen;
