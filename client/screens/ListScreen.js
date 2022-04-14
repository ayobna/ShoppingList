import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import ProductCard from "../components/ProductCard";
import {
  TextInput,
  IconButton,
  Button,
  Text,
  Avatar,
} from "react-native-paper";
import AmountInput from "../components/AmountInput";
import * as ImagePicker from "expo-image-picker";
import PopupDialog from "../components/PopupDialog";
import { productApi, shoppingListApi, API } from "../api/api";
import { _getData } from "../utils/Functions";
import { HubConnectionBuilder } from "@microsoft/signalr";
import withCommonScreen from "../hoc/withCommonScreen";
import Spinner from "../components/Spinner";
import Colors from "../utils/Colors";

const ListScreen = (props) => {
  //props
  const { navigation, route, isPageLoaded, setIsPageLoadedTrue, setIsFetchingCondition, isFetching, isButtonSpinner, setIsButtonSpinnerCondition } = props;
  const ScreenName = props.route.name;
  const shoppingListID = route.params.shoppingListID;

  //states
  const [listCreatorId, setListCreatorId] = useState();
  const [products, setProducts] = useState();
  const [user, setUser] = useState({});
  const [productName, setProductName] = useState("");
  const [amount, setAmount] = useState("1");
  const [imageBase64, setImageBase64] = useState();
  const [imageUri, setImageUri] = useState();
  const [productEditDetails, setProductEditDetails] = useState();
  const [popupDialogVisible, setPopupDialogVisible] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [editAmountError, setEditAmountError] = useState(false);
  const [editNameError, setEditNameError] = useState(false);
  const [isDeleteProductDialogVisible, setIsDeleteProductDialogVisible] = useState(false);
  const [deleteProductData, setDeleteProductData] = useState();
  const [connection, setConnection] = useState();

  //veribales
  const amountMaxValue = 1000;
  const amountMinValue = 1;
  const validationAmount = 2;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      await loadUser();
      await getListCreatorByListID();
      setIsPageLoadedTrue();
    });
    return unsubscribe;
  }, [navigation, route]);

  useEffect(() => {
    const openConnection = async () => {
      await joinChat();
      setIsFetchingCondition(false);
    };
    openConnection();
  }, [])


  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      if (connection) {
        closeConnection(e);
      }
    });
    return unsubscribe;
  }, [navigation, connection]);


  useEffect(() => {
    if (productEditDetails) {
      setPopupDialogVisible(true);
    }
  }, [productEditDetails]);

  useEffect(() => {
    if (deleteProductData) {
      setIsDeleteProductDialogVisible(true);
    }
  }, [deleteProductData]);

  const getListCreatorByListID = async () => {
    let res = await shoppingListApi.apiShoppingListGetListCreatorByListIDIdGet(
      shoppingListID
    );
    setListCreatorId(res.data.creatorID);
  };

  const loadUser = async () => {
    let u = await _getData("User");
    if (u != null) {
      setUser(u);
    }
  };

  const joinChat = async () => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl(API + "/Products")
        .withAutomaticReconnect()
        .build();

      connection.on("ReceiveMessage", (products) => {
        setProducts(products);
      });

      connection.onclose((e) => {
        setProducts([]);
      });

      await connection.start();
      let listID = shoppingListID;

      let userID = user.userID;
      await connection.invoke("JoinRoom", { listID, userID });

      setConnection(connection);
    } catch (e) {
      console.log(e);
    }
  };

  const invokeNewProduct = async () => {
    try {
      await connection.invoke("NewProduct");
    } catch (e) {
      console.log(e);
    }
  };

  const invokeCheckedProduct = async (productID) => {
    try {
      await connection.invoke("CheckedProduct", productID);

    } catch (e) {
      console.log(e);
    }
  };

  const invokeUnCheckedProduct = async (productID) => {
    try {
      await connection.invoke("UnCheckedProduct", productID);

    } catch (e) {
      console.log(e);
    }
  };

  const closeConnection = async (e) => {
    try {
      await connection.stop();
      navigation.dispatch(e.data.action);
    } catch (e) {
      console.log(e);
    }
  };

  const handlePlusMinusAmount = (operation, edit) => {
    if (
      amount === "" ||
      (productEditDetails && productEditDetails.amount === "")
    ) {
      edit
        ? setProductEditDetails((oldState) => ({
          ...oldState,
          amount: "1",
        }))
        : setAmount("1");
      return;
    }
    let value = parseInt(edit ? productEditDetails.amount : amount);

    if (operation === "+") {
      if (value !== amountMaxValue) value += 1;
    } else {
      if (value !== amountMinValue) value -= 1;
    }
    edit
      ? setProductEditDetails((oldState) => ({
        ...oldState,
        amount: value.toString(),
      }))
      : setAmount(value.toString());
  };

  const handleOnChangeAmount = (txt, edit) => {
    const preventNumnerZero = 0;
    if (parseInt(txt) !== preventNumnerZero) {
      const amountRgx = /^[1-9]*([0-9]*)$/;
      if (!amountRgx.test(txt) || parseInt(txt) > amountMaxValue) {
        return;
      }
      edit
        ? setProductEditDetails((oldState) => ({
          ...oldState,
          amount: txt,
        }))
        : setAmount(txt);
    }
  };

  const pickFromGallery = async (edit) => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync(); // בקשת הרשאה לגלריה

      if (permissionResult.granted === false) {
        Alert.alert("יש צורך בהרשאת גלריה");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        base64: true,
        quality: 0.3,
      }); // הרצת הגלריה

      if (!result.cancelled) {
        if (edit) {
          setProductEditDetails((oldState) => ({
            ...oldState,
            img: result.uri,
            ImageBase64: result.base64,
          }));
        } else {
          setImageUri(result.uri);
          setImageBase64(result.base64);
        }
      }
    } catch (error) {
      console.log(error)
    }


  };

  const handleAddProduct = () => {

    if (regexValidationProduct(false) < validationAmount) {
      return;
    }
    setIsButtonSpinnerCondition(true);
    let product = {
      listID: shoppingListID,
      creatorID: user.userID,
      name: productName.trim(),
      amount: amount,
      img: imageBase64
    };
    addANewProductToTheList(product);

  };


  const addANewProductToTheList = async (newProductToList) => {
    try {
      await productApi.apiProductAddProductToShoppingListPost(
        newProductToList
      );
    } catch (e) {
      console.log(e);
    }

    await invokeNewProduct();
    handleClearStates();
    setIsButtonSpinnerCondition(false);
  };

  const regexValidationProduct = (edit) => {
    let counter = 0;
    const amountRgx = /^[1-9]+$/;
    // console.log("edit", edit);
    const nameRgx =
      /^[\u05D0-\u05EAa-zA-Z0-9']+([ |\-]*[\u05D0-\u05EAa-zA-Z0-9'\s]+){0,1}$/;
    if (!amountRgx.test(edit ? productEditDetails.amount : amount)) {
      edit ? setEditAmountError(true) : setAmountError(true);
    } else {
      edit ? setEditAmountError(false) : setAmountError(false);

      counter++;
    }
    if (!nameRgx.test(edit ? productEditDetails.name : productName)) {
      edit ? setEditNameError(true) : setNameError(true);
    } else {
      edit ? setEditNameError(false) : setNameError(false);
      counter++;
    }
    return counter;
  };

  const handleClearStates = () => {
    setProductName("");
    setAmount("1");
    setImageBase64();
    setImageUri();
    setProductEditDetails();
    setPopupDialogVisible(false);
    setAmountError(false);
    setEditAmountError(false);
    setNameError(false);
    setEditNameError(false);
  };

  const handleCancelPopupDialog = () => {
    setProductEditDetails();
    setDeleteProductData();
    setPopupDialogVisible(false);
    setIsDeleteProductDialogVisible(false);
  };

  const handleConfirmEdit = () => {
    if (regexValidationProduct(true) < validationAmount) {
      return;
    }
    let tempProduct = productEditDetails;
    tempProduct.name = tempProduct.name.trim();
    if (tempProduct.ImageBase64 === undefined) {
      updateProduct(tempProduct);
    } else {
      tempProduct.img = tempProduct.ImageBase64;
      updateProductNewImg(tempProduct);
    }

    handleClearStates();
  };

  const handleEditProduct = (product) => {
    console.log("product: ", product)
    setProductEditDetails(product);
  };

  const updateProduct = async (Product) => {

    await productApi.apiUpdateProductPost(Product);
    await invokeNewProduct();
  };

  const updateProductNewImg = async (Product) => {
    await productApi.apiUpdateProductNewImgPost(Product);
    await invokeNewProduct();
  };

  const checkProduct = async (productID, checked) => {
    if (checked) {
      await invokeCheckedProduct(productID);
    } else {
      await invokeUnCheckedProduct(productID);
    }
  };

  const handlePopupDialogDeleteProduct = (productToDelete) => {
    setDeleteProductData(productToDelete);
  };

  const handleDeleteProduct = async () => {
    await productApi.apiDeleteProductIdPost(deleteProductData.productID);
    await invokeNewProduct();
    handleCancelPopupDialog();
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

  const renderListItem = (itemData) => (
    <ProductCard
      data={itemData.item}
      handleDeleteProduct={handlePopupDialogDeleteProduct}
      handleEditProduct={handleEditProduct}
      ScreenName={ScreenName}
      user={user}
      listCreatorId={listCreatorId}
      checkProduct={checkProduct}
    />
  );

  return (
    isPageLoaded ?
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={products}
          renderItem={(item) => renderListItem(item)}
          keyExtractor={(item) => String(item.productID)}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={handleListEmptyComponent}
          refreshing={isFetching}
          onRefresh={() => { }}
        />
        <View
          style={{
            paddingVertical: 5,
            paddingHorizontal: 5,
            borderTopWidth: 1,
            borderColor: "#e1e1e1",
            backgroundColor: "#f1f1f1"
          }}
        >
          <View>
            <TextInput
              label="שם מוצר"
              value={productName}
              selectionColor="#919191"
              activeOutlineColor="#919191"
              style={{ backgroundColor: "#f1f1f1" }}
              onChangeText={(txt) => setProductName(txt)}
              dense={true}
              mode="outlined"
              error={nameError}
            />
          </View>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 5,
            }}
          >
            <View
              style={{
                width: "49%",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <Text>כמות: </Text>
              <AmountInput
                edit={false}
                isError={amountError}
                amount={amount}
                handlePlusMinusAmount={handlePlusMinusAmount}
                handleOnChangeAmount={handleOnChangeAmount}
              />
            </View>
            <View
              style={{
                width: "12%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconButton
                icon="image"
                size={25}
                onPress={() => pickFromGallery(false)}
              />
            </View>

            <View style={{ width: "36%", justifyContent: "center", alignItems: "center", }}>
              {
                isButtonSpinner ?
                  <View style={styles.btnSpinnerContainer}>
                    <Spinner smallSize="small" color="white" />
                  </View>
                  :
                  <Button
                    contentStyle={{ width: "100%" }}
                    color={Colors.our_dark_blue}
                    mode="contained"
                    onPress={handleAddProduct}
                  >
                    הוספה
                  </Button>
              }
            </View>
          </View>
        </View>

        {productEditDetails && (
          <PopupDialog
            title={"עריכת מוצר"}
            visible={popupDialogVisible}
            cancel={handleCancelPopupDialog}
            confirm={handleConfirmEdit}
          >
            <TextInput
              label="שם מוצר"
              value={productEditDetails.name}
              selectionColor="#919191"
              activeOutlineColor="#919191"
              style={{ backgroundColor: "white" }}
              onChangeText={(txt) =>
                setProductEditDetails((oldstate) => ({
                  ...oldstate,
                  name: txt,
                }))
              }
              dense={true}
              error={editNameError}
              mode="outlined"
            />
            <View
              style={{
                marginTop: 15,
                justifyContent: "flex-start",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Text>כמות: </Text>
              <AmountInput
                isError={editAmountError}
                edit={true}
                amount={productEditDetails.amount.toString()}
                handlePlusMinusAmount={handlePlusMinusAmount}
                handleOnChangeAmount={handleOnChangeAmount}
              />
            </View>
            <View style={styles.editImageContainer}>
              <View style={styles.editImageWrapper}>
                <Avatar.Image
                  theme={{ colors: { primary: "white" } }}
                  size={100}
                  source={{
                    uri:
                      productEditDetails.ImageBase64 === undefined
                        ? API + `/uploads/shoppingLists/` + productEditDetails.img
                        : productEditDetails.img,
                  }}
                />
              </View>
              <View style={styles.editImageIcon}>
                <IconButton
                  style={{ backgroundColor: Colors.our_dark_blue }}
                  icon="image-edit"
                  color="white"
                  size={20}
                  onPress={() => pickFromGallery(true)}
                />
              </View>
              <View style={styles.removeImageIcon}>
                <IconButton
                  style={{ backgroundColor: Colors.our_dark_blue }}
                  icon="image-remove"
                  color="white"
                  size={20}
                  onPress={() =>
                    setProductEditDetails((oldState) => ({
                      ...oldState,
                      img: `default/default_img.jpg`,
                      ImageBase64: undefined,
                    }))
                  }
                />
              </View>
            </View>
          </PopupDialog>
        )}
        {
          deleteProductData &&
          <PopupDialog
            title={"מחיקת מוצר"}
            visible={isDeleteProductDialogVisible}
            cancel={handleCancelPopupDialog}
            confirm={handleDeleteProduct}
          >
            <Text>האם את/ה בטוח/ה שברצונך למחוק את המוצר "{deleteProductData.name}"</Text>
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
  },
  flatListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  editImageContainer: {
    alignItems: "center",
    marginTop: 15,
  },
  editImageWrapper: {
    borderWidth: 2,
    borderRadius: 100,
    borderColor: "black",
  },
  editImageIcon: {
    position: "absolute",
    top: 0,
    left: 150,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageIcon: {
    position: "absolute",
    top: 65,
    left: 95,
    right: -40,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  touchableImageWrapper: {
    borderRadius: 50,
  },
  headerSaveButtonWrapper: {
    marginRight: 5,
  },
  btnSpinnerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.our_dark_blue,
    padding: 8,
    borderRadius: 5,
    width: "78%",
  }
});

export default withCommonScreen(ListScreen, 'ListScreen');
