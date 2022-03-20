import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableHighlight, StyleSheet} from 'react-native';
import { listUsersApi } from '../api/api';
import ParticipantsCard from '../components/ParticipantsCard';
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
<ParticipantsCard
data={itemData.item}
/>
);



return (
  <View style={styles.container }>   
    <FlatList
      showsVerticalScrollIndicator={false}
      data={participants}
      renderItem={(item) => renderListItem(item)}
      keyExtractor={(item) =>  String(item.userID)}
      contentContainerStyle={{ flexGrow: 1 }}
      ListEmptyComponent={handleListEmptyComponent}

    />

  </View>
)
      }


      const styles = StyleSheet.create({
        container: {
          flex: 1,
          marginHorizontal: 10,
          marginTop: 10,
        },

      });
export default ParticipantsScreen;