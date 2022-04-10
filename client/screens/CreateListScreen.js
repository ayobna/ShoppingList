import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { TextInput, IconButton, Button, Text, Avatar, Snackbar } from "react-native-paper";
import AmountInput from "../components/AmountInput";
import * as ImagePicker from "expo-image-picker";
import ProductCard from "../components/ProductCard";
import PopupDialog from "../components/PopupDialog";
import { productApi, shoppingListApi, API } from "../api/api";
import { _getData } from "../utils/Functions";
import withCommonScreen from "../hoc/withCommonScreen";
import Spinner from "../components/Spinner";
import Colors from "../utils/Colors";

const CreateListScreen = (props) => {
  // props
  const {
    navigation,
    isPageLoaded,
    setIsPageLoadedTrue,
    isButtonSpinner,
    setIsButtonSpinnerFalse,
    setIsButtonSpinnerTrue,
    snackBarDetails,
    setSnackBar
  } = props;

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
  
  //veribales
  const amountMaxValue = 1000;
  const amountMinValue = 1;




  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerSaveButtonWrapper}>
          {
            isButtonSpinner ?
              <View style={styles.btnSpinnerContainer}>
                <Spinner smallSize="small" color="white" />
              </View>
              :
              <Button color="white" mode="text" compact onPress={handleSaveShoppingList}>
                שמור
              </Button>
          }
        </View>
      ),
    });
  }, [title, products, isButtonSpinner]);

  useEffect(() => {
    if (productEditDetails) {
      setPopupDialogVisible(true);
    }
  }, [productEditDetails]);

  useEffect(() => {
    const init = async () => {
      await loadUser();
      setIsPageLoadedTrue();
    };
    init();
  }, []);

  const loadUser = async () => {
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
      listCreatorId={0}
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

  // פעולה האחראית על שינוי הכמות דרך המקלדת
  const handleOnChangeAmount = (txt, edit) => {
    if (parseInt(txt) !== 0) {
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

  // בחירת תמונה מהגלריה
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

  // הוספת מוצר למערך
  const handleAddProduct = () => {
    if (regexValidationProduct(false) < 2) {
      return;
    }
    let product = {
      productID: 1,
      creatorID: user.userID,
      name: productName.trim(),
      amount: amount,
      imgUri: imageBase64,
      img: imageUri
        ? imageUri
        : API + `/uploads/shoppingLists/default/default_img.jpg`,
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
    setIsButtonSpinnerTrue();
    handleCreateShoppingListApi();
  };

  const handleCreateShoppingListApi = async () => {

    let newShoppingList = { creatorID: user.userID, Title: title.trim() };
    console.log("newShoppingList create screen", newShoppingList)
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
        creatorID: user.userID,
        name: ProductsFromList[index].name,
        amount: ProductsFromList[index].amount,
        img: ProductsFromList[index].imgUri, // image uri = base64
      });
    }
    addProductsToShoppingList(productsToServer)
  };

  const addProductsToShoppingList = async (productsToServer) => {
    console.log("productsToServer", productsToServer)
    try {
      const res = await productApi.apiProductAddProductsToShoppingListPost(productsToServer);
      console.log(res.data)
      navigation.navigate('Home', {
        screen: 'HomeScreen',
        params: {
          snackBar: { visible: true, duration: 3000, message: "יצירת הרשימה בוצעה בהצלחה!", color: "green", timeStamp: new Date().getMilliseconds() },
        },
      });

    } catch (error) {
      console.warn(error)
    }

  }

  const regexValidationShoppingList = () => {
    let counter = 0;
    const titleRgx =
      /^[\u05D0-\u05EAa-zA-Z0-9']+([ |\-|.|/]*[\u05D0-\u05EAa-zA-Z0-9'\s]+)*$/;
    if (products.length === 0) {
      setSnackBar({ visible: true, duration: 3000, message: "לא ניתן ליצור רשימה ללא מוצרים!", color: "#990f02", timeStamp: new Date().getMilliseconds() })
    } else {
      setSnackBar();
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
    isPageLoaded ?
      <View style={styles.container}>
        <TextInput
          placeholder="כותרת"
          theme={{ colors: { primary: "#919191" } }}
          value={title}
          selectionColor="#919191"
          activeOutlineColor="#919191"
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
              onChangeText={(txt) => setProductName(txt)}
              selectionColor="#919191"
              activeOutlineColor="#919191"
              style={{ backgroundColor: "#f1f1f1" }}
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
                color={Colors.our_dark_blue}
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
                amount={productEditDetails.amount}
                handlePlusMinusAmount={handlePlusMinusAmount}
                handleOnChangeAmount={handleOnChangeAmount}
              />
            </View>
            <View style={styles.editImageContainer}>
              <View style={styles.editImageWrapper}>
                <Avatar.Image
                  size={100}
                  theme={{ colors: { primary: "white" } }}
                  source={{
                    uri: productEditDetails.img,
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
                      img:
                        API + `/uploads/shoppingLists/default/default_img.jpg`,
                      ImageBase64: null,
                    }))
                  }
                />
              </View>
            </View>
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
    backgroundColor: Colors.our_dark_blue,
    padding: 8,
    borderRadius: 5
  }
});

export default withCommonScreen(CreateListScreen, "CreateListScreen");
