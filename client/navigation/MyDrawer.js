import * as React from "react";
import { View, Text } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import ShoppingListMainStack from "./ShoppingListMainStack";
import AccountScreen from "../screens/AccountScreen";
import LoginScreen from "../screens/LoginScreen";
import RequestsStack from "./RequestsStack";
import MyDrawerContent from "./MyDrawerContent";
import LoginStack from "./LoginStack";

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator drawerContent={props => <MyDrawerContent {...props} />}>
      <Drawer.Screen
        name="login"
        component={LoginStack}
        options={{ headerShown: false , title:"התחברות"}}
      />
      <Drawer.Screen
        name="homeStack"
        component={ShoppingListMainStack}
        options={{ headerShown: false , title:"דף בית"}}
      />
      <Drawer.Screen
        name="requestsStack"
        component={RequestsStack}
        options={{ headerShown: false, title:"בקשות" }}
      />
      <Drawer.Screen
        name="profileStack"
        component={AccountScreen}
        options={{ title:"חשבון"}}


      />
           
    </Drawer.Navigator>
  );
}

export default MyDrawer;
