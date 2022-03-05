import react,{useEffect, useState} from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import MyShoppingListsStack from "./MyShoppingListsStack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { shoppingListApi } from "../api/api";
const Tab = createMaterialBottomTabNavigator();

const  HomeTabs=() =>{

  
  const [shoppingList, setShoppingList] = useState([]);
  useEffect(() => {
  
    
  }, [])
  
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={MyShoppingListsStack}
        options={{
          tabBarLabel: "הרשימות שלי",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Home2"
        component={MyShoppingListsStack}
        options={{
          tabBarLabel:"המשתפות",
        
        }}
      />
    </Tab.Navigator>
  );
}

export default HomeTabs;
