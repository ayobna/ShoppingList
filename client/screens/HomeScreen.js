import react, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { FAB, TextInput } from 'react-native-paper';
import { clockRunning } from "react-native-reanimated";
import { shoppingListApi, userApi } from "../api/api";
import ShoppingListCard from "../components/ShoppingListCard";
import { useFocusEffect } from '@react-navigation/native';
import PopupDialog from "../components/PopupDialog";
import { User } from "../User";

const HomeScreen = (props) => {
  // props
  const { navigation, shoppingListData } = props;

  // states
  const [shoppingList, setShoppingList] = useState(shoppingListData);
  const [chosenListDetails, setChosenListDetails] = useState();
  const [popupDialogVisible, setPopupDialogVisible] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [chosenMethod, setChosenMethod] = useState();
  const [currentUser, setCureentUser] = useState(User);


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      ShoppingListCreatedByUserIdGet();
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (chosenListDetails) {
      setPopupDialogVisible(true);
    }
  }, [chosenListDetails]);

  const CreateList = async () => {
    navigation.navigate("CreateList");
  };

  // useEffect(() => {
  //   ShoppingListCreatedByUserIdGet()
  // }, [])

  const ShoppingListCreatedByUserIdGet = async () => {
    try {
      let res = await shoppingListApi.apiShoppingListCreatedByUserIdGet(1)
      setShoppingList(res.data)
    } catch (error) {
      console.warn(error)
    }
  }

  const renderListItem = (itemData) => (
    <ShoppingListCard
      data={itemData.item}
      navigation={navigation}
      // handleDeleteProduct={handleDeleteProduct}
      handleChoise={handleChoise}
    />
  );

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
      <View style={styles.renderFooter} />
    );
  };

  const handleChoise = (productDetails, choise) => {
    setChosenMethod(choise);
    setChosenListDetails(productDetails);
  };

  const handleCancelPopupDialog = () => {
    setPopupDialogVisible(false);
    setChosenMethod();
    setChosenListDetails();
  };

  const handleConfirmEdit = () => {
    if (regexValidationShoppingList() < 1) {
      return;
    }
    updateShoppingList();
  };

  const updateShoppingList = async () => {

    try {
      const res = await shoppingListApi.apiShoppingListUpdateShoppinglistPost(chosenListDetails);
      handleCancelPopupDialog();
      ShoppingListCreatedByUserIdGet();
    } catch (error) {
      console.warn(error)
    }

  };

  const regexValidationShoppingList = () => {
    let counter = 0;
    const titleRgx =
      /^[\u05D0-\u05EAa-zA-Z0-9']+([ |\-|.|/][\u05D0-\u05EAa-zA-Z0-9'\s]+)*$/;
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
    const data = { ListID: chosenListDetails.listID, CreatorID: currentUser.UserID, Title: chosenListDetails.title };
    try {
      let res = await shoppingListApi.apiShoppingListCopyShoppingListPost(data);
      handleCancelPopupDialog();
      ShoppingListCreatedByUserIdGet();

    } catch (error) {
      console.warn(error)
    }
  };

  const deleteShoppingList = async () => {
    try {
      let res = await shoppingListApi.apiShoppingListDeleteShoppinglistPost(chosenListDetails.listID);
      handleCancelPopupDialog();
      ShoppingListCreatedByUserIdGet();

    } catch (error) {
      console.warn(error)
    }
  };


  return (
    <View style={styles.container}>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={shoppingList}
        renderItem={(item) => renderListItem(item)}
        keyExtractor={(item) => String(item.listID)}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={handleListEmptyComponent}
        ListFooterComponent={renderFooter}
      // refreshing={isFetching}
      // onRefresh={() => handleRefresh()}
      />

      <FAB
        style={styles.fab}
        color="white"
        icon="plus"
        onPress={CreateList}
      />

      {chosenListDetails && chosenMethod && (
        <PopupDialog
          title={"עריכת רשימה"}
          visible={popupDialogVisible}
          cancel={handleCancelPopupDialog}
          confirm={chosenMethod === "edit" ? handleConfirmEdit : chosenMethod === "copy" ? handleConfirmCopyList : deleteShoppingList}
        >
          {
            chosenMethod === "delete" ?
              <Text>ברצונך למחוק את הרשימה?</Text>
              :
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
          }
        </PopupDialog>
      )}
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    backgroundColor: 'black',
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  renderFooter: {
    paddingBottom: 90
  },
})


