import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { productApi } from "../api/api";
import ProductCard from "../components/ProductCard";
import { _getData } from "../utils/Functions";
const ListScreen = (props) => {
  const { navigation, route } = props;

  const ScreenName = props.route.name;
  const [products, setProducts] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    LoadUser();
    const unsubscribe = navigation.addListener("focus", async () => {
      GetProducts();

    });
    return unsubscribe;
  }, [route]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", async () => {});
    return unsubscribe;
  }, [route]);
  const GetProducts = async () => {
    let res = await productApi.apiGetProductsByListIdIdGet(
      route.params.shoppingListID
    );
    let data = res.data;
    setProducts(data);
  
  };
  const LoadUser = async () => {
    let u = await _getData("User");
    console.log(u)
    if (u != null) {
      setUser(u);
    }
  };

  const handleEditProduct = (productDetails) => {
    console.log("handleEditProduct=> productDetails:", productDetails);
 
  };

  const handleDeleteProduct = (productID) => {
    console.log("handleDeleteProduct=>productID: ", productID);

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
    />
  );

  return (
    <View>
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
    </View>
  );
};

export default ListScreen;
