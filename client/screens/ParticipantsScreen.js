import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableHighlight, StyleSheet} from 'react-native';
import { listUsersApi } from '../api/api';
import PraticipantsCard from '../components/PraticipantsCard'
import {TextInput, IconButton, Button, Avatar} from "react-native-paper";
import { _getData } from "../utils/Functions";



const ParticipantsScreen = (props) => {
  const { navigation, route } = props;
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus",  () => {
      GetParticipantsInTheShoppingList();
    });
    return unsubscribe;
  }, [route]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", async () => {
    });
    return unsubscribe;
  }, [route]);

  const GetParticipantsInTheShoppingList=async()=>{
  let res= await listUsersApi.apiGetParticipantsInTheShoppingListByListIdIdGet(route.params.shoppingListID)
  let data = res.data;
  setParticipants(data)
}

  
const LoadUser = async () => {
  let u = await _getData("User");
  if (u != null) {
    setUser(u);
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
  <PraticipantsCard
    data={itemData.item}

  />
);



return (
  <View>
    <FlatList
      showsVerticalScrollIndicator={false}
      data={participants}
      renderItem={(item) => renderListItem(item)}
      keyExtractor={(item,index) => index}
      contentContainerStyle={{ flexGrow: 1 }}
      ListEmptyComponent={handleListEmptyComponent}

    />
    <View
        style={{
          paddingVertical: 5,
          paddingHorizontal: 5,
          borderTopWidth: 2,
          borderColor: "black",
          backgroundColor: "#b1b1b1",
        }}
     ></View>
  </View>
)
      }
export default ParticipantsScreen;