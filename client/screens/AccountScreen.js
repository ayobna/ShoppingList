import react, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import { Avatar, Button, Caption, Divider, Headline, IconButton, List } from "react-native-paper";
import { API, userApi } from "../api/api";
import PopupDialog from "../components/PopupDialog";
import Spinner from "../components/Spinner";
import withCommonScreen from "../hoc/withCommonScreen";

import { _getData, _logout } from "../utils/Functions";

const AccountScreen = (props) => {
  const { navigation, route } = props;

  const [currentUser, setCurrentUser] = useState();
  const [isDeleteAccountDialogVisible, setIsDeleteAccountDialogVisible] = useState(false);
  const [userSatistics, setUserSatistics] = useState({ myListsAmount: 0, otherListsAmount: 0 });
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      const user = await loadUser();
      console.log("user: ", user)
      const satistics = await getUserSatistics(user.userID);
      console.log("satistics: ", satistics)
      setCurrentUser(user);
      setUserSatistics(satistics);
      setIsPageLoaded(true);
    });
    return unsubscribe;
  }, [navigation, route]);

  const getUserSatistics = async (userID) => {
    try {
      let res = await userApi.apiGetProfileSatisticsGet(userID);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", async () => {
      setIsDeleteAccountDialogVisible(false);
    });
    return unsubscribe;
  }, [navigation, route]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", async () => {
      setIsPageLoaded(false)
    });
    return unsubscribe;
  }, [navigation, route]);

  const loadUser = async () => {
    let u = await _getData("User");
    return u;
  };

  const handleDeleteUser = async () => {
    const res = await deleteUser();
    if (res === 1) {
      _logout(navigation);
    }
  };


  const deleteUser = async () => {
    try {
      let res = await userApi.apiUsersDeleteUserDelete(currentUser.userID);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const cancelDialog = () => {
    setIsDeleteAccountDialogVisible(false);
  };

  return (
    isPageLoaded ?
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
          {currentUser &&
            <View style={styles.mainWrapper}>
              <View>
                <View style={styles.Image}>
                  <Avatar.Image
                    size={140}
                    source={{
                      uri: `${API}/uploads/users/${currentUser.img}`,
                    }}
                  />
                </View>
                <View style={styles.headlineWrapper}>
                  <Headline style={styles.headline}>{currentUser.firstName + " " + currentUser.lastName}</Headline>
                </View>
              </View>
              <View style={styles.satisticsWrapper}>
                <View style={styles.satisticsTitleWrapper}>
                  <View style={styles.satisticsContent}>
                    <Caption>רשימות שלי</Caption>
                  </View>
                  <View style={styles.satisticsContent}>
                    <Caption>רשימות משותפות</Caption>
                  </View>
                </View>
                <Divider />
                <View style={styles.satisicsAmountWrapper}>
                  <View style={styles.satisticsContent}>
                    <Caption>{userSatistics.myListsAmount}</Caption>
                  </View>
                  <View style={styles.satisticsContent}>
                    <Caption>{userSatistics.otherListsAmount}</Caption>
                  </View>
                </View>
              </View>

              <View>
                <View style={styles.detailsWrapper}>
                  <View style={styles.editDetailsWrapper}>
                    <Caption>פרטים אישיים</Caption>
                    <IconButton
                      icon="account-edit-outline"
                      color="black"
                      size={25}
                      onPress={() => navigation.navigate("AccountEditScreen")}
                    />
                  </View>
                  <Divider />
                  <List.Item title={currentUser.email} left={props => <List.Icon {...props} icon="email-outline" />} />
                  <Divider inset />
                  <List.Item title={currentUser.phoneNumber} left={props => <List.Icon {...props} icon="cellphone" />} />
                  <Divider />
                </View>

                <View style={styles.editPasswordWrapper}>
                  <Divider />
                  <List.Item title="לעריכת סיסמה לחץ כאן" style={{ backgroundColor: "#f1f1f1" }} left={props => <List.Icon {...props} icon="pencil-lock-outline" />} onPress={() => console.log("edit password")} />
                  <Divider />
                </View>
              </View>

              <View style={styles.deleteAccountContainer}>

                <View style={styles.deleteAccountWrapper}>
                  <Button icon="delete" color="#990f02" mode="contained" onPress={() => setIsDeleteAccountDialogVisible(true)}>
                    מחק חשבון
                  </Button>
                </View>
              </View>
            </View>
          }
        </ScrollView>
        {
          <PopupDialog
            title={"מחיקת חשבון"}
            visible={isDeleteAccountDialogVisible}
            cancel={cancelDialog}
            confirm={handleDeleteUser}
          >
            <Text>האם את/ה בטוח/ה שברצונך למחווק את החשבון?</Text>
          </PopupDialog>
        }
      </View>
      :
      <Spinner />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //  justifyContent: "center",
    backgroundColor: "white",
  },
  mainWrapper: {
    flex: 1,
    justifyContent: "space-around"
  },
  Image: {
    marginVertical: "9%",
    alignItems: "center",
  },
  headlineWrapper: {
    alignItems: "center"
  },
  headline: {
    fontSize: 30,
    marginBottom: 15
  },
  detailsWrapper: {
    marginTop: 10
  },
  satisticsWrapper: {
  },
  editDetailsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10
  },
  editPasswordWrapper: {
    marginTop: 10
  },
  deleteAccountContainer: {
    alignItems: "center",
    marginVertical: 25
  },
  deleteAccountWrapper: {
    width: "80%",
    marginVertical: 10
  },
  satisticsTitleWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  satisticsContent: {
    width: "50%",
    alignItems: "center"
  },
  satisicsAmountWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    marginTop: 5
  },
  scrollViewContentContainer: {
    flexGrow: 1
  }

});

export default withCommonScreen(AccountScreen, 'AccountScreen');

