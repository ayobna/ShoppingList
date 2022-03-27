import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import AccountEditScreen from "../screens/AccountEditScreen";
import Icon from "react-native-vector-icons/Ionicons";

const Stack = createStackNavigator();

function AccountStack(props) {
    const { navigation, route } = props;
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="AccountScreen"
                component={AccountScreen}
    
                options={{
                    title: "חשבון",
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
            <Stack.Screen
                name="AccountEditScreen"
                component={AccountEditScreen}
                options={{ title: "עריכת חשבון" }}
            />
        </Stack.Navigator>
    );
}

export default AccountStack;
