import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { requestApi } from "../api/api";
import RequestsCard from '../components/RequestsCard';
import { _getData } from '../utils/Functions';



const RequestsScreen = (props) => {
  const { navigation, route } = props;

  const [currentUser, setCurrentUser] = useState();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      const user = await _getData("User");
      if (user !== null) {
        setCurrentUser(user);
        getRequests(user.UserID);
      }
    });
    return unsubscribe;
  }, [navigation, route]);

  const getRequests = async (userID) => {
    let res = await requestApi.apiRequestsApiRequestsGetRequestsByUserIdIdGet(userID);
    let data = res.data
    setRequests(data);
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

  const handleConfirmRequest = () => {
    console.log("Confirm request")
  };

  const handleDeclineRequest = () => {
    console.log("Decline request")
  };


  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={requests}
        renderItem={(item) => renderListItem(item)}
        keyExtractor={(item) => String(item.listID)}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={handleListEmptyComponent}
        ItemSeparatorComponent={handleSeparatorComponent}
      // ListFooterComponent={renderFooter}
      // refreshing={isFetching}
      // onRefresh={() => handleRefresh()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default RequestsScreen;