import * as React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import MyTabs from './MyTabs';

const Stack = createStackNavigator();

function ShoppingListMainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyTabs" component={MyTabs}options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

export default  ShoppingListMainStack;