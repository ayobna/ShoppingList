import * as React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import HomeTabs from './HomeTabs';
import CreateListScreen from '../screens/CreateListScreen';
import ShoppingListTabs from './ShoppingListTabs';
import ChatScreen from '../screens/ChatScreen';

const Stack = createStackNavigator();

function ShoppingListMainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
      <Stack.Screen name="CreateList" component={CreateListScreen} options={{ title: "יצירת רשימה" }} />
      <Stack.Screen name="ShoppingListTabs" component={ShoppingListTabs} options={{ title: "" }} />
      <Stack.Screen name="ChatListScreen" component={ChatScreen} options={{ title: "צ'אט" }} />
    </Stack.Navigator>

    //CreateList
  );
}

export default ShoppingListMainStack;