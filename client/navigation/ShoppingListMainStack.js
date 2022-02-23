import * as React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import HomeTabs from './HomeTabs';
import CreateListScreen from '../screens/CreateListScreen';
import ShoppingListTabs from './ShoppingListTabs';

const Stack = createStackNavigator();

function ShoppingListMainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeTabs" component={HomeTabs}options={{ headerShown: false }}/>
      <Stack.Screen name="CreateList" component={CreateListScreen}/>
      <Stack.Screen name="ShoppingListTabs" component={ShoppingListTabs}/>
    </Stack.Navigator>

    //CreateList
  );
}

export default  ShoppingListMainStack;