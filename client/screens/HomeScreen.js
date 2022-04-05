import react, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { FAB, TextInput, Searchbar } from "react-native-paper";
import { shoppingListApi, userApi } from "../api/api";
import ShoppingListCard from "../components/ShoppingListCard";
import PopupDialog from "../components/PopupDialog";
import { _getData } from "../utils/Functions";
import withCommonScreen from "../hoc/withCommonScreen";

const HomeScreen = (props) => {
  // props
  const { navigation, route } = props;

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

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      const user = await LoadUser();
      const lists = await ShoppingListsGetFromAPI(user.userID);
      setCurrentUser(user);

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

  const CreateList = async () => {
    navigation.navigate("CreateList");
  };

  const LoadUser = async () => {
    let u = await _getData("User");
    console.log("LoadUser", u)
    //  setCurrentUser(u);
    return u;
  };

  const ShoppingListsGetFromAPI = async (userID) => {
    let res = null;
    try {
      if (extraDataForTabs == 1)
        res = await shoppingListApi.apiShoppingListCreatedByUserIdGet(
          userID
        );
      else
        res = await shoppingListApi.apiShoppingListUserIsAParticipantIdGet(
          userID
        );
      //console.log("ShoppingListsGetFromAPI",res.data)
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
      // handleDeleteProduct={handleDeleteProduct}
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
    if (regexValidationShoppingList() < 1) {
      return;
    }
    updateShoppingList();
  };

  const updateShoppingList = async () => {
    try {
      const res = await shoppingListApi.apiShoppingListUpdateShoppinglistPost(
        chosenListDetails
      );
      handleCancelPopupDialog();
      ShoppingListsGetFromAPI(currentUser.userID);
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
      ShoppingListsGetFromAPI(currentUser.userID);
    } catch (error) {
      console.warn(error);
    }
  };

  const deleteShoppingList = async () => {
    try {
      let res = await shoppingListApi.apiShoppingListDeleteShoppinglistPost(
        chosenListDetails.listID
      );
      handleCancelPopupDialog();
      ShoppingListsGetFromAPI(currentUser.userID);
    } catch (error) {
      console.warn(error);
    }
  };
  const exitShoppingList = async () => {
    try {
      let res = await shoppingListApi.apiShoppingListExitShoppingListPost(
        chosenListDetails.listID,
        currentUser.userID
      );
      handleCancelPopupDialog();
      ShoppingListsGetFromAPI(currentUser.userID);
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
        style={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>אין מוצרים</Text>
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

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="חיפוש"
        onChangeText={(txt) => setSearchQuery(txt)}
        value={searchQuery}
        theme={{ colors: { primary: "black" }, roundness: 0 }}
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
      // refreshing={isFetching}
      // onRefresh={() => handleRefresh()}
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
          title={"עריכת רשימה"}
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
    </View>
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
});

export default withCommonScreen(HomeScreen, "HomeScreen");

