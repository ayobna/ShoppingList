import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { TextInput, IconButton, Button, Text } from 'react-native-paper';
import NumericInput from 'react-native-numeric-input'
import AmountInput from '../components/AmountInput';

import {userApi} from '../api/api';


const CreateListScreen = (props) => {

  // props
  const { } = props;

  // states
  const [products, setProducts] = useState([
    { ProductID: 1, Name: "חלב", Amount: 5, Img: "https://octaegy.com/wp-content/uploads/2021/08/milk.jpg" },
    { ProductID: 2, Name: "חלב", Amount: 5, Img: "https://octaegy.com/wp-content/uploads/2021/08/milk.jpg" },
    { ProductID: 3, Name: "חלב", Amount: 5, Img: "https://octaegy.com/wp-content/uploads/2021/08/milk.jpg" },
    { ProductID: 4, Name: "חלב", Amount: 5, Img: "https://octaegy.com/wp-content/uploads/2021/08/milk.jpg" },
    { ProductID: 5, Name: "חלב", Amount: 5, Img: "https://octaegy.com/wp-content/uploads/2021/08/milk.jpg" },
    { ProductID: 6, Name: "חלב", Amount: 5, Img: "https://octaegy.com/wp-content/uploads/2021/08/milk.jpg" },
    { ProductID: 7, Name: "חלב", Amount: 5, Img: "https://octaegy.com/wp-content/uploads/2021/08/milk.jpg" },
    { ProductID: 8, Name: "חלב", Amount: 5, Img: "https://octaegy.com/wp-content/uploads/2021/08/milk.jpg" },
  ]);

  const [title, setTitle] = useState("");
  const [productName, setProductName] = useState("");
  const [amount, setAmount] = useState("1");
  const [imageBase64, setImageBase64] = useState();



  // מרנדר את המוצרים
  const renderListItem = (itemData) =>
  (
    <View style={{ paddingHorizontal: 10, paddingVertical: 35, margin: 10, borderColor: "black", borderRadius: 5, borderWidth: 1 }}>
      <Text>{itemData.item.Name}{itemData.item.ProductID}</Text>
    </View>
  );

  // פעולה אשר אחראית על החסרה/הוספה של כמות
  const handlePlusMinusAmount = (operation) => {
    console.log(userApi)
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
              onPress={() => console.log('Pressed')}
            />
          </View>
          <View style={{ width: "36%", justifyContent: "center", alignItems: "center" }}>
            <Button contentStyle={{ width: "100%" }} mode="contained" onPress={() => console.log('Pressed')}>
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