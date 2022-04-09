import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";

import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import MyDrawer from "./MyDrawer";
import Colors from "../utils/Colors";
import Style from "../utils/Style";

const Stack = createStackNavigator();

function LoginStack(props) {
    const { navigation, route } = props;
    return (
        <Stack.Navigator screenOptions={Style.screenHeader}>
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ headerShown: false, title: "התחברות" }}
            />
            <Stack.Screen
                name="RegisterScreen"
                component={RegisterScreen}
                options={{ title: "הרשמה" }}
            />
            <Stack.Screen
                name="myDrawer"
                component={MyDrawer}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export default LoginStack;
