import react, { useEffect, useState } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import MyShoppingListsStack from "./MyShoppingListsStack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { shoppingListApi } from "../api/api";
import Colors from "../utils/Colors";
import Style from "../utils/Style";
const Tab = createMaterialBottomTabNavigator();

const HomeTabs = () => {


  const [shoppingList, setShoppingList] = useState([]);
  useEffect(() => {


  }, [])

  return (
    <Tab.Navigator barStyle={Style.barStyle}>
      <Tab.Screen
        name="Home"
        component={MyShoppingListsStack}
        initialParams={{ extraData: 1 }}
        options={{
          tabBarLabel: "הרשימות שלי",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="clipboard-list-outline" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Home2"
        initialParams={{ extraData: 2 }}
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
