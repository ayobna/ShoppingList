import * as React from "react";
import { View, Text } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Feed from "../screens/Feed";
import ShoppingListMainStack from "./ShoppingListMainStack";

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="ShoppingListMainStack"
        component={ShoppingListMainStack}
        options={{ headerShown: false }}
      />
      <Drawer.Screen name="Feed" component={Feed} />
    </Drawer.Navigator>
  );
}

export default MyDrawer;
