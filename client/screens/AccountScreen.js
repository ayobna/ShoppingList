import react, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Avatar, Button } from "react-native-paper";
import { API } from "../api/api";

import { _getData } from "../utils/Functions";

const AccountScreen = (props) => {
  const { navigation, route } = props;

  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      const user = await LoadUser();
      setCurrentUser(user);
    });
    return unsubscribe;
  }, [navigation, route]);

  const LoadUser = async () => {
    let u = await _getData("User");
    return u;
  };

  return (
    <View style={styles.container}>
      {currentUser && (
        <View>
          <View style={styles.Image}>
            <Avatar.Image
              size={150}
              source={{
                uri: `${API}/uploads/users/${currentUser.img}`,
              }}
            />
          </View>
          <View style={styles.ViewText}>
            <Text style={styles.Text}>
              שם:{currentUser.firstName + " " + currentUser.lastName}
            </Text>
            <Text style={styles.Text}>מייל: {currentUser.email}</Text>
            <Text style={styles.Text}>
              מספר טלפון: {currentUser.phoneNumber}
            </Text>
          </View>
          <View style={styles.ViewButton}>
            <Button
              mode="outlined"
              theme={{ colors: { primary: `white` } }}
              labelStyle={{ color: "black" }}
              contentStyle={{ backgroundColor: "#bfbfbf" }}
              onPress={() => navigation.navigate("AccountEditScreen")}
            >
              עריכת חשבון
            </Button>
            
          </View>
        </View>
      )}
    </View>
  );
};

export default AccountScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //  justifyContent: "center",
    backgroundColor: "white",
  },
  Image: {
    marginTop: "10%",
    alignItems: "center",
  },
  ViewText: {
    alignItems: "center",
  },
  Text: {
    marginTop: "8%",
    fontSize: 24,
  },
  ViewButton: {
    marginTop: "8%",
    width: "50%",
    marginLeft: "25%",

    //alignItems:'center',
    justifyContent: "center",
  },
});
