import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { FAB, TextInput, Searchbar, Snackbar } from "react-native-paper";
import { shoppingListApi } from "../api/api";
import ShoppingListCard from "../components/ShoppingListCard";
import PopupDialog from "../components/PopupDialog";
import { _getData } from "../utils/Functions";
import withCommonScreen from "../hoc/withCommonScreen";
import Spinner from "../components/Spinner";

const HomeScreen = (props) => {
  // props
  const { navigation, route, isPageLoaded, setIsPageLoadedTrue, setIsFetchingCondition, isFetching, snackBarDetails,
    setSnackBar } = props;

  // states
  const [shoppingLists, setShoppingLists] = useState([]);
  const [renderedShoppingLists, setRenderedShoppingLists] = useState([]);
  const [chosenListDetails, setChosenListDetails] = useState();
  const [popupDialogVisible, setPopupDialogVisible] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [chosenMethod, setChosenMethod] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const extraDataForTabs = route.params.extraData;

  //veribales
  const myListsScreen = 1;


  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      const user = await loadUser();
      await shoppingListsGetFromAPI(user.userID);
      setCurrentUser(user);
      setIsPageLoadedTrue();
      setIsFetchingCondition(false);
    });
    return unsubscribe;
  }, [navigation, route]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", async () => {
      setSearchQuery("");
      handleCancelPopupDialog();
    });
    return unsubscribe;
  }, [route]);

  useEffect(() => {
    if (chosenListDetails) {
      setPopupDialogVisible(true);
    }
  }, [chosenListDetails]);

  useEffect(() => {
    let newData = shoppingLists.filter((item) => {
      const itemData = `${item.title.toUpperCase()}`;
      return itemData.indexOf(searchQuery.toUpperCase()) > -1;
    });
    setRenderedShoppingLists(newData);
  }, [searchQuery]);

  useEffect(() => {

    if (extraDataForTabs === myListsScreen && route.params?.snackBar) {
      setSnackBar(route.params.snackBar);
    }
  }, [route.params?.snackBar]);

  const CreateList = async () => {
    navigation.navigate("CreateList");
  };

  const loadUser = async () => {
    let u = await _getData("User");
    console.log("LoadUser", u)
    return u;
  };

  const shoppingListsGetFromAPI = async (userID) => {
    let res = null;
    try {
      if (extraDataForTabs == myListsScreen)
        res = await shoppingListApi.apiShoppingListCreatedByUserIdGet(
          userID
        );
      else
        res = await shoppingListApi.apiShoppingListUserIsAParticipantIdGet(
          userID
        );
      let data = res.data
      setShoppingLists(data);
      setRenderedShoppingLists(data);
    } catch (error) {
      console.warn(error);
    }
  };

  const renderListItem = (itemData) => (
    <ShoppingListCard
      data={itemData.item}
      navigation={navigation}
      extraDataForTabs={extraDataForTabs}
      handleChoice={handleChoice}
    />
  );

  const handleChoice = (productDetails, choice) => {
    setChosenMethod(choice);
    setChosenListDetails(productDetails);
  };

  const handleCancelPopupDialog = () => {
    setPopupDialogVisible(false);
    setChosenMethod();
    setChosenListDetails();
    setTitleError(false);
  };

  const handleConfirmEdit = () => {
    const validationAmount = 1;

    if (regexValidationShoppingList() < validationAmount) {
      return;
    }
    updateShoppingList();
  };

  const updateShoppingList = async () => {
    try {
      await shoppingListApi.apiShoppingListUpdateShoppinglistPost(
        chosenListDetails
      );
      handleCancelPopupDialog();
      shoppingListsGetFromAPI(currentUser.userID);
    } catch (error) {
      console.warn(error);
    }
  };

  const regexValidationShoppingList = () => {
    let counter = 0;
    const titleRgx =
      /^[\u05D0-\u05EAa-zA-Z0-9']+([ |\-|.|/]*[\u05D0-\u05EAa-zA-Z0-9'\s]+)*$/;

    if (!titleRgx.test(chosenListDetails.title)) {
      setTitleError(true);
    } else {
      setTitleError(false);
      counter++;
    }
    return counter;
  };

  const handleConfirmCopyList = () => {
    if (regexValidationShoppingList() < 1) {
      return;
    }
    copyShoppingList();
  };

  const copyShoppingList = async () => {
    const data = {
      ListID: chosenListDetails.listID,
      CreatorID: currentUser.userID,
      Title: chosenListDetails.title.trim(),
    };
    try {
      console.log(data)
      let res = await shoppingListApi.apiShoppingListCopyShoppingListPost(data);
      console.log(res.data)
      handleCancelPopupDialog();
      shoppingListsGetFromAPI(currentUser.userID);
    } catch (error) {
      console.warn(error);
    }
  };

  const deleteShoppingList = async () => {
    try {
      await shoppingListApi.apiShoppingListDeleteShoppinglistPost(
        chosenListDetails.listID
      );
      handleCancelPopupDialog();
      shoppingListsGetFromAPI(currentUser.userID);
    } catch (error) {
      console.warn(error);
    }
  };
  const exitShoppingList = async () => {
    try {
      await shoppingListApi.apiShoppingListExitShoppingListPost(
        chosenListDetails.listID,
        currentUser.userID
      );
      handleCancelPopupDialog();
      shoppingListsGetFromAPI(currentUser.userID);
    } catch (error) {
      console.warn(error);
    }
  };

  const handelChosenMethod = () => {
    console.log(chosenMethod);
    if (chosenMethod === "edit") {
      handleConfirmEdit();
    } else if (chosenMethod === "copy") {
      handleConfirmCopyList();
    } else if (chosenMethod === "delete") {
      deleteShoppingList();
    } else {
      exitShoppingList();
    }
  };

  const handleListEmptyComponent = () => {
    return (
      <View
        style={styles.noData}
      >
        <Text>אין רשימות</Text>
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View
        style={
          extraDataForTabs === 1 ? styles.renderFooter1 : styles.renderFooter2
        }
      />
    );
  };

  const handleRefresh = async () => {
    setIsFetchingCondition(true);
    await shoppingListsGetFromAPI(currentUser.userID);
    setSearchQuery("");
    setIsFetchingCondition(false);
  };

  return (
    isPageLoaded ?
      <View style={styles.container}>
        <Searchbar
          placeholder="חיפוש"
          onChangeText={(txt) => setSearchQuery(txt)}
          value={searchQuery}
          theme={{ colors: { primary: "#919191" }, roundness: 0 }}
          iconColor="black"
        />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={renderedShoppingLists}
          renderItem={(item) => renderListItem(item)}
          keyExtractor={(item) => String(item.listID)}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={handleListEmptyComponent}
          ListFooterComponent={renderFooter}
          refreshing={isFetching}
          onRefresh={() => handleRefresh()}
        />
        {extraDataForTabs === 1 && (
          <FAB
            style={styles.fab}
            color="white"
            icon="plus"
            onPress={CreateList}
          />
        )}
        {chosenListDetails && chosenMethod && (
          <PopupDialog
            title={chosenMethod === "edit" ? "עריכת רשימה" : chosenMethod === "copy" ? "העתקת רשימה" : chosenMethod === "delete" ? "מחיקת רשימה" : "יציאה מרשימה"}
            visible={popupDialogVisible}
            cancel={handleCancelPopupDialog}
            confirm={handelChosenMethod}
          >
            {chosenMethod === "delete" ? (
              <Text>ברצונך למחוק את הרשימה?</Text>
            ) : chosenMethod === "exit" ? (
              <Text>ברצונך לצת מהרשימה?</Text>
            ) : (
              <TextInput
                label="שם מוצר"
                value={chosenListDetails.title}
                selectionColor="#919191"
                activeOutlineColor="#919191"
                style={{ backgroundColor: "white" }}
                onChangeText={(txt) =>
                  setChosenListDetails((oldstate) => ({
                    ...oldstate,
                    title: txt,
                  }))
                }
                dense={true}
                error={titleError}
                mode="outlined"
              />
            )}
          </PopupDialog>
        )}

        {
          snackBarDetails.visible &&
          <Snackbar
            visible={snackBarDetails.visible}
            onDismiss={() => setSnackBar()}
            duration={snackBarDetails.duration}
            style={{ backgroundColor: snackBarDetails.color }}
          >
            {snackBarDetails.message}
          </Snackbar>
        }
      </View>
      :
      <Spinner />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    backgroundColor: "black",
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  renderFooter1: {
    paddingBottom: 90,
  },
  renderFooter2: {
    paddingBottom: 10,
  },
  noData: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default withCommonScreen(HomeScreen, "HomeScreen");

