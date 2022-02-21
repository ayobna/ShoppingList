import * as React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";

import HomeScreen from "../screens/HomeScreen";

const Stack = createStackNavigator();

function MyShoppingListsStack(props) {
  const { navigation } = props;
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: "My List",
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
