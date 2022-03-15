import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  Pressable,
} from "react-native";
import {
  TextInput,
  IconButton,
  Button,
  Text,
  Avatar,
} from "react-native-paper";
import NumericInput from "react-native-numeric-input";
import AmountInput from "../components/AmountInput";
import * as ImagePicker from "expo-image-picker";
import ProductCard from "../components/ProductCard";
import PopupDialog from "../components/PopupDialog";
import { productApi, shoppingListApi } from "../api/api";
import { _getData } from "../utils/Functions";

const CreateListScreen = (props) => {
  // props
  const { navigation } = props;

  // states
  const [products, setProducts] = useState([]);

  const [title, setTitle] = useState("");
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
  const [titleError, setTitleError] = useState(false);
  const [user, setUser] = useState();
const ScreenName = props.route.name;
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerSaveButtonWrapper}>
          <Button mode="text" compact onPress={handleSaveShoppingList}>
            שמור
          </Button>
        </View>
      ),
    });
  }, [title, products]);

  useEffect(() => {
    if (productEditDetails) {
      setPopupDialogVisible(true);
    }
  }, [productEditDetails]);

  useEffect(() => {
    LoadUser()
  }, []);
  const LoadUser = async () => {
    let u = await _getData("User");
    console.log(u)
    if (u != null) {
      setUser(u);
    }
  };

  // מרנדר את המוצרים
  const renderListItem = (itemData) => (
    
    <ProductCard
      data={itemData.item}
      handleDeleteProduct={handleDeleteProduct}
      handleEditProduct={handleEditProduct}
      ScreenName={ScreenName}
      user={user}
    />
  );

  // פעולה אשר אחראית על החסרה/הוספה של כמות
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
      if (value !== 1000) value += 1;
    } else {
      if (value !== 1) value -= 1;
    }
    edit
      ? setProductEditDetails((oldState) => ({
        ...oldState,
        amount: value.toString(),
      }))
      : setAmount(value.toString());
  };

  // פעולה האחראית על שינוי הכמות דרך המקלדת
  const handleOnChangeAmount = (txt, edit) => {
    if (parseInt(txt) !== 0) {
      const amountRgx = /^[1-9]*([0-9]*)$/;
      if (!amountRgx.test(txt) || parseInt(txt) > 1000) {
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

  // בחירת תמונה מהגלריה
  const pickFromGallery = async (edit) => {
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
  };

  // הוספת מוצר למערך
  const handleAddProduct = () => {
    if (regexValidationProduct(false) < 2) {
      return;
    }
    let product = {
     productID: 1,
      creatorID:user.UserID,
      name: productName.trim(),
      amount: amount,
      imgUri : imageBase64,
      img     : imageUri
        ? imageUri
        :  API + `/uploads/shoppingLists/default/default_img.jpg`,
          };
    let tempProducts = [...products];
    if (tempProducts.length !== 0) {
      product.productID = (
        parseInt(tempProducts[tempProducts.length - 1].productID) + 1
      ).toString();
    }
    tempProducts = [...tempProducts, product];
    setProducts(tempProducts);
    handleClearStates();
  };

  const regexValidationProduct = (edit) => {
    let counter = 0;
    const amountRgx = /^[1-9]+$/;
    const nameRgx = /^[\u05D0-\u05EAa-zA-Z0-9']+([ |\-]*[\u05D0-\u05EAa-zA-Z0-9'\s]+){0,1}$/;
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

  // ניקוי שדות לאחר הוספת מוצר חדש
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

  const handleListEmptyComponent = () => {
    return (
      <View
        style={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>אין מוצרים</Text>
      </View>
    );
  };

  const handleEditProduct = (productDetails) => {
    setProductEditDetails(productDetails);
  };

  const handleDeleteProduct = (productID) => {
    let tempProducts = [...products];
    tempProducts = tempProducts.filter(
      (product) => product.productID !== productID
    );
    setProducts(tempProducts);
  };

  const handleCancelPopupDialog = () => {
    setPopupDialogVisible(false);
    setProductEditDetails();
  };

  const handleConfirmEdit = () => {
    if (regexValidationProduct(true) < 2) {
      return;
    }

    let tempProducts = [...products];
    console.log(tempProducts);

    let index = tempProducts.findIndex(
      (product) => product.productID === productEditDetails.productID
    );
    tempProducts[index] = productEditDetails;
    tempProducts[index].name = tempProducts[index].name.trim();

    setProducts(tempProducts);
    handleClearStates();
  };

  const handleSaveShoppingList = () => {
    if (regexValidationShoppingList() < 2) {
      console.log("handleSaveShoppingList error")
      return;
    }
    handleCreateShoppingListApi();
  };

  const handleCreateShoppingListApi = async () => {
    let newShoppingList = { creatorID: user.UserID, Title: title.trim() };

    try {
      const res = await shoppingListApi.apiShoppingListCreateShoppingListPost(newShoppingList)
      console.log("Id for Shopping list after created", res.data)
      updateNewShoppingList(res.data)
    } catch (error) {
      console.warn(error)
    }

  };

  const updateNewShoppingList = (id) => {
    let ProductsFromList = products;

    let productsToServer = [];
    for (let index = 0; index < ProductsFromList.length; index++) {
      productsToServer.push({
        listID: id,
        creatorID: user.UserID,
        name: ProductsFromList[index].name,
        amount: ProductsFromList[index].amount,
        img: ProductsFromList[index].imgUri,
      });
    }
    addProductsToShoppingList(productsToServer)
  };

  const addProductsToShoppingList = async (productsToServer) => {
    try {
      const res = await productApi.apiProductAddProductsToShoppingListPost(productsToServer)
      console.log(res.data)
      navigation.navigate('HomeScreen')
    } catch (error) {
      console.warn(error)
    }

  }

  const regexValidationShoppingList = () => {
    let counter = 0;
    const titleRgx =
      /^[\u05D0-\u05EAa-zA-Z0-9']+([ |\-|.|/]*[\u05D0-\u05EAa-zA-Z0-9'\s]+)*$/;
    if (products.length === 0) {
      console.log("didn't success");
    } else {
      console.log("success");
      counter++;
    }
    if (!titleRgx.test(title)) {
      setTitleError(true);
    } else {
      setTitleError(false);
      counter++;
    }
    return counter;
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="כותרת"
        value={title}
        onChangeText={(txt) => setTitle(txt)}
        dense={true}
        error={titleError}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={products}
        renderItem={(item) => renderListItem(item)}
        keyExtractor={(item) => String(item.productID)}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={handleListEmptyComponent}
      // ListFooterComponent={renderFooter}
      // refreshing={isFetching}
      // onRefresh={() => handleRefresh()}
      />
      <View
        style={{
          paddingVertical: 5,
          paddingHorizontal: 5,
          borderTopWidth: 2,
          borderColor: "black",
          backgroundColor: "#b1b1b1",
        }}
      >
        <View>
          <TextInput
            label="שם מוצר"
            value={productName}
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
          <View
            style={{
              width: "36%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              contentStyle={{ width: "100%" }}
              mode="contained"
              onPress={handleAddProduct}
            >
              הוספה
            </Button>
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
              amount={productEditDetails.amount}
              handlePlusMinusAmount={handlePlusMinusAmount}
              handleOnChangeAmount={handleOnChangeAmount}
            />
          </View>
          <View style={styles.editImageContainer}>
            <View style={styles.editImageWrapper}>
              <Avatar.Image
                size={100}
                // theme={{ colors: { primary: Colors.avatarBackground } }}
                source={{
                  uri: productEditDetails.img,
                }}
              />
            </View>
            <View style={styles.editImageIcon}>
              <TouchableHighlight
                onPress={null}
                underlayColor="white"
                style={styles.touchableProfileCameraAvatar}
              >
                <IconButton
                  style={{ backgroundColor: "grey" }}
                  icon="image-edit"
                  color="white"
                  size={20}
                  onPress={() => pickFromGallery(true)}
                />
              </TouchableHighlight>
            </View>
            <View style={styles.removeImageIcon}>
              <IconButton
                style={{ backgroundColor: "grey" }}
                icon="image-remove"
                color="white"
                size={20}
                onPress={() =>
                  setProductEditDetails((oldState) => ({
                    ...oldState,
                    img:
                      "https://media.istockphoto.com/vectors/no-image-available-sign-vector-id922962354?k=20&m=922962354&s=612x612&w=0&h=f-9tPXlFXtz9vg_-WonCXKCdBuPUevOBkp3DQ-i0xqo=",
                    ImageBase64: null,
                  }))
                }
              />
            </View>
          </View>
        </PopupDialog>
      )}
    </View>
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
});

export default CreateListScreen;
