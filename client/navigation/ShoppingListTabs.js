import * as React from "react";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import ListScreen from "../screens/ListScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ChatScreen from "../screens/ChatScreen";
import ParticipantsScreen from "../screens/ParticipantsScreen";

const Tab = createMaterialBottomTabNavigator();

function ShoppingListTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="ListScreen"
        component={ListScreen}
        options={{
          tabBarLabel: "הרשימה שלי",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="ParticipantsScreen" component={ParticipantsScreen} />
    </Tab.Navigator>
  );
}

export default ShoppingListTabs;
