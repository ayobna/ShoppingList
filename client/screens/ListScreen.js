import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableHighlight, StyleSheet } from "react-native";
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
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
const ListScreen = (props) => {
  const { navigation, route } = props;

  const ScreenName = props.route.name;
  const shoppingListID = route.params.shoppingListID;

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

  const [fromDB, setFromDB] = useState(true);
  const [connection, setConnection] = useState();

  useEffect(() => {    
    const unsubscribe = navigation.addListener("focus",  async() => {
      setConnection()
  await   LoadUser(); 
  //  await  GetProducts();
  await GetListCreatorByListID();    
   //await   joinChat()
    });
    return unsubscribe;
  },[navigation, route]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", async () => {});
    return unsubscribe;
  }, [route]);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("beforeRemove", (e) => {
  //   //  e.preventDefault();
  //     if (connection) {
  //       closeConnection(e);
  //     }
  //   });
  //   return unsubscribe;
 // }, [navigation, connection]);

 const closeConnection = async (e) => {
    try {
      await connection.stop();
      console.log("closeConnection");
      setConnection()
     navigation.dispatch(e.data.action);
    } catch (e) {
      console.log(e);
    }
  };
  // const GetProducts = async () => {
  //   let res = await productApi.apiGetProductsByListIdIdGet(shoppingListID);
  //   let data = res.data;
  //   await GetListCreatorByListID();    
  //   setProducts(data);
  // };
  const GetListCreatorByListID = async () => {
    let res = await shoppingListApi.apiShoppingListGetListCreatorByListIDIdGet(
      shoppingListID
    );
    console.log("res.data.creatorID", res.data.creatorID);
    setListCreatorId(res.data.creatorID);
    // console.log(res.data);
  };
  const LoadUser = async () => {
    let u = await _getData("User");
    if (u != null) {
      setUser(u);
      console.log(u)
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
        setConnection();
        setMessages([]);
      });

      await connection.start();
      let listID = shoppingListID;
     
      let userID =user.UserID;
      await connection.invoke("JoinRoom", { listID, userID });

      setConnection(connection);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (productEditDetails) {
     
      setPopupDialogVisible(true);
    }
  }, [productEditDetails]);


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

  const handleAddProduct = () => {
    if (regexValidationProduct(false) < 2) {
      return;
    }
    let product = {
      listId:shoppingListID,
      productID: 0,
      creatorID: user.UserID,
      name: productName.trim(),
      amount: amount,
      imgUri: imageBase64,
      img: imageUri ? imageUri : `default/default_img.jpg`,
    };
    NewProductToTheList(product);
    setFromDB(false);
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
  const NewProductToTheList = (product) => {
    console.log( "NewProductToTheList ===>");
    let newProductToList={
      listID: product.listId,
      creatorID: product.creatorID,
      name:product.name,
      amount:product.amount,
      img:product.imgUri===undefined?product.img :product.imgUri,
    }
    addANewProductToTheList(newProductToList)
  
  };
const  addANewProductToTheList =async(newProductToList)=>{
let res =await productApi.apiProductAddProductToShoppingListPost(newProductToList)
 console.log("Add new product to server is ", res.data);
  await invokeNewProduct();
};

 const invokeNewProduct=async()=> {
  try {
    await connection.invoke("NewProduct");

  } catch (e) {
    console.log(e);
  }
}
  const regexValidationProduct = (edit) => {
    let counter = 0;
    const amountRgx = /^[1-9]+$/;
    console.log("edit", edit);
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

    setPopupDialogVisible(false);
    setProductEditDetails();
  };

  const handleConfirmEdit = () => {
    if (regexValidationProduct(true) < 2) {
      return;
    }
    let  tempProduct = productEditDetails;
    tempProduct.name = tempProduct.name.trim();
    if(tempProduct.ImageBase64===undefined){
      updateProduct(tempProduct)
   
    }else{
      tempProduct.img=tempProduct.ImageBase64
      updateProductNewImg(tempProduct)
    }
 



    handleClearStates();
  };

  const handleEditProduct = (shoppingList) => {
    setProductEditDetails(shoppingList)
 };

  const updateProduct=async(Product)=>{
    let res = await productApi.apiUpdateProductPost(Product)
    let data= res.data
    console.log( "apiUpdateProductPost data",data)
  await  invokeNewProduct()
  }
   const updateProductNewImg=async(Product)=>{
    let res = await productApi.apiUpdateProductNewImgPost(Product)
    let data= res.data
    console.log( "updateProductNewImg data",data)
    await  invokeNewProduct()
  }




  

  const handleDeleteProduct =async (productID) => {   
    let res = await productApi.apiDeleteProductIdPost(productID)
    let data=res.data
    console.log("handleDeleteProduct ",data)
    GetProducts()
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
      handleDeleteProduct={handleDeleteProduct}
      handleEditProduct={handleEditProduct}
      ScreenName={ScreenName}
      user={user}
      FromDB={fromDB}
      listCreatorId={listCreatorId}
    />
  );

  return (
    <View style={styles.container}>
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
              amount={productEditDetails.amount.toString()}
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
                  uri: productEditDetails.ImageBase64===undefined?  API + `/uploads/shoppingLists/`+  productEditDetails.img:productEditDetails.img,
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
                    img: API + `/uploads/shoppingLists/default/default_img.jpg`,
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

export default ListScreen;


