import * as React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";

import RequestsScreen from "../screens/RequestsScreen";

const Stack = createStackNavigator();

function RequestsStack(props) {
    const { navigation, route } = props;


    return (
        <Stack.Navigator>
            <Stack.Screen
                name="RequestsScreen"
                component={RequestsScreen}
                options={{
                    title: "בקשות",
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

export default RequestsStack;
