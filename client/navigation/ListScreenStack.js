import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListScreen from "../screens/ListScreen";
import Style from "../utils/Style";

const Stack = createStackNavigator();

function ListScreenStack(props) {

    const { route } = props;
    const data = route.params;

    return (
        <Stack.Navigator screenOptions={Style.screenHeader}>
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
