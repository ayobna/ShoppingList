import * as React from "react";
import { View, Text } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import ShoppingListMainStack from "./ShoppingListMainStack";
import AccountScreen from "../screens/AccountScreen";
import RequestsStack from "./RequestsStack";
import MyDrawerContent from "./MyDrawerContent";
import AccountStack from "./AccountStack";

const Drawer = createDrawerNavigator();

function MyDrawer(props) {
  return (
    <Drawer.Navigator drawerContent={props => <MyDrawerContent {...props} />}>
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
        name="AccountStack"
        component={AccountStack}
        options={{ title:"חשבון"}}


      />      
    </Drawer.Navigator>
  );
}

export default MyDrawer;
