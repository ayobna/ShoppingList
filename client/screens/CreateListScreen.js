import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { TextInput, IconButton, Button, Text } from 'react-native-paper';
import NumericInput from 'react-native-numeric-input'
import AmountInput from '../components/AmountInput';
import * as ImagePicker from 'expo-image-picker';
import ProductCard from '../components/ProductCard';



const CreateListScreen = (props) => {

  // props
  const { } = props;

  // states
  const [products, setProducts] = useState([]);

  const [title, setTitle] = useState("");
  const [productName, setProductName] = useState("");
  const [amount, setAmount] = useState("1");
  const [imageBase64, setImageBase64] = useState();
  const [imageUri, setImageUri] = useState();




  // מרנדר את המוצרים
  const renderListItem = (itemData) =>
  (
    <ProductCard data={itemData.item} handleDeleteProduct={handleDeleteProduct} />
  );

  // פעולה אשר אחראית על החסרה/הוספה של כמות
  const handlePlusMinusAmount = (operation) => {
    if (amount === "") {
      setAmount("1");
      return
    }
    let value = parseInt(amount);

    if (operation === "+") {
      if (value !== 1000)
        value += 1;

    } else {
      if (value !== 1)
        value -= 1;
    }
    setAmount(value.toString());
  };

  // פעולה האחראית על שינוי הכמות דרך המקלדת
  const handleOnChageAmount = (txt) => {
    if (parseInt(txt) !== 0) {
      const courseNameRgx = /^[1-9]*([0-9]*)$/;
      if (!courseNameRgx.test(txt) || parseInt(txt) > 1000) {
        return;
      }
      setAmount(txt);
    }

  };

  // בחירת תמונה מהגלריה
  const pickFromGallery = async () => {

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync(); // בקשת הרשאה לגלריה

    if (permissionResult.granted === false) {
      Alert.alert("יש צורך בהרשאת גלריה");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.3 });  // הרצת הגלריה

    if (!result.cancelled) {
      setImageUri(result.uri);
      setImageBase64(result.base64);
    }
  }

  // הוספת מוצר למערך
  const handleAddProduct = () => {
    //************************************* צריך לעשות בדיקות ולידציה */
    let product = { ProductID: 1, Name: productName, Amount: amount, ImgUri: imageUri, ImageBase64: imageBase64 }
    let tempProducts = [...products];
    if (tempProducts.length !== 0) {
      product.ProductID = (parseInt(tempProducts[tempProducts.length - 1].ProductID) + 1).toString();
    }
    tempProducts = [...tempProducts, product];
    setProducts(tempProducts);
    handleClearStates();
  };

  // ניקוי שדות לאחר הוספת מוצר חדש
  const handleClearStates = () => {
    setProductName("");
    setAmount("1");
    setImageBase64();
    setImageUri();
  };

  const handleListEmptyComponent = () => {
    return (
      <View style={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>אין מוצרים</Text>
      </View>
    );
  };

  const handleDeleteProduct = (productID) => {
    let tempProducts = [...products];
    tempProducts = tempProducts.filter(product => product.ProductID !== productID);
    setProducts(tempProducts);
  };


  console.log(products);
  return (
    <View style={styles.container}>
      <TextInput
        placeholder='כותרת...'
        value={title}
        onChangeText={(txt) => setTitle(txt)}
        dense={true}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={products}
        renderItem={(item) => renderListItem(item)}
        keyExtractor={(item) => String(item.ProductID)}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={handleListEmptyComponent}
      // ListFooterComponent={renderFooter}
      // refreshing={isFetching}
      // onRefresh={() => handleRefresh()}
      />
      <View style={{ paddingVertical: 5, paddingHorizontal: 5, borderTopWidth: 2, borderColor: "black", backgroundColor: "#b1b1b1" }}>
        <View>
          <TextInput
            placeholder='שם מוצר...'
            value={productName}
            onChangeText={(txt) => setProductName(txt)}
            dense={true}
            mode="outlined"
          />
        </View>
        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
          <View style={{ width: "49%", justifyContent: "center", alignItems: "center", flexDirection: "row", justifyContent: "space-around" }}>
            <Text>כמות: </Text>
            <AmountInput amount={amount} handlePlusMinusAmount={handlePlusMinusAmount} handleOnChageAmount={handleOnChageAmount} />

          </View>
          <View style={{ width: "12%", justifyContent: "center", alignItems: "center" }}>
            <IconButton
              icon="image"
              size={25}
              onPress={pickFromGallery}
            />
          </View>
          <View style={{ width: "36%", justifyContent: "center", alignItems: "center" }}>
            <Button contentStyle={{ width: "100%" }} mode="contained" onPress={handleAddProduct}>
              הוספה
            </Button>
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1

  },
  flatListContent: {
    flexGrow: 1,
    justifyContent: 'center'
  },
});

export default CreateListScreen;