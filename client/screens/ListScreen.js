import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import ShoppingListCard from '../components/ShoppingListCard';

const ListScreen = (props) => {
  const { navigation, route } = props;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {

    });
    return unsubscribe;
  }, [route]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", async () => {
    });
    return unsubscribe;
  }, [route]);

  return (
    <View><Text>List Screen {route.params.shoppingListID}</Text></View>
  );
}

export default ListScreen;