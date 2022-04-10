import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import MyShoppingListsStack from "./MyShoppingListsStack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Style from "../utils/Style";

const Tab = createMaterialBottomTabNavigator();

const HomeTabs = () => {


  const myListScreen = 1;
  const shareListScreen = 2;


  return (
    <Tab.Navigator barStyle={Style.barStyle}>
      <Tab.Screen
        name="Home"
        component={MyShoppingListsStack}
        initialParams={{ extraData: myListScreen }}
        options={{
          tabBarLabel: "הרשימות שלי",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="clipboard-list-outline" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Home2"
        initialParams={{ extraData: shareListScreen }}
        component={MyShoppingListsStack}
        options={{
          tabBarLabel: "רשימות משותפות",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="share-variant" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default HomeTabs;
