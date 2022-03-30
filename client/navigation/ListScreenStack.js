import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import AccountEditScreen from "../screens/AccountEditScreen";
import Icon from "react-native-vector-icons/Ionicons";
import ListScreen from "../screens/ListScreen";

const Stack = createStackNavigator();

function ListScreenStack(props) {
    
    const { navigation, route } = props;
    const data = route.params;
  
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="listScreenStack"
                component={ListScreen}
                initialParams={data}
                options={{ title: "רשימת מוצרים" }}
            />
        </Stack.Navigator>
    );
}

export default ListScreenStack;
