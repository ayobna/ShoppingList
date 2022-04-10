import * as React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ChatScreen from "../screens/ChatScreen";
import ListScreenStack from "./ListScreenStack";
import ParticipantsScreenStack from "./ParticipantsScreenStack";
import Style from "../utils/Style";

const Tab = createMaterialBottomTabNavigator();

function ShoppingListTabs(props) {
  const { navigation, route } = props;
  const data = route.params;

  return (
    <Tab.Navigator barStyle={Style.barStyle}>
      <Tab.Screen
        name="ListScreen"
        component={ListScreenStack}
        initialParams={data}
        options={{
          tabBarLabel: "רשימת מוצרים",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="clipboard-list-outline" color={color} size={24} />
          ),
        }}
      />

      <Tab.Screen name="ParticipantsScreen" component={ParticipantsScreenStack} initialParams={data}
        options={{
          tabBarLabel: "משתתפים",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-multiple-outline" color={color} size={24} />
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
            <MaterialCommunityIcons name="chat-outline" color={color} size={24} />
          ),
        }} />
    </Tab.Navigator>

  );
}

export default ShoppingListTabs;
