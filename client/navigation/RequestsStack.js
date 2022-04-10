import * as React from "react";
import { View, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";
import RequestsScreen from "../screens/RequestsScreen";
import Style from "../utils/Style";
import Colors from "../utils/Colors";

const Stack = createStackNavigator();

function RequestsStack(props) {
    const { navigation } = props;


    return (
        <Stack.Navigator screenOptions={Style.screenHeader}>
            <Stack.Screen
                name="RequestsScreen"
                component={RequestsScreen}
                options={{
                    title: "בקשות",
                    headerLeft: () => (
                        <View style={styles.menuWrapper}>
                        <Icon.Button
                          name="ios-menu"
                          backgroundColor={Colors.our_dark_blue}
                          color="white"
                          activeOpacity={0.95}
                          underlayColor="#f1f1f1"
                          size={25}
                          onPress={() => navigation.openDrawer()}
                        />
                      </View>
                    ),
                }}
            />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    menuWrapper: {
        marginLeft: 10
    }
});

export default RequestsStack;
