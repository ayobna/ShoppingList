import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import AccountEditScreen from "../screens/AccountEditScreen";
import Icon from "react-native-vector-icons/Ionicons";
import ListScreen from "../screens/ListScreen";
import ParticipantsScreen from "../screens/ParticipantsScreen";

const Stack = createStackNavigator();

function ParticipantsScreenStack(props) {
    
    const { navigation, route } = props;
    const data = route.params;
  
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="participantsScreenStack"
                component={ParticipantsScreen}
                initialParams={data}
                options={{ title: "משתתפים" }}
            />
        </Stack.Navigator>
    );
}

export default ParticipantsScreenStack;