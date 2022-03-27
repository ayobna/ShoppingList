import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import AccountEditScreen from "../screens/AccountEditScreen";


const Stack = createStackNavigator();

function AccountStack(props) {
    const { navigation, route } = props;
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="AccountScreen"
                component={AccountScreen}
                options={{ headerShown: false, title: "חשבון" }}
            />
            <Stack.Screen
                name="AccountEditScreen"
                component={AccountEditScreen}
                options={{ headerShown: false , title: "עריכת חשבון" }}
            />
        </Stack.Navigator>
    );
}

export default AccountStack;
