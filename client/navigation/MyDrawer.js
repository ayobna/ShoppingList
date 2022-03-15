import * as React from "react";
import { View, Text } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import ShoppingListMainStack from "./ShoppingListMainStack";
import AccountScreen from "../screens/AccountScreen";
import LoginScreen from "../screens/LoginScreen";
import RequestsStack from "./RequestsStack";

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="התחברות"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="דף בית"
        component={ShoppingListMainStack}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="בקשות"
        component={RequestsStack}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="חשבון"
        component={AccountScreen}

      />
    </Drawer.Navigator>
  );
}

export default MyDrawer;
