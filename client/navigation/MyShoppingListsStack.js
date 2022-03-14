import * as React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";

import HomeScreen from "../screens/HomeScreen";

const Stack = createStackNavigator();

function MyShoppingListsStack(props) {
  // console.log("MyShoppingListsStack props  ",props)
  const { navigation, route } = props;
  const data = route.params;
  

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        initialParams={data}
        options={{
          title: `${data.extraData === 1 ? "הרשימות שלי" : "רשימות משותפות"}`,
          headerLeft: () => (
            <Icon.Button
              name="ios-menu"
              backgroundColor="white"
              color="black"
              activeOpacity={0.5}
              underlayColor="#f1f1f1"
              size={25}
              onPress={() => navigation.openDrawer()}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

export default MyShoppingListsStack;
