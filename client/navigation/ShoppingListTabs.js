import * as React from "react";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import ListScreen from "../screens/ListScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ChatScreen from "../screens/ChatScreen";
import ParticipantsScreen from "../screens/ParticipantsScreen";

const Tab = createMaterialBottomTabNavigator();

function ShoppingListTabs(props) {
  const { navigation, route } = props;
  const data = route.params;

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="ListScreen"
        component={ListScreen}
        initialParams={data}
        options={{
          tabBarLabel: "הרשימה",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={24} />
          ),
        }}
      />

      <Tab.Screen name="ParticipantsScreen" component={ParticipantsScreen} initialParams={data}
        options={{
          tabBarLabel: "משתתפים",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={24} />
          ),
        }} />
      <Tab.Screen name="Chat" component={ChatScreen}

        initialParams={data}
        listeners={{
          tabPress: e => {
            e.preventDefault();
            navigation.navigate("ChatListScreen", data);
          }
        }}

        options={{
          tabBarLabel: "צ'אט",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={24} />
          ),
        }} />
    </Tab.Navigator>

  );
}

export default ShoppingListTabs;
